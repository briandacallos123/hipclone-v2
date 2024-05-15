/* eslint-disable no-lone-blocks */
/* eslint-disable default-case */
import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

const client = new PrismaClient();

export const prescriptionsQr = objectType({
  name: 'prescriptionsQr',
  definition(t) {
    t.id('ID');
    t.string('DATE');
    t.string('PATIENTEMR');
    t.int('isFavorite');
    t.int('patientID');
    t.string('FollowUp');
    t.string('REMARKS');
    t.string('DOCTOR');
    t.string('REMARKS');
    t.string('PR_ID');
    t.int('doctorID');

    t.nullable.field('doctorInfo', {
      type: DoctorObjectQr,
    });
    t.nullable.field('patientQr', {
      type: patientQr,
    });
    t.nullable.field('clinicInfo', {
      type: ClinicObjectQr,
    });
    t.nullable.list.field('prescriptions_child', {
      type: prescriptions_child_qr,
    });
  },
});

const Prescription_List_QR = objectType({
  name: 'Prescription_List_QR',
  definition(t) {
    t.nullable.field('Prescription_data', {
      type: prescriptionsQr,
    });
    t.int('totalRecords');
  },
});
const Prescription_Child_Type = objectType({
  name: 'Prescription_Child_Type',
  definition(t) {
    t.nullable.field('Prescription_data', {
      type: prescriptionsQr,
    });
  },
});

const prescriptions_child_qr = objectType({
  name: 'prescriptions_child_qr',
  definition(t) {
    t.string('MEDICINE');
    t.string('MED_BRAND');
    t.string('DOSE');
    t.string('FORM');
    t.string('QUANTITY');
    t.string('FREQUENCY');
    t.string('DURATION');
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
      type: prescriptionsQr,
    });
  },
});




const DoctorObjectQr = objectType({
  name: 'DoctorObjectQr',
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
      type: SpecializationQr,
    });
    t.list.field('DoctorClinics', {
      type: DoctorClinicsTypeQr,
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
      type: pr_history_esig_dp_picture_qr,
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
      type: pr_history_userinfo_qr,
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

const pr_history_userinfo_qr = objectType({
  name: 'pr_history_userinfo_qr',
  definition(t) {
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: pr_history_patient_display_picture_qr,
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
const pr_history_esig_dp_picture_qr = objectType({
  name: 'pr_history_esig_dp_picture_qr',
  definition(t) {
    t.nullable.int('type');
    t.nullable.string('doctorID');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const pr_history_patient_display_picture_qr = objectType({
  name: 'pr_history_patient_display_picture_qr',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

export const DoctorClinicsTypeQr = objectType({
  name: 'DoctorClinicsTypeQr',
  definition(t) {
    t.string('clinic_name');
    t.string('location');
    t.string('number');
  },
});

const SpecializationQr = objectType({
  name: 'SpecializationQr',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});
const patientQr = objectType({
  name: 'patientQr',
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
      type: prescription_user_object_qr,
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
const prescription_user_object_qr = objectType({
  name: 'prescription_user_object_qr',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('uuid');
    t.nullable.list.field('display_picture', {
      type: prescription_patient_display_picture_qr,
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
const prescription_patient_display_picture_qr = objectType({
  name: 'prescription_patient_display_picture_qr',
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

export const ClinicObjectQr = objectType({
  name: 'ClinicObjectQr',
  definition(t) {
    t.id('id');
    t.string('location');
    t.string('Province');
    t.string('clinic_name');
    t.int('isDeleted');
    t.string('number');
    t.list.field('clinicDPInfo', {
      type: patient_lab_clinicDPInfos_Qr,
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

// const patient_lab_clinicDPInfos = objectType({
//   name: 'patient_lab_clinicDPInfos',
//   definition(t) {
//     t.nullable.int('doctorID');
//     t.nullable.int('clinic');
//     t.nullable.string('filename');
//     t.nullable.dateTime('date');
//   },
// });

const patient_lab_clinicDPInfos_Qr = objectType({
  name: 'patient_lab_clinicDPInfos_Qr',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});




// prescriptions_child;





// patient user --------------------------------------------------------------

export const AllPrescriptionInputUserQr = inputObjectType({
  name: 'AllPrescriptionInputUserQr',
  definition(t) {
    // t.nullable.int('sex');
    // t.nullable.int('take');
    // t.nullable.int('skip');
    t.nullable.int('id')
    t.nullable.string('presCode');
    // t.nullable.string('orderBy');
    // t.nullable.string('orderDir');
    // t.nullable.string('startDate');
    // t.nullable.string('endDate');
    // t.list.field('clinicID', { type: 'Int' });
    // t.nullable.int('searchKeyword');
  },
});

export const QueryAllPrescriptionUserQr = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryAllPrescriptionUserQr', {
      type: Prescription_List_QR,
      args: { data: AllPrescriptionInputUserQr! },
      async resolve(_root, args, _ctx) {
        const data: any | typeof args.data = args.data;
        const { take, skip, orderBy, orderDir, uuid, startDate, endDate }: typeof data = data;
        // const currentEndDate = new Date(endDate);
        const whereconditions = filters(args);

        // let order: any;
        // switch (args?.data!.orderBy) {
        //   case 'date':
        //     {
        //       order = [{ DATE: args?.data!.orderDir }];
        //     }
        //     break;
        //   case 'prescriptionNumber':
        //     {
        //       order = [{ ID: args?.data!.orderDir }];
        //     }
        //     break;
        //   case 'hospital':
        //     {
        //       order = [
        //         {
        //           clinicInfo: {
        //             clinic_name: args?.data!.orderDir,
        //           },
        //         },
        //       ];
        //     }
        //     break;

        //   default:
        //     order = {};
        // }
        // const orderConditions = {
        //   orderBy: order,
        // };

        const { session } = _ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`prescriptions`',
          'QueryAllPrescriptionUser'
        );

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
        // throw new Error('Error!');
        //   take, skip, orderConditions, whereconditions; session

        
        const condition = (()=>{
          if(args?.data?.id){
            return { ID:args?.data?.id}
          }else{
            return { presCode:args?.data?.presCode}
          }
        })()
        try {
          const [prescriptionsData]: any = await client.$transaction([
            client.prescriptions.findFirst({
              take,
              skip,
              // ...orderConditions,
              where: {
                ...whereconditions,
                // patientID: args?.data?.id,
                ...condition,
                NOT: [{ clinicInfo: null }],
                isDeleted: 0,
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
            })
          ]);

          // console.log('_count', _count);
          const result = prescriptionsData;

          const response: any = {
            Prescription_data: result,
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
    // console.log(args?.data!.searchKeyword, 'YAYY@');
    whereConSearch = {
      ID: Number(args?.data!.searchKeyword),
    };
  }

  if (args?.data!.startDate || args?.data!.endDate) {
    whereDate = {
      DATE: {
        gte: args?.data!.startDate,
        lte: args?.data!.endDate,
      },
      // AND: [
      //   {
      //     DATE: {
      //       gte: args?.data!.startDate,
      //     },
      //   },
      //   {
      //     DATE: {
      //       lte: args?.data!.endDate, // "lte" stands for "less than or equal to"
      //     },
      //   },
      // ],
    };
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




// export const MutationPrescription = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.nullable.field('MutationPrescription', {
//       type: Prescription_Mutation_Type,
//       args: { data: PrescriptionUpsertType! },
//       async resolve(_, args, _ctx) {
//         const { session } = _ctx;

//         await cancelServerQueryRequest(
//           client,
//           session?.user?.id,
//           '`Prescription_Mutation_Type`',
//           'MutationPrescription'
//         );
//         const { uuid }: any = args?.data;
//         // throw new Error('Something went wrong!');

//         // you can also get the patient info here, if patient
//         const patientId = await client.user.findFirst({
//           where: {
//             uuid: String(uuid),
//           },
//           include: {
//             patientInfo: true,
//           },
//         });

//         let emrRecord: any;

//         // for emr
//         let patientEmrId = await client.emr_patient.findFirst({
//           where: {
//             id: Number(args?.data?.emrId),
//           },
//         });

//         if (Number(patientEmrId?.link) === 1) {
//           emrRecord = await client.patient.findFirst({
//             where: {
//               S_ID: Number(patientEmrId?.patientID),
//             },
//           });
//         }

//         // note
//         // pag yung emr patient naka link what to add?
//         let message: any = {};
//         try {
//           if (session.user.role === 'patient') {
//             return {
//               message: 'your not authorize',
//             };
//           }

//           const prescriptionInput = { ...args.data };
//           const uuid = prescriptionInput.tempId;
//           const emrId = prescriptionInput?.emrId;
//           const isEmr = prescriptionInput?.isEmr;
//           const prescriptionChildInputs = prescriptionInput.Prescription_Child_Inputs || [];
//           delete prescriptionInput.Prescription_Child_Inputs;
//           delete prescriptionInput.tempId;
//           delete prescriptionInput.uuid;
//           delete prescriptionInput.emrId;
//           delete prescriptionInput.patientID;
//           delete prescriptionInput.isEmr;

//           const parent = await client.prescriptions.create({
//             data: {
//               ...prescriptionInput,
//               emrPatientID: isEmr === 2 ? emrId : null,
//               patientID: patientId ? patientId?.patientInfo?.S_ID : patientEmrId?.patientID,
//               PATIENT: String(patientId?.patientInfo?.IDNO),
//             },
//           });

//           const child = prescriptionChildInputs?.map(async (item) => {
//             const newChild = await client.prescriptions_child.create({
//               data: {
//                 ...item,
//                 PR_ID: parent?.ID,
//               },
//             });
//             return newChild;
//           });

//           const createdChildren = await Promise.all(child);

//           const doctorEmployee = await client.employees.findFirst({
//             where: {
//               EMP_ID: Number(session?.user?.id),
//             },
//             include: {
//               SpecializationInfo: true,
//               clinicInfo: true,
//             },
//           });

//           // console.log(doctorEmployee, 'yeyey');

//           const res = {
//             ...parent,
//             patient: patientId ? { ...patientId?.patientInfo } : emrRecord || patientEmrId,
//             // patient: { ...patientId?.patientInfo } || patientEmrId,
//             tempId: uuid,
//             prescriptions_child: prescriptionChildInputs,
//             doctorInfo: doctorEmployee,
//           };

//           return res;
//         } catch (err) {
//           console.log(err, 'error ');
//           throw new Error('Something went wrong.');
//         }
//       },
//     });
//   },
// });
