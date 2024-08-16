import { extendType, inputObjectType, list, objectType } from 'nexus';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { unserialize } from 'php-serialize';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import { storeType } from './Store';
import { orderType } from './Orders';
import { merchantType } from './Merchant';
import { medicineType } from './Medicine';
import { notEqual } from 'assert';


const merchant_content = objectType({
    name:"merchant_content",
    definition(t) {
        t.int('id');
        t.string('title');
        t.dateTime('created_at');
    },
})

export const merchantLogs = objectType({
    name: "merchantLogs",
    definition(t) {
        t.nullable.field('order',{
            type:orderType,
            async resolve(root){
                if(!root?.order_id) return null;
                const data = await client?.orders.findFirst({
                    where:{
                        id:Number(root?.order_id)
                    }
                });
                return data;
            }
        });
        t.nullable.field('store',{
            type:storeType,
            async resolve(root){
                if(!root?.store_id) return null

                const data = await client?.merchant_store.findFirst({
                    where:{
                        id:Number(root?.store_id)
                    }
                });
                return data;
            }
        });
        t.nullable.field('content',{
            type:merchant_content,
            async resolve(root){
                if(!root?.content_id) return null

                const data = await client?.merchant_records_content.findFirst({
                    where:{
                        id:Number(root?.content_id)
                    }
                });
                return data;
            }
        });
        t.nullable.field('createdBy',{
            type:merchantType,
            async resolve(root){

                if(!root?.created_by) return null

                const data = await client?.merchant_user.findFirst({
                    where:{
                        id:Number(root?.created_by)
                    }
                });
                return data;
            }
        });
        t.nullable.field('medecine',{
            type:medicineType,
            async resolve(root){

                if(!root?.medecine_id) return null

                const data = await client?.merchant_medicine.findFirst({
                    where:{
                        id:Number(root?.medecine_id)
                    }
                });
                return data;
            }
        });
        t.nullable.dateTime('created_at');
        t.nonNull.int('id')
    },
})

export const merchantLogsInp = inputObjectType({
    name: 'merchantLogsInp',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('search');
        t.nullable.string('orderBy');
        t.nullable.string('orderDir');
        t.nullable.int('status');

    },
});


export const merchantLogsResponse = objectType({
    name:"merchantLogsResponse",
    definition(t) {
        t.list.field('merchantLogs',{
            type:merchantLogs,
        });
        t.field('summary',{
            type:merchantSummary,
        })
    },
})

export const merchantSummary = objectType({
    name:"merchantSummary",
    definition(t) {
        t.int('totalRecords');
        t.int('orderTotal');
        t.int('medicineTotal');
        t.int('storeTotal');

    },
})

export const QueryAllMerchantLogs = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('QueryAllMerchantLogs', {
            type: merchantLogsResponse,
            args: { data: merchantLogsInp },
            async resolve(_root, args, ctx) {
                const { session } = ctx;

                const { take, skip, search, orderBy, orderDir, status }: any = args?.data;

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
                    case "date":
                        {
                            order = [
                                {
                                    created_at:orderDir
                                }
                            ]
                        }
                        break;
                    case "action":
                        {
                            order = [
                                {
                                    content_id:orderDir
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

                const isSearch = (()=>{
                    let f:any;

                    if(search){
                        f = {
                            id:Number(search)
                        }
                    }
                    return f;
                })()

                const statusF = (()=>{
                    let f:any;
                    if(status === 1){
                        f = {
                            order_id:{
                                not:null
                            }
                        }
                    }else if(status === 2){
                        f = {
                            medecine_id:{
                                not:null
                            }
                        }
                    }else if(status === 3){
                        f = {
                            store_id:{
                                not:null
                            }
                        }
                    }
                    return f;
                })()

              

                const [result, totalRecords, orderRelated, medecineRelated, storeRelated]:any = await client.$transaction([
                    client.merchant_records.findMany({
                        take,
                        skip,
                        where:{
                            is_deleted:0,
                            created_by:session?.user?.id,
                            ...statusF,
                            ...isSearch
                        },
                        ...orderConditions
                    }),
                    client.merchant_records.findMany({
                        where:{
                            is_deleted:0,
                            created_by:session?.user?.id
                        },
                        ...orderConditions
                    }),
                    client.merchant_records.findMany({
                        where:{
                            is_deleted:0,
                            created_by:session?.user?.id,
                            order_id:{
                               not:null
                            }
                        },
                        ...orderConditions
                    }),
                    client.merchant_records.findMany({
                        where:{
                            is_deleted:0,
                            created_by:session?.user?.id,
                            medecine_id:{
                                not:null
                            }
                        },
                        ...orderConditions
                    }),
                    client.merchant_records.findMany({
                        where:{
                            is_deleted:0,
                            created_by:session?.user?.id,
                            store_id:{
                                not:null
                            }
                        },
                        ...orderConditions
                    })
                ]);

                console.log(totalRecords?.length,'COUNTTTTTTTTT');
                

               
                return {
                    merchantLogs:result,
                    summary:{
                        totalRecords:totalRecords?.length,
                        orderTotal:orderRelated?.length,
                        medicineTotal:medecineRelated?.length,
                        storeTotal:storeRelated?.length
                    }
                }

            }
        })
    }
});

