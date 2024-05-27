import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';

export const merchantType = objectType({
    name:'merchantType',
    definition(t) {
        t.int('id')
        t.string('first_name');
        t.string('last_name');
        t.string('middle_name');
        t.string('contact');
        t.string('email');
        t.string('user_status');
        t.field('store',{
            type:merchantStoreType
        })
    },
})

export const merchantStoreType = objectType({
    name:"merchantStoreType",
    definition(t) {
        t.int('id')
        t.string('name');
        t.string('lat');
        t.string('lng');
        t.string('address');
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
                    take,
                    skip,
                    where:{
                        is_deleted:0
                    }
                })

                const store2 = result.map(async(u:any)=>{
                    const storeRes = await client.merchant_store.findUnique({
                        where:{
                            id:Number(u.store_id)
                        }
                    })
                    return {...u, store:{...storeRes}}
                })
                const res = await Promise.all(store2)



                return {
                    merchantType:res
                }
            } catch (error) {
                console.log(error)
            }

        }
    })
}
})

export const CreateMerchantInp = inputObjectType({
    name:"CreateMerchantInp",
    definition(t) {
        t.nonNull.string('email');
        t.nonNull.string('password');
        t.nonNull.string('firstName');
        t.nullable.string('middleName');
        t.nonNull.string('lastName');
        t.nonNull.string('contact');
    },
})

// export const CreateMerchantRes = objectType({
//     name:"CreateMerchantRes",
//     definition(t) {
//         t.field('merchantUser',{
//             type:merchantType
//         })
//     },
// })


export const CreateMerchant = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('CreateMerchant', {
        type: merchantType,
        args: { data:CreateMerchantInp },
        async resolve(_root, args, ctx) {

            const {email, password, firstName, lastName, middleName, contact}:any = args?.data;

            const hashpassword = await bcrypt.hash(password, 8);

            try {
               const result = await client.merchant_user.create({
                    data:{
                        email,
                        password:hashpassword,
                        first_name:firstName,
                        last_name:lastName,
                        middle_name:middleName,
                        contact
                     
                    }
                })

                return result
            } catch (error) {
                throw new GraphQLError(error)
            }

        }
    })
}
})

export const DeleteMerchInp = inputObjectType({
    name:"DeleteMerchInp",
    definition(t) {
        t.int('id');
    },
})

export const DeleteMerchObj = objectType({
    name:"DeleteMerchObj",
    definition(t) {
        t.string("message")
    },
})

export const DeleteMerchant = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('DeleteMerchant', {
        type: DeleteMerchObj,
        args: { data:DeleteMerchInp },
        async resolve(_root, args, ctx) {

            try {
                await client.merchant_user.update({
                    data:{
                        is_deleted:1
                    },
                    where:{
                        id:args?.data?.id
                    }
                })

                return {
                    message:"Successfully deleted"
                }
            } catch (error) {
                throw new GraphQLError(error)
            }
        }
    })
}
})

export const EditMerchInp = inputObjectType({
    name:"EditMerchInp",
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('email');
        t.nonNull.string('firstName');
        t.nullable.string('middleName');
        t.nonNull.string('lastName');
        t.nonNull.string('contact');
    },
})

export const EditeMerchObj = objectType({
    name:"EditeMerchObj",
    definition(t) {
        t.string("message")
    },
})

export const EditMerchant = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('EditMerchant', {
        type: EditeMerchObj,
        args: { data:EditMerchInp },
        async resolve(_root, args, ctx) {

            const {id, email, firstName, middleName, lastName, contact}:any = args?.data;


            try {
                await client.merchant_user.update({
                    data:{
                        email,
                        first_name:firstName,
                        middle_name:middleName,
                        last_name:lastName,
                        contact
                    },
                    where:{
                        id:args?.data?.id
                    }
                })

                return {
                    message:"Successfully Updated"
                }
            } catch (error) {
                throw new GraphQLError(error)
            }
        }
    })
}
})