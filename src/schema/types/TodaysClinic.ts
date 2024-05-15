import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

const TodaysClinicType = objectType({
  name: 'TodaysClinicType',
  definition(t) {
    t.field('doctorInfo', {
      type: DoctorTypes,
    });
    t.field('clinicInfo', {
      type: clinicInfos,
    });
    t.field('patientInfo', {
      type: patientInfos,
    });
    t.date('date');
    t.int('payment_status');
    t.int('type');
    t.int('status');
    t.string('remarks');
    t.int('id');
    t.dateTime('time_slot');
  },
});

//  TodaysClinicType: response,
//             TotalRecords: totalRecords,
//             Male: _male,
//             Female: _female,
//             All: _total,

const TodaysData = objectType({
  name: 'TodaysData',
  definition(t) {
    t.list.field('TodaysClinicType', {
      type: TodaysClinicType,
    });
    t.int('TotalRecords');
    t.int('Female');
    t.int('Male');
    t.int('All');
  },
});

const TodaysClinicInputs = inputObjectType({
  name: 'TodaysClinicInputs',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.int('status');
    t.nullable.string('searchKeyword');
  },
});

const patientInfos = objectType({
  name: 'patientInfos',
  definition(t) {
    t.int('EMPID');

    // t.string('FULLNAME');
    t.string('FNAME');
    t.string('LNAME');
    t.string('MNAME');
    t.string('HOME_ADD');
    t.string('OCCUPATION');
    t.string('EMAIL');
    t.int('SEX');
  },
});

const clinicInfos = objectType({
  name: 'clinicInfos',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('location');
  },
});

const DoctorTypes = objectType({
  name: 'DoctorTypes',
  definition(t) {
    t.int('EMP_ID');
    t.string('EMP_FULLNAME');
  },
});

export const GetAllTodaysClinic = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetAllTodaysClinic', {
      type: TodaysData,
      args: { data: TodaysClinicInputs! },
      async resolve(_, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`GetAllTodaysClinic`',
          'TodaysClinicInputs'
        );

        const { take, skip, orderBy, orderDir, status, searchKeyword }: any = args.data;

        // const { take, skip, orderBy, orderDir, status, searchKeyword } = args?.data;

        const whereconditions = filters(args);
        const sex = (() => {
          if (args?.data?.status === -1) return {};
          return {
            patientInfo: {
              SEX: args?.data?.status,
            },
          };
        })();

        const currentDate = new Date();
        const yearToday = currentDate.getUTCFullYear();
        const monthToday = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const dayToday = String(currentDate.getUTCDate()).padStart(2, '0');
        const today = `${yearToday}-${monthToday}-${dayToday}T00:00:00.000Z`; // Format as ISO-8601

        try {
          const response = await client.appointments.findMany({
            take,
            skip,
            where: {
              doctorID: session?.user?.id,
              ...sex,
              ...whereconditions,
              status: 1,
              date: today,
            },
            include: {
              patientInfo: true,
              doctorInfo: true,
              clinicInfo: true,
            },
          });
          const totalRecords = await client.appointments.count({
            where: {
              doctorID: session?.user?.id,
              status: 1,
              ...sex,
              ...whereconditions,
              date: today,
            },
          });

          const [_male, _female, _total]: any = await client.$transaction([


            // male
            whereconditions
              ? client.appointments.findMany({
                  where: {
                    doctorID: session?.user?.id,
                    date: today,
                    status: 1,
    
                    patientInfo: {
                      SEX: 1,
                    },
                  ...whereconditions,                    
                  },
                })
              : client.appointments.findMany({
                 where: {
                  doctorID: session?.user?.id,
                  date: today,
                  status: 1,
  
                  patientInfo: {
                    SEX: 1,
                  },
                  ...whereconditions,
                },
                }),

            // female
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                date: today,
                status: 1,

                patientInfo: {
                  SEX: 2,
                },
                ...whereconditions,
              },
            }),
            //total
            client.appointments.findMany({
              where: {
                doctorID: session?.user?.id,
                date: today,
                status: 1,
                ...whereconditions,
              },
            }),
          ]);

          return {
            TodaysClinicType: response,
            TotalRecords: totalRecords,
            Male: _male.length || 0,
            Female: _female.length || 0,
            All: _total.length || 0,
          };
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereDate: any = {};
  let payment_type: any = {};
  // let whereSex: any = {};

  // let hmo: any = {};
  if (args?.data?.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          patientInfo: {
            FNAME: {
              contains: args?.data?.searchKeyword,
            },
          },
        },
      ],
    };
  }
  // if (args?.data?.status !== 0) {
  //   whereSex = {
  //     OR: [
  //       {
  //         patientInfo: {
  //           SEX: args?.data?.status,
  //         },
  //       },
  //     ],
  //   };
  // }
  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      // ...whereDate,
      // ...payment_type,
      // ...whereSex,
    },
  };
  return multicondition;
};
