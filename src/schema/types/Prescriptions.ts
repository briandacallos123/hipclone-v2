/* eslint-disable no-lone-blocks */
/* eslint-disable default-case */
import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { FieldClinics } from './DoctorClinics';
import { Clinics } from './ClinicSched';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { isToday } from '@/utils/format-time';

const client = new PrismaClient();

export const prescriptions = objectType({
  name: 'prescriptions',
  definition(t) {
    t.id('ID');
    t.date('DATE');
    t.string('PATIENTEMR');
    t.int('isFavorite');
    t.int('patientID');
    t.string('FollowUp');
    t.string('REMARKS');
    t.string('DOCTOR');
    t.string('REMARKS');
    t.string('PR_ID');
    t.string('presCode');
    t.int('doctorID');

    t.nullable.field('doctorInfo', {
      type: DoctorObject,
    });
    t.nullable.field('patient', {
      type: patient,
    });
    t.nullable.field('clinicInfo', {
      type: ClinicObject,
    });
    t.nullable.list.field('prescriptions_child', {
      type: prescriptions_child,
    });
    t.nullable.field('prescription_template',{
      type:prTemplate,
      async resolve(t){
        const data = await client.prescription_template.findFirst({
          where:{
            id:Number(t?.template_id)
          }
        });
        return data;
      }
    })
  },
});

const prTemplate = objectType({
  name:"prTemplate",
  definition(t) {
      t.string('name');
      t.int('created_by');

  },
})

const Prescription_List = objectType({
  name: 'Prescription_List',
  definition(t) {
    t.nullable.list.field('Prescription_data', {
      type: prescriptions,
    });
    t.int('totalRecords');
    t.nullable.list.field('clinicList', {
      type: FieldClinics,
    })
  },
});
const Prescription_Child_Type = objectType({
  name: 'Prescription_Child_Type',
  definition(t) {
    t.nullable.field('Prescription_data', {
      type: prescriptions,
    });
  },
});
const Prescription_Mutation_Type = objectType({
  name: 'Prescription_Mutation_Type',
  definition(t) {
    t.nullable.id('ID');
    t.nullable.string('DATE');
    t.nullable.string('PATIENTEMR');
    t.nullable.int('isFavorite');
    t.nullable.string('FollowUp');
    t.nullable.string('REMARKS');
    t.nullable.string('DOCTOR');
    t.nullable.string('REMARKS');
    t.nullable.int('doctorID');
    t.nullable.int('CLINIC');
    t.nullable.int('patientID');
    t.nullable.string('tempId');

    // t.string('fname');
    // t.string('mname');
    // t.string('lname:');
    // t.int('gender');
    // t.string('contact_no');

    t.nullable.field('patient', {
      type: patientMutation,
    });
    t.nullable.list.field('prescriptions_child', {
      type: prescriptions_child,
    });
    t.nullable.field('doctorInfo', {
      type: DoctorObject,
    });
    t.nullable.string('message');
  },
});

export const prescriptions_child = objectType({
  name: 'prescriptions_child',
  definition(t) {
    t.string('MEDICINE');
    t.string('MED_BRAND');
    t.string('DOSE');
    t.string('FORM');
    t.string('QUANTITY');
    t.string('FREQUENCY');
    t.string('DURATION');
    t.int('is_favorite')
    t.int('PR_ID');

    // t.nullable.list.field('Prescription_data', {
    //   type: prescriptions,
    // });
    // t.int('totalRecords');
  },
});

const Prescription_Single = objectType({
  name: 'Prescription_Single',
  definition(t) {
    t.nonNull.field('Prescription_data', {
      type: prescriptions,
    });
  },
});

export const AllPrescriptionInput = inputObjectType({
  name: 'AllPrescriptionInput',
  definition(t) {
    // t.nullable.int('sex');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('startDate');
    t.nullable.string('endDate');
    t.nullable.string('uuid');
    t.nullable.int('isEmr');
    // t.nullable.int("isLinked")
    t.list.field('clinicID', { type: 'Int' });
    t.nullable.int('searchKeyword');
  },
});
export const Prescription_Single_Input = inputObjectType({
  name: 'Prescription_Single_Input',
  definition(t) {
    // t.nullable.int('sex');
    t.nonNull.int('id');
  },
});

const DoctorObject = objectType({
  name: 'DoctorObject',
  definition(t) {
    t.int('EMP_ID');
    t.string('EMP_FULLNAME');
    t.string('EMP_FNAME');
    t.string('EMP_MNAME');
    t.string('EMP_TITLE');
    t.string('LIC_NUMBER');
    t.string('PTR_LIC');
    t.string('S2_LIC');
    t.string('EMP_EMAIL');
    t.nullable.field('SpecializationInfo', {
      type: Specialization,
    });
    t.list.field('DoctorClinics', {
      type: DoctorClinicsType,
      async resolve(parent, _args, _ctx) {
        const clinicsData = await client.clinic.findMany({
          where: {
            doctorID: Number(parent.EMP_ID),
            isDeleted: 0,
          },
        });
        return clinicsData;
      },
    });
    t.list.field('esig_dp', {
      type: pr_history_esig_dp_picture,
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
    t.nullable.list.field('user', {
      type: pr_history_userinfo,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.user.findMany({
          where: {
            email: String(root?.EMP_EMAIL),
          },
        });

        return result;
      },
    });
  },
});

const pr_history_userinfo = objectType({
  name: 'pr_history_userinfo',
  definition(t) {
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: pr_history_patient_display_picture,
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
const pr_history_esig_dp_picture = objectType({
  name: 'pr_history_esig_dp_picture',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const pr_history_patient_display_picture = objectType({
  name: 'pr_history_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

export const DoctorClinicsType = objectType({
  name: 'DoctorClinicsType',
  definition(t) {
    t.string('clinic_name');
    t.string('location');
    t.string('number');
  },
});

const Specialization = objectType({
  name: 'Specialization',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});
const patient = objectType({
  name: 'patient',
  definition(t) {
    t.int('ID');
    t.int('patientID');
    t.int('isEMR');
    t.int('IDNO');
    t.string('FULLNAME');
    t.string('FNAME');
    t.string('LNAME');
    t.string('MNAME');
    t.int('AGE');
    t.int('SEX');
    t.string('CONTACT_NO');
    t.string('HOME_ADD');
    t.string('EMAIL');
    t.list.field('userInfo', {
      type: prescription_user_object,
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
const prescription_user_object = objectType({
  name: 'prescription_user_object',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('uuid');
    t.nullable.list.field('display_picture', {
      type: prescription_patient_display_picture,
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
const prescription_patient_display_picture = objectType({
  name: 'prescription_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

const patientMutation = objectType({
  name: 'patientMutation',
  definition(t) {
    t.int('ID');
    t.int('patientID');
    t.int('isEMR');
    t.int('IDNO');
    t.string('FULLNAME');
    t.string('FNAME');
    t.string('LNAME');
    t.string('MNAME');
    t.int('AGE');
    t.int('SEX');
    t.string('CONTACT_NO');
    t.string('HOME_ADD');
    t.string('fname');
    t.string('mname');
    t.string('lname');
    t.string('contact_no');
    t.int('gender');
  },
});

export const ClinicObject = objectType({
  name: 'ClinicObject',
  definition(t) {
    t.id('id');
    t.string('location');
    t.string('Province');
    t.string('clinic_name');
    t.int('isDeleted');
    t.string('number');
    t.list.field('clinicDPInfo', {
      type: patient_lab_clinicDPInfos,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.clinicdp.findMany({
          where: {
            clinic: Number(root?.id),
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

const patient_lab_clinicDPInfos = objectType({
  name: 'patient_lab_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

export const SummaryType = objectType({
  name: 'SummaryType',
  definition(t) {
    t.int('totalRecords');
  },
});

// prescriptions_child;

export const QueryRepeatPrescription = extendType({
  type: 'Query',
  definition(t) {
    t.field('QueryRepeatPrescription', {
      type: prescriptions,
      args: { data: Prescription_Single_Input! },
      async resolve(_root, args, _ctx) {
        const data: any | typeof args.data = args.data;
        const { id }: typeof data = data;

        try {
          const data = await client.prescriptions.findFirst({
            where: {
              ID: id,
            },
            include: {
              prescriptions_child: true,
            },
          });

          const res: any = {
            ...data,
            prescriptions_child: data?.prescriptions_child[0],
          };
          return res;
        } catch (error) {
          console.log(error);
          /*  throw new Error('Request cancelled.') */
        }
      },
    });
  },
});
export const QuerySinglePrescription = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryPrescription', {
      type: Prescription_Single,
      args: { data: Prescription_Single_Input! },
      async resolve(_root, args, _ctx) {
        const data: any | typeof args.data = args.data;
        const { id }: typeof data = data;

        try {
          const data = await client.prescriptions.findFirst({
            where: {
              ID: id,
            },
            include: {
              doctorInfo: true,
              clinicInfo: true,
              patient: true,
            },
          });

          const res: any = {
            Prescription_data: data,
          };
          return res;
        } catch (error) {
          console.log(error);
          /*  throw new Error('Request cancelled.') */
        }
      },
    });
  },
});

const PrescriptionLinked = async (
  find_emr: any,
  take: any,
  skip: any,
  orderConditions: any,
  whereconditions: any,
  session: any,
  args: any,
  isEmrData: any,
  patientId: any,
  filter: any,
  startDate: any,
  endDate: any
) => {
  let result: any = [];
  let _countData: any = null;
  const currentEndDate = new Date(endDate);

  // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
  // const formattedEndDateAsDate = new Date(formattedEndDate);
  // console.log(filter, 'args');

  const doctorD = await client.employees.findFirst({
    where:{
      EMP_EMAIL:session?.user?.email
    }
  })

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: doctorD?.EMP_ID,
    };
  })();

  // const setCurrentDay = (() => {
  //   if (!startDate && !endDate) return {};
  //   if (!startDate && endDate)
  //     return {
  //       DATE: {
  //         lte: currentEndDate,
  //       },
  //     };
  //   return {};
  // })();

  if (isEmrData && Number(args?.data!.isEmr === 1)) {
    if (isEmrData?.link === 1) {
      const [prescriptions, _count]: any = await client.$transaction([
        client.prescriptions.findMany({
          take,
          skip,
          ...orderConditions,
          where: {
            ...whereconditions,
            ...filter,
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            isDeleted: 0,
            OR: [
              {
                emrPatientID: Number(isEmrData?.id),
              },
              {
                patientID: Number(isEmrData?.patientID),
              },
            ],
            // ...setCurrentDay,
          },
          include: {
            doctorInfo: {
              include: {
                SpecializationInfo: true,
              },
            },
            clinicInfo: true,
            prescriptions_child: true,
            patient: true,
          },
        }),
        client.prescriptions.count({
          where: {
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            ...whereconditions,
            // ...setCurrentDay,
            isDeleted: 0,

            OR: [
              {
                emrPatientID: Number(isEmrData?.id),
              },
              {
                patientID: Number(isEmrData?.patientID),
              },
            ],
          },
        }),
      ]);

      // console.log('_count', _count);
      result = prescriptions;
      _countData = Number(_count);
    } else {
      const [prescriptions, _count]: any = await client.$transaction([
        client.prescriptions.findMany({
          take,
          skip,
          ...orderConditions,
          where: {
            isDeleted: 0,

            ...whereconditions,
            // ...setCurrentDay,
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            emrPatientID: Number(isEmrData?.id),
          },
          include: {
            doctorInfo: {
              include: {
                SpecializationInfo: true,
              },
            },
            clinicInfo: true,
            prescriptions_child: true,
            patient: true,
          },
        }),
        //
        client.prescriptions.count({
          where: {
            isDeleted: 0,

            ...whereconditions,
            // ...setCurrentDay,
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            emrPatientID: Number(isEmrData?.id),
          },
        }),
      ]);
      // console.log(prescriptions, 'YAYAYA@@@');

      const newPatient = await client.emr_patient.findFirst({
        where: {
          id: Number(args?.data?.uuid),
        },
      });

      const customPatient = {
        FNAME: newPatient?.fname,
        LNAME: newPatient?.lname,
        MNAME: newPatient?.mname,
        patientID: newPatient?.patientID,
        CONTACT_NO: newPatient?.contact_no,
        HOME_ADD: newPatient?.address,
        SEX: newPatient?.gender,
        isEMR: newPatient?.isEMR,
      };

      // console.log('newPatient', customPatient);
      result = prescriptions?.map((i) => {
        return { ...i, patient: customPatient };
      });
      _countData = Number(_count);
    }
    // emr view
  } else {
    if (find_emr) {
      // console.log("")
      const [prescriptions, _count]: any = await client.$transaction([
        client.prescriptions.findMany({
          take,
          skip,
          ...orderConditions,
          where: {
            ...whereconditions,
            // ...setCurrentDay,
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            isDeleted: 0,

            OR: [
              {
                emrPatientID: Number(find_emr?.id),
              },
              {
                patientID: Number(find_emr?.patientID),
              },
            ],

            // patientInfo: {
            //   userInfo: {
            //     uuid: String(args?.data!.uuid),
            //   },
            // },
          },
          include: {
            doctorInfo: {
              include: {
                SpecializationInfo: true,
              },
            },

            clinicInfo: true,
            prescriptions_child: true,
            patient: true,
          },
        }),
        client.prescriptions.count({
          where: {
            // doctorID: Number(session?.user?.id),
            ...checkUser,
            isDeleted: 0,
            // ...setCurrentDay,
            OR: [
              {
                emrPatientID: Number(find_emr?.id),
              },
              {
                patientID: Number(find_emr?.patientID),
              },
            ],
          },
        }),
      ]);

      // console.log('_count', _count);
      result = prescriptions;
      _countData = Number(_count);
    } else {
      // hindi naka link na patient to any emr records.
      // console.log(patientId, 'HEHEHE@@@@@@@@@');
      const [prescriptions, _count]: any = await client.$transaction([
        client.prescriptions.findMany({
          take,
          skip,
          ...orderConditions,
          where: {
            isDeleted: 0,

            ...whereconditions,
            // ...setCurrentDay,
            // doctorID: session?.user?.id,
            ...checkUser,

            patientID: Number(patientId?.patientInfo?.S_ID),
          },
          include: {
            doctorInfo: {
              include: {
                SpecializationInfo: true,
              },
            },
            clinicInfo: true,
            prescriptions_child: true,
            patient: true,
          },
        }),
        client.prescriptions.count({
          where: {
            isDeleted: 0,

            ...whereconditions,
            // ...setCurrentDay,
            // doctorID: session?.user?.id,
            ...checkUser,

            patientID: Number(patientId?.patientInfo?.S_ID),
          },
        }),
      ]);

      result = prescriptions;
      _countData = _count;
    }
  }
  // data for patient

  // let result: any = [];
  // let _countData: any = null;
  return {
    prescriptions: result,
    _count: Number(_countData),
  };
};

export const QueryAllPrescription = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryAllPrescription', {
      type: Prescription_List,
      args: { data: AllPrescriptionInput! },
      async resolve(_root, args, _ctx) {
        const data: any | typeof args.data = args.data;
        const { take, skip, orderBy, orderDir, uuid }: typeof data = data;

        const whereconditions = filters(args);
        // console.log(whereconditions, 'WHEREEEEEEEEEEEEEEEEEEEEEE????')
        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            {
              order = [{ DATE: args?.data!.orderDir }];
            }
            break;
          case 'prescriptionNumber':
            {
              order = [{ ID: args?.data!.orderDir }];
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

          default:
            order = {};
        }
        const orderConditions = {
          orderBy: order,
        };

        const filter = {};

        const startDate: any = args?.data!.startDate;
        const endDate: any = args?.data!.endDate;

        // if (startDate && endDate) {
        //   filter.AND = [
        //     {
        //       DATE: {
        //         gte: startDate,
        //       },
        //     },
        //     {
        //       DATE: {
        //         lte: endDate,
        //       },
        //     },
        //   ];
        // } else if (startDate !== null) {
        //   // Only start date provided
        //   filter.DATE = {
        //     gte: startDate,
        //   };
        // } else if (endDate !== null) {
        //   // Only end date provided
        //   filter.DATE = {
        //     lte: endDate,
        //   };
        // }

        // const currentDate = new Date(args?.data!.startDate);
        // const currentEndDate = new Date(args?.data!.endDate);

        // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
        // const formattedEndDateAsDate = new Date(formattedEndDate);

        // const formattedDate = currentDate.toISOString().slice(0, 10);
        // const formattedDateAsDate = new Date(formattedDate);

        // const setCurrentDay: any = (() => {
        //   if (!args?.data!.startDate && args?.data!.endDate)
        //     return {
        //       DATE: {
        //         lte: formattedEndDateAsDate,
        //       },
        //     };
        //   return {
        //     DATE: {
        //       lte: formattedDateAsDate,
        //     },
        //   };
        // })();

        const { session } = _ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`prescriptions`',
          'QueryAllPrescription'
        );

        // throw new Error('Error!');
        //   take, skip, orderConditions, whereconditions; session

        try {
          let find_emr: any = null;
          // is emr reffering kapag gineget natin yung prescription through emr
          // kapag linked, isEmr = data else null
          let isEmrData: any = null;
          let patientId: any = null;

          // pag patient
          if (Number(args?.data?.isEmr) === 2) {
            // console.log('DI KA DAPAT DITO');
            patientId = await client.user.findFirst({
              where: {
                uuid: String(uuid),
              },
              include: {
                patientInfo: {
                  select: {
                    S_ID: true,
                  },
                },
              },
            });

            find_emr = await client.emr_patient.findFirst({
              where: {
                patientID: Number(patientId?.patientInfo?.S_ID),
              },
            });
          } else {
            // for emr
            // pag galign kay emr, need ko lang malaman from records
            // kung linked sya, kapa linked, get ko yung patientID,
            // hanapin sa prescription, para ma merge yung data
            // ex: where:{patientID: payload, || emrPatientID:payload}
            isEmrData = await client.emr_patient.findFirst({
              where: {
                id: Number(args?.data!.uuid),
              },
            });
          }

          // console.log(isEmrData,"isEmrDataisEmrData")
          // const dateF = { ...setCurrentDay };
          const { prescriptions, _count }: any = await PrescriptionLinked(
            find_emr,
            take,
            skip,
            orderConditions,
            whereconditions,
            session,
            args,
            isEmrData,
            patientId,
            filter,
            startDate,
            endDate
          );

          const response: any = {
            Prescription_data: prescriptions,
            totalRecords: Number(_count),
          };

          return response;
        } catch (error) {
          // console.log('********************');
          console.log(error);
          /*  throw new Error('Request cancelled.') */
        }
      },
    });
  },
});

// patient user --------------------------------------------------------------

export const AllPrescriptionInputUser = inputObjectType({
  name: 'AllPrescriptionInputUser',
  definition(t) {
    // t.nullable.int('sex');
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('startDate');
    t.nullable.string('endDate');
    t.list.field('clinicID', { type: 'Int' });
    t.nullable.string('searchKeyword');
  },
});

export const QueryAllPrescriptionUser = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryAllPrescriptionUser', {
      type: Prescription_List,
      args: { data: AllPrescriptionInputUser! },
      async resolve(_root, args, _ctx) {
        const data: any | typeof args.data = args.data;
        const { take, skip, orderBy, orderDir, uuid, startDate, endDate, searchKeyword }: typeof data = data;
        const currentEndDate = new Date(endDate);
        const whereconditions = filters(args);

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            {
              order = [{ DATE: args?.data!.orderDir }];
            }
            break;
          case 'prescriptionNumber':
            {
              order = [{ ID: args?.data!.orderDir }];
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

          default:
            order = {};
        }
        const orderConditions = {
          orderBy: order,
        };

        const { session } = _ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`prescriptions`',
          'QueryAllPrescriptionUser'
        );


        // throw new Error('Error!');
        //   take, skip, orderConditions, whereconditions; session
        // const isSearch = (() => {
        //   let searchVal: any;
        //   const containsNumber = /\d/.test(searchKeyword);


        //   if (!containsNumber) {
        //     searchVal = {
        //       OR: [
        //         {
        //           clinicInfo: {
        //             clinic_name: {
        //               contains: searchKeyword
        //             }
        //           }
        //         },
        //         {
        //           doctorInfo: {
        //             EMP_FULLNAME: {
        //               contains: searchKeyword
        //             }
        //           }
        //         },
        //       ]
        //     }
        //   }


        //   return searchVal;
        // })()

        // const nameSearch = searchKeyword && isSearch

        console.log(whereconditions, 'SEARCHHHHHHHHHHHHHHHHHHHHH')

        try {
          const [prescriptionsData, _count, clinic]: any = await client.$transaction([
            client.prescriptions.findMany({
              take,
              skip,
              ...orderConditions,
              where: {
                ...whereconditions,
                patientID: session?.user?.s_id,
                NOT: [{ clinicInfo: null }],
                isDeleted: 0,
                // ...nameSearch
              },
              include: {
                doctorInfo: {
                  include: {
                    SpecializationInfo: true,
                  },
                },
                clinicInfo: true,
                prescriptions_child: true,
                patient: true,
              },
            }),
            client.prescriptions.count({
              where: {
                patientID: session?.user?.s_id,
                ...whereconditions,
                NOT: [{ clinicInfo: null }],
                isDeleted: 0,
              },
            }),
            client.prescriptions.findMany({
              where: {
                patientID: session?.user?.s_id,
                NOT: [{ clinicInfo: null }],
                isDeleted: 0,
              },
              distinct: ['CLINIC'],
              include: {
                clinicInfo: true
              },
              orderBy: {
                clinicInfo: {
                  clinic_name: 'asc'
                }
              }
            })
          ]);

          // console.log('_count', _count);
          const result = prescriptionsData;
          const _countData = Number(_count);

          const response: any = {
            Prescription_data: result,
            totalRecords: Number(_countData),
            clinicList: clinic?.map((item) => item?.clinicInfo)
          };

          return response;
        } catch (error) {
          console.log('********************');
          console.log(error);
          /*  throw new Error('Request cancelled.') */
        }
      },
    });
  },
});

// ---------------------------------------------------------------------------

const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};

  let whereConClinic: any = {};

  let whereDate: any = {};

  if (args?.data!.searchKeyword) {
    const containsNumber = /\d/.test(args?.data!.searchKeyword);


    if (!containsNumber) {
      whereConSearch = {
        OR: [
          {
            clinicInfo: {
              clinic_name: {
                contains: args?.data!.searchKeyword
              }
            }
          },
          {
            doctorInfo: {
              EMP_FULLNAME: {
                contains: args?.data!.searchKeyword
              }
            }
          },
        ]
      }
    } else {
      whereConSearch = {
        ID: Number(args?.data!.searchKeyword),
      };
    }

  }

  if (args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      AND: [
        {
          DATE: {
            gte: args?.data!.startDate,
          },
        },
        {
          DATE: {
            lte: args?.data!.endDate, // "lte" stands for "less than or equal to"
          },
        },
      ],
    };
  }

  if (args?.data!.startDate && !args?.data!.endDate) {
    whereDate = {
      DATE: {
        gte: args?.data!.startDate,
      },
    };
  }
  if (!args?.data!.startDate && args?.data!.endDate) {
    whereDate = {
      DATE: {
        lte: args?.data!.endDate,
      },
    }
  }
  const clinicIDs: any = args?.data!.clinicID;
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
      ...whereConClinic,
      ...whereConSearch,
      ...whereDate,
    },
  };
  return multicondition;
};

export const PrescriptionUpsertType = inputObjectType({
  name: 'PrescriptionUpsertType',
  definition(t) {
    t.nullable.string('PATIENT');
    t.nullable.string('tempId');
    t.nullable.string('PATIENTEMR');
    t.nullable.string('REMARKS');
    t.nullable.int('REPORT_ID');
    t.nullable.int('doctorID');
    t.nonNull.int('CLINIC');
    t.nullable.string('DOCTOR');
    t.nullable.string('uuid');
    t.nullable.int('patientID');
    t.nullable.boolean('isTemplate');
    t.nullable.string('templateName');

    t.nullable.int('emrId');
    t.int('isEmr');
    // t.tree('items');
    t.list.field('Prescription_Child_Inputs', {
      type: Prescription_Child_Inputs,
    });
  },
});
const Prescription_Child_Inputs = inputObjectType({
  name: 'Prescription_Child_Inputs',
  definition(t) {
    t.nullable.string('MEDICINE');
    t.nullable.string('MED_BRAND');
    t.nullable.string('DOSE');
    t.nullable.string('FORM');
    t.nullable.string('QUANTITY');
    t.nullable.string('FREQUENCY');
    t.nullable.string('DURATION');
    t.nullable.int('PR_ID');
    t.nullable.int('is_favorite')
  },
});

const PrescriptionDeleteInp = inputObjectType({
  name:"PrescriptionDeleteInp",
  definition(t) {
      t.nonNull.int('prescription_id');
      t.nonNull.string('dateCreated');
  },
})

const PrescriptionDeleteObj = objectType({
  name:"PrescriptionDeleteObj",
  definition(t) {
      t.string("message")
  },
})

export const PrescriptionDelete = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PrescriptionDelete', {
      type: PrescriptionDeleteObj,
      args: { data: PrescriptionDeleteInp! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        const deleteData = args?.data;

       if(isToday(deleteData?.dateCreated)){
        try {
          await client.prescriptions.update({
            data:{
              isDeleted:1
            },
            where:{
              ID:Number(deleteData?.prescription_id)
            }
          })

          await client.prescriptions_child.updateMany({
            data:{
              isDeleted:1
            },
            where:{
              PR_ID:Number(deleteData?.prescription_id)
            }
          })
          return{
            message:"Deleted successfully!"
          }
        } catch (error) {
          console.log(error,'errorrs');
          throw new GraphQLError(error);
        }
       }else{
        throw new GraphQLError('Unable to delete');

       }
      }
    })
  }
});

export const MutationPrescription = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('MutationPrescription', {
      type: Prescription_Mutation_Type,
      args: { data: PrescriptionUpsertType! },
      async resolve(_, args, _ctx) {
        const { session } = _ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`Prescription_Mutation_Type`',
          'MutationPrescription'
        );
        const { uuid }: any = args?.data;
        // throw new Error('Something went wrong!');

        // you can also get the patient info here, if patient
        const patientId = await client.user.findFirst({
          where: {
            uuid: String(uuid),
          },
          include: {
            patientInfo: true,
          },
        });

        let emrRecord: any;

        // for emr
        let patientEmrId = await client.emr_patient.findFirst({
          where: {
            id: Number(args?.data?.emrId),
          },
        });

        if (Number(patientEmrId?.link) === 1) {
          emrRecord = await client.patient.findFirst({
            where: {
              S_ID: Number(patientEmrId?.patientID),
            },
          });
        }

        // note
        // pag yung emr patient naka link what to add?
        let message: any = {};
        try {
          if (session.user.role === 'patient') {
            return {
              message: 'your not authorize',
            };
          }
          const doctorProfile = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
           })

          const prescriptionInput = { ...args.data };
          const uuid = prescriptionInput.tempId;
          const emrId = prescriptionInput?.emrId;
          
          const isEmr = prescriptionInput?.isEmr;
          const prescriptionChildInputs = prescriptionInput.Prescription_Child_Inputs || [];
          delete prescriptionInput.Prescription_Child_Inputs;
          delete prescriptionInput.doctorID;
          delete prescriptionInput.tempId;
          delete prescriptionInput.uuid;
          delete prescriptionInput.emrId;
          delete prescriptionInput.patientID;
          delete prescriptionInput.isEmr;
          delete prescriptionInput.templateName;
          delete prescriptionInput.isTemplate;



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

         
         console.log(doctorProfile,'hahaha')

         console.log(doctorProfile?.EMP_ID,'awittt')
         
          const prTemplate = await (async()=>{
            if(!args?.data?.templateName) return;
            
           const data = await client.prescription_template.create({
              data:{
                name:args?.data?.templateName,
                created_by:doctorProfile?.EMP_ID
              }
            });
            return data;
          })();

          console.log(prTemplate,'awittt')

          const parent = await client.prescriptions.create({
            data: {
              ...prescriptionInput,
              doctorID:doctorProfile?.EMP_ID,
              emrPatientID: isEmr === 1 ? emrId : null,
              patientID: patientId ? patientId?.patientInfo?.S_ID : patientEmrId?.patientID,
              PATIENT: String(patientId?.patientInfo?.IDNO),
              presCode: VoucherCode,
              template_id:args?.data?.isTemplate && prTemplate?.id
            },
          });

     

          const child = prescriptionChildInputs?.map(async (item) => {
            


            const newChild = await client.prescriptions_child.create({
              data: {
                ...item,
                PR_ID: parent?.ID,
                doctorID:doctorProfile && doctorProfile?.EMP_ID
              },
            });

       



            return newChild;
          });

          const createdChildren = await Promise.all(child);

       

          // (async()=>{
          //   if(args?.data?.isTemplate){
          //     const ids = createdChildren?.map((item)=>item?.ID)

          //     await client.prescription_template.create({
          //       data:{
          //         name:args?.data?.templateName,
          //         pr_ids:JSON.stringify(ids)
          //       }
          //     })
          //   }
          // })();

          const doctorEmployee = await client.employees.findFirst({
            where: {
              EMP_ID: Number(session?.user?.id),
            },
            include: {
              SpecializationInfo: true,
              clinicInfo: true,
            },
          });

         if(!isEmr){
          let notifContent = await client.notification_content.create({
            data: {
              content: 'created new prescription'
            }
          })

          await client.notification.create({
            data: {
              user_id: Number(session?.user?.id),
              notifiable_id: Number(patientId?.patientInfo?.S_ID),
              notification_type_id: 19,
              notification_content_id: Number(notifContent?.id),
              presc_id: Number(parent?.ID),
              user_id_user_role: 2,
              notifiable_user_role: 5
            }
          })
         }

          // console.log(doctorEmployee, 'yeyey');

          const res = {
            ...parent,
            patient: patientId ? { ...patientId?.patientInfo } : emrRecord || patientEmrId,
            // patient: { ...patientId?.patientInfo } || patientEmrId,
            tempId: uuid,
            prescriptions_child: prescriptionChildInputs,
            doctorInfo: doctorEmployee,
          };



          return res;
        } catch (err) {
          console.log(err, 'error ');
          throw new Error('Something went wrong.');
        }
      },
    });
  },
});


// const QueryAllPrescriptionClinicDataInp = inputObjectType({
//   name: "QueryAllPrescriptionClinicDataInp",
//   definition(t) {
//     t.string('uuid');
//     t.
//   },
// })

// const QueryAllPrescriptionClinicDataObj = objectType({
//   name: "QueryAllPrescriptionClinicDataObj",
//   definition(t) {
//     t.list.field('clinicData', {
//       type: Clinics
//     })
//   },
// })

// export const QueryAllPrescriptionClinicData = extendType({
//   type: 'Query',
//   definition(t) {
//     t.nullable.field('QueryAllPrescriptionClinicData', {
//       type: QueryAllPrescriptionClinicDataObj,
//       args: { data: QueryAllPrescriptionClinicDataInp! },
//       async resolve(_root, args, _ctx) {

//         const {session} = _ctx;

//         const checkUser = (() => {
//           if (session?.user?.role === 'secretary')
//             return {
//               doctorID: session?.user?.permissions?.doctorID,
//             };
//           return {
//             doctorID: session?.user?.id,
//           };
//         })();

//         const user = await client.user.findFirst({
//           where: {
//             uuid: args?.data?.uuid
//           }
//         })

//         const patient = await client.patient.findFirst({
//           where: {
//             EMAIL: user?.email
//           }
//         });

//         const pres = await client.prescriptions.findMany({
//           where: {

//           }
//         })
//       }
//     })
//   }
// })