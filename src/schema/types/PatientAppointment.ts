import { PrismaClient } from '@prisma/client';
import { extendType, objectType, intArg, stringArg, inputObjectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

const client = new PrismaClient();

const PatientAptObjectFields = objectType({
  name: 'PatientAptObjectFields',
  definition(t) {
    t.int('id');
    t.int('patient_no');
    t.dateTime('add_date');
    t.date('date');
    t.int('status');
    t.int('clinic');
    t.dateTime('time_slot');
    t.int('payment_status');
    t.int('type');
    t.nullable.field('clinicInfo', {
      type: ClinicObjectFields4Apt,
      /*  async resolve(root, _arg, _ctx) {
        const result: any = await client.clinic.findFirst({
          where: {
            id: Number(root?.clinic),
          },
        });

        return result;
      }, */
    });
  },
});

const ClinicObjectFields4Apt = objectType({
  name: 'ClinicObjectFields4Apt',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.nullable.field('doctorInfo', {
      type: DoctorObjectFields4Apt,
      /*   async resolve(root, _arg, _ctx) {
        const result: any = await client.employees.findFirst({
          where: {
            EMP_ID: Number(root?.doctorID),
          },
        });

        return result;
      }, */
    });
    t.string('clinic_name');
    t.string('location');
    t.int('isDeleted');
  },
});

const DoctorObjectFields4Apt = objectType({
  name: 'DoctorObjectFields4Apt',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.string('EMP_FULLNAME');
  },
});

const SummaryObjectPatientAPT = objectType({
  name: 'SummaryObjectPatientAPT',
  definition(t) {
    t.nullable.int('total');
    t.nullable.int('pending');
    t.nullable.int('approved');
    t.nullable.int('done');
    t.nullable.int('cancelled');
    t.nullable.int('telemed');
    t.nullable.int('face2Face');
  },
});

export const AptHistoryTransactionObject = objectType({
  name: 'AptHistoryTransactionObject',
  definition(t) {
    t.nullable.list.field('AptHistory_data', {
      type: PatientAptObjectFields,
    });
    t.field('summary', {
      type: SummaryObjectPatientAPT,
    });
    t.int('total_records');
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
        clinic: {
          in: clinicIDs,
        },
      };
    }
    return {};
  }
  // if (args?.data!.startDate && args?.data!.endDate) {
  //   whereDate = {
  //     add_date: {
  //       gte: args?.data!.startDate,
  //       lte: args?.data!.endDate,
  //     },
  //   };
  // }
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

export const AllPatientAPTInputType = inputObjectType({
  name: 'AllPatientAPTInputType',
  definition(t) {
    t.nullable.int('status');
    t.nullable.int('patientID');
    t.nonNull.int('take');
    t.nonNull.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.list.field('clinicIds', { type: 'Int' }); // [1,2,3]
    t.nullable.dateTime('startDate');
    t.nullable.dateTime('endDate');
    t.nullable.string('uuid'); // support uuid
  },
});

export const QueryPatientAppointment = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('patientAppointment', {
      type: AptHistoryTransactionObject,
      args: { data: AllPatientAPTInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;

        let order: any;
        switch (args?.data!.orderBy) {
          case 'date':
            order = [
              {
                add_date: args?.data!.orderDir,
              },
            ];

            break;

          case 'doctor':
            order = [
              {
                clinicInfo: {
                  doctorInfo: {
                    EMP_FULLNAME: args?.data!.orderDir,
                  },
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

          case 'scheduleDate':
            order = [
              {
                date: args?.data!.orderDir,
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

          default:
            order = {};
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
            status: Number(args?.data!.status),
          };
        })();

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`appointments`',
          '`patientAppointment`'
        );

        try {
          const [patientApt, _count, count, apptType]: any = await client.$transaction([

            //FETCH DATA PER ROWS
            client.appointments.findMany({
              skip,
              take,
              where: {
                doctorID: session?.user?.id,
                patientInfo: {
                  userInfo: {
                    uuid: String(args?.data!.uuid),
                  },
                },
                NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                ...status,

                ...whereconditions,
              },
              include: {
                patientInfo: true,
                clinicInfo: true,
                doctorInfo: true,
                appt_hmo_attachment: true,
                appt_payment_attachment: true,
              },
              ...orderConditions,
            }),
            //GET STATUS
            client.appointments.groupBy({
              by: ['status'],
              orderBy: {
                status: 'asc',
              },
              where: {
                doctorID: session?.user?.id,
                patientInfo: {
                  userInfo: {
                    uuid: String(args?.data!.uuid),
                  },
                },
                ...status,
                NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],

                ...whereconditions,
              },
              _count: {
                id: true,
              },
            }),
            //GET COUNT TOTAL DATA
            client.appointments.aggregate({
              where: {
                doctorID: session?.user?.id,
                patientInfo: {
                  userInfo: {
                    uuid: String(args?.data!.uuid),
                  },
                },
                NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
                ...status,

                ...whereconditions,
              },
              _count: {
                id: true,
              },
            }),
            //GROUP TYPE to get F2F or Telemed
            client.appointments.groupBy({
              by: ['type'],
              orderBy: {
                type: 'asc',
              },
              where: {
                doctorID: session?.user?.id,
                patientInfo: {
                  userInfo: {
                    uuid: String(args?.data!.uuid),
                  },
                },
                //...status,
                NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],

                ...whereconditions,
              },
              _count: {
                id: true,
              },
            }),
            // // telemed count
            // client.appointments.findMany({
            //   where: {
            //     doctorID: session?.user?.id,
            //     patientInfo: {
            //       userInfo: {
            //         uuid: String(args?.data!.uuid),
            //       },
            //     },
            //     NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
            //     ...status,
            //     type: 1,
            //     ...whereconditions,
            //   },
            //   include: {
            //     patientInfo: true,
            //     clinicInfo: true,
            //     doctorInfo: true,
            //     appt_hmo_attachment: true,
            //     appt_payment_attachment: true,
            //   },
            //   ...orderConditions,
            // }),
            // // face2face count
            // client.appointments.findMany({
            //   where: {
            //     doctorID: session?.user?.id,
            //     patientInfo: {
            //       userInfo: {
            //         uuid: String(args?.data!.uuid),
            //       },
            //     },
            //     NOT: [{ time_slot: null }, { patient_no: null }, { patientInfo: null }],
            //     type: 2,

            //     ...whereconditions,
            //   },
            //   include: {
            //     patientInfo: true,
            //     clinicInfo: true,
            //     doctorInfo: true,
            //     appt_hmo_attachment: true,
            //     appt_payment_attachment: true,
            //   },
            //   ...orderConditions,
            // }),
          ]);
          const _result: any = patientApt;
          const _total: any = count;
          const _totalSum: any = _count;
          // const _telemed: any = telemedNum.length;
          // const _Fac2FNum: any = Fac2FNum.length;

          let total = 0;
          _totalSum.map((v: any) => (total += v?._count?.id));
          const totalSum = {
            total,
            pending: _totalSum.find((v: any) => v?.status === 0)?._count?.id,
            approved: _totalSum.find((v: any) => v?.status === 1)?._count?.id,
            cancelled: _totalSum.find((v: any) => v?.status === 2)?._count?.id,
            done: _totalSum.find((v: any) => v?.status === 3)?._count?.id,
            // telemed: _telemed,
            // face2Face: _Fac2FNum,
            telemed: apptType.find((v: any) => v?.type === 1)?._count?.id,
            face2Face: apptType.find((v: any) => v?.type === 2)?._count?.id,
          };

          const response: any = {
            AptHistory_data: _result,
            total_records: Number(_total?._count?.id),
            summary: totalSum,
          };
          // console.log(apptType, '@@@@@@@@@@@@@@@@@@');
          return response;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});
