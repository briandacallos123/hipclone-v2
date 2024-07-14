/* eslint-disable no-lone-blocks */
import { GraphQLError } from 'graphql/error/GraphQLError';
import { extendType, objectType, intArg, stringArg, inputObjectType } from 'nexus';
import { subYears, startOfYear, endOfYear } from 'date-fns';
import { unserialize, serialize } from 'php-serialize';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import { resolve } from 'path';
import beamsClient from './beams'

const ClinicObjectFields = objectType({
  name: 'ClinicObjectFields',
  definition(t) {
    t.int('id');
    t.nullable.string('doctor_idno');
    t.nullable.string('clinic_name');
    t.nullable.string('schedule');
    t.nullable.dateTime('s_clinicschedule');
    t.nullable.dateTime('e_clinicschedule');
    t.nullable.string('location');
    t.nullable.string('number');
    t.nullable.string('Province');
    t.nullable.dateTime('date');
    t.nullable.string('time_interval');
    t.nullable.string('uuid');
    t.int('isDeleted');
    t.nullable.list.field('clinicDPInfo', {
      type: ClinicDPObjectFields,
    });
  },
});

const DoctorInfoObjectFields = objectType({
  name: 'DoctorInfoObjectFields',
  definition(t) {
    t.id('EMP_ID');
    t.nullable.string('EMP_FULLNAME');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('CONTACT_NO');
    t.nullable.string('EMP_EMAIL');
    t.nullable.string('EMPID');
    t.nullable.string('FEES');
    t.nullable.string('MEDCERT_FEE'); //  = 1
    t.nullable.string('MEDCLEAR_FEE'); //  = 2
    t.nullable.string('MEDABSTRACT_FEE'); //  = 3
  },
});

const ClinicDPObjectFields = objectType({
  name: 'ClinicDPObjectFields',
  definition(t) {
    t.id('id');
    t.nullable.string('filename');
    t.nullable.string('clinic');
    t.nullable.string('doctor');
    t.nullable.dateTime('date');
    t.nullable.int('doctorID');
  },
});
const PatientInfoObject = objectType({
  name: 'PatientInfoObject',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.nullable.string('FNAME');
    t.nullable.string('MNAME');
    t.nullable.string('LNAME');
    t.nullable.string('SUFFIX');
    t.nullable.string('ACCUPATION');
    t.nullable.string('EMAIL');
    t.nullable.string('SEX');
    t.nullable.string('HOME_ADD');
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
    t.nullable.field('UUID', {
      type: 'String',
      async resolve(parent: any) {
        const data = await client.user.findFirst({
          where: {
            email: parent?.EMAIL,
          },
          select: {
            uuid: true,
          },
        });
        // console.log('DATA: ', data);

        return data?.uuid;
      },
    });
    // t.nullable.field('patientHmoInfo', {
    //   type: appt_patient_hmo_details,
    //   async resolve(root, _arg, _ctx) {
    //     const result: any = await client.patient_hmo.findFirst({
    //       where: {
    //         patientID: Number(root?.S_ID),
    //         isDeleted: 0,
    //       },
    //     });

    //     return result;
    //   },
    // });
    t.nullable.list.field('userInfo', {
      type: userObj4APT,
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
const userObj4APT = objectType({
  name: 'userObj4APT',
  definition(t) {
    t.nullable.int('id');
    t.string('uuid');
    t.nullable.list.field('display_picture', {
      type: appt_patient_display_picture,
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
const appt_patient_display_picture = objectType({
  name: 'appt_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

/////////////////////////////////////////
//PATIENT HMO DETAILS
const appt_patient_hmo_details = objectType({
  name: 'appt_patient_hmo_details',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.string('idno');
    t.nullable.int('hmo');
    t.nullable.string('member_id');
    t.nullable.int('isDeleted');
    t.nullable.field('hmoInfo', {
      type: appt_hmo_details,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.hmo.findFirst({
          where: {
            id: Number(root?.hmo),
          },
        });

        return result;
      },
    });
  },
});
//PATIENT HMO DETAILS
/////////////////////////////////////////

/////////////////////////////////////////
//HMO DETAILS
const appt_hmo_details = objectType({
  name: 'appt_hmo_details',
  definition(t) {
    t.id('id');
    t.nullable.string('name');
  },
});
//HMO DETAILS
/////////////////////////////////////////

const appt_hmo_attachment = objectType({
  name: 'appt_hmo_attachment',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.int('appt_hmo_id');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.string('filename');
    t.nullable.string('file_url');
    t.nullable.string('file_size');
    t.nullable.string('file_type');
    t.nullable.date('date');
    t.nullable.int('isDeleted');
  },
});
const appt_payment_attachment = objectType({
  name: 'appt_payment_attachment',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.int('appt_id');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.string('filename');
    t.nullable.string('file_url');
    t.nullable.string('file_size');
    t.nullable.string('file_type');
    t.nullable.date('date');
    t.nullable.int('isDeleted');
  },
});

export const appt_hmo_claims = objectType({
  name: 'appt_hmo_claims',
  definition(table_column) {
    table_column.nullable.id('id');
    table_column.nullable.int('appt_id');
    table_column.nullable.int('hmo');
    table_column.nullable.int('claim_status');
    table_column.nullable.int('member_name');
    table_column.nullable.string('member_id');
    table_column.nullable.int('doctor');
    table_column.nullable.int('doctorID');
    table_column.nullable.date('date_appt');
    table_column.nullable.string('time_appt');
    table_column.nullable.string('diagnosis_code');
    table_column.nullable.string('diagnosis');
    table_column.nullable.string('dispo_code');
    table_column.nullable.string('disposition');
    table_column.nullable.string('ver_code');
    table_column.nullable.string('treatment');
    table_column.nullable.string('approval_no');
    table_column.nullable.string('c_email');
    table_column.nullable.string('c_contact');
    table_column.nullable.string('c_clinic');
    table_column.nullable.string('c_caddress');
    table_column.nullable.string('payment_type');
    table_column.nullable.string('dateCreated');
    table_column.nullable.int('export_stat');
    table_column.nullable.int('isDeleted');
  },
});

export const DoctorAppointments = objectType({
  name: 'DoctorAppointments',
  definition(t) {
    t.id('id');
    t.nullable.string('remarks');
    t.nullable.string('patient_no'); // patient id ref from patient table field IDNO
    t.nullable.dateTime('add_date');
    t.nullable.string('patientID');
    t.nullable.string('doctorID');
    t.nullable.string('voucherId');
    t.nullable.field('patientInfo', {
      type: PatientInfoObject,
    });

    t.nullable.int('userId'),
      t.nullable.field('patient_hmo', {
        type: appt_patient_hmo_details,
        async resolve(root, _arg, _ctx) {
          const result: any = await client.patient_hmo.findFirst({
            where: {
              patientID: Number(root?.patientID),
              member_id: String(root?.member_id),
              isDeleted: 0,
            },
          });

          return result;
        },
      });
    t.nullable.string('doctor_no');
    t.nullable.field('doctorInfo', {
      type: DoctorInfoObjectFields,
    }); // doctor id ref from employee table field EMPID
    t.nullable.string('clinic');
    t.nullable.list.field('appt_hmo_attachment', {
      type: appt_hmo_attachment,
    });
    t.nullable.list.field('appt_payment_attachment', {
      type: appt_payment_attachment,
    });
    t.nullable.field('hmo_claims', {
      type: appt_hmo_claims,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.hmo_claims.findFirst({
          where: {
            appt_id: Number(root?.id),
            member_id: String(root?.member_id),
            isDeleted: 0,
          },
        });

        return result;
      },
    });
    t.nullable.string('hmo');
    t.nullable.string('member_id');
    t.nullable.int('type');
    t.nullable.date('date');
    t.nullable.int('isToday');
    t.nullable.time('time_slot');
    t.nullable.time('e_time');
    t.nullable.int('status');
    t.nullable.int('payment_status');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields,
    });
    t.nullable.list.field('doctorPayment', {
      type: doctorPayment,
      async resolve(root, _arg, _ctx) {
        const doctorId = root?.doctorInfo?.EMP_ID;

        const payment = await client.doctor_payment_dp.findMany({
          where: {
            doctorID: Number(doctorId),
          },
        });
        // console.log(payment, 'payment lang');
        // console.log(doctorId, 'doctorId');

        return payment;
      },
    });
    t.nullable.list.field('symptoms', {
      type: 'String',
      async resolve(parent: any, _args, _ctx) {
        const symptoms: any = parent?.symptoms;
        let data: any = [];
        data = unserialize(symptoms);
        return data ? data.map((v: any) => String(v)) : [];
      },
    });
    t.nullable.string('Others');
    t.list.field('AddRequest', {
      type: 'String',
      resolve(parent: any) {
        const AddRequest: any = parent?.AddRequest;
        let res: any = [];
        if (!!AddRequest) {
          res = unserialize(AddRequest);
        }
        return res ? res.map((v: any) => String(v)) : [];
      },
    });
  },
});

export const UserInfoOb = objectType({
  name: 'UserInfoOb',
  definition(t) {
    t.int('id');
  },
})

export const DoctorTransactionObject = objectType({
  name: 'DoctorTransactionObject',
  definition(t) {
    t.nullable.list.field('appointments_data', {
      type: DoctorAppointments,
    });
    t.nullable.int('total_records');
    t.nullable.field('summary', {
      type: SummaryObject,
    });
  },
});
const doctorPayment = objectType({
  name: 'doctorPayment',
  definition(t) {
    t.string('filename');
    t.int('dp_id');
    t.date('date');
    t.nullable.field('dpDetails', {
      type: dpDetails,
      async resolve(t) {
        const dpId = Number(t?.dp_id);

        const data = await client.doctor_payment.findFirst({
          where: {
            id: dpId,
          },
        });
        return data;
      },
    });
  },
});
const dpDetails = objectType({
  name: 'dpDetails',
  definition(t) {
    t.string('acct');
    t.string('title');
    t.string('description');
  },
});
const PatientInfoObjectType = inputObjectType({
  name: 'PatientInfoObjectType',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.nullable.string('FNAME');
    t.nullable.string('MNAME');
    t.nullable.string('LNAME');
    t.nullable.string('SUFFIX');
    t.nullable.string('EMAIL');
  },
});
const ClinicDPObjectFieldInputs = inputObjectType({
  name: 'ClinicDPObjectFieldInputs',
  definition(t) {
    t.id('id');
    t.nullable.string('filename');
    t.nullable.string('clinic');
    t.nullable.string('doctor');
    t.nullable.dateTime('date');
  },
});
const ClinicObjectFieldInputs = inputObjectType({
  name: 'ClinicObjectFieldInputs',
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
    t.nullable.field('clinicDPInfo', {
      type: ClinicDPObjectFieldInputs,
    });
    t.int('isDeleted');
  },
});
export const DoctorTypeInputInterface = inputObjectType({
  name: 'DoctorTypeInputInterface',
  definition(t) {
    t.id('id');
    t.nullable.string('patient_no'); // patient id ref from patient table field IDNO
    t.nullable.field('patientInfo', {
      type: PatientInfoObjectType,
    });
    t.nullable.string('doctor_no'); // doctor id ref from employee table field EMPID
    t.nullable.string('clinic');
    t.nonNull.field('clinicInfo', {
      type: ClinicObjectFieldInputs,
    });
    t.nullable.int('type');
    t.nullable.dateTime('date');
    t.nullable.time('time_slot');
    t.nullable.int('status');
    t.nullable.int('payment_status');
  },
});
export const AllAppointmentInputType = inputObjectType({
  name: 'AllAppointmentInputType',
  definition(t) {
    t.nullable.int('status');
    t.nullable.int('typeStatus');
    t.nonNull.int('take');
    t.nonNull.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.int('isDashboard');
    // t.nullable.string('orderDirAPR');
    t.nullable.string('searchKeyword');
    t.nullable.string('searchKeywordAPR');
    t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
    t.nullable.date('startDate');
    t.nullable.date('endDate');
    t.nullable.int('uuid');
    t.nullable.string('userType');
  },
});

const filters = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let whereConClinic: any = {};
  let whereDate: any = {};
  let multicondition: any = {};
  if (args?.data!.searchKeyword) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          clinicInfo: {
            clinic_name: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          patientInfo: {
            OR: [
              {
                FNAME: {
                  contains: args?.data!.searchKeyword,
                },
              },
              {
                LNAME: {
                  contains: args?.data!.searchKeyword,
                },
              },
              {
                FULLNAME: {
                  contains: args?.data!.searchKeyword,
                },
              },
            ],
          },
        },
      ],
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

  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      date: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereConClinic,
      ...whereDate,
    },
  };
  return multicondition;
};
const SummaryObject = objectType({
  name: 'SummaryObject',
  definition(t) {
    t.nullable.int('total');
    t.nullable.int('pending');
    t.nullable.int('approved');
    t.nullable.int('done');
    t.nullable.int('cancelled');
    t.nullable.int('telemedicine');
    t.nullable.int('faceToFace');
  },
});
export const QueryAllAppointments = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allAppointments', {
      type: DoctorTransactionObject,
      args: { data: AllAppointmentInputType! },
      async resolve(_root, args, ctx) {
        let orderConditions: any;
        const currentDate = new Date(args?.data!.startDate);
        const currentEndDate = new Date(args?.data!.endDate);

        const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
        const formattedEndDateAsDate = new Date(formattedEndDate);

        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        // name filter
        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            {
              order = [
                {
                  patientInfo: {
                    FNAME: args?.data!.orderDir,
                  },
                },
                {
                  patientInfo: {
                    LNAME: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'hospital':
            {
              order = [
                {
                  clinicInfo: {
                    clinic_name: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'scheduleDate':
            {
              order = [
                {
                  date: args?.data!.orderDir,
                },
                {
                  time_slot: args?.data!.orderDir,
                },
              ];
            }
            break;
          case 'type':
            {
              order = [
                {
                  type: args?.data!.orderDir,
                },
              ];
            }
            break;
          default: {
            order = [
              {
                id: 'desc',
              },
            ];
          }
        }

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);
        const status = (() => {
          if (args?.data!.status === -1) return {};

          return {
            status: Number(args?.data!.status),
          };
        })();

        const typeStatus = (() => {
          if (args?.data!.typeStatus === -1) return {};

          return {
            type: Number(args?.data!.typeStatus),
          };
        })();

        const setCurrentDay = (() => {
          if (args?.data!.isDashboard === 0) return {};
          if (!args?.data!.startDate && args?.data!.endDate)
            return {
              date: {
                lte: formattedEndDateAsDate,
              },
            };
          return {
            date: {
              gte: formattedDateAsDate, // schedule date nalang
            },
          };
        })();

        // console.log('dito nga');

        // const setLessDates = (() => {
        //   if (args?.data!.startDate && args?.data!.endDate) return {};
        // if (!args?.data!.startDate && args?.data!.endDate)
        //   return {
        //     add_date: {
        //       lte: formattedEndDateAsDate,
        //     },
        //   };
        //   return {
        //     add_date: {
        //       gte: formattedDateAsDate,
        //     },
        //   };
        // })();

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'allAppointments'
        );
        const checkUser = (() => {
          if (args?.data!.userType === 'patient')
            return {
              patientID: session?.user?.s_id,
            };
          if (args?.data!.userType === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();
        try {
          const [
            appointments,
            _count,
            count,
            count_all,
            count_pending,
            count_approved,
            count_cancelled,
            count_done,
          ]: any = await client.$transaction([
            client.appointments.findMany({
              skip,
              take,
              where: {
                // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...status,
                ...typeStatus,
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...setCurrentDay,

                ...whereconditions,
              },
              include: {
                patientInfo: {
                  include: {
                    userInfo: true,
                    patientHmoInfo: {
                      include: {
                        hmoInfo: true,
                      },
                    },
                  },
                },
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
                doctorInfo: true,
                appt_hmo_attachment: true,
                appt_payment_attachment: true,
                hmo_claims: true,
              },
              ...orderConditions,
              // orderBy:{
              //   id: 'desc',
              // }
            }),
            client.appointments.groupBy({
              by: ['status'],
              orderBy: {
                status: 'asc',
              },
              where: {
                // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                ...checkUser,
                // doctorID: session?.user?.id,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...status,
                ...typeStatus,
                ...whereconditions,
                ...setCurrentDay,
              },
              _count: {
                id: true,
              },
            }),
            client.appointments.aggregate({
              where: {
                // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                ...checkUser,
                // doctorID: session?.user?.id,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...typeStatus,
                ...status,
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...whereconditions,
                ...setCurrentDay,
              },
              _count: {
                id: true,
              },
            }),
            //
            client.appointments.count({
              where: {
                // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                ...checkUser,
                // doctorID: session?.user?.id,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...whereconditions,
              },
            }),
            //
            //// PENDING
            whereconditions
              ? client.appointments.count({
                where: {
                  status: 0,
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                // Use Prisma Client promise here
                where: {
                  status: 0,
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  ...whereconditions,
                },
              }),
            //// PENDING
            //// APPROVED
            whereconditions
              ? client.appointments.count({
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 1,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                // Use Prisma Client promise here
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 1,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              }),
            //// APPROVED
            //// CANCELLED
            whereconditions
              ? client.appointments.count({
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 2,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                // Use Prisma Client promise here
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 2,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              }),
            //// CANCELLED
            //// DONE
            whereconditions
              ? client.appointments.count({
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 3,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              })
              : client.appointments.count({
                // Use Prisma Client promise here
                where: {
                  ...checkUser,
                  // doctorID: session?.user?.id,
                  status: 3,
                  NOT: [{ time_slot: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  // OR: [{ doctorID: session?.user?.id }, { patientID: session?.user?.id }],
                  ...whereconditions,
                },
              }),
            //// DONE
          ]);

          // const data = {
          //   // sub_account_doctor,
          //   count_all,
          //   count_pending,
          //   count_approved,
          //   count_cancelled,
          //   count_done,
          // }


          let _result: any = appointments;

          _result = _result?.map((item: any) => {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
            const formattedDateAsDate = new Date(formattedDate);

            const currentDateBackward = new Date();

            currentDateBackward.setHours(23, 59, 59, 59);

            if (item?.date >= formattedDateAsDate && item?.date <= currentDateBackward) {
              return { ...item, isToday: 1 }
            }

            return item;
          })

          // console.log(_result, '_result_result_result_result_result_result_result_result_result_result_result@@');

          const _total: any = count;
          const _totalSum: any = _count;
          let total = 0;
          _totalSum.map((v: any) => (total += v?._count?.id));
          const totalSum = {
            total: count_all,
            pending: count_pending,
            approved: count_approved,
            cancelled: count_cancelled,
            done: count_done,
          };

          const response: any = {
            appointments_data: _result,
            total_records: Number(_total?._count?.id),
            summary: totalSum,
          };

          return response;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

/////////////////////////////////////
//REQUEST PAYLOADS
export const doctor_appointments_by_id_request = inputObjectType({
  name: 'doctor_appointments_by_id_request',
  definition(request) {
    request.nullable.int('id');
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////

///////////////////////////////////////
export const doctor_appointments_transactions_by_id = objectType({
  name: 'doctor_appointments_transactions_by_id',
  definition(t) {
    t.nullable.field('doctor_appointments_by_id', {
      type: DoctorAppointments,
    });
  },
});
///////////////////////////////////////

////////////////////////////////////
////////////////////////////////////
export const doctor_appointments_by_id_data = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('doctor_appointments_by_id_data', {
      type: doctor_appointments_transactions_by_id,
      args: { data: doctor_appointments_by_id_request! },
      async resolve(_root, args, ctx) {
        const { id }: any = args.data;

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`doctor_appointments_by_id_data`',
          'doctor_appointments_transactions_by_id'
        );
        let res: any = {};
        try {
          const appointments = await client.appointments.findFirst({
            where: {
              id: id || undefined,
            },
            include: {
              patientInfo: true,
              // {
              //   include: {
              //     patientHmoInfo: {
              //       include: {
              //         hmoInfo: true,
              //       },
              //     },
              //   },
              // },
              clinicInfo: {
                include: {
                  clinicDPInfo: {
                    orderBy: {
                      id: 'desc',
                    },
                  },
                },
              },
              doctorInfo: true,
              appt_hmo_attachment: true,
              appt_payment_attachment: true,
              hmo_claims: true,
            },
          });

          const userInfo = await client.user.findFirst({
            where: {
              email: appointments?.patientInfo?.EMAIL
            }
          })

          // return hmo_claim;
          const result = { ...appointments, userId: Number(userInfo?.id) }

          res = { doctor_appointments_by_id: result };
        } catch (error) {
          console.error(error);
          res = {};
        }
        return res;
      },
    });
  },
});
////////////////////////////////////
////////////////////////////////////

const ApptObjectclinicInfo = objectType({
  name: 'ApptObjectclinicInfo',
  definition(t) {
    t.nullable.id('id');
    t.nullable.string('clinic_name');
    t.nullable.string('location');
    t.nullable.string('Province');
    t.nullable.string('uuid');
    t.nullable.list.field('clinicDPInfo', {
      type: Approved_ClinicDPObjectFields,
      async resolve(p) {
        const result: any = await client.clinicdp.findMany({
          where: {
            clinic: Number(p?.id),
          },
        });
        return result;
      },
    });
  },
});

const Approved_ClinicDPObjectFields = objectType({
  name: 'Approved_ClinicDPObjectFields',
  definition(t) {
    t.id('id');
    t.nullable.string('filename');
    t.nullable.string('clinic');
    t.nullable.string('doctor');
    t.nullable.dateTime('date');
    t.nullable.int('doctorID');
  },
});
const AppointmentClinicObject = objectType({
  name: 'AppointmentClinicObject',
  definition(t) {
    t.string('clinic_id');
    t.field('clinicInfo', {
      type: ApptObjectclinicInfo,
      async resolve(p) {
        const result: any = await client.clinic.findFirst({
          where: {
            id: Number(p?.clinic_id),
          },
        });
        // console.log(result,'RESULT@@@@@@@@')
        return result;
      },
    });
    t.int('approved_count');
  },
});
const AppointmentApprovedObject = objectType({
  name: 'AppointmentApprovedObject',
  definition(t) {
    t.nullable.list.field('appointData', {
      type: AppointmentClinicObject,
    });
    t.nullable.int('totalAPR');
  },
});
export const QueryTodaysAPRRenew = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('todaysAPRNew', {
      type: AppointmentApprovedObject,
      args: { data: AllAppointmentInputType! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;
        const { take, skip }: typeof data = data;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const currentDateBackward = new Date();

        currentDateBackward.setHours(23, 59, 59, 59);

        // ---------------------------------]
        const whereconditions = filtersAPR(args);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments---TODO`',
          'todaysAPRNew'
        );

        const checkUser = (() => {
          if (args?.data!.userType === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        try {
          const [count, _count]: any = await client.$transaction([
            client.appointments.groupBy({
              orderBy: {
                _count: {
                  clinic: 'desc',
                },
              },
              skip,
              take,
              by: ['clinic'],
              _count: {
                clinic: true,
              },
              where: {
                status: 1,
                ...whereconditions,
                isDeleted: 0,
                ...checkUser,
                // add_date:formattedDate,
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                clinicInfo: {
                  isDeleted: 0,
                },
              },
            }),

            client.appointments.groupBy({
              orderBy: {
                _count: {
                  clinic: 'desc',
                },
              },

              by: ['clinic'],
              _count: {
                clinic: true,
              },
              where: {
                status: 1,

                ...checkUser,
                isDeleted: 0,
                // add_date:new Date(),
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                clinicInfo: {
                  isDeleted: 0,
                },
                ...whereconditions,
              },
            }),
          ]);

          // console.log(data,'DATAAAAAA@@@@@@')
          // // console.log(_count,'COUNT@@@@@@@@@')
          // const apptData = data?.map(async(item:any)=>{
          //   const apt = await prisma?.appointments.findFirst({
          //     where:{
          //       id:Number(item?.id)
          //     }
          //   })
          //   return apt;
          // })
          // const dataCon = await Promise.all(apptData)
          // console.log(dataCon,'HAHAHA')
          // const newData = dataCon?.filter((i:any)=>{
          //   const dataDate = i.date.toISOString().slice(0, 10);
          //   // console.log(dataDate,'DATADATE@@@')
          //   console.log(dataDate)
          //   console.log(formattedDate,'formattedDateAsDate@@')
          //   if(dataDate === formattedDate){
          //     return i;
          //   }
          // })
          // console.log(newData,'final DATA@@@')

          const response: any = {
            appointData: count?.map((v: any) => ({
              clinic_id: Number(v?.clinic),
              approved_count: Number(v?._count?.clinic),
            })),

            totalAPR: _count?.length,
          };

          return response;
        } catch (error) {
          //  console.log(error)
        }
      },
    });
  },
});

const filtersAPR = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let multicondition: any = {};
  if (args?.data!.searchKeywordAPR) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          clinicInfo: {
            clinic_name: {
              contains: args?.data!.searchKeywordAPR,
            },
          },
        },
        {
          clinicInfo: {
            location: {
              contains: args?.data!.searchKeywordAPR,
            },
          },
        },
      ],
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
    },
  };
  return multicondition;
};

export const QueueInputType = inputObjectType({
  name: 'QueueInputType',
  definition(t) {
    t.nonNull.int('take');
    t.nonNull.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.nullable.string('uuid');
    t.nullable.int('status');
    t.nullable.int('type');
    t.nullable.string('userType');
  },
});

export const QueueObj = objectType({
  name: 'QueueObj',
  definition(t) {
    t.nullable.list.field('queue_data', {
      type: DoctorAppointments,
    });
    t.nullable.int('telemed');
    t.nullable.int('face2face');
    t.int('total_records');
  },
});

export const QueueReadCount = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueueReadCount', {
      type: QueueObj,
      args: { data: QueueInputType! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;
        const { uuid }: typeof data = data;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const whereConditions = filtersQueues(args);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`appointments`', 'TodaysDone');

        const [queueAll]: any = await client.$transaction([
          client.appointments.findMany({
            where: {
              doctorID: session?.user?.id,
              NOT: [{ time_slot: null }, { patientInfo: null }],

              status: args?.data!.status,
              clinicInfo: {
                uuid,
                isDeleted: 0,

                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              add_date: {
                gte: formattedDateAsDate,
              },
              ...whereConditions,
            },
            include: {
              patientInfo: true,
              clinicInfo: true,
              doctorInfo: true,
            },
          }),
        ]);
      },
    });
  },
});

export const QueueAll = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueueAll', {
      type: QueueObj,
      args: { data: QueueInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        const data: any | typeof args.data = args.data;
        const { uuid }: typeof data = data;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        // let allAppt = await client.appointments.findMany({});

        // let result = allAppt.map(async(d)=>{
        //   let VoucherCode = Math.random().toString(36).substring(2, 8).toUpperCase()


        //   return await client.appointments.update({
        //     where:{
        //       id:Number(d?.id)
        //     },
        //     data:{
        //       voucherId:VoucherCode
        //     }
        //   })
        // })

        // await Promise.all(result)


        let orderConditions: any;
        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            order = [
              {
                patientInfo: {
                  FNAME: args?.data!.orderDir,
                },
              },
            ];

            break;
          case 'schedule':
            order = [
              {
                time_slot: args?.data!.orderDir,
              },
            ];

            break;
          case 'type':
            order = [
              {
                type: args?.data!.orderDir,
              },
            ];

            break;
          case 'payment':
            order = [
              {
                payment_status: args?.data!.orderDir,
              },
            ];

            break;

          default: {
            order = [
              {
                id: 'desc',
              },
            ];
          }
        }
        orderConditions = {
          orderBy: order,
        };
        const type = (() => {
          if (args?.data!.type === -1) return {};

          return {
            type: Number(args?.data!.type),
          };
        })();
        const whereConditions = filtersQueues(args);
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`appointments`', 'TodaysDone');
        const checkUser = (() => {
          if (args?.data!.userType === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);

        try {
          const [DataDone, telMed, face2F, count]: any = await client.$transaction([
            client.appointments.findMany({
              skip,
              take,
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...type,
                status: args?.data!.status,

                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                ...whereConditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
              ...orderConditions,
            }),

            client.appointments.findMany({
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                status: args?.data!.status,
                type: 1,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                ...whereConditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
              ...orderConditions,
            }),
            client.appointments.findMany({
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],

                status: args?.data!.status,
                type: 2,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                ...whereConditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
              ...orderConditions,
            }),
            client.appointments.findMany({
              where: {
                ...checkUser,
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...type,
                status: args?.data!.status,
                clinicInfo: {
                  uuid,
                  isDeleted: 0,

                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                date: {
                  gte: formattedDateAsDate,
                  lte: currentDateBackward,
                },
                ...whereConditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
              ...orderConditions,
            }),
          ]);

          const _result: any = DataDone;
          const _telMed: any = telMed.length;
          const _face2F: any = face2F.length;
          const _total: any = count.length;
          const response: any = {
            queue_data: _result,
            telemed: Number(_telMed),
            face2face: Number(_face2F),
            total_records: Number(_total),
          };
          return response;
        } catch (e) {
          return new GraphQLError(e);
        }
      },
    });
  },
});

const filtersQueues = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let multicondition: any = {};
  if (args?.data!.searchKeyword) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          patientInfo: {
            FNAME: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          patientInfo: {
            LNAME: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
      ],
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
    },
  };
  return multicondition;
};

export const QueryAllAppointmentsByUuid = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allAppointmentsbyUuid', {
      type: DoctorTransactionObject,
      args: { data: AllAppointmentInputType! },
      async resolve(_root, args, ctx) {
        let orderConditions: any;
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        // name filter
        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            {
              order = [
                {
                  patientInfo: {
                    FNAME: args?.data!.orderDir,
                  },
                },
                {
                  patientInfo: {
                    LNAME: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'hospital':
            {
              order = [
                {
                  clinicInfo: {
                    clinic_name: args?.data!.orderDir,
                  },
                },
              ];
            }
            break;
          case 'scheduleDate':
            {
              order = [
                {
                  date: args?.data!.orderDir,
                },
                {
                  time_slot: args?.data!.orderDir,
                },
              ];
            }
            break;
          case 'type':
            {
              order = [
                {
                  type: args?.data!.orderDir,
                },
              ];
            }
            break;
          default: {
            order = [
              {
                id: 'desc',
              },
            ];
          }
        }

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);
        const status = (() => {
          if (args?.data?.status === -1) return {};
          if (args?.data?.status === 4)
            // type telemed
            return {
              type: 1,
            };
          if (args?.data?.status === 5)
            // type face 2 face
            return {
              type: 2,
            };
          return {
            payment_status: Number(args?.data!.status),
          };
        })();

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'allAppointmentsbyUuid'
        );

        try {
          const [appointments, _count, count, teleCount, faceCount]: any =
            await client.$transaction([
              client.appointments.findMany({
                skip,
                take,
                where: {
                  doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                  ...status,
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  patientInfo: {
                    S_ID: Number(args?.data!.uuid),
                  },

                  ...whereconditions,
                },
                include: {
                  patientInfo: true,
                  // {
                  //   include: {
                  //     patientHmoInfo: {
                  //       include: {
                  //         hmoInfo: true,
                  //       },
                  //     },
                  //     userInfo: true,
                  //   },
                  // },
                  clinicInfo: {
                    include: {
                      clinicDPInfo: {
                        orderBy: {
                          id: 'desc',
                        },
                      },
                    },
                  },
                  doctorInfo: true,
                  appt_hmo_attachment: true,
                  appt_payment_attachment: true,
                  hmo_claims: true,
                },
                ...orderConditions,
              }),
              client.appointments.groupBy({
                by: ['payment_status'],
                orderBy: {
                  payment_status: 'asc',
                },
                where: {
                  doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  ...status,
                  ...whereconditions,
                  patientInfo: {
                    S_ID: Number(args?.data!.uuid),
                  },
                },
                _count: {
                  id: true,
                },
              }),
              client.appointments.aggregate({
                where: {
                  doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],

                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  ...status,
                  ...whereconditions,
                  patientInfo: {
                    S_ID: Number(args?.data!.uuid),
                  },
                },
                _count: {
                  id: true,
                },
              }),
              // for telemed count
              client.appointments.findMany({
                where: {
                  doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                  ...status,
                  type: 1,
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  patientInfo: {
                    S_ID: Number(args?.data!.uuid),
                  },
                  ...status,
                  ...whereconditions,
                },
                include: {
                  patientInfo: true,
                  // {
                  //   include: {
                  //     patientHmoInfo: {
                  //       include: {
                  //         hmoInfo: true,
                  //       },
                  //     },
                  //     userInfo: true,
                  //   },
                  // },
                  clinicInfo: true,
                  doctorInfo: true,
                  appt_hmo_attachment: true,
                  appt_payment_attachment: true,
                  hmo_claims: true,
                },
                ...orderConditions,
              }),
              // for face2face count
              client.appointments.findMany({
                where: {
                  doctorID: session?.user?.id,
                  NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                  ...status,
                  clinicInfo: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: null }, { clinic_name: '' }],
                  },
                  patientInfo: {
                    S_ID: Number(args?.data!.uuid),
                  },
                  type: 2,
                  ...whereconditions,
                },
                include: {
                  patientInfo: true,
                  clinicInfo: {
                    include: {
                      clinicDPInfo: {
                        orderBy: {
                          id: 'desc',
                        },
                      },
                    },
                  },
                  doctorInfo: true,
                  appt_hmo_attachment: true,
                  appt_payment_attachment: true,
                  hmo_claims: true,
                },
                ...orderConditions,
              }),
            ]);
          const _result: any = appointments;
          const _total: any = count;
          const _totalSum: any = _count;
          const _telemedCount: any = teleCount.length;
          const _faceCount: any = faceCount.length;

          let total = 0;
          _totalSum.map((v: any) => (total += v?._count?.id));
          const totalSum = {
            total,
            pending: _totalSum.find((v: any) => v?.payment_status === 0)?._count?.id,
            approved: _totalSum.find((v: any) => v?.payment_status === 1)?._count?.id,
            cancelled: _totalSum.find((v: any) => v?.payment_status === 2)?._count?.id,
            done: _totalSum.find((v: any) => v?.payment_status === 3)?._count?.id,
            telemedicine: _telemedCount,
            faceToFace: _faceCount,
          };

          const response: any = {
            appointments_data: _result,
            total_records: Number(_total?._count?.id),
            summary: totalSum,
          };
          return response;
        } catch (e) {
          console.log('Error');
        }
      },
    });
  },
});

export const calendar_doctor_appointments = objectType({
  name: 'calendar_doctor_appointments',
  definition(t) {
    t.id('id');
    t.nullable.string('patient_no'); // patient id ref from patient table field IDNO
    t.nullable.dateTime('add_date');
    t.nullable.string('doctor_no');
    t.nullable.string('clinic');
    t.nullable.string('hmo');
    t.nullable.string('member_id');
    t.nullable.int('type');
    t.nullable.date('date');
    t.nullable.time('time_slot');
    t.nullable.int('status');
    t.nullable.string('Others');
    t.nullable.int('payment_status');
    t.nullable.field('patientInfo', {
      type: PatientInfoObject,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorInfoObjectFields,
    }); // doctor id ref from employee table field EMPID

    t.nullable.list.field('appt_hmo_attachment', {
      type: appt_hmo_attachment,
    });
    t.nullable.list.field('appt_payment_attachment', {
      type: appt_payment_attachment,
    });
    t.nullable.field('hmo_claims', {
      type: appt_hmo_claims,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.hmo_claims.findFirst({
          where: {
            appt_id: Number(root?.id),
            isDeleted: 0,
          },
        });

        return result;
      },
    });
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields,
    });
    t.nullable.list.field('symptoms', {
      type: 'String',
      async resolve(parent: any, _args, _ctx) {
        const symptoms: any = parent?.symptoms;
        let data: any = [];
        data = unserialize(symptoms);
        return data ? data.map((v: any) => String(v)) : [];
      },
    });
    t.nullable.list.field('AddRequest', {
      type: 'Int',
      resolve(parent: any) {
        const AddRequest: any = parent?.AddRequest;
        let res: any = [];
        if (!!AddRequest) {
          res = unserialize(AddRequest);
        }
        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
  },
});

export const calendar_doctor_appointment_request_input = inputObjectType({
  name: 'calendar_doctor_appointment_request_input',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.date('startDate');
    t.nullable.date('endDate');
    t.nullable.int('currentYear');
    t.nullable.int('status');
  },
});

const calendar_filters = (args: any) => {
  let whereDate: any = {};
  let multicondition: any = {};

  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      date: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereDate,
    },
  };
  return multicondition;
};

export const calendar_doctor_appointment_transaction = objectType({
  name: 'calendar_doctor_appointment_transaction',
  definition(t) {
    t.nullable.list.field('calender_appointments_data', {
      type: calendar_doctor_appointments,
    });
    t.int('total_records');
  },
});

export const query_all_appointment_calendar = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('query_all_appointment_calendar', {
      type: calendar_doctor_appointment_transaction,
      args: { data: calendar_doctor_appointment_request_input! },
      async resolve(_root, args, ctx) {
        const { take, skip, date }: any = args.data;
        const whereconditions = calendar_filters(args);
        // status
        const status = (() => {
          if (args?.data?.status === -1) return {};

          return {
            status: Number(args?.data!.status),
          };
        })();
        // status
        const year = Number(args?.data!.currentYear);
        const yearStartDate = startOfYear(new Date(year, 0, 1));
        const yearEndDate = endOfYear(new Date(year, 11, 31));
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`calendar_doctor_appointments`',
          'calendar_doctor_appointment_request_input'
        );

        try {
          const [calendar_doctor_appointments, _count]: any = await client.$transaction([
            client.appointments.findMany({
              take: 300,
              where: {
                date: {
                  gte: yearStartDate, // Greater than or equal to the start of the year
                  lte: yearEndDate, // Less than or equal to the end of the year
                },
                OR: [
                  { doctorID: session?.user?.permissions?.doctorID },
                  { doctorID: session?.user?.id },
                  { patientID: session?.user?.s_id },
                ],
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...status,

                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...whereconditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
                doctorInfo: true,
                appt_hmo_attachment: true,
                appt_payment_attachment: true,
                hmo_claims: true,
              },
              // ...orderConditions,
            }),
            client.appointments.aggregate({
              take: 300,
              where: {
                date: {
                  gte: yearStartDate, // Greater than or equal to the start of the year
                  lte: yearEndDate, // Less than or equal to the end of the year
                },
                OR: [
                  { doctorID: session?.user?.permissions?.doctorID },
                  { doctorID: session?.user?.id },
                  { patientID: session?.user?.s_id },
                ],
                NOT: [{ time_slot: null }, { patientInfo: null }],
                ...status,
                clinicInfo: {
                  isDeleted: 0,
                  NOT: [{ clinic_name: null }, { clinic_name: '' }],
                },
                ...whereconditions,
              },
              _count: {
                id: true,
              },
            }),
          ]);
          const _result: any = calendar_doctor_appointments;
          const _total: any = _count;

          const response: any = {
            calender_appointments_data: _result,
            total_records: Number(_total?._count?.id),
          };
          return response;
        } catch (e) {
          return new GraphQLError(e);
        }
      },
    });
  },
});

export const BookingObjInputType = inputObjectType({
  name: 'BookingObjInputType',
  definition(t) {
    t.nonNull.int('doctorID');
    t.nonNull.int('clinic');
    t.nullable.int('patientID'); // session id
    t.nonNull.string('date');
    t.nonNull.string('time_slot');
    t.nonNull.int('type');
    t.nonNull.JSON('AddRequest');
    // status pending
    t.nonNull.JSON('symptoms');
    t.nullable.string('comment');
    t.nullable.string('others');
    t.nullable.string('member_id');
    t.nullable.JSON('hmo');
    t.nullable.string('end_time');
  },
});

const convertDate = (inputDateString: any) => {
  // Create a Date object from the input date string
  const date = new Date(inputDateString);

  // Extract the date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  const Formatdate = new Date(formattedDate);

  return Formatdate;
};

const formatDts = (inputDateString: any) => {
  const date = new Date(inputDateString);

  // Extract the date and time components
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  // Create the formatted date string in ISO-8601 format
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

  return formattedDate;
};

export const BookAppointment = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('BookAppointment', {
      type: DoctorAppointments,
      args: { data: BookingObjInputType!, file: 'Upload' },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`employees`', 'BookAppointment');
        try {
          const AddRequestData = serialize(createData.AddRequest);
          const symptomsData = serialize(createData.symptoms);
          const hmoData = serialize(createData.hmo);
          const dateInput = convertDate(createData.date);
          const timeInput = new Date(createData.time_slot);
          timeInput.setMinutes(timeInput.getMinutes() - timeInput.getTimezoneOffset()); // Convert to UTC


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
          // if has file

          const timeInputEnd = new Date(createData.end_time);
          timeInputEnd.setMinutes(timeInputEnd.getMinutes() - timeInputEnd.getTimezoneOffset()); // Convert to UTC

          const BookTransaction = await client.$transaction(async (trx) => {
            const BookPost = await trx.appointments.create({
              data: {
                doctorID: Number(createData.doctorID),
                clinic: Number(createData.clinic),
                patientID: Number(session?.user?.s_id),
                date: dateInput,
                time_slot: timeInput,
                type: Number(createData.type),
                status: Number(0),
                symptoms: symptomsData,
                comment: String(createData.comment), // other complaints
                Others: String(createData.others),
                AddRequest: AddRequestData,
                loa_num: '',
                hmo: hmoData,
                member_id: String(createData.member_id),
                voucherId: VoucherCode,
                e_time: timeInputEnd,
              },
            });

            return {
              ...BookPost,
            };
          });

          const notifContent = await client.notification_content.create({
            data:{
              content:"book an appointment"
            }
          })
       
          await client.notification.create({
            data:{
              user_id:Number(session?.user?.id),
              notifiable_id:Number(createData.doctorID),
              notification_type_id:1,
              notification_content_id:Number(notifContent?.id),
              appt_id:Number(BookTransaction?.id)
            }
          })



          const PatientHMO = await client.patient_hmo.create({
            data: {
              patientID: Number(session?.user?.s_id),
              idno: String(session?.user?.patientIDNO),
              hmo: Number(createData.hmo),
              member_id: String(createData.member_id),
            },
          });

          const sFile = await args?.file;
          if (sFile) {
            // console.log(sFile, 'FILE@@@');
            const res: any = useUpload(sFile, 'public/documents/');
            res?.map(async (v: any) => {
              await client.appt_hmo_attachment.create({
                data: {
                  filename: String(v!.fileName),
                  file_url: String(v!.path),
                  patientID: Number(session?.user?.id),
                  doctorID: Number(createData.doctorID),
                  clinic: Number(createData.clinic),
                  appt_hmo_id: Number(BookTransaction?.id),
                },
              });
            });
          }
          const res: any = { ...BookTransaction, ...PatientHMO };
          return res;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

// export const BookAppointment = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.nullable.field('BookAppointment', {
//       type: DoctorAppointments,
//       args: { data: BookingObjInputType!, file: 'Upload' },
//       async resolve(_parent, args, ctx) {
//         const createData: any = args?.data;
//         const { session } = ctx;



//         let userOffline = await client.user.findFirst({
//           where: {
//             id: Number(args?.data?.doctorID),
//             isOnline: 1
//           }
//         })



//         if (userOffline) {
//           beamsClient.publishToInterests([`forOnly_${userOffline?.id}`], {
//             web: {
//               notification: {
//                 title: "New Appointment",
//                 body: `${session.user?.displayName} Book An Appointment`
//               },
//             },
//           });

//         }


//         await cancelServerQueryRequest(client, session?.user?.id, '`employees`', 'BookAppointment');
//         try {
//           const AddRequestData = serialize(createData.AddRequest);
//           const symptomsData = serialize(createData.symptoms);
//           const hmoData = serialize(createData?.hmo);
//           const dateInput = convertDate(createData.date);
//           const timeInput = new Date(createData.time_slot);
//           timeInput.setMinutes(timeInput.getMinutes() - timeInput.getTimezoneOffset()); // Convert to UTC


//           const timeInputEnd = new Date(createData.end_time);
//           timeInputEnd.setMinutes(timeInputEnd.getMinutes() - timeInputEnd.getTimezoneOffset()); // Convert to UTC

          // let isExists = true;
          // let VoucherCode: any;

          // while (isExists) {
          //   VoucherCode = Math.random().toString(36).substring(2, 8).toUpperCase()

          //   const result = await client.prescriptions.findFirst({
          //     where: {
          //       presCode: VoucherCode
          //     }
          //   })

          //   if (!result) {
          //     isExists = false;
          //   }
          // }

//           const BookTransaction = await client.$transaction(async (trx) => {
//             const BookPost = await trx.appointments.create({
//               data: {
//                 doctorID: Number(createData.doctorID),
//                 clinic: Number(createData.clinic),
//                 patientID: Number(session?.user?.s_id),
//                 date: dateInput,
//                 time_slot: timeInput,
//                 type: Number(createData.type),
//                 status: Number(0),
//                 symptoms: symptomsData,
//                 comment: String(createData.comment), 
//                 Others: String(createData.others),
//                 AddRequest: AddRequestData,
//                 loa_num: '',
//                 hmo: hmoData,
//                 member_id: String(createData?.member_id),
//                 e_time: timeInputEnd,
//                 voucherId: VoucherCode
//               },
//             });

//             return {
//               ...BookPost,
//             };
//           });

        
//           const notifContent = await client.notification_content.create({
//             data: {
//               content: "book an appointment"
//             }
//           })

//           await client.notification.create({
//             data: {
//               user_id: Number(session?.user?.id),
//               notifiable_id: Number(createData.doctorID),
//               notification_type_id: 1,
//               notification_content_id: Number(notifContent?.id),
//               appt_id: Number(BookTransaction?.id)
//             }
//           })

//           let PatientHMO = {}


//           if (createData?.hmo !== "") {
//             PatientHMO = await client.patient_hmo.create({
//               data: {
//                 patientID: Number(session?.user?.s_id),
//                 idno: String(session?.user?.patientIDNO),
//                 hmo: Number(createData.hmo),
//                 member_id: String(createData.member_id),
//               },
//             });
//           }






//           const sFile = await args?.file;
//           if (sFile) {
//             const res: any = useUpload(sFile, 'public/documents/');
//             res?.map(async (v: any) => {
//               await client.appt_hmo_attachment.create({
//                 data: {
//                   filename: String(v!.fileName),
//                   file_url: String(v!.path),
//                   patientID: Number(session?.user?.id),
//                   doctorID: Number(createData.doctorID),
//                   clinic: Number(createData.clinic),
//                   appt_hmo_id: Number(BookTransaction?.id),
//                 },
//               });
//             });
//           }


//           const res: any = { ...BookTransaction, ...PatientHMO };
//           return res;
//         } catch (error) {
//           throw new error(error)
//         }
//       }
//     });
//   },
// });

// export const QueryExistingTime = extendType({
//   type: 'Query',
//   definition(t) {
//     t.nullable.field('QueryExistingTime', {
//       type: DoctorAppointments,
//     });
//   },
// });

export const TakenInputType = inputObjectType({
  name: 'TakenInputType',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.string('date');
    t.nullable.int('clinic');
  },
});

export const QueryTakenTimeSlot = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('QueryTakenTimeSlot', {
      type: DoctorAppointments,
      args: { data: TakenInputType! },
      async resolve(_parent, args, ctx) {
        const { doctorID, date, clinic }: any = args.data;
        const currentDate = new Date(date);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          'QueryTakenTimeSlot'
        );
        try {
          const result: any = await client.appointments.findMany({
            where: {
              doctorID: Number(doctorID),
              clinic: Number(clinic),
              date: {
                gte: currentDate,
              },
            },
          });
          return result;
          // console.log('Appointments:', result);
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});
