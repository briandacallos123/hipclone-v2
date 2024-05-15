import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const client = new PrismaClient();

export const NotePhysObj = objectType({
  name: 'NotePhysObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('doctorID');
    t.string('clinic');
    t.dateTime('date');
    t.string('report_id');
    t.string('vision_r');
    t.string('vision_l');
    t.string('pupils');
    t.string('glasses_lenses');
    t.string('hearing');
    t.string('bmi_status');
    t.string('bmi_comment');
    t.string('skin_status');
    t.string('skin_comment');
    t.string('heent_status');
    t.string('heent_comment');
    t.string('teeth_status');
    t.string('teeth_comment');
    t.string('neck_status');
    t.string('neck_comment');
    t.string('lungs_status');
    t.string('lungs_comment');
    t.string('heart_status');
    t.string('heart_comment');
    t.string('abdomen_status');
    t.string('abdomen_comment');
    t.string('gusystem_status');
    t.string('gusystem_comment');
    t.string('musculoskeletal_status');
    t.string('musculoskeletal_comment');
    t.string('backspine_status');
    t.string('backspine_comment');
    t.string('neurological_status');
    t.string('neurological_comment');
    t.string('psychiatric_status');
    t.string('psychiatric_comment');
  },
});


export const emrNotePhysObj = objectType({
  name: 'emrNotePhysObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('doctorID');
    t.string('clinic');
    t.dateTime('date');
    t.string('report_id');
    t.string('vision_r');
    t.string('vision_l');
    t.string('pupils');
    t.string('glasses_lenses');
    t.string('hearing');
    t.string('bmi_status');
    t.string('bmi_comment');
    t.string('skin_status');
    t.string('skin_comment');
    t.string('heent_status');
    t.string('heent_comment');
    t.string('teeth_status');
    t.string('teeth_comment');
    t.string('neck_status');
    t.string('neck_comment');
    t.string('lungs_status');
    t.string('lungs_comment');
    t.string('heart_status');
    t.string('heart_comment');
    t.string('abdomen_status');
    t.string('abdomen_comment');
    t.string('gusystem_status');
    t.string('gusystem_comment');
    t.string('musculoskeletal_status');
    t.string('musculoskeletal_comment');
    t.string('backspine_status');
    t.string('backspine_comment');
    t.string('neurological_status');
    t.string('neurological_comment');
    t.string('psychiatric_status');
    t.string('psychiatric_comment');
  },
});

export const NotePhysObjInputType = inputObjectType({
  name: 'NotePhysObjInputType',
  definition(t) {
    t.nullable.int('recordID');
  },
});

export const QueryNotePhys = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotePhys', {
      type: NotePhysObj,
      args: { data: NotePhysObjInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_physical`',
          '`QueryNotePhys`'
        );
        const result: any = await client.notes_physical.findFirst({
          where: {
            report_id: String(args?.data!.recordID),
          },
        });
        return result;
      },
    });
  },
});
