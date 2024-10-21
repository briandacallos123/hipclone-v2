import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { isToday } from '@/utils/format-time';


const client = new PrismaClient();

export const NotesMedClerObj = objectType({
  name: 'NotesMedClerObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('doctorID');
    t.string('dateCreated');
    t.int('report_id');
    t.string('dateExamined');
    t.string('remarks');
    t.int('VISIBILITY');
    t.int('isDeleted');
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesMedClear });
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesMedClear });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesMedClear });
  },
});

const PatientObjectFields4NotesMedClear = objectType({
  name: 'PatientObjectFields4NotesMedClear',
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

const ClinicObjectFields4NotesMedClear = objectType({
  name: 'ClinicObjectFields4NotesMedClear',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.string('clinic_name');
    t.string('number');
    t.string('location');
    t.string('Province');
    t.int('isDeleted');
    t.list.field('clinicDPInfo', {
      type: medical_clear_clinicDPInfos,
    });
  },
});

const medical_clear_clinicDPInfos = objectType({
  name: 'medical_clear_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

const DoctorObjectFields4NotesMedClear = objectType({
  name: 'DoctorObjectFields4NotesMedClear',
  definition(t) {
    t.int('EMP_ID');
    t.int('EMPID');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesMedClear,
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
      type: ClinicObjectFields4NotesMedClear,
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

    t.string('EMP_FULLNAME');t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.list.field('esig_dp', {
      type: clearance_esig_dp_picture,
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
const clearance_esig_dp_picture = objectType({
  name: 'clearance_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////
const SpecializationObjectFields4NotesMedClear = objectType({
  name: 'SpecializationObjectFields4NotesMedClear',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4Cler = objectType({
  name: 'RecordObjectFields4Cler',
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
      type: ClinicObjectFields4NotesMedClear,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesMedClear,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesMedClear,
    });
    t.nullable.field('noteClerInfo', {
      type: NotesMedClerObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_medicalclearance.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NotesMedClerInputType = inputObjectType({
  name: 'NotesMedClerInputType',
  definition(t) {
    t.nullable.int('medical_ID');

    // record
    t.nullable.int('clinic');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('isLinked');
    t.nullable.string('R_TYPE');
    t.nullable.string('qrCode');
    t.nullable.int('isEMR');
    // cler
    t.nullable.string('dateCreated');
    t.nullable.string('dateExamined');
    t.nullable.string('remarks');
    t.nullable.int('recordID');

    // dateCreated
    // dateExamined
    // remarks
  },
});

export const QueryNotesMedCler = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesMedCler', {
      type: NotesMedClerObj,
      args: { data: NotesMedClerInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_medicalclearance`',
          '`QueryNotesMedCler`'
        );

        let recordId:any;
        await(async()=>{
          let qrCode = args?.data?.qrCode;
          if(qrCode){
            let recordData = await client.records.findFirst({
              where:{
                qrcode:qrCode
              }
            });
            recordId = recordData?.R_ID;
          }
        })()

        const result: any = await client.notes_medicalclearance.findFirst({
          where: {
            report_id: Number(args?.data!.recordID || recordId),
          },

          include: {
            patientInfo: true,
            doctorInfo: true,
            clinicInfo: {
              include:{
                clinicDPInfo:{
                  orderBy:{
                    id:'desc'
                  }
                }
              }
            },
          },
        });
        return result;
      },
    });
  },
});

export const PostNotesCler = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesCler', {
      type: RecordObjectFields4Cler,
      args: { data: NotesMedClerInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesCler');

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
            const recordCler = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 10
                doctorID: doctorDetails?.EMP_ID,
                isEMR: Number(0),
                qrcode:VoucherCode

              },
            });
            const newChild = await trx.notes_medicalclearance.create({
              data: {
                clinic: Number(recordCler.CLINIC),
                patientID: Number(recordCler.patientID),
                doctorID: doctorDetails?.EMP_ID,
                isEMR: Number(0),
                report_id: Number(recordCler.R_ID),

                dateCreated: String(createData.dateCreated),
                dateExamined: String(createData.dateExamined),
                remarks: String(createData.remarks),
              },
            });
            return {
              ...recordCler,
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

export const UpdateNotesCler = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateNotesCler', {
      type: RecordObjectFields4Cler,
      args: { data: NotesMedClerInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesCler');

        if(isToday(createData?.dateCreated)){
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
              const recordCler = await trx.records.update({
                data: {
                  CLINIC: Number(createData.clinic),
                  patientID: Number(createData.patientID),
                  R_TYPE: String(createData.R_TYPE), // 10
                  doctorID: doctorDetails?.EMP_ID,
                  isEMR: Number(0),
                },
                where:{
                  R_ID:Number(createData?.recordID)
                }
              });
              const newChild = await trx.notes_medicalclearance.update({
                data: {
                  clinic: Number(recordCler.CLINIC),
                  patientID: Number(recordCler.patientID),
                  doctorID: doctorDetails?.EMP_ID,
                  isEMR: Number(0),
                  report_id: Number(recordCler.R_ID),
  
                  dateCreated: String(createData.dateCreated),
                  dateExamined: String(createData.dateExamined),
                  remarks: String(createData.remarks),
                },
                where:{
                  id:Number(createData?.medical_ID)
                }
              });
              return {
                ...recordCler,
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
        }else{
          throw new GraphQLError("Unable to update")

        }
      },
    });
  },
});


export const DeleteNotesCler = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesCler', {
      type: RecordObjectFields4Cler,
      args: { data: NotesMedClerInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesCler');

        if(isToday(createData?.dateCreated)){
          try {
            // const notesInput = { ...args.data };
            // const notesChildInput = notesInput.NoteTxtChildInputType;
            // const uuid = notesInput.tempId;
  
           
  
            const notesTransaction = await client.$transaction(async (trx) => {
              const recordCler = await trx.records.update({
                data: {
                  isDeleted:1
                },
                where:{
                  R_ID:Number(createData?.recordID)
                }
              });
              const newChild = await trx.notes_medicalclearance.update({
                data: {
                  isDeleted:1
                },
                where:{
                  id:Number(createData?.medical_ID)
                }
              });
              return {
                ...recordCler,
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
        }else{
          throw new GraphQLError("Unable to update")
        }
      },
    });
  },
});

export const PostNotesClerEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesClerEMR', {
      type: RecordObjectFields4Cler,
      args: { data: NotesMedClerInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesCler');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordCler = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE), // 10
                doctorID: Number(session?.user?.doctor_id),
                isEMR: Number(1),
              },
            });
            const newChild = await trx.notes_medicalclearance.create({
              data: {
                clinic: Number(recordCler.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                doctorID: Number(session?.user?.doctor_id),
                isEMR: Number(1),
                report_id: Number(recordCler.R_ID),

                dateCreated: String(createData.dateCreated),
                dateExamined: String(createData.dateExamined),
                remarks: String(createData.remarks),
              },
            });
            return {
              ...recordCler,
              ...newChild,
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


