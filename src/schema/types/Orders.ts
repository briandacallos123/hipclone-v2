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
        t.date('created_at')
        t.float('value');
        t.string('payment');
        t.nullable.field('online_reference',{
            type:'String',
            async resolve(root){
                if(!root?.online_payment) return;

                const ref = await client.online_order_payment.findFirst({
                    where:{
                        id:Number(root?.online_payment)
                    }
                });
                return ref?.reference_number;
            }
        })
        t.int('status_id')
        t.field('patient', {
            type: patientInfos
        })
        t.nullable.field('store', {
            type: merchant_store
        })
        t.nullable.field('attachment', {
            type: attachment_info
        })
        t.nullable.field('delivery_status',{
            type:delivery_status,
            async resolve(root){
               const res =  await client.status.findFirst({
                    where:{
                        id:Number(root?.delivery_status)
                    }
                })

                return res
            }
        });
        t.nullable.list.field('delivery_history',{
            type:delivery_history,
            async resolve(root){
                const target = await client.order_delivery_history.findMany({
                    where:{
                        order_id:Number(root?.id)
                    },
                    orderBy:{
                        created_at:'desc'
                    }
                })

                return target;
            }
        })
    },
})

const delivery_history = objectType({
    name:"delivery_history",
    definition(t) {
        t.int('id');
        t.dateTime('created_at');
        t.field('status_id',{
            type:delivery_status,
            async resolve(root){

                const r = await client.status.findFirst({
                    where:{
                        id:Number(root?.status_id)
                    }
                });
                return r;
            }
        })
    },
})

const delivery_status = objectType({
    name:"delivery_status",
    definition(t) {
        t.int('id');
        t.string('name');
    },
})

export const merchant_store = objectType({
    name: "merchant_store",
    definition(t) {
        t.string('name')
        t.field('attachment_store', {
            type: attachment_store
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
        t.nullable.field('Attachment',{
            type:'String',
            async resolve(root){
                const fUser = await client.user.findFirst({
                    where:{
                        email:root?.EMAIL
                    }
                })


                const file = await client.display_picture.findFirst({
                    where:{
                        userID:Number(fUser?.id)
                    },
                    orderBy:{
                        uploaded:'desc'
                    }
                });
                // console.log(file,'filefilefilefile')

                return file?.filename
            }
        })
    },
})

export const orderResponse = objectType({
    name: 'orderResponse',
    definition(t) {
        t.list.field('orderType', {
            type: orderType
        })
        t.int('totalRecords');
        t.field('summary', {
            type: summary
        })
    },
})

export const summary = objectType({
    name: "summary",
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
        t.nullable.string('search');
        t.nullable.int('is_deliver')
        t.nullable.int('status')
        t.nullable.string('orderBy');
        t.nullable.string('orderDir');


        //   t.nullable.int('status');
    },
});

export const QueryAllMedicineOrdersPatientObj = objectType({
    name: "QueryAllMedicineOrdersPatientObj",
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

                const { take, skip }: any = args?.data;


                // console.log(session?.user,'user_')

                try {

                    const patientId = await client.patient.findFirst({
                        where: {
                            EMAIL: session?.user?.email
                        }
                    })

                    const result = await client.orders.findMany({
                        where: {
                            patient_id: Number(patientId?.S_ID)
                        }
                    })

                  
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


                const { take, skip, status,orderBy, orderDir }: any = args?.data;

                let order;
                switch(orderBy){
                    case "name":
                        {
                            order = [
                                {
                                    generic_name:orderDir
                                }
                            ]
                        }
                        break;
                    case "store":
                        {
                            order = [
                                {
                                    store:{
                                        name:orderDir
                                    }
                                }
                            ]
                        }
                        break;
                    case "delivery":
                        {
                            order = [
                                {
                                   is_deliver:orderDir
                                }
                            ]
                        }
                        break;
                    case "payment":
                        {
                            order = [
                                {
                                    is_paid:orderDir
                                }
                            ]
                        }
                        break;
                    case "delivery":
                        {
                            order = [
                                {
                                    delivery_status:orderDir
                                }
                            ]
                        }
                        break;
                        case "status":
                            {
                                order = [
                                    {
                                        status_id:orderDir
                                    }
                                ]
                            }
                            break;
                    case "date":
                        {
                            order = [
                                {
                                    created_at:orderDir
                                }
                            ]
                        }
                        break;
                }

                let orderConditions = {
                    orderBy: order,
                  };

                const tabsOptions = (() => {
                    if (status !== -1) {
                        return {
                            status_id: status
                        }
                    }
                })()

                const [result, totalRecords, pending, approved, done, cancelled]: any = await client.$transaction([
                    client.orders.findMany({
                        take,
                        skip,
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id),
                            ...tabsOptions
                        },
                        include: {
                            patient: true,
                            
                        },
                        ...orderConditions

                    }),
                    client.orders.count({
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id)
                        }
                    }),
                    client.orders.count({
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id),
                            status_id: 1
                        }
                    }),
                    client.orders.count({
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id),
                            status_id: 2
                        }
                    }),
                    client.orders.count({
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id),
                            status_id: 4
                        }
                    }),
                    client.orders.count({
                        where: {
                            is_deleted: 0,
                            patient_id: Number(session?.user?.s_id),
                            status_id: 3
                        }
                    }),
                ])


                let new_result = result?.map(async (item: any) => {
                    const store = await client.merchant_store.findUnique({
                        where: {
                            id: Number(item?.store_id)
                        },
                        include: {
                            attachment_store: true
                        }
                    })

                    const medecine = await client.merchant_medicine.findFirst({
                        where: {
                            id: Number(item?.medecine_id)
                        },
                    })
                    const medecine_attachment = await client.medecine_attachment.findFirst({
                        where: {
                            id: Number(medecine?.attachment_id)
                        }
                    })
                    return { ...item, store: { ...store }, attachment: { ...medecine_attachment } }
                })

                new_result = await Promise.all(new_result)

                // console.log(new_result,'HASHAHAHA')
                // t.nullable.int('pending');
                // t.nullable.int('cancelled');
                // t.nullable.int('done');
                // t.nullable.int('approved');
                return {
                    orderType: new_result,
                    totalRecords,
                    summary: {
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
                const { take, skip, search, is_deliver, status, orderDir, orderBy }: any = args.data;

                const { session } = ctx;

                const merchant_id = await client.merchant_user.findUnique({
                    where: {
                        id: Number(session?.user?.id)
                    },
                    select: {
                        id: true
                    }
                })
                // get all stores based on merchant_id
                const stores = await client.merchant_store.findMany({
                    where: {
                        merchant_id: Number(merchant_id?.id)
                    },
                    select: {
                        id: true
                    }
                })

                const statusOption = (() => {
                    if (status !== -1) {
                        return {
                            status_id: status
                        }
                    }
                })()

                const delivery_option = (() => {
                    if (is_deliver === 1) {
                        return {
                            is_deliver: 1
                        }
                    } else if (is_deliver === 0) {
                        return {
                            is_deliver: 0
                        }
                    }
                })()

                const isSearch = (()=>{
                    let searchVal:any;

                    if(search){

                        searchVal = {
                            id:Number(search)
                        }
                    }
                    return searchVal;
                })()

                let order;
                switch(orderBy){
                    case "name":
                        {
                            order = [
                                {
                                    generic_name:orderDir
                                }
                            ]
                        }
                        break;
                    case "Medicine Name":
                        {
                            order = [
                                {
                                    generic_name:orderDir
                                }
                            ]
                        }
                        break;
                    case "Patient":
                        {
                            order = [
                                {
                                    patient:{
                                        FNAME:orderDir
                                    }
                                }
                            ]
                        }
                        break;
                    case "Status":
                        {
                            order = [
                                {
                                    is_paid:orderDir
                                }
                            ]
                        }
                        break;
                    case "Type":
                        {
                            order = [
                                {
                                    is_deliver:orderDir
                                }
                            ]
                        }
                        break;
                    case "Status_Id":
                        {
                            order = [
                                {
                                    status_id:orderDir
                                }
                            ]
                        }
                        break;
                    case "date":
                        {
                            order = [
                                {
                                    created_at:orderDir
                                }
                            ]
                        }
                        break;
                    default :
                        {
                            order = [
                                {
                                    id:orderDir
                                }
                            ]
                        }
                }

                let orderConditions = {
                    orderBy: order,
                  };

                  console.log(orderConditions,'AWITTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')

                try {


                    const [result, totalRecords, deliver, pickup, pending, cancelled, done, approved] = await client.$transaction([
                        client.orders.findMany({
                            take,
                            skip,
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                ...isSearch,
                                ...statusOption,
                                is_deleted: 0,
                                ...delivery_option
                            },
                            include: {
                                patient: true,
                            },
                            
                            ...orderConditions
                        }),
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deleted: 0,
                            }
                        }),
                        // for delivery
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deliver: 1,
                                is_deleted: 0,
                            }
                        }),
                        // for pick up
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deliver: {
                                    not: {
                                        equals: 1
                                    }
                                },
                                is_deleted: 0,
                            }
                        }),
                        // pending / cancelled / done/ approve
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted: 0,
                                status_id: 1
                            }
                        }),
                        //  cancelled / done/ approve
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted: 0,
                                status_id: 3
                            }
                        }),
                        // done/ approve
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted: 0,
                                status_id: 4
                            }
                        }),
                        //approve
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                // is_deliver:{
                                //     not:{
                                //         equals:1
                                //     }
                                // },
                                is_deleted: 0,
                                status_id: 2
                            }
                        }),
                    ])


                    let new_result = result?.map(async (item: any) => {
                        const store = await client.merchant_store.findUnique({
                            where: {
                                id: Number(item?.store_id)
                            }
                        })

                        return { ...item, store }
                    })

                    new_result = await Promise.all(new_result)

                    return {
                        orderType: new_result,
                        totalRecords,
                        summary: {
                            delivery: deliver,
                            pickup,
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
        t.nullable.string('refNumber');
        t.nonNull.list.field('medicine_list', {
            type: medecine_list
        })
    },

})

export const medecine_list = inputObjectType({
    name: "medecine_list",
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
    name: "CreateOrdersRes",
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
            args: { data: CreateOrdersInp!, file: 'Upload'! },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { address, payment, contact } = args?.data;

                const sFile = await args?.file;
                let onlinePaymentAtt: any;
                let onlinePayment: any;


                try {
                    // pag may payment attachment ex: gcash

                    if (sFile) {
                        const res: any = useUpload(sFile, 'public/documents/');

                        onlinePaymentAtt = await client.online_order_payment_attachment.create({
                            data: {
                                filename: String(res[0]!.fileName),
                                file_url: String(res[0]!.path),
                                file_type: String(res[0]!.fileType),
                            }
                        })
                    }


                    if (payment !== "cash") {
                        onlinePayment = await client.online_order_payment.create({
                            data: {
                                reference_number: args?.data?.refNumber,
                                payment_attachment: Number(onlinePaymentAtt?.id)
                            }
                        })
                    }

                    const patient = await client.patient.findUnique({
                        where: {
                            EMAIL: session?.user?.email
                        }
                    })

                    const updateMedecineStock = args?.data?.medicine_list?.map(async (item: any) => {
                        const { medecine_id, quantity } = item;

                        const targetMed = await client.merchant_medicine.findUnique({
                            where: {
                                id: Number(medecine_id)
                            }
                        })

                        return await client.merchant_medicine.update({
                            where: {
                                id: Number(medecine_id)
                            },
                            data: {
                                stock: Number(targetMed?.stock) - Number(quantity),
                                quantity_sold: Number(targetMed.quantity_sold) + Number(quantity)
                            }
                        })

                       

                        
                    })

                   await Promise.all(updateMedecineStock)

                    // stockResult?.map(async(item)=>{

                    // })





                    const storeId: any = [];

                    const result = args?.data?.medicine_list?.map(async (item: any) => {
                        const { generic_name, price, brand_name, dose, form, quantity, store_id, medecine_id } = item;

                        if (!storeId.includes(store_id)) {
                            storeId.push(store_id)
                        }

                        const orderMade = await client.orders.create({
                            data: {
                                medecine_id,
                                generic_name,
                                brand_name,
                                dose,
                                form,
                                quantity: Number(quantity),
                                store_id: Number(store_id),
                                is_deliver: 1,
                                is_paid: 1,
                                status_id: 1,
                                price,
                                address,
                                value: Number(price * quantity),
                                contact,
                                payment,
                                online_payment: onlinePayment ? Number(onlinePayment?.id) : null,
                                patient_id: Number(patient?.S_ID),
                                delivery_status:10
                            }
                        })

                        if (storeId.includes(store_id)) {
                            const merchantId = await client.merchant_store.findFirst({
                                where: {
                                    id: Number(store_id)
                                }
                            })
                            const content_id = await client.notification_content.create({
                                data: {
                                    content: "Create an order"
                                }
                            });

                            const medecineStock:any = await client.merchant_medicine.findFirst({
                                where:{
                                    id:Number(medecine_id)
                                }
                            })

                            await client.notification.create({
                                data: {
                                    user_id: Number(session?.user?.id),
                                    notifiable_id: Number(merchantId?.merchant_id),
                                    notifiable_user_role: 4,
                                    notification_type_id: 9,
                                    notification_content_id: Number(content_id?.id),
                                    order_id: Number(orderMade?.id)
                                }
                            })

                            

                            if(medecineStock?.stock <= 10){
                                let stockNotifContent = await client.notification_content.create({
                                    data: {
                                        content: "Shortage in supply"
                                    }
                                });
                                
                                await client.notification.create({
                                    data: {
                                        user_id: Number(session?.user?.id),
                                        notifiable_id: Number(merchantId?.merchant_id),
                                        notifiable_user_role: 4,
                                        notification_type_id: 10,
                                        notification_content_id: Number(stockNotifContent?.id),
                                        medecine_id:Number(medecine_id)
                                    }
                                })
    
                            }


                        }

                        return orderMade
                    })

                    await Promise.all(result);



                    return {
                        message: "Successfully created"
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
                const { session } = ctx;
                const { user } = session;



                try {
                    await client.orders.update({
                        data: {
                            is_deleted: 1
                        },
                        where: {
                            id: args?.data?.id
                        }
                    })

                    const content = await client.merchant_records_content.create({
                        data:{
                            title:"you deleted this item"
                        }
                    })

                    await client.merchant_records.create({
                        data:{
                            content_id:Number(content?.id),
                            order_id:Number(args?.data?.id),
                            created_by:Number(user?.id)
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
                const { session } = ctx;

                // console.log(session?.user,'USER____________________')
                try {
                    const merchant_id = await client.merchant_user.findUnique({
                        where: {
                            id: Number(session?.user?.id)
                        },
                        select: {
                            id: true
                        }
                    })
                    // get all stores based on merchant_id
                    const stores = await client.merchant_store.findMany({
                        where: {
                            merchant_id: Number(merchant_id?.id)
                        },
                        select: {
                            id: true
                        }
                    })

                    const status_options = (() => {
                        if (status === -1) {
                            return {
                                status_id: {
                                    in: [4, 3]
                                }
                            }
                        } else {
                            return {
                                status_id: status
                            }
                        }
                    })()

                    const delivery_option = (() => {
                        if (is_deliver === 1) {
                            return {
                                is_deliver: 1
                            }
                        } else if (is_deliver === 0) {
                            return {
                                is_deliver: 0
                            }
                        }
                    })()

                    
                const isSearch = (()=>{
                    let searchVal:any;

                    if(search){

                        searchVal = {
                            id:Number(search)
                        }
                    }
                    return searchVal;
                })()

                    const [result, totalRecords, deliver, pickup, done, cancelled] = await client.$transaction([
                        client.orders.findMany({
                            take,
                            skip,
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                ...isSearch,
                                is_deleted: 0,
                                ...delivery_option,
                                ...status_options,
                            },
                            include: {
                                patient: true,
                            },
                            orderBy: {
                                created_at: 'desc'
                            }
                        }),
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deleted: 0,
                                status_id: {
                                    in: [3, 4]
                                }
                            }
                        }),
                        // for delivery
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deliver: 1,
                                is_deleted: 0,
                                status_id: 4
                            }
                        }),
                        // for pick up
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                is_deliver: {
                                    not: {
                                        equals: 1
                                    }
                                },
                                is_deleted: 0,
                            }
                        }),

                        // done
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                status_id: 4,
                                is_deleted: 0,
                            }
                        }),
                        // cancelled
                        client.orders.count({
                            where: {
                                store_id: {
                                    in: stores?.map((item) => item.id)
                                },
                                status_id: 3,
                                is_deleted: 0,
                            }
                        })
                    ])
                    let new_result = result?.map(async (item: any) => {
                        const store = await client.merchant_store.findUnique({
                            where: {
                                id: Number(item?.store_id)
                            }
                        })
                        const medecine = await client.merchant_medicine.findFirst({
                            where: {
                                id: Number(item?.medecine_id)
                            },
                        })
                        const medecine_attachment = await client.medecine_attachment.findFirst({
                            where: {
                                id: Number(medecine?.attachment_id)
                            }
                        })

                        return { ...item, store: { ...store }, attachment: { ...medecine_attachment } }
                    })

                    new_result = await Promise.all(new_result)

                    return {
                        orderType: new_result,
                        totalRecords,
                        summary: {
                            delivery: deliver,
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
    name: "UpdateOrderInputs",
    definition(t) {
        t.int('status');
        t.int('order_id');
        t.nullable.string('patientEmail')
    },
})

export const UpdateOrderObjects = objectType({
    name: "UpdateOrderObjects",
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
                const { session } = ctx;
                const { user } = session;
                const { status, order_id, patientEmail }: any = args?.data;

                let record_content;
                let deliveryStatus;
                let deliveryHistory;
                let notifContent;
                let notifTypeId;

                switch(status){
                    case 2:
                        // merchant approved the orders
                        record_content = "you updated the status to approve";
                        deliveryStatus = 13;
                        deliveryHistory = 13;
                        notifTypeId = 11;
                        notifContent = "Merchant marked your oder as approved."
                        break;
                    case 3:
                        // merchant cancelled the orders
                        record_content = "you updated the status to cancelled";
                        deliveryStatus = 11;
                        deliveryHistory = 11;
                        notifTypeId = 12;
                        notifContent = "Merchant marked your oder as cancelled."


                        break; 
                    case 4:
                        // merchant done the orders
                        record_content = "you updated the status to done";
                        deliveryStatus = 7;
                        deliveryHistory = 7;
                        notifTypeId = 13;
                        notifContent = "Merchant marked your oder as done."

                        break; 
                }

            


                try {
                    await client.orders.update({
                        where: {
                            id: Number(order_id)
                        },
                        data: {
                            status_id: status,
                            delivery_status:deliveryStatus
                        }
                    })

                    const content = await client.merchant_records_content.create({
                        data:{
                            title:record_content,
                        }
                    })
                    await client.merchant_records.create({
                        data:{
                            content_id:Number(content?.id),
                            order_id:Number(order_id),
                            created_by:Number(user?.id)
                        }
                    })

                    await client.order_delivery_history.create({
                        data:{
                            order_id:Number(order_id),
                            status_id:Number(deliveryHistory)
                        }
                    })

                    
                    let nContent = await client.notification_content.create({
                        data:{
                            content:notifContent
                        }
                    })

                    let patient = await client.user.findFirst({
                        where:{
                            email:patientEmail
                        }
                    })

                    console.log(patient,'patientpatientpatientpatientpatientpatientpatient')

                    await client.notification.create({
                        data:{
                            user_id_user_role:4,
                            user_id:Number(user?.id),
                            notifiable_id:Number(patient?.id),
                            notifiable_user_role:5,
                            notification_type_id:notifTypeId,
                            notification_content_id:parseInt(nContent?.id),
                            order_id:Number(order_id)

                        }
                    })

                    return {
                        message: "Successfully updated"
                    }
                } catch (error) {
                    console.log(error)
                    throw new GraphQLError(error)
                }



            }
        })
    }
})


const UpdateOrderDeliveryHistoryInp = inputObjectType({
    name:"UpdateOrderDeliveryHistoryInp",
    definition(t) {
        t.int('order_id');
        t.int('status_id');
        t.string('patient_email')

    },
})

const UpdateOrderDeliveryHistoryObj = objectType({
    name:"UpdateOrderDeliveryHistoryObj",
    definition(t) {
        t.string("message")
    },
})

export const UpdateOrderDeliveryHistory = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateOrderDeliveryHistory', {
            type: UpdateOrderObjects,
            args: { data: UpdateOrderDeliveryHistoryInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { user } = session;

                const { status_id, order_id, patient_email }: any = args?.data;

                let content;
                let contentId;
                let recordContent;

                switch(status_id){
                    case 7:
                        content = "Your order was delivered!";
                        recordContent = "you updated this order as delivered";
                        contentId = 14;
                        break;
                    case 8:
                        content = "Sorry your order was delivery unsuccessfully!";
                        recordContent = "you updated this order as unsuccessfull";
                        contentId = 15;
                        break;  
                    case 6:
                        content = "Your deliver is on its way!";
                        recordContent = "you updated this order as on its way!";

                        contentId = 16;
                        break;
                    default:
                        content = "Your order is waiting for pick up!";
                        recordContent = "you updated this order as waiting for pickup!";

                        contentId = 17;

                }

                let nContent = await client.notification_content.create({
                    data:{
                        content:content
                    }
                })

                let userData = await client.user.findFirst({
                    where:{
                        email:patient_email
                    }
                })

                await client.notification.create({
                    data:{
                        user_id_user_role:4,
                        user_id:Number(user?.id),
                        notifiable_id:Number(userData?.id),
                        notifiable_user_role:5,
                        notification_type_id:Number(contentId),
                        notification_content_id:parseInt(nContent?.id),
                        order_id:Number(order_id)

                    }
                })
               

                const forOrderStatus = (()=>{
                    let val;
                    if(status_id === 7){
                        val = {
                            status_id:4
                        }
                    }
                    return val;
                })()

               try {
                    await client.orders.update({
                        where:{
                            id:Number(order_id)
                        },
                        data:{
                            delivery_status:Number(status_id),
                            ...forOrderStatus
                        }
                    })

                    await client.order_delivery_history.create({
                        data:{
                            order_id:Number(order_id),
                            status_id:Number(status_id),
                        }
                    })

                    // ehehe

                    let contentRecord = await client.merchant_records_content.create({
                        data:{
                            title:recordContent
                        }
                    })

                    await client.merchant_records.create({
                        data:{
                            order_id:Number(order_id),
                            content_id:Number(contentRecord?.id),
                            created_by:Number(user?.id)
                        }
                    })

                    return {
                        message:"Updated successfully"
                    }

               } catch (error) {
                    console.log(error);
                    throw new GraphQLError(error)
                    
               }

            }
        })
    }
})