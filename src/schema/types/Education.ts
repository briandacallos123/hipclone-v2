import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

const EducationInput = inputObjectType({
  name: 'EducationInput',
  definition(t) {
    t.field('medicalSchool', {
      type: School,
    });
    t.field('recidency', {
      type: Recidency,
    });
    t.field('fellowship1', {
      type: Fellowship,
    });
    t.field('fellowship2', {
      type: Fellowship2,
    });
  },
});
const School = inputObjectType({
  name: 'School',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const Recidency = inputObjectType({
  name: 'Recidency',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const Fellowship = inputObjectType({
  name: 'Fellowship',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const Fellowship2 = inputObjectType({
  name: 'Fellowship2',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});

const EducationType = objectType({
  name: 'EducationType',
  definition(t) {
    t.string('schoolName');
    t.string('yearCompleted');
  },
});

const EducationTypeObj = objectType({
  name: 'EducationTypeObj',
  definition(t) {
    t.string('message');
    t.field('data', {
      type: DataFields,
    });
  },
});
const DataFields = objectType({
  name: 'DataFields',
  definition(t) {
    t.field('medicalSchool', {
      type: SchoolObj,
    });
    t.field('recidency', {
      type: RecidencyObj,
    });
    t.field('fellowship1', {
      type: FellowshipObj,
    });
    t.field('fellowship2', {
      type: Fellowship2Obj,
    });
  },
});
const SchoolObj = objectType({
  name: 'SchoolObj',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const RecidencyObj = objectType({
  name: 'RecidencyObj',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const FellowshipObj = objectType({
  name: 'FellowshipObj',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});
const Fellowship2Obj = objectType({
  name: 'Fellowship2Obj',
  definition(t) {
    t.string('name');
    t.string('year');
  },
});

function payload(data) {
  console.log(data, 'data@@');
  const { name: schoolName, year: schoolYear } = data?.medicalSchool;
  // fellowship1
  const { name: fellowShipName1, year: fYear } = data?.fellowship1;
  // fellowship2
  const { name: fellowShipName2, year: fYear2 } = data?.fellowship2;

  const { name: recidencyName, year: yearCompleted } = data?.recidency;

  const MEDICAL_SCHOOL = schoolName;
  const MED_YEAR_COMPLETED = schoolYear;

  const FSHIP_TR0 = fellowShipName1;
  const FSHIP_TR0_COMPLETED = fYear;

  const FSHIP_TR1 = fellowShipName2;
  const FSHIP_TR1_COMPLETED = fYear2;

  const RECIDENCY = recidencyName;
  const RECIDENCY_YEAR_COMPLETED = yearCompleted;

  return {
    MEDICAL_SCHOOL: schoolName,
    MED_YEAR_COMPLETED: schoolYear,
    FSHIP_TR0: fellowShipName1,
    FSHIP_TR0_COMPLETED: fYear,
    FSHIP_TR1: fellowShipName2,
    FSHIP_TR1_COMPLETED: fYear2,
    RESIDENCY: recidencyName,
    RESIDENCY_YEAR_COMPLETED: yearCompleted,
  };
}

export const GetEducations = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('GetEducations', {
      type: EducationTypeObj,
      // args: { data: EducationInput! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        try {
          const result = await client.employees.findFirst({
            select: {
              MEDICAL_SCHOOL: true,
              MED_YEAR_COMPLETED: true,
              RESIDENCY: true,
              RESIDENCY_YEAR_COMPLETED: true,
              FSHIP_TR0: true,
              FSHIP_TR0_COMPLETED: true,
              FSHIP_TR1: true,
              FSHIP_TR1_COMPLETED: true,
            },
            where: {
              EMP_ID: session?.user?.id,
            },
          });

          //  t.field('medicalSchool', {
          //    type: SchoolObj,
          //  });
          //  t.field('recidency', {
          //    type: RecidencyObj,
          //  });
          //  t.field('fellowship1', {
          //    type: FellowshipObj,
          //  });
          //  t.field('fellowship2', {
          //    type: Fellowship2Obj,
          //  });f
          // console.log(result, 'result@');

          const data = {
            medicalSchool: {
              name: result?.MEDICAL_SCHOOL,
              year: result?.MED_YEAR_COMPLETED,
            },
            recidency: {
              name: result?.RESIDENCY,
              year: result?.RESIDENCY_YEAR_COMPLETED,
            },
            fellowship1: {
              name: result?.FSHIP_TR0,
              year: result?.FSHIP_TR0_COMPLETED,
            },
            fellowship2: {
              name: result?.FSHIP_TR1,
              year: result?.FSHIP_TR1_COMPLETED,
            },
          };

          return {
            message: 'Success',
            data,
          };
        } catch (error) {}
      },
    });
  },
});

export const EducationMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('EducationMutation', {
      type: EducationType,
      args: { data: EducationInput! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        // const { validity, PRC, PTR, practicing_since, s2_number } = args?.data;

        try {
          const actualData = payload(args?.data);
          const response = await client.employees.update({
            where: {
              EMP_ID: session?.user?.id,
            },
            data: actualData,
          });
          return {
            status: 'success',
            message: 'Updated successfully',
            LicenseData: response,
          };
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
