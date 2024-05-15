import { extendType, inputObjectType, list, objectType } from 'nexus';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
// import { unserialize } from 'php-serialize';
import beamsClient from './beams'
// export const HMOObj = objectType({
//   name: 'HMOObj',
//   definition(t) {
//     t.id('id');
//     t.string('name');
//   },
// });

const Appointments = objectType({
  name: 'Appointments',
  definition(t) {
    t.int('id');

    t.dateTime('date');
    t.dateTime('time_slot');
    t.int('payment_status');
    t.int('type');
    t.int('status');
    t.string('remarks');
    t.int('payment_status');
    t.field('patientInfo', {
      type: patientInfo,
    });
    t.field('doctorInfo', {
      type: doctorInfoType,
    });
    t.field('clinicInfo', {
      type: clinicInfo,
    });

    t.list.field('symptoms', {
      type: 'String',
      async resolve(parent: any, _args, _ctx) {
        const type: any = parent?.symptoms;
        let data: any = [];
        data = unserialize(type);
        // console.log(data, 'type@@');
        // if (type) {
        //   data = unserialize(type);
        // }

        return data ? data.map((v: any) => String(v)) : [];
      },
    });
  },
});

export const SymptomsObj = objectType({
  name: 'SymptomsObj',
  definition(t) {
    t.string('name');
  },
});

const patientInfo = objectType({
  name: 'patientInfo',
  definition(t) {
    t.int('EMPID');
    t.string('FNAME');
    t.string('LNAME');
    t.string('HOME_ADD');
    t.string('OCCUPATION');
    t.string('EMAIL');
    t.int('SEX');
    t.id('S_ID');
    t.int('IDNO');
  },
});
const clinicInfo = objectType({
  name: 'clinicInfo',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('location');
  },
});

const doctorInfoType = objectType({
  name: 'doctorInfoType',
  definition(t) {
    t.id('EMP_ID');
    t.nullable.string('EMP_FULLNAME');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('CONTACT_NO');
    t.nullable.string('EMP_EMAIL');
    t.nullable.string('FEES');
    t.nullable.string('MEDCERT_FEE'); //  = 1
    t.nullable.string('MEDCLEAR_FEE'); //  = 2
    t.nullable.string('MEDABSTRACT_FEE'); //  = 3
  },
});

export const Appointments_Type = objectType({
  name: 'Appointments_Type',
  definition(t) {
    t.nullable.list.field('Appointments', {
      type: Appointments,
    });
    t.nullable.field('summary', {
      type: summaryObj,
    });
  },
});

const summaryObj = objectType({
  name: 'summaryObj',
  definition(t) {
    t.int('totalRecords');
    t.int('male');
    t.int('female');
    t.int('total');
    // t.string('unspecified');
  },
});

const AppointmentUpdate = inputObjectType({
  name: 'AppointmentUpdate',
  definition(t) {
    t.nullable.int('type');
    t.nullable.int('status');
    t.nullable.int('payment_status');
    t.nullable.string('remarks');
    t.nullable.int('id');
  },
});

const AppointmentUpdateMultitple = inputObjectType({
  name: 'AppointmentUpdateMultitple',
  definition(t) {
    t.nonNull.list.field('id', { type: 'Int' });
    t.nonNull.string('type');
  },
});

const Appointments_Inputs = inputObjectType({
  name: 'Appointments_Inputs',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.int('status');
    t.nullable.string('searchKeyword');
  },
});
export const GET_ALL_APPOINTMENTS = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.nullable.field('GET_ALL_APPOINTMENTS', {
      type: Appointments_Type,
      args: { data: Appointments_Inputs! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;

        // let order: any;

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'GET_ALL_APPOINTMENTS'
        );

        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            {
              order = [
                {
                  patientInfo: {
                    FNAME: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'hospital':
            {
              order = [
                {
                  clinicInfo: {
                    clinic_name: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'date':
            {
              order = [{ date: args?.data!.orderDir }];
            }
            break;
          case 'isPaid':
            {
              order = [{ payment_status: args?.data!.orderDir }];
            }
            break;
          case 'type':
            {
              order = [{ type: args?.data!.orderDir }];
            }
            break;

          default: {
            order = [
              {
                id: 'desc',
              },
            ];
          }
        }

        const orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);

        const sex = (() => {
          if (args?.data?.status === -1) return {};
          return {
            patientInfo: {
              SEX: args?.data?.status,
            },
          };
        })();

        // console.log(sex,'sexsexsex')

        try {
          const [result, _count, male, female, total]: any = await client.$transaction([
            // result
            client.appointments.findMany({
              skip: skip,
              take: take,
              where: {
                doctorID: session?.user?.id,
                status: 0,
                isDeleted: 0,
                ...sex,
                ...whereconditions,
              },
              ...orderConditions,
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: true,
              },
            }),
            // _count
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                status: 0,
                isDeleted: 0,
                ...sex,
                ...whereconditions,
              },
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: true,
              },
            }),
            // male
            whereconditions
              ? client.appointments.findMany({
                  where: {
                    doctorID: session?.user?.id,
                    status: 0,
                    isDeleted: 0,
                    patientInfo: {
                      SEX: 1,
                    },
                    ...whereconditions,
                  },
                  include: {
                    patientInfo: true,
                    doctorInfo: true,
                    clinicInfo: true,
                  },
                })
              : client.appointments.findMany({
                  where: {
                    doctorID: session?.user?.id,
                    status: 0,
                    isDeleted: 0,
                    patientInfo: {
                      SEX: 1,
                    },
                    ...whereconditions,
                  },
                  include: {
                    patientInfo: true,
                    doctorInfo: true,
                    clinicInfo: true,
                  },
                }),

            // female
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                status: 0,
                isDeleted: 0,
                patientInfo: {
                  SEX: 2,
                },
                ...whereconditions,
              },
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: true,
              },
            }),
            //total
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                status: 0,
                isDeleted: 0,
                ...whereconditions,
              },
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: true,
              },
            }),
          ]);

          // const result: any = await

          // console.log(result, 'result@@');
          // const totalRecords: any = await client.appointments.count();
          const summaryBuild = {
            totalRecords: _count.length || 0,
            male: male.length || 0,
            female: female.length || 0,
            total: total.length || 0,
          };
          // console.log(summaryBuild, 'BUILD@@');
          const res: any = {
            Appointments: result,
            summary: summaryBuild,
          };

          return res;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

const filters = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let multicondition: any = {};
  // let whereDate: any = {};

  if (args?.data!.searchKeyword) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          patientInfo: {
            FNAME: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          patientInfo: {
            LNAME: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
      ],
    };
  }
  //  if (args?.data?.status === -1)
  //  {
  //     // console.log('NUll ba? ', args?.data!.status);
  //     whereDate = {
  //       patientInfo: {
  //         SEX: args?.data!.status,
  //       },
  //     };
  //   }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      // ...whereDate,
    },
  };
  return multicondition;
};

const GraphType = objectType({
  name: 'GraphType',
  definition(t) {
    t.field('data', {
      type: DateData,
    });
  },
});

const DateData = objectType({
  name: 'DateData',
  definition(t) {
    t.field('January', {
      type: January,
    });
    t.field('February', {
      type: February,
    });
    t.field('March', {
      type: March,
    });
    t.field('April', {
      type: April,
    });
    t.field('May', {
      type: May,
    });
    t.field('June', {
      type: June,
    });
    t.field('July', {
      type: July,
    });
    t.field('August', {
      type: August,
    });
    t.field('September', {
      type: September,
    });
    t.field('October', {
      type: October,
    });
    t.field('November', {
      type: November,
    });
    t.field('December', {
      type: December,
    });
  },
});

const January = objectType({
  name: 'January',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const February = objectType({
  name: 'February',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const March = objectType({
  name: 'March',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const April = objectType({
  name: 'April',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const May = objectType({
  name: 'May',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const June = objectType({
  name: 'June',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const July = objectType({
  name: 'July',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const August = objectType({
  name: 'Augst',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const September = objectType({
  name: 'September',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const October = objectType({
  name: 'October',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const November = objectType({
  name: 'November',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});
const December = objectType({
  name: 'December',
  definition(t) {
    t.int('approved');
    t.int('cancelled');
  },
});

export const GetAppointmentGraph = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('GetAppointmentGraph', {
      type: GraphType,
      // args: { data: Appointments_Inputs! },
      async resolve(_root, args, ctx) {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const currentYear = new Date().getFullYear();

        // Fetch all appointments from the database

        const allAppointments = await client.appointments.findMany({
          where: {
            date: {
              gte: new Date(currentYear, 0, 1), // January 1st of the current year
              lt: new Date(currentYear + 1, 0, 1), // January 1st of the next year
            },
            OR: [
              { status: 1 }, // Approved
              { status: 2 }, // Cancelled
            ],
          },
        });

        const monthlyTotals: any = {
          [currentYear]: {}, // Initialize an object for the current year
        };

        // Iterate through each appointment and count by month and type
        allAppointments.forEach((appointment) => {
          const createdAt = new Date(appointment.date);

          const year = createdAt.getFullYear();
          const month = createdAt.getMonth() + 1; // Months are 0-indexed, so add 1
          const monthName = monthNames[month - 1];

          // Create a key in the monthlyTotals object for the year if it doesn't exist
          if (!monthlyTotals[year]) {
            monthlyTotals[year] = {};
          }

          // Create a key in the monthlyTotals object for the month if it doesn't exist
          if (!monthlyTotals[year][monthName]) {
            monthlyTotals[year][monthName] = {
              approved: 0,
              cancelled: 0,
            };
          }

          // Increment the count for the specific month and type
          if (appointment.type === 1) {
            monthlyTotals[year][monthName].approved++;
          } else if (appointment.type === 2) {
            monthlyTotals[year][monthName].cancelled++;
          }
        });
        // console.log('YAWA: ', monthlyTotals);
        return {
          data: monthlyTotals[currentYear],
        };
      },
    });
  },
});

const UpdateApp = objectType({
  name: 'UpdateApp',
  definition(t) {
    t.string('message');
  },
});

export const UpdateAppointment = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateAppointment', {
      type: UpdateApp,
      args: { data: AppointmentUpdate! },
      async resolve(_root, args, ctx) {
        const { id, type, status, payment_status,remarks }: any = args.data;
        const { session } = ctx;

        let message: any = {};

        try {
          if (session.user.role === 'patient') {
            return {
              message: 'You are not authorize for this action',
            };
          }
          if (session.user.role === 'doctor') {

            
            const appt_findfirst = await client.appointments.findFirst({
              where: {
                id:id,
              },
            });

            const patient_findfirst = await client.patient.findFirst({
              where: {
                S_ID:Number(appt_findfirst?.patientID),
              },
            });

            const doctor_findfirst = await client.employees.findFirst({
              where: {
                EMP_ID:Number(appt_findfirst?.doctorID),
              },
            });

            const user = await client.user.findFirst({
              where:{
                email:patient_findfirst?.EMAIL
              }
            })

            let notifType:any;
            let notifMessage:any;

            switch(args?.data?.status){
              case 1:
                notifType = 3;
                notifMessage = 'approved your appointment'
                break;
              case 2:
                notifType = 5;
                notifMessage = 'cancelled your appointment' 
                break;
              case 3:
                notifType = 4;
                notifMessage = 'marked your appointment as done' 
                break;
              default:
                notifType = 1;
                notifMessage = 'marked your appointment as pending' 
            }

              // push notification
              
            

              if(user?.isOnline === 1){
                beamsClient.publishToInterests([`forOnly_${user?.id}`],{
                    web: {
                      notification: {
                        title:"New Appointment Update",
                        body:`${session.user?.displayName} ${notifMessage}`
                      },
                    },
                });
            
              }

                // push notification

            const notifContent = await client.notification_content.create({
              data:{
                content:notifMessage
              }
            })
         
            await client.notification.create({
              data:{
                user_id:Number(session?.user?.id),
                notifiable_id:Number(user?.id),
                notification_type_id:notifType,
                notification_content_id:Number(notifContent?.id),
                appt_id:Number(id)
              }
            })

           

            // console.log(args.data?.status === 1,'args.data?.status === 1')

            if (args.data?.status === 1 || args.data?.status === 2) {

              const Date_today_currentDate = new Date();
              const formattedDated = Date_today_currentDate.toISOString(); 


              const Date_today_currentDateOnly = new Date();
              const year = Date_today_currentDateOnly.getFullYear();
              const month = String(Date_today_currentDateOnly.getMonth() + 1).padStart(2, '0');
              const day = String(Date_today_currentDateOnly.getDate()).padStart(2, '0');
              const formattedDateOnly = `${year}-${month}-${day}`;



              const originalDateString = String(appt_findfirst?.add_date);
              const originalDate = new Date(originalDateString);
              const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const day_appt = originalDate.getDate();
              const month_appt = monthNames[originalDate.getMonth()];
              const year_appt = originalDate.getFullYear();
              const hours = originalDate.getHours();
              const minutes = originalDate.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';

              // Format the date
              const formattedDate_appt = `${month_appt} ${day_appt}, ${year_appt}, ${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
              const smsDescription = args.data?.status === 1
              ? `Appointment with ${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME} On ${formattedDate_appt} Confirmed. Login to your HIP Account prior to appointment for payment instructions.`
              : args.data?.status === 2
              ? `Appointment with ${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME} is cancelled. Please call doctor's clinic for information.`
              : null;

              const smslogs_create = await client.smslogs.create({
                data: {
                  patientID:Number(patient_findfirst?.S_ID),
                  doctorID:Number(session.user?.id) || null,
                  user_id:null,
                  doctor_name:`${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME}`,
                  doctor_contact:String(patient_findfirst?.CONTACT_NO),
                  description:smsDescription,
                  dateCreated:formattedDated,
                  dateExecuted:formattedDateOnly,
                  appointment_id:String(appt_findfirst?.id),
                },
              });

             /*  console.log(smslogs_create,'smslogs_create') */
            }

            const response = await client.appointments.update({
              where: {
                id,
              },
              data: {
                id,
                type,
                status,
                remarks,
                payment_status,
              },
            });

            // console.log(response,'RESPONSE TOOO')
            
            return {
              message: 'Successfully Updated',
            };
          }
          // if(session.user.role === 'secretary' && session.user.permissions?.){
          if(session.user.role === 'secretary'){

            const subPermissions : any  = await client.sub_account_doctor.findFirst({where:{
              secretaryID: session.user?.subAccId
            }});
           
              if(Number(subPermissions?.appt_approve) !== 1){
                 throw new GraphQLError('Unauthorized')
              }    
           
           
              if(Number(subPermissions?.appt_cancel) !== 1){
                  throw new GraphQLError("Unauthorized");
              }    
          
           
              if(Number(subPermissions?.appt_done) !== 1){
                  throw new GraphQLError("Unauthorized");
              } 


            const appt_findfirst = await client.appointments.findFirst({
              where: {
                id:id,
              },
            });

            const response = await client.appointments.update({
              where: {
                id,
              },
              data: {
                id,
                type,
                status,
                remarks,
                payment_status,
              },
            });

           
          
            const patient_findfirst = await client.patient.findFirst({
              where: {
                S_ID:Number(appt_findfirst?.patientID),
              },
            });

            const doctor_findfirst = await client.employees.findFirst({
              where: {
                EMP_ID:Number(appt_findfirst?.doctorID),
              },
            });

            const secretary_findfirst:any = await client.sub_account.findFirst({
              where: {
                id:session.user?.subAccId,
              },
              include:{
                subAccountDoctorInfo:{
                  include:{
                    doctorInfo:{
                      where:{
                        EMP_ID:Number(appt_findfirst?.doctorID),
                      }
                    }
                  }
                }
              }
            });



            /* console.log(secretary_findfirst,'secretary_findfirst') */

            if (args.data?.status === 1 || args.data?.status === 2) {

              const Date_today_currentDate = new Date();
              const formattedDated = Date_today_currentDate.toISOString(); 


              const Date_today_currentDateOnly = new Date();
              const year = Date_today_currentDateOnly.getFullYear();
              const month = String(Date_today_currentDateOnly.getMonth() + 1).padStart(2, '0');
              const day = String(Date_today_currentDateOnly.getDate()).padStart(2, '0');
              const formattedDateOnly = `${year}-${month}-${day}`;



              const originalDateString = String(appt_findfirst?.add_date);
              const originalDate = new Date(originalDateString);
              const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const day_appt = originalDate.getDate();
              const month_appt = monthNames[originalDate.getMonth()];
              const year_appt = originalDate.getFullYear();
              const hours = originalDate.getHours();
              const minutes = originalDate.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';

              // Format the date
              const formattedDate_appt = `${month_appt} ${day_appt}, ${year_appt}, ${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              
              const smsDescription = args.data?.status === 1
              ? `Appointment with ${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME} On ${formattedDate_appt} Confirmed. Login to your HIP Account prior to appointment for payment instructions.`
              : args.data?.status === 2
              ? `Appointment with ${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME} is cancelled. Please call doctor's clinic for information.`
              : null;

              const smslogs_create = await client.smslogs.create({
                data: {
                  patientID:Number(patient_findfirst?.S_ID),
                  doctorID:Number(session.user?.permissions?.doctorID) || null,
                  user_id:null,
                  // doctor_name:`${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_FNAME} ${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_MNAME} ${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_LNAME}`,
                  doctor_name:`${doctor_findfirst?.EMP_FNAME} ${doctor_findfirst?.EMP_MNAME} ${doctor_findfirst?.EMP_LNAME}`,
                  doctor_contact:String(patient_findfirst?.CONTACT_NO),
                  // description:`Appointment with ${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_FNAME} ${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_MNAME} ${secretary_findfirst?.subAccountDoctorInfo?.doctorInfo?.EMP_LNAME} On ${formattedDate_appt} Confirmed. Login to your HIP Account prior to appointment for payment instructions.`,
                  description:smsDescription,
                  dateCreated:formattedDated,
                  dateExecuted:formattedDateOnly,
                  appointment_id:String(appt_findfirst?.id),
                },
              });

             /*  console.log(smslogs_create,'smslogs_create') */
            }


            let statusText;
            let logType; 

            switch (status) {
              case 0:
                statusText = "Pending";
                logType = "1"; 
                break;
              case 1:
                statusText = "Approved";
                logType = "1"; 
                break;
              case 2:
                statusText = "Cancelled";
                logType = "1"; 
                break;
              case 3:
                statusText = "Done";
                logType = "1"; 
                break;
              default:
                statusText = "Unknown";
                logType = "1";  // or any other default text
                break;
            }

               
           

            if(status !== appt_findfirst?.status){
              
              const currentDate = new Date();
              const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ];
  
              const day = currentDate.getDate();
              const month = monthNames[currentDate.getMonth()];
              const year = currentDate.getFullYear();
              const hours = currentDate.getHours();
              const minutes = currentDate.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              const formattedDate = `${month} ${day}, ${year}, ${hours % 12 || 12}:${minutes} ${ampm}`;
  
              // console.log(formattedDate);
  
  
              const Date_today_currentDate = new Date();
              const formattedDated = Date_today_currentDate.toISOString(); 


              const originalDateString = String(appt_findfirst?.add_date);
              const originalDate = new Date(originalDateString);
              const monthNames_appt = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const day_appt = originalDate.getDate();
              const month_appt = monthNames[originalDate.getMonth()];
              const year_appt = originalDate.getFullYear();
              const hours_appt = originalDate.getHours();
              const minutes_appt = originalDate.getMinutes();
              const ampm_appt = hours >= 12 ? 'pm' : 'am';

              // Format the date
              const formattedDate_appt = `${month_appt} ${day_appt}, ${year_appt}, ${hours_appt % 12 || 12}:${minutes_appt.toString().padStart(2, '0')} ${ampm_appt}`;
  
              const secretary_create = await client.log_action.create({
                data: {
                  secretaryID:session.user?.subAccId,
                  patientID:Number(patient_findfirst?.S_ID),
                  idno:Number(secretary_findfirst?.idno) || null,
                  request: `${formattedDate_appt} - ${statusText}`,
                  patient:String(patient_findfirst?.IDNO),
                  log_type:String(logType),
                  date:formattedDated,
                  type:0,
                },
              });
            }

            


            let payment_statusText;

            switch (payment_status) {
              case 0:
                payment_statusText = "Unpaid";
                logType = "3"; 
                break;
              case 1:
                payment_statusText = "Paid";
                logType = "3"; 
                break;
              default:
                statusText = "Unknown"; // or any other default text
                break;
            }
            
            // if(payment_statusText === 'Paid' || payment_statusText === 'Unpaid'){
              if(Number(subPermissions?.appt_pay) !== 1){
                  throw new GraphQLError("Unauthorized");
              }    
            // }

            if(payment_status !== appt_findfirst?.payment_status){
              const secretary_findfirst = await client.sub_account.findFirst({
                where: {
                  id:session.user?.subAccId,
                },
              });
  
              const currentDate = new Date();
              const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ];
  
              const day = currentDate.getDate();
              const month = monthNames[currentDate.getMonth()];
              const year = currentDate.getFullYear();
              const hours = currentDate.getHours();
              const minutes = currentDate.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              const formattedDate = `${month} ${day}, ${year}, ${hours % 12 || 12}:${minutes} ${ampm}`;
  
              /* console.log(formattedDate); */
  
  
              const Date_today_currentDate = new Date();
              const formattedDated = Date_today_currentDate.toISOString(); 
  
              const secretary_create = await client.log_action.create({
                data: {
                  secretaryID:session.user?.subAccId,
                  patientID:Number(patient_findfirst?.S_ID),
                  idno:Number(secretary_findfirst?.idno) || null,
                  request: `${patient_findfirst?.FNAME} ${patient_findfirst?.LNAME} - ${formattedDate} - ${payment_statusText}`,
                  patient:String(patient_findfirst?.IDNO),
                  log_type:String(logType),
                  date:formattedDated,
                  type:0,
                },
              });
            }


            let typeText;

            switch (type) {
              case 1:
                typeText = "Telemedicine";
                logType = "2"; 
                break;
              case 2:
                typeText = "Face to face";
                logType = "2"; 
                break;
              default:
                statusText = "Unknown"; // or any other default text
                break;
            }

            // if(typeText === 'Telemedicine' || typeText === 'Face to face'){
              if(Number(subPermissions?.appt_type) !== 1){
                  throw new GraphQLError("Unauthorized");
              }    
            // }

            if(type !== appt_findfirst?.type){
              const secretary_findfirst = await client.sub_account.findFirst({
                where: {
                  id:session.user?.subAccId,
                },
              });
  
              const currentDate = new Date();
              const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ];
  
              const day = currentDate.getDate();
              const month = monthNames[currentDate.getMonth()];
              const year = currentDate.getFullYear();
              const hours = currentDate.getHours();
              const minutes = currentDate.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              const formattedDate = `${month} ${day}, ${year}, ${hours % 12 || 12}:${minutes} ${ampm}`;
  
             /*  console.log(formattedDate); */
  
  
              const Date_today_currentDate = new Date();
              const formattedDated = Date_today_currentDate.toISOString(); 
  
              const secretary_create = await client.log_action.create({
                data: {
                  secretaryID:session.user?.subAccId,
                  patientID:Number(patient_findfirst?.S_ID),
                  idno:Number(secretary_findfirst?.idno) || null,
                  request: `${patient_findfirst?.FNAME} ${patient_findfirst?.LNAME} - ${formattedDate} - ${typeText}`,
                  patient:String(patient_findfirst?.IDNO),
                  log_type:String(logType),
                  date:formattedDated,
                  type:0,
                },
              });
            }
          }

          

          
        } catch (error) {
          console.log(error,'@@@@@@@@@@error')
            throw new GraphQLError(error)
        }
        return message;
      },
    });
  },
});
export const UpdateAppointmentM = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateAppointmentM', {
      type: UpdateApp,
      args: { data: AppointmentUpdateMultitple! },
      async resolve(_root, args, ctx) {
        const { id, type }: any = args.data;
        const { session } = ctx;

        let message: any = {};

        try {
          if (session.user.role === 'patient') {
            return {
              message: 'your not authorize',
            };
          }
          const mResult: any = id?.map(async (item: any) => {
            const result = await client.appointments.update({
              where: {
                id: item,
              },
              data: {
                status: (type === 'approve' && 1) || (type === 'cancel' && 2) || 3,
              },
            });
            return result;
          });

          const fResult = await Promise.all(mResult);

          return {
            message: 'Successfully Updated',
          };
        } catch (error) {
          console.log(error, 'error?');
          return message;
        }
      },
    });
  },
});
