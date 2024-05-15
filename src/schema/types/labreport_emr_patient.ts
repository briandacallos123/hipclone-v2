import { GraphQLError } from 'graphql/error/GraphQLError';
// import { PrismaClient } from '@prisma/client';
import { unserialize } from 'php-serialize';
import { extendType, inputObjectType, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';

//
const emr_labreport = objectType({
  name: 'emr_labreport',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('patientID');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.date('dateCreated');
    t.nullable.string('type');
    t.nullable.string('labName');
    t.nullable.date('resultDate');
    t.nullable.string('remarks');
    t.nullable.int('isDeleted');
    t.list.field('labreport_attachments', {
      type: emr_labreport_attachments,
    });
    t.nullable.field('doctorInfo', {
      type: emr_doctorInfoObjectType,
      // type: labreport_doctor_details,
    });
    t.nullable.field('clinicInfo', {
      type: emr_clinicInfoObjetType,
    });
    t.nullable.field('patientInfo', {
      type: lab_patient_info,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.patient.findFirst({
          where: {
            S_ID: Number(root?.patientID),
          },
        });

        return result;
      },
    });
    t.nullable.field('emrPatientInfo', {
      type: emr_patientInfoObjectType,
    });
  },
});
///////////////////////////////////////////////////////


/// ////////////////////////////////////////////////////
const lab_patient_info = objectType({
  name: 'lab_patient_info',
  definition(t) {
    t.nullable.id('IDNO');
    t.nullable.string('FULLNAME');
    t.nullable.string('FNAME');
    t.nullable.string('LNAME');
    t.nullable.string('MNAME');
    t.nullable.string('SUFFIX');
    t.nullable.int('SEX');
    t.nullable.string('BDAY');
    t.nullable.string('BPLACE');
    t.nullable.int('BLOOD_TYPE');
    // t.nullable.int('AGE');
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
    t.nullable.string('HOME_ADD');
    t.nullable.string('EMAIL');
    t.list.field('userInfo', {
      type: emr_user_object1,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.user.findMany({
          where: {
            email: String(root?.EMAIL),
          },
        });

        return result;
      },
    });
  },
});
/// ////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const emr_user_object1 = objectType({
  name: 'emr_user_object1',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('uuid');
    t.nullable.list.field('display_picture', {
      type: emr_lab_patient_display_picture_1,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.display_picture.findMany({
          where: {
            userID: Number(root?.id),
          },
          orderBy: {
            id: 'desc',
          },
        });

        return result;
      },
    });
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const emr_lab_patient_display_picture_1 = objectType({
  name: 'emr_lab_patient_display_picture_1',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
export const emr_labreport_attachments = objectType({
  name: 'emr_labreport_attachments',
  definition(t) {
    t.nullable.int('id');
    t.nullable.bigInt('patient');
    t.nullable.int('doctor');
    t.nullable.int('clinic');
    t.nullable.int('labreport_id');
    t.nullable.string('file_name');
    t.nullable.string('file_url');
    t.nullable.string('file_size');
    t.nullable.string('file_type');
    t.nullable.dateTime('date');
    t.nullable.int('isDeleted');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const emr_doctorInfoObjectType = objectType({
  name: 'emr_doctorInfoObjectType',
  definition(t) {
    t.id('EMPID');
    t.nullable.string('EMP_FULLNAME');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('CONTACT_NO');
    t.nullable.string('EMP_EMAIL');
    t.nullable.string('EMP_TITLE');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const emr_clinicInfoObjetType = objectType({
  name: 'emr_clinicInfoObjetType',
  definition(t) {
    t.id('id');
    t.nullable.string('doctor_idno');
    t.nullable.string('clinic_name');
    t.nullable.string('schedule');
    t.nullable.dateTime('s_clinicschedule');
    t.nullable.dateTime('e_clinicschedule');
    t.nullable.string('location');
    t.nullable.string('number');
    t.nullable.string('Province');
    t.nullable.dateTime('date');
    t.list.field('clinicDPInfo', {
      type: emr_lab_clinicDPInfos,
      // async resolve(root, _arg, _ctx) {
      //   const result: any = await client.user.findMany({
      //     where: {
      //       email: String(root?.EMAIL),
      //     },
      //   });

      //   return result;
      // },
    });
  },
});
///////////////////////////////////////////////////////

const emr_lab_clinicDPInfos = objectType({
  name: 'emr_lab_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

///////////////////////////////////////////////////////
const emr_patientInfoObjectType = objectType({
  name: 'emr_patientInfoObjectType',
  definition(t) {
    t.id('id');
    t.nullable.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.int('link');
    t.nullable.bigInt('idno');
    t.nullable.string('fname');
    t.nullable.string('mname');
    t.nullable.string('lname');
    t.nullable.string('suffix');
    t.nullable.int('gender');
    t.nullable.string('contact_no');
    t.nullable.string('email');
    t.nullable.string('doctor');
    t.nullable.string('patient');
    t.nullable.date('date_added');
    t.nullable.string('dateofbirth');
    t.nullable.string('address');
    t.nullable.int('status');
    t.nullable.int('isdeleted');
    t.field('patientRelation', {
      type: emr_patient_object,
    });
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const emr_patient_object = objectType({
  name: 'emr_patient_object',
  definition(t) {
    t.id('IDNO');
    t.nullable.string('FULLNAME');
    t.nullable.string('FNAME');
    t.nullable.string('LNAME');
    t.nullable.string('MNAME');
    t.nullable.string('SUFFIX');
    t.nullable.int('SEX');
    t.nullable.string('BDAY');
    t.nullable.string('BPLACE');
    t.nullable.int('BLOOD_TYPE');
    // t.nullable.int('AGE');
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
    t.nullable.string('HOME_ADD');
    t.nullable.string('EMAIL');
    t.nullable.list.field('labreport', {
      type: e_m_r_labreport_l,
    });
    t.list.field('userInfo', {
      type: emr_user_object,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.user.findMany({
          where: {
            email: String(root?.EMAIL),
          },
        });

        return result;
      },
    });
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const emr_user_object = objectType({
  name: 'emr_user_object',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('uuid');
    t.nullable.list.field('display_picture', {
      type: emr_lab_patient_display_picture,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.display_picture.findMany({
          where: {
            userID: Number(root?.id),
          },
          orderBy: {
            id: 'desc',
          },
        });

        return result;
      },
    });
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const emr_lab_patient_display_picture = objectType({
  name: 'emr_lab_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
export const e_m_r_labreport_l = objectType({
  name: 'e_m_r_labreport_l',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.date('dateCreated');
    t.nullable.string('type');
    t.nullable.string('labName');
    t.nullable.date('resultDate');
    t.nullable.string('remarks');
    t.nullable.int('isDeleted');
    t.list.field('labreport_attachments', {
      type: e_m_r_labreport_attachments_l,
    });
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const e_m_r_labreport_attachments_l = objectType({
  name: 'e_m_r_labreport_attachments_l',
  definition(t) {
    t.nullable.int('id');
    t.nullable.bigInt('patient');
    t.nullable.int('doctor');
    t.nullable.int('clinic');
    t.nullable.int('labreport_id');
    t.nullable.string('file_name');
    t.nullable.string('file_url');
    t.nullable.string('file_size');
    t.nullable.string('file_type');
    t.nullable.dateTime('date');
    t.nullable.int('isDeleted');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
//REQUEST PAYLOADS
export const emr_patient_lab_attachments_requests = inputObjectType({
  name: 'emr_patient_lab_attachments_requests',
  definition(t) {
    t.nullable.int('uuid');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
    t.nullable.date('startDate');
    t.nullable.date('endDate');
    t.nullable.string('userType');
  },
});
//REQUEST PAYLOADS
///////////////////////////////////////////////////////

/////////////////////////////////////
//FILTERS
const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereDate: any = {};
  let whereConClinic: any = {};

  if (args?.data?.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          labName: {
            // labName = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          resultDate: {
            // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          clinicInfo: {
            OR: [
              {
                clinic_name: {
                  contains: args?.data!.searchKeyword,
                },
              },
            ],
          },
        },
        {
          doctorInfo: {
            OR: [
              {
                EMP_FULLNAME: {
                  contains: args?.data?.searchKeyword,
                },
              },
              {
                EMP_FNAME: {
                  contains: args?.data?.searchKeyword,
                },
              },
              {
                EMP_MNAME: {
                  contains: args?.data?.searchKeyword,
                },
              },
              {
                EMP_LNAME: {
                  contains: args?.data?.searchKeyword,
                },
              },
            ],
          },
        },
      ],
    };
  }
  if (args?.data?.startDate && args?.data?.endDate) {
    whereDate = {
      dateCreated: {
        gte: args?.data?.startDate,
        lte: args?.data?.endDate,
      },
    };
  }

  const clinicIDs: any = args?.data?.clinicIds;
  if (clinicIDs?.length) {
    whereConClinic = {
      clinicInfo: {
        id: {
          in: clinicIDs,
        },
      },
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereDate,
      ...whereConClinic,
    },
  };
  return multicondition;
};
//FILTERS
/////////////////////////////////////

////////////////////////////////////
//SUMMARY TOTAL
// const Summary_Total_Arrays = objectType({
//   name: 'Summary_Total_Arrays',
//   definition(summary_total) {
//     summary_total.nullable.int('total');
//   },
// });
//SUMMARY TOTAL
////////////////////////////////////

/////////////////////////////////////////////////////
export const emr_labreport_p = objectType({
  name: 'emr_labreport_p',
  definition(t) {
    t.nullable.list.field('e_labreport_patient', {
      type: emr_labreport,
    });
    t.int('total_records');
    // t.field('summary_total', {
    //     type: Summary_Total_Arrays,
    // });
  },
});
///////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const emr_labreport_patient_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('emr_labreport_patient_data', {
      type: emr_labreport_p,
      args: { data: emr_patient_lab_attachments_requests! },
      async resolve(_root, args, ctx) {
        const { take, skip, orderBy, orderDir, uuid, userType }: any = args.data;
        // const result: any = await client.labreport.findMany()
        // return result
        // ORDER BY
        let order: any;
        switch (args?.data!.orderBy) {
          case 'hospital':
            {
              order = [
                {
                  clinicInfo: {
                    clinic_name: args?.data?.orderDir,
                  },
                },
              ];
            }
            break;
          case 'labName':
            {
              order = [{ labName: args?.data?.orderDir }];
            }
            break;
          case 'date':
            {
              order = [{ resultDate: args?.data?.orderDir }];
            }
            break;
          case 'type':
            {
              order = [{ type: args?.data?.orderDir }];
            }
            break;
          default:
            order = {};
        }

        const orderConditions = {
          orderBy: order,
        };

        // ORDER BY

        const whereconditions = filters(args);
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`emr_labreport`',
          'emr_labreport_patient_data'
        );

        try {
          const record: any = await client.emr_patient.findFirst({
            where: {
              id: Number(args?.data!.uuid),
            },
          });

          // console.log(record,"recordrecordrecord")

          if (Number(record?.link) === 1) {
            const [emr_labreport, _count, count]: any = await client.$transaction([
              ////////////////////////////////////////////////
              client.labreport.findMany({
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
                include: {
                  labreport_attachments: true,
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
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        include: {
                          userInfo: true,
                          labreport: {
                            include: {
                              labreport_attachments: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                ...orderConditions,
                orderBy: {
                  id: 'desc',
                },
              }),
              client.labreport.groupBy({
                by: ['id'],
                orderBy: {
                  id: 'desc',
                },
                where: {
                  AND: [{ isDeleted: 0 }],
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
              client.labreport.aggregate({
                where: {
                  AND: [{ isDeleted: 0 }],
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
            ////////////////////////////////////////////////

            ////////////////////////////////////////////////
            const _result: any = emr_labreport;
            const _total: any = count;
          
            // OVERALL RESPONSE
            const response: any = {
              e_labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              // summary_total: total_summary
            };
            return response;
            // OVERALL RESPONSE
            ////////////////////////////////////////////////
          }
          // patient user
          else if (userType === 'patient') {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const [labreport, _count, count]: any = await client.$transaction([
              /// /////////////////////////////////////////////
              client.labreport.findMany({
                take,
                skip,
                where: {
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
                  isDeleted: 0,
                },
                include: {
                  labreport_attachments: true,
                  doctorInfo: true,
                  patientInfo: true,
                  clinicInfo: {
                    include:{
                      clinicDPInfo:{
                        orderBy:{
                          id:'desc'
                        }
                      }
                    }
                  },
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        include: {
                          userInfo: true,
                          labreport: {
                            include: {
                              labreport_attachments: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },

                ...orderConditions,
              }),
              client.labreport.groupBy({
                by: ['id'],
                orderBy: {
                  id: 'desc',
                },
                where: {
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
                  AND: [{ isDeleted: 0 }],
                },
                _count: {
                  id: true,
                },
              }),
              client.labreport.aggregate({
                where: {
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
                  AND: [{ isDeleted: 0 }],
                },
                _count: {
                  id: true,
                },
              }),
            ]);

            const _result: any = labreport;
            const _total: any = count;

            const response: any = {
              labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              // summary_total: total_summary
            };
            return response;
          } else {
            const [emr_labreport, _count, count]: any = await client.$transaction([
              ////////////////////////////////////////////////
              client.labreport.findMany({
                take,
                skip,
                where: {
                  ...whereconditions,
                  isDeleted: 0,
                  emrPatientID: Number(record?.id),
                },
                include: {
                  labreport_attachments: true,
                  doctorInfo: true,
                  patientInfo: true,
                  clinicInfo: {
                    include:{
                      clinicDPInfo:{
                        orderBy:{
                          id:'desc'
                        }
                      }
                    }
                  },
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        include: {
                          userInfo: true,
                          labreport: {
                            include: {
                              labreport_attachments: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                ...orderConditions,
              }),
              client.labreport.groupBy({
                by: ['id'],
                orderBy: {
                  id: 'desc',
                },
                where: {
                  emrPatientInfo: {
                    id: Number(args?.data!.uuid),
                  },
                  AND: [{ isDeleted: 0 }, { ...whereconditions }],
                },
                _count: {
                  id: true,
                },
              }),
              client.labreport.aggregate({
                where: {
                  emrPatientInfo: {
                    id: Number(args?.data!.uuid),
                  },
                  AND: [{ isDeleted: 0 }, { ...whereconditions }],
                },
                _count: {
                  id: true,
                },
              }),
            ]);
            ////////////////////////////////////////////////

            ////////////////////////////////////////////////
            const _result: any = emr_labreport;
            const _total: any = count;
            ////////////////////////////////////////////////
            // OVERALL RESPONSE
            const response: any = {
              e_labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              // summary_total: total_summary
            };
            return response;
            // OVERALL RESPONSE
            ////////////////////////////////////////////////
          }
        } catch {}
      },
    });
  },
});
///////////////////////////////////////////////////////

export const emr_create_labreport = objectType({
  name: 'emr_create_labreport',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.date('dateCreated');
    t.nullable.string('type');
    t.nullable.string('labName');
    t.nullable.string('resultDate');
    t.nullable.string('remarks');
    t.nullable.int('isDeleted');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const emr_create_labreport_attachments = objectType({
  name: 'emr_create_labreport_attachments',
  definition(t) {
    t.nullable.int('id');
    t.nullable.bigInt('patient');
    t.nullable.int('doctor');
    t.nullable.int('clinic');
    t.nullable.int('labreport_id');
    t.nullable.string('file_name');
    t.nullable.string('file_url');
    t.nullable.string('file_size');
    t.nullable.string('file_type');
    t.nullable.dateTime('date');
    t.nullable.int('isDeleted');
  },
});
///////////////////////////////////////////////////////

export const emr_lab_report_request = inputObjectType({
  name: 'emr_lab_report_request',
  definition(t) {
    t.int('emrPatientID');
    t.int('doctorID');
    t.int('isEMR');
    t.string('patient');
    t.string('doctor');
    t.int('clinic');
    t.string('type');
    t.string('resultDate');
    t.string('labName');
    t.string('remarks');
  },
});

export const emr_lab_report_transactions = objectType({
  name: 'emr_lab_report_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.list.field('emr_lab_report_data', {
      type: emr_create_labreport,
    });
  },
});

export const emr_mutation_lab_report = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('emr_mutation_lab_report', {
      type: emr_lab_report_transactions,
      args: {
        data: emr_lab_report_request!,
        file: 'Upload',
      },
      async resolve(_, args, ctx) {
        const {
          emrPatientID,
          doctorID,
          isEMR,
          patient,
          doctor,
          clinic,
          type,
          resultDate,
          labName,
          remarks,
        }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`emr_mutation_lab_report`',
          'emr_lab_report_request'
        );

        let res: any;

        if (session?.user?.role === 'secretary') {
          if (session?.user?.permissions?.lab_result === 1) {
            try {
              res = await client.labreport.create({
                data: {
                  emrPatientID,
                  doctorID,
                  isEMR,
                  patient,
                  doctor,
                  clinic,
                  type,
                  resultDate,
                  labName,
                  remarks,
                },
              });
    
              const labReportID = res.id;
    
              const sFile = await args?.file;
              // console.log(sFile);
              if (sFile) {
                const uploadResult = await useUpload(sFile, 'public/documents/');
                uploadResult.map(async (v: any) => {
                  await client.labreport_attachments.create({
                    data: {
                      emrPatientID,
                      doctorID,
                      isEMR,
                      patient,
                      doctor,
                      clinic,
                      labreport_id: labReportID,
                      file_name: String(v.fileName),
                      file_url: String(v.path),
                      file_size: String(v.fileSize),
                      file_type: String(v.fileType),
                    },
                  });
                });
              }
    
              res = {
                status: 'Success',
                message: 'Create Lab Report Successfully',
                lab_report_data: res,
              };
            } catch (error) {
              throw new GraphQLError(error);
            }
          } else {
            res = {
              status: 'Failed',
              message: 'You are not authorize for this action',
              lab_report_data: res,
            };
          }
        }else{
          try {
            res = await client.labreport.create({
              data: {
                emrPatientID,
                doctorID,
                isEMR,
                patient,
                doctor,
                clinic,
                type,
                resultDate,
                labName,
                remarks,
              },
            });
  
            const labReportID = res.id;
  
            const sFile = await args?.file;
            // console.log(sFile);
            if (sFile) {
              const uploadResult = await useUpload(sFile, 'public/documents/');
              uploadResult.map(async (v: any) => {
                await client.labreport_attachments.create({
                  data: {
                    emrPatientID,
                    doctorID,
                    isEMR,
                    patient,
                    doctor,
                    clinic,
                    labreport_id: labReportID,
                    file_name: String(v.fileName),
                    file_url: String(v.path),
                    file_size: String(v.fileSize),
                    file_type: String(v.fileType),
                  },
                });
              });
            }
  
            res = {
              status: 'Success',
              message: 'Create Lab Report Successfully',
              lab_report_data: res,
            };
          } catch (error) {
            throw new GraphQLError(error);
          }
        }


        
        return res;
      },
    });
  },
});

// export const e_emr_data = objectType({
//   name: 'e_emr_data',
//   definition(t) {
//     t.bigInt('id');
//     t.bigInt('idno');
//     t.string('fname');
//     t.string('mname');
//     t.string('lname');
//     t.string('gender');
//     t.string('contact_no');
//     t.string('email');
//     t.int('patientID');
//     t.int('link');

//     t.string('fullname');
//     // t.int('patient');
//     t.nullable.field('patientRelation', {
//       type: PatientInfoObject1_aa,
//     });
//   },
// });

// const PatientInfoObject1_aa = objectType({
//   name: 'PatientInfoObject1_aa',
//   definition(t) {
//     t.id('S_ID');
//     t.int('IDNO');
//     t.string('CONTACT_NO');
//     t.string('EMAIL');
//     t.nullable.string('FNAME');
//     t.nullable.string('MNAME');
//     t.nullable.string('LNAME');
//     t.nullable.string('SUFFIX');
//     t.nullable.list.field('labreport', {
//       type: e_m_r_labreport_aa,
//     });
//   },
// });

// /////////////////////////////////////////////////////////
// export const e_m_r_labreport_aa = objectType({
//   name: 'e_m_r_labreport_aa',
//   definition(t) {
//       t.nullable.int('id');
//       t.nullable.int('isEMR');
//       t.nullable.string('patient');
//       t.nullable.string('doctor');
//       t.nullable.int('clinic');
//       t.nullable.date('dateCreated');
//       t.nullable.string('type');
//       t.nullable.string('labName');
//       t.nullable.date('resultDate');
//       t.nullable.string('remarks');
//       t.nullable.int('isDeleted');
//       t.list.field('labreport_attachments', {
//           type: e_m_r_labreport_attachments_aa,
//       });
//   }
// });
// ///////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////
// export const e_m_r_labreport_attachments_aa = objectType({
//   name: 'e_m_r_labreport_attachments_aa',
//   definition(t) {
//       t.nullable.int('id');
//       t.nullable.bigInt('patient');
//       t.nullable.int('doctor');
//       t.nullable.int('clinic');
//       t.nullable.int('labreport_id');
//       t.nullable.string('file_name');
//       t.nullable.string('file_url');
//       t.nullable.string('file_size');
//       t.nullable.string('file_type');
//       t.nullable.dateTime('date');
//       t.nullable.int('isDeleted');
//   }
// });
// ///////////////////////////////////////////////////////

// const emr_patient_lab_attachments_requests = inputObjectType({
//   name: 'emr_patient_lab_attachments_requests',
//   definition(t) {
//     t.nullable.int('id');
//     t.nullable.int('take');
//     t.nullable.int('skip');
//     t.nullable.string('orderBy');
//     t.nullable.string('orderDir');
//     t.nullable.string('searchKeyword');
//     t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
//     t.nullable.date('startDate');
//     t.nullable.date('endDate');
//   },
// });

// /////////////////////////////////////
//   //FILTERS
//   const filters2 = (args: any) => {
//     let whereConSearch: any = {};
//     let multicondition: any = {};
//     let whereDate: any = {};
//     let whereConClinic: any = {};

//     if (args?.data?.searchKeyword) {
//       whereConSearch = {
//         OR: [
//             {
//               labName: { // labName = coloumn name
//                   contains: args?.data?.searchKeyword,
//               },
//               },
//               {
//               resultDate: { // date_appt = coloumn name
//                   contains: args?.data?.searchKeyword,
//               },
//             },
//             {
//               clinicInfo:
//               {
//                   OR: [
//                           {
//                               clinic_name: {
//                               contains: args?.data!.searchKeyword,
//                           },
//                           },
//                       ],
//               },
//             },
//             {
//               doctorInfo:
//               {
//                 OR: [
//                   {
//                     EMP_FULLNAME: {
//                       contains: args?.data?.searchKeyword,
//                     },
//                   },
//                   {
//                     EMP_FNAME: {
//                       contains: args?.data?.searchKeyword,
//                     },
//                   },
//                   {
//                     EMP_MNAME: {
//                       contains: args?.data?.searchKeyword,
//                     },
//                   },
//                   {
//                       EMP_LNAME: {
//                           contains: args?.data?.searchKeyword,
//                       },
//                   },
//                 ],
//               },
//           },

//         ],
//       };
//     }
//     if (args?.data?.startDate && args?.data?.endDate)
//     {
//       whereDate = {
//         dateCreated: {
//               gte: args?.data?.startDate,
//               lte: args?.data?.endDate
//           }
//       }
//     }

//     const clinicIDs: any = args?.data?.clinicIds;
//     if (clinicIDs?.length) {
//         whereConClinic = {
//           clinicInfo: {
//             id: {
//                 in: clinicIDs,
//             },
//         },
//         };
//     }

//     multicondition = {
//       ...multicondition,
//       ...{
//         ...whereConSearch,
//         ...whereDate,
//         ...whereConClinic,

//       },
//     };
//     return multicondition;
//   };
//   //FILTERS
//   /////////////////////////////////////

//   /////////////////////////////////////////////////////
//   export const emr_labreport = objectType({
//     name: "emr_labreport",
//     definition(t) {
//         t.nullable.field('e_labreport_patient', {
//             type: e_emr_data,
//         });
//         t.int('total_records');
//         // t.field('summary_total', {
//         //     type: Summary_Total_Arrays,
//         // });
//     },
// });
// ///////////////////////////////////////////////////

// export const emr_labreport_patient_data = extendType({
//   type: 'Query',
//   definition(t) {
//     t.nullable.field('emr_labreport_patient_data', {
//       type: emr_labreport,
//       args: { data: emr_patient_lab_attachments_requests! },
//       async resolve(_root, args, ctx) {
//         const { take, skip, orderBy, orderDir,id } : any = args.data;

//         let order: any;
//             switch (args?.data?.orderBy) {
//             case 'doctor':
//                 {
//                     order = [
//                         {
//                           doctorInfo:
//                           {
//                             EMP_FULLNAME: args?.data?.orderDir,
//                           },
//                         },
//                       ];
//                 }
//                 break;
//             case 'clinic':
//                 {
//                     order = [
//                         {
//                           clinicInfo:
//                           {
//                             clinic_name: args?.data?.orderDir,
//                           },
//                         },
//                       ];

//                 }
//                 break;
//             case 'Labname':
//                 {
//                 order = [{ Labname: args?.data?.orderDir }];
//                 }
//                 break;
//             case 'resultDate':
//                 {
//                 order = [{ resultDate: args?.data?.orderDir }];
//                 }
//                 break;
//             default:
//                 order = {};
//             }

//             const orderConditions = {
//                 orderBy: order,
//               };

//             // ORDER BY

//         const whereconditions = filters2(args);
//         const {session} = ctx;
//         await cancelServerQueryRequest(client,session?.user?.id,'`emr_labreport`','emr_labreport_patient_data');

//         try{

//           const record:any = await client.emr_patient.findFirst({
//             where:{
//               id
//             }
//           });

//           // console.log(record,"recordrecord")
//           let result:any;
//           if(Number(record?.link) === 1){
//             result = await client.labreport.findMany({
//                 where:{
//                   doctorID:session?.user?.id,
//                   ...whereconditions,
//                   isDeleted: 0,
//                   NOT:{
//                     doctorInfo: null,
//                   },
//                   OR: [
//                     {
//                       emrPatientID: Number(record?.id),
//                     },
//                     {
//                       patientID: Number(record?.patientID),
//                     },
//                   ],
//                 }
//             })
//           }else{
//             result = await client.labreport.findMany({
//               where:{
//                 doctorID:session?.user?.id,
//                 ...whereconditions,
//                 isDeleted: 0,
//                 NOT:{
//                   doctorInfo: null,
//                 },
//                 emrPatientID: Number(record?.id)
//                 // OR: [
//                 //   {
//                 //     emrPatientID: Number(record?.id),
//                 //   },
//                 //   {
//                 //     patientID: Number(record?.patientID),
//                 //   },
//                 // ],
//               }
//           })
//           }

//           console.log(result,'resultresultresult')
//           if(Number(record?.link) === 1){
//             const [e_emr_data, _count, count]: any = await client.$transaction([
//               ////////////////////////////////////////////////
//               // link

//               client.emr_patient.findFirst({
//                   where: {
//                     id,
//                   },
//                   include: {
//                     patientRelation: {
//                       include:{
//                         labreport:{
//                           take,
//                           skip,
//                           where:{
//                               doctorID:session?.user?.id,
//                               ...whereconditions,
//                               isDeleted: 0,
//                               NOT:{
//                                 doctorInfo: null,
//                               },
//                               OR: [
//                                 {
//                                   emrPatientID: Number(record?.id),
//                                 },
//                                 {
//                                   patientID: Number(record?.patientID),
//                                 },
//                               ],
//                           },
//                           ...orderConditions,
//                           include:{
//                             labreport_attachments:true
//                           }
//                         },
//                       }
//                     },
//                   },

//               }),
//               // client.emr_patient.findMany({
//               //   where: {
//               //     id,
//               //   },
//               //   include: {
//               //     patientRelation: {
//               //       include:{
//               //         labreport:{
//               //           take,
//               //           skip,
//               //           where:{
//               //               doctorID:session?.user?.id,
//               //               ...whereconditions,
//               //               isDeleted: 0,
//               //               NOT:{
//               //                 doctorInfo: null,
//               //               }
//               //           },
//               //           // ...orderConditions,
//               //           include:{
//               //             labreport_attachments:true
//               //           }
//               //         },
//               //       }
//               //     },
//               //   },
//               // }),

//               client.labreport.findMany({
//                 where:{
//                     doctorID:session?.user?.id,
//                     ...whereconditions,
//                     isDeleted: 0,
//                     NOT:{
//                       doctorInfo: null,
//                     },
//                     emrPatientInfo:{
//                       patientRelation:{
//                         emr_patient:{
//                           some :{
//                             doctorID:session?.user?.id,
//                           }
//                         }
//                       }
//                     }
//                 },
//                 include: {
//                   emrPatientInfo:{
//                     include:{
//                       patientRelation:{
//                         include:{
//                           emr_patient:id,
//                         }
//                       }
//                     }
//                   }
//                 },
//               }),
//             ]);
//             ////////////////////////////////////////////////

//             const ApagiCount: any = _count.length || 0;

//             ////////////////////////////////////////////////
//             const _result: any = e_emr_data;
//             // const _total: any = count;
//             // const _total_summary: any = _count;
//             ////////////////////////////////////////////////

//             ////////////////////////////////////////////////
//             // let total = 0;
//             // _total_summary.map((v: any) => (total += v?._count?.id))
//             // const total_summary = {
//             //     total,
//             //     // pending: _total_summary.find((v: any) => v?.claim_status === 1)?._count?.id,
//             //     // approved: _total_summary.find((v: any) => v?.claim_status === 0)?._count?.id,
//             //     // done: _total_summary.find((v: any) => v?.claim_status === 3)?._count?.id,
//             //     // cancelled: _total_summary.find((v: any) => v?.claim_status === 4)?._count?.id,
//             // };
//             ////////////////////////////////////////////////
//             ////////////////////////////////////////////////
//             // OVERALL RESPONSE
//             const response: any = {
//               e_labreport_patient: _result,
//               // e_labreport_patient: result,
//                 total_records: Number(ApagiCount),
//                 // summary_total: total_summary
//             }
//             return response;
//            // OVERALL RESPONSE
//            ////////////////////////////////////////////////

//           }else{
//             const [e_emr_data, _count, count]: any = await client.$transaction([
//               ////////////////////////////////////////////////
//               // link

//               client.emr_patient.findFirst({
//                   where: {
//                     id,
//                   },
//                   include: {
//                     patientRelation: {
//                       include:{
//                         labreport:{
//                           take,
//                           skip,
//                           where:{
//                               doctorID:session?.user?.id,
//                               ...whereconditions,
//                               isDeleted: 0,
//                               NOT:{
//                                 doctorInfo: null,
//                               },
//                               emrPatientID: Number(record?.id),
//                           },
//                           ...orderConditions,
//                           include:{
//                             labreport_attachments:true
//                           }
//                         },
//                       }
//                     },
//                   },

//               }),
//               // client.emr_patient.findMany({
//               //   where: {
//               //     id,
//               //   },
//               //   include: {
//               //     patientRelation: {
//               //       include:{
//               //         labreport:{
//               //           take,
//               //           skip,
//               //           where:{
//               //               doctorID:session?.user?.id,
//               //               ...whereconditions,
//               //               isDeleted: 0,
//               //               NOT:{
//               //                 doctorInfo: null,
//               //               }
//               //           },
//               //           // ...orderConditions,
//               //           include:{
//               //             labreport_attachments:true
//               //           }
//               //         },
//               //       }
//               //     },
//               //   },
//               // }),

//               client.labreport.findMany({
//                 where:{
//                     doctorID:session?.user?.id,
//                     ...whereconditions,
//                     isDeleted: 0,
//                     NOT:{
//                       doctorInfo: null,
//                     },
//                     emrPatientInfo:{
//                       patientRelation:{
//                         emr_patient:{
//                           some :{
//                             doctorID:session?.user?.id,
//                           }
//                         }
//                       }
//                     }
//                 },
//                 include: {
//                   emrPatientInfo:{
//                     include:{
//                       patientRelation:{
//                         include:{
//                           emr_patient:id,
//                         }
//                       }
//                     }
//                   }
//                 },
//               }),
//             ]);
//             ////////////////////////////////////////////////

//             const ApagiCount: any = _count.length || 0;

//             ////////////////////////////////////////////////
//             const _result: any = e_emr_data;
//             // const _total: any = count;
//             // const _total_summary: any = _count;
//             ////////////////////////////////////////////////

//             ////////////////////////////////////////////////
//             // let total = 0;
//             // _total_summary.map((v: any) => (total += v?._count?.id))
//             // const total_summary = {
//             //     total,
//             //     // pending: _total_summary.find((v: any) => v?.claim_status === 1)?._count?.id,
//             //     // approved: _total_summary.find((v: any) => v?.claim_status === 0)?._count?.id,
//             //     // done: _total_summary.find((v: any) => v?.claim_status === 3)?._count?.id,
//             //     // cancelled: _total_summary.find((v: any) => v?.claim_status === 4)?._count?.id,
//             // };
//             ////////////////////////////////////////////////
//             ////////////////////////////////////////////////
//             // OVERALL RESPONSE
//             const response: any = {
//               e_labreport_patient: _result,
//               // e_labreport_patient: result,
//                 total_records: Number(ApagiCount),
//                 // summary_total: total_summary
//             }
//             return response;
//            // OVERALL RESPONSE
//            ////////////////////////////////////////////////

//           }

//         }catch{}

//       }

//     });
//   },
// });
