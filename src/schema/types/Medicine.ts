import { extendType, inputObjectType, list, objectType } from 'nexus';

import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import { storeType } from './Store';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { prescriptions, prescriptions_child } from './Prescriptions';

export const medicineType = objectType({
    name: 'medicineType',
    definition(t) {
        t.int('id')
        t.string('generic_name');
        t.string('brand_name');
        t.string('dose');
        t.int('stock');
        t.int('quantity_sold');
        t.int('show_price')
        t.string('form');
        t.string('description')
        t.string('type')
        t.float('price');
        t.string('manufacturer');
        t.nullable.field('attachment_info', {
            type: attachment_info
        });
        t.nullable.field('merchant_store', {
            type: storeType
        })
        // t.date('created_at');
    },
})

export const attachment_info = objectType({
    name: "attachment_info",
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
        t.nullable.int('totalRecords')
    },
})

export const medicineInputType = inputObjectType({
    name: 'medicineInputType',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('search');
        t.nullable.int('store_id')
        t.nullable.string('userType');
        t.nullable.string('type');
        t.nullable.int('startPrice');
        t.nullable.int('endPrice');
        t.nullable.string('sort')

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

                const { take, skip, type, startPrice, sort, endPrice, userType, store_id, search }: any = args?.data;

                let merchantUser: any;
                let list_store: any;

                // for best selling sort.
                const sortBestSelling = () => {
                    if (sort === 'Best Selling') {
                        return {
                            orderBy: {
                                quantity_sold: 'desc'
                            }
                        }
                    } else if (sort === 'Latest Products') {
                        return {
                            orderBy: {
                                created_at: "desc"
                            }
                        }
                    } else if (sort === 'Name Descending') {
                        return {
                            orderBy: {
                                generic_name: "desc"
                            }
                        }
                    } else if (sort === 'Name Ascending') {
                        return {
                            orderBy: {
                                generic_name: "asc"
                            }
                        }
                    }
                }
                const sortOptions = sortBestSelling()

                // end of sort options
                try {

                    if (!userType) {

                        merchantUser = await client.merchant_user.findUnique({
                            where: {
                                id: Number(session?.user?.id)
                            }
                        })

                        list_store = await client.merchant_store.findMany({
                            where: {
                                merchant_id: Number(merchantUser?.id),
                                is_deleted: 0
                            },
                            select: {
                                id: true
                            }
                        })
                    }



                    //   }

                    const typeCondition = () => {
                        if (type) {
                            return {
                                type
                            }
                        }
                    }

                    const priceCondition = () => {
                        if (startPrice && endPrice) {
                            return {
                                price: {
                                    gte: startPrice,
                                    lte: endPrice
                                }
                            }
                        } else if (startPrice) {
                            return {
                                price: {
                                    gte: startPrice
                                }
                            }
                        } else if (endPrice) {
                            return {
                                price: {
                                    lte: endPrice
                                }
                            }
                        }
                    }

                    const storeId = (() => {
                        let store_id: any;

                        if (store_id) {
                            store_id = Number(store_id);

                        }
                        return store_id
                    })()


                    //   const storeCon = storeCondition()
                    const priceCon = priceCondition()
                    const typeCon = typeCondition()

                    const [result, totalRecords]: any = await client.$transaction([
                        client.merchant_medicine.findMany({
                            take,
                            skip,
                            where: {
                                is_deleted: 0,
                                stock: {
                                    not: 0
                                },
                                // ...storeCon,
                                ...storeId,
                                ...priceCon,
                                ...typeCon,

                                generic_name: {
                                    contains: search
                                },


                            },
                            include: {
                                merchant_store: true
                            },
                            ...sortOptions,
                        }),
                        client.merchant_medicine.count({
                            where: {
                                is_deleted: 0,
                                store_id: Number(store_id),
                            }
                        })
                    ])


                    const res = result?.map(async (item: any) => {
                        const r = await client.medecine_attachment.findFirst({
                            where: {
                                id: Number(item?.attachment_id)
                            }
                        })

                        let paymentAttachment;
                        if (item?.merchant_store?.online_payment) {

                            const onlinePayment = await client.online_payment.findFirst({
                                where: {
                                    id: Number(item?.merchant_store?.online_payment)
                                }
                            })

                            const pAttachment = await client.order_payment_attachment.findFirst({
                                where: {
                                    id: Number(onlinePayment?.id)
                                }
                            });

                            paymentAttachment = {
                                ...onlinePayment,
                                ...pAttachment
                            }
                        }



                        return { ...item, attachment_info: { ...r }, merchant_store: { ...item.merchant_store, onlinePayment: { ...paymentAttachment } } }
                    })

                    const fResult = await Promise.all(res)






                    return {
                        MedicineType: fResult,
                        totalRecords
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

                const { take, skip, type, startPrice, sort, endPrice, userType, store_id, search }: any = args?.data;

                const sortBestSelling = () => {
                    if (sort === 'Best Selling') {
                        return {
                            orderBy: {
                                quantity_sold: 'desc'
                            }
                        }
                    } else if (sort === 'Latest Products') {
                        return {
                            orderBy: {
                                created_at: "desc"
                            }
                        }
                    } else if (sort === 'Name Descending') {
                        return {
                            orderBy: {
                                generic_name: "desc"
                            }
                        }
                    } else if (sort === 'Name Ascending') {
                        return {
                            orderBy: {
                                generic_name: "asc"
                            }
                        }
                    }
                }
                const sortOptions = sortBestSelling()
                console.log(sortOptions, 'SORT OPTIONS_______________________')

                const storeId = (() => {
                    let store_id: any;

                    if (store_id) {
                        store_id = Number(store_id);

                    }
                    return store_id
                })()


                const priceCondition = () => {
                    if (startPrice && endPrice) {
                        return {
                            price: {
                                gte: startPrice,
                                lte: endPrice
                            }
                        }
                    } else if (startPrice) {
                        return {
                            price: {
                                gte: startPrice
                            }
                        }
                    } else if (endPrice) {
                        return {
                            price: {
                                lte: endPrice
                            }
                        }
                    }
                }

                const typeCondition = () => {
                    if (type) {
                        return {
                            type
                        }
                    }
                }

                const priceCon = priceCondition()
                const typeCon = typeCondition()

                try {
                    const result = await client.merchant_medicine.findMany({
                        take,
                        skip,
                        where: {
                            ...storeId,
                            ...typeCon,
                            ...priceCon,

                            is_deleted: 0,
                            store_id: Number(args?.data?.store_id),
                            stock: {
                                not: {
                                    equals: 0
                                }
                            },
                            generic_name: {
                                contains: search
                            },
                        },
                        ...sortOptions,
                    })
                    const res = result?.map(async (item: any) => {
                        const r = await client.medecine_attachment.findFirst({
                            where: {
                                id: Number(item?.attachment_id)
                            }
                        })
                        return { ...item, attachment_info: { ...r } }
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
                    const res = result?.map(async (item: any) => {
                        const r = await client.medecine_attachment.findFirst({
                            where: {
                                id: Number(item?.attachment_id)
                            }
                        })
                        return { ...item, attachment_info: { ...r } }
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
        t.float('price');
        t.string('manufacturer');
        t.string('brand_name');
        t.int('stock')
        t.nullable.int('id')
        t.string('description');
        t.int('store_id')
        t.string('type')
        t.boolean('show_price')
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

                const { generic_name, stock, show_price, type, description, store_id, brand_name, dose, form, price, manufacturer }: any = args.data

                try {
                    let med: any;
                    if (sFile) {
                        const res: any = useUpload(sFile, 'public/documents/');

                        med = await client.medecine_attachment.create({
                            data: {
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
                            brand_name,
                            stock,
                            description,
                            type,
                            price,
                            attachment_id: Number(med?.id),
                            store_id: Number(store_id),
                            show_price: (() => {
                                if (!show_price) {
                                    return 0
                                } else {
                                    return 1
                                }
                            })()
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
            args: { data: CreateMedicineInputs, file: 'Upload' },
            async resolve(_root, args, ctx) {





                try {

                    let med: any;
                    const sFile = await args?.file;
                    if (typeof (sFile) !== "string") {
                        const res: any = useUpload(sFile, 'public/documents/');

                        med = await client.medecine_attachment.create({
                            data: {
                                filename: String(res[0]!.fileName),
                                file_path: String(res[0]!.path),
                                file_type: String(res[0]!.fileType),
                                file_size: String(res[0]!.file_size)
                            }
                        })

                    }


                    // console.log(med,'MEDECINE________________________________ KOTOOOOOOOOOOOOOOOOO')
                    const { id, generic_name, brand_name, type, dose, stock, description, form, price, manufacturer }: any = args.data

                    await client.merchant_medicine.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            generic_name,
                            brand_name,
                            dose,
                            form,
                            type,
                            manufacturer,
                            stock,
                            price,
                            description,
                            attachment_id: med && Number(med?.id)
                        }
                    })

                    return {
                        message: "Successfully updated"
                    }
                } catch (error) {
                    console.log(error, 'ERRORRRRRRRR')
                    return new GraphQLError(error)
                }
            }
        })
    }
})


export const QuerySinelgMedecineInp = inputObjectType({
    name: "QuerySinelgMedecineInp",
    definition(t) {
        t.int('id')
    },
})

export const QuerySingleMedecine = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QuerySingleMedecine', {
            type: medicineType,
            args: { data: QuerySinelgMedecineInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;

                try {
                    const result = await client.merchant_medicine.findUnique({
                        where: {
                            id: Number(args?.data?.id)
                        }
                    })

                    const r = await client.medecine_attachment.findFirst({
                        where: {
                            id: Number(result?.attachment_id)
                        }
                    })

                    const store = await client.merchant_store.findFirst({
                        where: {
                            id: Number(result?.store_id)
                        }
                    })

                    const fResult = { ...result, attachment_info: { ...r }, merchant_store: { ...store } }


                    return fResult;

                } catch (error) {
                    throw new Error(error)
                }
            }
        })
    }
});

const QueryAllMedecineForMerchantInp = inputObjectType({
    name: "QueryAllMedecineForMerchantInp",
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('search');
        t.nullable.int('supply')
        t.nullable.string('orderBy');
        t.nullable.string('orderDir');

        // t.nullable.string('type');
        // t.nullable.int('startPrice');
        // t.nullable.int('endPrice');
        // t.nullable.string('sort')

    },
})

const QueryAllMedecineForMerchantObj = objectType({
    name: "QueryAllMedecineForMerchantObj",
    definition(t) {
        t.list.field("all", {
            type: medicineType
        });
        t.nullable.field('summaryObjMerchant', {
            type: summaryObjMerchant
        })
    },
})

const summaryObjMerchant = objectType({
    name: "summaryObjMerchant",
    definition(t) {
        t.int('total')
        t.int('shortSupply')
    },
})

export const QueryAllMedecineForMerchant = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMedecineForMerchant', {
            type: QueryAllMedecineForMerchantObj,
            args: { data: QueryAllMedecineForMerchantInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { take, skip, search, supply, orderBy, orderDir }: any = args?.data;

                let allStoreByMerchant: any = await client.merchant_store.findMany({
                    where: {
                        merchant_id: Number(session?.user?.id),
                    }
                })
                allStoreByMerchant = allStoreByMerchant?.map((item) => Number(item?.id))

                const isSupply = (() => {
                    let stock: any;

                    if (supply === 1) {
                        stock = {
                            stock: {
                                lte: 10
                            }
                        }
                    }
                    return stock;
                })();

                let order;
                switch (orderBy) {
                    case "name":
                        {
                            order = [
                                {
                                    generic_name: orderDir
                                }
                            ]
                        }
                        break;
                    case "store":
                        {
                            order = [
                                {
                                    merchant_store: {
                                        name: orderDir
                                    }
                                }
                            ]
                        }
                        break;
                    case "stock":
                        {
                            order = [
                                {
                                    stock: orderDir
                                }
                            ]
                        }
                        break;
                    case "price":
                        {
                            order = [
                                {
                                    price: orderDir
                                }
                            ]
                        }
                        break;
                    default:
                        {
                            order = [
                                {
                                    id: orderDir
                                }
                            ]
                        }

                }

                let orderConditions = {
                    orderBy: order,
                };



                const isSearch = (() => {
                    let searchVal: any;
                    const containsNumber = /\d/.test(search);


                    if (!containsNumber) {
                        searchVal = {
                            generic_name: {
                                contains: search
                            }
                        }
                    } else if (containsNumber) {
                        searchVal = {
                            id: Number(search)
                        }
                    };

                    return searchVal;
                })()


                const [all, totalRecords, shortSupply]: any = await client.$transaction([
                    client.merchant_medicine.findMany({
                        take,
                        skip,
                        where: {
                            store_id: {
                                in: allStoreByMerchant
                            },
                            is_deleted: 0,
                            ...isSearch,
                            ...isSupply
                        },
                        include: {
                            merchant_store: true
                        },
                        ...orderConditions
                    }),
                    client.merchant_medicine.findMany({
                        where: {
                            store_id: {
                                in: allStoreByMerchant
                            },
                            is_deleted: 0
                        }
                    }),
                    client.merchant_medicine.findMany({
                        where: {
                            stock: {
                                lte: 10
                            },
                            store_id: {
                                in: allStoreByMerchant
                            },
                            is_deleted: 0
                        }
                    }),
                ]);

                const res = all?.map(async (item: any) => {
                    const r = await client.medecine_attachment.findFirst({
                        where: {
                            id: Number(item?.attachment_id)
                        }
                    })

                    const merchantStore = await client.attachment_store.findFirst({
                        where: {
                            id: Number(item?.merchant_store?.id)
                        }
                    })


                    return { ...item, attachment_info: { ...r }, merchant_store: { ...item.merchant_store, attachment_store: { ...merchantStore } } }
                })

                const fResult = await Promise.all(res)

                return {
                    all: fResult,
                    summaryObjMerchant: {
                        total: totalRecords.length,
                        shortSupply: shortSupply.length
                    }
                }
            }
        })
    }
});

const UpdateMerchantStockObj = objectType({
    name: "UpdateMerchantStockObj",
    definition(t) {
        t.string("message")
    },
})

const UpdateMerchantStockInp = inputObjectType({
    name: "UpdateMerchantStockInp",
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.int("stock");
    },
})

export const UpdateMerchantStock = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('UpdateMerchantStock', {
            type: UpdateMerchantStockObj,
            args: { data: UpdateMerchantStockInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { id, stock }: any = args?.data;

                try {
                    await client.merchant_medicine.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            stock
                        }
                    })

                    let content = await client.merchant_records_content.create({
                        data: {
                            title: "stock updated"
                        }
                    })
                    await client.merchant_records.create({
                        data: {
                            content_id: Number(content?.id),
                            created_by: Number(session?.user?.id),
                            medecine_id: Number(id)
                        }
                    })

                    return {
                        message: "Updated successfully"
                    }


                } catch (error) {
                    console.log(error);
                    throw new GraphQLError(error)
                }

            }
        })
    }
});


const QueryAllMedicinesInp = inputObjectType({
    name: "QueryAllMedicinesInp",
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('search')
    },
})

const medicine_data = objectType({
    name: "medicine_data",
    definition(t) {
        t.nullable.string('GenericName');
        t.nullable.string('Dose');
        t.nullable.string('Form');
        t.nullable.string('Price');
        t.nonNull.int('ID');
    },
})

const QueryAllMedicinesType = objectType({
    name: "QueryAllMedicinesType",
    definition(t) {
        t.list.field('medicine_data', {
            type: medicine_data
        });
        t.nullable.int('total_records');
    },
})

export const QueryAllMedicines = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMedicines', {
            type: QueryAllMedicinesType,
            args: { data: QueryAllMedicinesInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { take, skip, search }: any = args?.data;

                let toSearch = (() => {
                    if (search) {
                        return {
                            GenericName: {
                                contains: search
                            }
                        }
                    }
                })()

                try {
                    const [medData, totalRecords]: any = await client.$transaction([
                        client.medicine.findMany({
                            take,
                            skip,
                            where: {
                                ...toSearch
                            }
                        }),
                        client.medicine.findMany({
                            where: {
                                ...toSearch
                            }
                        })
                    ])
                    return {
                        medicine_data: medData,
                        total_records: totalRecords?.length
                    }
                } catch (error) {
                    throw new GraphQLError(error)
                }

            }
        })
    }
});

const QueryAllFavoritesObj = objectType({
    name: "QueryAllFavoritesObj",
    definition(t) {
         t.list.field('prescription', {
            type: prescriptions
        })
    }
})

const QueryAllFavoritesInp = inputObjectType({
    name: "QueryAllFavoritesInp",
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('search');
    },
})

export const QueryAllFavorites = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllFavorites', {
            type: QueryAllFavoritesObj,
            args: { data: QueryAllFavoritesInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { take, skip, search } = args?.data


                const isSearch = (() => {
                    if (search) {
                        return {
                            MEDICINE: {
                                contains: search
                            }
                        }
                    }
                })()

                try {
                    const doctorInfo = await client.employees.findFirst({
                        where: {
                            EMP_EMAIL: session?.user?.email
                        }
                    })

                


                    const [prescription]: any = await client.$transaction([
                        client.prescriptions.findMany({
                            where:{
                                doctorID:Number(doctorInfo?.EMP_ID),
                                template_id:{
                                    not:null
                                }
                            },
                            include:{
                                prescription_template:true
                            }
                        })
                    ]);

                    console.log(prescription,'yawaaaaaaa')

                    return {
                        prescription
                    }

                } catch (error) {
                    console.log(error)
                }

            }
        })
    }
});


const QueryAllTemplatesObj = objectType({
    name: "QueryAllTemplatesObj",
    definition(t) {
        t.list.field('allPrescriptions',{
            type:allPrescriptions
        })
    },
})

const allPrescriptions = objectType({
    name:'allPrescriptions',
    definition(t) {
        t.int('ID');
        t.field('prescription_template',{
            type:prescription_template
        })
        t.list.field('prescription_child',{
            type:prescriptions_child
        })
    },
})

const prescription_template = objectType({
    name:'prescription_template',
    definition(t) {
        t.int('id');
        t.string('name');
    },
})



export const QueryAllTemplates = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllTemplates', {
            type: QueryAllTemplatesObj,
            args: { data: QueryAllFavoritesInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;
                const { take, skip, search } = args?.data


                const isSearch = (() => {
                    if (search) {
                        return {
                            MEDICINE: {
                                contains: search
                            }
                        }
                    }
                })()

                try {
                    const doctorInfo = await client.employees.findFirst({

                        where: {
                            EMP_EMAIL: session?.user?.email
                        }
                    })

                    const [prescription]: any = await client.$transaction([
                        client.prescriptions.findMany({
                            where:{
                                template_id:{
                                    not:null
                                },
                                doctorID:Number(doctorInfo?.EMP_ID)
                            },
                            include:{
                                prescription_template:true
                            }
                        }),
                       
                       
                    ]);

                    let allPrescriptions = prescription.map(async(item)=>{
                        const result = await client.prescriptions_child.findMany({
                            where:{
                                ID:Number(item?.ID)
                            }
                        });

                        return {
                            ...item,
                            prescription_child:[...result]
                        }
                       
                    })

                    allPrescriptions = await Promise.all(allPrescriptions)

                    

                    return {
                        allPrescriptions
                    }

                } catch (error) {
                    console.log(error)
                }

            }
        })
    }
});