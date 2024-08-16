import { GraphQLError } from 'graphql/error/GraphQLError';
import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from 'nexus';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { unserialize } from 'php-serialize';

const client = new PrismaClient();

export const hmo_claims = objectType({
  name: 'hmo_claims',
  definition(table_column) {
    table_column.id('id');
    table_column.int('appt_id');
    table_column.int('hmo');
    table_column.int('claim_status');
    table_column.int('member_name');
    table_column.string('member_id');
    table_column.int('doctor');
    table_column.int('doctorID');
    table_column.date('date_appt');
    table_column.string('time_appt');
    table_column.string('diagnosis_code');
    table_column.string('diagnosis');
    table_column.string('dispo_code');
    table_column.string('disposition');
    table_column.string('ver_code');
    table_column.string('treatment');
    table_column.string('approval_no');
    table_column.string('c_email');
    table_column.string('c_contact');
    table_column.string('c_clinic');
    table_column.string('c_caddress');
    table_column.string('payment_type');
    table_column.string('dateCreated');
    table_column.int('export_stat');
    table_column.int('isDeleted');

    table_column.nullable.field('hmoInfo', {
      type: hmo_details,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.hmo.findFirst({
          where: {
            id: Number(root?.hmo),
          },
        });

        return result;
      },
    });
    table_column.nullable.field('patientHmoInfo', {
      type: patient_hmo,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.patient_hmo.findFirst({
          where: {
            member_id: String(root?.member_id),
          },
        });

        return result;
      },
    });
    table_column.nullable.field('appointmentInfo', {
      type: appointments_details,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.appointments.findFirst({
          where: {
            id: Number(root?.appt_id),
          },
        });

        return result;
      },
    });
    table_column.nullable.field('doctorInfo', {
      type: employees_details,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.employees.findFirst({
          where: {
            EMP_ID: Number(root?.doctorID),
          },
        });

        return result;
      },
    });
  },
});

/////////////////////////////////////////
//HMO DETAILS
const hmo_details = objectType({
  name: 'hmo_details',
  definition(t) {
    t.id('id');
    t.nullable.string('name');
  },
});
//HMO DETAILS
/////////////////////////////////////////

/////////////////////////////////////////
//PATIENT HMO DETAILS
const patient_hmo = objectType({
  name: 'patient_hmo',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.nullable.string('idno');
    t.nullable.string('hmo');
    t.nullable.string('member_id');
    t.nullable.string('isDeleted');
    t.nullable.field('patient', {
      type: patient_details,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.patient.findFirst({
          where: {
            S_ID: Number(root?.patientID),
          },
        });

        return result;
      },
    });
  },
});
//PATIENT HMO DETAILS appt_hmo_attachment
/////////////////////////////////////////

/////////////////////////////////////////
//PATIENT DETAILS
const patient_details = objectType({
  name: 'patient_details',
  definition(t) {
    t.id('S_ID');
    t.int('IDNO');
    t.nullable.string('FNAME');
    t.nullable.string('MNAME');
    t.nullable.string('LNAME');
    t.nullable.string('SUFFIX');
    t.nullable.int('SEX');
    t.nullable.int('BDAY');
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
  },
});
//PATIENT DETAILS
/////////////////////////////////////////

/////////////////////////////////////////
//APPOINTMENTS DETAILS
const appointments_details = objectType({
  name: 'appointments_details',
  definition(t) {
    t.nullable.id('id');
    t.nullable.int('patientID');
    t.nullable.int('patient_no');
    t.nullable.string('symptoms');
    t.nullable.date('date');
    t.nullable.string('time_slot');
    t.nullable.string('comment');
    t.nullable.list.field('patientInfo', {
      type: hmo_patient_info,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.patient.findMany({
          where: {
            S_ID: Number(root?.patientID),
            isDeleted: 0,
          },
        });

        return result;
      },
    });
    t.list.field('symptoms', {
      type: 'String',
      resolve(parent) {
        const arg: any = parent;
        const symptoms: any = arg?.symptoms;
        let res: any = [];
        if (!!symptoms) {
          res = unserialize(symptoms);
        }
        return res ? res.map((v: any) => v) : [];
      },
    });
    t.list.field('appt_hmo_attachment', {
      type: appt_hmo_attachment_new,
      async resolve(root, _arg, _ctx) {
        const result: any = await client.appt_hmo_attachment.findMany({
          where: {
            appt_hmo_id: Number(root?.id),
            isDeleted: 0,
          },
        });

        return result;
      },
    });
  },
});
//APPOINTMENTS DETAILS
/////////////////////////////////////////

///////////////////////////////////////////////////////
const hmo_patient_info = objectType({
  name: 'hmo_patient_info',
  definition(t) {
    t.nullable.int('S_ID');
    t.nullable.int('IDNO');
    t.nullable.string('EMAIL');
    t.nullable.string('FNAME');
    t.nullable.string('LNAME');
    t.nullable.string('MNAME');
    t.nullable.int('SEX');
    t.nullable.list.field('userInfo', {
      type: hmo_patient_Info,
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
const hmo_patient_Info = objectType({
  name: 'hmo_patient_Info',
  definition(t) {
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: hmo_patient_display_picture,
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
const hmo_patient_display_picture = objectType({
  name: 'hmo_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

/////////////////////////////////////////
//PATIENT DETAILS
const appt_hmo_attachment_new = objectType({
  name: 'appt_hmo_attachment_new',
  definition(t) {
    t.id('id');
    t.nullable.int('patientID');
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
//PATIENT DETAILS
/////////////////////////////////////////

/////////////////////////////////////////
//EMPLOYEES DETAILS
const employees_details = objectType({
  name: 'employees_details',
  definition(t) {
    t.id('EMP_ID');
    t.nullable.string('EMP_FULLNAME');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('CONTACT_NO');
    t.nullable.string('EMP_EMAIL');
  },
});
//EMPLOYEES DETAILS
/////////////////////////////////////////

/////////////////////////////////////
//FILTERS
const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};
  let whereDate: any = {};
  let payment_type: any = {};
  let wherehmo: any = {};
  // let hmo: any = {};
  if (args?.data?.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          payment_type: {
            // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          c_caddress: {
            // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          time_appt: {
            // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          member_id: {
            // date_appt = coloumn name
            contains: args?.data?.searchKeyword,
          },
        },
        {
          patientHmoInfo: {
            OR: [
              {
                patient: {
                  OR: [
                    {
                      FNAME: {
                        contains: args?.data!.searchKeyword,
                      },
                    },
                    {
                      MNAME: {
                        contains: args?.data!.searchKeyword,
                      },
                    },
                    {
                      LNAME: {
                        contains: args?.data!.searchKeyword,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          hmoInfo: {
            OR: [
              {
                name: {
                  // date_appt = coloumn name
                  contains: args?.data?.searchKeyword,
                },
              },
            ],
          },
        },
      ],
    };
  }
  if (args?.data?.start_date && args?.data?.end_date) {
    whereDate = {
      date_appt: {
        // date_appt = coloumn name
        gte: args?.data?.start_date,
        lte: args?.data?.end_date,
      },
    };
  }
  if (args?.data?.payment_type) {
    payment_type = {
      payment_type: {
        // date_appt = coloumn name
        contains: args?.data?.payment_type, // contains == where like
      },
    };
  }

  const hmo: any = args?.data!.hmo;
  if (hmo && Array.isArray(hmo) && hmo.length > 0) {
    wherehmo = {
      hmo: {
        in: hmo,
      },
    };
  }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereDate,
      ...payment_type,
      ...wherehmo,
    },
  };
  return multicondition;
};
//FILTERS
/////////////////////////////////////

/////////////////////////////////////
//REQUEST PAYLOADS
export const Request_payloads_hmo_claims = inputObjectType({
  name: 'Request_payloads_hmo_claims',
  definition(request) {
    request.nullable.string('claim_status');
    request.nullable.string('payment_type');
    request.nullable.int('take');
    request.nullable.int('skip');
    request.nullable.string('orderBy');
    request.nullable.string('orderDir');
    request.nullable.string('searchKeyword');
    request.list.field('hmo', { type: 'Int' }); // [1,2,3]
    request.nullable.date('start_date');
    request.nullable.date('end_date');
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////

////////////////////////////////////
//SUMMARY TOTAL
const Summary_Total_Array = objectType({
  name: 'Summary_Total_Array',
  definition(summary_total) {
    summary_total.nullable.int('total');
    summary_total.nullable.int('pending');
    summary_total.nullable.int('approved');
    summary_total.nullable.int('done');
    summary_total.nullable.int('cancelled');
  },
});
//SUMMARY TOTAL
////////////////////////////////////

///////////////////////////////////////
export const hmo_claims_transactions = objectType({
  name: 'hmo_claims_transactions',
  definition(t) {
    t.nullable.list.field('hmo_claims_data', {
      type: hmo_claims,
    });
    t.int('total_records');
    t.int('payChequeCount');
    t.int('payDepositCount');
    t.field('summary_total', {
      type: Summary_Total_Array,
    });
  },
});
///////////////////////////////////////

export const Get_All_Hmo_Claims = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('Get_All_Hmo_Claims', {
      type: hmo_claims_transactions,
      args: { data: Request_payloads_hmo_claims! },
      async resolve(_root, args, ctx) {
        //
        const { take, skip, orderBy, orderDir, start_date, end_date }: any = args.data;

        const currentEndDate = new Date(end_date);

        // const formattedEndDate = currentEndDate.toISOString().slice(0, 10);
        // const formattedEndDateAsDate = new Date(formattedEndDate);
        //

        let order: any;
        switch (args?.data!.orderBy) {
          case 'member_name':
            {
              order = [{ member_name: args?.data!.orderDir }];
            }
            break;
          case 'hmo':
            {
              order = [{ hmo: args?.data!.orderDir }];
            }
            break;
          case 'date_appt':
            {
              order = [{ date_appt: args?.data!.orderDir }];
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

        // ORDER BY
        //

        const whereconditions = filters(args);
        const claim_status = (() => {
          if (args?.data?.claim_status === '-1') return {};
          return {
            payment_type: args?.data?.claim_status,
          };
        })();

        const setCurrentDay = (() => {
          if (!start_date && !end_date) return {};
          if (!start_date && end_date)
            return {
              date_appt: {
                lte: currentEndDate,
              },
            };
          return {};
        })();
        //
        //
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`hmo_claims`',
          'Get_All_Hmo_Claims'
        );
        //

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
          const [hmo_claims, deposit, cheque, _count, count]: any = await client.$transaction([
            client.hmo_claims.findMany({
              take,
              skip,
              where: {
                ...claim_status,
                ...whereconditions,
                ...setCurrentDay,
                // doctorID:session?.user?.id,
                ...checkUser,
                patientHmoInfo: {
                  NOT: {
                    member_id: null,
                  },
                },
                isDeleted: 0,
              },
              include: {
                hmoInfo: true,
                patientHmoInfo: true,
                appointmentInfo: {
                  include: {
                    appt_hmo_attachment: true,
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
                      },
                    },
                  },
                },
                doctorInfo: true,
              },
              ...orderConditions,
            }),

            // deposit count
            client.hmo_claims.findMany({
              where: {
                ...claim_status,
                ...whereconditions,
                ...setCurrentDay,
                // doctorID:session?.user?.id,
                payment_type: 'deposit',
                ...checkUser,
                patientHmoInfo: {
                  NOT: {
                    member_id: null,
                  },
                },
                isDeleted: 0,
              },
              include: {
                hmoInfo: true,
                patientHmoInfo: true,
                appointmentInfo: {
                  include: {
                    appt_hmo_attachment: true,
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
                      },
                    },
                  },
                },
                doctorInfo: true,
              },
              ...orderConditions,
            }),
            // cheque count
            client.hmo_claims.findMany({
              where: {
                ...claim_status,
                ...whereconditions,
                ...setCurrentDay,
                payment_type: 'cheque',
                // doctorID:session?.user?.id,
                ...checkUser,
                patientHmoInfo: {
                  NOT: {
                    member_id: null,
                  },
                },
                isDeleted: 0,
              },
              include: {
                hmoInfo: true,
                patientHmoInfo: true,
                appointmentInfo: {
                  include: {
                    appt_hmo_attachment: true,
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
                      },
                    },
                  },
                },
                doctorInfo: true,
              },
              ...orderConditions,
            }),
            client.hmo_claims.groupBy({
              by: ['id'],
              orderBy: {
                id: 'desc',
              },
              where: {
                // doctorID:session?.user?.id,
                ...checkUser,
                AND: [
                  { isDeleted: 0 },
                  { ...whereconditions },
                  {
                    patientHmoInfo: {
                      NOT: {
                        member_id: null,
                      },
                    },
                  },
                ],
                ...setCurrentDay,
              },
              _count: {
                id: true,
              },
            }),
            client.hmo_claims.aggregate({
              where: {
                // doctorID:session?.user?.id,
                ...checkUser,
                ...claim_status,
                ...whereconditions,
                ...setCurrentDay,
                patientHmoInfo: {
                  NOT: {
                    member_id: null,
                  },
                },
              },
              _count: {
                id: true,
              },
            }),
          ]);

          ////////////////////////////////////////////////
          const _result: any = hmo_claims;
          const _total: any = count;
          const _totalDep: any = deposit.length;
          const _totalCheq: any = cheque.length;
          const _total_summary: any = _count;
          ////////////////////////////////////////////////
          ////////////////////////////////////////////////
          let total = 0;
          _total_summary.map((v: any) => (total += v?._count?.id));
          const total_summary = {
            total,
            pending: _total_summary.find((v: any) => v?.claim_status === 1)?._count?.id,
            approved: _total_summary.find((v: any) => v?.claim_status === 0)?._count?.id,
            done: _total_summary.find((v: any) => v?.claim_status === 3)?._count?.id,
            cancelled: _total_summary.find((v: any) => v?.claim_status === 4)?._count?.id,
          };
          ////////////////////////////////////////////////
          ////////////////////////////////////////////////
          // OVERALL RESPONSE
          const response: any = {
            hmo_claims_data: _result,
            payChequeCount: _totalDep,
            payDepositCount: _totalCheq,
            total_records: Number(_total?._count?.id),
            summary_total: total_summary,
          };
          return response;
        } catch {}
      },
    });
  },
});

/////////////////////////////////////
//REQUEST PAYLOADS
export const Request_payloads_hmo_claims_by_id = inputObjectType({
  name: 'Request_payloads_hmo_claims_by_id',
  definition(request) {
    request.nullable.int('id');
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////

///////////////////////////////////////
export const hmo_claims_transactions_by_id = objectType({
  name: 'hmo_claims_transactions_by_id',
  definition(t) {
    t.nullable.field('hmo_claims_data_by_id', {
      type: hmo_claims,
    });
  },
});
///////////////////////////////////////

////////////////////////////////////
////////////////////////////////////
export const Get_Hmo_Claim_By_Id = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('Get_Hmo_Claim_By_Id', {
      type: hmo_claims_transactions_by_id,
      args: { data: Request_payloads_hmo_claims_by_id! },
      async resolve(_root, args, _ctx) {
        const { id }: any = args.data;
        let res: any = {};
        try {
          const hmo_claim = await client.hmo_claims.findFirst({
            where: {
              id: id || undefined,
              isDeleted: 0,
            },
            include: {
              hmoInfo: true,
              patientHmoInfo: true,
              appointmentInfo: {
                include: {
                  appt_hmo_attachment: true,
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
                    },
                  },
                },
              },
              doctorInfo: true,
            },
          });
          // console.log(hmo_claim,"wow");
          // return hmo_claim;

          // const res = {
          //   hmo_claims_data_by_id:hmo_claim
          // }
          return { hmo_claims_data_by_id: hmo_claim };
        } catch (error) {
          console.log(error);
          return res;
        }
        return res;
      },
    });
  },
});
////////////////////////////////////
////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
///////////////////////////UPDATE EXPORT////////////////////////////

export const hmo_claims_object = objectType({
  name: 'hmo_claims_object',
  definition(table_column) {
    table_column.int('id');
    table_column.int('export_stat');
  },
});
/////////////////////////////////////////////////////////////////
export const export_stat_request_type = inputObjectType({
  name: 'export_stat_request_type',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('export_stat');
  },
});
/////////////////////////////////////////////////////////////////

///////////////////////////////////////
export const export_stat_update_transactions = objectType({
  name: 'export_stat_update_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('export_stat_data', {
      type: hmo_claims_object,
    });
  },
});
///////////////////////////////////////

export const mutation_export_stat = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('mutation_export_stat', {
      type: export_stat_update_transactions,
      args: {
        data: export_stat_request_type!,
      },
      async resolve(_, args, ctx) {
        const { id, export_stat }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`mutation_export_stat`',
          'export_stat_request_type'
        );

        let res: any = {};

        if (session?.user?.role === 'secretary') {
          const subPermissions: any = await client.sub_account_doctor.findFirst({
            where: {
              secretaryID: session.user?.subAccId,
            },
          });

          if (Number(subPermissions?.hmo_claim) !== 1) {
            throw new GraphQLError('Unauthorized');
          }

          if (session?.user?.permissions?.hmo_claim === 1) {
            try {
              const export_stat_id = id;

              const appt_findfirst = await client.appointments.findFirst({
                where: {
                  id: export_stat_id,
                },
              });

              const update = await client.hmo_claims.update({
                where: {
                  id: export_stat_id,
                },
                data: {
                  export_stat,
                },
              });

              const hmo_claims_findfirst = await client.hmo_claims.findFirst({
                where: {
                  id: export_stat_id,
                },
              });

              const patient_findfirst = await client.patient.findFirst({
                where: {
                  S_ID: Number(appt_findfirst?.patientID),
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
                  patientID: Number(patient_findfirst?.S_ID),
                  idno: Number(secretary_findfirst?.idno) || null,
                  request: `Exported  ${hmo_claims_findfirst?.member_id} Claims Report`,
                  patient: String(patient_findfirst?.IDNO),
                  log_type: '5',
                  date: formattedDate,
                  type: 0,
                },
              });

              if (update) {
                res = {
                  status: 'Success',
                  message: 'Update Export Status Successfully',
                  export_stat_data: update,
                };
              }
            } catch (error) {
              console.log(error);
              res = {
                status: 'Failed',
                message: 'An error occurred.',
              };
            }
          } else {
            res = {
              status: 'Failed',
              message: 'You are not authorized for this action',
            };
          }
        } else {
          try {
            const export_stat_id = id;
            const update = await client.hmo_claims.update({
              where: {
                id: export_stat_id,
              },
              data: {
                export_stat,
              },
            });

            if (update) {
              res = {
                status: 'Success',
                message: 'Update Export Status Successfully',
                export_stat_data: update,
              };
            }
          } catch (error) {
            console.log(error);
            res = {
              status: 'Failed',
              message: 'An error occurred.',
            };
          }
        }
        return res;
      },
    });
  },
});

/////////////////////////UPDATE EXPORT////////////////////////////

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
///////////////////////////UPDATE EXPORT////////////////////////////

export const create_hmo_claims_object = objectType({
  name: 'create_hmo_claims_object',
  definition(table_column) {
    table_column.id('id');
    table_column.int('appt_id');
    table_column.int('hmo');
    table_column.int('claim_status');
    table_column.string('member_name');
    table_column.string('member_id');
    table_column.string('doctor');
    table_column.int('doctorID');
    table_column.date('date_appt');
    table_column.string('time_appt');
    table_column.string('diagnosis_code');
    table_column.string('diagnosis');
    table_column.string('dispo_code');
    table_column.string('disposition');
    table_column.string('ver_code');
    table_column.string('treatment');
    table_column.string('approval_no');
    table_column.string('c_email');
    table_column.string('c_contact');
    table_column.string('c_clinic');
    table_column.string('c_caddress');
    table_column.string('payment_type');
    table_column.string('dateCreated');
    table_column.int('export_stat');
    table_column.int('isDeleted');
  },
});
/////////////////////////////////////////////////////////////////
export const create_hmo_claims_input_request = inputObjectType({
  name: 'create_hmo_claims_input_request',
  definition(t) {
    t.int('appt_id');
    t.int('hmo');
    t.int('claim_status');
    t.string('member_name');
    t.string('member_id');
    t.string('doctor');
    t.int('doctorID');
    t.string('diagnosis');
    t.string('treatment');
    t.string('c_email');
    t.string('c_contact');
    t.string('c_clinic');
    t.string('c_caddress');
    t.string('payment_type');
  },
});
/////////////////////////////////////////////////////////////////

///////////////////////////////////////
export const create_hmo_claims_transactions = objectType({
  name: 'create_hmo_claims_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('hmo_claims_data', {
      type: create_hmo_claims_object,
    });
  },
});
///////////////////////////////////////

export const mutation_create_hmo_claims = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('mutation_create_hmo_claims', {
      type: create_hmo_claims_transactions,
      args: {
        data: create_hmo_claims_input_request!,
      },
      async resolve(_, args, ctx) {
        const {
          appt_id,
          hmo,
          claim_status,
          member_name,
          member_id,
          doctor,
          doctorID,
          diagnosis,
          treatment,
          c_email,
          c_contact,
          c_clinic,
          c_caddress,
          payment_type,
        }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`mutation_create_hmo_claims`',
          'create_hmo_claims_input_request'
        );

        let res: any = {};
        try {
          const diagnosis_code = 'N/A';
          const dispo_code = 'N/A';
          const disposition = 'N/A';
          const ver_code = 'N/A';
          const export_stat = 0;
          const isDeleted = 0;
          //
          const dateCreated = new Date();
          const year = dateCreated.getFullYear();
          const month = String(dateCreated.getMonth() + 1).padStart(2, '0');
          const day = String(dateCreated.getDate()).padStart(2, '0');
          const hourss = String(dateCreated.getHours()).padStart(2, '0');
          const minutess = String(dateCreated.getMinutes()).padStart(2, '0');
          const seconds = String(dateCreated.getSeconds()).padStart(2, '0');

          const formattedDate = `${year}-${month}-${day} ${hourss}:${minutess}:${seconds}`;
          //
          const date_appt = new Date();

          //
          const currentDate = new Date();
          const hours = currentDate.getHours();
          const minutes = currentDate.getMinutes();
          const amOrPm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
          const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
          //

          const approval_no = '';

          //////////////////////////////////////////////////////////
          //VALIDATING HMO
          const existingUserWithMobile = await client.hmo_claims.findFirst({
            where: {
              appt_id,
            },
          });

          if (existingUserWithMobile) {
            res = {
              status: 'Failed',
              message: 'This hmo claims is already inserted',
            };
            return res;
          }

          let doctorIDS = await client.employees.findFirst({
            where:{
              EMP_ID:Number(doctorID)
            }
          })
          //VALIDATING HMO
          //////////////////////////////////////////////////////////
          const create_hmo_claims = await client.hmo_claims.create({
            data: {
              appt_id,
              hmo,
              claim_status,
              member_name,
              member_id,
              doctor: doctor!=='null' ? doctor: doctorIDS?.EMPID,
              doctorID,
              diagnosis,
              treatment,
              c_email,
              c_contact,
              c_clinic,
              c_caddress,
              payment_type,
              diagnosis_code: diagnosis_code,
              dispo_code: dispo_code,
              disposition: disposition,
              ver_code: ver_code,
              export_stat: export_stat,
              isDeleted: isDeleted,
              dateCreated: String(formattedDate),
              date_appt: date_appt,
              time_appt: formattedTime,
              approval_no: approval_no,
            },
          });

          if (create_hmo_claims) {
            res = {
              status: 'Success',
              message: 'Create Hmo Claims Successfully',
              hmo_claims_data: create_hmo_claims,
            };
          }
        } catch (error) {
          console.log(error);
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

/////////////////////////UPDATE EXPORT////////////////////////////

//////////////////////////////////////////////////////////////////////////
