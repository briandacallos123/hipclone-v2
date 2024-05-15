import { extendType, inputObjectType, list, objectType } from 'nexus';
import { unserialize, serialize } from 'php-serialize';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

/* SchedName	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    5	days	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    6	type	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    7	time_interval	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    8	start_time	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	
    9	end_time	longtext	latin1_swedish_ci		Yes	NULL			Change Change	Drop Drop	 */

export const FindYourDoctor = objectType({
  name: 'FindYourDoctor',
  definition(t) {
    t.id('EMP_ID');
    t.int('EMPID');
    t.field('EMP_FULLNAME', {
      type: 'String',
      resolve(parent, _args, _ctx) {
        const fullName: String = `${parent.EMP_FNAME} ${parent.EMP_LNAME}`;
        return String(fullName);
      },
    });
    t.string('EMP_FNAME');
    t.string('EMP_MNAME');
    t.string('EMP_LNAME');
    t.string('EMP_SUFFIX');
    t.string('EMP_TITLE');
    t.string('HMO');
    t.list.field('HMOInfo', {
      type: HMOObject,
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
    t.nullable.field('SpecializationInfo', { type: SpecializationInfoObject });
    t.string('SUBSPECIALTY');

    t.list.field('clinicInfo', {
      type: clinicInfoObject,
    });

    t.int('isDeleted');
    t.nullable.field('user', {
      type: userObj4FYD,
    });
  },
});

export const ClinicSchedInfoObject = objectType({
  name: 'ClinicSchedInfoObject',
  definition(t) {
    t.id('id');
    t.string('SchedName');
    t.string('days');
    t.list.field('daysArray', {
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
    t.string('type');
    t.list.field('typeArray', {
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
export const clinicInfoObject = objectType({
  name: 'clinicInfoObject',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('schedule');
    t.string('location');
    t.string('number');
    t.string('Province');
    t.list.field('ClinicSchedInfo', { type: ClinicSchedInfoObject });
    t.int('isDeleted');
    t.nullable.list.field('clinicDPInfo', {
      type: fyd_clinicDPInfos,
      async resolve(root, _arg, ctx) {
        const result: any = await client.clinicdp.findMany({
          where: {
            clinic: Number(root?.id),
          },
        });
        return result;
      },
    });
  },
});

const fyd_clinicDPInfos = objectType({
  name: 'fyd_clinicDPInfos',
  definition(t) {
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.string('filename');
    t.nullable.dateTime('date');
  },
});

export const SpecializationInfoObject = objectType({
  name: 'SpecializationInfoObject',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('isDeleted');
  },
});

export const HMOObject = objectType({
  name: 'HMOObject',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

const userObj4FYD = objectType({
  name: 'userObj4FYD',
  definition(t) {
    t.nonNull.string('uuid');
    t.nullable.string('uname');
    t.nullable.int('id');
    t.nullable.list.field('display_picture', {
      type: fyd_appt_patient_display_picture,
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
const fyd_appt_patient_display_picture = objectType({
  name: 'fyd_appt_patient_display_picture',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('userID');
    t.nullable.string('idno');
    t.nullable.string('filename');
  },
});
///////////////////////////////////////////////////////

export const FindYourDoctorTransactionObj = objectType({
  name: 'FindYourDoctorTransactionObj',
  definition(t) {
    t.nullable.list.field('FYD_data', {
      type: FindYourDoctor,
    });
    t.int('fyd_totalRecords');
  },
});

export const FYDInputType = inputObjectType({
  name: 'FYDInputType',
  definition(t) {
    t.nonNull.int('take');
    t.nonNull.int('skip');
    t.nullable.string('orderBy');
    t.nullable.string('orderDir');
    t.nullable.string('searchKeyword');
    t.nullable.string('searchClinic');
    t.nullable.string('searchSpecial');
    t.list.field('hmoIds', { type: 'Int' });
  },
});
export const QueryFYD = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('findYourDoctor', {
      type: FindYourDoctorTransactionObj,
      args: { data: FYDInputType! },
      async resolve(_root, args, ctx) {
        const take: Number | any = args?.data!.take ? args?.data!.take : 0;
        const skip: Number | any = args?.data!.skip ? args?.data!.skip : 0;

        const order: any = {
          EMP_FNAME: args?.data!.orderDir,
        };
        const whereconditions = filters(args);

      /*   console.log(whereconditions, 'WHERE'); */

        // console.log(serialize(args?.data!.hmoIds), 'Filter@');

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`employees`', 'findYourDoctor');

  
        try {
          let [result, _count]: any = await client.$transaction([
            client.employees.findMany({
              orderBy: {
                ...order,
              },
              skip,
              take,
              where: {
                isDeleted: 0,
                ...whereconditions, 
              },
              include: {
                user: true,
                clinicInfo: {
                  where: {
                    isDeleted: 0,
                    NOT: [{ clinic_name: '' }, { clinic_name: null }, { isDeleted: 1 }],
                  },
                  include: {
                    clinicDPInfo:{
                      orderBy:{
                        id:'desc'
                      }
                    },
                    ClinicSchedInfo: {
                      where: {
                        isDeleted: 0,
                      },
                    },
                  },
                },

                SpecializationInfo: true,
              },
            }),
            client.employees.aggregate({
              where: {
                isDeleted: 0,
                ...whereconditions,
                clinicInfo: {
                  some: {
                    isDeleted: 0,
                  },
                },
              },
              _count: {
                EMPID: true,
              },
            }),
          ]);
          // console.log(result, 'result');

          /* if (args?.data!.hmoIds?.length) {
            const hmoIDS = args?.data!.hmoIds;

            result?.forEach((p: any) => {
              const newData: any = [];
              if (p?.HMO) {
                let hmo = unserialize(p?.HMO)?.map((i: any) => Number(i));
                hmo?.forEach((i: any) => hmoIDS.includes(i) && newData.push(p));
              }
              console.log(newData.slice(0, 5));
              result = newData.slice(0, 5);
            });
          } */

          const _result: any = result;
          const _total: any = _count;
          const response: any = {
            FYD_data: _result,
            fyd_totalRecords: Number(_total?._count?.EMPID),
          };
          return response;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

const filters = (args: any) => {
  // search / filters
  let whereConSearch: any = {};
  let whereSpecSearch: any = {};
  let whereHmoSearch: any = {};
  let whereConClinic: any = {};
  // let whereDate: any = {};
  let multicondition: any = {};
  if (args?.data!.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          EMP_FULLNAME: {
            contains: args?.data!.searchKeyword,
          },
        },
        {
          EMP_FNAME: {
            contains: args?.data!.searchKeyword,
          },
        },
        {
          EMP_LNAME: {
            contains: args?.data!.searchKeyword,
          },
        },
      ],
    };
  }
  if (args?.data!.searchClinic) {
    whereConClinic = {
      clinicInfo: {
        some: {
          clinic_name: {
            contains: args?.data!.searchClinic,
          },
        },
      },
      // OR: [
      //   {
      //     clinicInfo: {
      //       every: {
      //         clinic_name: {
      //           contains: args?.data!.searchClinic,
      //         },
      //       },
      //     },
      //   },
      // ],
    };
  }
  if (args?.data!.searchSpecial) {
    whereSpecSearch = {      
        SpecializationInfo: {
          name: {
            contains: args?.data!.searchSpecial,
          },
        },     
    };
  }

  let HMHSearch : any = {
  }  
  if(args?.data?.hmoIds?.length){
    let hV :any = [];

    args?.data?.hmoIds.map((v:any) =>{   
        const stL = String(v).length  
        hV.push({       
            HMO:{
              contains:`s:${stL}:"${v}"`
            }        
        })
    })
    HMHSearch = {
      OR:[
        ...hV
      ]
    }
  }
  // const hmoIDs: any = args?.data!.hmoIds;
  // const ser = serialize(args?.data!.hmoIds);
  // console.log(ser, 'serserserser@');
  // if (hmoIDs.length) {
  //   whereHmoSearch = {
  //     OR: [
  //       {
  //         HMO: {
  //           contains: ser,
  //         },
  //       },
  //     ],
  //   };
  // }
  // if (args?.data!.startDate && args?.data!.endDate) {
  //   whereDate = {
  //     date: {
  //       gte: args?.data!.startDate,
  //       lte: args?.data!.endDate,
  //     },
  //   };
  // }

  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
      ...whereSpecSearch,
      // ...whereHmoSearch,
      ...whereConClinic,
      ...HMHSearch
    },
  };
  return multicondition;
};
