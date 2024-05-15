/* eslint-disable no-lone-blocks */
import { GraphQLError } from 'graphql/error/GraphQLError';
import { extendType, objectType, intArg, stringArg, inputObjectType } from 'nexus';
import { unserialize } from 'php-serialize';
import client from '../../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const UpdateDoctor = inputObjectType({
  name: 'UpdateDoctor',
  definition(t) {
    t.int('id'), t.int('type');
  },
});
const UpdateType = objectType({
  name: 'UpdateType',
  definition(t) {
    t.string('message');
    t.int('status');
  },
});

export const CreateDoctorAppointment = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('CreateDoctorAppointment', {
      type: UpdateType,
      args: { data: UpdateDoctor! },
      async resolve(_root, args, ctx) {
        const { id, type }: any = args?.data;
        const { session } = ctx;

        let updatedRecord: any;
        // 1 = done
        try {
          

          if(session.user?.role === "doctor"){
            if (type === 1) {
              const record: any = await client.appointments.findFirst({
                where: {
                  id,
                },
              });
              updatedRecord = await client.appointments.update({
                where: {
                  id,
                },
                data: {
                  ...record,
                  status: 3,
                },
              });
              //   cancelled
            } else {
              const record: any = await client.appointments.findFirst({
                where: {
                  id,
                },
              });
              updatedRecord = await client.appointments.update({
                where: {
                  id,
                },
                data: {
                  ...record,
                  status: 2,
                },
              });
            }
          }

          if(session.user?.role === "secretary")
          {
            const subPermissions : any  = await client.sub_account_doctor.findFirst({where:{
              secretaryID: session.user?.subAccId
            }});

            if(type === 2){
              if(Number(subPermissions?.appt_cancel) !== 1){
                  throw new GraphQLError("Unauthorized");
              }    
            }
            if(type === 1){
              if(Number(subPermissions?.appt_done) !== 1){
                  throw new GraphQLError("Unauthorized");
              }    
            }

            if (type === 1) {
              const record: any = await client.appointments.findFirst({
                where: {
                  id,
                },
              });
              updatedRecord = await client.appointments.update({
                where: {
                  id,
                },
                data: {
                  ...record,
                  status: 3,
                },
              });
              //   cancelled
            } else {
              const record: any = await client.appointments.findFirst({
                where: {
                  id,
                },
              });
              updatedRecord = await client.appointments.update({
                where: {
                  id,
                },
                data: {
                  ...record,
                  status: 2,
                },
              });
            }
          }

         


        } catch (err) {
          throw new Error(err);
        }

        return {
          message: 'Updated Successfully',
          status: 200,
        };
      },
    });
  },
});
