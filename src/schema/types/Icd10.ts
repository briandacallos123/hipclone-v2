import { GraphQLError } from "graphql/error/GraphQLError";
import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { unserialize } from "php-serialize";

const client = new PrismaClient();

export const icd10 = objectType({
    name: 'icd10',
    definition(t) {
        t.int('id'); 
        t.string('code');
        t.string('description');
    },
});


/////////////////////////////////////
//REQUEST PAYLOADS
export const icd_10_input_request = inputObjectType({
    name: 'icd_10_input_request',
    definition(t) {
        t.nullable.int('take');
        t.nullable.int('skip');
        t.nullable.string('orderBy');
        t.nullable.string('orderDir');
        t.nullable.string('searchKeyword');
    },
});
//REQUEST PAYLOADS
/////////////////////////////////////


/////////////////////////////////////
//FILTERS
const filters = (args: any) => {
    let where: any = {};
    let multicondition: any = {};

    if (args?.data?.searchKeyword) {
        where = {
            OR: [
                {
                    code: {
                        contains: String(args?.data?.searchKeyword)
                    },
                },
                {
                    description: {
                        contains: String(args?.data?.searchKeyword)
                    },
                },
            ],
        };
    }

    multicondition = {
        ...multicondition,
        ...{
            ...where, 
          },
    };
    return multicondition;
};
//FILTERS
////////////////////////////////////////////////////////////////////////// 



///////////////////////////////////////
export const icd_10_transactions = objectType({
    name: "icd_10_transactions",

    
    definition(t) {
        t.nullable.list.field("icd10_data", {
            type: icd10,
          });
          t.int("total_records");
          t.field("summary_total", {
            type: Summary_Total_icd10,
          });
    },
});
///////////////////////////////////////

   ////////////////////////////////////
  //SUMMARY TOTAL
  const Summary_Total_icd10 = objectType({
    name: 'Summary_Total_icd10',
    definition(summary_total) {
      summary_total.nullable.int('total');
    },
  });
  //SUMMARY TOTAL
  ////////////////////////////////////


export const get_all_icd_10 = extendType({
    type: 'Query',
    definition(t){
        t.nullable.field('get_all_icd_10',{
            type:icd_10_transactions,
            args:{data:icd_10_input_request},
            async resolve(_root, args, ctx){
                const { take, skip, orderBy, orderDir,searchKeyword} : any = args.data;

                let order: any ;
                switch(args?.data?.orderBy){
                    case 'code' : {
                        order = [{ code: args?.data?.orderDir }];
                    }
                    break;
                    case 'description' : {
                        order = [{ description: args?.data?.orderDir }];
                    }
                    break;
                default:
                    order = {};
                }

                const orderConditions = {
                    orderBy: order,
                };

                const whereconditions = filters(args);

                const {session} = ctx;
                await cancelServerQueryRequest(client,session?.user?.id,'`get_all_icd_10`','icd_10_input_request');
                let res: any = {};    
                try {
                    const[icd10,_count,count] : any = await client.$transaction([
                        client.icd10.findMany({
                            take,
                            skip,
                            where: {
                               ...whereconditions 
                              },
                          ...orderConditions
                        }),client.icd10.groupBy({
                            by: ['id'],
                            orderBy:{
                                id: 'desc'
                             },
                            where: {
                                ...whereconditions
                            },
                            _count: {
                              id: true,
                            },
                        }),client.icd10.aggregate({
                            where: {
                                ...whereconditions
                            },
                            _count: {
                              id: true,
                            },
                          }),
                    ]);

                    const _result: any = icd10;
                    const _total: any = count;
                    const _total_summary: any = _count;

                    let total = 0;
                    _total_summary.map((v: any) => (total += v?._count?.id))
                    const total_summary = {
                        total,
                    };
                    

                    const response: any = { 
                        icd10_data: _result,
                        total_records: Number(_total?._count?.id),
                        summary_total: total_summary
                      } 
                      
                      return response;
                    
                }catch (error) {
                    console.log(error)
                  }

            }
        })
    }
})