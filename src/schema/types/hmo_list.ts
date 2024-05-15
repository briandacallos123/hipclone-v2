import { GraphQLError } from "graphql/error/GraphQLError";
import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { unserialize } from "php-serialize";

const client = new PrismaClient();

export const hmo = objectType({
    name: 'hmo',
    definition(table_column) {
        table_column.id('id');
        table_column.string('name');
    }
});

export const hmo_list = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.list.field('hmo_list', {
            type: hmo,
            async resolve(_root, args, ctx) {
                const result: any = await client.hmo.findMany()
                return result
            }
        });
    }
});