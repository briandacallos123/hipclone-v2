import { PrismaClient } from '@prisma/client';
import { extendType, objectType, intArg } from 'nexus';

const client = new PrismaClient();

export const PaymentProcedureObj = objectType({
  name: 'PaymentProcedureObj',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('isDeleted');
    t.nullable.field('payment_procedures_category', {
      type: PayProcCategory,
      async resolve(root, _arg, ctx) {
        const result: any = await client.payment_procedures_category.findFirst({
          where: {
            id: Number(root?.id),
          },
          distinct: ['name'],
        });
        return result;
      },
    });
  },
});

const PayProcCategory = objectType({
  name: 'PayProcCategory',
  definition(t) {
    t.id('id');
    t.string('name');
    t.nullable.list.field('payment_procedures', {
      type: PaymentProcedureObj,
    });
  },
});

// export const QueryPayProcedure = extendType({
//   type: 'Query',
//   definition(t) {
//     t.nullable.field('QueryPayProcedure', {
//       type: PaymentProcedureObj,
//       args: { data: intArg()! },
//       async resolve(_root, args, _ctx) {
//         const result: any = await client.payment_procedures.findFirst({
//           where: {
//             id: Number(args?.data),
//           },
//           include: {
//             payment_procedures_category: true,
//           },
//         });
//         return result;
//       },
//     });
//   },
// });

export const QueryAllPayProcedure = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('QueryAllPayProcedure', {
      type: PaymentProcedureObj,
      async resolve(_root, args, _ctx) {
        const result: any = await client.payment_procedures.findMany({
          where: {
            isDeleted: 0,
          },
          // distinct: ['name'],
          include: {
            payment_procedures_category: true,
          },
        });
        return result;
      },
    });
  },
});

export const QueryAllprocedures = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('QueryAllprocedures', {
      type: PayProcCategory,
      async resolve(_root, args, _ctx) {
        const result: any = await client.payment_procedures_category.findMany({
          // distinct: ['name'],
          include: {
            payment_procedures: {
              where: {
                isDeleted: 0,
              },
            },
          },
        });
        return result;
      },
    });
  },
});
