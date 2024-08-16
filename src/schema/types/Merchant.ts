import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { orderType } from './Orders';

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
        });
        t.nullable.int("active");
        t.nullable.int("inactive");

    },
})

export const merchantInputType = inputObjectType({
    name: 'merchantInputType',
    definition(t) {
      t.nullable.int('take');
      t.nullable.int('skip');
      t.nullable.int('search');
      t.nullable.int('status');
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


            const statusOption = (()=>{
                let status:any;
                // admin asking for active status
                if(args?.data?.status === 1){
                    status = "ONLINE"
                // inactive status
                }else if(args?.data?.status === 2){
                    status = "OFFLINE"
                }
                return status;
            })();

            try {
                const [result, active, inActive]:any = await client.$transaction([
                    client.merchant_user.findMany({
                        take,
                        skip,
                        where:{
                            is_deleted:0,
                            user_status:statusOption
                        }
                    }),
                    client.merchant_user.findMany({
                        take,
                        skip,
                        where:{
                            is_deleted:0,
                            user_status:"ONLINE"
                        }
                    }),
                    client.merchant_user.findMany({
                        take,
                        skip,
                        where:{
                            is_deleted:0,
                            user_status:"OFFLINE"
                        }
                    }),
                ])

              

                const store2 = result.map(async(u:any)=>{
                    const storeRes = await client.merchant_store.findUnique({
                        where:{
                            id:Number(u.store_id),
                      
                        },
                    })
                    return {...u, store:{...storeRes}}
                })
                const res = await Promise.all(store2)



                return {
                    merchantType:res,
                    active:active?.length,
                    inactive:inActive?.length
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
                        contact,
                        user_status:"ONLINE"
                     
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
        // t.nonNull.string('email');
        t.nonNull.string('fname');
        t.nullable.string('mname');
        t.nonNull.string('lname');
        t.nullable.string('contact');
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
        args: { data:EditMerchInp!, file: 'Upload' },
        async resolve(_root, args, ctx) {
            const { session } = ctx;
            const { fname, mname, lname, contact}:any = args?.data;
            let imgUpload:any;

            const sFile = await args?.file;
            console.log(typeof(sFile) === 'string','STRINGGGGGGGG')
            if (typeof(sFile) !== 'string') {
                const res: any = useUpload(sFile, 'public/documents/');
                imgUpload = res?.map(async (v: any) => {
                   return await client.merchant_attachment.create({
                      data: {
                        filename: String(v!.fileName),
                        file_url: String(v!.path),
                        file_type: String(v!.fileType),
                        merchant_id:Number(session?.user?.id)
                      },
                    });
                  });
            }

            let res:any;

            if(imgUpload){
              res = await Promise.all(imgUpload)
            }

            
            try {
                await client.merchant_user.update({
                    data:{
                        first_name:fname,
                        middle_name:mname,
                        last_name:lname,
                        contact,
                        attachment_id:res?.length && res[0]?.id
                    },
                    where:{
                        id:Number(session?.user?.id)
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

const QueryMerchantDashboardInp = inputObjectType({
    name:"QueryMerchantDashboardInp",
    definition(t) {
        t.string('year');
       
    },
})

const QueryMerchantDashboardObj = objectType({
    name:"QueryMerchantDashboardObj",
    definition(t) {
        t.int('ordersCount');
        t.int('storeCount');
        t.int('salesProfit');
        t.list.field('orders',{
            type:orderType
        })
    },
})




export const QueryMerchantDashboard = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('QueryMerchantDashboard', {
        type: QueryMerchantDashboardObj,
        args: { data:QueryMerchantDashboardInp },
        async resolve(_root, args, ctx) {
            // const { take, skip, search }: any = args.data;

            const { session } = ctx;
            const {user} = session;

            await cancelServerQueryRequest(
                client,
                session?.user?.id,
                '`appointments`',
                'allAppointments'
              );
            
              let storeByMerchant:any = await client.merchant_store.findMany({
                where:{
                    merchant_id:Number(session?.user?.id),
                    is_active:1
                }
              })
              storeByMerchant = storeByMerchant?.map((item)=>Number(item.id));
         

              
              const [orders]:any = await client.$transaction([
                client.orders.findMany({
                    where:{
                        store_id:{
                            in:storeByMerchant
                        },
                        is_deleted:0,
                        status_id:{
                            notIn:[3, 11, 8]
                        }
                    }
                }),
              ]);

              let sales:any = 0;

              orders?.forEach((item)=>{
                sales += Number(item?.value);
              });

              console.log(sales,'salessalessalessales')
              console.log(orders,'ordersordersordersordersordersordersordersorders')


              return {
                ordersCount:orders.length,
                storeCount:storeByMerchant.length,
                salesProfit:sales,
                orders:orders
              }

        }
    })
}
})