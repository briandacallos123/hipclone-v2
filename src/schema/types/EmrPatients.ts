/* eslint-disable no-lone-blocks */
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { extendType, inputObjectType, objectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { unserialize, serialize } from 'php-serialize';
import { emrNotePhysObj } from './notes/NotesPhysical';
// import { PatientInfoObject } from './DoctorAppointments';

const client = new PrismaClient();

export const emr_data = objectType({
  name: 'emr_data',
  definition(t) {
    t.bigInt('id');
    t.bigInt('idno');
    t.string('fname');
    t.string('mname');
    t.string('lname');
    t.string('gender');
    t.string('contact_no');
    t.string('email');
    t.int('patientID');
    t.int('link');
    t.string('dateofbirth');
    t.field('AGE', {
      type: 'Int',
      resolve: (parent) => {
        if (parent.dateofbirth) {
          // Calculate age based on BDAY field
          const birthDate = new Date(parent.dateofbirth);
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

    t.string('fullname');
    // t.int('patient');
    t.nullable.field('patientRelation', {
      type: PatientInfoObject1,
    });
    t.nullable.list.field('medication', {
      type: emr_medication,
    });
    t.nullable.list.field('medicalhistory', {
      type: emr_medicalhistory,
    });
    t.nullable.list.field('smoking', {
      type: emr_smoking,
    });
    t.nullable.list.field('allergy', {
      type: emr_allergy,
    });
    t.nullable.list.field('family_history', {
      type: emr_family_history,
    });
    t.nullable.list.field('notes_vitals', {
      type: emr_notes_vitals,
    });
    t.nullable.list.field('records', {
      type: recordObjectEMR,
    });
    t.nullable.field('doctorInfo', {
      type: emr_doctor_info,
    });
  },
});

///////////////////////////////////////////////////////
const emr_doctor_info = objectType({
  name: 'emr_doctor_info',
  definition(t) {
    t.id('EMPID');
    t.id('EMP_ID');
  },
});
///////////////////////////////////////////////////////

const recordObjectEMR = objectType({
  name: 'recordObjectEMR',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    // t.bigInt('PATIENT');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.dateTime('R_DATE');
    t.int('isDeleted');
    t.string('R_TYPE');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4EMR,
    });
    t.nullable.field('patientInfo', {
      type: PatientInfoObject4EMR,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorInfoObject4EMR,
    });
  },
});
const ClinicObjectFields4EMR = objectType({
  name: 'ClinicObjectFields4EMR',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.int('doctor_idno');
    t.string('clinic_name');
    t.string('location');
    t.int('isDeleted');
  },
});
const DoctorInfoObject4EMR = objectType({
  name: 'DoctorInfoObject4EMR',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('EMP_FULLNAME');
  },
});

const emr_medication = objectType({
  name: 'emr_medication',
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

const emr_medicalhistory = objectType({
  name: 'emr_medicalhistory',
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

const emr_allergy = objectType({
  name: 'emr_allergy',
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

const emr_smoking = objectType({
  name: 'emr_smoking',
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

const emr_family_history = objectType({
  name: 'emr_family_history',
  definition(t) {
    t.int('id');
    t.int('patientID');
    t.nullable.int('emrPatientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.bigInt('patient');
    t.nullable.string('doctor');
    t.nullable.date('dateCreated');
    t.nullable.string('family_history');
    t.nullable.int('isDeleted');
  },
});

const emr_notes_vitals = objectType({
  name: 'emr_notes_vitals',
  definition(t) {
    t.int('id');
    t.nullable.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('isEMR');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.int('clinic');
    t.nullable.dateTime('date');
    t.nullable.string('dateCreated');
    t.nullable.int('report_id');
    t.nullable.string('wt');
    t.nullable.string('ht');
    t.nullable.string('hr');
    t.nullable.string('rr');
    t.nullable.string('bmi');
    t.nullable.string('bt');
    t.nullable.string('spo2');
    t.nullable.string('bp');
    t.nullable.string('bp1');
    t.nullable.string('bp2');
    t.nullable.string('chiefcomplaint');
    t.nullable.string('isDeleted');
  },
});

const EMR_LIST_TYPE = objectType({
  name: 'EMR_LIST_TYPE',
  definition(t) {
    t.nullable.list.field('emr_data_field', {
      type: emr_data,
    });
    t.nullable.list.field('emr_data_carousel', {
      type: emr_data,
    });
    t.field('summary', {
      type: SummaryObjectARRAY,
    });
  },
});

const EMR_Record = objectType({
  name: 'EMR_Record',
  definition(t) {
    t.nullable.list.field('EMR_Record', {
      type: emr_data,
    });
    t.int('total');
  },
});
const EMR_LIST_TYPE_CAROUSEL = objectType({
  name: 'EMR_LIST_TYPE_CAROUSEL',
  definition(t) {
    t.nullable.list.field('emr_data_field', {
      type: emr_data,
    });
  },
});
const SummaryObjectARRAY = objectType({
  name: 'EMRSummaryObject',
  definition(t) {
    // t.nullable.int('total');
    t.nullable.int('link');
    t.nullable.int('unlink');
    t.nullable.int('total');
    t.nullable.int('allRecords');
  },
});

const PatientInfoObject4EMR = objectType({
  name: 'PatientInfoObject4EMR',
  definition(t) {
    t.int('S_ID');
    t.int('IDNO');
    t.int('isEMR');
    t.int('patientID');
    t.int('emrPatientID');
    t.nullable.string('FNAME');
    t.nullable.string('MNAME');
    t.nullable.string('LNAME');
    t.nullable.string('SUFFIX');
    t.nullable.string('BDAY');
    t.nullable.string('HOME_ADD');
    t.nullable.int('BLOOD_TYPE');
    t.nullable.string('OCCUPATION');

    t.nullable.string('EMERGENCYNAME');
    t.nullable.string('EMERGENCYADDRESS');
    t.nullable.string('EMERGENCYCONTACTNO');
    t.nullable.string('EMERGENCYRELATIONSHIP');

    t.nullable.string('EMPLOYERSNAME');
    t.nullable.string('EMPLOYERSADDRESS');
    t.nullable.string('EMPLOYERSPHONENO');

    t.nullable.string('PRIMARYCAREPHYSICIAN');
    t.nullable.string('REFFERINGPHYSICIAN');
    t.nullable.string('OTHERPHYSICIAN');

    t.nullable.string('EMAIL');
    t.nullable.string('CONTACT_NO');
    t.nullable.int('SEX');
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
  },
});

const PatientInfoObject1 = objectType({
  name: 'PatientInfoObject1',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.string('CONTACT_NO');
    t.string('EMAIL');
    t.nullable.string('FNAME');
    t.nullable.string('MNAME');
    t.nullable.string('LNAME');
    t.nullable.string('SEX');
    t.nullable.string('SUFFIX');

    t.nullable.string('HOME_ADD');
    t.nullable.int('BLOOD_TYPE');
    t.nullable.string('OCCUPATION');

    t.nullable.string('EMERGENCYNAME');
    t.nullable.string('EMERGENCYADDRESS');
    t.nullable.string('EMERGENCYCONTACTNO');
    t.nullable.string('EMERGENCYRELATIONSHIP');

    t.nullable.string('EMPLOYERSNAME');
    t.nullable.string('EMPLOYERSADDRESS');
    t.nullable.string('EMPLOYERSPHONENO');

    t.nullable.string('PRIMARYCAREPHYSICIAN');
    t.nullable.string('REFFERINGPHYSICIAN');
    t.nullable.string('OTHERPHYSICIAN');
    t.nullable.list.field('labreport', {
      type: e_m_r_labreport,
    });
    t.nullable.string('BDAY');
    t.field('AGE', {
      type: 'Int',
      resolve: (parent: any) => {
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
    t.nullable.field('uuid', {
      type: 'String',
      async resolve(_parent) {
        // console.log(_parent, 'parent');
        const email = _parent?.EMAIL;

        const getUuid = await client.user.findFirst({
          select: {
            uuid: true,
          },
          where: {
            email,
          },
        });

        // console.log(getUuid, 'ID ni panget@');
        return getUuid?.uuid;
      },
    });
    t.nullable.list.field('userInfo', {
      type: emr_history_userinfo,
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

const emr_history_userinfo = objectType({
  name: 'emr_history_userinfo',
  definition(t) {
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: emr_patient_display_picture,
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
const emr_patient_display_picture = objectType({
  name: 'emr_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
export const e_m_r_labreport = objectType({
  name: 'e_m_r_labreport',
  definition(t) {
    t.nullable.int('id');
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
    t.list.field('labreport_attachments', {
      type: e_m_r_labreport_attachments,
    });
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const e_m_r_labreport_attachments = objectType({
  name: 'e_m_r_labreport_attachments',
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

const ALL_EMR_INPUT = inputObjectType({
  name: 'ALL_EMR_INPUT',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.int('status');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyWord');
    t.nullable.int('emrPatientID');
    t.nullable.int('patientID');
  },
});
const SINGLE_EMR_INPUT = inputObjectType({
  name: 'SINGLE_EMR_INPUT',
  definition(t) {
    t.nullable.int('id');
  },
});

const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereConStatus: any = {};

  // const keyword = args?.data!.searchKeyWord.split(' ');
  // let additionalOrFiler : any = {};
  // if(keyword.length===2){
  //   additionalOrFiler = {
  //     fname: {
  //       contains: keyword[0],
  //     },
  //     lname: {
  //       contains: keyword[1],
  //     },
  //   }
  // }
  // if(keyword.length===3){
  //   additionalOrFiler = {
  //     fname: {
  //       contains: keyword[0],
  //     },
  //     mname: {
  //       contains: keyword[1],
  //     },
  //     lname: {
  //       contains: keyword[2],
  //     },
  //   }
  // }
  // let orQuery = [
  //   {
  //     fname: {
  //       contains: args?.data!.searchKeyWord,
  //     },
  //   },
  //   {
  //     mname: {
  //       contains: args?.data!.searchKeyWord,
  //     },
  //   },
  //   {
  //     lname: {
  //       contains: args?.data!.searchKeyWord,
  //     },
  //   },
  //   {
  //     lname: {
  //       contains: args?.data!.searchKeyWord,
  //     },
  //   },
  //   {
  //     fullname: {
  //       contains: args?.data!.searchKeyWord,
  //     },
  //   },
  //   additionalOrFiler
  // ]

  if (args?.data!.searchKeyWord && isNaN(args?.data!.searchKeyWord)) {
    // console.log(args?.data!.searchKeyWord);
    whereConSearch = {
      OR: [
        {
          fname: {
            contains: args?.data!.searchKeyWord,
          },
        },
        {
          mname: {
            contains: args?.data!.searchKeyWord,
          },
        },
        {
          lname: {
            contains: args?.data!.searchKeyWord,
          },
        },
      ],
    };
  } else {
    if (Number(args?.data!.searchKeyWord) !== 0) {
      {
        whereConSearch = {
          OR: [
            {
              id: Number(args?.data!.searchKeyWord) ?? -1,
            },
          ],
        };
      }
    }
  }
  // if (!isNaN(args?.data!.searchKeyWord) && args?.data!.searchKeyWord !== 0) {
  //   whereConSearch = {
  //     OR: [
  //       {
  //         id: Number(args?.data!.searchKeyWord) ?? -1,
  //       },
  //     ],
  //   };
  // }

  // const status: any = Number(args?.data!.status);
  // if (status === 1) {
  //   // console.log('1');
  //   whereConStatus = {
  //     link: 1,
  //   };
  // }
  // if (status === 2) {
  //   // console.log('2');

  //   whereConStatus = {
  //     link: 0,
  //   };
  // }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      // ...whereConStatus,
    },
  };
  // console.log(multicondition, '@@@@@@@');
  return multicondition;
};

export const emr_patient_data_data = objectType({
  name: 'emr_patient_data_data',
  definition(t) {
    t.int('id');
    t.string('fname');
    t.string('suffix');
    t.string('lname');
    t.int('gender');
    t.int('status');
    t.string('address');
    t.string('email');
    t.string('contact_no');
    t.string('dateofbirth');
  },
});

export const EmrPatientUpsertType = inputObjectType({
  name: 'EmrPatientUpsertType',
  definition(t) {
    t.nonNull.string('fname');
    t.nullable.string('suffix');
    t.nonNull.string('lname');
    t.nonNull.int('gender');
    t.nonNull.int('status');
    t.nullable.string('address');
    t.nullable.string('email');
    t.nullable.string('contact_no');
    t.nonNull.string('dateofbirth');
  },
});

export const emr_patient_transactions = objectType({
  name: 'emr_patient_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('create_emr_patient_data', {
      type: emr_patient_data_data,
    });
  },
});

export const MutationEmrPatient = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('MutationEmrPatient', {
      type: emr_patient_transactions,
      args: { data: EmrPatientUpsertType! },
      async resolve(_, args, ctx) {
        const {
          fname,
          suffix,
          lname,
          gender,
          status,
          address,
          email,
          contact_no,
          dateofbirth,
        }: any = args.data;
        const { session } = ctx;
        console.log(ctx, 'ctxctx');
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`MutationEmrPatient`',
          'EmrPatientUpsertType'
        );
        let res: any = {};
        try {
          // //VALIDATING PHONE USER
          // const mobile_number = contact_no;
          // const existingUserWithMobile = await client.user.findFirst({
          //   where: {
          //     mobile_number,
          //   },
          // });

          // if (existingUserWithMobile) {
          //   res = {
          //     status: "Failed",
          //     message: "Phone Number Already Taken",
          //   };
          //   return res;
          // }
          // //VALIDATING PHONE USER

          // const emr_existingUserWithMobile = await client.emr_patient.findFirst({
          //   where: {
          //     contact_no,
          //   },
          // });

          // if (emr_existingUserWithMobile) {
          //   res = {
          //     status: "Failed",
          //     message: "Phone Number Already Taken",
          //   };
          //   return res;
          // }
          // // VALIDATING PHONE USER

          // //VALIDATING EMAIL
          // const existingUserEmail = await client.user.findFirst({
          //   where: {
          //     email,
          //   },
          // });

          // if (existingUserEmail) {
          //   res = {
          //     status: "Failed",
          //     message: "Email Already Taken",
          //   };
          //   return res;
          // }
          // //VALIDATING EMAIL

          // //VALIDATING EMAIL
          // const emr_existingUserEmail = await client.emr_patient.findFirst({
          //   where: {
          //     email,
          //   },
          // });

          // if (emr_existingUserEmail) {
          //   res = {
          //     status: "Failed",
          //     message: "Email Already Taken",
          //   };
          //   return res;
          // }
          // //VALIDATING EMAIL

          // //VALIDATING EMAIL
          // const existingSubAccountEmail = await client.sub_account.findFirst({
          //   where: {
          //     email,
          //   },
          // });

          // if (existingSubAccountEmail) {
          //   res = {
          //     status: "Failed",
          //     message: "Email Already Taken",
          //   };
          //   return res;
          // }
          // //VALIDATING EMAIL

          const newPost_fm = await client.emr_patient.findMany({
            orderBy: {
              id: 'desc',
            },
          });

          let idno_id: any;
          if (newPost_fm) {
            idno_id = Number(newPost_fm[0].idno) + 1;
          }

          // emr_patient
          const link = 0;
          const idno = idno_id; // static lang to
          const doctorID = session?.user?.id;
          const doctor = String(session?.user?.doctorId);
          const newPost = await client.emr_patient.create({
            data: {
              idno,
              fname,
              suffix,
              lname,
              gender,
              status,
              address,
              email,
              contact_no,
              dateofbirth,
              link,
              doctorID,
              doctor,
            },
          });
          // emr_patient

          if (newPost) {
            res = {
              status: 'Success',
              message: 'Create Emr Patient Successfully',
              create_emr_patient_data: newPost, // Include the created entry
            };
          }

          return res;
        } catch (err) {
          console.log(err);
          res = {
            status: 'Failed',
            message: 'An error occurred.',
          };
        }
        return res;
      },
    });
  },
});

export const QuerySingleEmr = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QuerySingleEmr', {
      type: emr_data,
      args: { data: SINGLE_EMR_INPUT! },
      async resolve(_root, args, ctx) {
        const { id }: any = args.data;

        const { session } = ctx;

        const result = await client.emr_patient.findFirst({
          where: {
            id,
          },
          include: {
            doctorInfo: true,
            patientRelation: {
              include: {
                labreport: {
                  where: {
                    NOT: {
                      doctorInfo: null,
                    },
                  },
                  include: {
                    labreport_attachments: true,
                  },
                },
              },
            },
            medication: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            medicalhistory: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            smoking: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            allergy: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            family_history: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            notes_vitals: {
              where: {
                isDeleted: '0',
                isEMR: 1,
              },
            },
            records: {
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
            },
          },
        });

        // console.log('RESULT: ', result);

        return result;
      },
    });
  },
});

export const QueryAllEMRCarousel = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryAllEMRCarousel', {
      type: EMR_LIST_TYPE_CAROUSEL,
      args: { data: ALL_EMR_INPUT! },
      async resolve(_root, args, ctx) {
        const { take, skip }: any = args.data;

        const { session } = ctx;

        const result = await client.emr_patient.findMany({
          take,
          skip,
          where: {
            doctorID: session?.user?.id,
          },
          include: {
            patientRelation: true,
            medication: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            medicalhistory: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            smoking: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            allergy: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            family_history: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            notes_vitals: {
              where: {
                isDeleted: '0',
                isEMR: 1,
              },
            },
          },
        });

        return {
          emr_data_field: result,
        };
      },
    });
  },
});

const LinkAccountInputs = inputObjectType({
  name: 'LinkAccountInputs',
  definition(t) {
    t.int('id');
    t.string('uuid');
  },
});

export const LinkAccount = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('LinkAccount', {
      type: emr_data,
      args: { data: LinkAccountInputs! },
      async resolve(_root, args, ctx) {
        const { id, uuid }: any = args.data;

        const { session } = ctx;

        // patientId
        const patientID: any = await client.user.findFirst({
          where: {
            uuid,
          },
          include: {
            patientInfo: true,
          },
        });
        // emr_patient record
        const emr_patient_data: any = await client.emr_patient.findFirst({
          where: {
            id,
          },
        });
        console.log(emr_patient_data, 'yawa@');
        // update
        const updatedResult: any = await client.emr_patient.update({
          where: {
            id,
          },
          data: {
            ...emr_patient_data,
            link: 1,
            patientID: patientID?.patientInfo?.S_ID,
          },
          include: {
            patientRelation: {
              include: {
                labreport: {
                  where: {
                    NOT: {
                      doctorInfo: null,
                    },
                  },
                  include: {
                    labreport_attachments: true,
                  },
                },
              },
            },
            medication: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            medicalhistory: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            smoking: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            allergy: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            family_history: {
              where: {
                isDeleted: 0,
                doctorID: session?.user?.id,
              },
            },
            notes_vitals: {
              where: {
                isDeleted: '0',
                isEMR: 1,
              },
            },
            records: {
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
              },
            },
          },
        });

        return updatedResult;
      },
    });
  },
});

export const QueryAllEMR = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryAllEMR', {
      type: EMR_LIST_TYPE,
      args: { data: ALL_EMR_INPUT! },
      async resolve(_root, args, ctx) {
        const { take, skip, orderBy, orderDir }: any = args.data;

        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            {
              order = [
                {
                  fname: args?.data!.orderDir,
                },
              ];
            }
            break;
          case 'phoneNumber':
            {
              order = [{ contact_no: args?.data!.orderDir }];
            }
            break;
          case 'email':
            {
              order = [{ email: args?.data!.orderDir }];
            }
            break;
          case 'status':
            {
              order = [{ link: args?.data!.orderDir }];
            }
            break;
          case 'linkedAccount':
            {
              order = [{ link: args?.data!.orderDir }];
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

        const orderConditions = {
          orderBy: order,
        };

        // const linkStatus = (() => {
        //   if (args?.data?.status === -1) return {};

        //   if (args?.data?.status === 2) {
        //     return {
        //       link: 0,
        //     };
        //   }
        //   return {
        //     link: 1,
        //   };
        // })();

        // const linkStatus = (() => {
        //   if (args?.data?.status === -1) return {};
        //   if (args?.data?.status === 2) {
        //     return {
        //       link: 0,
        //     };
        //   }
        //   if (args?.data?.status === 1) {
        //     return {
        //       link: 1,
        //     };
        //   }
        // })();
        const whereconditions = filters(args);
        const linkStatus = (() => {
          if (args?.data?.status === -1) return {};
          return {
            link: args?.data?.status,
          };
        })();

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`emr_patient`', 'QueryAllEMR');

        const checkUser = (() => {
          if (session?.user?.role === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        try {
          const [
            emr_patient,
            pagiCount,
            tabAllCount,
            tabLinkedCount,
            tabUnlinkedCount,
            forCarousel,
          ]: any = await client.$transaction([
            client.emr_patient.findMany({
              take,
              skip,
              where: {
                ...linkStatus,
                ...whereconditions,
                // doctorID: session?.user?.id,
                ...checkUser,
              },
              ...orderConditions,

              include: {
                // patientRelation: true,
                patientRelation: {
                  include: {
                    labreport: {
                      include: {
                        labreport_attachments: true,
                      },
                    },
                  },
                },
                medication: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),
            client.emr_patient.findMany({
              where: {
                ...linkStatus,
                ...whereconditions,
                // doctorID: session?.user?.id,
                ...checkUser,
              },
              ...orderConditions,
              include: {
                patientRelation: true,
                medication: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
              },
            }),
            client.emr_patient.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...whereconditions,
              },
              // ...orderConditions,
              include: {
                patientRelation: true,
                medication: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),
            whereconditions
              ? client.emr_patient.findMany({
                  where: {
                    link: 1,
                    ...whereconditions,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                  // ...orderConditions,
                  include: {
                    patientRelation: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 1,
                      },
                    },
                    records: {
                      include: {
                        patientInfo: true,
                        clinicInfo: true,
                        doctorInfo: true,
                      },
                    },
                  },
                })
              : client.emr_patient.findMany({
                  // Use Prisma Client promise here
                  where: {
                    link: 1,
                    ...whereconditions,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                  // ...orderConditions,
                  include: {
                    patientRelation: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 1,
                      },
                    },
                    records: {
                      include: {
                        patientInfo: true,
                        clinicInfo: true,
                        doctorInfo: true,
                      },
                    },
                  },
                }),
            client.emr_patient.findMany({
              where: {
                link: 0,
                ...whereconditions,
                // doctorID: session?.user?.id,
                ...checkUser,
              },
              include: {
                patientRelation: true,
                medication: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),

            // for carousel
            client.emr_patient.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
              },
              ...orderConditions,

              include: {
                // patientRelation: true,
                patientRelation: {
                  include: {
                    labreport: {
                      include: {
                        labreport_attachments: true,
                      },
                    },
                  },
                },
                medication: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    // doctorID: session?.user?.id,
                    ...checkUser,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),
          ]);

          const ApagiCount: any = pagiCount.length || 0;
          const AtabAllCount: any = tabAllCount.length || 0;
          const AtabLinkedCount: any = tabLinkedCount.length || 0;
          const AtabUnlinkedCount: any = tabUnlinkedCount.length || 0;

          const data = {
            ApagiCount,
            AtabAllCount,
            AtabLinkedCount,
            AtabUnlinkedCount,
          };

          // console.log(data,"datadatadatadatadata");

          // console.log(data, 'asdwdatadata');

          const response: any = {
            emr_data_field: emr_patient,
            emr_data_carousel: forCarousel,
            summary: {
              link: Number(AtabLinkedCount),
              unlink: Number(AtabUnlinkedCount),
              total: Number(AtabAllCount),
              allRecords: Number(ApagiCount),
            },
          };

          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });

    // t.field('totalHMOSummary', {
    //   type: SummaryObjectARRAY,
    //   args: { data: AllHmoClaimsInputType! },
    //   async resolve(_root, args, _ctx) {
    //     const whereconditions = filters(args);
    //     const aggregations: any = await client.hmo_claims.groupBy({
    //       by: ['claim_status'],
    //       where: {
    //         AND: [{ isDeleted: 0 }, { ...whereconditions }],
    //       },
    //       _count: {
    //         id: true,
    //       },
    //     });
    //     let total = 0;
    //     aggregations.map((i: any) => (total += i?._count?.id));
    //     const result = {
    //       total,
    //       pending: aggregations.find((v: any) => v?.claim_status === 1)?._count?.id,
    //       approved: aggregations.find((v: any) => v?.claim_status === 0)?._count?.id,
    //       done: aggregations.find((v: any) => v?.claim_status === 3)?._count?.id,
    //       cancelled: aggregations.find((v: any) => v?.claim_status === 4)?._count?.id,
    //     };
    //     return result;
    //   },
    // });

    // t.nullable.field('totalHMOClaims', {
    //   type: 'Int',
    //   args: { data: AllHmoClaimsInputType! },
    //   async resolve(_root, args, _ctx) {
    //     const whereconditions = filters(args);
    //     const claim_status = (() => {
    //       if (args?.data?.claim_status === -1) return {};
    //       return {
    //         claim_status: Number(args?.data!.claim_status),
    //       };
    //     })();
    //     const aggregation: any = await client.hmo_claims.aggregate({
    //       where: {
    //         ...claim_status,
    //         ...whereconditions,
    //       },
    //       _count: {
    //         id: true,
    //       },
    //     });
    //     const { _count } = aggregation;
    //     return Number(_count.id);
    //   },
    // });
  },
});

export const QueryEMR_MedNotes = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryEMR_Record', {
      type: EMR_Record,
      args: { data: ALL_EMR_INPUT! },
      async resolve(_root, args, ctx) {
        const { take, skip, orderBy, orderDir }: any = args.data;
        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = [
              {
                R_DATE: {
                  FNAME: args?.data!.orderDir,
                },
              },
            ];

            break;

          case 'doctor':
            order = [
              {
                doctorInfo: {
                  EMP_FULLNAME: args?.data!.orderDir,
                },
              },
            ];

            break;

          case 'hospital':
            order = [
              {
                clinicInfo: {
                  clinic_name: args?.data!.orderDir,
                },
              },
            ];

            break;

          // case 'type':
          //   order = [
          //     {
          //       patientInfo: {
          //         SEX: args?.data!.orderDir,
          //       },
          //     },
          //   ];

          //   break;

          default:
            order = {};
        }

        const orderConditions = {
          orderBy: order,
        };

        const whereconditions = filtersPatient(args);
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`emr_patient`',
          '`QueryEMR_Record`'
        );

        try {
          const [medNoteData, _count]: any = await client.$transaction([
            client.emr_patient.findMany({
              take,
              skip,
              where: {
                // id: 4756,
                ...whereconditions,
                doctorID: session?.user?.id,
              },
              ...orderConditions,

              include: {
                patientRelation: true,
                medication: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  where: {
                    NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
                  },
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),

            // total

            client.emr_patient.findMany({
              take,
              skip,
              where: {
                ...whereconditions,
                doctorID: session?.user?.id,
              },
              ...orderConditions,

              include: {
                patientRelation: true,
                medication: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                medicalhistory: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                smoking: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                allergy: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                family_history: {
                  where: {
                    isDeleted: 0,
                    doctorID: session?.user?.id,
                  },
                },
                notes_vitals: {
                  where: {
                    isDeleted: '0',
                    isEMR: 1,
                  },
                },
                records: {
                  where: {
                    NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
                  },
                  include: {
                    patientInfo: true,
                    clinicInfo: true,
                    doctorInfo: true,
                  },
                },
              },
            }),
          ]);

          const total = _count.length;
          // console.log('RESULT: ', medNoteData);
          const response: any = {
            EMR_Record: medNoteData,
            total: Number(total),
          };

          return response;
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});

const filtersPatient = (args: any) => {
  let whereConSearch: any = {};
  let whereDate: any = {};
  let whereConClinic: any = {};
  let multicondition: any = {};

  if (args?.data!.searchKeyword) {
    whereConSearch = {
      OR: [
        // {
        //   R_DATE: {
        //     contains: args?.data!.searchKeyword,
        //   },
        // },

        {
          clinicInfo: {
            clinic_name: {
              contains: args?.data!.searchKeyword,
            },
          },
        },

        {
          clinicInfo: {
            location: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          clinicInfo: {
            doctorInfo: {
              EMP_FULLNAME: {
                contains: args?.data!.searchKeyword,
              },
            },
          },
        },
      ],
    };

    const clinicIDs: any = args?.data!.clinicIds;
    if (clinicIDs.length) {
      whereConClinic = {
        clinicInfo: {
          CLINIC: {
            in: clinicIDs,
          },
        },
      };
    }
  }
  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
    };
  }
  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      // ...whereConClinic,
      ...whereDate,
    },
  };
  return multicondition;
};

export const emr_note_soap = objectType({
  name: 'emr_note_soap',
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
    t.nullable.field('physicalInfo', {
      type: emrNotePhysObj,
      async resolve(root, args, _ctx) {
        const result: any = await client.notes_physical.findFirst({
          where: {
            report_id: String(root?.report_id),
          },
        });
        return result;
      },
    });
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
  },
});

/////////////////////////////////////
//REQUEST PAYLOADS
export const emr_note_soap_input_request = inputObjectType({
  name: 'emr_note_soap_input_request',
  definition(t) {
    t.nullable.int('emr_id');
    t.nullable.int('patient_id');
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////

///////////////////////////////////////
export const emr_note_soap_transactions = objectType({
  name: 'emr_note_soap_transactions',
  definition(t) {
    t.nullable.list.field('emr_note_soap_data', {
      type: emr_note_soap,
    });
  },
});
///////////////////////////////////////

export const get_all_emr_note_soap = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('get_all_emr_note_soap', {
      type: emr_note_soap_transactions,
      args: { data: emr_note_soap_input_request },
      async resolve(_root, args, ctx) {
        const { emr_id, patient_id }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`get_all_emr_note_soap`',
          'emr_note_soap_input_request'
        );
        let res: any = {};
        try {
          const [notes_soap]: any = await client.$transaction([
            client.notes_soap.findMany({
              take: 1,
              where: {
                OR: [
                  {
                    emrPatientID: Number(args?.data?.emr_id),
                  },
                  {
                    patientID: Number(args?.data?.patient_id),
                  },
                ],
              },
              orderBy: {
                id: 'desc',
              },
            }),
          ]);

          const _result: any = notes_soap;

          const response: any = {
            emr_note_soap_data: _result,
          };

          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
