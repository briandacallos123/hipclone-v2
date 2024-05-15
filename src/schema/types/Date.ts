import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime,
  GraphQLBigInt,
  GraphQLJSON,
  GraphQLCurrency,
} from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const dateResolver = asNexusMethod(GraphQLDate, 'date');
export const dateTimeResolver = asNexusMethod(GraphQLDateTime, 'dateTime');
export const timeResolver = asNexusMethod(GraphQLTime, 'time');
export const bigInt = asNexusMethod(GraphQLBigInt, 'bigInt');
export const jsonResolver = asNexusMethod(GraphQLJSON, 'JSON');
export const doubleResolver = asNexusMethod(GraphQLCurrency, 'double');
