import { extendType, inputObjectType, list, objectType } from 'nexus';
import { unserialize, serialize } from 'php-serialize';
import client from '../../../prisma/prismaClient';
// import { notEqual } from 'assert';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

/* SchedName	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    5	days	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    6	type	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    7	time_interval	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    8	start_time	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    9	end_time	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	 */

// export const ClinicSchedInfoObject = objectType({
//     name: "ClinicSchedInfoObject",
//     definition(t) {
//         t.id('id');
//         t.string("SchedName");
//         t.string("days");
//         t.list.field("daysArray",{
//             type: 'Int',
//             resolve(parent){
//                 const days : any = parent?.days;
//                 let res : any = [];
//                 if(!!days){
//                     res = unserialize(unserialize(days));
//                 }
//                 return res? res.map((v:any)=> Number(v) ) : [];
//             }
//         });
//         t.string("type");
//         t.list.field("typeArray",{
//             type: 'Int',
//             resolve(parent){
//                 const type : any = parent?.type;
//                 let res : any = [];
//                 if(!!type){
//                     res = unserialize(unserialize(type));
//                 }

//                 return res? res.map((v:any)=> Number(v) ) : [];
//             }
//         });
//         t.string("time_interval");
//         t.string("start_time");
//         t.string("end_time");
//     },
// });

// export const clinicInfoObject = objectType({
//     name: "clinicInfoObject",
//     definition(t) {
//         t.id('id');
//         t.string("clinic_name");
//         t.string("schedule");
//         t.string("location");
//         t.string("number");
//         t.string("Province");
//         t.list.field("ClinicSchedInfo", { type: ClinicSchedInfoObject })
//         t.int("isDeleted");
//     },
// });

// export const SpecializationInfoObject = objectType({
//     name: "SpecializationInfoObject",
//     definition(t) {
//         t.id('id');
//         t.string("name");
//         t.int("isDeleted");
//     },
// });

export const HMOObj = objectType({
  name: 'HMOObj',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const findHmoChild = objectType({
  name: 'findHmoChild',
  definition(t) {
    t.int('EMPID');
    t.string('HMO');
    t.list.field('HMOInfo', {
      type: HMOObj,
      async resolve(parent, _args, _ctx) {
        let result: any = [];
        if (!!parent.HMO) {
          const hmoIDs = unserialize(parent.HMO);
          if (hmoIDs && Array.isArray(hmoIDs)) {
            result = await client.hmo.findMany({
              where: {
                id: {
                  in: hmoIDs.map((v: any) => Number(v)),
                },
              },
            });
          }
        }
        return result;
      },
    });
  },
});

const HmoList = objectType({
  name: 'HmoList',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const FindHmo = objectType({
  name: 'FindHmo',
  definition(t) {
    t.list.field('HmoList', {
      type: HmoList,
    });
    t.nullable.field('totalRecords', {
      type: 'Int',
      resolve(parent) {
        const arg: any = parent;
        // return arg;
        const symptoms: any = arg?.hmo?.HMO;
        // console.log('symptoms', symptoms);

        let res: any = [];

        res = unserialize(symptoms);

        if (!!symptoms) {
          res = unserialize(symptoms);
        }

        return res ? res?.length : 0;
      },
    });
    t.nullable.string('HMO');

    t.nullable.list.field('hmo', {
      type: HMOObj || [],
      async resolve(parent) {
        const arg: any = parent;
        // console.log(args, 'args@@@@@@@@@');
        // return arg;
        const symptoms: any = arg?.hmo?.HMO;
        // console.log('symptoms', symptoms);

        let res: any = [];
        let myHmo: any = [];

        if (symptoms === undefined) {
          return [];
        }
        res = unserialize(symptoms);

        if (!!symptoms) {
          res = unserialize(symptoms);
        }

        res &&
          res?.map((i) => {
            myHmo.push(getHmo(i));
          });

        return myHmo;
      },
    });
  },
});

const getHmo = async (i: any) => {
  return await client.hmo.findFirst({
    where: {
      id: Number(i),
    },
  });
};

const HmoObjInput = inputObjectType({
  name: 'HmoObjInput',
  definition(t) {
    t.nullable.int('take');
    t.nullable.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    // t.nullable.string("searchKeyword");
  },
});
const HmoMutationInput = inputObjectType({
  name: 'HmoMutationInput',
  definition(t) {
    t.list.int('id');
  },
});

export const Hmo = extendType({
  type: 'Query',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.nullable.field('Hmo', {
      type: FindHmo,
      // args: { data: HmoObjInput! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;

        try {
          const result: any = await client.employees.findFirst({
            select: {
              HMO: true,
            },
            where: {
              EMP_ID: session?.user?.id,
              HMO: {
                not: '',
              },
            },
          });
          const HmoList: any = await client.hmo.findMany({
            distinct: ['name'],
          });
          const response = {
            hmo: result,
            HmoList,
          };
          // console.log(response, 'yey?');

          return response;
          // return res;
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

const HmoInputType = objectType({
  name: 'HmoInputType',
  definition(t) {
    t.list.field('id', {
      type: tempObj,
      async resolve(_root, args, _ctx) {
        // console.log(_root, 'roo@');
        const ids = _root?.id;

        const myData: any = [];

        // review this bri, ganda eh.
        const promises = ids?.map(async (i: any) => {
          const res = await getHmo(i);
          // console.log(res);
          return res;
        });

        if (promises) {
          try {
            const data = await Promise.all(promises);
            return data;
          } catch (error) {
            // Handle any errors that occurred during the promises
            console.error('Error fetching data:', error);
            throw error;
          }
        }
      },
    });
  },
});

const tempObj = objectType({
  name: 'tempObj',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});
// const tempObjChild = objectType({
//   name: 'tempObjChild',
//   definition(t) {
//     t.int('id');
//     t.string('name');
//   },
// });

export const CreateHMO = extendType({
  type: 'Mutation',
  definition(t) {
    // t.nullable.list.field('Hmo', {
    t.nullable.field('CreateHMO', {
      type: HmoInputType,
      args: { data: HmoMutationInput! },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`HmoMutation`',
          'CreateMutation'
        );

        // first, we have to get all the ids before mutation
        const getHmo: any = await client.employees.findFirst({
          select: {
            HMO: true,
          },
          where: {
            EMP_ID: session?.user?.id,
            HMO: {
              not: '',
            },
          },
        });

        // this is the ids that are not yet mutated
        const hmoIDs = unserialize(getHmo?.HMO).map((i) => Number(i));
        const payloadIds = args?.data?.id?.map((i) => Number(i));
        const addeddId: any = [];

        payloadIds?.forEach((i) => {
          if (!hmoIDs?.includes(i)) {
            addeddId.push(i);
          }
        });
        // console.log(addeddId, 'addeddId@@');

        const serializedIds = serialize(args?.data?.id);
        try {
          const result = await client.employees.update({
            where: {
              EMP_ID: session?.user?.id,
            },
            data: {
              HMO: serializedIds,
            },
          });
          return {
            id: addeddId,
          };
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

// doctor types

async function getAllHMOs() {
  const hmos = await client.hmo.findMany();
  // Map the hmos array to extract the names
  const hmoList = hmos.map((hmo) => ({
    id: hmo.id,
    name: hmo.name,
  }));
  return hmoList;
}

const DoctorInfoObj4HMO = objectType({
  name: 'DoctorInfoObj4HMO',
  definition(t) {
    t.id('EMP_ID');
    t.nullable.string('EMP_FULLNAME');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('EMP_TITLE');
    t.nullable.string('SUBSPECIALTY');
    t.nullable.string('EMP_EMAIL');
    t.nullable.int('FEES');
    t.nullable.int('MEDCERT_FEE');
    t.nullable.int('MEDCLEAR_FEE');
    t.nullable.int('MEDABSTRACT_FEE');
    t.nullable.field('attachment', {
      type: 'String',
      async resolve(root) {
        const userID = await client.user.findFirst({
          where: {
            email: String(root?.EMP_EMAIL),
          },
        });
        if (!userID) return '';

        const pic = await client.display_picture.findMany({
          where: {
            userID: Number(userID?.id),
          },
          orderBy: {
            id: 'desc',
          },
        });

        return pic[0]?.filename;
      },
    });

    t.nullable.field('HMO', {
      type: 'JSON',
      resolve: async (root, args, ctx) => {
        if (root.HMO) {
          try {
            const hmoData = unserialize(root.HMO);
            const hmoNames = await getAllHMOs();

            // Use map and filter to create an array of objects for matching HMOs
            const matchingHMOs = hmoNames
              .filter((hmo) => hmoData.includes(hmo.id.toString()))
              .map((hmo) => ({
                id: hmo.id,
                name: hmo.name,
              }));

            // console.log(matchingHMOs);
            return matchingHMOs;
          } catch (error) {
            console.error('Error deserializing HMO:', error);
            return null;
          }
        }
        return null;
      },
    });
    t.nullable.field('SpecializationInfo', {
      type: SpecializationObjectFields4Hmo,
    });
    t.nullable.field('user', {
      type: userObj4HMO,
    });
    t.nullable.list.field('clinicInfo', {
      type: clinicInfo4FYD,
    });
  },
});
export const clinicInfo4FYD = objectType({
  name: 'clinicInfo4FYD',
  definition(t) {
    t.id('id');
    t.string('clinic_name');
    // t.string('schedule');
    t.list.field('schedule', {
      type: 'Int',
      resolve(parent) {
        const schedule: any = parent?.schedule;
        let res: any = [];
        if (!!schedule) {
          res = unserialize(schedule);
        }
        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
    t.string('location');
    t.string('number');
    t.string('Province');
    t.int('isDeleted');
    t.list.field('ClinicSchedInfo', { type: ClinicSchedInfoObj4Booking });
    t.nullable.list.field('clinicDPInfo', {
      type: fyd_clinic_clinicDPInfos,
      async resolve(root, _arg, ctx) {
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

///////////////////////////////////////////////////////
const fyd_clinic_clinicDPInfos = objectType({
  name: 'fyd_clinic_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});
///////////////////////////////////////////////////////

export const ClinicSchedInfoObj4Booking = objectType({
  name: 'ClinicSchedInfoObj4Booking',
  definition(t) {
    t.id('id');
    t.string('SchedName');
    // t.string('days');
    t.list.field('days', {
      type: 'Int',
      resolve(parent) {
        const days: any = parent?.days;
        let res: any = [];
        if (!!days) {
          res = unserialize(unserialize(days));
        }
        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
    // t.string('type');
    t.list.field('type', {
      type: 'Int',
      resolve(parent) {
        const type: any = parent?.type;
        let res: any = [];
        if (!!type) {
          res = unserialize(unserialize(type));
        }

        return res ? res.map((v: any) => Number(v)) : [];
      },
    });
    t.string('time_interval');
    t.string('start_time');
    t.string('end_time');
  },
});

const userObj4HMO = objectType({
  name: 'userObj4HMO',
  definition(t) {
    t.nonNull.string('uuid');
  },
});
const SpecializationObjectFields4Hmo = objectType({
  name: 'SpecializationObjectFields4Hmo',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const QueryHmoByUUID_payload = inputObjectType({
  name: 'QueryHmoByUUID_payload',
  definition(t) {
    t.string('uuid');
  },
});
// HMO by doctor uuid

export const QueryHmoByUUID = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryHmoByUUID', {
      type: DoctorInfoObj4HMO,
      args: { data: QueryHmoByUUID_payload! },
      async resolve(_root, args, ctx) {
        const { uuid }: any = args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`employees`', 'QueryHmoByUUID');
        try {
          const result: any = await client.employees.findFirst({
            where: {
              user: {
                OR: [
                  {
                    uuid: String(uuid),
                  },
                  {
                    uname: String(uuid),
                  },
                ],  
              },
            },
            include: {
              clinicInfo: {
                where: {
                  isDeleted: 0,
                },
                include: {
                  ClinicSchedInfo: true,
                  clinicDPInfo:{
                      orderBy: {
                        id: 'desc',
                      },
                  },
                },
              },
              user: true,
              SpecializationInfo: true,
            },
          });
          return result;
        } catch (error) {
          //
        }
      },
    });
  },
});
