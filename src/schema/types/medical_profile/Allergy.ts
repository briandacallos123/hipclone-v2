import { GraphQLError, assertWrappingType } from "graphql";
import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const AllergyObject = objectType({
  name: 'AllergyObject',
  definition(t) {
    t.int('id');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('allergy');
    t.nullable.int('isDeleted');
  },
});

export const allergy_input_request = inputObjectType({
  name: "allergy_input_request",
  definition(t) {
    t.nullable.int("patientID");
    t.nullable.int("emrPatientID");
    t.nullable.int("isEMR");
    t.nullable.string("patient");
    t.nonNull.list.field("allergy", {
      type: allergy_request
    });
  },
});

export const allergy_request = inputObjectType({
  name: "allergy_request",
  definition(t) {
    t.string("allergy");
  },
});

export const allergy_transactions = objectType({
  name: "allergy_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.field('allergy_data', {
      type: list(AllergyObject),
    });
  },
});

async function InsertAllergy(d: any) {
  return await client.allergy.create({
    data: d
  })
}

export const mutation_create_allergy = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutation_create_allergy", {
      type: allergy_transactions,
      args: {
        data: allergy_input_request!,
      },
      async resolve(_, args, ctx) {
        const { patientID, emrPatientID, isEMR, patient, allergy }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`mutation_create_allergy`', 'allergy_input_request');

        let res: any = {
          status: "Success",
          message: "Create Allergy Successfully",
          allergy_data: []
        };

        try {
          const doctorDetails = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
          })

            const doctorID = Number(doctorDetails?.EMP_ID);

          const doctor = String(session?.user.doctorId);

          await Promise.all(allergy?.map(async (i: any, index: number) => {
            const { allergy } = i;
            const data = {
              patientID,
              emrPatientID,
              doctorID,
              isEMR,
              patient,
              doctor,
              allergy,
            };

            try {
              const d = await InsertAllergy(data);
              res.allergy_data.push(d); // Add the created allergy to the allergy_data array
            } catch (error) {
              console.error("Error inserting allergy:", error);
              throw error;
            }
          }));
        } catch (error) {
          console.error(error);
          res = {
            status: "Failed",
            message: "An error occurred.",
            allergy_data: [] // Set allergy_data to an empty array in case of an error
          };
        }
        return res;
      },
    });
  },
});






























// VIEW ALLERGY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const allergy_record = objectType({
  name: 'allergy_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('patientInfo', {
      type: allergy_patientinfo,
    });
  },
});

const allergy_patientinfo = objectType({
  name: 'allergy_patientinfo',
  definition(t) {
    t.int('S_ID');
    t.int('IDNO');
    t.int('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.nullable.list.field('allergy', {
      type: a_allergy,
    });
    t.nullable.field('userInfo', {
      type: allergy_user,
    });
  },
});

const allergy_user = objectType({
  name: 'allergy_user',
  definition(t) {
    t.nonNull.string('uuid');
  },
});

const a_allergy = objectType({
  name: 'a_allergy',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('allergy');
    t.nullable.int('isDeleted');
  },
});




/////////////////////////////////////
//REQUEST PAYLOADS
export const view_allergy_input_request = inputObjectType({
  name: 'view_allergy_input_request',
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
          allergy: { // date_appt = coloumn name
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
export const view_allergy_transactions = objectType({
  name: "view_allergy_transactions",
  definition(t) {
    t.nullable.list.field("view_allegy_data", {
      type: a_allergy,
    });
    t.nullable.list.field("allegy_data", {
      type: a_allergy,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////


////////////////////////////////////
////////////////////////////////////
export const view_patient_allegy_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('view_patient_allegy_data', {
      type: view_allergy_transactions,
      args: { data: view_allergy_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip,}: any = args.data;

        const whereconditions = filters(args);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`view_patient_allegy_data`', 'view_allergy_input_request');
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
            const [AllergyObject,AllergyObject_data, _count,]: any = await client.$transaction([ 
              client.allergy.findMany({
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
              client.allergy.findMany({
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
              }),client.allergy.aggregate({
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
            
                      
            const _result: any = AllergyObject;
            const _result_data: any = AllergyObject_data;
            const _total: any = _count;
  
            const response: any = {
              view_allegy_data: _result,
              allegy_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
          }else{
            let patientId: any;

            if (emrPatientId) {
              patientId = emrPatientId?.patientID
            } else {
              patientId = patientInfo?.patientInfo?.S_ID
            }

            const [AllergyObject,AllergyObject_data, _count,]: any = await client.$transaction([ 
              client.allergy.findMany({
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
              client.allergy.findMany({
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),client.allergy.aggregate({
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
            
                      
            const _result: any = AllergyObject;
            const _result_data: any = AllergyObject_data;
            const _total: any = _count;
  
            const response: any = {
              view_allegy_data: _result,
              allegy_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
          }
          
        } catch (error) {
          console.log(error);
          return res;
        }

      },
    });
  },
});
// VIEW ALLERGY ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////



















// VIEW ALLERGY EMR PATIENT////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const emr_allergy_record = objectType({
  name: 'emr_allergy_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('emr_patient', {
      type: emr_patient_allergy,
    });
  },
});

const emr_patient_allergy = objectType({
  name: 'emr_patient_allergy',
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
    t.nullable.list.field('allergy', {
      type: emr_a_allergy,
    });
  },
});


const emr_a_allergy = objectType({
  name: 'emr_a_allergy',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('allergy');
    t.nullable.int('isDeleted');
  },
});




/////////////////////////////////////
//REQUEST PAYLOADS
export const emr_view_allergy_input_request = inputObjectType({
  name: 'emr_view_allergy_input_request',
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
          allergy: { // date_appt = coloumn name
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
export const emr_view_allergy_transactions = objectType({
  name: "emr_view_allergy_transactions",
  definition(t) {
    t.nullable.list.field("emr_view_allegy_data", {
      type: emr_a_allergy,
    });
    t.nullable.list.field("view_allegy_data", {
      type: emr_a_allergy,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////


////////////////////////////////////
////////////////////////////////////
export const emr_view_patient_allegy_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('emr_view_patient_allegy_data', {
      type: emr_view_allergy_transactions,
      args: { data: emr_view_allergy_input_request! },
      async resolve(_root, args, ctx) {
        const { uuid, take, skip,}: any = args.data;

        const whereconditions = emr_filters(args);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`emr_view_patient_allegy_data`', 'emr_view_allergy_input_request');
        let res: any = {};
        try {
          
          const record:any = await client.emr_patient.findFirst({
            where:{
              id:Number(args?.data!.uuid)
            }
          }); 

          if(Number(record?.link) === 1){
            const [emr_allergy_record,emr_allergy_record_data, _count,]: any = await client.$transaction([ 
              client.allergy.findMany({
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
              client.allergy.findMany({
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
              }),client.allergy.aggregate({
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
            
                      
            const _result: any = emr_allergy_record;
            const _result_data: any = emr_allergy_record_data;
            const _total: any = _count;
  
            const response: any = {
              emr_view_allegy_data: _result,
              view_allegy_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
          }else{
            const [emr_allergy_record,emr_allergy_record_data, _count,]: any = await client.$transaction([ 
              client.allergy.findMany({
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
              client.allergy.findMany({
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                      ...whereconditions,
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),client.allergy.aggregate({
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
            
                      
            const _result: any = emr_allergy_record;
            const _result_data: any = emr_allergy_record_data;
            const _total: any = _count;
  
            const response: any = {
              emr_view_allegy_data: _result,
              view_allegy_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
  
            return response;
          }
          
        } catch (error) {
          console.log(error);
          return res;
        }

      },
    });
  },
});
// VIEW ALLERGY EMR PATIENT ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


