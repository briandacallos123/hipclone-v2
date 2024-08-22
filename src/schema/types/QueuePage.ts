import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { DoctorAppointments } from './DoctorAppointments';
import { Clinics } from './ClinicSched'
import { DoctorTransactionObject } from './DoctorAppointments';

const CountType = objectType({
  name: 'CountType',
  definition(t) {
    t.int('queueCount');
    t.int('queueDone');
    t.int('queueCancelled');
  },
});

export const QueueCountInp = inputObjectType({
  name: 'QueueCountInp',
  definition(t) {
    t.nullable.string('uuid');
    t.nullable.string('userType');
  },
});

export const QueueReadCountPage = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueueReadCountPage', {
      type: CountType,
      args: { data: QueueCountInp! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;
        const { uuid }: typeof data = data;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`appointments`', 'TodaysDone');

        // for done
        const checkUser = (() => {
          if (args?.data!.userType === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);

        try {

          const [queueAll, queueDone, queueCancelled]: any = await client.$transaction([
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                NOT: [{ time_slot: null }, { patientInfo: null }],

                status: 1,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward
                },
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
            }),
            client.appointments.findMany({
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                // type: 1,
                status: 3,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward
                },
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
            }),
            client.appointments.findMany({
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                // type: 1,
                status: 2,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward
                },
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
            }),
          ]);


          return {
            queueCount: queueAll?.length,
            queueDone: queueDone?.length,
            queueCancelled: queueCancelled?.length,
          };
        } catch (error) {
          throw new GraphQLError(error)
        }
      },
    });
  },
});

export const queue_data = objectType({
  name: "queue_data",
  definition(t) {
    t.nullable.list.field('appointments_data', {
      type: DoctorAppointments
    }),
    // t.nullable.list.field('notTodaySchedule', {
    //   type:DoctorAppointments
    // })
      t.boolean('is_paid')
    t.int('position');
    t.nullable.field('hasSessionNotStarted',{
      type:DoctorAppointments
    });
    t.nullable.field('otherApptList',{
      type:DoctorTransactionObject,
      resolve(_root){

        return {
          appointments_data:_root?.otherApptList
        } 
      }
    })
    t.boolean('is_not_today')
    t.dateTime('startingTime');
    t.boolean('notStarted')
    t.boolean('is_done')
    t.boolean('is_ongoing');
    t.boolean('done_session');

    t.int('notApproved')
    t.nullable.field('notAppNotToday', {
      type: DoctorAppointments
    });
  },
})

export const QueuePatientInp = inputObjectType({
  name: "QueuePatientInp",
  definition(t) {
    t.nullable.string("voucherCode")
    t.nullable.int('take');
    t.nullable.int('skip');

    // t.nullable.string('uuid')
  }
})
const dateIntervalChecker = (item: any, patient:any,notToday:any) => {
  let newData: any = [];
  let patientSession:any;
  let hasTodaySchedule:any;
  let notStarted:any;
  let doneSession:any;
  let isOngoing:any;
  let startingTime:any;


  item?.forEach((data: any) => {
    // Check if time_slot and e_time are strings, if not, convert them to ISO strings
    const timeSlotUTC = typeof data?.time_slot === 'string' ? data?.time_slot : data?.time_slot.toISOString();
    const endTimeUTC = typeof data?.e_time === 'string' ? data?.e_time : data?.e_time.toISOString();

    // Get the current date and time
    const currentDateTime = new Date();

    // Get today's date as a string in the format YYYY-MM-DD
    const todayDateStr = currentDateTime.toISOString().split('T')[0];

    // Extract time components from the time slot and end time
    const timeSlotTime = new Date(timeSlotUTC).toISOString().split('T')[1];
    const endTime = new Date(endTimeUTC).toISOString().split('T')[1];

    // Create Date objects for the start and end times on the current day
    const startDateTimeUTC = new Date(`${todayDateStr}T${timeSlotTime}`);
    const endDateTimeUTC = new Date(`${todayDateStr}T${endTime}`);

    const phDate = new Date(currentDateTime.getTime() + (8 * 60 * 60 * 1000));


    // Check if the current date and time is within the interval
    const isWithinInterval = phDate >= startDateTimeUTC && phDate <= endDateTimeUTC;

    if (!notToday && isWithinInterval && data?.patientID === Number(patient?.S_ID)) {
      isOngoing = true;
      newData.push(data);
    }
    if(!notToday && data?.patientID === Number(patient?.S_ID) && phDate <= startDateTimeUTC){
      notStarted = true;
      startingTime = data?.time_slot;
    }
    
    if(!notToday && data?.patientID === Number(patient?.S_ID) && phDate > endDateTimeUTC){
      doneSession = true;
    }if(notToday){
      newData.push(data);

    }
  });

  newData?.forEach((item:any)=>{
    if(item?.patientID === patient?.S_ID){
      patientSession = true;
    }
  })
  return {newData, patientSession, notStarted, doneSession, isOngoing, startingTime}
}



export const QueuePatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueuePatient', {
      type: queue_data,
      args: { data: QueuePatientInp! },
      async resolve(_root, args, ctx) {

        try {
          const { voucherCode, take, skip}: any = args?.data
          const { session } = ctx;

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          const formattedDateAsDate = new Date(formattedDate);

          const currentDateBackward = new Date();
          currentDateBackward.setHours(23, 59, 59, 59);

          const appt = await client.appointments.findFirst({
            where: {
              voucherId: voucherCode
            }
          })


          const patient = await client.patient.findFirst({
            where: {
              S_ID: Number(appt?.patientID)
            }
          })




          // get clinic based on id of clinic on appt
          const clinicInfo = await client.clinic.findFirst({
            where: {
              id: Number(appt?.clinic)
            }
          })

          const notApprovedNotToday = await client.appointments.findFirst({
            where: {
              isDeleted: 0,
              status: {
                not: 1
              },
              voucherId: voucherCode,
              clinicInfo: {
                uuid: clinicInfo?.uuid,
                isDeleted: 0,
                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              // pag walang laman yung notApproved, means ang data ay not approved and not today.

              // date: {
              //   gte: formattedDateAsDate,
              //   lte: currentDateBackward,
              // },

            },
            include: {
              patientInfo: true,
              clinicInfo: true
            }

          })


          const notApproved = await client.appointments.findFirst({
            where: {
              isDeleted: 0,
              status: {
                not: 1
              },
              voucherId: voucherCode,
              clinicInfo: {
                uuid: clinicInfo?.uuid,
                isDeleted: 0,
                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                lte: currentDateBackward,
              },

            },
            select: {
              status: true
            }
          })



          const isDoneAppt = await client.appointments.findMany({
            where: {
              isDeleted: 0,
              status: 1,
              voucherId: voucherCode,
              clinicInfo: {
                uuid: clinicInfo?.uuid,
                isDeleted: 0,
                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                lt: formattedDateAsDate,
              },

            },
            include: {
              clinicInfo: true,
            }
          })


          // ito yung checker kung yung voucher ni patient ay valid at naka schedule today.
          //  kapag walang laman, means hindi naka schedule ngayon.
          const isToday = await client.appointments.findMany({
            where: {
              isDeleted: 0,
              status: 1,
              voucherId: voucherCode,
              clinicInfo: {
                uuid: clinicInfo?.uuid,
                isDeleted: 0,
                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                lte: currentDateBackward,
              },

            },
            include: {
              clinicInfo: true,
            }
          })


          const clinicResult = await client.appointments.findMany({
            take,
            skip,
            where: {
              isDeleted: 0,
              status: 1,
              patientID: Number(session?.user?.s_id),
              NOT:{
                voucherId:voucherCode
              },
              clinicInfo: {
                isDeleted: 0,
                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                // lte: currentDateBackward,
              },
  
            },
            include: {
              clinicInfo: true,
            }
          })


          console.log(clinicResult,'AWUTTTTTTTTTTTTTTTTTTTTT')

          const [result, resultFirst]: any = await client.$transaction([
            client.appointments.findMany({
              where: {
                isDeleted: 0,
                status: 1,
                clinicInfo: {
                  uuid: clinicInfo?.uuid,
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },

              },
              include: {
                clinicInfo: true,
              },
              orderBy: {
                appr_date: 'asc'
              }
            }),
            client.appointments.findMany({
              where: {
                isDeleted: 0,
                status: 1,
                clinicInfo: {
                  uuid: clinicInfo?.uuid,
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                },

              },
              include: {
                clinicInfo: true,
              },
              orderBy: {
                appr_date: 'asc'
              }
            })
          ])

          const position = (resultFirst?.length ? resultFirst : result).map(async (it: any) => {
            return await client.patient.findFirst({
              where: {
                S_ID: Number(it?.patientID)
              }
            })
          })

          const teka = await Promise.all(position);

          const patientPos = teka.findIndex((item: any) => item.EMAIL === patient?.EMAIL)

          const haveSchedButNotToday = () => {
            if (isToday?.length === 0 && resultFirst?.length !== 0) {
              return true
            } else {
              return false
            }
          }
          // console.log(result,'resultresultresultresultresultresult')

        

          const {newData,isOngoing, patientSession, notStarted, doneSession, startingTime} = resultFirst?.length ? dateIntervalChecker(resultFirst, patient, haveSchedButNotToday()) : dateIntervalChecker(result, patient, haveSchedButNotToday())

          return {
            appointments_data: newData,
            position: patientSession && 1,
            is_not_today: haveSchedButNotToday(),
            is_done: isDoneAppt?.length !== 0,
            is_paid: (Number(appt?.payment_status) === 1 || (appt?.hmo !== null && appt?.hmo !== 's:0:"";')),
            notStarted,
            done_session:doneSession,
            is_ongoing:isOngoing,
            startingTime,
            otherApptList:clinicResult,
            notApproved: (() => {
              if (Number(notApproved?.status) === 0) {
                return 4
              } else {
                return notApproved?.status
              }
            })(),
            notAppNotToday: (() => {
              if (Number(notApprovedNotToday?.status) === 0) {
                return {
                  ...notApprovedNotToday,
                  status: 4
                }
              } else {
                return notApprovedNotToday
              }
            })
          }
        } catch (err) {
          console.log(err, '__ERORR')
        }

      }
    })
  }
})


export const QueueClinicInp = inputObjectType({
  name: "QueueClinicInp",
  definition(t) {
    t.nonNull.int('take');
    t.nonNull.int('skip');
    t.nullable.string('apptCode');
  },
})

export const QueueGetClinicOfPatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueueGetClinicOfPatient', {
      type: DoctorTransactionObject,
      args: { data: QueueClinicInp! },
      async resolve(_root, args, ctx) {

        const { session } = ctx;

        const { take, skip, apptCode }: any = args?.data


        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);

        const result = await client.appointments.findMany({
          take,
          skip,
          where: {
            isDeleted: 0,
            status: 1,
            patientID: Number(session?.user?.s_id),
            NOT:{
              voucherId:apptCode
            },
            clinicInfo: {
              isDeleted: 0,
              NOT: [{ clinic_name: null }, { clinic_name: '' }],
            },
            date: {
              gte: formattedDateAsDate,
              // lte: currentDateBackward,
            },

          },
          include: {
            clinicInfo: true,
          }
        })

        return {
          appointments_data: result
        }


      }
    })
  }
})