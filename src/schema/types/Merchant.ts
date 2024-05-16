import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';

export const merchantType = objectType({
    name:'merchantType',
    definition(t) {
        t.string('first_name');
        t.string('last_name');
        t.string('middle_name');
        t.string('contact');
        t.string('email');
    },
})

export const merchantManyResponse = objectType({
    name:'merchantManyResponse',
    definition(t) {
        t.list.field('merchantType',{
            type:merchantType
        })
    },
})

export const merchantInputType = inputObjectType({
    name: 'merchantInputType',
    definition(t) {
      t.nullable.int('take');
      t.nullable.int('skip');
      t.nullable.int('search');
    //   t.nullable.int('status');
    },
  });

export const QueryAllMerchant = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('QueryAllMerchant', {
        type: merchantManyResponse,
        args: { data:merchantInputType },
        async resolve(_root, args, ctx) {
            const { take, skip, search }: any = args.data;

            try {
                const result = await client.merchant_user.findMany({
                    where:{
                        is_deleted:0
                    }
                })
                console.log(result,'result@')

                return {
                    merchantType:result
                }
            } catch (error) {
                console.log(error)
            }

        }
    })
}
})