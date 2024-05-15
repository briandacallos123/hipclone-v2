import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';

export const LicensesInput = inputObjectType({
  name: 'LicensesInput',
  definition(t) {
    t.nullable.string('PRC');
    t.nullable.string('PTR');
    t.nullable.string('practicing_since');
    t.nullable.string('s2_number');
    t.nullable.string('validity');
  },
});

const LicenseTab = objectType({
  name: 'LicenseTab',
  definition(t) {
    // t.nullable.string('nationality');
    t.field('status', {
      type: 'String',
    });
    t.field('message', {
      type: 'String',
    });
    t.field('LicenseData', {
      type: LicenseData,
    });
  },
});
const LicenseData = objectType({
  name: 'LicenseData',
  definition(t) {
    t.nullable.string('LIC_NUMBER');
    t.nullable.string('PTR_LIC');
    t.nullable.string('PRACTICING_SINCE');
    t.nullable.string('S2_LIC');
    t.nullable.string('VALIDITY');
  },
});

export const LicenseMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('LicenseMutation', {
      type: LicenseTab,
      args: { data: LicensesInput! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        const { validity, PRC, PTR, practicing_since, s2_number } = args?.data;

        try {
          const response = await client.employees.update({
            where: {
              EMP_ID: session?.user?.id,
            },

            data: {
              LIC_NUMBER: PRC,
              PTR_LIC: PTR,
              PRACTICING_SINCE: practicing_since,
              VALIDITY: validity,
              S2_LIC: s2_number,
            },
          });

          //   console.log(response);
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
