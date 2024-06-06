import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { serialize, unserialize } from 'php-serialize';

export const storeType = objectType({
    name:"storeType",
    definition(t) {
        t.int('id');
        t.string('name');
        t.string('address');
        t.string('description');
        t.float('rating');
        t.string('product_types');
        t.int('is_deliver')
        t.list.field('days', {
            type: 'Int',
            resolve(parent: any) {
              const days: any = parent?.days;
              let res: any = [];
              if (!!days) {
                res = unserialize(unserialize(days));
              }
              return res ? res.map((v: any) => Number(v)) : [];
            },
          });
        t.int('is_active')
        t.nullable.field('attachment_store',{
            type:attachment_store,
        })
        
    },
})

export const attachment_store = objectType({
    name:"attachment_store",
    definition(t) {
        t.int('id');
        t.string('filename');
        t.string('file_url')
    },
})



export const storeInputType = inputObjectType({
    name: 'storeInputType',
    definition(t) {
      t.nullable.int('take');
      t.nullable.int('skip');
      t.nullable.int('search');
    },
  });



export const QueryAllStore = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.list.field('QueryAllStore', {
        type: storeType,
        args: { data:storeInputType },
        async resolve(_root, args, ctx) {

            const { take, skip, search }: any = args.data;

            const { session } = ctx;
            const { user } = session;
            try {
                const result = await client.merchant_store.findMany({
                    take,
                    skip,
                    where:{
                        merchant_id:Number(user?.id),
                        is_deleted:0
                    },
                    include:{
                        attachment_store:true
                    }
                })

    


                return result
            } catch (error) {
                console.log(error,'ERROR____________')
                // throw new 
                throw new GraphQLError(error)
            }

        }
    })
}
})

export const CreateNewStoreInp = inputObjectType({
    name: 'CreateNewStoreInp',
    definition(t) {
      t.nullable.int('id');
      t.string('name');
      t.string('address');
      t.string('description');
      t.boolean('delivery');
      t.string('startTime');
      t.string('endTime');
      t.string('product_types')
      t.nullable.JSON('days')
    },
  });

  export const CreateNewStoreObj = objectType({
    name:"CreateNewStoreObj",
    definition(t){
        t.string('message')
    }
  })



export const CreateNewStore = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.list.field('CreateNewStore', {
        type: CreateNewStoreObj,
        args: { data:CreateNewStoreInp!, file:'Upload' },
        async resolve(_root, args, ctx) {
            const { session } = ctx;
            const { user } = session;
            const {name, address, description, delivery, product_types, startTime, endTime}:any = args?.data;

            const sFile = await args?.file;
            let med:any;

            const daysJson = serialize(serialize(args?.data?.days));


         try {
            if (sFile) {
                const res: any = useUpload(sFile, 'public/documents/');

                med = await client.attachment_store.create({
                    data:{
                        filename: String(res[0]!.fileName),
                        file_url: String(res[0]!.path),
                        file_type: String(res[0]!.fileType),
                    }
                })
                
            }

            await client.merchant_store.create({
                data:{
                    name,
                    address,
                    description,
                    product_types,
                    start_time:startTime,
                    end_time:endTime,
                    attachment_id:Number(med?.id),
                    lat:123.2,
                    days:daysJson,
                    created_at:new Date(),
                    lng:123.2,
                    merchant_id:Number(user?.id),
                    is_deliver: delivery ? 1:0,
                    is_deleted:0
                }
            })
         } catch (error) {
            console.log(error)
         }


        }
    })
}
})


export const UpdateStore = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('UpdateStore', {
        type: CreateNewStoreObj,
        args: { data:CreateNewStoreInp!, file:'Upload' },
        async resolve(_root, args, ctx) {
            try {
                const { session } = ctx;
                const { user } = session;
                const {name,id,  address, description, delivery, product_types, startTime, endTime}:any = args?.data;
    
                const sFile = await args?.file;
                let med:any;
    
                const daysJson = serialize(serialize(args?.data?.days));
    
                if (sFile?.type !== undefined) {
                    const res: any = useUpload(sFile, 'public/documents/');
    
                    med = await client.attachment_store.create({
                        data:{
                            filename: String(res[0]!.fileName),
                            file_url: String(res[0]!.path),
                            file_type: String(res[0]!.fileType),
                        }
                    })
                }
                await client.merchant_store.update({
                    where:{
                        id
                    },
                    data:{
                        name,
                        address,
                        description,
                        product_types,
                        start_time:startTime,
                        end_time:endTime,
                        attachment_id:med && Number(med?.id),
                        lat:123.2,
                        days:daysJson,
                        created_at:new Date(),
                        lng:123.2,
                        merchant_id:Number(user?.id),
                        is_deliver: delivery ? 1:0,
                        is_deleted:0
                    }
                })

                return {
                    message:"Updated Successfully"
                }
            } catch (error) {
                console.log(error,'ERROR_________________________________')
                throw new GraphQLError(error)
            }
        }
    })
}
})