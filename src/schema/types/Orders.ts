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
    },
})

export const orderInputType = inputObjectType({
    name: 'orderInputType',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.int('search');
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
                const { take, skip, search }: any = args.data;

                const { session } = ctx;

                 

                try {
                    let result = await client.orders.findMany({
                        take,
                        where:{
                            merchant_id:Number(session?.user?.id)
                        },
                        include:{
                            patient:true
                        }
                    })

                    console.log(result,'RESULT_____')
                    return {
                        orderType: result
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
        t.nullable.string('generic_name');
        t.nullable.string('dose');
        t.nullable.string('form');
        t.nullable.int('prescription_id')
        t.nullable.int('quantity')
        t.nullable.int('merchant_id');
        t.nullable.int('store_id');
        t.nonNull.int('is_deliver')
        t.nonNull.int('is_paid')
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

                try {
                    const {generic_name, dose, form,is_paid, prescription_id, quantity,merchant_id, store_id, is_deliver }:any = args?.data;
                    if(args?.data?.prescription_id){
                        let prParent = await client.prescriptions_child.findMany({
                            where:{
                                PR_ID:Number(args?.data?.prescription_id)
                            }
                        });
    
                        if(prParent?.length){
                            
                            let orders = prParent.map(async(item:any)=>{
    
                                const {MEDICINE, DOSE, FORM, QUANTITY} = item;
    
                                return await client.orders.create({
                                    data:{
                                        generic_name:MEDICINE,
                                        dose:DOSE,
                                        form:FORM,
                                        quantity:Number(QUANTITY),
                                        merchant_id:Number(merchant_id),
                                        store_id:Number(store_id),
                                        is_deliver:1,
                                        is_paid,
                                        status_id:5,
                                        patient_id:Number(session?.user?.s_id),
                                    }
                                })
                            })
    
                            await Promise.all(orders)
                        }
                        return{
                            message:"Successfully created"
                        }
                    }else{
                        const result = await client.orders.create({
                            data: {
                                merchant_id:Number(merchant_id),
                                store_id:Number(store_id),
                                is_deliver:1,
                                generic_name,
                                dose,
                                form,
                                quantity:Number(quantity),
                                patient_id:Number(session?.user?.s_id),
                                is_paid,
                                status_id:5
                            }
                        })
    
                        return {
                            message:"Successfully created"
                        }
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