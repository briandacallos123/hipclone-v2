import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { Clinics } from './ClinicSched';
// import { unserialize } from 'php-serialize';

const PatientAppointments = objectType({
  name: 'PatientAppointments',
  definition(t) {
    t.int('id');
    t.int('payment_status');
    t.int('type');
    t.int('status');
    t.string('remarks');
    t.time('time_slot');
    t.date('date');
    t.date('add_date');
    t.int('payment_status');
    t.field('patientInfo', {
      type: patientInfoAppointment,
    });
    t.field('doctorInfo', {
      type: doctorInfoTypePatient,
    });
    t.field('clinicInfo', {
      type: clinicInfoPatient,
    });
  },
});

const patientInfoAppointment = objectType({
  name: 'patientInfoAppointment',
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
    t.nullable.list.field('userInfo', {
      type: appt_history_userinfo,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.user.findMany({
          where: {
            email: String(root?.EMAIL),
          },
        });

        return result;
      },
    });
  },
});

const appt_history_userinfo = objectType({
  name: 'appt_history_userinfo',
  definition(t) {
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: appt_history_patient_display_picture,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.display_picture.findMany({
          where: {
            userID: Number(root?.id),
          },
          orderBy: {
            id: 'desc',
          },
        });

        return result;
      },
    });
  },
});

///////////////////////////////////////////////////////
const appt_history_patient_display_picture = objectType({
  name: 'appt_history_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const doctorInfoTypePatient = objectType({
  name: 'doctorInfoTypePatient',
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

const clinicInfoPatient = objectType({
  name: 'clinicInfoPatient',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('location');
    t.list.field('clinicDPInfo', {
      type: appt_history_clinicDPInfos,
    });
  },
});

const appt_history_clinicDPInfos = objectType({
  name: 'appt_history_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

const PatientAppointmentResponse = objectType({
  name: 'PatientAppointmentResponse',
  definition(t) {
    t.list.field('patientAppointment', {
      type: PatientAppointments,
    });
    t.field('summary', {
      type: SummaryObj,
    });
    t.list.nullable.field('clinic',{
      type:Clinics
    })
  },
});
const SummaryObj = objectType({
  name: 'SummaryObj',
  definition(t) {
    t.int('totalRecords');
    t.int('all');
    t.int('pending');
    t.int('approve');
    t.int('cancelled');
    t.int('done');
  },
});

const Patient_Appointments_Inputs = inputObjectType({
  name: 'Patient_Appointments_Inputs',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.int('status');
    t.list.field('clinicIds', { type: 'Int' });
    t.nullable.string('searchKeyword');
    t.nullable.int('emrID');
    t.nullable.date('startDate');
    t.nullable.date('endDate');
    t.nullable.string('userType');
    t.nullable.string('uuid');
  },
});

const filters = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereStatus: any = {};
  let whereClinic: any = {};
  let whereDate: any = {};

  if (args?.data!.searchKeyword) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          clinicInfo: {
            clinic_name: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
      ],
    };
  }
  // if (args?.data!.status !== null && args?.data!.status !== -1) {
  //   whereStatus = {
  //     status: args?.data!.status,
  //   };
  // }
  const clinicIDs: any = args?.data!.clinicIds;
  if (args?.data!.clinicIds?.length) {
    whereClinic = {
      clinicInfo: {
        id: {
          in: clinicIDs,
        },
      },
    };
  }
  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      AND: [
        {
          date: {
            gte: args?.data!.startDate,
          },
        },
        {
          date: {
            lte: args?.data!.endDate,
          },
        },
      ],
    };
  }

  if (args?.data!.startDate && !args?.data!.endDate) {
    whereDate = {
      date: {
        gte: args?.data!.startDate,
      },
    };
  }
  if (!args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      date: {
        lte: args?.data!.endDate,
      },
    }
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereStatus,
      ...whereClinic,
      ...whereDate,
    },
  };
  return multicondition;
};

export const GET_ALL_PATIENT_APPOINTMENTS = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.nullable.field('GET_ALL_PATIENT_APPOINTMENTS', {
      type: PatientAppointmentResponse,
      args: { data: Patient_Appointments_Inputs! },
      async resolve(_root, args, ctx) {
        // console.log(args?.data, 'yaya@@@');
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        const emrID: Number | any = args?.data!.emrID ? args?.data!.emrID : null;
        const uuid: String | any = args?.data!.uuid ? args?.data!.uuid : null;
        const startDate: any = args?.data!.startDate;
        const endDate: any = args?.data!.endDate;

        const currentEndDate = new Date(endDate);

        const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
        const formattedEndDateAsDate = new Date(formattedEndDate);

        const { session } = ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'GET_ALL_APPOINTMENTS'
        );

        const whereconditions = filters(args);
        const status = (() => {
          if (args?.data!.status === -1) return {};
          return {
            status: Number(args?.data!.status),
          };
        })();

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);

        const setCurrentDay = (() => {
          if (!startDate && !endDate) return {};
          if (!startDate && endDate)
            return {
              date: {
                lte: currentDateBackward,
              },
            };
          if (startDate && !endDate) {
            return {
              date: {
                gte: formattedEndDateAsDate,
              }
            }
          }
          if (startDate && endDate) {
            return {
              date: {
                gte: formattedEndDateAsDate,
                lte: currentDateBackward,
              }
            }
          }
        })();
        console.log(setCurrentDay, 'HUHHHHHHHHHHHHHHHHHHHHH_____________________________________BAHO MO BOSS')

        let patientId: any;

        if (uuid) {
          patientId = await client.user.findFirst({
            where: {
              uuid,
            },
            include: {
              patientInfo: {
                select: {
                  S_ID: true,
                },
              },
            },
          });
        }
        let emr_records: any;

        if (emrID) {
          emr_records = await client.emr_patient.findFirst({
            where: {
              id: emrID,
            },
            include: {
              patientRelation: true,
            },
          });
        }

        const renderCondition = (() => {
          if (uuid) {
            return {
              patientID: Number(patientId?.patientInfo?.S_ID),
            };
          }
          return {
            patientID: Number(emr_records?.patientRelation?.S_ID),
          };
        })();


        const checkUser = (() => {
          if (session?.user?.role === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        const [result, totalRecords, pending, approved, cancelled, done, all]: any =
          await client.$transaction([
            client.appointments.findMany({
              skip,
              take,
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...renderCondition,
                isDeleted: 0,
                ...status,
                ...whereconditions,
              },
              // ...orderConditions,
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
              },
              orderBy: {
                id: 'desc',
              },
            }),

            // totalRecords
            client.appointments.count({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...renderCondition,
                // patientID: emr_records?.patientRelation?.S_ID,
                isDeleted: 0,
                ...status,
                ...whereconditions,
                // ...setCurrentDay,
              },
            }),

            // Pending
            whereconditions
              ? client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 0,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              })
              : client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 0,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              }),

            // approve
            whereconditions
              ? client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 1,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              })
              : client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 1,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              }),

            // cancelled
            whereconditions
              ? client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 2,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              })
              : client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 2,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              }),

            // done
            whereconditions
              ? client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 3,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              })
              : client.appointments.count({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  ...renderCondition,
                  status: 3,
                  isDeleted: 0,
                  ...whereconditions,
                  ...setCurrentDay,
                },
              }),

            // all
            client.appointments.count({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...renderCondition,
                isDeleted: 0,
                ...whereconditions,
                ...setCurrentDay,
              },
            }),
          ]);

        const summaryObj = {
          all,
          pending,
          approve: approved,
          cancelled,
          done,
          totalRecords,
        };

        // console.log(summaryObj, 'summary');

        return {
          patientAppointment: result,
          summary: summaryObj,
        };
      },
    });
  },
});

const Patient_Appointments_Inputs_user = inputObjectType({
  name: 'Patient_Appointments_Inputs_user',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.int('status');
    t.list.field('clinicIds', { type: 'Int' });
    t.nullable.string('searchKeyword');
    t.nullable.date('startDate');
    t.nullable.date('endDate');
  },
});

export const GET_ALL_PATIENT_APPOINTMENTS_USER = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.nullable.field('GET_ALL_PATIENT_APPOINTMENTS_USER', {
      type: PatientAppointmentResponse,
      args: { data: Patient_Appointments_Inputs_user! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;

        const { session } = ctx;

        console.log(args?.data?.clinicIds,'HOSPITALLLLLLLLLLLLLLL')

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'GET_ALL_APPOINTMENTS'
        );

        const whereconditions = filters(args);
        const status = (() => {
          if (args?.data!.status === -1) return {};
          return {
            status: Number(args?.data!.status),
          };
        })();

        console.log(whereconditions,'HOSPITALLLLLLLLLLLLLLLfilters')


        let order: any;
        switch (args?.data!.orderBy) {
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
          case 'type':
            {
              order = [
                {
                  type: args?.data!.orderDir,
                },
              ];
            }
            break;
          case 'date':
            {
              order = [
                {
                  date: args?.data!.orderDir,
                },
              ];
            }
            break;
          case 'status':
            {
              order = [
                {
                  status: args?.data!.orderDir,
                },
              ];
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
        let orderConditions: any;

        orderConditions = {
          orderBy: order,
        };

    

        const [result, totalRecords, pending, approved, cancelled, done, all, clinic]: any =
          await client.$transaction([
            client.appointments.findMany({
              skip,
              take,
              where: {
                patientID: session?.user?.s_id,
                isDeleted: 0,
                ...status,
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...whereconditions,
                NOT: [{ time_slot: null }, { patientInfo: null }],
               
              },
              ...orderConditions,
              include: {
                patientInfo: true,
                doctorInfo: true,
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
              },
            }),

            // totalRecords
            client.appointments.count({
              where: {
                patientID: session?.user?.s_id,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                isDeleted: 0,
                ...status,
                ...whereconditions,
              },
            }),

            // Pending
            whereconditions
              ? client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 0,
                  isDeleted: 0,
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 0,
                  isDeleted: 0,
                  ...whereconditions,
                },
              }),

            // approve
            whereconditions
              ? client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 1,
                  isDeleted: 0,
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 1,
                  isDeleted: 0,
                  ...whereconditions,
                },
              }),

            // cancelled
            whereconditions
              ? client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 2,
                  isDeleted: 0,
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 2,
                  isDeleted: 0,
                  ...whereconditions,
                },
              }),

            // done
            whereconditions
              ? client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 3,
                  isDeleted: 0,
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                where: {
                  patientID: session?.user?.s_id,
                  status: 3,
                  isDeleted: 0,
                  ...whereconditions,
                },
              }),

            // all
            client.appointments.count({
              where: {
                patientID: session?.user?.s_id,
                isDeleted: 0,
                ...whereconditions,
              },
            }),
            client.appointments.findMany({
              where: {
                patientID: session?.user?.s_id,
                isDeleted: 0,
                ...status,
              },
              distinct: ['clinic'],
              include:{
                clinicInfo:true
              },
              orderBy:{
                clinicInfo:{
                  clinic_name:'asc'
                }
              }
            })
          ]);

        const summaryObj = {
          all,
          pending,
          approve: approved,
          cancelled,
          done,
          totalRecords,
        };

        // console.log(summaryObj, 'summary');

        return {
          patientAppointment: result,
          summary: summaryObj,
          clinic:clinic?.map((item)=>item?.clinicInfo)
        };
      },
    });
  },
});
