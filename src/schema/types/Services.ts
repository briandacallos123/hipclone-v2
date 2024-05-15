import { objectType, inputObjectType, extendType } from 'nexus';
import { PrismaClient } from '@prisma/client';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

const client = new PrismaClient();

const PaymentMethod = objectType({
  name: 'PaymentMethod',
  definition(t) {
    t.int('id');
    t.int('doctorID');
    t.string('acct');
    t.string('description');
    t.string('title');
    t.nullable.field('tempId', {
      type: 'String',
    });
  },
});
const FeesType = objectType({
  name: 'FeesType',
  definition(t) {
    t.nullable.int('abstract');
    t.nullable.int('certificate');
    t.nullable.int('clearance');
    t.nullable.int('isAddReqFeeShow');
  },
});
const UpdateFeeInputsType = objectType({
  name: 'UpdateFeeInputsType',
  definition(t) {
    t.nullable.int('abstract');
    t.nullable.int('certificate');
    t.nullable.int('clearance');
    t.nullable.int('isAddReqFeeShow');
  },
});

const PaymentMethodType = objectType({
  name: 'PaymentMethodType',
  definition(t) {
    t.list.field('data', {
      type: PaymentMethod,
    });
    t.int('totalRecords');
  },
});
const PaymentMethodInputType = inputObjectType({
  name: 'PaymentMethodInputType',
  definition(t) {
    // t.nullable.int('sex');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
  },
});
const UpdateFeeInputs = inputObjectType({
  name: 'UpdateFeeInputs',
  definition(t) {
    t.nullable.int('abstract');
    t.nullable.int('certificate');
    t.nullable.int('clearance');
    t.nullable.int('isAddReqFeeShow');
  },
});
const UpdateFeeInputsProf = inputObjectType({
  name: 'UpdateFeeInputsProf',
  definition(t) {
    t.nonNull.int('FEES');
    t.nonNull.int('isShow');
  },
});

const PaymentMethodInputs = inputObjectType({
  name: 'PaymentMethodInputs',
  definition(t) {
    t.string('acct');
    t.string('description');
    t.string('title');
    t.nullable.int('id');
    t.nullable.string('type');
    t.nullable.string('tempId');
  },
});
const PaymentMethodInputsDel = inputObjectType({
  name: 'PaymentMethodInputsDel',
  definition(t) {
    t.list.field('id', {
      type: 'Int',
    });
  },
});

export const GetPaymentMethod = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('GetPaymentMethod', {
      type: PaymentMethodType,
      args: { data: PaymentMethodInputType! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        // const data: any | typeof args.data = args.data;
        // const { take, skip }: typeof data = data;
        const { take, skip }: any = args?.data;

        try {
          const results = await client.doctor_payment.findMany({
            take,
            skip,

            where: {
              doctorID: session.user?.id,
              isDeleted: 0,
            },
          });
          const _count = await client.doctor_payment.count({
            where: {
              isDeleted: 0,
              doctorID: session.user?.id,
            },
          });

          console.log(results, 'hehe');

          return {
            totalRecords: _count,
            data: results,
          };
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});
export const CreatePayment = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('CreatePayment', {
      type: PaymentMethod,
      args: { data: PaymentMethodInputs! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;

        const { id, type } = args.data;

        const temp: any = args?.data?.tempId || null;

        const newId = id;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`Prescription_Mutation_Type`',
          'MutationPrescription'
        );
        try {
          let result: any;

          if (type === 'update') {
            delete args?.data?.id;
            delete args?.data?.type;

            result = await client.doctor_payment.update({
              where: {
                id: newId,
              },
              data: args.data,
            });
          } else if (type === 'delete') {
            console.log(args.data, 'yey');
          } else {
            delete args?.data?.type;
            delete args?.data?.tempId;

            // newData.doctorID = session.user.id;
            result = await client.doctor_payment.create({
              data: {
                ...args.data,
                doctorID: session.user.id,
              },
            });
          }
          // const results = await client.doctor_payment.create({
          //   data: {
          //     ...args.data,
          //     doctorID: session.user.id,
          //   },
          // });
          console.log('R: ', result);

          return {
            ...result,
            tempId: temp,
          };
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

export const DeletePayment = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('DeletePayment', {
      type: PaymentMethod,
      args: { data: PaymentMethodInputsDel! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        const { id }: any = args.data;

        try {
          // for create
          // let result: any;
          console.log(id, 'ID@@@@@@@@');

          const result = id?.map(async (itemID: any) => {
            const res = await client.doctor_payment.update({
              where: {
                id: itemID,
              },
              data: {
                isDeleted: 1,
              },
            });
            console.log('res', res);

            return res;
          });

          const deleted = await Promise.all(result);

          return deleted;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

export const GetFees = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('GetFees', {
      type: FeesType,
      // args: { data: PaymentMethodInputsDel! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        // const { id } = args.data;

        // console.log('YAWA@!');
        try {
          // for create
          let result: any;

          result = await client.employees.findFirst({
            select: {
              MEDCERT_FEE: true,
              MEDABSTRACT_FEE: true,
              MEDCLEAR_FEE: true,
              isAddReqFeeShow: true,
            },
            where: {
              EMP_ID: session.user.id,
            },
          });
          console.log(result, '@@@@@@@@@');

          //  t.nullable.int('abstract');
          //  t.nullable.int('certificate');
          //  t.nullable.int('clearance');
          return {
            abstract: result.MEDABSTRACT_FEE,
            certificate: result.MEDCERT_FEE,
            clearance: result.MEDCLEAR_FEE,
            isAddReqFeeShow: result.isAddReqFeeShow,
          };
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

// additonal request
export const UpdateFee = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('UpdateFee', {
      type: UpdateFeeInputsType,
      args: { data: UpdateFeeInputs! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        const { id } = args.data;

        try {
          let result: any;

          let d = await client.employees.findFirst({
            where: {
              EMP_ID: session.user.id,
            },
          });

          const { abstract, certificate, clearance, isAddReqFeeShow }: any = args.data;

          result = await client.employees.update({
            where: {
              EMP_ID: session.user.id,
            },
            data: {
              ...d,
              MEDCERT_FEE: certificate,
              MEDCLEAR_FEE: clearance,
              MEDABSTRACT_FEE: abstract,
              isAddReqFeeShow,
            },
          });

          return result;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

const ProfFee = objectType({
  name: 'ProfFee',
  definition(t) {
    t.int('FEES');
    t.int('isFeeShow');
  },
});

export const GetProfFee = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('GetProfFee', {
      type: ProfFee,
      // args: { data: PaymentMethodInputsDel! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        // const { id } = args.data;

        // console.log('YAWA@!');
        try {
          // for create
          let result: any;

          result = await client.employees.findFirst({
            select: {
              FEES: true,
              isFeeShow: true,
            },
            where: {
              EMP_ID: session.user.id,
            },
          });

          // console.log(result, '?');
          //  t.nullable.int('abstract');
          //  t.nullable.int('certificate');
          //  t.nullable.int('clearance');
          return result;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

// additonal request
export const UpdateProfFee = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('UpdateProfFee', {
      type: ProfFee,
      args: { data: UpdateFeeInputsProf! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        const { id, isShow }: any = args.data;

        try {
          let result: any;

          let d = await client.employees.findFirst({
            where: {
              EMP_ID: session.user.id,
            },
          });

          result = await client.employees.update({
            where: {
              EMP_ID: session.user.id,
            },
            data: {
              ...d,
              FEES: args?.data?.FEES,
              isFeeShow: Number(isShow),
            },
          });

          return result;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});
const PaymentSchedType = objectType({
  name: 'PaymentSchedType',
  definition(t) {
    t.int('isPaySchedShow');
  },
});
const PaymentSchedInput = inputObjectType({
  name: 'PaymentSchedInput',
  definition(t) {
    t.int('isPaySchedShow');
  },
});

export const GetPaymentSched = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('GetPaymentSched', {
      type: PaymentSchedType,
      // args: { data: PaymentMethodInputsDel! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        // const { id } = args.data;

        // console.log('YAWA@!');
        try {
          // for create
          let result: any;

          result = await client.employees.findFirst({
            select: {
              isPaySchedShow: true,
            },
            where: {
              EMP_ID: session.user.id,
            },
          });

          return result;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

// additonal request
export const UpdatePaymentSched = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.field('UpdatePaymentSched', {
      type: PaymentSchedType,
      args: { data: PaymentSchedInput! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        const { id } = args.data;

        try {
          let result: any;

          let d = await client.employees.findFirst({
            where: {
              EMP_ID: session.user.id,
            },
          });

          result = await client.employees.update({
            where: {
              EMP_ID: session.user.id,
            },
            data: {
              ...d,
              isPaySchedShow: args?.data?.isPaySchedShow,
            },
          });

          return result;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});
