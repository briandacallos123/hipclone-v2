import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';

const client = new PrismaClient();

export const NotesColonObj = objectType({
  name: 'NotesColonObj',
  definition(t) {
    t.id('id');
    t.string('record_id');
    t.string('patient_no');
    t.string('doctor_no');
    t.string('clinic');
    t.string('address');
    t.string('hmo');
    t.string('hmotext');
    t.string('isprivate');
    t.string('outpatient');
    t.string('philhealth');
    t.string('housecase');
    t.string('others');
    t.string('otherstext');
    t.string('bleeding');
    t.string('occultblood');
    t.string('freshbleeding');
    t.string('melena');
    t.string('hematochezia');
    t.string('mass');  
    t.string('executivecheckup');
    t.string('others2');
    t.string('otherstext2');
    t.string('preendoscopicimpression');
    t.string('othermedicalconditions');
    t.string('anoscopy');
    t.string('proctosigmoidoscopy');
    t.string('colonoscopy');
    t.string('colonoscopytext');
    t.string('interventions');
    t.string('impression');
    t.string('suggestions');
    t.int('isDeleted');
  },
});

export const NotesColontInputType = inputObjectType({
  name: 'NotesColontInputType',
  definition(t) {
    t.nullable.int('patientID');
  },
});

export const QueryNotesColon = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesColon', {
      type: NotesColonObj,
      args: { data: NotesColontInputType! },
      async resolve(_root, args, _ctx) {
        const result: any = await client.notes_colonoscopy.findFirst({
          where: {
            patient_no: '10000379',
          },
        });
        return result;
      },
    });
  },
});
