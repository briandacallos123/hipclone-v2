import { PrismaClient } from '@prisma/client';

import { GraphQLError } from 'graphql/error/GraphQLError';
import { unserialize, serialize } from 'php-serialize';
import { extendType, objectType, inputObjectType } from 'nexus';
import { NotePhysObj } from './NotesPhysical';
import { notesVitalObj } from './NotesVitals';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { isToday } from '@/utils/format-time';

const client = new PrismaClient();

export const NoteSoapObj = objectType({
  name: 'NoteSoapObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('doctorID');
    t.int('clinic');
    t.date('dateCreated');
    t.int('report_id');
    t.string('complaint');
    t.string('illness');
    t.string('wt');
    t.string('hr');
    t.string('rr');
    t.string('bmi');
    t.string('ht');
    t.string('bt');
    t.string('bp');
    t.string('bp1');
    t.string('bp2');
    t.string('spo2');
    // t.string('remarks0');
    t.list.field('remarks0', {
      type: 'JSON',
      resolve(parent: any) {
        const remarks0: any = parent?.remarks0;
        let res: any = [];
        if (!!remarks0) {
          res = unserialize(remarks0);
        }
        return res
          ? res.map((v: any) => {
              if (typeof v === 'object' && v !== null) {
                return Object.keys(v)
                  .map((key) => `${key}: ${v[key]}`)
                  .join(', ');
              } else {
                return String(v);
              }
            })
          : [];
      },
    });
    t.list.field('remarks1', {
      type: 'JSON',
      resolve(parent: any) {
        const remarks1: any = parent?.remarks1;
        let res: any = [];
        if (!!remarks1) {
          res = unserialize(remarks1);
        }
        return res
          ? res.map((v: any) => {
              if (typeof v === 'object' && v !== null) {
                return Object.keys(v)
                  .map((key) => `${key}: ${v[key]}`)
                  .join(', ');
              } else {
                return String(v);
              }
            })
          : [];
      },
    });

    t.list.field('remarks2', {
      type: 'JSON',
      resolve(parent: any) {
        const remarks2: any = parent?.remarks2;
        let res: any = [];
        if (!!remarks2) {
          res = unserialize(remarks2);
        }
        return res
          ? res.map((v: any) => {
              if (typeof v === 'object' && v !== null) {
                return Object.keys(v)
                  .map((key) => `${key}: ${v[key]}`)
                  .join(', ');
              } else {
                return String(v);
              }
            })
          : [];
      },
    });

    // t.string('remarks1');
    t.string('diagnosis');
    t.string('plan');
    t.int('isDeleted');
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesSoap });
    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesSoap });
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesSoap });
    t.nullable.field('physicalInfo', {
      type: NotePhysObj,
      async resolve(root, args, _ctx) {
        const result: any = await client.notes_physical.findFirst({
          where: {
            report_id: String(root?.report_id),
          },
        });
        return result;
      },
    });
    t.nullable.field('vitalInfo', {
      type: notesVitalObj,
      async resolve(root, args, _ctx) {
        const result: any = await client.notes_vitals.findFirst({
          where: {
            report_id: Number(root?.report_id),
          },
        });
        return result;
      },
    });
  },
});

const ClinicObjectFields4NotesSoap = objectType({
  name: 'ClinicObjectFields4NotesSoap',
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

const PatientObjectFields4NotesSoap = objectType({
  name: 'PatientObjectFields4NotesSoap',
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

const DoctorObjectFields4NotesSoap = objectType({
  name: 'DoctorObjectFields4NotesSoap',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesSoap,
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
      type: ClinicObjectFields4NotesSoap,
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
      type: notesoap_esig_dp_picture,
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
const notesoap_esig_dp_picture = objectType({
  name: 'notesoap_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4NotesSoap = objectType({
  name: 'SpecializationObjectFields4NotesSoap',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const prescriptions4Soap = objectType({
  name: 'prescriptions4Soap',
  definition(t) {
    t.id('ID');
    t.string('PATIENTEMR');
    t.int('patientID');
    t.string('PR_ID');
    t.int('doctorID');
    t.int('CLINIC');
    t.nullable.list.field('prescriptions_child4Soap', {
      type: prescriptions_child4Soap,
    });
  },
});
const prescriptions_child4Soap = objectType({
  name: 'prescriptions_child4Soap',
  definition(t) {
    t.string('MEDICINE');
    t.string('MED_BRAND');
    t.string('DOSE');
    t.string('FORM');
    t.string('QUANTITY');
    t.string('FREQUENCY');
    t.string('DURATION');
    t.int('PR_ID');
  },
});

const NotePhysObj4Soap = objectType({
  name: 'NotePhysObj4Soap',
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

const RecordObjectFields4Soap = objectType({
  name: 'RecordObjectFields4Soap',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('doctorID');
    t.int('patientID');
    t.nullable.int('isLinked');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.dateTime('R_DATE');
    t.int('isDeleted');
    t.string('R_TYPE');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4NotesSoap,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesSoap,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesSoap,
    });
    t.nullable.field('noteSoapInfo', {
      type: NoteSoapObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_soap.findFirst({
          where: {
            report_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
    t.nullable.field('prescriptionInfo', {
      type: prescriptions4Soap,
      async resolve(root, _arg, ctx) {
        const result: any = await client.prescriptions.findFirst({
          where: {
            patientID: Number(root?.patientID),
          },
        });
        return result;
      },
    });
    t.nullable.field('NotePhysObj4Soap', {
      type: NotePhysObj4Soap,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_physical.findFirst({
          where: {
            report_id: String(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const QueryNoteSoap = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNoteSoap', {
      type: NoteSoapObj,
      args: { data: NoteSoapObjInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_soap`',
          '`QueryNoteSoap`'
        );
        const recordID: any = args?.data?.recordID;
        const PatientID: any = args?.data?.patientID;

        let recordId:any;

        await(async()=>{
          let qrCode = args?.data?.qrCode;
          if(qrCode){
            let recordData = await client.records.findFirst({
              where:{
                qrcode:qrCode
              }
            });
            recordId = recordData?.R_ID
          }
        })()

        const result: any = await client.notes_soap.findFirst({
          where: {
            OR:[{report_id: recordID || recordId},{patientID: PatientID}],
          },
          orderBy:{
            id:'desc'
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

export const NoteSoapObjInputType = inputObjectType({
  name: 'NoteSoapObjInputType',
  definition(t) {
    t.nullable.int('recordID');
    // ids
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.int('patientID');
    t.nullable.int('isEMR');
    t.nullable.int('emrPatientID');
    t.nullable.string('R_TYPE');
    t.nullable.int('phy_id');
    t.nullable.int('soap_id');
    t.nullable.int('presc_id')
    t.nullable.int('R_ID');
    t.nullable.date('dateCreated')

    // soap payloads
    t.nullable.string('complaint');
    t.nullable.string('illness');
    t.nullable.string('qrCode');
    t.nullable.string('wt');
    t.nullable.string('ht');
    t.nullable.string('bmi');
    t.nullable.string('bp1');
    t.nullable.string('bp2');
    t.nullable.string('spo2');
    t.nullable.string('rr');
    t.nullable.string('hr');
    t.nullable.string('bt');
    t.nullable.JSON('remarks0');
    t.nullable.JSON('remarks1');
    t.nullable.JSON('remarks2');

    t.nullable.string('diagnosis');
    t.nullable.string('plan');

    // physical payloads
    t.nullable.string('vision_r');
    t.nullable.string('vision_l');
    t.nullable.string('pupils');
    t.nullable.string('glasses_lenses');
    t.nullable.string('hearing');
    t.nullable.string('bmi_status');
    t.nullable.string('bmi_comment');
    t.nullable.string('skin_status');
    t.nullable.string('skin_comment');
    t.nullable.string('heent_status');
    t.nullable.string('heent_comment');
    t.nullable.string('teeth_status');
    t.nullable.string('teeth_comment');
    t.nullable.string('neck_status');
    t.nullable.string('neck_comment');
    t.nullable.string('lungs_status');
    t.nullable.string('lungs_comment');
    t.nullable.string('heart_status');
    t.nullable.string('heart_comment');
    t.nullable.string('abdomen_status');
    t.nullable.string('abdomen_comment');
    t.nullable.string('gusystem_status');
    t.nullable.string('gusystem_comment');
    t.nullable.string('musculoskeletal_status');
    t.nullable.string('musculoskeletal_comment');
    t.nullable.string('backspine_status');
    t.nullable.string('backspine_comment');
    t.nullable.string('neurological_status');
    t.nullable.string('neurological_comment');
    t.nullable.string('psychiatric_status');
    t.nullable.string('psychiatric_comment');
    t.nullable.string('uuid');

    // prescription
    t.nullable.list.field('prescriptions', {
      type: prescriptions_children,
    });
    // t.nullable.int('PR_ID');
    // t.nullable.string('MEDICINE');
    // t.nullable.string('MED_BRAND');
    // t.nullable.string('DOSE');
    // t.nullable.string('FORM');
    // t.nullable.string('QUANTITY');
    // t.nullable.string('FREQUENCY');
    // t.nullable.string('DURATION');
  },
});
const prescriptions_children = inputObjectType({
  name: 'prescriptions_children',
  definition(t) {
    t.string('MEDICINE');
    t.string('MED_BRAND');
    t.string('DOSE');
    t.string('FORM');
    t.string('QUANTITY');
    t.string('FREQUENCY');
    t.string('DURATION');
  },
});
export const PostNotesSoap = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesSoap', {
      type: RecordObjectFields4Soap,
      args: { data: NoteSoapObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesSoap');

        try {
          const notesInput = { ...args.data };
          const notesChildInput = notesInput.NoteTxtChildInputType;
          const uuid = notesInput.tempId;

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


          const remarksData0 = serialize(createData.remarks0);
          const remarksData1 = serialize(createData.remarks1);
          const remarksData2 = serialize(createData.remarks2);
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordSoap = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 1
                doctorID: Number(session?.user?.id),
                isEMR: Number(0),
                qrcode:VoucherCode
              },
            });
            const newChildSoap = await trx.notes_soap.create({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: Number(recordSoap.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                doctorID: Number(session?.user?.id),
                report_id: Number(recordSoap.R_ID),
                // sunjective
                complaint: String(createData.complaint),
                illness: String(createData.illness),
                // objective
                wt: String(createData.wt),
                ht: String(createData.ht),
                bmi: String(createData.bmi),
                bp1: String(createData.bp1),
                bp2: String(createData.bp2),
                spo2: String(createData.spo2),
                rr: String(createData.rr),
                hr: String(createData.hr),
                bt: String(createData.bt),
                remarks0: remarksData0,
                remarks1: remarksData1,
                remarks2: remarksData2,
                // assessment
                diagnosis: String(createData.diagnosis),
                // Plan
                plan: String(createData.plan),
              },
            });

            const newChildPhys = await trx.notes_physical.create({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: Number(recordSoap.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                doctorID: Number(session?.user?.id),
                report_id: String(recordSoap.R_ID),

                // physical Exam

                vision_r: String(createData.vision_r),
                vision_l: String(createData.vision_l),
                pupils: String(createData.pupils),
                glasses_lenses: String(createData.glasses_lenses),
                hearing: String(createData.hearing),
                bmi_status: String(createData.bmi_status),
                bmi_comment: String(createData.bmi_comment),
                skin_status: String(createData.skin_status),
                skin_comment: String(createData.skin_comment),
                heent_status: String(createData.heent_status),
                heent_comment: String(createData.heent_comment),
                teeth_status: String(createData.teeth_status),
                teeth_comment: String(createData.teeth_comment),
                neck_status: String(createData.neck_status),
                neck_comment: String(createData.neck_comment),
                lungs_status: String(createData.lungs_status),
                lungs_comment: String(createData.lungs_comment),
                heart_status: String(createData.heart_status),
                heart_comment: String(createData.heart_comment),
                abdomen_status: String(createData.abdomen_status),
                abdomen_comment: String(createData.abdomen_comment),
                gusystem_status: String(createData.gusystem_status),
                gusystem_comment: String(createData.gusystem_comment),
                musculoskeletal_status: String(createData.musculoskeletal_status),
                musculoskeletal_comment: String(createData.musculoskeletal_comment),
                backspine_status: String(createData.backspine_status),
                backspine_comment: String(createData.backspine_comment),
                neurological_status: String(createData.neurological_status),
                neurological_comment: String(createData.neurological_comment),
                psychiatric_status: String(createData.psychiatric_status),
                psychiatric_comment: String(createData.psychiatric_comment),
              },
            });

            console.log(newChildPhys,'AWIT SAYOOOOOOOOOO')

            const patientID = await getPatientId(createData?.uuid);

            const prescriptionParent = await client.prescriptions.create({
              data: {
                CLINIC: createData?.clinic,
                patientID,
                doctorID: session?.user?.id,
              },
            });

            const presChild = createData?.prescriptions?.map(async (item: any) => {
              const child = await client.prescriptions_child.create({
                data: {
                  PR_ID: prescriptionParent?.ID,
                  patientID,
                  CLINIC: createData?.clinic,

                  ...item,
                },
              });
              return child;
            });
            const cildren = await Promise.all(presChild);
            console.log(cildren, 'yay@');

            return {
              ...recordSoap,
              ...newChildSoap,
              ...newChildPhys,
              ...prescriptionParent,
              ...presChild,
            };
          });
          const res: any = notesTransaction;
          return res;
        } catch (e: any) {
          console.log(e);
          throw new GraphQLError(e)
        }
      },
    });
  },
});

export const UpdateNotesSoap = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateNotesSoap', {
      type: RecordObjectFields4Soap,
      args: { data: NoteSoapObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesSoap');

       if(isToday(createData?.dateCreated)){
        try {
          const notesInput = { ...args.data };
          const notesChildInput = notesInput.NoteTxtChildInputType;
          const uuid = notesInput.tempId;

        

          const remarksData0 = serialize(createData.remarks0);
          const remarksData1 = serialize(createData.remarks1);
          const remarksData2 = serialize(createData.remarks2);
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordSoap = await trx.records.update({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 1
                doctorID: Number(session?.user?.id),
                isEMR: Number(0),
              },
              where:{
                R_ID:Number(createData?.R_ID)
              }
            });
            const newChildSoap = await trx.notes_soap.update({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: Number(recordSoap.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                doctorID: Number(session?.user?.id),
                report_id: Number(recordSoap.R_ID),
                // sunjective
                complaint: String(createData.complaint),
                illness: String(createData.illness),
                // objective
                wt: String(createData.wt),
                ht: String(createData.ht),
                bmi: String(createData.bmi),
                bp1: String(createData.bp1),
                bp2: String(createData.bp2),
                spo2: String(createData.spo2),
                rr: String(createData.rr),
                hr: String(createData.hr),
                bt: String(createData.bt),
                remarks0: remarksData0,
                remarks1: remarksData1,
                remarks2: remarksData2,
                // assessment
                diagnosis: String(createData.diagnosis),
                // Plan
                plan: String(createData.plan),
              },
              where:{
                id:Number(createData?.soap_id)
              }
            });

            const newChildPhys = await trx.notes_physical.update({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: Number(recordSoap.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                isEMR: Number(0),
                doctorID: Number(session?.user?.id),
                report_id: String(recordSoap.R_ID),

                // physical Exam

                vision_r: String(createData.vision_r),
                vision_l: String(createData.vision_l),
                pupils: String(createData.pupils),
                glasses_lenses: String(createData.glasses_lenses),
                hearing: String(createData.hearing),
                bmi_status: String(createData.bmi_status),
                bmi_comment: String(createData.bmi_comment),
                skin_status: String(createData.skin_status),
                skin_comment: String(createData.skin_comment),
                heent_status: String(createData.heent_status),
                heent_comment: String(createData.heent_comment),
                teeth_status: String(createData.teeth_status),
                teeth_comment: String(createData.teeth_comment),
                neck_status: String(createData.neck_status),
                neck_comment: String(createData.neck_comment),
                lungs_status: String(createData.lungs_status),
                lungs_comment: String(createData.lungs_comment),
                heart_status: String(createData.heart_status),
                heart_comment: String(createData.heart_comment),
                abdomen_status: String(createData.abdomen_status),
                abdomen_comment: String(createData.abdomen_comment),
                gusystem_status: String(createData.gusystem_status),
                gusystem_comment: String(createData.gusystem_comment),
                musculoskeletal_status: String(createData.musculoskeletal_status),
                musculoskeletal_comment: String(createData.musculoskeletal_comment),
                backspine_status: String(createData.backspine_status),
                backspine_comment: String(createData.backspine_comment),
                neurological_status: String(createData.neurological_status),
                neurological_comment: String(createData.neurological_comment),
                psychiatric_status: String(createData.psychiatric_status),
                psychiatric_comment: String(createData.psychiatric_comment),
              },
              where:{
                id:Number(createData?.phy_id)
              }
            });


            const patientID = await getPatientId(createData?.uuid);

            const prescriptionParent = await client.prescriptions.create({
              data: {
                CLINIC: createData?.clinic,
                patientID,
                doctorID: session?.user?.id,
              },
            });

            const presChild = createData?.prescriptions?.map(async (item: any) => {
              const child = await client.prescriptions_child.create({
                data: {
                  PR_ID: prescriptionParent?.ID,
                  patientID,
                  CLINIC: createData?.clinic,

                  ...item,
                },
              });
              return child;
            });
            const cildren = await Promise.all(presChild);
            console.log(cildren, 'yay@');

            return {
              ...recordSoap,
              ...newChildSoap,
              ...newChildPhys,
              ...prescriptionParent,
              ...presChild,
            };
          });
          const res: any = notesTransaction;
          return res;
        } catch (e: any) {
          console.log(e);
          throw new GraphQLError(e)
        }
       }else{
        throw new GraphQLError('Unable to update')

       }
      },
    });
  },
});

export const DeleteNotesSoap = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesSoap', {
      type: RecordObjectFields4Soap,
      args: { data: NoteSoapObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesSoap');

        if(isToday(createData?.dateCreated)){
          try {
            const notesInput = { ...args.data };
            const notesChildInput = notesInput.NoteTxtChildInputType;
            const uuid = notesInput.tempId;
  
          
  
           
            const notesTransaction = await client.$transaction(async (trx) => {
              const recordSoap = await trx.records.update({
                data: {
                  isDeleted:1
                },
                where:{
                  R_ID:Number(createData?.R_ID)
                }
              });
              const newChildSoap = await trx.notes_soap.update({
                data: {
                  isDeleted:1
                },
                where:{
                  id:Number(createData?.soap_id)
                }
              });
  
              // const newChildPhys = await trx.notes_physical.update({
              //   data: {
              //     clinic: Number(recordSoap.CLINIC),
              //     patientID: Number(recordSoap.patientID),
              //     // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
              //     isEMR: Number(0),
              //     doctorID: Number(session?.user?.id),
              //     report_id: String(recordSoap.R_ID),
  
              //     // physical Exam
  
              //     vision_r: String(createData.vision_r),
              //     vision_l: String(createData.vision_l),
              //     pupils: String(createData.pupils),
              //     glasses_lenses: String(createData.glasses_lenses),
              //     hearing: String(createData.hearing),
              //     bmi_status: String(createData.bmi_status),
              //     bmi_comment: String(createData.bmi_comment),
              //     skin_status: String(createData.skin_status),
              //     skin_comment: String(createData.skin_comment),
              //     heent_status: String(createData.heent_status),
              //     heent_comment: String(createData.heent_comment),
              //     teeth_status: String(createData.teeth_status),
              //     teeth_comment: String(createData.teeth_comment),
              //     neck_status: String(createData.neck_status),
              //     neck_comment: String(createData.neck_comment),
              //     lungs_status: String(createData.lungs_status),
              //     lungs_comment: String(createData.lungs_comment),
              //     heart_status: String(createData.heart_status),
              //     heart_comment: String(createData.heart_comment),
              //     abdomen_status: String(createData.abdomen_status),
              //     abdomen_comment: String(createData.abdomen_comment),
              //     gusystem_status: String(createData.gusystem_status),
              //     gusystem_comment: String(createData.gusystem_comment),
              //     musculoskeletal_status: String(createData.musculoskeletal_status),
              //     musculoskeletal_comment: String(createData.musculoskeletal_comment),
              //     backspine_status: String(createData.backspine_status),
              //     backspine_comment: String(createData.backspine_comment),
              //     neurological_status: String(createData.neurological_status),
              //     neurological_comment: String(createData.neurological_comment),
              //     psychiatric_status: String(createData.psychiatric_status),
              //     psychiatric_comment: String(createData.psychiatric_comment),
              //   },
              //   where:{
              //     id:Number(createData?.phy_id)
              //   }
              // });
  
  
              const patientID = await getPatientId(createData?.uuid);
  
              // const prescriptionParent = await client.prescriptions.update({
              //   data: {
              //     isDeleted:1
              //   },
              //   where:{
              //     ID:Number(createData?.presc_id)
              //   }
              // });
  
              // const presChild = createData?.prescriptions?.map(async (item: any) => {
              //   const child = await client.prescriptions_child.updateMany({
              //     data: {
              //       isDeleted:1
              //     },
              //     where:{
              //       PR_ID:Number(prescriptionParent?.ID)
              //     }
              //   });
              //   return child;
              // });
              // const cildren = await Promise.all(presChild);
  
              return {
                ...recordSoap,
                ...newChildSoap,
                // ...newChildPhys,
                // ...prescriptionParent,
                // ...presChild,
              };
            });
            const res: any = notesTransaction;
            return res;
          } catch (e: any) {
            console.log(e);
            throw new GraphQLError(e)
          }
        }else{
          throw new GraphQLError("Unable to update");
        }
      },
    });
  },
});

const getPatientId = async (uuid: String) => {
  const patientId = await client.user.findFirst({
    where: {
      uuid,
    },
    include: {
      patientInfo: true,
    },
  });
  return patientId?.patientInfo?.S_ID;
};

export const PostNotesSoapEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesSoapEMR', {
      type: RecordObjectFields4Soap,
      args: { data: NoteSoapObjInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesSoap');

        try {
          const notesInput = { ...args.data };
          const notesChildInput = notesInput.NoteTxtChildInputType;
          const uuid = notesInput.tempId;

          const remarksData0 = serialize(createData.remarks0);
          const remarksData1 = serialize(createData.remarks1);
          const remarksData2 = serialize(createData.remarks2);

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
            const recordSoap = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE), // 1
                doctorID: Number(session?.user?.id),
                isEMR: Number(1),
                qrcode:VoucherCode
              },
            });
            const newChildSoap = await trx.notes_soap.create({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                isEMR: Number(1),
                doctorID: Number(session?.user?.id),
                report_id: Number(recordSoap.R_ID),
                // sunjective
                complaint: String(createData.complaint),
                illness: String(createData.illness),
                // objective
                wt: String(createData.wt),
                ht: String(createData.ht),
                bmi: String(createData.bmi),
                bp1: String(createData.bp1),
                bp2: String(createData.bp2),
                spo2: String(createData.spo2),
                rr: String(createData.rr),
                hr: String(createData.hr),
                bt: String(createData.bt),
                remarks0: remarksData0,
                remarks1: remarksData1,
                remarks2: remarksData2,
                // assessment
                diagnosis: String(createData.diagnosis),
                // Plan
                plan: String(createData.plan),
              },
            });

            const newChildPhys = await trx.notes_physical.create({
              data: {
                clinic: Number(recordSoap.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                isEMR: Number(0),
                doctorID: Number(session?.user?.id),
                report_id: String(recordSoap.R_ID),

                // physical Exam

                vision_r: String(createData.vision_r),
                vision_l: String(createData.vision_l),
                pupils: String(createData.pupils),
                glasses_lenses: String(createData.glasses_lenses),
                hearing: String(createData.hearing),
                bmi_status: String(createData.bmi_status),
                bmi_comment: String(createData.bmi_comment),
                skin_status: String(createData.skin_status),
                skin_comment: String(createData.skin_comment),
                heent_status: String(createData.heent_status),
                heent_comment: String(createData.heent_comment),
                teeth_status: String(createData.teeth_status),
                teeth_comment: String(createData.teeth_comment),
                neck_status: String(createData.neck_status),
                neck_comment: String(createData.neck_comment),
                lungs_status: String(createData.lungs_status),
                lungs_comment: String(createData.lungs_comment),
                heart_status: String(createData.heart_status),
                heart_comment: String(createData.heart_comment),
                abdomen_status: String(createData.abdomen_status),
                abdomen_comment: String(createData.abdomen_comment),
                gusystem_status: String(createData.gusystem_status),
                gusystem_comment: String(createData.gusystem_comment),
                musculoskeletal_status: String(createData.musculoskeletal_status),
                musculoskeletal_comment: String(createData.musculoskeletal_comment),
                backspine_status: String(createData.backspine_status),
                backspine_comment: String(createData.backspine_comment),
                neurological_status: String(createData.neurological_status),
                neurological_comment: String(createData.neurological_comment),
                psychiatric_status: String(createData.psychiatric_status),
                psychiatric_comment: String(createData.psychiatric_comment),
              },
            });

            const patientID = await getPatientId1(createData?.uuid);

            const prescriptionParent = await client.prescriptions.create({
              data: {
                CLINIC: createData?.clinic,
                patientID,
                doctorID: session?.user?.id,
              },
            });

            const presChild = createData?.prescriptions?.map(async (item: any) => {
              const child = await client.prescriptions_child.create({
                data: {
                  PR_ID: prescriptionParent?.ID,
                  patientID,
                  CLINIC: createData?.clinic,

                  ...item,
                },
              });
              return child;
            });
            const cildren = await Promise.all(presChild);
            console.log(cildren, 'yay@');

            return {
              ...recordSoap,
              ...newChildSoap,
              ...newChildPhys,
              ...prescriptionParent,
              ...presChild,
            };
          });
          const res: any = notesTransaction;
          return res;
        } catch (e: any) {
          return new GraphQLError(e);
        }
      },
    });
  },
});

const getPatientId1 = async (uuid: String) => {
  const patientId = await client.user.findFirst({
    where: {
      uuid,
    },
    include: {
      patientInfo: true,
    },
  });
  return patientId?.patientInfo?.S_ID;
};
