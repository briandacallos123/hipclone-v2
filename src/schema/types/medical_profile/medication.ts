import { GraphQLError, assertWrappingType } from "graphql";
import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';


const MedicationObject = objectType({
  name: 'MedicationObject',
  definition(t) {
    t.int('id');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medication');
    t.nullable.int('isDeleted');
  },
});







// export const UserUpdatePhoneProfileUpsertType = inputObjectType({
export const medication_input_request = inputObjectType({
  name: "medication_input_request",
  definition(t) {
    t.nullable.int("patientID");
    t.nullable.int("emrPatientID");
    t.nullable.int("isEMR");
    t.nullable.string("patient");
    t.nonNull.list.field('medication', {
      type: medication_request
    });
  },
});


export const medication_request = inputObjectType({
  name: "medication_request",
  definition(t) {
    t.nullable.string("medication");
  },
});

///////////////////////////////////////
//   export const user_update_phone_transactions = objectType({
export const medication_transactions = objectType({
  name: "medication_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.field('create_medication_data', {
      type: list(MedicationObject),
    });
  },
});
///////////////////////////////////////
///////////////////////////////////////
async function InsertMedication(d: any) {
  return await client.medication.create({
    data: d
  })
}
///////////////////////////////////////
//   export const mutationUpdatePhone = extendType({
export const mutation_create_medication = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutation_create_medication", {
      type: medication_transactions, // Assuming medication_transactions is the return type
      args: {
        data: medication_input_request!, // Assuming medication_input_request is the input type
      },
      async resolve(_, args, ctx) {
        const { patientID, emrPatientID, isEMR, patient, medication }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`mutation_create_medication`', 'medication_input_request');

        let res: any = {
          status: "Success",
          message: "Create medication Successfully",
          create_medication_data: []
        };
        try {

          const doctorID = Number(session?.user.id);
          const doctor = String(session?.user.doctorId);

          await Promise.all(medication?.map(async (i: any, index: number) => {
            const { medication } = i;
            const data = {
              patientID,
              emrPatientID,
              doctorID,
              isEMR,
              patient,
              doctor,
              medication,
            };


            try {
              const d = await InsertMedication(data);
              res.create_medication_data.push(d); // Add the created allergy to the allergy_data array
            } catch (error) {
              console.error("Error medication ", error);
              throw error;
            }

          }));
        } catch (error) {
          console.error(error);
          res = {
            status: "Failed",
            message: "An error occurred.",
            create_medication_data: [] // Set allergy_data to an empty array in case of an error
          };
        }
        return res;
      },
    });
  },
});


















// VIEW MEDICATION ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const medication_record = objectType({
  name: 'medication_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('patientInfo', {
      type: medication_patientinfo,
    });
  },
});

const medication_patientinfo = objectType({
  name: 'medication_patientinfo',
  definition(t) {
    t.int('S_ID');
    t.int('IDNO');
    t.int('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.nullable.list.field('medication', {
      type: a_medication,
    });
    t.nullable.field('userInfo', {
      type: medication_user,
    });
  },
});

const medication_user = objectType({
  name: 'medication_user',
  definition(t) {
    t.nonNull.string('uuid');
  },
});

const a_medication = objectType({
  name: 'a_medication',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medication');
    t.nullable.int('isDeleted');
  },
});




/////////////////////////////////////
//REQUEST PAYLOADS
export const view_medication_input_request = inputObjectType({
  name: 'view_medication_input_request',
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
          medication: { // date_appt = coloumn name
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
export const view_medication_transactions = objectType({
  name: "view_medication_transactions",
  definition(t) {
    t.nullable.list.field("view_medication_data", {
      type: a_medication,
    });
    t.nullable.list.field("medication_data", {
      type: a_medication,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////

////////////////////////////////////
////////////////////////////////////
export const view_patient_medication_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('view_patient_medication_data', {
      type: view_medication_transactions,
      args: { data: view_medication_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip }: any = args.data;
        const whereconditions = filters(args);
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`view_patient_medication_data`', 'view_medication_input_request');
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


          // console.log(patientInfo,"@@@@2")
          // console.log(emrPatientId,"@@@@23")

          if(emrPatientId && Number(emrPatientId?.link) === 1){

            ////////////////////////////////////
          const [medication_record, data_medication, _count,]: any = await client.$transaction([
            ////////////////////////////////////////////////
            client.medication.findMany({
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
            client.medication.findMany({
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
            client.medication.aggregate({
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

          
          const _result: any = medication_record;
          const _result_data: any = data_medication;
          const _total: any = _count;

          const response: any = {
            view_medication_data: _result,
            medication_data: _result_data,
            total_records: Number(_total?._count?.id),
          }

          return response;
          ////////////////////////////////////

          }else{
              ////////////////////////////////////
          const [medication_record, data_medication, _count,]: any = await client.$transaction([
            ////////////////////////////////////////////////
            client.medication.findMany({
              take,
              skip,
              where: {
                isDeleted: 0,
                patientID: Number(emrPatientId?.patientID),
                ...whereconditions,
              },
              orderBy: {
                dateCreated: 'desc',
              },
            }),
            client.medication.findMany({
              where: {
                isDeleted: 0,
                patientID: Number(emrPatientId?.patientID),
              },
              orderBy: {
                dateCreated: 'desc',
              },
              take: 5,
            }),client.medication.aggregate({
              where: {
                isDeleted: 0,
                patientID: Number(emrPatientId?.patientID),
                ...whereconditions,
              },
              _count: {
                id: true, 
              },
            }),
            
          ]);

          
          const _result: any = medication_record;
          const _result_data: any = data_medication;
          const _total: any = _count;

          const response: any = {
            view_medication_data: _result,
            medication_data: _result_data,
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
// VIEW MEDICATION ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
















// VIEW MEDICATION ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const emr_medication_record = objectType({
  name: 'emr_medication_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('emr_patient', {
      type: emr_patient_medication,
    });
  },
});

const emr_patient_medication = objectType({
  name: 'emr_patient_medication',
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
      t.nullable.list.field('medication', {
        type: emr_a_medication,
      });
  },
});

const emr_a_medication = objectType({
  name: 'emr_a_medication',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('medication');
    t.nullable.int('isDeleted');
  },
});




/////////////////////////////////////
//REQUEST PAYLOADS
export const emr_view_medication_input_request = inputObjectType({
  name: 'emr_view_medication_input_request',
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
          medication: { // date_appt = coloumn name
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
export const emr_view_medication_transactions = objectType({
  name: "emr_view_medication_transactions",
  definition(t) {
    t.nullable.list.field("emr_view_medication_data", {
      type: emr_a_medication,
    });
    t.nullable.list.field("emr_medication_data", {
      type: emr_a_medication,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////

////////////////////////////////////
////////////////////////////////////
export const emr_view_patient_medication_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('emr_view_patient_medication_data', {
      type: emr_view_medication_transactions,
      args: { data: emr_view_medication_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip }: any = args.data;
        const whereconditions = emr_filters(args);
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`emr_view_patient_medication_data`', 'emr_view_medication_input_request');
        let res: any = {};
        try {

        const record:any = await client.emr_patient.findFirst({
          where:{
            id:Number(args?.data!.uuid)
          }
        }); 

        if(Number(record?.link) === 1){
          ////////////////////////////////////
            const [emr_medication_record, data_medication, _count,]: any = await client.$transaction([
            ////////////////////////////////////////////////
            client.medication.findMany({
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
            client.medication.findMany({
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
            }),client.medication.aggregate({
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
          
          
          const _result: any = emr_medication_record;
          const _result_data: any = data_medication;
          const _total: any = _count;

          const response: any = {
            emr_view_medication_data: _result,
            emr_medication_data: _result_data,
            total_records: Number(_total?._count?.id),
          }
          return response;

          
          ////////////////////////////////////
        }else{
          ////////////////////////////////////
          const [emr_medication_record, data_medication, _count,]: any = await client.$transaction([
            ////////////////////////////////////////////////
            client.medication.findMany({
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
            client.medication.findMany({
              where: {
                isDeleted: 0,
                emrPatientID: Number(record?.id),
                ...whereconditions,
              },
              orderBy: {
                dateCreated: 'desc',
              },
              take: 5,
            }),client.medication.aggregate({
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
          
          
          const _result: any = emr_medication_record;
          const _result_data: any = data_medication;
          const _total: any = _count;

          const response: any = {
            emr_view_medication_data: _result,
            emr_medication_data: _result_data,
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
// VIEW MEDICATION ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////