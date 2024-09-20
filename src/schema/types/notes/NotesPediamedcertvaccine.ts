import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const client = new PrismaClient();

export const NotesPedCertObj = objectType({
  name: 'NotesPedCertObj',
  definition(t) {
    t.id('id');
    t.int('InOutPatient');
    t.int('patientID');
    t.int('doctorID');
    t.int('clinic');
    t.int('report_id');
    t.string('dateCreated');
    t.string('diagnosis');
    t.string('eval');
    t.int('VISIBILITY');
    t.int('isDeleted');
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesVaccine });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesVaccine });
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesVaccine });
  },
});

const ClinicObjectFields4NotesVaccine = objectType({
  name: 'ClinicObjectFields4NotesVaccine',
  definition(t) {
    t.id('id');
    t.int('doctor_idno');
    t.string('clinic_name');
    t.string('number');
    t.string('location');
    t.string('Province');
    t.int('isDeleted');
  },
});

const PatientObjectFields4NotesVaccine = objectType({
  name: 'PatientObjectFields4NotesVaccine',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.string('FNAME');
    t.string('LNAME');
    t.string('MNAME');
    t.string('EMAIL');
    t.string('BDAY');
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

const DoctorObjectFields4NotesVaccine = objectType({
  name: 'DoctorObjectFields4NotesVaccine',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesVaccine,
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
      type: ClinicObjectFields4NotesVaccine,
      async resolve(root, args, _ctx) {
        const result: any = await client.clinic.findMany({
          where: {
            doctor_idno: String(root.EMPID),
            isDeleted: 0,
            NOT: [{ isDeleted: null }, { clinic_name: '' }],
          },
        });

        return result;
      },
    });

    t.string('EMP_FULLNAME');
    t.list.field('esig_dp', {
      type: pedcert_esig_dp_picture,
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
const pedcert_esig_dp_picture = objectType({
  name: 'pedcert_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4NotesVaccine = objectType({
  name: 'SpecializationObjectFields4NotesVaccine',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4Vacc = objectType({
  name: 'RecordObjectFields4Vacc',
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
      type: ClinicObjectFields4NotesVaccine,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesVaccine,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesVaccine,
    });
    t.nullable.field('noteVaccInfo', {
      type: NotesPedCertObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_pediamedcertvaccine.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NotesPedCertObjInputType = inputObjectType({
  name: 'NotesPedCertObjInputType',
  definition(t) {
    t.nullable.int('reportID');
    // record
    t.nullable.int('clinic');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('isLinked');
    t.nullable.string('R_TYPE');
    t.nullable.int('isEMR');
    t.nullable.int('pedia_id');
    t.nullable.int('R_ID');

    // vacc
    t.nullable.int('InOutPatient');
    t.nullable.string('dateCreated');
    t.nullable.string('diagnosis');
    t.nullable.string('eval');
  },
});

export const QueryNotesPedCertObj = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesPedCertObj', {
      type: NotesPedCertObj,
      args: { data: NotesPedCertObjInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_pediamedcertvaccine`',
          '`QueryNotesPedCertObj`'
        );
        const result: any = await client.notes_pediamedcertvaccine.findFirst({
          where: {
            report_id: Number(args?.data!.reportID),
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

export const PostNotesVacc = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesVacc', {
      type: RecordObjectFields4Vacc,
      args: { data: NotesPedCertObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;
          let isExists = true;
          let VoucherCode: any;

          while (isExists) {
            VoucherCode = Math.random().toString(36).substring(2, 8).toUpperCase()

            const result = await client.prescriptions.findFirst({
              where: {
                presCode: VoucherCode
              }
            })

            if (!result) {
              isExists = false;
            }
          }

          console.log(VoucherCode,'VOUCHER CODEEEEEEEEEE')

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordVacc = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 9
                doctorID: Number(session?.user?.id),
                isEMR: Number(0),
                qrcode:VoucherCode
              },
            });
            const newChild = await trx.notes_pediamedcertvaccine.create({
              data: {
                clinic: Number(recordVacc.CLINIC),
                patientID: Number(recordVacc.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),

                dateCreated: String(createData.dateCreated),
                InOutPatient: Number(createData.InOutPatient),
                diagnosis: String(createData.diagnosis),
                eval: String(createData.eval),

                doctorID: Number(session?.user?.id),
                report_id: Number(recordVacc.R_ID),

                // InOutPatient
                // dateCreated
                // diagnosis
                // eval
              },
            });
            return {
              ...recordVacc,
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

export const UpdateNotesVacc = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateNotesVacc', {
      type: RecordObjectFields4Vacc,
      args: { data: NotesPedCertObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;
        

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordVacc = await trx.records.update({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 9
                doctorID: Number(session?.user?.id),
                isEMR: Number(0)
              },
              where:{
                R_ID:Number(createData?.R_ID)
              }
            });
            const newChild = await trx.notes_pediamedcertvaccine.update({
              data: {
                clinic: Number(recordVacc.CLINIC),
                patientID: Number(recordVacc.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),

                dateCreated: String(createData.dateCreated),
                InOutPatient: Number(createData.InOutPatient),
                diagnosis: String(createData.diagnosis),
                eval: String(createData.eval),

                doctorID: Number(session?.user?.id),
                report_id: Number(recordVacc.R_ID),

                // InOutPatient
                // dateCreated
                // diagnosis
                // eval
              },
              where:{
                id:Number(createData?.pedia_id)
              }
            });
            return {
              ...recordVacc,
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

export const PostNotesVaccEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesVaccEMR', {
      type: RecordObjectFields4Vacc,
      args: { data: NotesPedCertObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;

          
         


          const notesTransaction = await client.$transaction(async (trx) => {
            const recordVacc = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE), // 9
                doctorID: Number(session?.user?.id),
                isEMR: Number(1)
              },
            });
            const newChild = await trx.notes_pediamedcertvaccine.create({
              data: {
                clinic: Number(recordVacc.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                isEMR: Number(1),

                dateCreated: String(createData.dateCreated),
                InOutPatient: Number(createData.InOutPatient),
                diagnosis: String(createData.diagnosis),
                eval: String(createData.eval),

                doctorID: Number(session?.user?.id),
                report_id: Number(recordVacc.R_ID),

                // InOutPatient
                // dateCreated
                // diagnosis
                // eval
              },
            });
            return {
              ...recordVacc,
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
