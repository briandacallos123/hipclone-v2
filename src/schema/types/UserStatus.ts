import { GraphQLError } from 'graphql/error/GraphQLError';
// import { PrismaClient } from '@prisma/client';
import { unserialize } from 'php-serialize';
import { extendType, inputObjectType, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';



export const UserObj = objectType({
    name:"UserObj",
    definition(t) {
        t.int('id');
        t.int('isOnline');
        t.string('email')
    },
})

export const UserInp = inputObjectType({
    name:"UserInp",
    definition(t) {
        t.int('id')
    },
})



export const Get_User_Status = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('Get_User_Status', {
        type: UserObj,
        args: { data: UserInp! },
        async resolve(_root, args, ctx) {
          
           try {
            const res = await client.user.findFirst({
                where:{
                    id:Number(args?.data?.id)
                }
            })

            return res;
           } catch (error) {
             console.log(error.message)
           }
        }
    })
}
})
