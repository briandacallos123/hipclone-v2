import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { useUpload } from '../../../hooks/use-upload';
import useGoogleStorage from '@/hooks/use-google-storage-uploads';
// import { useUpload } from '../';

const client = new PrismaClient();

export const NoteTxtObj = objectType({
  name: 'NoteTxtObj',
  definition(t) {
    t.id('id');
    t.nullable.field('patientInfo', { type: PatientObjectFields4Notestxt });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4Notestxt });
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4Notestxt });
    t.string('dateCreated');
    t.int('report_id');
    t.string('title');
    t.string('text_data');
    t.int('isDeleted');
    t.list.field('attachment', {
      type:NotesAttachment,
      async resolve(t){
        const attachment = await prisma?.notes_text_attachments.findMany({
          where:{
            notes_text_id:Number(t.id)
          }
        })
        return attachment;
      }
    })
  },
});

const NotesAttachment = objectType({
  name:"NotesAttachment",
  definition(t){
    t.string('file_name'),
    t.string('file_url'),
    t.bigInt('id')
  }
})

const PatientObjectFields4Notestxt = objectType({
  name: 'PatientObjectFields4Notestxt',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.string('FNAME');
    t.string('LNAME');
    t.string('MNAME');
    t.string('EMAIL');
    t.string('HOME_ADD');
    t.string('CONTACT_NO');
    t.int('SEX');
    t.nullable.string('BDAY');
    t.field('AGE', {
      type: 'Int',
      resolve: (parent) => {
        if (parent.BDAY) {
          // Calculate age based on BDAY field
          const birthDate = new Date(parent.BDAY);
          const currentDate = new Date();
          const age = currentDate.getFullYear() - birthDate.getFullYear();

          // Check if the birthday has occurred this year already
          if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() &&
              currentDate.getDate() < birthDate.getDate())
          ) {
            return age - 1;
          }

          return age;
        }

        return null; // Return null if BDAY is not provided
      },
    });
    t.int('STATUS');
    t.int('isDeleted');
  },
});

const ClinicObjectFields4Notestxt = objectType({
  name: 'ClinicObjectFields4Notestxt',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.string('clinic_name');
    t.string('number');
    t.string('location');
    t.string('Province');
    t.int('isDeleted');
  },
});

const DoctorObjectFields4Notestxt = objectType({
  name: 'DoctorObjectFields4Notestxt',
  definition(t) {
    t.int('EMP_ID');
    t.int('EMPID');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4Notestxt,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.specialization.findFirst({
          where: {
            id: Number(root?.SPECIALIZATION),
          },
        });

        return result;
      },
    });
    t.nullable.list.field('ClinicList', {
      type: ClinicObjectFields4Notestxt,
      async resolve(root, args, _ctx) {
        const result: any = await client.clinic.findMany({
          where: {
            doctorID: Number(root.EMPID),
            isDeleted: 0,
            NOT: [{ isDeleted: null }, { clinic_name: '' }],
          },
        });

        return result;
      },
    });

    t.string('EMP_FULLNAME');
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.list.field('esig_dp', {
      type: text_esig_dp_picture,
      async resolve(parent, _args, _ctx) {
        const esig_dp = await client.esig_dp.findMany({
          take: 1,
          where: {
            doctorID: Number(parent.EMP_ID)
          },
          orderBy: {
            id: 'desc',
          },
        });
        return esig_dp;
      },
    });
  },
});

///////////////////////////////////////////////////////
const text_esig_dp_picture = objectType({
  name: 'text_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4Notestxt = objectType({
  name: 'SpecializationObjectFields4Notestxt',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4Text = objectType({
  name: 'RecordObjectFields4Text',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('doctorID');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.dateTime('R_DATE');
    t.int('isDeleted');
    t.string('tempId');
    t.string('R_TYPE');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4Notestxt,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4Notestxt,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4Notestxt,
    });

    t.nullable.field('noteTxtInfo', {
      type: NoteTxtObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_text.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NoteTxtInputType = inputObjectType({
  name: 'NoteTxtInputType',
  definition(t) {
    // record
    t.nullable.int('recordID');
    t.nullable.int('CLINIC');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.string('tempId');
    t.nullable.int('emrPatientID');
    t.nullable.int('isLinked');
    t.nullable.string('R_TYPE');
    t.nullable.int('isEMR');
    // notes
    t.nullable.int('report_id');
    t.nullable.string('dateCreated');
    t.nullable.string('title');
    t.nullable.string('text_data');
  },
});
export const PostNotesTxtEMRInputs = inputObjectType({
  name: 'PostNotesTxtEMRInputs',
  definition(t) {
    // record
    t.nullable.int('recordID');
    t.nullable.int('CLINIC');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.string('tempId');
    t.nullable.int('emrPatientID');
    t.nullable.int('isLinked');
    t.nullable.string('R_TYPE');
    t.nullable.int('isEMR');
    // notes
    t.nullable.int('report_id');
    t.nullable.string('dateCreated');
    t.nullable.string('title');
    t.nullable.string('text_data');
  },
});

// export const NoteTxtChildInputType = inputObjectType({
//   name: 'NoteTxtChildInputType',
//   definition(t) {
//     t.nullable.int('report_id');
//     t.nullable.int('clinic');
//     t.nullable.int('doctorID');
//     t.nullable.int('patientID');
//     t.nullable.int('emrPatientID');
//     t.nullable.int('isEMR');
//     t.nullable.date('dateCreated');
//     t.nullable.string('title');
//     t.nullable.string('text_data');
//   },
// });

export const QueryNoteTxt = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNoteTxt', {
      type: NoteTxtObj,
      args: { data: NoteTxtInputType! },
      async resolve(_root, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`notes_text`', '`QueryNoteTxt`');
        const result: any = await client.notes_text.findFirst({
          where: {
            report_id: Number(args?.data!.recordID),
          },
          include: {
            patientInfo: true,
            doctorInfo: true,
            clinicInfo: true,
          },
        });
        return result;
      },
    });
  },
});

export const PostNotesTxt = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesTxt', {
      type: RecordObjectFields4Text,
      args: { data: NoteTxtInputType!, file:'Upload' },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');
        const sFile = await args?.file;
        console.log(sFile,'FILE@@@@@@@@@@@@@@')
        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;
          // console.log("TESTING BROOOO@@@@@@@@@@@@")
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordNotes = await trx.records.create({
              data: {
                CLINIC: Number(createData.CLINIC),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE),
                doctorID: Number(session?.user?.id),
                isEMR: Number(0),
              },
            });
            const newChild = await trx.notes_text.create({
              data: {
                clinic: Number(recordNotes.CLINIC),
                patientID: Number(recordNotes.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                dateCreated: String(createData.dateCreated),
                title: String(createData.title),
                text_data: String(createData.text_data),
                doctorID: Number(session?.user?.id),
                report_id: Number(recordNotes.R_ID),
              },
            });
           
            if (sFile) {
              // console.log(sFile, 'FILE@@@');
              const res: any = await useGoogleStorage(
                sFile,
                session?.user?.id,
                'feeds'
              );
  
              // const res: any = useUpload(sFile, 'public/documents/');
              res?.map(async (v: any) => {
                await client.notes_text_attachments.create({
                  data: {
                    patientID: Number(recordNotes.patientID),
                    doctorID: Number(session?.user?.id),
                    clinic: Number(recordNotes.CLINIC),
                    notes_text_id:Number(newChild?.id),
                    file_name: String(v!.path),
                    file_url: String(v!.path),
                   date:new Date()
                  },
                });
              });
            }
            return {
              ...recordNotes,
              ...newChild,
              // tempId: uuid,
            };
          });
          const res: any = notesTransaction;
          return res;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const PostNotesTxtEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesTxtEMR', {
      type: RecordObjectFields4Text,
      args: { data: PostNotesTxtEMRInputs!, file: 'Upload' },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;
          const sFile: any = await args?.file;

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordNotes = await trx.records.create({
              data: {
                CLINIC: Number(createData.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE),
                doctorID: Number(session?.user?.id),
                isEMR: Number(1),
              },
            });
            const newChild = await trx.notes_text.create({
              data: {
                clinic: Number(recordNotes.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                isEMR: Number(1),
                dateCreated: String(createData.dateCreated),
                title: String(createData.title),
                text_data: String(createData.text_data),
                doctorID: Number(session?.user?.id),
                report_id: Number(recordNotes.R_ID),
              },
            });

            if (sFile) {
              const res: any = useUpload(sFile, 'public/documents/');
              res?.map(async (v: any) => {
                await client.notes_text_attachments.create({
                  data: {
                    emrPatientID: createData?.emrPatientID,
                    doctorID: session?.user?.id,
                    clinic: Number(createData?.CLINIC),
                    notes_text_id: newChild?.id,
                    // userID: session?.user?.id,
                    // idno: String(result?.EMPID),
                    file_name: String(v!.fileName),
                    file_url: String(v!.path),
                  },
                });
              });
            }
            return {
              ...recordNotes,
              ...newChild,
              // tempId: uuid,
            };
          });
          const res: any = notesTransaction;
          return res;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});
