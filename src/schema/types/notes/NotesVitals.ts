import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { GraphQLError } from 'graphql/error';
import { subYears, startOfYear, endOfYear } from 'date-fns';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';

const client = new PrismaClient();

const RecordObjectFields4Vitals = objectType({
  name: 'RecordObjectFields4Vitals',
  definition(t) {
    t.id('R_ID');
    t.int('patientID');
    t.nullable.field('notes_vitals', {
      type: notesVitalObj,
    });
  },
});

export const notesVitalObj = objectType({
  name: 'notesVitalObj',
  definition(t) {
    t.id('id');
    t.int('patientID');
    t.int('emrPatientID');
    t.int('doctorID');
    t.int('isEMR');
    t.string('patient');
    t.string('doctor');
    t.int('clinic');
    t.dateTime('date');
    t.dateTime('dateCreated');
    t.int('report_id');
    t.string('wt');
    t.string('ht');
    t.string('hr');
    t.string('rr');
    t.string('bmi');
    t.string('bt');
    t.string('spo2');
    t.string('bp');
    t.string('bp1');
    t.string('bp2');
    t.string('chiefcomplaint');
    t.string('isDeleted');
    t.int('clinicInfo');
    t.int('doctorInfo');
    t.int('patientRelation');
    t.int('records');
    t.nullable.field('emr_patient', {
      type: emr_data4Vitals,
    });
  },
});
export const emr_data4Vitals = objectType({
  name: 'emr_data4Vitals',
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

export const notesVitalInputType = inputObjectType({
  name: 'notesVitalInputType',
  definition(t) {
    t.nullable.string('userType');
    t.nullable.int('patientID');
    t.nullable.int('recordID');
    t.nullable.int('clinicID');
    t.nullable.string('uuid');
    t.nullable.int('doctorID');
    t.nullable.int('emrID');

    t.nullable.string('weight');
    t.nullable.string('height');
    t.nullable.string('bmi');
    t.nullable.string('bloodPresMM');
    t.nullable.string('bloodPresHG');
    t.nullable.string('oxygen');
    t.nullable.string('respRate');
    t.nullable.string('heartRate');
    t.nullable.string('bodyTemp');
  },
});

export const vitalTransaction = objectType({
  name: 'vitalTransaction',
  definition(t) {
    t.nullable.list.field('vitals_data', {
      type: notesVitalObj,
    });
  },
});

export const QueryNotesVitals = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesVitals', {
      type: vitalTransaction,
      args: { data: notesVitalInputType! },
      async resolve(_root, args, ctx) {
        const currentYear = new Date().getFullYear();
        const yearStartDate = startOfYear(new Date(currentYear, 0, 1));
        const yearEndDate = endOfYear(new Date(currentYear, 11, 31));

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_vitals`',
          '`QueryNotesVitals`'
        );
        const checkIfEMR = (() => {
          if (args?.data!.patientID !== null) {
            return 2;
          }
          console.log('NASA EMR KA');

          return {
            emr_patient: {
              id: Number(4756),
              link: 1,
            },
            // isEMR: 1,
          };
        })();

        try {
          const myResult: any = checkIfEMR;
          let myData: any;

          if (myResult?.emr_patient) {
            myData = await client.emr_patient.findFirst({
              where: {
                id: Number(args?.data!.emrID),
              },
            });
          }

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

          const { data }: any = await customizedFunction(args, myData, session, patientData);
          return {
            vitals_data: data,
          };
        } catch (error) {
          return new GraphQLError(error);
        }

        // const result: any = await client.notes_vitals.findMany({
        //   take: 10,
        //   orderBy: {
        //     id: 'desc',
        //   },
        //   where: {
        //     // date: {
        //     //   gte: yearStartDate, // Greater than or equal to the start of the year
        //     //   lte: yearEndDate, // Less than or equal to the end of the year
        //     // },
        //     doctorID: session?.user?.id,
        //     patientID: Number(args?.data!.patientID),
        //   },
        //   include: {
        //     emr_patient: true,
        //   },
        // });
        // return result;
      },
    });
  },
});

const customizedFunction = async (args: any, myData: any, session: any, patientData: any) => {
  let vitals_data: any;

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  if (myData && !patientData) {
    const isLinked = myData && Number(myData?.link) === 1;
    if (myData && isLinked) {
      console.log('NASA EMR KA');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
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
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      console.log(vitalData, 'LINKED VITAL DATA');
      vitals_data = vitalData;
    } else {
      console.log('NASA EMR KA');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            isDeleted: '0',

            // doctorID: session?.user?.id,
            ...checkUser,
            emrPatientID: Number(myData?.id),
            // patientID: Number(patientData?.id),
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      vitals_data = vitalData;
    }
  } else if (args?.data.userType === 'patient') {
    console.log(args?.userType);
    const [vitalData]: any = await client.$transaction([
      client.notes_vitals.findMany({
        take: 10,
        orderBy: {
          id: 'desc',
        },
        where: {
          // date: {
          //   gte: yearStartDate, // Greater than or equal to the start of the year
          //   lte: yearEndDate, // Less than or equal to the end of the year
          // },
          patientID: session?.user?.id,
          // patientID: Number(isLinked?.patientID),
          isDeleted: '0',
        },
        include: {
          emr_patient: true,
        },
      }),
    ]);
    vitals_data = vitalData;
  } else {
    // for patient
    // -------------------
    const isLinked: any = await client.emr_patient.findFirst({
      where: {
        patientID: patientData?.patientInfo?.S_ID,
      },
    });

    if (Number(isLinked.link) === 1) {
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            // doctorID: session?.user?.id,
            ...checkUser,
            isDeleted: '0',
            OR: [
              {
                patientID: Number(isLinked?.patientID),
              },
              {
                emrPatientID: Number(isLinked?.id),
              },
            ],
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      vitals_data = vitalData;
    } else {
      console.log('@@', args?.data.userType);
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            patientID: session?.user?.id,
            isDeleted: '0',
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      vitals_data = vitalData;
      // console.log('@@', vitals_data);
    }
    // ----------------------
    // console.log(skip, take);
  }
  return {
    data: vitals_data,
  };
};

// doctor patient -------------------------------------------------------------

export const QueryNotesVitalsPatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesVitalsPatient', {
      type: vitalTransaction,
      args: { data: notesVitalInputType! },
      async resolve(_root, args, ctx) {
        const currentYear = new Date().getFullYear();
        const yearStartDate = startOfYear(new Date(currentYear, 0, 1));
        const yearEndDate = endOfYear(new Date(currentYear, 11, 31));

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_vitals`',
          '`QueryNotesVitalsPatient`'
        );

        try {
          // console.log('Ok na');
          const patientData = await client.user.findFirst({
            where: {
              uuid: String(args?.data!.uuid),
            },
            include: {
              patientInfo: true,
            },
          });

          const vitalsData = await client.notes_vitals.findFirst({
            where: {
              patientID: Number(patientData?.patientInfo?.S_ID),
            },
            include: {
              patientRelation: true,
            },
          });

          const { data }: any = await customFuncVitalPatient(
            args,
            session,
            patientData,
            vitalsData
          );
          return {
            vitals_data: data,
          };
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});

const customFuncVitalPatient = async (
  args: any,
  session: any,
  patientData: any,
  vitalsData: any
) => {
  let vitals_data: any;

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  if (patientData) {
    const isLinked = vitalsData.emrPatientID !== null;
    if (isLinked) {
      console.log(vitalsData, 'lnked');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            // doctorID: session?.user?.id,
            ...checkUser,

            OR: [
              {
                patientID: Number(patientData?.patientInfo?.S_ID),
              },
              {
                emrPatientID: Number(vitalsData.emrPatientID),
              },
            ],
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      // console.log(vitalData, 'LINKED VITAL DATA');
      vitals_data = vitalData;
    } else {
      console.log('non link');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            isDeleted: '0',

            // doctorID: session?.user?.id,
            ...checkUser,
            patientID: Number(patientData?.patientInfo?.S_ID),
            // patientID: Number(patientData?.id),
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      vitals_data = vitalData;
    }
  }
  return {
    data: vitals_data,
  };
};

// ----------------------------------------------------------------------------

// doctor EMR patient -------------------------------------------------------------

export const QueryNotesVitalsEMRPatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesVitalsEMRPatient', {
      type: vitalTransaction,
      args: { data: notesVitalInputType! },
      async resolve(_root, args, ctx) {
        const currentYear = new Date().getFullYear();
        const yearStartDate = startOfYear(new Date(currentYear, 0, 1));
        const yearEndDate = endOfYear(new Date(currentYear, 11, 31));

        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_vitals`',
          '`QueryNotesVitalsEMRPatient`'
        );

        try {
          // console.log('Ok na');
          const emrData = await client.emr_patient.findFirst({
            where: {
              id: Number(args?.data!.emrID),
            },
          });

          // const vitalsData = await client.notes_vitals.findFirst({
          //   where: {
          //     patientID: Number(patientData?.patientInfo?.S_ID),
          //   },
          //   include: {
          //     patientRelation: true,
          //   },
          // });

          const { data }: any = await customFuncVitalEMRPatient(
            args,
            session,
            emrData
            // vitalsData
          );
          return {
            vitals_data: data,
          };
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});

const customFuncVitalEMRPatient = async (
  args: any,
  session: any,
  emrData: any
  // vitalsData: any
) => {
  let vitals_data: any;

  const checkUser = (() => {
    if (session?.user?.role === 'secretary')
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    return {
      doctorID: session?.user?.id,
    };
  })();

  if (emrData) {
    const isLinked = emrData.link === 1;
    if (isLinked) {
      console.log(emrData, 'lnked');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            // doctorID: session?.user?.id,
            ...checkUser,

            OR: [
              {
                patientID: Number(emrData?.patientID),
              },
              {
                emrPatientID: Number(emrData.id),
              },
            ],
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      // console.log(vitalData, 'LINKED VITAL DATA');
      vitals_data = vitalData;
    } else {
      console.log('non link');
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: 10,
          orderBy: {
            id: 'desc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            isDeleted: '0',

            // doctorID: session?.user?.id,
            ...checkUser,
            emrPatientID: Number(emrData.id),
            // patientID: Number(patientData?.id),
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      vitals_data = vitalData;
    }
  }
  return {
    data: vitals_data,
  };
};

// ----------------------------------------------------------------------------

export const PostVitals = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostVitals', {
      type: notesVitalObj,
      args: { data: notesVitalInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        try {
          const vitals = await client.notes_vitals.create({
            data: {
              clinic: createData?.clinicID,
              report_id: createData?.recordID,
              patientID: createData?.patientID,
              doctorID: session?.user?.id,

              wt: createData?.weight,
              ht: createData?.height,
              bmi: createData?.bmi,
              bp1: createData?.bloodPresMM,
              bp2: createData?.bloodPresHG,
              spo2: createData?.oxygen,
              hr: createData?.heartRate,
              bt: createData?.bodyTemp,
              rr: createData?.respRate,
            },
          });
          const res: any = vitals;
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

export const PostVitalsEMR = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostVitalsEMR', {
      type: notesVitalObj,
      args: { data: notesVitalInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        try {
          const vitals = await client.notes_vitals.create({
            data: {
              clinic: createData?.clinicID,
              report_id: createData?.recordID,
              emrPatientID: createData?.emrID,
              doctorID: session?.user?.id,

              wt: createData?.weight,
              ht: createData?.height,
              bmi: createData?.bmi,
              bp1: createData?.bloodPresMM,
              bp2: createData?.bloodPresHG,
              spo2: createData?.oxygen,
              hr: createData?.heartRate,
              bt: createData?.bodyTemp,
              rr: createData?.respRate,
            },
          });
          const res: any = vitals;
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

// patient user side
export const notesUserVitalInputType = inputObjectType({
  name: 'notesUserVitalInputType',
  definition(t) {
    t.nullable.string('uuid');
  },
});

export const QueryNotesVitalsUser = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryNotesVitalsUser', {
      type: vitalTransaction,
      args: { data: notesUserVitalInputType! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`notes_vitals`',
          '`QueryNotesVitals`'
        );
        try {
          const [vitalData]: any = await client.$transaction([
            client.notes_vitals.findMany({
              take: 10,
              orderBy: {
                id: 'desc',
              },
              where: {
                patientID: Number(session?.user?.s_id),
                isDeleted: '0',
              },
            }),
          ]);

          const _result: any = vitalData;

          const response: any = {
            vitals_data: _result,
          };
          return response;
        } catch (error) {
          return new GraphQLError(error);
        }
      },
    });
  },
});

// user post vitals

export const PostVitalsUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('PostVitalsUser', {
      type: RecordObjectFields4Vitals,
      args: { data: notesVitalInputType! },
      async resolve(_parent, args, ctx) {
        const createData: any = args?.data;
        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`record`', 'PostVitalsUser');
        try {
          const vitalsTransaction = await client.$transaction(async (trx) => {
            const recordVitals = await trx.records.create({
              data: {
                patientID: Number(session?.user?.s_id),
              },
            });

            const vitals = await trx.notes_vitals.create({
              data: {
                report_id: Number(recordVitals.R_ID),
                patientID: session?.user?.s_id,

                wt: createData?.weight,
                ht: createData?.height,
                bmi: createData?.bmi,
                bp1: createData?.bloodPresMM,
                bp2: createData?.bloodPresHG,
                spo2: createData?.oxygen,
                hr: createData?.heartRate,
                bt: createData?.bodyTemp,
                rr: createData?.respRate,
              },
            });
            return {
              ...recordVitals,
              ...vitals,
              // tempId: uuid,
            };
          });
          console.log(vitalsTransaction, 'KLKLKL');
          const res: any = vitalsTransaction;
          return res;
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
});
