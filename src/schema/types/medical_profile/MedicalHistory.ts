import { GraphQLError, assertWrappingType } from "graphql";
import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';


const MedicalHistoryObject = objectType({
  name: 'MedicalHistoryObject',
  definition(t) {
    t.int('id');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medhistory');
    t.nullable.int('isDeleted');
  },
});





// export const UserUpdatePhoneProfileUpsertType = inputObjectType({
export const medical_history_input_request = inputObjectType({
  name: "medical_history_input_request",
  definition(t) {
    t.nullable.int("patientID");
    t.nullable.int("emrPatientID");
    t.nullable.int("isEMR");
    t.nullable.string("patient");
    t.nonNull.list.field('medhistory', {
      type: medhistory_request
    });
  },
});

export const medhistory_request = inputObjectType({
  name: "medhistory_request",
  definition(t) {
    t.string("medhistory");
  },
});
///////////////////////////////////////
//   export const user_update_phone_transactions = objectType({
export const medical_history_transactions = objectType({
  name: "medical_history_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.field('medical_history_data', {
      type: list(MedicalHistoryObject),
    });
  },
});
///////////////////////////////////////
///////////////////////////////////////
async function InsertMedicalHistory(d: any) {
  return await client.medicalhistory.create({
    data: d
  })
}
///////////////////////////////////////
//   export const mutationUpdatePhone = extendType({
export const mutation_create_medical_history = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutation_create_medical_history", {
      type: medical_history_transactions, // Assuming medication_transactions is the return type
      args: {
        data: medical_history_input_request!, // Assuming medication_input_request is the input type
      },
      async resolve(_, args, ctx) {
        const { patientID, emrPatientID, isEMR, patient, medhistory }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`mutation_create_medical_history`', 'medical_history_input_request');

        let res: any = {
          status: "Success",
          message: "Create Medical History Successfully",
          medical_history_data: []
        };
        try {

          const doctorDetails = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
          })
          const doctorID = Number(doctorDetails?.EMP_ID);
          const doctor = String(session?.user.doctorId);

          await Promise.all(medhistory?.map(async (i: any, index: number) => {
            const { medhistory } = i;
            const data = {
              patientID,
              emrPatientID,
              doctorID,
              isEMR,
              patient,
              doctor,
              medhistory,
            };

            try {
              const d = await InsertMedicalHistory(data);
              res.medical_history_data.push(d); // Add the created allergy to the allergy_data array
            } catch (error) {
              console.error("Error medical history ", error);
              throw error;
            }

          }));

        } catch (error) {
          console.error(error);
          res = {
            status: "Failed",
            message: "An error occurred.",
            medical_history_data: [] // Set allergy_data to an empty array in case of an error
          };
        }
        return res;
      },
    });
  },
});


























// VIEW MEDICAL HISTORY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const medical_history_record = objectType({
  name: 'medical_history_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('patientInfo', {
      type: medical_history_patientinfo,
    });
  },
});

const medical_history_patientinfo = objectType({
  name: 'medical_history_patientinfo',
  definition(t) {
    t.int('S_ID');
    t.int('IDNO');
    t.int('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.nullable.list.field('medicalhistory', {
      type: a_medicalhistory,
    });
    t.nullable.field('userInfo', {
      type: medical_history_user,
    });
  },
});

const medical_history_user = objectType({
  name: 'medical_history_user',
  definition(t) {
    t.nonNull.string('uuid');
  },
});

const a_medicalhistory = objectType({
  name: 'a_medicalhistory',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medhistory');
    t.nullable.int('isDeleted');
  },
});


/////////////////////////////////////
//REQUEST PAYLOADS
export const view_medical_history_input_request = inputObjectType({
  name: 'view_medical_history_input_request',
  definition(t) {
    t.nullable.string('uuid');
    t.nullable.int("take");
    t.nullable.int("skip");
    t.nullable.string("searchKeyword");
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////


//FILTERS
//////////////////////////////////////////////////////////////////////////
const filters = (args: any) => {
  let where: any = {};
  let multicondition: any = {};

  if (args?.data?.searchKeyword) {
    where = {
      OR: [
        {
          medhistory: { // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
      ],
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...where,
    },
  };
  return multicondition;
};
//FILTERS
//////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////
export const view_medical_history_transactions = objectType({
  name: "view_medical_history_transactions",
  definition(t) {
    t.nullable.list.field("view_medical_history_data", {
      type: a_medicalhistory,
    });
    t.nullable.list.field("medical_history_data", {
      type: a_medicalhistory,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////



////////////////////////////////////
////////////////////////////////////
export const view_patient_medical_history_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('view_patient_medical_history_data', {
      type: view_medical_history_transactions,
      args: { data: view_medical_history_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip }: any = args.data;
        const whereconditions = filters(args);
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`view_patient_medical_history_data`', 'view_medical_history_input_request');
        let res: any = {};
        try {

          const patientInfo:any = await client.user.findFirst({
            where:{
              uuid:String(args?.data!.uuid),
            },
            include:{
              patientInfo:true
            }
          })
          const emrPatientId = await client.emr_patient.findFirst({
            where:{
              patientID:Number(patientInfo?.patientInfo?.S_ID)
            }
          })

          if(emrPatientId && Number(emrPatientId?.link) === 1){
            ////////////////////////////////////
            const [medical_history_record, medical_history_record_data, _count,]: any = await client.$transaction([
            client.medicalhistory.findMany({
              take,
              skip,
              where: {
                isDeleted: 0,
                OR: [
                  {
                    emrPatientID: Number(emrPatientId?.id),
                    ...whereconditions,
                  },
                  {
                    patientID: Number(emrPatientId?.patientID),
                    ...whereconditions,
                  },
                ],
              },
              orderBy: {
                dateCreated: 'desc',
              },
            }),
            client.medicalhistory.findMany({
              where: {
                isDeleted: 0,
                OR: [
                  {
                    emrPatientID: Number(emrPatientId?.id),
                  },
                  {
                    patientID: Number(emrPatientId?.patientID),
                  },
                ],
              },
              orderBy: {
                dateCreated: 'desc',
              },
              take: 5,
            }),
            client.medicalhistory.aggregate({
              where: {
                isDeleted: 0,
                OR: [
                  {
                    emrPatientID: Number(emrPatientId?.id),
                    ...whereconditions,
                  },
                  {
                    patientID: Number(emrPatientId?.patientID),
                    ...whereconditions,
                  },
                ],
              },
              _count: {
                id: true, 
              },
            }),
          ]);

          const _result: any = medical_history_record;
          const _result_data: any = medical_history_record_data;
          const _total: any = _count;

          const response: any = {
            view_medical_history_data: _result,
            medical_history_data: medical_history_record_data,
            total_records: Number(_total?._count?.id),
          }

          return response;
          ////////////////////////////////////
          }else{
            let patientId: any;

            if (emrPatientId) {
              patientId = emrPatientId?.patientID
            } else {
              patientId = patientInfo?.patientInfo?.S_ID
            }

            ////////////////////////////////////
            const [medical_history_record, medical_history_record_data, _count,]: any = await client.$transaction([
              client.medicalhistory.findMany({
                take,
                skip,
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                  ...whereconditions,
                },
                orderBy: {
                  dateCreated: 'desc',
                },
              }),
              client.medicalhistory.findMany({
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),
              client.medicalhistory.aggregate({
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                  ...whereconditions,
                },
                _count: {
                  id: true, 
                },
              }),
            ]);
  
            const _result: any = medical_history_record;
            const _result_data: any = medical_history_record_data;
            const _total: any = _count;
  
            const response: any = {
              view_medical_history_data: _result,
              medical_history_data: medical_history_record_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
            ////////////////////////////////////
          }

        } catch (error) {
          console.log(error);
          return res;
        }
        return res;
      },
    });
  },
});
// VIEW MEDICAL HISTORY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////





















// VIEW MEDICAL HISTORY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const emr_medical_history_record = objectType({
  name: 'emr_medical_history_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('emr_patient', {
      type: emr_patient_medical_history,
    });
  },
});

const emr_patient_medical_history = objectType({
  name: 'emr_patient_medical_history',
  definition(t) {
    t.nullable.int('id')
      t.nullable.int('patientID')
      t.nullable.int('doctorID')
      t.nullable.int('isEMR')
      t.nullable.int('link')
      t.nullable.bigInt('idno')
      t.nullable.string('fname')
      t.nullable.string('mname')
      t.nullable.string('lname')
      t.nullable.string('suffix')
      t.nullable.int('gender')
      t.nullable.string('contact_no')
      t.nullable.string('email')
      t.nullable.string('doctor')
      t.nullable.string('patient')
      t.nullable.dateTime('date_added')
      t.nullable.string('dateofbirth')
      t.nullable.string('address')
      t.nullable.int('status')
      t.nullable.int('isdeleted')
      t.nullable.list.field('medicalhistory', {
        type: a_medicalhistory,
      });
  },
});



const emr_a_medicalhistory = objectType({
  name: 'emr_a_medicalhistory',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medhistory');
    t.nullable.int('isDeleted');
  },
});


/////////////////////////////////////
//REQUEST PAYLOADS
export const emr_view_medical_history_input_request = inputObjectType({
  name: 'emr_view_medical_history_input_request',
  definition(t) {
    t.nullable.int('uuid');
    t.nullable.int("take");
    t.nullable.int("skip");
    t.nullable.string("searchKeyword");
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////


//FILTERS
//////////////////////////////////////////////////////////////////////////
const emr_filters = (args: any) => {
  let where: any = {};
  let multicondition: any = {};

  if (args?.data?.searchKeyword) {
    where = {
      OR: [
        {
          medhistory: { // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
      ],
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...where,
    },
  };
  return multicondition;
};
//FILTERS
//////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////
export const emr_view_medical_history_transactions = objectType({
  name: "emr_view_medical_history_transactions",
  definition(t) {
    t.nullable.list.field("emr_view_medical_history_data", {
      type: emr_a_medicalhistory,
    });
    t.nullable.list.field("view_medical_history_data", {
      type: emr_a_medicalhistory,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////



////////////////////////////////////
////////////////////////////////////
export const emr_view_patient_medical_history_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('emr_view_patient_medical_history_data', {
      type: emr_view_medical_history_transactions,
      args: { data: emr_view_medical_history_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip }: any = args.data;
        const whereconditions = emr_filters(args);
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`emr_view_patient_medical_history_data`', 'emr_view_medical_history_input_request');
        let res: any = {};
        try {

          const record:any = await client.emr_patient.findFirst({
            where:{
              id:Number(args?.data!.uuid)
            }
          }); 
  
          if(Number(record?.link) === 1){
            ////////////////////////////////////
            const [emr_medical_history_record,emr_medical_history_record_data,_count,]: any = await client.$transaction([
              client.medicalhistory.findMany({
                take,
                skip,
                where: {
                  isDeleted: 0,
                  OR: [
                    {
                      emrPatientID: Number(record?.id),
                      ...whereconditions,
                    },
                    {
                      patientID: Number(record?.patientID),
                      ...whereconditions,
                    },
                  ],
                },
                orderBy: {
                  dateCreated: 'desc',
                },
              }),
              client.medicalhistory.findMany({
                where: {
                  isDeleted: 0,
                  OR: [
                    {
                      emrPatientID: Number(record?.id),
                    },
                    {
                      patientID: Number(record?.patientID),
                    },
                  ],
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                 take: 5,
              }),
              client.medicalhistory.aggregate({
                where: {
                  isDeleted: 0,
                  OR: [
                    {
                      emrPatientID: Number(record?.id),
                      ...whereconditions,
                    },
                    {
                      patientID: Number(record?.patientID),
                      ...whereconditions,
                    },
                  ],
                },
                _count: {
                  id: true, 
                },
              }),
            ]);
            
                      
            const _result: any = emr_medical_history_record;
            const _result_data: any = emr_medical_history_record_data;
            const _total: any = _count;
  
            const response: any = {
              emr_view_medical_history_data: _result,
              view_medical_history_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
            ////////////////////////////////////
          }else{
            ////////////////////////////////////
            const [emr_medical_history_record,emr_medical_history_record_data,_count,]: any = await client.$transaction([
              client.medicalhistory.findMany({
                take,
                skip,
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                  ...whereconditions,
                },
                orderBy: {
                  dateCreated: 'desc',
                },
              }),
              client.medicalhistory.findMany({
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),
              client.medicalhistory.aggregate({
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                  ...whereconditions,
                },
                _count: {
                  id: true, 
                },
              }),
            ]);
            
                      
            const _result: any = emr_medical_history_record;
            const _result_data: any = emr_medical_history_record_data;
            const _total: any = _count;
  
            const response: any = {
              emr_view_medical_history_data: _result,
              view_medical_history_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
            ////////////////////////////////////
          }

          
        } catch (error) {
          console.log(error);
          return res;
        }
        return res;
      },
    });
  },
});
// VIEW MEDICAL HISTORY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////