import { PrismaClient } from '@prisma/client';
import { serialize, unserialize } from 'php-serialize';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const client = new PrismaClient();

export const NotesLabObj = objectType({
  name: 'NotesLabObj',
  definition(t) {
    t.id('id');
    t.int('record_id');
    t.nullable.field('patientInfo', { type: PatientObjectFields4NotesLabReq });
    t.int('emrPatientID');
    t.int('doctorID');
    t.int('isEMR');
    t.string('patient');
    t.field('procedures', {
      type: 'JSON',
      async resolve(parent) {
        const procedures = parent?.procedures;
        const categoryMap: { [categoryName: string]: any[] } = {}; // Provide type annotation

        if (!procedures) {
          return categoryMap; // Return an empty category map if procedures is falsy
        }

        let res = [];

        try {
          res = unserialize(procedures);
        } catch (error) {
          console.error('Error unserializing procedures:', error);
          return categoryMap; // Return an empty category map on unserialize error
        }

        if (!Array.isArray(res)) {
          console.error('Unserialized procedures is not an array:', res);
          return categoryMap; // Return an empty category map if res is not an array
        }

        await Promise.all(
          res.map(async (v) => {
            try {
              const procedure = await client.payment_procedures.findFirst({
                where: {
                  id: Number(v),
                },
              });

              if (procedure) {
                const categoryId = procedure.category;
                const categoryDetails = await client.payment_procedures_category.findFirst({
                  where: {
                    id: Number(categoryId),
                  },
                });

                if (categoryDetails) {
                  const categoryName = categoryDetails.name;
                  if (categoryName !== null) {
                    if (!categoryMap[categoryName]) {
                      categoryMap[categoryName] = [];
                    }
                    const { id, name } = procedure;
                    categoryMap[categoryName].push({ id, name });
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching procedure:', error);
            }
          })
        );

        return categoryMap;
      },
    });

    t.nullable.field('doctorInfo', { type: DoctorObjectFields4NotesLabReq });
    t.nullable.field('clinicInfo', { type: ClinicObjectFields4NotesLabReq });
    t.int('fasting');
    t.string('others');
    t.date('dateCreated');
    t.int('isDeleted');
    //
  },
});

const PatientObjectFields4NotesLabReq = objectType({
  name: 'PatientObjectFields4NotesLabReq',
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

const ClinicObjectFields4NotesLabReq = objectType({
  name: 'ClinicObjectFields4NotesLabReq',
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

const DoctorObjectFields4NotesLabReq = objectType({
  name: 'DoctorObjectFields4NotesLabReq',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.int('SPECIALIZATION');
    t.string('EMP_TITLE');
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4NotesLabReq,
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
      type: ClinicObjectFields4NotesLabReq,
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
    t.string('LIC_NUMBER');
    t.string('S2_LIC');
    t.string('PTR_LIC');
    t.list.field('esig_dp', {
      type: lab_esig_dp_picture,
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
const lab_esig_dp_picture = objectType({
  name: 'lab_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const SpecializationObjectFields4NotesLabReq = objectType({
  name: 'SpecializationObjectFields4NotesLabReq',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const RecordObjectFields4LabReq = objectType({
  name: 'RecordObjectFields4LabReq',
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
      type: ClinicObjectFields4NotesLabReq,
    });
    t.nullable.field('patientInfo', {
      type: PatientObjectFields4NotesLabReq,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4NotesLabReq,
    });
    t.nullable.field('NotesLabObj', {
      type: NotesLabObj,
      async resolve(root, _arg, ctx) {
        const result: any = await client.notes_labrequest.findFirst({
          where: {
            record_id: Number(root?.R_ID),
          },
        });
        return result;
      },
    });
  },
});

export const NotesLabInputType = inputObjectType({
  name: 'NotesLabInputType',
  definition(t) {
    t.nullable.int('recordID');
    // record
    t.nullable.int('clinic');
    t.nullable.int('doctorID');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.string('R_TYPE'); // 5
    t.nullable.int('isLinked');
    t.nullable.string('qrCode')
    t.nullable.int('isEMR');
    // lab req
    t.nullable.JSON('procedures');
    t.nullable.int('fasting');
    t.nullable.string('others');
    t.nullable.id('notesID')
    t.nullable.string('dateCreated')
  },
});

export const QueryNotesLab = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesLab', {
      type: NotesLabObj,
      args: { data: NotesLabInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_labrequest`',
          '`QueryNotesLab`'
        );

        let recordId: any;

        await(async () => {
          let qrCode = args?.data?.qrCode;
          if (qrCode) {
            const recordData = await client.records.findFirst({
              where: {
                qrcode: qrCode
              }
            })
            recordId = recordData?.R_ID

          }
        })()



        const result: any = await client.notes_labrequest.findFirst({
          where: {
            record_id: Number(args?.data!.recordID || recordId),
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

export const PostNotesLabReqEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesLabReqEMR', {
      type: RecordObjectFields4LabReq,
      args: { data: NotesLabInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesLabReq');
        const procedureJson = serialize(createData.procedures);
        try {
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordLabReq = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                R_TYPE: String(createData.R_TYPE), // 5
                doctorID: Number(session?.user?.id),
                isEMR: Number(1),
              },
            });
            const newChild = await trx.notes_labrequest.create({
              data: {
                clinic: Number(recordLabReq.CLINIC),
                patientID: createData.isLinked === 1 ? Number(createData.patientID) : null,
                emrPatientID: Number(createData.emrPatientID),
                doctorID: Number(session?.user?.id),
                record_id: Number(recordLabReq.R_ID),
                isEMR: Number(1),

                procedures: procedureJson,
                fasting: Number(createData.fasting),
                others: String(createData.others),
              },
            });
            return {
              ...recordLabReq,
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

export const PostNotesLabReq = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostNotesLabReq', {
      type: RecordObjectFields4LabReq,
      args: { data: NotesLabInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesLabReq');
        const procedureJson = serialize(createData.procedures);
        try {
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
            const recordLabReq = await trx.records.create({
              data: {
                CLINIC: Number(createData.clinic),
                patientID: Number(createData.patientID),
                R_TYPE: String(createData.R_TYPE), // 5
                doctorID: doctorDetails?.EMP_ID,
                isEMR: Number(0),
                qrcode:VoucherCode
              },
            });
            const newChild = await trx.notes_labrequest.create({
              data: {
                clinic: Number(recordLabReq.CLINIC),
                patientID: Number(recordLabReq.patientID),
                // emrPatientID: Number(createData.NoteTxtChildInputType.emrPatientID),
                doctorID: doctorDetails?.EMP_ID,
                record_id: Number(recordLabReq.R_ID),
                isEMR: Number(0),

                procedures: procedureJson,
                fasting: Number(createData.fasting),
                others: String(createData.others),
              },
            });
            return {
              ...recordLabReq,
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

export const DeleteNotesLabReq = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesLabReq', {
      type: RecordObjectFields4LabReq,
      args: { data: NotesLabInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostNotesLabReq');
        // const procedureJson = serialize(createData.procedures);
        try {
          const notesTransaction = await client.$transaction(async (trx) => {
            const recordLabReq = await trx.records.update({
              data: {
                isDeleted: 1
              },
              where: {
                R_ID: Number(createData?.recordID)
              }
            });
            const newChild = await trx.notes_labrequest.update({
              data: {
                isDeleted: 1
              },
              where: {
                id: Number(createData?.notesID)
              }
            });
            return {
              ...recordLabReq,
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
