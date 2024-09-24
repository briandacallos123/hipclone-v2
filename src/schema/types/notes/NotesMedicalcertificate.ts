import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { isToday } from '@/utils/format-time';
import { GraphQLError } from 'graphql/error/GraphQLError';

const client = new PrismaClient();

export const NotesMedCertObj = objectType({
  name: 'NotesMedCertObj',
  definition(t) {
    t.id('id');
    t.int('InOutPatient');
    t.int('patientID');
    t.int('doctorID');
    t.int('clinic');
    t.int('report_id');
    t.string('hospital');
    t.string('dateCreated');
    t.string('s_date');
    t.string('e_date');
    t.string('barring');
    t.string('diagnosis');
    t.string('remarks');
    t.int('VISIBILITY');
    t.int('isDeleted');
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesMedCert });
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesMedCert });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesMedCert });
  },
});

const PatientObjectFields4NotesMedCert = objectType({
  name: 'PatientObjectFields4NotesMedCert',
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

const ClinicObjectFields4NotesMedCert = objectType({
  name: 'ClinicObjectFields4NotesMedCert',
  definition(t) {
    t.id('id');
    t.int('doctor_idno');
    t.string('clinic_name');
    t.string('number');
    t.string('location');
    t.string('Province');
    t.int('isDeleted');
    t.list.field('clinicDPInfo', {
      type: medical_cert_clinicDPInfos,
    });
  },
});


const medical_cert_clinicDPInfos = objectType({
  name: 'medical_cert_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

const DoctorObjectFields4NotesMedCert = objectType({
  name: 'DoctorObjectFields4NotesMedCert',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.list.field('esig_dp', {
      type: medcert_esig_dp_picture,
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
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesMedCert,
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
      type: ClinicObjectFields4NotesMedCert,
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
  },
});

///////////////////////////////////////////////////////
const medcert_esig_dp_picture = objectType({
  name: 'medcert_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4NotesMedCert = objectType({
  name: 'SpecializationObjectFields4NotesMedCert',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4Cert = objectType({
  name: 'RecordObjectFields4Cert',
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
    t.nullable.string('qrcode');

    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4NotesMedCert,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesMedCert,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesMedCert,
    });
    t.nullable.field('noteCertInfo', {
      type: NotesMedCertObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_medicalcertificate.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NotesMedCertInputType = inputObjectType({
  name: 'NotesMedCertInputType',
  definition(t) {
    t.nullable.int('recordID');
    // record
    t.nullable.int('clinic');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.string('R_TYPE');
    t.nullable.int('isEMR');
    t.nullable.int('isLinked');
    t.nullable.int('cert_id');
    t.nullable.int('R_ID');
    t.nullable.string('qrCode');


    // cert
    t.nullable.int('InOutPatient');
    t.nullable.string('dateCreated');
    t.nullable.string('s_date');
    t.nullable.string('e_date');
    t.nullable.string('diagnosis');
    t.nullable.string('barring');
    t.nullable.string('remarks');
  },
});

export const QueryNotesMedCert = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesMedCert', {
      type: NotesMedCertObj,
      args: { data: NotesMedCertInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_medicalcertificate`',
          '`QueryNotesMedCert`'
        );

        let recordId:any;

       await (async()=>{
          if(args?.data?.qrCode){
            const recordData = await client.records.findFirst({
              where:{
                qrcode:args?.data?.qrCode
              }
            })
        console.log(recordData,'recordDatarecordData')

            recordId = recordData?.R_ID
          }
        })()

        const result: any = await client.notes_medicalcertificate.findFirst({
          where: {
            report_id: Number(args?.data!.recordID) || recordId,
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
        console.log(result,'result')
        return result;
      },
    });
  },
});

export const PostNotesCert = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesCert', {
      type: RecordObjectFields4Cert,
      args: { data: NotesMedCertInputType! },
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

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordCert = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 9
                doctorID: Number(session?.user?.id),
                isEMR: Number(0),
                qrcode:VoucherCode

              },
            });
            const newChild = await trx.notes_medicalcertificate.create({
              data: {
                clinic: Number(recordCert.CLINIC),
                patientID: Number(recordCert.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                dateCreated: String(createData.dateCreated),
                InOutPatient: Number(createData.InOutPatient),
                s_date: String(createData.s_date),
                e_date: String(createData.e_date),
                diagnosis: String(createData.diagnosis),
                barring: String(createData.barring),
                remarks: String(createData.remarks),

                doctorID: Number(session?.user?.id),

                report_id: Number(recordCert.R_ID),

                // InOutPatient
                // dateCreated
                // s_date
                // e_date
                // diagnosis
                // barring
                // remarks
              },
            });
            return {
              ...recordCert,
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

export const UpdateNotesCert = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateNotesCert', {
      type: RecordObjectFields4Cert,
      args: { data: NotesMedCertInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        if(isToday(createData?.dateCreated)){
          try {
            // const notesInput = { ...args.data };
            // const notesChildInput = notesInput.NoteTxtChildInputType;
            // const uuid = notesInput.tempId;
  
           
  
            const notesTransaction = await client.$transaction(async (trx) => {
              const recordCert = await trx.records.update({
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
              const newChild = await trx.notes_medicalcertificate.update({
                data: {
                  clinic: Number(recordCert.CLINIC),
                  patientID: Number(recordCert.patientID),
                  // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                  isEMR: Number(0),
                  dateCreated: String(createData.dateCreated),
                  InOutPatient: Number(createData.InOutPatient),
                  s_date: String(createData.s_date),
                  e_date: String(createData.e_date),
                  diagnosis: String(createData.diagnosis),
                  barring: String(createData.barring),
                  remarks: String(createData.remarks),
  
                  doctorID: Number(session?.user?.id),
  
                  report_id: Number(recordCert.R_ID),
  
                  // InOutPatient
                  // dateCreated
                  // s_date
                  // e_date
                  // diagnosis
                  // barring
                  // remarks
                },
                where:{
                  id:Number(createData?.cert_id)
                }
              });
              return {
                ...recordCert,
                ...newChild,
                // tempId: uuid,
              };
            });
            const res: any = notesTransaction;
            return res;
          } catch (e) {
            console.log(e);
          }
        }else{
          throw new GraphQLError('Unabled to delete');

        }
      },
    });
  },
});

export const DeleteNotesCert = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesCert', {
      type: RecordObjectFields4Cert,
      args: { data: NotesMedCertInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        if(isToday(createData?.dateCreated)){
          try {
            // const notesInput = { ...args.data };
            // const notesChildInput = notesInput.NoteTxtChildInputType;
            // const uuid = notesInput.tempId;
  
           
  
            const notesTransaction = await client.$transaction(async (trx) => {
              const recordCert = await trx.records.update({
                data: {
                  isDeleted:1
                },
                where:{
                  R_ID:Number(createData?.R_ID)
                }
              });
              const newChild = await trx.notes_medicalcertificate.update({
                data: {
                 isDeleted:1
                },
                where:{
                  id:Number(createData?.cert_id)
                }
              });
              return {
                ...recordCert,
                ...newChild,
                // tempId: uuid,
              };
            });
            const res: any = notesTransaction;
            return res;
          } catch (e) {
            console.log(e);
          }
        }else{
          throw new GraphQLError('Unabled to delete');
        }
      },
    });
  },
});

export const PostNotesCertEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesCertEMR', {
      type: RecordObjectFields4Cert,
      args: { data: NotesMedCertInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesTxt');

        try {
          // const notesInput = { ...args.data };
          // const notesChildInput = notesInput.NoteTxtChildInputType;
          // const uuid = notesInput.tempId;

          const notesTransaction = await client.$transaction(async (trx) => {
            const recordCert = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE), // 9
                doctorID: Number(session?.user?.id),
                isEMR: Number(1),
              },
            });
            const newChild = await trx.notes_medicalcertificate.create({
              data: {
                clinic: Number(recordCert.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                isEMR: Number(1),
                dateCreated: String(createData.dateCreated),
                InOutPatient: Number(createData.InOutPatient),
                s_date: String(createData.s_date),
                e_date: String(createData.e_date),
                diagnosis: String(createData.diagnosis),
                barring: String(createData.barring),
                remarks: String(createData.remarks),

                doctorID: Number(session?.user?.id),

                report_id: Number(recordCert.R_ID),

                // InOutPatient
                // dateCreated
                // s_date
                // e_date
                // diagnosis
                // barring
                // remarks
              },
            });
            return {
              ...recordCert,
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
