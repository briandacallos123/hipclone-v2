import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { isToday } from '@/utils/format-time';
import { GraphQLError } from 'graphql/error/GraphQLError';

const client = new PrismaClient();

export const notesAbsObj = objectType({
  name: 'notesAbsObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('doctorID');
    t.int('clinic');
    t.dateTime('dateCreated');
    t.int('report_id');
    t.string('complaint');
    t.string('illness');
    t.string('symptoms');
    t.string('pastmed');
    t.string('persoc');
    t.string('physical');
    t.string('labdiag');
    t.string('findings');
    t.string('finaldiag');
    t.string('complications');
    t.string('procedures');
    t.string('treatplan');
    t.int('isDeleted');
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesAbstract });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesAbstract });
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesAbstract });
  },
});

const ClinicObjectFields4NotesAbstract = objectType({
  name: 'ClinicObjectFields4NotesAbstract',
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

const PatientObjectFields4NotesAbstract = objectType({
  name: 'PatientObjectFields4NotesAbstract',
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

const DoctorObjectFields4NotesAbstract = objectType({
  name: 'DoctorObjectFields4NotesAbstract',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesAbstract,
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
      type: ClinicObjectFields4NotesAbstract,
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
      type: noteabstract_esig_dp_picture,
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
const noteabstract_esig_dp_picture = objectType({
  name: 'noteabstract_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4NotesAbstract = objectType({
  name: 'SpecializationObjectFields4NotesAbstract',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4Abs = objectType({
  name: 'RecordObjectFields4Abs',
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
      type: ClinicObjectFields4NotesAbstract,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesAbstract,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesAbstract,
    });
    t.nullable.field('noteAbsInfo', {
      type: notesAbsObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_abstract.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NoteAbstInputType = inputObjectType({
  name: 'NoteAbstInputType',
  definition(t) {
    t.nullable.int('isLinked');
    t.nullable.int('recordID');
    t.nullable.int('emrPatientID');
    // record
    t.nullable.int('clinic');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.string('R_TYPE');
    t.nullable.int('isEMR');
    t.nullable.int('recordId');
    t.nullable.int('abs_id');
    t.nullable.string('qrCode');

    // Abs
    t.nullable.string('complaint');
    t.nullable.string('illness');
    t.nullable.string('symptoms');
    t.nullable.string('pastmed');
    t.nullable.string('persoc');
    t.nullable.string('physical');
    t.nullable.string('labdiag');
    t.nullable.string('findings');
    t.nullable.string('finaldiag');
    t.nullable.string('complications');
    t.nullable.string('procedures');
    t.nullable.string('treatplan');
    t.nullable.string('dateCreated')
  },
});

export const QueryNotesAbstract = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesAbstract', {
      type: notesAbsObj,
      args: { data: NoteAbstInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_abstract`',
          '`QueryNotesAbstract`'
        );

        let recordId:any;

        await(async()=>{
          if(args?.data?.qrCode){
            const recordData = await client.records.findFirst({
              where:{
                qrcode:args?.data?.qrCode
              }
            })
            recordId = recordData?.R_ID
          }
        })()

        const result: any = await client.notes_abstract.findFirst({
          where: {
            report_id: Number(args?.data!.recordID) || recordId,
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

// patient

export const PostNotesAbs = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesAbs', {
      type: RecordObjectFields4Abs,
      args: { data: NoteAbstInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesAbs');

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

          let doctorDetails = await client.employees.findFirst({
            where:{
              EMP_EMAIL: session?.user?.email
            }
          })

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordAbs = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 10
                doctorID: doctorDetails?.EMP_ID,
                isEMR: Number(0),
                qrcode: VoucherCode
              },
            });
            const newChild = await trx.notes_abstract.create({
              data: {
                clinic: Number(recordAbs.CLINIC),
                patientID: Number(recordAbs.patientID),
                isEMR: Number(0),
                doctorID:doctorDetails?.EMP_ID,
                report_id: Number(recordAbs.R_ID),

                complaint: String(createData.complaint),
                illness: String(createData.illness),
                symptoms: String(createData.symptoms),
                pastmed: String(createData.pastmed),
                persoc: String(createData.persoc),
                physical: String(createData.physical),
                labdiag: String(createData.labdiag),
                findings: String(createData.findings),
                finaldiag: String(createData.finaldiag),
                complications: String(createData.complications),
                procedures: String(createData.procedures),
                treatplan: String(createData.treatplan),
              },
            });
            return {
              ...recordAbs,
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

export const UpdateNotesAbs = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateNotesAbs', {
      type: RecordObjectFields4Abs,
      args: { data: NoteAbstInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesAbs');

        if (isToday(createData?.dateCreated)) {
          try {
            // const notesInput = { ...args.data };
            // const notesChildInput = notesInput.NoteTxtChildInputType;
            // const uuid = notesInput.tempId;

            let doctorDetails = await client.employees.findFirst({
              where:{
                EMP_EMAIL: session?.user?.email
              }
            })
  


            const notesTransaction = await client.$transaction(async (trx) => {
              const recordAbs = await trx.records.update({
                data: {
                  CLINIC: Number(createData.clinic),
                  patientID: Number(createData.patientID),
                  R_TYPE: String(createData.R_TYPE), // 10
                  doctorID: doctorDetails?.EMP_ID,
                  isEMR: Number(0)
                },
                where: {
                  R_ID: Number(createData?.recordId)
                }
              });
              const newChild = await trx.notes_abstract.update({
                data: {
                  clinic: Number(recordAbs.CLINIC),
                  patientID: Number(recordAbs.patientID),
                  isEMR: Number(0),
                  doctorID:doctorDetails?.EMP_ID,
                  report_id: Number(recordAbs.R_ID),

                  complaint: String(createData.complaint),
                  illness: String(createData.illness),
                  symptoms: String(createData.symptoms),
                  pastmed: String(createData.pastmed),
                  persoc: String(createData.persoc),
                  physical: String(createData.physical),
                  labdiag: String(createData.labdiag),
                  findings: String(createData.findings),
                  finaldiag: String(createData.finaldiag),
                  complications: String(createData.complications),
                  procedures: String(createData.procedures),
                  treatplan: String(createData.treatplan),
                },
                where: {
                  id: Number(createData?.abs_id)
                }
              });
              return {
                ...recordAbs,
                ...newChild,
                // tempId: uuid,
              };
            });
            const res: any = notesTransaction;
            return res;
          } catch (e) {
            throw new e(extendType)

          }
        } else {
          throw new GraphQLError("Unable to Update")

        }
      },
    });
  },
});

export const DeleteNotesAbs = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesAbs', {
      type: RecordObjectFields4Abs,
      args: { data: NoteAbstInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesAbs');

        if (isToday(createData?.dateCreated)) {
          try {
            // const notesInput = { ...args.data };
            // const notesChildInput = notesInput.NoteTxtChildInputType;
            // const uuid = notesInput.tempId;




            const notesTransaction = await client.$transaction(async (trx) => {
              const recordAbs = await trx.records.update({
                data: {
                  isDeleted: 1
                },
                where: {
                  R_ID: Number(createData?.recordId)
                }
              });
              const newChild = await trx.notes_abstract.update({
                data: {
                  isDeleted: 1
                },
                where: {
                  id: Number(createData?.abs_id)
                }
              });
              return {
                ...recordAbs,
                ...newChild,
                // tempId: uuid,
              };
            });
            const res: any = notesTransaction;
            return res;
          } catch (e) {
            console.log(e);
            throw new GraphQLError(e)

          }
        } else {
          throw new GraphQLError("Unable to delete")
        }
      },
    });
  },
});

// emr

export const PostNotesAbsEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesAbsEMR', {
      type: RecordObjectFields4Abs,
      args: { data: NoteAbstInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesAbs');

        const ifLinked = () => {
          if (createData.isLinked === 0) {
            return {
              emrPatientID: Number(createData.emrPatientID),
            };
          }
          return {
            patientID: Number(createData.patientID),
            emrPatientID: Number(createData.emrPatientID),
          };
        };

        try {
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordAbs = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                // ...ifLinked,
                R_TYPE: String(createData.R_TYPE), // 10
                doctorID: Number(session?.user?.doctor_id),
                isEMR: Number(1),
              },
            });
            const newChild = await trx.notes_abstract.create({
              data: {
                clinic: Number(recordAbs.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(recordAbs.emrPatientID),
                // ...ifLinked,

                isEMR: Number(1),
                doctorID: Number(session?.user?.doctor_id),
                report_id: Number(recordAbs.R_ID),

                complaint: String(createData.complaint),
                illness: String(createData.illness),
                symptoms: String(createData.symptoms),
                pastmed: String(createData.pastmed),
                persoc: String(createData.persoc),
                physical: String(createData.physical),
                labdiag: String(createData.labdiag),
                findings: String(createData.findings),
                finaldiag: String(createData.finaldiag),
                complications: String(createData.complications),
                procedures: String(createData.procedures),
                treatplan: String(createData.treatplan),
              },
            });
            return {
              ...recordAbs,
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
