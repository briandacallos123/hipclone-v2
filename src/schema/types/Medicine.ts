import { extendType, inputObjectType, list, objectType } from 'nexus';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';

export const medicineType = objectType({
    name: 'medicineType',
    definition(t) {
        t.int('id')
        t.string('generic_name');
        t.string('brand_name');
        t.string('dose');
        t.string('form');
        t.float('price');
        t.string('manufacturer');
        t.nullable.field('attachment_info',{
            type:attachment_info
        })
        // t.date('created_at');
    },
})

export const attachment_info = objectType({
    name:"attachment_info",
    definition(t) {
        t.int('id');
        t.string('file_path');
        t.string('filename');

    },
})

export const QueryAllObjectType = objectType({
    name: "QueryAllObjectType",
    definition(t) {
        t.list.field('MedicineType', {
            type: medicineType
        })
    },
})

export const medicineInputType = inputObjectType({
    name: 'medicineInputType',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.int('search');
        t.nullable.int('store_id')
        //   t.nullable.int('status');
    },
});


export const QueryAllMerchantMedicine = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMerchantMedicine', {
            type: QueryAllObjectType,
            args: { data: medicineInputType },
            async resolve(_root, args, ctx) {
                const { session } = ctx;


                try {
                    const result = await client.merchant_medicine.findMany({
                        where: {
                            is_deleted: 0,
                            merchant_id: Number(session?.user?.id)
                        }
                    })
                    const res = result?.map(async(item:any)=>{
                        const r = await client.medecine_attachment.findFirst({
                            where:{
                                id:Number(item?.attachment_id)
                            }
                        })
                        return {...item, attachment_info:{...r}}
                    })

                    const fResult = await Promise.all(res)



                    return {
                        MedicineType: fResult
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const QueryAllMedecineByStore = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMedecineByStore', {
            type: QueryAllObjectType,
            args: { data: medicineInputType },
            async resolve(_root, args, ctx) {
                const { session } = ctx;


                try {
                    const result = await client.merchant_medicine.findMany({
                        where: {
                            is_deleted: 0,
                            store_id:Number(args?.data?.store_id),
                            stock:{
                                not:{
                                    equals:0
                                }
                            }
                        }
                    })
                    const res = result?.map(async(item:any)=>{
                        const r = await client.medecine_attachment.findFirst({
                            where:{
                                id:Number(item?.attachment_id)
                            }
                        })
                        return {...item, attachment_info:{...r}}
                    })

                    const fResult = await Promise.all(res)

                    return {
                        MedicineType: fResult
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const QueryAllMedecine = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMedecine', {
            type: QueryAllObjectType,
            args: { data: medicineInputType },
            async resolve(_root, args, ctx) {
                const { session } = ctx;


                try {
                    const result = await client.merchant_medicine.findMany({
                        where: {
                            is_deleted: 0,
                        }
                    })
                    const res = result?.map(async(item:any)=>{
                        const r = await client.medecine_attachment.findFirst({
                            where:{
                                id:Number(item?.attachment_id)
                            }
                        })
                        return {...item, attachment_info:{...r}}
                    })

                    const fResult = await Promise.all(res)

                    return {
                        MedicineType: fResult
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})


export const CreateMedicineInputs = inputObjectType({
    name: 'CreateMedicineInputs',
    definition(t) {
        t.string('generic_name');
        t.string('dose');
        t.string('form');
        t.string('price');
        t.string('manufacturer');
        t.string('brand_name');
        t.int('stock')
        t.string('description')
    },
})

export const CreateMedicineObj = objectType({
    name: "CreateMedicineObj",
    definition(t) {
        t.string('message')
    },
})

export const CreateMerchantMedicine = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('CreateMerchantMedicine', {
            type: CreateMedicineObj,
            args: { data: CreateMedicineInputs!, file: 'Upload' },
            async resolve(_root, args, ctx) {
                const { session } = ctx;

                const sFile = await args?.file;

                const { generic_name,stock, description, brand_name, dose, form, price, manufacturer }: any = args.data

                try {
                    let med:any;
                    if (sFile) {
                        const res: any = useUpload(sFile, 'public/documents/');

                        med = await client.medecine_attachment.create({
                            data:{
                                filename: String(res[0]!.fileName),
                                file_path: String(res[0]!.path),
                                file_type: String(res[0]!.fileType),
                                file_size: String(res[0]!.file_size)
                            }
                        })
                        
                    }

                    await client.merchant_medicine.create({
                        data: {
                            generic_name,
                            dose,
                            form,
                            manufacturer,
                            merchant_id: 1,
                            brand_name,
                            stock,
                            description,
                            price: 2.5,
                            attachment_id: Number(med?.id)
                        }
                    })




                    return {
                        message: "Successfully created"
                    }
                } catch (error) {
                    console.log(error)
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const DeleteMerchantMedicineInp = inputObjectType({
    name: "DeleteMerchantMedicineInp",
    definition(t) {
        t.nonNull.int('id')
    },
})

export const DeleteMerchantMedicineObj = objectType({
    name: "DeleteMerchantMedicineObj",
    definition(t) {
        t.nonNull.string('message')
    },
})

export const DeleteMerchantMedicine = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('DeleteMerchantMedicine', {
            type: DeleteMerchantMedicineObj,
            args: { data: DeleteMerchantMedicineInp },
            async resolve(_root, args, ctx) {


                try {
                    await client.merchant_medicine.update({
                        where: {
                            id: args?.data?.id
                        },
                        data: {
                            is_deleted: 1
                        }
                    })

                    return {
                        message: "Successfully deleted"
                    }
                } catch (error) {
                    return new GraphQLError(error)
                }
            }
        })
    }
})


export const UpdateMerchantMedicine = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateMerchantMedicine', {
            type: DeleteMerchantMedicineObj,
            args: { data: CreateMedicineInputs },
            async resolve(_root, args, ctx) {

                const { generic_name, brand_name, dose, form, price, manufacturer }: any = args.data

                try {
                    await client.merchant_medicine.update({
                        where: {
                            id: args?.data?.id
                        },
                        data: {
                            generic_name,
                            brand_name,
                            dose,
                            form,

                            manufacturer
                        }
                    })

                    return {
                        message: "Successfully updated"
                    }
                } catch (error) {
                    return new GraphQLError(error)
                }
            }
        })
    }
})