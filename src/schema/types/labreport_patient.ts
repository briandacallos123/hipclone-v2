/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLError } from 'graphql/error/GraphQLError';
// import { PrismaClient } from '@prisma/client';
import { unserialize } from 'php-serialize';
import { extendType, inputObjectType, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import { Clinics } from './ClinicSched';
import useGoogleStorage from '@/hooks/use-google-storage-uploads2';

//
export const labreport = objectType({
  name: 'labreport',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.date('dateCreated');
    t.nullable.string('type');
    t.nullable.string('labName');
    t.nullable.date('resultDate');
    t.nullable.string('remarks');
    t.nullable.int('isDeleted');
    t.list.field('labreport_attachments', {
      type: labreport_attachments,
    });
    t.nullable.field('doctorInfo', {
      type: doctorInfoObjectType,
      // type: labreport_doctor_details,
    });
    t.nullable.field('clinicInfo', {
      type: clinicInfoObjetType,
    });
    t.nullable.field('patientInfo', {
      type: patientInfoObjectType,
    });
    t.nullable.field('emrPatientInfo', {
      type: patient_emr_patientInfoObjectType,
      // async resolve(root, _arg, _ctx) {
      //   const result: any = await client.emr_patient.findMany({
      //     where: {
      //       patientID: Number(root?.emrPatientID),
      //       isdeleted: 0
      //     },
      //   });

      //   return result;
      // },
    });
  },
});
/// ////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const patient_emr_patientInfoObjectType = objectType({
  name: 'patient_emr_patientInfoObjectType',
  definition(t) {
    t.id('id');
    t.nullable.int('patientID');
    t.field('patientRelation', {
      type: patient_emr_patient_object,
      // async resolve(root, _arg, _ctx) {
      //   const result: any = await client.patient.findMany({
      //     where: {
      //       S_ID: Number(root?.patientID),
      //       isDeleted: 0
      //     },
      //   });

      //   return result;
      // },
    });
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const patient_emr_patient_object = objectType({
  name: 'patient_emr_patient_object',
  definition(t) {
    t.id('IDNO');
    t.nullable.string('FNAME');
    t.nullable.string('LNAME');
    t.nullable.string('MNAME');
    t.nullable.string('SUFFIX');
    t.nullable.int('SEX');
    t.nullable.string('BDAY');
    t.nullable.string('BPLACE');
    t.nullable.int('BLOOD_TYPE');
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
  },
});
///////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
export const labreport_attachments = objectType({
  name: 'labreport_attachments',
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
/// ////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
const doctorInfoObjectType = objectType({
  name: 'doctorInfoObjectType',
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
/// ////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
const clinicInfoObjetType = objectType({
  name: 'clinicInfoObjetType',
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
      type: lab_clinicDPInfos,
    });
  },
});
/// ////////////////////////////////////////////////////

const lab_clinicDPInfos = objectType({
  name: 'lab_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

/// ////////////////////////////////////////////////////
const patientInfoObjectType = objectType({
  name: 'patientInfoObjectType',
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
      type: lab_user_object,
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

/// ////////////////////////////////////////////////////
const lab_user_object = objectType({
  name: 'lab_user_object',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('uuid');
    t.nullable.list.field('display_picture', {
      type: lab_patient_display_picture,
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
/// ////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const lab_patient_display_picture = objectType({
  name: 'lab_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
// REQUEST PAYLOADS
export const patient_lab_attachments_requests = inputObjectType({
  name: 'patient_lab_attachments_requests',
  definition(t) {
    t.nullable.string('uuid');
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
// REQUEST PAYLOADS
/// ////////////////////////////////////////////////////

/// //////////////////////////////////
// FILTERS
const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereDate: any = {};
  let whereConClinic: any = {};

  if (args?.data!.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          labName: {
            // labName = coloumn name
            contains: args?.data!.searchKeyword,
          },
        },
        {
          resultDate: {
            // date_appt = coloumn name
            contains: args?.data!.searchKeyword,
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

  if (args?.data!.startDate && !args?.data!.endDate) {
    whereDate = {
      dateCreated: {
        gte: args?.data!.startDate,
      },
    };
  }
  if (!args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      dateCreated: {
        lte: args?.data!.endDate,
      },
    }
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
// FILTERS
/// //////////////////////////////////

/// /////////////////////////////////
// SUMMARY TOTAL
// const Summary_Total_Arrays = objectType({
//   name: 'Summary_Total_Arrays',
//   definition(summary_total) {
//     summary_total.nullable.int('total');
//   },
// });
// SUMMARY TOTAL
/// /////////////////////////////////

/// //////////////////////////////////////////////////
export const labreport_p = objectType({
  name: 'labreport_p',
  definition(t) {
    t.nullable.list.field('labreport_patient', {
      type: labreport,
    });
    t.int('total_records');
    t.nullable.list.field('clinic', {
      type: Clinics
    });
  },
});
/// ////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
export const labreport_patient_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('labreport_patient_data', {
      type: labreport_p,
      args: { data: patient_lab_attachments_requests! },
      async resolve(_root, args, ctx) {
        const { take, skip, orderBy, orderDir, uuid, userType, startDate, endDate }: any =
          args.data;
        // const result: any = await client.labreport.findMany()
        const currentEndDate = new Date(endDate);

        const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
        const formattedEndDateAsDate = new Date(formattedEndDate);
        // return result
        // ORDER BY

        let order: any;
        switch (orderBy) {
          case 'hospital':
            {
              order = {
                clinicInfo: {
                  clinic_name: orderDir,
                },
              }
            }
            break;
          case 'labName':
            {
              order = { labName: orderDir }
            }
            break;
          case 'date':
            {
              order = { dateCreated: orderDir }
            }
            break;
          case 'resultDate':
            {
              order = { resultDate: orderDir }
            }
            break;
          case 'type':
            {
              order = { type: orderDir }
            }
            break;
          default:
            order = {
              id: 'desc'
            };
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
          '`labreport`',
          'labreport_patient_data'
        );



        try {
          const patientInfo: any = await client.user.findFirst({
            where: {
              uuid: String(args?.data!.uuid),
            },
            include: {
              patientInfo: true,
            },
          });
          const emrPatientId = await client.emr_patient.findFirst({
            where: {
              patientID: Number(patientInfo?.patientInfo?.S_ID),
            },
          });

          if (emrPatientId && Number(emrPatientId?.link) === 1) {
            console.log("dito sa unahan")
            const [labreport, _count, count]: any = await client.$transaction([
              client.labreport.findMany({
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
                      patientID: Number(patientInfo?.patientInfo.S_ID),
                      ...whereconditions,
                    },
                  ],
                },
                include: {
                  labreport_attachments: true,
                  doctorInfo: true,
                  clinicInfo: {
                    include: {
                      clinicDPInfo: {
                        orderBy: {
                          id: 'desc',
                        },
                      },
                    },
                  },
                  patientInfo: {
                    include: {
                      userInfo: true,
                    },
                  },
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        where: {
                          isDeleted: 0,
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
                  AND: [{ isDeleted: 0 }, { ...whereconditions }],
                  OR: [
                    {
                      emrPatientID: Number(emrPatientId?.id),
                      ...whereconditions,
                    },
                    {
                      patientID: Number(patientInfo?.patientInfo.S_ID),
                      ...whereconditions,
                    },
                  ],
                  // ...setCurrentDay,
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
                      emrPatientID: Number(emrPatientId?.id),
                      ...whereconditions,
                    },
                    {
                      patientID: Number(patientInfo?.patientInfo.S_ID),
                      ...whereconditions,
                    },
                  ],
                  // ...setCurrentDay,
                },
                _count: {
                  id: true,
                },
              }),
            ]);
            /// /////////////////////////////////////////////

            /// /////////////////////////////////////////////
            const _result: any = labreport;
            const _total: any = count;
            // const _total_summary: any = _count;
            /// /////////////////////////////////////////////
            // OVERALL RESPONSE
            const response: any = {
              labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              // summary_total: total_summary
            };
            console.log(response, 'RESPONSE SA unahan')


            return response;
            // OVERALL RESPONSE
            /// /////////////////////////////////////////////
          }
          // patient user
          else if (userType === 'patient') {
            console.log("dito sa pangalawan")

            // console.log(session?.user,'USERRRRRRRRRRRRRRRR')
            const idConditions = (() => {
              let condition = [];

              if (session?.user?.emr_patient_id) {
                condition.push({
                  emrPatientID: Number(session?.user?.emr_patient_id),
                })
              }
              if (session?.user?.s_id) {
                condition.push({
                  patientID: Number(session?.user?.s_id),
                })
              }

              return condition
            })()

            // console.log(idConditions,'??????')

            const [labreport, _count, count, clinic]: any = await client.$transaction([
              /// /////////////////////////////////////////////
              client.labreport.findMany({
                take,
                skip,
                where: {
                  OR: idConditions,
                  isDeleted: 0,
                  ...whereconditions,
                },
                include: {
                  labreport_attachments: true,
                  doctorInfo: true,
                  clinicInfo: {
                    include: {
                      clinicDPInfo: {
                        orderBy: {
                          id: 'desc',
                        },
                      },
                    },
                  },
                  patientInfo: {
                    include: {
                      userInfo: true,
                    },
                  },
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        where: {
                          isDeleted: 0,
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
                  OR: idConditions,
                  // NOT: {
                  //   doctorInfo: null,
                  // },
                  // patientID: Number(patientInfo?.patientInfo.S_ID),
                  AND: [{ isDeleted: 0 }],
                  // ...setCurrentDay,
                },
                _count: {
                  id: true,
                },
              }),
              client.labreport.aggregate({
                where: {
                  OR: idConditions,
                  ...whereconditions,
                  // NOT: {
                  //   doctorInfo: null,
                  // },
                  // patientID: Number(patientInfo?.patientInfo.S_ID),
                  AND: [{ isDeleted: 0 }],
                  // ...setCurrentDay,
                },
                _count: {
                  id: true,
                },
              }),

              client.labreport.findMany({
                where: {
                  OR: idConditions,
                  AND: [{ isDeleted: 0 }],
                  NOT: {
                    clinicInfo: {
                      clinic_name: null
                    }
                  }
                },
                include: {
                  clinicInfo: true
                },
                distinct: ['clinic']
              })
            ]);

            console.log(clinic, 'CLINIC SA DULOOOOOOOOOOOOOOOOOOOOOOO___________')



            const _result: any = labreport;
            const _total: any = count;

            const response: any = {
              labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              clinic: clinic?.map((item) => item?.clinicInfo)
            };
            // console.log(response,'RESPONSE SA pangalawa__')

            return response;
          } else {
            console.log("dito sa pangalawan")

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const [labreport, _count, count]: any = await client.$transaction([
              /// /////////////////////////////////////////////
              client.labreport.findMany({
                take,
                skip,
                where: {
                  ...whereconditions,
                  isDeleted: 0,
                  patientID: Number(patientInfo?.patientInfo.S_ID),
                  // ...setCurrentDay,
                },
                include: {
                  labreport_attachments: true,
                  doctorInfo: true,
                  clinicInfo: {
                    include: {
                      clinicDPInfo: {
                        orderBy: {
                          id: 'desc',
                        },
                      },
                    },
                  },
                  patientInfo: {
                    include: {
                      userInfo: true,
                    },
                  },
                  emrPatientInfo: {
                    include: {
                      patientRelation: {
                        where: {
                          isDeleted: 0,
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
                  patientID: Number(patientInfo?.patientInfo.S_ID),
                  AND: [{ isDeleted: 0 }, { ...whereconditions }],
                  // ...setCurrentDay,
                },
                _count: {
                  id: true,
                },
              }),
              client.labreport.aggregate({
                where: {
                  patientID: Number(patientInfo?.patientInfo.S_ID),
                  AND: [{ isDeleted: 0 }, { ...whereconditions }],
                  // ...setCurrentDay,
                },
                _count: {
                  id: true,
                },
              }),
            ]);
            /// /////////////////////////////////////////////

            /// /////////////////////////////////////////////
            const _result: any = labreport;
            const _total: any = count;
            /// /////////////////////////////////////////////
            // OVERALL RESPONSE
            const response: any = {
              labreport_patient: _result,
              total_records: Number(_total?._count?.id),
              // summary_total: total_summary
            };

            console.log(response, 'RESPONSE SA DULO__')
            return response;
            // OVERALL RESPONSE
            /// /////////////////////////////////////////////
          }
        } catch (error) {
          console.log(error, 'MAY ERROR DITO SAN KAYA NAG TRIGGER????')
          return console.log(error);
        }
      },
    });
  },
});
/// ////////////////////////////////////////////////////

export const create_labreport = objectType({
  name: 'create_labreport',
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
/// ////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
export const create_labreport_attachments = objectType({
  name: 'create_labreport_attachments',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('patient');
    t.nullable.string('doctor');
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
/// ////////////////////////////////////////////////////

export const lab_report_request = inputObjectType({
  name: 'lab_report_request',
  definition(t) {
    t.nullable.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.string('type');
    t.nullable.string('resultDate');
    t.nullable.string('labName');
    t.nullable.string('remarks');
  },
});

export const lab_report_transactions = objectType({
  name: 'lab_report_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.list.field('lab_report_data', {
      type: create_labreport,
    });
  },
});

export const mutation_lab_report = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('mutation_lab_report', {
      type: lab_report_transactions,
      args: {
        data: lab_report_request!,
        file: 'Upload',
      },
      async resolve(_, args, ctx) {
        const {
          patientID,
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
          '`mutation_lab_report`',
          'lab_report_request'
        );

        console.log(session, 'session');
        let res: any;

        if (session?.user?.role === 'secretary') {
          const subPermissions: any = await client.sub_account_doctor.findFirst({
            where: {
              secretaryID: session.user?.subAccId,
            },
          });

          if (Number(subPermissions?.lab_result) !== 1) {
            throw new GraphQLError('Unauthorized');
          }

          if (session?.user?.permissions?.lab_result === 1) {
            try {
              if (session.user.role === 'patient') {
                res = await client.labreport.create({
                  data: {
                    patientID,
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


                  const uploadResult: any = await useGoogleStorage(
                    sFile,
                    session?.user?.id,
                    'feeds'
                  );

                  // const uploadResult = await useUpload(sFile, 'public/documents/');
                  uploadResult.map(async (v: any) => {
                    await client.labreport_attachments.create({
                      data: {
                        patientID,
                        doctorID,
                        isEMR,
                        patient,
                        doctor,
                        clinic,
                        labreport_id: labReportID,
                        file_name: String(v.path),
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
                  lab_report_data: [res],
                };
              } else {
                res = await client.labreport.create({
                  data: {
                    patientID,
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
                const labReportPatientID = res?.patient;

                const patient_findfirst = await client.patient.findFirst({
                  where: {
                    S_ID: res?.patientID,
                  },
                });

                const secretary_findfirst = await client.sub_account.findFirst({
                  where: {
                    id: session.user?.subAccId,
                  },
                });

                const currentDate = new Date();
                const formattedDate = currentDate.toISOString();

                const secretary_create = await client.log_action.create({
                  data: {
                    secretaryID: session.user?.subAccId,
                    patientID,
                    idno: Number(secretary_findfirst?.idno) || null,
                    request: `${patient_findfirst?.FNAME} ${patient_findfirst?.LNAME} Lab and Imaging Result - Uploaded`,
                    patient: labReportPatientID,
                    log_type: '4',
                    date: formattedDate,
                    type: 0,
                  },
                });

                const sFile = await args?.file;

                if (sFile) {
                  const uploadResult: any = await useGoogleStorage(
                    sFile,
                    session?.user?.id,
                    'feeds'
                  );

                  // const uploadResult = await useUpload(sFile, 'public/documents/');
                  uploadResult.map(async (v: any) => {
                    await client.labreport_attachments.create({
                      data: {
                        patientID,
                        doctorID,
                        isEMR,
                        patient,
                        doctor,
                        clinic,
                        labreport_id: labReportID,
                        file_name: String(v.path),
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
                  lab_report_data: [res],
                };
              }
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
        } else {
          try {
            if (session.user.role === 'patient') {
              res = await client.labreport.create({
                data: {
                  patientID,
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
                const uploadResult: any = await useGoogleStorage(
                  sFile,
                  session?.user?.id,
                  'feeds'
                );
                // const uploadResult = await useUpload(sFile, 'public/documents/');
                uploadResult.map(async (v: any) => {
                  await client.labreport_attachments.create({
                    data: {
                      patientID,
                      doctorID,
                      isEMR,
                      patient: patientID,
                      doctor,
                      clinic,
                      labreport_id: labReportID,
                      file_name: String(v.path),
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
                lab_report_data: [res],
              };
            } else {
              res = await client.labreport.create({
                data: {
                  patientID,
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
                const uploadResult: any = await useGoogleStorage(
                  sFile,
                  session?.user?.id,
                  'lab report'
                );
                // const uploadResult = await useUpload(sFile, 'public/documents/');
                uploadResult.map(async (v: any) => {
                  await client.labreport_attachments.create({
                    data: {
                      patientID,
                      doctorID,
                      isEMR,
                      patient,
                      doctor,
                      clinic,
                      labreport_id: labReportID,
                      file_name: String(v.path),
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
                lab_report_data: [res],
              };
            }
          } catch (error) {
            console.log(error, 'ERRORRRRRRRRRRRRRRRRR_________ BRIAN')
            throw new GraphQLError(error);
          }
        }

        return res;
      },
    });
  },
});


const queryLabreportType = objectType({
  name: "queryLabreportType",
  definition(t) {
    t.list.field('clinicData', {
      type: Clinics
    })
  },
})

const queryLabreportClinicsInp = inputObjectType({
  name: "queryLabreportClinicsInp",
  definition(t) {
    t.nonNull.string('uuid');
  },
})

export const queryLabreportClinics = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('queryLabreportClinics', {
      type: queryLabreportType,
      args: { data: queryLabreportClinicsInp! },
      async resolve(_root, args, ctx) {

        try {

          const { session } = ctx;

          const user = await client.user.findFirst({
            where: {
              uuid: args?.data?.uuid
            }
          })
          const patient = await client.patient.findFirst({
            where: {
              EMAIL: user?.email
            }
          })



          const clinics = await client.labreport.findMany({
            where: {
              doctorID: Number(session?.user?.id),
              patientID: Number(patient?.S_ID),
              isDeleted: 0
            },
            include:{
              clinicInfo:true,
              doctorInfo:true,
              patientInfo:true
            },
            distinct:['clinic']
          })

          // console.log(clinics,'AWITTTTTTTTTTT')

          return {
            clinicData:clinics?.map((item)=>item?.clinicInfo)
          }

        } catch (error) {
          console.log(error,'ERROR BHEEEEEEEEEE')
          throw new GraphQLError(error)
        }

      }
    })
  }
});