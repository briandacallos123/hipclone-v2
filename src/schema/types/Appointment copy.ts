import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
// import { unserialize } from 'php-serialize';

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
        console.log(data, 'type@@');
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

          default:
            order = {};
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
          console.log(summaryBuild, 'BUILD@@');
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
  let whereDate: any = {};

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
  if (args?.data!.status !== 0 && args?.data!.status !== null) {
    console.log('NUll ba? ', args?.data!.status);
    whereDate = {
      patientInfo: {
        SEX: args?.data!.status,
      },
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereDate,
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
        console.log('YAWA: ', monthlyTotals);
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
        const { id, type, status, payment_status }: any = args.data;

        const response = await client.appointments.update({
          where: {
            id,
          },
          data: args.data,
        });
        return {
          message: 'Successfully Updated',
        };
      },
    });
  },
});
