import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';

const client = new PrismaClient();

export const NoteTxtAttachObj = objectType({
  name: 'NoteTxtAttachObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('doctorID');
    t.string('patient');
    t.string('doctor');
    t.string('clinic');
    t.int('notes_text_id');
    t.string('file_name');
    t.string('file_url');
    t.string('file_size');
    t.string('file_type');
    t.dateTime('date');
    t.int('isDeleted');
  },
});

export const NoteTxtAttachInputType = inputObjectType({
  name: 'NoteTxtAttachObjInputType',
  definition(t) {
    t.nullable.int('patientID');
  },
});

export const QueryNoteTxtAttach = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNoteTxtAttach', {
      type: NoteTxtAttachObj,
      args: { data: NoteTxtAttachInputType! },
      async resolve(_root, args, _ctx) {
        const result: any = await client.notes_text_attachments.findFirst({
          where: {
            patient: '10000010',
          },
        });
        return result;
      },
    });
  },
});
