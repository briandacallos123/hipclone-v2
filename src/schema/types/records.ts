import { orderBy } from 'lodash/orderBy';
import { PrismaClient } from '@prisma/client';
import { objectType, inputObjectType, extendType } from 'nexus';
import { GraphQLError } from 'graphql/error';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { FieldClinics } from './DoctorClinics';

const client = new PrismaClient();

const RecordObjectFields = objectType({
  name: 'RecordObjectFields',
  definition(t) {
    t.id('R_ID');
    t.id('isEMR');
    // t.bigInt('PATIENT');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('CLINIC');
    t.dateTime('R_DATE');
    t.nullable.field('esig',{
      type:esigType
    })
    t.int('isDeleted');
    t.string('R_TYPE');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4Records,
    });
    t.nullable.field('patientInfo', {
      type: PatientInfoObject4Records,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorInfoObject4Records,
    });
    t.nullable.field('emr_patient', {
      type: emr_data4Records,
    });
    t.nullable.list.field('notes_text', {
      type: notes_text_attachments,
      async resolve(root, _arg, ctx) {
        console.log(root?.notes_text, '_ROOT@@@');

        const result: any = await client.notes_text_attachments.findMany({
          where: {
            notes_text_id: Number(root?.notes_text[0]?.id),
          },
        });
        // console.log('RESULT: ', result);
        return result;
      },
    });
  },
});

const esigType = objectType({
  name:"esigType",
  definition(t) {
      t.string('filename')
  },
})

export const NoteTxtObjRec = objectType({
  name: 'NoteTxtObjRec',
  definition(t) {
    t.id('id');
    t.nullable.list.field('attachment', {
      type: notes_text_attachments,
    });
  },
});
export const notes_text_attachments = objectType({
  name: 'notes_text_attachments',
  definition(t) {
    t.string('file_name');
    t.string('file_url');
    t.int('notes_text_id');
  },
});

export const emr_data4Records = objectType({
  name: 'emr_data4Records',
  definition(t) {
    t.bigInt('id');
    t.bigInt('idno');
    t.string('fname');
    t.string('mname');
    t.string('lname');
    t.string('gender');
    t.int('patientID');
    t.int('link');
  },
});

const DoctorInfoObject4Records = objectType({
  name: 'DoctorInfoObject4Records',
  definition(t) {
    t.id('EMP_ID');
    t.string('EMP_FULLNAME');
    t.string('LIC_NUMBER')
  },
});

const PatientInfoObject4Records = objectType({
  name: 'PatientInfoObject4Records',
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
    t.nullable.list.field('emr_patient', {
      type: emr_patient_data,
    });
    t.nullable.list.field('medication', {
      type: p_medication,
    });
    t.nullable.list.field('medicalhistory', {
      type: p_medicalhistory,
    });
    t.nullable.list.field('smoking', {
      type: p_smoking,
    });
    t.nullable.list.field('allergy', {
      type: p_allergy,
    });
    t.nullable.list.field('family_history', {
      type: p_family_history,
    });
    t.nullable.list.field('notes_vitals', {
      type: p_notes_vitals,
    });
    t.nullable.field('userInfo', {
      type: userObj,
    });
  },
});

const userObj = objectType({
  name: 'userObj',
  definition(t) {
    t.nonNull.string('uuid');
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: record_patient_display_picture,
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
const record_patient_display_picture = objectType({
  name: 'record_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

export const emr_patient_data = objectType({
  name: 'emr_patient_data',
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
  },
});

const p_medication = objectType({
  name: 'p_medication',
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

const p_medicalhistory = objectType({
  name: 'p_medicalhistory',
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

const p_allergy = objectType({
  name: 'p_allergy',
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

const p_smoking = objectType({
  name: 'p_smoking',
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

const p_family_history = objectType({
  name: 'p_family_history',
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

const p_notes_vitals = objectType({
  name: 'p_notes_vitals',
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

const ClinicObjectFields4Records = objectType({
  name: 'ClinicObjectFields4Records',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.int('doctor_idno');
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4Records,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.employees.findFirst({
          where: {
            EMPID: Number(root?.doctor_idno),
          },
        });

        return result;
      },
    });
    t.string('clinic_name');
    t.string('location');
    t.int('isDeleted');
    t.list.field('clinicDPInfo', {
      type: rec_clinicDPInfos,
    });
  },
});

const rec_clinicDPInfos = objectType({
  name: 'rec_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

const DoctorObjectFields4Records = objectType({
  name: 'DoctorObjectFields4Records',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('EMP_FULLNAME');
  },
});

export const RecordTransactionObject = objectType({
  name: 'RecordTransactionObject',
  definition(t) {
    t.nullable.list.field('Records_data', {
      type: RecordObjectFields,
    });
    // t.field('summary', {
    //   type: SummaryObject4record,
    // });
    t.nullable.list.field('Records_list', {
      type: RecordObjectFields,
    });
    t.nullable.field('Records_ByIDs', {
      type: RecordObjectFields,
    });
    t.nullable.int('total');
    t.nullable.int('male');
    t.nullable.int('female');
    t.nullable.int('total_records_fix');
    t.int('total_records');
    t.int('male');
    t.int('female');
  },
});
export const RecordMedNoteTransactionObject = objectType({
  name: 'RecordMedNoteTransactionObject',
  definition(t) {
    t.nullable.list.field('Records_data', {
      type: RecordObjectFields,
    });
    t.nullable.list.field('RecordByIDs', {
      type: RecordObjectFields,
    });
    t.nullable.list.field('RecordIds', {
      type: RecordObjectFields,
    });
    t.nullable.int('total_records');
    t.nullable.list.field('clinic', {
      type: FieldClinics
    })
  },
});
export const AllRecordInputType = inputObjectType({
  name: 'AllRecordInputType',
  definition(t) {
    t.nullable.int('patientID');
    t.nullable.int('sex');
    t.nullable.int('emrID');
    t.nullable.string('uuid');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
    t.nullable.dateTime('startDate');
    t.nullable.dateTime('endDate');
    t.nullable.string('userType');
    t.nullable.string('recordType');
  },
});

// const SummaryObject4record = objectType({
//   name: 'SummaryObject4record',
//   definition(t) {
//     t.nullable.int('total');
//     t.nullable.int('male');
//     t.nullable.int('female');
//     t.nullable.int('unspecified');
//   },
// });

const RecordInputs = inputObjectType({
  name: 'RecordInputs',
  definition(t) {
    t.int('take');
    t.string('searchKeyWord');
  },
});

export const QueryAllPatient = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('QueryAllPatient', {
      type: PatientInfoObject4Records,
      args: { data: RecordInputs! },
      async resolve(_root, args, ctx) {
        const { take, searchKeyWord }: any = args?.data;

        const whereconditions = filtersAllPatient(args);

        // get all emr_patient
        const { session } = ctx;

       
        const patientIdsData = await client.records.findMany({
         
          where: {
            doctorID: session?.user?.id,
            NOT: [{ R_TYPE: '3' }],
            isDeleted: 0,
            isEMR: 0,
          },
          distinct: ['patientID'],
          include: {
            patientInfo: true,
          },
        });

        // console.log(patientIdsData,'patientIdsDatapatientIdsData')

        let patientIds: any = [];
        patientIdsData.forEach((i: any) => {
          if(typeof i?.patientInfo?.S_ID === 'number'){
            patientIds.push(Number(i?.patientInfo?.S_ID));
          }
        });
        console.log(patientIds,'Patient ID')

        const emr_records = await client.emr_patient.findMany({
          where: {
            doctorID: session?.user?.id,
            isdeleted: 0,
            NOT: [
              {
                patientID: null,
              },
            ],
          },

          include: {
            patientRelation: {
              select: {
                S_ID: true,
              },
            },
          },
        });
        // list of emrIds

        // console.log(emr_records,'emr_records')

        const emrIds: any = [];
        emr_records.forEach((i) => emrIds.push(i.patientRelation?.S_ID));

        const realPatientIds: any = [];

        patientIds.map((i: any) => {
          if (!emrIds.includes(i)) {
            realPatientIds.push(i)
          }
        });


        console.log(realPatientIds,'emr_records')

        // console.log('LIST OF PATIENTS: ', realPatientIds);

        // emr_records?.forEach((item) => {
        //   // if(patientIds.inclu)
        //   console.log(item?.patientRelation?.S_ID, 'ID@@');

        //   if(patientIds?.includes(Number()))
        //   // if (!patientIds?.includes(Number(item?.patientRelation?.S_ID))) {
        //   //   realPatientIds.push(item?.patientRelation?.S_ID);
        //   // }
        // });

        // console.log(patientIds.length, 'patientIds@@');

        // console.log(realPatientIds, 'realPatientIds@@@');

        const result = await client.patient.findMany({
          where: {
            isDeleted: 0,

            S_ID: {
              in: realPatientIds,
            },

            ...whereconditions,
          },
          include: {
            userInfo: {
              include: {
                display_picture: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
          },
        });

        // console.log(result,'RESULTTTTTT')
        return result;
      },
    });
  },
});

export const QueryAllRecord = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allRecords', {
      type: RecordTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        console.log('519');

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

          case 'email':
            order = [
              {
                patientInfo: {
                  EMAIL: args?.data!.orderDir,
                },
              },
            ];

            break;

          case 'phoneNumber':
            order = [
              {
                patientInfo: {
                  CONTACT_NO: args?.data!.orderDir,
                },
              },
            ];

            break;

          case 'gender':
            order = [
              {
                patientInfo: {
                  SEX: args?.data!.orderDir,
                },
              },
            ];

            break;

          default: {
            order = [
              {
                R_ID: 'desc',
              },
            ];
          }
        }

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);
        const sex = (() => {
          if (args?.data?.sex === -1) return {};
          return {
            patientInfo: {
              // where: {
              SEX: args?.data?.sex,
              // },
            },
          };
        })();

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`records`', '`allRecords`');

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
            records_data,
            recordByID,
            records_list,
            total_records,
            all_count,
            maleCount,
            femaleCount,
          ]: any = await client.$transaction([
            client.records.findMany({
              skip,
              take,
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...sex,
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...whereconditions,
              },
              distinct: ['patientID'],
              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                    notes_text: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                        // doctorID: session?.user?.id,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                  },
                },
              },
              ...orderConditions
            }),
            // for record by ids
            client.records.findFirst({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...sex,
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...whereconditions,
              },

              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 0,
                      },
                    },
                  },
                },
              },
            }),
            // list for view
            client.records.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                ...sex,
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...whereconditions,
              },
              distinct: ['patientID'],
              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 0,
                        // doctorID: session?.user?.id,
                        ...checkUser,
                      },
                    },
                  },
                },
              },
              // ...orderConditions,
            }),

            client.records.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...sex,
                ...whereconditions,
              },
              distinct: ['patientID'],
              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                  },
                },
              },
            }),

            client.records.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...whereconditions,
              },
              distinct: ['patientID'],
              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                  },
                },
              },
            }),
            whereconditions
              ? client.records.findMany({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  patientInfo: {
                    SEX: 1,
                  },
                  NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                  isDeleted: 0,
                  isEMR: 0,
                  ...whereconditions,
                },
                distinct: ['patientID'],
                include: {
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
                      userInfo: {
                        include: {
                          display_picture: {
                            orderBy: {
                              id: 'desc',
                            },
                          },
                        },
                      },
                      emr_patient: true,
                    },
                  },
                },
              })
              : client.records.findMany({
                // Use Prisma Client promise here
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  patientInfo: {
                    SEX: 1,
                  },
                  NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                  isDeleted: 0,
                  isEMR: 0,
                  ...whereconditions,
                },
                distinct: ['patientID'],
                include: {
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
                      userInfo: {
                        include: {
                          display_picture: {
                            orderBy: {
                              id: 'desc',
                            },
                          },
                        },
                      },
                      emr_patient: true,
                    },
                  },
                },
              }),

            client.records.findMany({
              where: {
                // doctorID: session?.user?.id,
                ...checkUser,
                patientInfo: {
                  SEX: 2,
                },
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                isEMR: 0,
                ...whereconditions,
              },
              distinct: ['patientID'],
              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                  },
                },
              },
            }),
          ]);

          console.log(records_data, 'records_datarecords_datarecords_data')
          const AtotalRecords: any = total_records.length || 0;
          const AallCount: any = all_count.length || 0;
          const AmaleCount: any = maleCount.length || 0;
          const AfemaleCount: any = femaleCount.length || 0;

          const _result: any = records_data;
          const _resultOne: any = recordByID;
          const _resultList: any = records_list;
          const maleRecordsCount: any = Number(AmaleCount);
          const femaleRecordsCount: any = Number(AfemaleCount);
          const totalRecordsCount: any = Number(AallCount);
          const totalRecordsCountfix: any = Number(AtotalRecords);

          const response: any = {
            Records_data: _result,
            total_records_fix: totalRecordsCountfix,
            total_records: totalRecordsCount,
            male: maleRecordsCount,
            female: femaleRecordsCount,
            Records_list: _resultList,
            Records_ByIDs: _resultOne,
          };
          // console.log(totalRecordsCount);

          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
const filters = (args: any) => {
  let whereConSearch: any = {};
  let whereConClinic: any = {};
  let whereDate: any = {};
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
          R_TYPE: {
            contains: args?.data!.searchKeyword,
          },
        },
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
        {
          patientInfo: {
            EMAIL: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          patientInfo: {
            CONTACT_NO: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
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
          patientInfo: {
            EMAIL: {
              contains: args?.data!.searchKeyword,
            },
          },
        },
        {
          patientInfo: {
            CONTACT_NO: {
              contains: args?.data!.searchKeyword,
            },
          },
        },

        // {
        //   clinicInfo: {
        //     doctorInfo: {
        //       EMP_FULLNAME: {
        //         contains: args?.data!.searchKeyword,
        //       },
        //     },
        //   },
        // },
      ],
    };
  }
  const clinicIDs: any = args?.data!.clinicIds;
  if (clinicIDs?.length) {
    whereConClinic = {
      CLINIC: {
        in: clinicIDs,
      },
    };
  }
  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
    };
  }
  if (args?.data!.startDate && !args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        gte: args?.data!.startDate,
      },
    };
  }
  if (!args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        lte: args?.data!.endDate,
      },
    }
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

const filtersAllPatient = (args: any) => {
  let whereConSearch: any = {};
  // let whereDate: any = {};
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
          FNAME: {
            contains: args?.data!.searchKeyword,
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

export const QueryOneRecordProfile = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryOneProfile', {
      type: RecordTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`records`', '`QueryOneProfile`');

        try {
          const patientInfo: any = await client.user.findFirst({
            where: {
              uuid: String(args?.data!.uuid),
            },
            include: {
              patientInfo: true,
            },
          });
          console.log(patientInfo, 'PATIENT INFO@@#@@@');

          const emrPatientId = await client.emr_patient.findFirst({
            where: {
              patientID: Number(patientInfo?.patientInfo?.S_ID),
            },
          });
          console.log(emrPatientId, 'emrPatientId INFO@@#@@@');

          const checkUser = (() => {
            if (session?.user?.role === 'secretary')
              return {
                doctorID: session?.user?.permissions?.doctorID,
              };
            return {
              doctorID: session?.user?.id,
            };
          })();
          console.log(checkUser, 'checkUser checkUsercheckUsercheckUsercheckUser@@#@@@');

          if (emrPatientId && Number(emrPatientId?.link) === 1) {
            const [recordByID]: any = await client.$transaction([
              client.records.findFirst({
                where: {
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  patientInfo: {
                    userInfo: {
                      uuid: String(args?.data!.uuid),
                    },
                  },
                  NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
                  isDeleted: 0,
                  // isEMR: 0,
                },
                orderBy: {
                  patientInfo: {
                    FNAME: 'asc',
                  },
                },

                include: {
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
                      userInfo: {
                        include: {
                          display_picture: {
                            orderBy: {
                              id: 'desc',
                            },
                          },
                        },
                      },
                      emr_patient: true,
                      medication: {
                        where: {
                          isDeleted: 0,
                          OR: [
                            {
                              emrPatientID: Number(emrPatientId?.id),
                            },
                            {
                              patientID: Number(patientInfo?.patientInfo.S_ID),
                            },
                          ],
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      medicalhistory: {
                        where: {
                          isDeleted: 0,
                          OR: [
                            {
                              emrPatientID: Number(emrPatientId?.id),
                            },
                            {
                              patientID: Number(patientInfo?.patientInfo.S_ID),
                            },
                          ],
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      smoking: {
                        where: {
                          isDeleted: 0,
                          OR: [
                            {
                              emrPatientID: Number(emrPatientId?.id),
                            },
                            {
                              patientID: Number(patientInfo?.patientInfo.S_ID),
                            },
                          ],
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      allergy: {
                        where: {
                          isDeleted: 0,
                          OR: [
                            {
                              emrPatientID: Number(emrPatientId?.id),
                            },
                            {
                              patientID: Number(patientInfo?.patientInfo.S_ID),
                            },
                          ],
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      family_history: {
                        where: {
                          isDeleted: 0,
                          OR: [
                            {
                              emrPatientID: Number(emrPatientId?.id),
                            },
                            {
                              patientID: Number(patientInfo?.patientInfo.S_ID),
                            },
                          ],
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      notes_vitals: {
                        where: {
                          isDeleted: '0',
                          isEMR: 0,
                          doctorID: session?.user?.id,
                          NOT: [{ report_id: null }],
                        },
                      },
                    },
                  },
                },
              }),
            ]);

            const _resultOne: any = recordByID;

            const response: any = {
              Records_ByIDs: _resultOne,
            };
            return response;
            // eslint-disable-next-line no-else-return
          } else {
            // console.log('ELSE NAMAN PALA@@');
            const [recordByID]: any = await client.$transaction([
              client.records.findFirst({
                where: {
                  patientInfo: {
                    userInfo: {
                      uuid: String(args?.data!.uuid),
                    },
                  },
                  // doctorID: session?.user?.id,
                  ...checkUser,
                  NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
                  isDeleted: 0,
                },
                orderBy: {
                  patientInfo: {
                    FNAME: 'asc',
                  },
                },

                include: {
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
                      userInfo: {
                        include: {
                          display_picture: {
                            orderBy: {
                              id: 'desc',
                            },
                          },
                        },
                      },
                      emr_patient: true,
                      medication: {
                        where: {
                          isDeleted: 0,
                          patientID: Number(patientInfo?.patientInfo.S_ID),
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      medicalhistory: {
                        where: {
                          isDeleted: 0,
                          patientID: Number(patientInfo?.patientInfo.S_ID),
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      smoking: {
                        where: {
                          isDeleted: 0,
                          patientID: Number(patientInfo?.patientInfo.S_ID),
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      allergy: {
                        where: {
                          isDeleted: 0,
                          patientID: Number(patientInfo?.patientInfo.S_ID),
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      family_history: {
                        where: {
                          isDeleted: 0,
                          patientID: Number(patientInfo?.patientInfo.S_ID),
                        },
                        orderBy: {
                          dateCreated: 'desc',
                        },
                        take: 5,
                      },
                      notes_vitals: {
                        where: {
                          isDeleted: '0',
                          isEMR: 0,
                          doctorID: session?.user?.id,
                          NOT: [{ report_id: null }],
                        },
                      },
                    },
                  },
                },
              }),
            ]);

            const _resultOne: any = recordByID;
            console.log(_resultOne, "HAYOPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
            const response: any = {
              Records_ByIDs: _resultOne,
            };
            return response;
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

export const QueryRecordBypatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allRecordsbyPatient', {
      type: RecordMedNoteTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        // console.log('1392');

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = [
              {
                R_DATE: args?.data!.orderDir,
              },
            ];

            break;

          case 'type':
            order = [
              {
                R_TYPE: args?.data!.orderDir,
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

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`records`',
          '`allRecordsbyPatient`'
        );

        // checkIfEMR return Object
        const checkIfEMR = (() => {
          if (args?.data!.uuid !== 'undefined') {
            console.log('NASA PATIENT KA1');
            // return {
            //   patientInfo: {
            //     userInfo: {
            //       uuid: String(args?.data!.uuid),
            //     },
            //   },
            // };
            return 2;
          }
          return 1;
        })();

        try {
          const myResult: any = checkIfEMR;
          let myData: any;

          if (myResult === 1) {
            myData = await client.emr_patient.findFirst({
              where: {
                id: Number(args?.data!.emrID),
              },
            });
          }
          console.log('here data: ', myData);

          let patientData: any;
          if (myResult === 2) {
            // console.log('Ok na');
            patientData = await client.user.findFirst({
              where: {
                uuid: String(args?.data!.uuid),
              },
              include: {
                patientInfo: true,
              },
            });
          }
          console.log('ang dta? ', patientData);

          // args session wherecondition orderconditon

          const { data, count }: any = await customizedFunction(
            args,
            myData,
            session,
            whereconditions,
            orderConditions,
            patientData
          );
          console.log(data,'datadatadatadatadatadata');

          return {
            Records_data: data,
            total_records: Number(count.length),
          };
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});

const customizedFunction = async (
  args: any,
  myData: any,
  session: any,
  whereconditions: any,
  orderConditions: any,
  patientData: any
) => {
  let records: any;
  let count: any;

  const { skip, take, userType, startDate, endDate, recordType }: any = args.data;

  const currentEndDate = new Date(endDate);

  // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
  // const formattedEndDateAsDate = new Date(formattedEndDate);

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  const setCurrentDay = (() => {
    if (!startDate && !endDate) return {};
    if (!startDate && endDate)
      return {
        R_DATE: {
          lte: currentEndDate,
        },
      };
    return {};
  })();

  const setRecType = (() => {
    if (recordType === '-1') return {};
    return {
      R_TYPE: {
        contains: recordType,
      },
    };
  })();
  console.log("pumasok ditoo!!!!!!")

  // console.log(myData, '_____');
  if (myData) {
    const isLinked = Number(myData?.link) === 1;
    if (isLinked) {
      console.log('Linked naman');
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,

          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            OR: [
              {
                patientID: Number(myData?.patientID),
              },
              {
                emrPatientID: Number(myData?.id),
              },
            ],
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
            // emr_patient: {
            //   id: Number(4756),
            //   link: 1,
            // },
            // ...checkIfEMR,

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,

            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
            // ...checkIfEMR,
            OR: [
              {
                patientID: myData?.patientID,
              },
              {
                emrPatientID: myData?.id,
              },
            ],
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            // isEMR: 0,
            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },

          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },

          ...orderConditions,
        }),

        // client.records.aggregate({
        //   where: {
        //     doctorID: session?.user?.id,
        //     ...whereconditions,
        //     isEMR: 0,
        //   },
        //   _count: {
        //     R_ID: true,
        //   },
        // }),
        // count Total
      ]);
      console.log('DATA KO @@@@@@@@: ', medNoteData);
      records = medNoteData;
      count = _count;
    } else {
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            // OR: [
            //   {
            //     patientID: Number(myData?.patientID),
            //   },
            //   {
            //     emrPatientID: Number(myData?.id),
            //   },
            // ],

            emrPatientID: myData?.id,
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
            // emr_patient: {
            //   id: Number(4756),
            //   link: 1,
            // },
            // ...checkIfEMR,
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
            // ...checkIfEMR,

            emrPatientID: myData?.id,
            // OR:[
            //   {
            //     patientID:myData?.patientID
            //   },
            //   {
            //     emrPatientID:myData?.id

            //   },
            // ],
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            // isEMR: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),

        // client.records.aggregate({
        //   where: {
        //     doctorID: session?.user?.id,
        //     ...whereconditions,
        //     isEMR: 0,
        //   },
        //   _count: {
        //     R_ID: true,
        //   },
        // }),
        // count Total
        
      ]);
    console.log(medNoteData, 'tskkkkkkkkkkkkkkkkk!!!!!!!!!' );

      records = medNoteData;
      count = _count;
    }
  } else {
    // for patient
    console.log('PATIENT TO');
    // console.log(skip, take);
    const isLinked: any = await client.emr_patient.findFirst({
      where: {
        patientID: patientData?.patientInfo?.S_ID,
      },
    });

    console.log('PATIENT TO link:', isLinked?.link);
    if (isLinked) {
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            OR: [
              {
                patientID: Number(isLinked?.patientID),
              },
              {
                emrPatientID: Number(isLinked?.id),
              },
            ],
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            OR: [
              {
                patientID: Number(isLinked?.patientID),
              },
              {
                emrPatientID: Number(isLinked?.id),
              },
            ],
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
      ]);
      records = medNoteData;
      count = _count;
      return {
        data: records,
        count,
      };

      // console.log('COUNT@@', _count);
      // eslint-disable-next-line no-else-return
    } else if (userType === 'patient') {
      // console.log(session?.user?.id);
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            patientID: session?.user?.id,
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,

            ...whereconditions,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            patientID: session?.user?.id,
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            // isEMR: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
      ]);
      console.log(medNoteData,'NASA BABA AKO BOSS')
      records = medNoteData;
      count = _count;
    } else {
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            // patientID: Number(isLinked?.patientID),
            patientInfo: {
              userInfo: {
                uuid: String(args?.data!.uuid),
              },
            },

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,

            ...setCurrentDay,

            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          orderBy: {
            R_DATE: 'desc',
          },
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
            patientID: Number(isLinked?.patientID),
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            // isEMR: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
      ]);
      console.log(medNoteData,'HATDOGGGGGGGG!')
      records = medNoteData;
      count = _count;
      return {
        data: records,
        count,
      };
    }
  }
  // let records:any;
  // let count:any;
  // console.log(records,'RECORDS')
  return {
    data: records,
    count,
  };
};

//  Doctor patient ----------------------------------------------------------------------------------------------------------------------------

export const QueryRecordBypatientNew = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allRecordsbyPatientNew', {
      type: RecordMedNoteTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = [
              {
                R_DATE: args?.data!.orderDir,
              },
            ];

            break;

          case 'type':
            order = [
              {
                R_TYPE: args?.data!.orderDir,
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



          default:
            order = {};
        }

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`records`',
          '`allRecordsbyPatientNew`'
        );

        try {

          const patientData = await client.user.findFirst({
            where: {
              OR:[
                {
                  uuid: String(args?.data!.uuid),
                },
                {
                  id:Number(session?.user?.id)
                }
              ]
            },
            include: {
              patientInfo: true,
            },
          });
          console.log(patientData,'patientDATA')


          const recordData = await client.records.findFirst({
            where: {
              patientID: Number(patientData?.patientInfo?.S_ID),
            },
            include: {
              patientInfo: true,
            },
          });
          console.log(recordData,'recordData')

          const recordDataClinics: any = await client.records.findMany({
            where: {
              patientID: Number(patientData?.patientInfo?.S_ID),
            },
            include: {
              patientInfo: true,
              clinicInfo: true
            },
            distinct: ['CLINIC'],
            orderBy: {
              clinicInfo: {
                clinic_name: 'asc'
              }
            }
          });
          // console.log(recordDataClinics,'recordDataClinics')


          // console.log(patientData,"boss?????????????????????????????????",)

          // console.log(recordDataClinics,"boss?????????????????????????????????",)

          // console.log('record dta? ', recordData);

          // args session wherecondition orderconditon

          const { data, count }: any = await customFuncPatient(
            args,
            // myData,
            recordData,
            session,
            whereconditions,
            orderConditions,
            patientData
          );
          console.log(data,'DATAAAAAAAAAAAA_________________________')
          console.log(count,'count_________________________')

          return {
            Records_data: data,
            total_records: Number(count.length),
            clinic: recordDataClinics.map((item) => item?.clinicInfo)

          };
        } catch (error) {
          console.log(error,'ERRORRRRRRRRR!')
          return new GraphQLError(error);
        }
      },
    });
  },
});

const customFuncPatient = async (
  args: any,
  // myData: any,
  recordData: any,
  session: any,
  whereconditions: any,
  orderConditions: any,
  patientData: any
) => {
  let records: any;
  let count: any;

  const { skip, take, userType, startDate, endDate, recordType }: any = args.data;

  const currentEndDate = new Date(endDate);

  // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
  // const formattedEndDateAsDate = new Date(formattedEndDate);

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  const setCurrentDay = (() => {
    if (!startDate && !endDate) return {};
    if (!startDate && endDate)
      return {
        R_DATE: {
          lte: currentEndDate,
        },
      };
    return {};
  })();

  const setRecType = (() => {
    if (recordType === '-1') return {};
    return {
      R_TYPE: {
        equals: recordType,
      },
    };
  })();



  if (patientData) {
    const isLinked = recordData.emrPatientID !== null;
    if (isLinked) {
      console.log('Linked naman');
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,

          where: {
            ...checkUser,
            OR: [
              {
                patientID: Number(patientData?.patientInfo?.S_ID),
              },
              {
                emrPatientID: Number(recordData.emrPatientID),
              },
            ],

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }, {R_TYPE: '0'}],
            isDeleted: 0,

            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            ...checkUser,
            ...whereconditions,
            OR: [
              {
                patientID: Number(patientData?.patientInfo?.S_ID),
              },
              {
                emrPatientID: Number(recordData.emrPatientID),
              },
            ],
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' },{ R_TYPE: '0' }],
            isDeleted: 0,
            // isEMR: 0,
            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },

          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },

          ...orderConditions,
        }),
      ]);
      // console.log('DATA KO @@@@@@@@: ', medNoteData);
      records = medNoteData;
      count = _count;
    } else {
      console.log(patientData?.patientInfo?.S_ID, 'YAYYYYYYYYYYYYYYYYYYYYYYYYYY');


      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          where: {
            ...checkUser,
            patientID: Number(patientData?.patientInfo?.S_ID),

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }, { R_TYPE: '0' }],
            isDeleted: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            ...checkUser,

            patientID: Number(patientData?.patientInfo?.S_ID),

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }, { R_TYPE: '0' }],
            isDeleted: 0,

            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
      ]);


      records = medNoteData;
      count = _count;
    }
  }
  // let newData = records?.map(async(item)=>{
  //   const esig = await client.esig_dp.findFirst({
  //     where:{
  //       doctorID:Number(item?.doctorID)
  //     },
  //     orderBy:{
  //       uploaded:'desc'
  //     },
  //   });
  //   return {
  //     ...item,
  //     esig:{
  //       filename:esig?.filename
  //     }
  //   }
  // })
  // newData = await Promise.all(newData);
  

  return {
    data: records,
    count,
  };
};

//  ----------------------------------------------------------------------------------------------------------------------------

//  Doctor EMR patient ----------------------------------------------------------------------------------------------------------------------------

export const QueryRecordByEMRNew = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allRecordsbyEMRNew', {
      type: RecordMedNoteTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        // console.log('1392');

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = [
              {
                R_DATE: args?.data!.orderDir,
              },
            ];

            break;

          case 'type':
            order = [
              {
                R_TYPE: args?.data!.orderDir,
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

        orderConditions = {
          orderBy: order,
        };

        const whereconditions = filters(args);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`records`',
          '`allRecordsbyEMRNew`'
        );

        // checkIfEMR return Object
        // const checkIfEMR = (() => {
        //   if (args?.data!.uuid !== 'undefined') {
        //     console.log('NASA PATIENT KA1');
        //     // return {
        //     //   patientInfo: {
        //     //     userInfo: {
        //     //       uuid: String(args?.data!.uuid),
        //     //     },
        //     //   },
        //     // };
        //     return 2;
        //   }
        //   return 1;
        // })();

        try {
          // const myResult: any = checkIfEMR;
          // let myData: any;

          // if (myResult === 1) {
          //   myData = await client.emr_patient.findFirst({
          //     where: {
          //       id: Number(args?.data!.emrID),
          //     },
          //   });
          // }
          // console.log('here data: ', myData);

          // console.log('Ok na');
          const emrData = await client.emr_patient.findFirst({
            where: {
              id: Number(args?.data!.emrID),
            },
          });
          // console.log(emrData, 'emrDataHUH??????');
          // const recordData = await client.records.findFirst({
          //   where: {
          //     patientID: Number(patientData?.patientInfo?.S_ID),
          //   },
          //   include: {
          //     patientInfo: true,
          //   },
          // });

          // console.log('ang dta? ', patientData);
          // console.log('record dta? ', recordData);

          // args session wherecondition orderconditon

          const { data, count }: any = await customFuncEMR(
            args,
            // myData,
            emrData,
            session,
            whereconditions,
            orderConditions
            // patientData
          );

          return {
            Records_data: data,
            total_records: Number(count.length),
          };
        } catch (error) {
          console.log(error,'error')
          return new GraphQLError(error);
        }
      },
    });
  },
});

const customFuncEMR = async (
  args: any,
  // myData: any,
  emrData: any,
  session: any,
  whereconditions: any,
  orderConditions: any
  // patientData: any
) => {
  let records: any;
  let count: any;

  const { skip, take, userType, startDate, endDate, recordType }: any = args.data;

  const currentEndDate = new Date(endDate);

  // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
  // const formattedEndDateAsDate = new Date(formattedEndDate);

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  const setCurrentDay = (() => {
    if (!startDate && !endDate) return {};
    if (!startDate && endDate)
      return {
        R_DATE: {
          lte: currentEndDate,
        },
      };
    return {};
  })();

  const setRecType = (() => {
    if (recordType === '-1') return {};
    return {
      R_TYPE: {
        contains: recordType,
      },
    };
  })();


  if (emrData) {
    const isLinked = emrData.link !== 0;
    if (isLinked) {
      console.log('Linked naman');
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,

          where: {
            ...checkUser,
            OR: [
              {
                patientID: Number(emrData?.patientID),
              },
              {
                emrPatientID: Number(emrData.id),
              },
            ],

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,

            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            ...checkUser,

            OR: [
              {
                patientID: Number(emrData?.patientID),
              },
              {
                emrPatientID: Number(emrData.id),
              },
            ],
            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            // isEMR: 0,
            ...whereconditions,
            ...setCurrentDay,
            ...setRecType,
          },

          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },

          ...orderConditions,
        }),
      ]);
      // console.log('DATA KO @@@@@@@@: ', medNoteData);
      records = medNoteData;
      count = _count;
    } else {
      const [medNoteData, _count]: any = await client.$transaction([
        client.records.findMany({
          skip,
          take,
          where: {
            ...checkUser,
            emrPatientID: Number(emrData.id),

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,
            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
            notes_text: true,
          },
          ...orderConditions,
        }),
        client.records.findMany({
          where: {
            ...checkUser,

            emrPatientID: Number(emrData.id),

            NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
            isDeleted: 0,

            ...setCurrentDay,
            ...whereconditions,
            ...setRecType,
          },
          include: {
            emr_patient: true,
            clinicInfo: {
              include: {
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
            patientInfo: true,
            doctorInfo: true,
          },
          ...orderConditions,
        }),
      ]);
      console.log(medNoteData, 'dito pala tnginaa!');

      records = medNoteData;
      count = _count;
    }
  }
  return {
    data: records,
    count,
  };
};

//  ----------------------------------------------------------------------------------------------------------------------------

// patient user

export const AllRecordUserInputType = inputObjectType({
  name: 'AllRecordUserInputType',
  definition(t) {
    t.nullable.int('patientID');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
    t.nullable.dateTime('startDate');
    t.nullable.dateTime('endDate');
  },
});

export const QueryRecordBypatientUser = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('allRecordsbyPatientUser', {
      type: RecordMedNoteTransactionObject,
      args: { data: AllRecordUserInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = {
              R_DATE: args?.data!.orderDir
            }

            break;

          case 'doctor':
            order = {
              doctorInfo: {
                EMP_FULLNAME: args?.data!.orderDir,
              },
            }

            break;

          case 'hospital':
            order = {
              clinicInfo: {
                clinic_name: args?.data!.orderDir,
              },
            }

            break;

        
        }

        orderConditions = {
          orderBy: order,
        };

        console.log(orderConditions,'ORDERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')

        const whereconditions = filtersPatient(args);

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`records`',
          '`allRecordsbyPatientUser`'
        );


        try {
          const [medNoteData, _count, clinicData]: any = await client.$transaction([
            client.records.findMany({
              skip,
              take,
              orderBy: {
                R_DATE: 'desc',
              },
              where: {
                patientID: Number(session?.user?.s_id),
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '0' },{R_TYPE:'3'}],
                isDeleted: 0,
                ...whereconditions,
              },
              include: {
                emr_patient: true,
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
                patientInfo: true,
                doctorInfo: true,
                notes_text: true,
              },
              ...orderConditions,
              
            }),
            client.records.findMany({
              orderBy: {
                R_DATE: 'desc',
              },
              where: {
                // where: {
                patientID: Number(session?.user?.s_id),
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
                ...whereconditions,
                // },
                // patientID: Number(session?.user?.s_id),
                // // patientInfo: {
                // //   userInfo: {
                // //     uuid: String(args?.data!.uuid),
                // //   },
                // // },

                // NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                // isDeleted: 0,
                // isEMR: 0,
                // ...whereconditions,
              },
              include: {
                emr_patient: true,
                clinicInfo: {
                  include: {
                    clinicDPInfo: {
                      orderBy: {
                        id: 'desc',
                      },
                    },
                  },
                },
                patientInfo: true,
                doctorInfo: true,
                notes_text: true,
              },
              // ...orderConditions,
            }),

            client.records.findMany({
              where:{
                patientID: Number(session?.user?.s_id),
                NOT: [{ clinicInfo: null }, { patientInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
              },
              include:{
                clinicInfo:true
              },
              orderBy:{
                clinicInfo:{
                  clinic_name:'asc'
                }
              },
              distinct:['CLINIC']
            })

          ]);


          const _result: any = medNoteData;
          const _total = _count.length;

          const response: any = {
            Records_data: _result,
            total_records: Number(_total),
            clinic:clinicData?.map((item)=>item?.clinicInfo)
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

    const clinicIds: any = args?.data!.clinicIds;
    if (clinicIds?.length) {
      whereConClinic = {
        clinicInfo: {
          id: {
            in: clinicIds,
          },
        },
      };
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

  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
    };
  }

  if (args?.data!.startDate && !args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        gte: args?.data!.startDate,
      },
    };
  }

  if (!args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      R_DATE: {
        lte: args?.data!.endDate,
      },
    }
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



export const QueryPatientData = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryPatientData', {
      type: RecordTransactionObject,
      args: { data: AllRecordInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`records`', '`QueryPatientData`');

        try {
          const patientInfo: any = await client.user.findFirst({
            where: {
              uuid: String(args?.data!.uuid),
            },
            include: {
              patientInfo: true,
            },
          });
          // console.log(patientInfo, 'PATIENT INFO@@#@@@');

          // console.log('ELSE NAMAN PALA@@');
          const [recordByID]: any = await client.$transaction([
            client.records.findFirst({
              where: {
                patientInfo: {
                  userInfo: {
                    uuid: String(args?.data!.uuid),
                  },
                },
                // doctorID: session?.user?.id,
                NOT: [{ clinicInfo: null }, { R_TYPE: '3' }],
                isDeleted: 0,
              },
              orderBy: {
                patientInfo: {
                  FNAME: 'asc',
                },
              },

              include: {
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
                    userInfo: {
                      include: {
                        display_picture: {
                          orderBy: {
                            id: 'desc',
                          },
                        },
                      },
                    },
                    emr_patient: true,
                    medication: {
                      where: {
                        isDeleted: 0,
                        patientID: Number(patientInfo?.patientInfo.S_ID),
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    medicalhistory: {
                      where: {
                        isDeleted: 0,
                        patientID: Number(patientInfo?.patientInfo.S_ID),
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    smoking: {
                      where: {
                        isDeleted: 0,
                        patientID: Number(patientInfo?.patientInfo.S_ID),
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    allergy: {
                      where: {
                        isDeleted: 0,
                        patientID: Number(patientInfo?.patientInfo.S_ID),
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    family_history: {
                      where: {
                        isDeleted: 0,
                        patientID: Number(patientInfo?.patientInfo.S_ID),
                      },
                      orderBy: {
                        dateCreated: 'desc',
                      },
                      take: 5,
                    },
                    notes_vitals: {
                      where: {
                        isDeleted: '0',
                        isEMR: 0,
                        doctorID: session?.user?.id,
                        NOT: [{ report_id: null }],
                      },
                    },
                  },
                },
              },
            }),
          ]);

          const _resultOne: any = recordByID;

          const response: any = {
            Records_ByIDs: _resultOne,
          };
          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
