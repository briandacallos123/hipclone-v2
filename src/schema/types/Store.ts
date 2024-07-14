import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { serialize, unserialize } from 'php-serialize';

export const storeType = objectType({
    name: "storeType",
    definition(t) {
        t.int('id');
        t.string('name');
        t.string('address');
        t.string('description');
        t.float('distance');
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
        t.nullable.field('attachment_store', {
            type: attachment_store,
        })

    },
})

export const attachment_store = objectType({
    name: "attachment_store",
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
        t.nullable.string('search');
        t.nullable.string('delivery');
        t.nullable.int('status')
        t.nullable.int('radius')
        t.nullable.string('name')
        t.nullable.float('latitude');
        t.nullable.float('longitude');
 

    },
});

const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

const filterMerchantsByDistance = (patientLocation: any, merchants: any, radius: any) => {
    const myData:any = [];

    
    merchants.forEach(merchant => {
        const distance = calculateDistance(
            patientLocation.latitude,
            patientLocation.longitude,
            merchant.lat,
            merchant.lng
        );
      
        if(radius === 100){
            myData.push({
                ...merchant,
                distance
            })
        }
        else if(distance <= radius){
          
            myData.push({
                ...merchant,
                distance
            })
        }
    });
    return myData;
};

export const QueryAllStoreNoId = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.list.field('QueryAllStoreNoId', {
            type: storeType,
            args: { data: storeInputType },
            async resolve(_root, args, ctx) {

                const { take, skip, search, delivery, radius, longitude, latitude }: any = args.data;

                const deliveryOptions = () => {


                    if (delivery === 'Delivery') {
                        return 1
                    } else if (delivery === 'Pick up') {
                        return 0
                    }
                   
                }

               

                const deliveryFilter = deliveryOptions()

                const { session } = ctx;
                const { user } = session;
                try {
                    const result = await client.merchant_store.findMany({
                        take,
                        skip,
                        where: {
                            is_deleted: 0,
                            is_deliver: deliveryFilter,
                            name: {
                                contains: search
                            }
                        },
                        include: {
                            attachment_store: true
                        },
                        
                        
                    })

                    // console.log(latitude, longitude,'___________TUDE_____________________________')
                    const patient = {
                        latitude: latitude || user?.latitude,
                        longitude: longitude || user?.longitude
                    }
                    let filteredByKlm = filterMerchantsByDistance(patient, result, radius)

                    // if(radius === 100){
                        
                    //     filteredByKlm = result;
                    // }
                  
                    return filteredByKlm
                } catch (error) {
                    throw new GraphQLError(error)
                }

            }
        })
    }
})

export const QueryAllStoreResponse = objectType({
    name: "QueryAllStoreResponse",
    definition(t) {
        t.nullable.list.field('data', {
            type: storeType
        }),
            t.int('totalRecords'),
            t.field('summary', {
                type: QuerySummary
            })
    },
})

export const QuerySummary = objectType({
    name: "QuerySummary",
    definition(t) {
        t.int('active');
        t.int('inactive');

    },
})

export const QueryAllStore = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllStore', {
            type: QueryAllStoreResponse,
            args: { data: storeInputType },
            async resolve(_root, args, ctx) {

                const { take, skip, search, status, name }: any = args.data;

                const { session } = ctx;
                const { user } = session;

                await cancelServerQueryRequest(
                    client,
                    session?.user?.id,
                    '`appointments`',
                    'GET_ALL_APPOINTMENTS'
                );
                const isActive = (() => {
                    if (status === 1) {
                        return 1;
                    } else if (status === 2) {
                        return 0
                    }

                })()

                try {

                    const [result, _count, active, inActive]: any = await client.$transaction([
                        client.merchant_store.findMany({
                            take,
                            skip,
                            where: {
                                merchant_id: Number(user?.id),
                                is_deleted: 0,
                                is_active: isActive,
                                OR: [
                                    {
                                        name: {
                                            contains: search,

                                        },
                                    },
                                    {
                                        name: {
                                            contains: name,

                                        },
                                    }
                                ]
                            },
                            include: {
                                attachment_store: true
                            }
                        }),
                        client.merchant_store.count({
                            where: {
                                merchant_id: Number(user?.id),
                                is_deleted: 0
                            }
                        }),
                        // active
                        client.merchant_store.count({
                            where: {
                                merchant_id: Number(user?.id),
                                is_deleted: 0,
                                is_active: 1
                            }
                        }),
                        // inactive
                        client.merchant_store.count({
                            where: {
                                merchant_id: Number(user?.id),
                                is_deleted: 0,
                                is_active: 0
                            }
                        }),

                    ]);

                    const response = {
                        data: result,
                        totalRecords: _count,
                        summary: {
                            active,
                            inactive: inActive
                        }

                    }
                    console.log(response, 'RESPONE___________________')

                    return response
                } catch (error) {
                    console.log(error, 'ERROR____________')
                    // throw new 
                    throw new GraphQLError(error)
                }

            }
        })
    }
})

export const QuerySingleStoreInp = inputObjectType({
    name: "QuerySingleStoreInp",
    definition(t) {
        t.int('id')
    },
})

export const QuerySingleStore = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QuerySingleStore', {
            type: storeType,
            args: { data: QuerySingleStoreInp },
            async resolve(_root, args, ctx) {

                try {
                    const { id }: any = args?.data

                    let response = await client.merchant_store.findUnique({
                        where: {
                            id: Number(id),
                            is_deleted: 0,
                        },
                        include: {
                            attachment_store: true
                        }
                    })

                    return response
                } catch (error) {
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
        t.nullable.string('onlinePayment');
        t.string('product_types')
        t.nullable.float('latitude')
        t.nullable.string('gcashContact')
        t.nullable.float('longitude')
        t.nullable.JSON('days');

    },
});

// export const onlinePayment = inputObjectType({
//     name:"onlinePayment",
//     definition(t) {
//         t.string('platform');
//         t.string('recepient_contact');

//     },
// })

export const CreateNewStoreObj = objectType({
    name: "CreateNewStoreObj",
    definition(t) {
        t.string('message')
    }
})



export const CreateNewStore = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.list.field('CreateNewStore', {
            type: CreateNewStoreObj,
            args: { data: CreateNewStoreInp!, file: 'Upload' },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { user } = session;
                const { name, address,gcashContact, onlinePayment, latitude, longitude, description, delivery, product_types, startTime, endTime }: any = args?.data;

                const sFile = await args?.file;
                let med: any;

                let paymentAttachment:any;
                let payment:any;

                const daysJson = serialize(serialize(args?.data?.days));

                console.log(sFile,'SFILE______________________________________________________________________')

                try {
                    if (sFile) {
                        const res: any = useUpload(sFile, 'public/documents/');

                        med = await client.attachment_store.create({
                            data: {
                                filename: String(res[0]!.fileName),
                                file_url: String(res[0]!.path),
                                file_type: String(res[0]!.fileType),
                            }
                        })
                    }
                    if(sFile?.length > 1 && sFile[1] !== null){
                        const res: any = useUpload(sFile, 'public/documents/');
                        paymentAttachment = await client.order_payment_attachment.create({
                            data: {
                                filename: String(res[1]!.fileName),
                                file_url: String(res[1]!.path),
                                file_tyle: String(res[1]!.fileType),
                            }
                        })

                        
                    }

                    if(onlinePayment === 'g cash'){
                         payment = await client.online_payment.create({
                            data:{
                                platform:'g cash',
                                recepient_contact:gcashContact,
                                attachment_id:paymentAttachment?.id
                            }
                        })
                    }

                    await client.merchant_store.create({
                        data: {
                            name,
                            address,
                            description,
                            product_types,
                            start_time: startTime,
                            end_time: endTime,
                            attachment_id: Number(med.id),
                            lat: latitude,
                            days: daysJson,
                            created_at: new Date(),
                            lng: longitude,
                            merchant_id: Number(user?.id),
                            is_deliver: delivery ? 1 : 0,
                            is_deleted: 0,
                            COD:onlinePayment.includes('cash on delivery') ? 1 : 0,
                            online_payment:payment && payment?.id

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
            args: { data: CreateNewStoreInp!, file: 'Upload' },
            async resolve(_root, args, ctx) {
                try {
                    const { session } = ctx;
                    const { user } = session;
                    const { name, id, address, description, delivery, product_types, startTime, endTime }: any = args?.data;

                    const sFile = await args?.file;
                    let med: any;

                    const daysJson = serialize(serialize(args?.data?.days));

                    if (sFile?.type !== undefined) {
                        const res: any = useUpload(sFile, 'public/documents/');

                        med = await client.attachment_store.create({
                            data: {
                                filename: String(res[0]!.fileName),
                                file_url: String(res[0]!.path),
                                file_type: String(res[0]!.fileType),
                            }
                        })
                    }
                    await client.merchant_store.update({
                        where: {
                            id
                        },
                        data: {
                            name,
                            address,
                            description,
                            product_types,
                            start_time: startTime,
                            end_time: endTime,
                            attachment_id: med && Number(med?.id),
                            lat: 123.2,
                            days: daysJson,
                            created_at: new Date(),
                            lng: 123.2,
                            merchant_id: Number(user?.id),
                            is_deliver: delivery ? 1 : 0,
                            is_deleted: 0
                        }
                    })

                    return {
                        message: "Updated Successfully"
                    }
                } catch (error) {

                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const DeleteStoreInp = inputObjectType({
    name: 'DeleteStoreInp',
    definition(t) {
        t.nonNull.int('id')
    },
})


export const DeleteStore = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('DeleteStore', {
            type: CreateNewStoreObj,
            args: { data: DeleteStoreInp!, file: 'Upload' },
            async resolve(_root, args, ctx) {

                try {
                    await client.merchant_store.update({
                        where: {
                            id: Number(args?.data?.id)
                        },
                        data: {
                            is_deleted: 1
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


export const UpdateStatusStore = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateStatusStore', {
            type: CreateNewStoreObj,
            args: { data: DeleteStoreInp!},
            async resolve(_root, args, ctx) {

                try {
                    const targetStore = await client.merchant_store.findUnique({
                        where:{
                            id:Number(args?.data?.id)
                        }
                    })

                    const negateStatus = () => {
                        if(targetStore?.is_active === 1){
                            return {
                                is_active:0
                            }
                        }
                        if(targetStore?.is_active === 0){
                            return {
                                is_active:1
                            }
                        }
                    }

                    const negatedValues = negateStatus()

                    await client.merchant_store.update({
                        where: {
                            id: Number(args?.data?.id)
                        },
                        data: {
                            ...negatedValues
                        }
                    })

                    return {
                        message: "Updated Successfully"
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})