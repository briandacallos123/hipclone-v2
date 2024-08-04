import { GraphQLError, assertWrappingType } from "graphql";
import { extendType, inputObjectType, list, objectType } from 'nexus';
import client from '../../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';


const SmokingObject = objectType({
    name: 'SmokingObject',
    definition(t) {
      t.int('id');
      t.nullable.int('patientID');
      t.nullable.int('emrPatientID');
      t.nullable.int('doctorID');
      t.nullable.int('isEMR');
      t.nullable.string('patient');
      t.nullable.string('doctor');
      t.nullable.date('dateCreated');
      t.nullable.string('smoking');
      t.nullable.int('isDeleted');
    },
  });


  

  
// export const UserUpdatePhoneProfileUpsertType = inputObjectType({
export const smoking_input_request = inputObjectType({
    name: "smoking_input_request",
    definition(t) {
      t.nullable.int("patientID");
      t.nullable.int("emrPatientID");
      t.nullable.int("isEMR");
      t.nullable.string("patient");  
      t.nonNull.list.field('smoking',{
        type: smoking_request
      });
    },
  });
  

  export const smoking_request = inputObjectType({
    name: "smoking_request",
    definition(t) {
      t.nullable.string("smoking");
    },
  });
  ///////////////////////////////////////
//   export const user_update_phone_transactions = objectType({
  export const smoking_transactions = objectType({
    name: "smoking_transactions",
    definition(t) {
      t.nullable.field('status', {
        type: 'String',
      });
      t.nullable.field('message', {
        type: 'String',
      });
      t.field('smoking_data', {
        type: list(SmokingObject),
      });
    },
  });
  ///////////////////////////////////////
      ///////////////////////////////////////
      async function InsertSmoking(d:any)
      {return await client.smoking.create({
      data:d
    })
    }
    ///////////////////////////////////////
  
//   export const mutationUpdatePhone = extendType({
    export const mutation_create_smoking = extendType({
        type: "Mutation",
        definition(t) {
          t.nonNull.field("mutation_create_smoking", {
            type: smoking_transactions, // Assuming medication_transactions is the return type
            args: {
              data: smoking_input_request!, // Assuming medication_input_request is the input type
            },
            async resolve(_, args, ctx) {
              const { patientID, emrPatientID,isEMR,patient,smoking }: any = args.data;
              const { session } = ctx;
              await cancelServerQueryRequest(client, session?.user?.id, '`mutation_create_smoking`', 'smoking_input_request');
      
              let res: any = {
                status: "Success",
                message: "Create Smoking Successfully",
                smoking_data: []
              };
              try {
                
                const doctorID = Number(session?.user.id);
                      const doctor = String(session?.user.doctorId);
                    
                      await Promise.all(smoking?.map(async (i: any, index: number) => {
                        const { smoking } = i;
                        const data = {
                          patientID,
                          emrPatientID,
                          doctorID,
                          isEMR,
                          patient,
                          doctor,
                          smoking,
                        };
                        
                        try {
                          const d = await InsertSmoking(data);
                          res.smoking_data.push(d); // Add the created allergy to the allergy_data array
                        } catch (error) {
                          console.error("Error Smoking ", error);
                          throw error;
                        }
                      }));
              } catch (error) {
                console.error(error);
                res = {
                  status: "Failed",
                  message: "An error occurred.",
                  smoking_data: [] // Set allergy_data to an empty array in case of an error
                };
              }
              return res;
            },
          });
        },
      });
      
  
  
  

















      
// VIEW SMOKING ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const smoking_record = objectType({
  name: 'smoking_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('patientInfo', {
      type: smoking_patientinfo,
    });
  },
});

  const smoking_patientinfo = objectType({
    name: 'smoking_patientinfo',
    definition(t) {
      t.int('S_ID');
      t.int('IDNO');
      t.int('isEMR');
      t.int('patientID');
      t.int('emrPatientID');
      t.nullable.list.field('smoking', {
        type: a_smoking,
      });
      t.nullable.field('userInfo', {
        type: smoking_user,
      });
    },
  });
  
  const smoking_user = objectType({
    name: 'smoking_user',
    definition(t) {
      t.nonNull.string('uuid');
    },
  });
  
  const a_smoking = objectType({
    name: 'a_smoking',
    definition(t) {
      t.int('id');
      t.int('patientID');
      t.nullable.int('emrPatientID');
      t.nullable.int('doctorID');
      t.nullable.int('isEMR');
      t.nullable.string('patient');
      t.nullable.string('doctor');
      t.nullable.date('dateCreated');
      t.nullable.string('smoking');
      t.nullable.int('isDeleted');
    },
  });
  


  
  /////////////////////////////////////
//REQUEST PAYLOADS
export const view_smoking_input_request = inputObjectType({
  name: 'view_smoking_input_request',
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
          smoking: { // date_appt = coloumn name
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
export const view_smoking_transactions = objectType({
  name: "view_smoking_transactions",
  definition(t) {
    t.nullable.list.field("view_smoking_data", {
      type: a_smoking,
    });
    t.nullable.list.field("smoking_data", {
      type: a_smoking,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////
  ////////////////////////////////////
  ////////////////////////////////////
  export const view_patient_smoking_data = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('view_patient_smoking_data', {
        type: view_smoking_transactions,
        args: { data: view_smoking_input_request!},
        async resolve(_root, args, ctx) {
          const { uuid,skip,take  } : any = args.data;
          const whereconditions = filters(args);
          const { session } = ctx;
          await cancelServerQueryRequest(client, session?.user?.id, '`view_patient_smoking_data`', 'view_smoking_input_request');
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
            const [smoking_record,smoking_record_data,_count,]: any = await client.$transaction([
              ////////////////////////////////////////////////
              client.smoking.findMany({
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
              client.smoking.findMany({
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
              client.smoking.aggregate({
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
              ////////////////////////////////////////////////
            ]);
            
                      
            const _result: any = smoking_record;
            const _result_data: any = smoking_record_data;
            const _total: any = _count;
  
            const response: any = {
              view_smoking_data: _result,
              smoking_data: _result_data,
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


            const [smoking_record,smoking_record_data,_count,]: any = await client.$transaction([
              ////////////////////////////////////////////////
              client.smoking.findMany({
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
              client.smoking.findMany({
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),
              client.smoking.aggregate({
                where: {
                  isDeleted: 0,
                  patientID: Number(patientId),
                  ...whereconditions,
                },
                _count: {
                  id: true, 
                },
              }),
              ////////////////////////////////////////////////
            ]);
            
                      
            const _result: any = smoking_record;
            const _result_data: any = smoking_record_data;
            const _total: any = _count;
  
            const response: any = {
              view_smoking_data: _result,
              smoking_data: _result_data,
              total_records: Number(_total?._count?.id),
            }
            
            return response;
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
// VIEW SMOKING ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
















      
// VIEW SMOKING EMR ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const emr_smoking_record = objectType({
  name: 'emr_smoking_record',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.string('R_TYPE');
    t.nullable.field('emr_patient', {
      type: emr_patient_smoking,
    });
  },
});

  const emr_patient_smoking = objectType({
    name: 'emr_patient_smoking',
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
      t.nullable.list.field('smoking', {
        type: emr_a_smoking,
      });
    },
  });
  
  
  
  const emr_a_smoking = objectType({
    name: 'emr_a_smoking',
    definition(t) {
      t.int('id');
      t.int('patientID');
      t.nullable.int('emrPatientID');
      t.nullable.int('doctorID');
      t.nullable.int('isEMR');
      t.nullable.string('patient');
      t.nullable.string('doctor');
      t.nullable.date('dateCreated');
      t.nullable.string('smoking');
      t.nullable.int('isDeleted');
    },
  });
  


  
  /////////////////////////////////////
//REQUEST PAYLOADS
export const emr_view_smoking_input_request = inputObjectType({
  name: 'emr_view_smoking_input_request',
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
          smoking: { // date_appt = coloumn name
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
export const emr_view_smoking_transactions = objectType({
  name: "emr_view_smoking_transactions",
  definition(t) {
    t.nullable.list.field("emr_view_smoking_data", {
      type: emr_a_smoking,
    });
    t.nullable.list.field("view_smoking_data", {
      type: emr_a_smoking,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////
  ////////////////////////////////////
  ////////////////////////////////////
  export const emr_view_patient_smoking_data = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('emr_view_patient_smoking_data', {
        type: emr_view_smoking_transactions,
        args: { data: emr_view_smoking_input_request!},
        async resolve(_root, args, ctx) {
          const { uuid,skip,take  } : any = args.data;
          const whereconditions = filters(args);
          const { session } = ctx;
          await cancelServerQueryRequest(client, session?.user?.id, '`emr_view_patient_smoking_data`', 'emr_view_smoking_input_request');
          let res: any = {};
          try {

            const record:any = await client.emr_patient.findFirst({
              where:{
                id:Number(args?.data!.uuid)
              }
            });
             
            if(Number(record?.link) === 1){
              const [emr_smoking_record,emr_smoking_record_data, _count,]: any = await client.$transaction([
                ////////////////////////////////////////////////
              client.smoking.findMany({
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
              client.smoking.findMany({
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
              client.smoking.aggregate({
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
              ////////////////////////////////////////////////
              ]);
              
                        
              const _result: any = emr_smoking_record;
              const _result_data: any = emr_smoking_record_data;
              const _total: any = _count;
    
              const response: any = {
                emr_view_smoking_data: _result,
                view_smoking_data: _result_data,
                total_records: Number(_total?._count?.id),
              }
    
              return response;
            }else{
              const [emr_smoking_record,emr_smoking_record_data, _count,]: any = await client.$transaction([
                ////////////////////////////////////////////////
              client.smoking.findMany({
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
              client.smoking.findMany({
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                },
                orderBy: {
                  dateCreated: 'desc',
                },
                take: 5,
              }),
              client.smoking.aggregate({
                where: {
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                  ...whereconditions,
                },
                _count: {
                  id: true, 
                },
              }),
              ////////////////////////////////////////////////
              ]);
              
                        
              const _result: any = emr_smoking_record;
              const _result_data: any = emr_smoking_record_data;
              const _total: any = _count;
    
              const response: any = {
                emr_view_smoking_data: _result,
                view_smoking_data: _result_data,
                total_records: Number(_total?._count?.id),
              }
    
              return response;
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
// VIEW SMOKING EMR ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////