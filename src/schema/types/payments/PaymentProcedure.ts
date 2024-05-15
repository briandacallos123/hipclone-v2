import { GraphQLError } from "graphql/error/GraphQLError";
import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { unserialize } from "php-serialize";

const client = new PrismaClient();

export const payment_procedures_category_obj = objectType({
  name: 'payment_procedures_category_obj',
  definition(t) {
    t.id('id');
    t.string('name');
    t.nullable.list.field('payment_procedures', {
      type: payment_procedures_obj,
    });
  },
});

const payment_procedures_obj = objectType({
  name: 'payment_procedures_obj',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('isDeleted');
  },
});

/////////////////////////////////////
//REQUEST PAYLOADS
export const payment_procedures_category_request = inputObjectType({
    name: 'payment_procedures_category_request',
    definition(t) {
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
                  name: {
                  contains: args?.data!.searchKeyword,
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
export const payment_procedures_transactions = objectType({
    name: "payment_procedures_transactions",
    definition(t) {
        t.nullable.list.field("procedures_category_data", {
          type: payment_procedures_category_obj,
        });
    },
});
///////////////////////////////////////


export const payment_procedures_category_data = extendType({
    type: 'Query',
    definition(t){
        t.nullable.field('payment_procedures_category_data',{
            type:payment_procedures_transactions,
            args:{data:payment_procedures_category_request},
            async resolve(_root, args, ctx){
                const {searchKeyword} : any = args.data;

                const whereconditions = filters(args);

                const {session} = ctx;
                await cancelServerQueryRequest(client,session?.user?.id,'`payment_procedures_category_data`','payment_procedures_transactions');
                let res: any = {};    
                try {
                    const[payment_procedures_category_obj,] : any = await client.$transaction([
                        client.payment_procedures_category.findMany({
                              include: {
                                payment_procedures: {
                                  where:{
                                    ...whereconditions 
                                  }
                                },
                              },
                        })
                    ]);

                    if (payment_procedures_category_obj) {
                      // Filter out items without payment_procedures
                      const filteredResults = payment_procedures_category_obj.filter((item: any)=> item.payment_procedures.length > 0);
                
                      // Return the filtered results
                      const response = {
                        procedures_category_data: filteredResults,
                      };
                      return response;
                    } else {
                      // No exact match found, return an empty array
                      return {
                        procedures_category_data: [],
                      };
                    }

                    
                }catch (error) {
                    console.log(error)
                  }
              return {
                procedures_category_data: [],
              };
            }
        })
    }
})