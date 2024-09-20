/* eslint-disable no-extra-boolean-cast */
import { extendType, objectType, inputObjectType } from 'nexus';
import { serialize, unserialize } from 'php-serialize';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import useGoogleStorage from '@/hooks/use-google-storage-uploads2';

export const Clinics = objectType({
  name: 'Clinics',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('doctor_idno');
    t.int('isDeleted');
    t.string('location');
    t.string('number');
    t.string('Province');
    t.string('uuid');
    t.string('schedule');
    t.int('doctorID');
    t.nullable.list.field('doctorInfo', {
      type: doctorObj,
    });
    t.nullable.list.field('clinicDPInfo', {
      type: clinicDPInfos,
    });
    t.nullable.list.field('ClinicSchedInfo', {
      type: ClinicSchedInfo,
      async resolve(root, _arg, ctx) {
        const result: any = await client.clinic_schedule.findMany({
          where: {
            clinic: Number(root?.id),
          },
        });
        return result;
      },
    });
  },
});

const doctorObj = objectType({
  name: 'doctorObj',
  definition(t) {
    t.int('EMPID');
    t.nullable.string('EMPID');
  },
});

const clinicDPInfos = objectType({
  name: 'clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

export const ClinicSchedInfo = objectType({
  name: 'ClinicSchedInfo',
  definition(t) {
    t.id('id');
    t.int('clinic');
    t.int('doctorID');
    t.string('SchedName');
    t.list.field('days', {
      type: 'Int',
      resolve(parent: any) {
        const days: any = parent?.days;
        let res: any = [];
        if (!!days) {
          res = unserialize(unserialize(days));
        }
        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
    t.string('time_interval');
    t.string('start_time');
    t.string('end_time');
    t.int('isDeleted');
    t.list.field('type', {
      type: 'Int',
      resolve(parent: any) {
        const type: any = parent?.type;
        let res: any = [];
        if (!!type) {
          res = unserialize(unserialize(type));
        }
        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
  },
});

export const ClinicPayload = inputObjectType({
  name: 'ClinicPayload',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.int('doctor_idno');
    t.nullable.int('sched_type');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.nullable.int('type');
  },
});

const ClinicTransactionObject1 = objectType({
  name: 'ClinicTransactionObject1',
  definition(t) {
    t.nullable.list.field('clinic_data', {
      type: Clinics,
    });
    t.list.field('provinces', {
      type: Provinces,
    });
    t.int('total');
    t.int('total_f2f');
    t.int('total_tm');
    t.nullable.int('totalClinicSched');
  },
});

const Provinces = objectType({
  name: 'Provinces',
  definition(t) {
    t.string('Province');
  },
});
const SummaryTypeObject = objectType({
  name: 'SummaryTypeObject',
  definition(t) {
    t.nullable.int('total');
    t.nullable.int('telemedicine');
    t.nullable.int('facetoface');
  },
});

const filters = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let multicondition: any = {};
  if (args?.data!.searchKeyword) {
    // null , empty string valid value
    whereConSearch = {
      OR: [
        {
          clinic_name: {
            contains: args?.data!.searchKeyword,
          },
        },
        {
          Province: {
            contains: args?.data!.searchKeyword,
          },
        },
        {
          location: {
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

export const QueryClinics = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryClinics', {
      type: ClinicTransactionObject1,
      args: { data: ClinicPayload! },

      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;
        let orderConditions: any;
        let order: any;
        switch (args?.data!.orderBy) {
          case 'name':
            order = [
              {
                id: args?.data!.orderDir,
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

        // console.log('WHERE CONDITION@@: ', whereconditions);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`clinic`', 'allClinic');

        const filter_sched_type: any = Number(args?.data!.sched_type);
        let fSchedObj: any = {};
        if (filter_sched_type === 1) {
          fSchedObj = {
            ClinicSchedInfo: {
              some: {
                isDeleted: 0,
                type: {
                  contains: 'i:0;i:1;',
                },
              },
            },
          };
        } else if (filter_sched_type === 2) {
          fSchedObj = {
            ClinicSchedInfo: {
              some: {
                isDeleted: 0,
                type: {
                  contains: 'i:0;i:2;',
                },
              },
            },
          };
        } else {
          fSchedObj = {
            ClinicSchedInfo: {
              some: {
                isDeleted: 0,
              },
            },
          };
        }
        // console.log('whereconditions@@: ', whereconditions);
        // console.log('fSchedObj@@: ', fSchedObj);

        try {
          const [clinic, f2f, tm, total]: any = await client.$transaction([
            client.clinic.findMany({
              take,
              skip,
              where: {
                doctorID: Number(session?.user?.id),
                isDeleted: 0,

                ...fSchedObj,
                ...whereconditions,
              },
              include: {
                doctorInfo: true,
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
              ...orderConditions,
            }),
            client.clinic.findMany({
              // take,
              // skip,
              where: {
                isDeleted: 0,
                NOT: [{ isDeleted: 1 }, { clinic_name: '' }],
                doctorID: Number(session?.user?.id),
             
                ClinicSchedInfo: {
                  some: {
                    type: {
                      contains: 'i:0;i:2;',
                    },
                    isDeleted: 0,
                    
                  },
                },
                ...whereconditions,
              },
              include: {
                doctorInfo: true,
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
              ...orderConditions,
            }),
            client.clinic.findMany({
              where: {
                isDeleted: 0,
                NOT: [{ isDeleted: 1 }, { clinic_name: '' }],
                ClinicSchedInfo: {
                  some: {
                    type: {
                      contains: 'i:0;i:1;',
                    },
                    isDeleted: 0,
                  },
                },
                doctorID: Number(session?.user?.id),
                // ...fSchedObj,

                ...whereconditions,
              },
              include: {
                doctorInfo: true,
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
              ...orderConditions,
            }),

            client.clinic.findMany({
              where: {
                doctorID: Number(session?.user?.id),
                isDeleted: 0,

                ...fSchedObj,
                ...whereconditions,
                // isDeleted: 0,
                // NOT: [{ isDeleted: 1 }, { clinic_name: '' }],
                // doctorID: session?.user?.id,
                // ...whereconditions,
              },
              include: {
                doctorInfo: true,
                clinicDPInfo: {
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
              ...orderConditions,
            }),
          ]);
          // console.log(clinic, 'YAY@@@');
          // let scheds = await client.clinic_schedule.findMany({
          //   where: {
          //     isDeleted: 0,
          //     doctorID: session?.user?.id,
          //   },
          // });

          // console.log(scheds, 'scheds');
          // scheds = scheds?.map((i: any) => {
          //   const days = unserialize(unserialize(i?.days));
          //   const type = unserialize(unserialize(i?.type));

          //   return { ...i, days, type };
          // });

          // console.log(scheds, 'scheds@@');

          const provinces = await client.clinic.findMany({
            select: {
              Province: true,
            },
            distinct: ['Province'],
          });

          const _result: any = clinic;
          const _total: any = total.length;
          const ftof = f2f.length;
          const telemed = tm.length;

          const response: any = {
            clinic_data: _result,
            total: _total,
            total_f2f: ftof,
            total_tm: telemed,
            totalClinicSched: 0,
            provinces,
          };
          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

export const ClinicInsertPayload = inputObjectType({
  name: 'ClinicInsertPayload',
  definition(t) {
    t.nullable.string('clinic_name');
    t.nullable.string('location');
    t.nullable.string('number');
    t.nullable.string('Province');
    t.nullable.int('refId');
    // data from clinic sched table
    t.nullable.string('start_time');
    t.nullable.int('numberPatient')
    t.nullable.string('end_time');
    t.nullable.string('time_interval');
    t.nullable.JSON('days');
    t.nullable.string('uuid');
    t.nullable.JSON('type');
  },
});
export const DeleteClinicInputs = inputObjectType({
  name: 'DeleteClinicInputs',
  definition(t) {
    t.nonNull.string('id');
  },
});

export const PostClinic = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostClinic', {
      type: Clinics,
      args: {
        data: ClinicInsertPayload!,
        file: 'Upload',
      },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        // console.log(session,'session')
        try {
          const daysJson = serialize(serialize(createData.days));
          const typeJson = serialize(serialize(createData.type));

          // console.log

          const clinic = await client.clinic.create({
            data: {
              clinic_name: String(createData.clinic_name),
              location: String(createData.location),
              number: String(createData.number),
              Province: String(createData.Province),
              doctorID: session?.user?.id,
            },
          });
          const clinicSched = await client.clinic_schedule.create({
            data: {
              start_time: createData.start_time,
              end_time: createData.end_time,
              time_interval: createData.time_interval,
              doctorID: Number(session?.user?.id),
              SchedName: String('schedule'),
              days: daysJson,
              type: typeJson,
              clinic_id: clinic?.id,
              clinic: clinic?.id,
              // clinicInfo: {
              //   connect: { id: Number(createData.refId) },
              // },
            },
          });

          const clinicSchedID = clinic.id;

          const sFile = await args?.file;
          if (sFile) {
            const uploadResult = await useUpload(sFile, 'public/documents/');
            
            const res: any = await useGoogleStorage(
              sFile,
              Number(session?.user?.id),
              'userDisplayProfile'
            );
            
            await client.clinicdp.create({
              data: {
                doctorID: Number(session?.user?.id),
                doctor: String(session?.user?.doctorId),
                clinic: clinicSchedID,
                filename: String(res.path),
              },
            });
            // uploadResult.map(async (v: any) => {

            //   await client.clinicdp.create({
            //     data: {
            //       doctorID: Number(session?.user?.id),
            //       doctor: String(session?.user?.doctorId),
            //       clinic: clinicSchedID,
            //       filename: String(v.path),
            //     },
            //   });
            // });
          }

          // console.log(clinicSched, 'clinicsched@@');

          // const clinicSched = await client.clinic_schedule.create({
          //   data: {
          //     start_time: createData.start_time,
          //     end_time: createData.end_time,
          //     time_interval: createData.time_interval,
          //     days: daysJson,
          //     type: typeJson,
          //     doctorID: session?.user?.id,
          //     clinicInfo: {
          //       connect: { id: Number(clinic.id) },
          //     },
          //   },
          // });

          const res: any = clinic;
          return {
            ...res,
            uuid: String(args?.data?.uuid),
          };
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const PostClinicSched = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostClinicSched', {
      type: ClinicSchedInfo,
      args: { data: ClinicInsertPayload! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        try {
          const daysJson = serialize(serialize(createData.days));
          const typeJson = serialize(serialize(createData.type));

          const clinicSched = await client.clinic_schedule.create({
            data: {
              // doctorID: Number(session?.user?.id),
              doctorInfo: { connect: { EMP_ID: Number(session?.user?.id) } },
              start_time: createData.start_time,
              end_time: createData.end_time,
              time_interval: createData.time_interval,
              days: daysJson,
              type: typeJson,
              SchedName: String('schedule'),
              clinicInfo: {
                connect: { id: Number(createData.refId) },
              },
            },
          });
          const res: any = clinicSched;
          return {
            ...res,
            uuid: args?.data?.uuid,
          };
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const UpdateClinic = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateClinic', {
      type: Clinics,
      args: {
        data: ClinicInsertPayload!,
        file: 'Upload',
      },
      async resolve(_parent, args, _ctx) {
        const createData: any = args?.data;
        const { session } = _ctx;
        try {
          const clinic = await client.clinic.update({
            where: {
              id: Number(args?.data!.refId),
            },
            data: {
              clinic_name: createData.clinic_name,
              location: createData.location,
              number: createData.number,
              Province: createData.Province,
            },
          });

          const clinicSchedID = clinic.id;

          const sFile = await args?.file;
          if (sFile) {

            const uploadResult: any = await useGoogleStorage(
              sFile,
              session?.user?.id,
              'feeds'
            );

            // const uploadResult = await useUpload(sFile, 'public/documents/');
            uploadResult.map(async (v: any) => {
              await client.clinicdp.create({
                data: {
                  clinic: clinicSchedID,
                  filename: String(v.path),
                },
              });
            });
          }

          const res: any = clinic;
          return {
            ...res,
          };
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

const DeleteClinicInputsSched = inputObjectType({
  name: 'DeleteClinicInputsSched',
  definition(t) {
    t.nonNull.int('id');
  },
});
const DeleteClinicTypes = objectType({
  name: 'DeleteClinicTypes',
  definition(t) {
    t.string('message');
    t.int('status');
  },
});

export const DeleteClinic = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteClinic', {
      type: DeleteClinicTypes,
      args: { data: DeleteClinicInputs! },
      async resolve(_parent, args, _ctx) {
        const createData: any = args?.data;

        try {
          const clinic = await client.clinic.findFirst({
            where: {
              id: Number(args?.data!.id),
            },
          });

          const alterClinic = await client.clinic.update({
            where: {
              id: Number(args?.data!.id),
            },
            data: {
              ...clinic,
              isDeleted: 1,
            },
          });
          // console.log(alterClinic);

          const res: any = clinic;
          return {
            message: 'Deleted Successfully',
            status: 200,
          };
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const QueryOneClinic = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryOneClinic', {
      type: Clinics,
      args: { data: ClinicInsertPayload! },
      async resolve(_parent, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`clinic`', 'QueryOneClinic');
        try {
          const result: any = await client.clinic.findFirst({
            where: {
              id: Number(args?.data!.refId),
            },
          });
          return result;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const UpdateClinicSched = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('UpdateClinicSched', {
      type: ClinicSchedInfo,
      args: { data: ClinicInsertPayload! },
      async resolve(_parent, args, _ctx) {
        const createData: any = args?.data;

        const daysJson = serialize(serialize(createData.days));
        const typeJson = serialize(serialize(createData.type));

        try {
          const clinicSched = await client.clinic_schedule.update({
            where: {
              id: Number(args?.data!.refId),
            },
            data: {
              start_time: createData.start_time,
              end_time: createData.end_time,
              time_interval: createData.time_interval,
              days: daysJson,
              type: typeJson,
              number_patient:createData?.numberPatient
            },
          });

          const res: any = clinicSched;
          return {
            ...res,
          };
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});

export const QueryOneClinicSched = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryOneClinicSched', {
      type: ClinicSchedInfo,
      args: { data: ClinicInsertPayload! },
      async resolve(_parent, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`clinic_schedule`',
          'QueryOneClinicSched'
        );
        try {
          const result: any = await client.clinic_schedule.findFirst({
            where: {
              id: Number(args?.data!.refId),
            },
          });
          return result;
        } catch (error) {
          console.log(e);
        }
      },
    });
  },
});

export const DeleteOneSched = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteOneSched', {
      type: ClinicSchedInfo,
      args: { data: DeleteClinicInputsSched! },
      async resolve(_parent, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`clinic_schedule`',
          'QueryOneClinicSched'
        );
        try {
          const result: any = await client.clinic_schedule.update({
            where: {
              id: Number(args?.data!.id),
            },
            data: {
              isDeleted: 1,
            },
          });
          return result;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
