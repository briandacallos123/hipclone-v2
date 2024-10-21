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
        t.nullable.boolean('isEmr');

    },
})

export const QueryAllVitalData = extendType({
    type: 'Query',
    definition(t) {
        t.field('QueryAllVitalData', {
            type: QueryAllVitalDataResponse,
            args: { data: QueryAllVitalDataInp },
            async resolve(_root, args, ctx) {
                const createData: any = args?.data;

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
                                    if (createData?.isEmr) {
                                        patientId = createData?.uuid;
                                    } else {
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
                                    }

                                    resolve(patientId)

                                } catch (error) {
                                    reject(error)
                                }
                            })()

                        }
                    }).then(async (res) => {
                        let emrPatientRec:any = {
                            OR:[]
                        }

                      

                        if (!args?.data?.isEmr) {
                            // console.log("dito pre!")
                            // para sa page ng patient

                            let emrResult:any = await client.emr_patient.findFirst({
                                where: {
                                    patientID: Number(res)
                                },
                                orderBy: {
                                    date_added: 'desc'
                                }
                            })

                            let arrCon = [];
                            arrCon.push({
                                patientId: Number(res)
                            })
                            if(emrResult?.patientID){
                                arrCon.push({
                                    emrPatientId: Number(emrResult?.id)
                                })
                            }
                            emrPatientRec.OR = [...arrCon]

                            // emrPatientRec = {
                            //     OR:[
                            //         {
                            //             emrPatientId: Number(emrResult.id),
                            //         },
                            //         {
                            //              patientId:emrResult?.patientID
                            //         }
                            //     ]
                            // }

                        }else{

                       
                            const emrTarget:any = await client.emr_patient.findFirst({
                                where:{
                                    id: Number(res)
                                }
                            });

                            let arrCon = [];
                            arrCon.push({
                                emrPatientId: Number(emrTarget.id)
                            })
                            if(emrTarget?.patientID){
                                arrCon.push({
                                    patientID: Number(emrTarget?.patientID)
                                })
                            }
                            emrPatientRec.OR = [...arrCon]
                            
                           
                        }

                        const patientType: any = (() => {
                            if(emrPatientRec){
                                return;
                            }

                            if (createData.isEmr) {
                                return {
                                    emrPatientId: Number(res),
                                    isEMR: 1
                                }
                            } else {
                                return {
                                    patientId: Number(res)
                                }
                            }
                        })()


                        console.log(patientType,'patientType')
                        // console.log(emrPatientRec,'emrPatientRec')
                        console.log(emrPatientRec,'emrPatientRec')

                        result = await client.vital_data.findMany({

                            where: {
                                ...patientType,
                                isDeleted: 0,
                                ...emrPatientRec

                            },
                            include: {
                                vital_category: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        })
                    })

                    console.log(result,'result');

                    return {
                        listData: result
                    }

                } catch (error) {
                    console.log(error, 'errorrrrrr!!!!!!!!!')
                    throw new GraphQLError(error)
                }

            }
        })
    }
})


const QueryAllCategoryInput = inputObjectType({
    name: "QueryAllCategoryInput",
    definition(t) {
        t.nullable.string('uuid');
        t.nullable.boolean('isEmr');

    },
})

export const QueryAllCategory = extendType({
    type: 'Query',
    definition(t) {
        t.field('QueryAllCategory', {
            type: CategoryResponse,
            args: { data: QueryAllCategoryInput },
            async resolve(_root, args, ctx) {

              try {
                const { session } = ctx;
                let patientId: any;
                let response: any;

                await new Promise((resolve, reject) => {
                    if (session?.user?.role === 'patient') {
                        // return session?.user?.s_id
                        resolve(session?.user?.s_id)
                    } else {
                        (async () => {
                            let id: any;

                            if (!args?.data?.isEmr) {
                                const patient = await client.user.findFirst({
                                    where: {
                                        uuid: args?.data?.uuid
                                    }
                                });
                                patientId = await client.patient?.findFirst({
                                    where: {
                                        EMAIL: patient?.email
                                    }
                                });
                                id = patientId?.S_ID
                            } else {

                                id = args?.data?.uuid;
                            }
                            resolve(id)
                        })()
                    }
                }).then(async (res) => {
                    let emrPatientRec: any;

                  

                    // check if si patient ba ay may emr na data pero nasa page tayo ng patient
                    if (!args?.data?.isEmr) {
                        let emrResult:any = await client.emr_patient.findFirst({
                            where: {
                                patientID: Number(res)
                            },
                            orderBy: {
                                date_added: 'desc'
                            }
                        })
                        emrPatientRec = {
                            OR:[
                                {
                                    emrPatientId: Number(emrResult.id),
                                },
                                {
                                     patientId:emrResult?.patientID
                                }
                            ]
                        }
                    }

                    const target = (() => {
                        if(emrPatientRec){
                            return;
                        }
                        if (!args?.data?.isEmr) {
                            return {
                                patientId: Number(res)
                            }
                        }
                        return {
                            emrPatientId: Number(res)
                        }
                    })()
                  
                    response = await client.vital_category.findMany({
                        where: {
                            isDeleted: 0,
                            ...target,
                            ...emrPatientRec

                        }
                    })
                })



                return {
                    dataList: response,
                }
              } catch (error) {
                console.log(error,'erro')
                throw new GraphQLError(error);
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
        t.nullable.string('uuid');
        t.nullable.boolean('isEmr')
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

                    const isEmr = args?.data?.isEmr

                    const { title, unit }: any = args?.data
                    let patientId: any;

                    await new Promise((resolve, reject) => {
                        if (user?.role === 'patient') {
                            patientId = Number(user?.s_id)
                            resolve(Number(user?.s_id))
                        } else {
                            if (!isEmr) {
                                (async () => {
                                    const patient = await client.user.findFirst({
                                        where: {
                                            uuid: args?.data?.uuid
                                        }
                                    });
                                    const res = await client.patient?.findFirst({
                                        where: {
                                            EMAIL: patient?.email
                                        },

                                    });
                                    patientId = res?.S_ID
                                    resolve(patientId?.S_ID)
                                })()
                            } else {
                                resolve(args?.data?.uuid)
                            }
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
                            return Number(user?.doctor_id)
                        } else {
                            return null;
                        }
                    })()

                    const patientValEmr = (() => {
                        if (isEmr) {
                            return {
                                emrPatientId: Number(args?.data?.uuid)
                            }
                        }
                        return {
                            patientId: patientId
                        }
                    })()

                    console.log(patientValEmr, 'awitt')

                    await client.vital_category.create({
                        data: {
                            measuring_unit: unit,
                            title,
                            ...patientValEmr,
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


