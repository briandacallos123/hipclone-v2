import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { attachment_info } from './Medicine';
import { attachment_store } from './Store';


export const orderType = objectType({
    name: 'orderType',
    definition(t) {
        t.int('id')
        t.string('generic_name');
        t.string('brand_name');
        t.string('dose');
        t.string('form');
        t.int('is_deliver');
        t.float('price');
        t.int('is_paid');
        t.string('quantity')
        t.int('status_id')
        t.field('patient', {
            type: patientInfos
        })
        t.nullable.field('store',{
            type:merchant_store
        })
        t.nullable.field('attachment',{
            type:attachment_info
        })
    },
})

export const merchant_store = objectType({
    name:"merchant_store",
    definition(t) {
        t.string('name')
        t.field('attachment_store',{
            type:attachment_store
        })

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
        t.nullable.int('pending');
        t.nullable.int('cancelled');
        t.nullable.int('done');
        t.nullable.int('approved');
    },
})

export const orderInputType = inputObjectType({
    name: 'orderInputType',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.int('search');
        t.nullable.int('is_deliver')
        t.nullable.int('status')

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


                // console.log(session?.user,'user_')

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


// para to kay patient, lahat ng orders nya

export const QueryAllPatientOrders = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllPatientOrders', {
            type: orderResponse,
            args: { data: orderInputType },
            async resolve(_root, args, ctx) {

                const { session } = ctx;


                const {take, skip, status}:any = args?.data;

                const tabsOptions = (()=>{
                    if(status !== -1){
                        return {
                            status_id:status
                        }
                    }
                })()

                const [result, totalRecords, pending, approved, done, cancelled]:any = await client.$transaction([
                    client.orders.findMany({
                        take,
                        skip,
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id),
                            ...tabsOptions
                        },
                        include:{
                            patient:true,
                            
                        },
                        
                    }),
                    client.orders.count({
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id)
                        }
                    }),
                    client.orders.count({
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id),
                            status_id:1
                        }
                    }),
                    client.orders.count({
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id),
                            status_id:2
                        }
                    }),
                    client.orders.count({
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id),
                            status_id:4
                        }
                    }),
                    client.orders.count({
                        where:{
                            is_deleted:0,
                            patient_id:Number(session?.user?.s_id),
                            status_id:3
                        }
                    }),
                ])


                let new_result = result?.map(async(item:any)=>{
                    const store =  await client.merchant_store.findUnique({
                        where:{
                            id:Number(item?.store_id)
                        },
                        include:{
                            attachment_store:true
                        }
                    })

                    const medecine = await client.merchant_medicine.findFirst({
                        where:{
                            id:Number(item?.medecine_id)
                        },
                    })
                    const medecine_attachment = await client.medecine_attachment.findFirst({
                        where:{
                            id:Number(medecine?.attachment_id)
                        }
                    })
                    return {...item, store:{...store}, attachment:{...medecine_attachment}}
                })

                new_result = await Promise.all(new_result)

                // console.log(new_result,'HASHAHAHA')
                // t.nullable.int('pending');
                // t.nullable.int('cancelled');
                // t.nullable.int('done');
                // t.nullable.int('approved');
                return {
                    orderType:new_result,
                    totalRecords,
                    summary:{
                        pending,
                        done,
                        approved,
                        cancelled
                    }
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
                const { take, skip, search, is_deliver, status }: any = args.data;

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

                const statusOption = (()=>{
                    if(status !== -1) {
                         return {
                            status_id:status
                         }
                    }
                })()
            
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
                  

                    const [result, totalRecords, deliver, pickup, pending, cancelled, done, approved] = await client.$transaction([
                        client.orders.findMany({
                            take,
                            skip,
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                ...statusOption,
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
                        }),
                        // pending / cancelled / done/ approve
                        client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted:0,
                                status_id:1
                            }
                        }),
                         //  cancelled / done/ approve
                         client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted:0,
                                status_id:3
                            }
                        }),
                         // done/ approve
                         client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted:0,
                                status_id:4
                            }
                        }),
                         //approve
                         client.orders.count({
                            where:{
                                store_id:{
                                    in:stores?.map((item)=>item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted:0,
                                status_id:2
                            }
                        }),
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
                            pickup,
                            // pending, cancelled, done, approved
                            pending,
                            cancelled,
                            done,
                            approved
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
        t.nullable.int('medecine_id');
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

                    const updateMedecineStock = args?.data?.medicine_list?.map(async(item:any)=>{
                        const {medecine_id, quantity} = item;

                        const targetMed = await client.merchant_medicine.findUnique({
                            where:{
                                id:Number(medecine_id)
                            }
                        })

                        return await client.merchant_medicine.update({
                            where:{
                                id:Number(medecine_id)
                            },
                            data:{
                                stock:Number(targetMed?.stock) - Number(quantity),
                                quantity_sold:Number(targetMed.quantity_sold) + Number(quantity)
                            }
                        })
                    })

                    await Promise.all(updateMedecineStock)


                   const result =  args?.data?.medicine_list?.map(async(item:any)=>{
                        const {generic_name,price, brand_name,dose, form, quantity, store_id, medecine_id} = item;

                                return await client.orders.create({
                                    data:{
                                        medecine_id,
                                        generic_name,
                                        brand_name,
                                        dose,
                                        form,
                                        quantity:Number(quantity),
                                        store_id:Number(store_id),
                                        is_deliver:1,
                                        is_paid:1,
                                        status_id:1,
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



export const QueryAllOrdersForMerchantHistory = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllOrdersForMerchantHistory', {
            type: orderResponse,
            args: { data: orderInputType },
            async resolve(_root, args, ctx) {
                const { take, skip, search, is_deliver, status }: any = args.data;
                const {session} = ctx;

                // console.log(session?.user,'USER____________________')
               try {
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

                const status_options = (()=>{
                    if(status === -1){
                        return {
                            status_id:{
                                in:[4,3]
                            }
                        }
                    }else{
                        return {
                            status_id:status
                        }
                    }
                })()
                
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

                const [result, totalRecords, deliver, pickup, done, cancelled] = await client.$transaction([
                    client.orders.findMany({
                        take,
                        skip,
                        where:{
                            store_id:{
                                in:stores?.map((item)=>item.id)
                            },
                            is_deleted:0,
                            ...delivery_option,
                            ...status_options,
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
                            status_id:{
                                in:[3,4]
                            }
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
                            status_id:4
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
                    }),

                    // done
                    client.orders.count({
                       where:{
                           store_id:{
                               in:stores?.map((item)=>item.id)
                           },
                           status_id:4,
                           is_deleted:0,
                       }
                   }),
                    // cancelled
                    client.orders.count({
                        where:{
                            store_id:{
                                in:stores?.map((item)=>item.id)
                            },
                            status_id:3,
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
                    const medecine = await client.merchant_medicine.findFirst({
                        where:{
                            id:Number(item?.medecine_id)
                        },
                    })
                    const medecine_attachment = await client.medecine_attachment.findFirst({
                        where:{
                            id:Number(medecine?.attachment_id)
                        }
                    })

                    return {...item, store:{...store}, attachment:{...medecine_attachment}}
                })

                new_result = await Promise.all(new_result)

                console.log(new_result,'NEW RESLTTTTTTTTTTTT________')
                return {
                    orderType: new_result,
                    totalRecords,
                    summary:{
                        delivery:deliver,
                        pickup,
                        done,
                        cancelled
                    }
                }
               } catch (error) {
                throw new GraphQLError(error)
               }
            }
        })
    }
})

export const UpdateOrderInputs = inputObjectType({
    name:"UpdateOrderInputs",
    definition(t) {
        t.int('status');
        t.int('order_id')
    },
})

export const UpdateOrderObjects = objectType({
    name:"UpdateOrderObjects",
    definition(t) {
        t.string('message')
    },
})

export const UpdateOrderStatus = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateOrderStatus', {
            type: UpdateOrderObjects,
            args: { data: UpdateOrderInputs },
            async resolve(_root, args, ctx) {

                const { status, order_id}:any = args?.data;

                try {
                     await client.orders.update({
                        where:{
                            id:Number(order_id)
                        },
                        data:{
                            status_id:status
                        }
                    })

                    return {
                        message :"Successfully updated"
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }

                

            }
        })
    }
})