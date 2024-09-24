import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import client from '../../../prisma/prismaClient';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { serialize, unserialize } from 'php-serialize';



const vitalCategoryObj = objectType({
    name: "vitalCategoryObj",
    definition(t) {
        t.string('title');
        t.string('measuring_unit');
        t.int('id')
    },
})

const CategoryResponse = objectType({
    name: "CategoryResponse",
    definition(t) {
        t.list.field('dataList', {
            type: vitalCategoryObj
        })
    },
})

const QueryAllVitalDataObj = objectType({
    name: "QueryAllVitalDataObj",
    definition(t) {
        t.int('id');
        t.int('patientId');
        t.int('doctorId');
        t.int("categoryId");
        t.dateTime('createdAt')
        t.int('value');
        t.nullable.field('vital_category', {
            type: vitalCategoryObj
        })

    },
})

const QueryAllVitalDataResponse = objectType({
    name: "QueryAllVitalDataResponse",
    definition(t) {
        t.nonNull.list.field('listData', {
            type: QueryAllVitalDataObj
        })
    },
})

const QueryAllVitalDataInp = inputObjectType({
    name: "QueryAllVitalDataInp",
    definition(t) {
        t.nullable.string('uuid')
        t.nullable.int('take');
        t.nullable.int('skip');

    },
})

export const QueryAllVitalData = extendType({
    type: 'Query',
    definition(t) {
        t.field('QueryAllVitalData', {
            type: QueryAllVitalDataResponse,
            args: { data: QueryAllVitalDataInp },
            async resolve(_root, args, ctx) {
                const createData = args?.data;

                try {
                    const { session } = ctx;
                    const { user } = session;
                    let result: any;

                    await new Promise((resolve, reject) => {
                        if (user?.role === 'patient') {
                            resolve(user?.s_id)
                        }

                        else {
                            let patientId: any;
                            (async () => {
                                try {
                                    let id = await client.user.findFirst({
                                        where: {
                                            uuid: args?.data?.uuid
                                        }
                                    });
                                    let patient = await client.patient.findUnique({
                                        where: {
                                            EMAIL: id?.email
                                        }
                                    })
                                    patientId = patient?.S_ID;

                                    resolve(patientId)

                                } catch (error) {
                                    reject(error)
                                }
                            })()

                        }
                    }).then(async (res) => {

                        result = await client.vital_data.findMany({
                            skip:createData?.skip,
                            take:createData?.take,
                            where: {
                                patientId: Number(res),
                                isDeleted: 0,

                            },
                            include: {
                                vital_category: true
                            },
                            orderBy:{
                                createdAt:'desc'
                            }
                        })
                    })



                    return {
                        listData: result
                    }

                } catch (error) {
                    throw new GraphQLError(error)
                }

            }
        })
    }
})


const QueryAllCategoryInput = inputObjectType({
    name: "QueryAllCategoryInput",
    definition(t) {
        t.nullable.string('uuid')
    },
})

export const QueryAllCategory = extendType({
    type: 'Query',
    definition(t) {
        t.field('QueryAllCategory', {
            type: CategoryResponse,
            args: { data: QueryAllCategoryInput },
            async resolve(_root, args, ctx) {

                const { session } = ctx;
                let patientId: any;
                let response:any;

                await new Promise((resolve, reject) => {
                    if (session?.user?.role === 'patient') {
                        // return session?.user?.s_id
                        resolve(session?.user?.s_id)
                    } else {
                        (async () => {
                            const patient = await client.user.findFirst({
                                where: {
                                    uuid: args?.data?.uuid
                                }
                            });
                            patientId = await client.patient?.findFirst({
                                where: {
                                    EMAIL:patient?.email
                                }
                            });
                            resolve(patientId?.S_ID)
                        })()
                    }
                }).then(async(res)=>{

                    
                    response = await client.vital_category.findMany({
                        where: {
                            patientId: Number(res),
                            isDeleted: 0
                        }
                    })
                })

          

                return {
                    dataList: response,
                }
            }
        })
    }
});

const CreateNewCategoryVitalsObj = objectType({
    name: "CreateNewCategoryVitalsObj",
    definition(t) {
        t.string("message")
    },
})

const CreateNewCategoryVitalsInp = inputObjectType({
    name: "CreateNewCategoryVitalsInp",
    definition(t) {
        t.string("title");
        t.string("unit");
        t.nullable.string('uuid')
    },
})

export const CreateNewCategoryVitals = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('CreateNewCategoryVitals', {
            type: CreateNewCategoryVitalsObj,
            args: { data: CreateNewCategoryVitalsInp },
            async resolve(_root, args, ctx) {

                try {
                    const { session } = ctx;
                    const { user } = session;

                    const { title, unit }: any = args?.data
                    let patientId: any;

                    await new Promise((resolve, reject)=>{
                        if (user?.role === 'patient') {
                            patientId = Number(user?.s_id)
                            resolve(Number(user?.s_id))
                        }else{
                            (async () => {
                                const patient = await client.user.findFirst({
                                    where: {
                                        uuid: args?.data?.uuid
                                    }
                                });
                                const res = await client.patient?.findFirst({
                                    where: {
                                        EMAIL:patient?.email
                                    },

                                });
                                patientId = res?.S_ID
                                resolve(patientId?.S_ID)
                            })()
                        }
                    })

                    // const patientIdVal = (() => {
                    //     if (user?.role === 'patient') {
                    //         return Number(user?.s_id)
                    //     } else {
                          

                    //         return Number(args?.data?.patientId)
                    //     }
                    // })()

                    const doctorIdVal = (() => {
                        if (user?.role !== 'patient') {
                            return Number(user?.id)
                        } else {
                            return null;
                        }
                    })()

                    await client.vital_category.create({
                        data: {
                            measuring_unit: unit,
                            title,
                            patientId: patientId,
                            createdBy: Number(user?.id),
                            doctorId: doctorIdVal

                        }
                    })

                    return {
                        message: "Created vital cateogory succesfully"
                    }
                } catch (error) {
                    // console.log(error)
                    throw new GraphQLError(error)
                }
            }
        })
    }
});


