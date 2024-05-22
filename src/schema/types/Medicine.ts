import { extendType, inputObjectType, list, objectType } from 'nexus';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

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
        // t.date('created_at');
    },
})

export const QueryAllObjectType = objectType({
    name:"QueryAllObjectType",
    definition(t) {
        t.list.field('MedicineType',{
            type:medicineType
        })
    },
})

export const medicineInputType = inputObjectType({
    name: 'medicineInputType',
    definition(t) {
      t.nullable.int('take');
      t.nullable.int('skip');
      t.nullable.int('search');
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
                        where:{
                            is_deleted:0,
                            merchant_id:Number(session?.user?.id)
                        }
                    })

                    return {
                        MedicineType:result
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const CreateMedicineInputs = inputObjectType({
    name:'CreateMedicineInputs',
    definition(t) {
        t.string('generic_name');
        t.string('dose');
        t.string('form');
        t.string('price');
        t.string('manufacturer');
        t.string('brand_name');
    },
})

export const CreateMedicineObj = objectType({
    name:"CreateMedicineObj",
    definition(t) {
        t.string('message')
    },
})


export const CreateMerchantMedicine = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('CreateMerchantMedicine', {
            type: CreateMedicineObj,
            args: { data: CreateMedicineInputs },
            async resolve(_root, args, ctx) {
                const { session } = ctx;

                const {generic_name,brand_name, dose, form, price, manufacturer}:any = args.data
              
                try {
                    await client.merchant_medicine.create({
                        data:{
                            generic_name,
                            dose,
                            form,
                            manufacturer,
                            merchant_id:Number(session?.user?.id),
                            brand_name,
                            price:2.5
                        }
                    })

                    return {
                        message:"Successfully created"
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }
            }
        })
    }
})

export const DeleteMerchantMedicineInp = inputObjectType({
    name:"DeleteMerchantMedicineInp",
    definition(t) {
        t.nonNull.int('id')
    },
})

export const DeleteMerchantMedicineObj = objectType({
    name:"DeleteMerchantMedicineObj",
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
                        where:{
                            id:args?.data?.id
                        },
                        data:{
                            is_deleted:1
                        }
                    })

                    return {
                        message:"Successfully deleted"
                    }
                } catch (error) {
                    return new GraphQLError(error)
                }
            }
        })
    }
})


// export const CreateMedicineInputs = inputObjectType({
//     name:'CreateMedicineInputs',
//     definition(t) {
//         t.string('generic_name');
//         t.string('dose');
//         t.string('form');
//         t.string('price');
//         t.string('manufacturer');
//         t.string('brand_name');
//     },
// })

export const UpdateMerchantMedicine = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateMerchantMedicine', {
            type: DeleteMerchantMedicineObj,
            args: { data: CreateMedicineInputs },
            async resolve(_root, args, ctx) {

                const {generic_name,brand_name, dose, form, price, manufacturer}:any = args.data

                try {
                    await client.merchant_medicine.update({
                        where:{
                            id:args?.data?.id
                        },
                        data:{
                            generic_name,
                            brand_name,
                            dose,
                            form,
                            
                            manufacturer
                        }
                    })

                    return {
                        message:"Successfully updated"
                    }
                } catch (error) {
                    return new GraphQLError(error)
                }
            }
        })
    }
})