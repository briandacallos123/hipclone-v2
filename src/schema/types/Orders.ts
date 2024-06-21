import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';



export const orderType = objectType({
    name: 'orderType',
    definition(t) {
        t.int('id')
        t.string('generic_name');
        t.string('brand_name');
        t.string('dose');
        t.string('form');
        t.int('is_deliver');
        t.int('is_paid');
        t.string('quantity')
        t.field('patient', {
            type: patientInfos
        })
        t.nullable.field('store',{
            type:merchant_store
        })
    },
})

export const merchant_store = objectType({
    name:"merchant_store",
    definition(t) {
        t.string('name')
    },
})

export const patientInfos = objectType({
    name: "PatientInfos",
    definition(t) {
        t.id('S_ID');
        t.int('IDNO');
        t.string('FNAME');
        t.string('LNAME');
        t.string('MNAME');
        t.string('EMAIL');
        t.string('HOME_ADD');
        t.string('CONTACT_NO');
        t.int('SEX');
        t.int('STATUS');
        t.int('isDeleted');
    },
})

export const orderResponse = objectType({
    name: 'orderResponse',
    definition(t) {
        t.list.field('orderType', {
            type: orderType
        })
        t.int('totalRecords');
        t.field('summary',{
            type:summary
        })
    },
})

export const summary = objectType({
    name:"summary",
    definition(t) {
        t.int('delivery');
        t.int('pickup');

    },
})

export const orderInputType = inputObjectType({
    name: 'orderInputType',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.int('search');
        t.nullable.int('is_deliver')
        //   t.nullable.int('status');
    },
});

export const QueryAllMedicineOrdersPatientObj = objectType({
    name:"QueryAllMedicineOrdersPatientObj",
    definition(t) {
        t.int('id')
        t.string('generic_name');
        t.string('brand_name');
        t.string('dose');
        t.string('form');
        t.int('quantity');
        t.int('is_deliver');
        t.int('is_paid');
    },
})


export const QueryAllMedicineOrdersPatient = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.list.field('QueryAllMedicineOrdersPatient', {
            type: QueryAllMedicineOrdersPatientObj,
            args: { data: orderInputType },
            async resolve(_root, args, ctx) {
                const { session } = ctx;

                const {take, skip}:any = args?.data;


                console.log(session?.user,'user_')

                try {

                    const patientId = await client.patient.findFirst({
                        where:{
                            EMAIL:session?.user?.email
                        }
                    })

                    console.log(patientId,'email ?')
                    const result = await client.orders.findMany({
                        where:{
                            patient_id:Number(patientId?.S_ID)
                        }
                    })

                    // console.log(result,'RESULT_______________________________________________________')

                    return result;
                } catch (error) {
                    throw new GraphQLError(error)
                }

            }
        })
    }
})

// para to kay merchant, lahat ng orders na para sa kanya.
export const QueryAllMedicineOrders = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMedicineOrders', {
            type: orderResponse,
            args: { data: orderInputType },
            async resolve(_root, args, ctx) {
                const { take, skip, search, is_deliver }: any = args.data;

                const { session } = ctx;

                const merchant_id = await client.merchant_user.findUnique({
                    where:{
                        id:Number(session?.user?.id)
                    },
                    select:{
                        id:true
                    }
                })
                // get all stores based on merchant_id
                const stores = await client.merchant_store.findMany({
                    where:{
                        merchant_id:Number(merchant_id?.id)
                    },
                    select:{
                        id:true
                    }
                })
            
                 const delivery_option = (()=>{
                    if(is_deliver === 1){
                        return {
                            is_deliver:1
                        }
                    }else if(is_deliver === 0){
                        return {
                            is_deliver:0
                        }
                    }
                 })()


                try {
                  

                    const [result, totalRecords, deliver, pickup] = await client.$transaction([
                        client.orders.findMany({
                            take,
                            skip,
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                is_deleted:0,
                                ...delivery_option
                            },
                            include:{
                                patient:true,
                            }
                        }),
                        client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                is_deleted:0,
                            }
                        }),
                        // for delivery
                        client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                is_deliver:1,
                                is_deleted:0,
                            }
                        }),
                         // for pick up
                         client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                is_deliver:{
                                    not:{
                                        equals:1
                                    }
                                },
                                is_deleted:0,
                            }
                        })
                    ])


                    let new_result = result?.map(async(item:any)=>{
                        const store =  await client.merchant_store.findUnique({
                            where:{
                                id:Number(item?.store_id)
                            }
                        })

                        return {...item, store}
                    })

                    new_result = await Promise.all(new_result)

                    return {
                        orderType: new_result,
                        totalRecords,
                        summary:{
                            delivery:deliver,
                            pickup
                        }
                    }
                } catch (error) {
                    console.log(error)
                }

            }
        })
    }
})

export const CreateOrdersInp = inputObjectType({
    name: "CreateOrdersInp",
    definition(t) {
        t.string('address');
        t.nullable.string('contact');
        t.string('payment');
        t.nonNull.list.field('medicine_list',{
            type:medecine_list
        })
    },

})

export const medecine_list = inputObjectType({
    name:"medecine_list",
    definition(t) {
        t.nullable.string('generic_name');
        t.nullable.string('brand_name');
        t.nullable.string('dose');
       
        t.nullable.string('form');
        t.nullable.int('quantity')
        t.nullable.float('price')
        t.nullable.int('store_id');
        // t.nonNull.int('is_deliver')
        // t.nonNull.int('is_paid')
    },
})

export const CreateOrdersRes = objectType({
    name:"CreateOrdersRes",
    definition(t) {
       t.string('message')
    },
})


// t.nullable.string('generic_name');
// t.nullable.string('brand_name');
// t.nullable.string('dose');
// t.nullable.string('form');
// t.nullable.int('patient_id');
// t.nullable.int('prescription_id')
// t.nullable.string('quantity')

export const CreateOrders = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('CreateOrders', {
            type: CreateOrdersRes,
            args: { data: CreateOrdersInp },
            async resolve(_root, args, ctx) {
                const {session} = ctx;
                const {address, payment, contact} = args?.data;

                
                try {
                    const patient = await client.patient.findUnique({
                        where:{
                            EMAIL: session?.user?.email
                        }
                    })



                   const result =  args?.data?.medicine_list?.map(async(item:any)=>{
                        const {generic_name,price, brand_name,dose, form, quantity, store_id } = item;

                                return await client.orders.create({
                                    data:{
                                        generic_name,
                                        brand_name,
                                        dose,
                                        form,
                                        quantity:Number(quantity),
                                        store_id:Number(store_id),
                                        is_deliver:1,
                                        is_paid:1,
                                        status_id:2,
                                        price,
                                        address,
                                        contact,
                                        payment,
                                        patient_id:Number(patient?.S_ID),
                                    }
                                })
                    })

                     await Promise.all(result);

                   return {
                    message:"Successfully created"
                   }
                } catch (error) {
                    console.log(error)
                }
               

            }
        })
    }
})

export const DeleteOrdersInp = inputObjectType({
    name: "DeleteOrdersInp",
    definition(t) {
        t.int('id');
    },
})

export const DeleteOrdersObj = objectType({
    name: "DeleteOrdersObj",
    definition(t) {
        t.string("message")
    },
})

export const DeleteOrder = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('DeleteOrder', {
            type: DeleteOrdersObj,
            args: { data: DeleteOrdersInp },
            async resolve(_root, args, ctx) {

                try {
                    await client.orders.update({
                        data: {
                            is_deleted: 1
                        },
                        where: {
                            id: args?.data?.id
                        }
                    })

                    return {
                        message: "Successfully deleted"
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const EditOrderInp = inputObjectType({
    name: "EditOrderInp",
    definition(t) {
        t.nullable.string('generic_name');
        t.nullable.string('brand_name');
        t.nullable.string('dose');
        t.nullable.string('form');
        t.nullable.int('patient_id');
        t.nullable.int('prescription_id')
    },
})

export const EditeOrderObj = objectType({
    name: "EditeOrderObj",
    definition(t) {
        t.string("message")
    },
})

export const EditOrders = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('EditOrders', {
            type: EditeOrderObj,
            args: { data: EditOrderInp },
            async resolve(_root, args, ctx) {

                // const { id, email, firstName, middleName, lastName, contact }: any = args?.data;


                try {
                    await client.merchant_user.update({
                        data: {
                           ...args.data
                        },
                        where: {
                            id: args?.data?.id
                        }
                    })

                    return {
                        message: "Successfully Updated"
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})