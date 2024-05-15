import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';

const PatientGenderType = objectType({
  name: 'PatientGenderType',
  definition(t) {
    t.int('FemaleCount');
    t.int('MaleCount');
  },
});

export const GetPatientGender = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetPatientGender', {
      type: PatientGenderType,
      // args: { data: TodaysClinicInputs! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        try {
          const _maleCount = await client.appointments.findMany({
            where: {
              doctorID: session.user.id,
              patientInfo: {
                SEX: 1,
              },
            },
            distinct: ['patientID'],
          });

          const _femaleCount = await client.appointments.findMany({
            where: {
              doctorID: session.user.id,
              patientInfo: {
                SEX: 2,
              },
            },
          });

          return {
            MaleCount: _maleCount.length,
            FemaleCount: _femaleCount.length,
          };
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

const ClinicLength = objectType({
  name: 'ClinicLength',
  definition(t) {
    t.int('totalRecords');
  },
});

export const GetClinicDataLength = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetClinicDataLength', {
      type: ClinicLength,
      // args: { data: TodaysClinicInputs! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        // const { take, skip, orderBy, orderDir, status, searchKeyword } = args?.data;

        const currentDate = new Date();
        const yearToday = currentDate.getUTCFullYear();
        const monthToday = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const dayToday = String(currentDate.getUTCDate()).padStart(2, '0');
        const today = `${yearToday}-${monthToday}-${dayToday}T00:00:00.000Z`; // Format as ISO-8601

        try {
          const response = await client.appointments.findMany({
            where: {
              doctorID: session?.user?.id,
              date: today,
            },
          });
          // console.log(response, 'R@');
          return {
            totalRecords: response?.length,
          };
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

const AppointmentsLength = objectType({
  name: 'AppointmentsLength',
  definition(t) {
    t.int('totalRecords');
  },
});

export const GetAppointmentsLength = extendType({
  type: 'Query',
  definition(t) {
    t.field('GetAppointmentsLength', {
      type: AppointmentsLength,
      // args: { data: TodaysClinicInputs! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        // const { take, skip, orderBy, orderDir, status, searchKeyword } = args?.data;

        try {
          const response = await client.appointments.findMany({
            where: {
              doctorID: session?.user?.id,
              isDeleted: 0,
              status: 0,
            },
          });
          // console.log(response, 'R@');
          return {
            totalRecords: response?.length,
          };
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
