import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';

const client = new PrismaClient();

const GetLinkedAccType = objectType({
  name: 'GetLinkedAccType',
  definition(t) {
    t.string('message');
    t.nullable.field('data', {
      type: emr_data_types,
      async resolve(_parent) {
        const { data } = _parent;

        const result = await client.emr_patient.findFirst({
          where: {
            id: data?.patientInfo?.S_ID,
            link: 1,
          },
        });

        // console.log(result, 'result@@');
        // console.log('RESULT: ', result);
        return result;
      },
    });
  },
});
const emr_data_types = objectType({
  name: 'emr_data_types',
  definition(t) {
    t.bigInt('id');
    t.bigInt('idno');
    t.string('fname');
    t.string('mname');
    t.string('lname');
    t.string('gender');
    t.string('contact_no');
    t.string('email');
    t.string('patientID');
    t.string('link');

    t.string('fullname');
  },
});

const GetLinkedAccInp = inputObjectType({
  name: 'GetLinkedAccInp',
  definition(t) {
    t.string('uuid');
  },
});

export const GetLinkedAcc = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('GetLinkedAcc', {
      type: GetLinkedAccType,
      args: { data: GetLinkedAccInp! },
      async resolve(_root, args, _ctx) {
        const { uuid }: any = args?.data;

        const result = await client.user.findFirst({
          where: {
            uuid: String(uuid),
          },
          include: {
            patientInfo: true,
          },
        });

        return {
          message: 'Successfully Queried',
          data: result,
        };
      },
    });
  },
});
