import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { subYears, startOfYear, endOfYear } from 'date-fns';
import { cancelServerQueryRequest } from '../../../utils/cancel-pending-query';
import { isToday } from '@/utils/format-time';
import { GraphQLError } from 'graphql/error/GraphQLError';

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
    t.string('bsm');
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
    t.nullable.string('dateCreated');
    t.nullable.int('doctorID');
    t.nullable.int('skip');
    t.nullable.boolean('isEmr');
    t.nullable.int('take');
    t.nullable.int('emrID');
    t.nullable.string('weight');
    t.nullable.string('height');
    t.nullable.int('vital_id')
    t.nullable.string('category_delete');
    t.nullable.string('bmi');
    t.nullable.string('bloodPresMM');
    t.nullable.string('bloodPresHG');
    t.nullable.string('oxygen');
    t.nullable.string('respRate');
    t.nullable.string('heartRate');
    t.nullable.string('bsm');
    t.nullable.string('bodyTemp');
    t.nullable.list.field('categoryValues', {
      type: categoryValues
    })
  },
});

const categoryValues = inputObjectType({
  name: "categoryValues",
  definition(t) {
    t.string('title');
    t.int('value')
  },
})

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
// ito yung sa patient > view
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
          const patientData = await client.user.findFirst({
            where: {
              uuid: String(args?.data!.uuid),
            },
            include: {
              patientInfo: true,
            },
          });
          // console.log(patientData, 'Ok naaaaaaaaaaaaaa');

          const vitalsData = await client.notes_vitals.findFirst({
            where: {
              patientID: Number(patientData?.patientInfo?.S_ID),
            },
            include: {
              patientRelation: true,
            },

          });

          const emrPatientRec = await client.emr_patient.findFirst({
            where: {
              patientID: patientData?.patientInfo?.S_ID
            },
            orderBy: {
              date_added: 'desc'
            }
          })

     

          const { data }: any = await customFuncVitalPatient(
            args,
            session,
            patientData,
            vitalsData,
            emrPatientRec,

          );

          // console.log(data,'PAGTINGINNNNNNNNNNN!!!!!!!!!!!!!!!!!!!!!!!!')
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

const DeleteNotesVitalPatientType = objectType({
  name: "DeleteNotesVitalPatientType",
  definition(t) {
    t.string("message")
  },
})

const isNumber = (value) => {
  const regex = /^-?\d+(\.\d+)?$/; // Matches integers and decimal numbers
  return regex.test(value);
};

export const DeleteNotesVitalPatient = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('DeleteNotesVitalPatient', {
      type: DeleteNotesVitalPatientType,
      args: { data: notesVitalInputType! },
      async resolve(_root, args, ctx) {
        const createData = args?.data;
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

        let category_data = args?.data?.category_delete;

        if (isToday(createData?.dateCreated)) {
          try {

            if (!isNumber(category_data)) {

              await client.notes_vitals.update({
                data: {
                  [category_data]: '0'
                },
                where: {
                  id: Number(args?.data?.vital_id)
                }
              })

            } else {

              console.log(Number(category_data), 'awit')
              await client.vital_data.update({
                data: {
                  isDeleted: 1
                },
                where: {
                  id: Number(args?.data?.vital_id)
                }
              })
            }
            return {
              message: "Successfully deleted"
            };
          } catch (error) {
            console.log(error, 'error')
            return new GraphQLError(error);
          }
        } else {
          throw new GraphQLError("Unable to update")

        }



      },
    });
  },
});

const customFuncVitalPatient = async (
  args: any,
  session: any,
  patientData: any,
  vitalsData: any,
  emrPatientRec: any
) => {
  let vitals_data: any;

  let doctorDetails = await client.employees.findFirst({
    where: {
      EMP_EMAIL: session?.user?.email
    }
  })


  let valuesData: any = {
    OR: []
  }
  const checkUser = (() => {
    if (session?.user?.role === 'secretary') {
      return {
        doctorID: session?.user?.permissions?.doctorID,
      };
    }
    return {
      doctorID: session?.user?.doctor_id
    };
  })();

  if (emrPatientRec) {
    valuesData.OR.push({
      emrPatientID: emrPatientRec.id
    })
  }
  // patient
  if (emrPatientRec) {
    valuesData.OR.push({
      patientID: Number(patientData?.patientInfo?.S_ID)
    })
  }


  const getEmrpatientByDoctor = await client.emr_patient.findMany({
    where: {
      ...checkUser
    }
  })
  const emrPatientList: any = getEmrpatientByDoctor?.map((item) => item.patientID);


  if (patientData) {

    // pag emr siya
    if (emrPatientRec) {
      // console.log('dito preee')

      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: args?.data?.take,
          skip: args?.data?.skip,
          orderBy: {
            id: 'asc',
          },
          where: {
           
            AND: [
              {
                OR:[
                  {
                    ...checkUser
                  },
                  {
                    doctorID: null
                  },
                
                ]
              },
              {
                OR:[
                  {
                    patientID: {
                      in: emrPatientList
                    }
                  },
                  {
                    patientID:null
                  }
                ]
              }
            ],
            ...valuesData,
            isDeleted: '0',
          

            // OR: [
            //   {
            //     patientID: Number(patientData?.patientInfo?.S_ID),
            //   },
            //   {
            //     emrPatientID: Number(emrPatientRec?.id),
            //   },
            // ],
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);

      // console.log(vitalData, "BATTLEEEEEEEE");

      // console.log(vitalData, 'LINKED VITAL DATA');
      vitals_data = vitalData;
    } else {

      // valuesData = valuesData?.OR?.filter((item)=>Object.keys(item)[0] !== 'emrPatientID');

      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: args?.data?.take,
          skip: args?.data?.skip,
          orderBy: {
            id: 'asc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            isDeleted: '0',
            ...checkUser,
            ...valuesData,
            // patientID: Number(patientData?.patientInfo?.S_ID),
            // patientID: Number(patientData?.id),
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      // console.log(vitalData,'WLANG UTAKKK!!!!!!!', Number(patientData?.patientInfo?.S_ID));

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
          console.log(error, 'error behhh')
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
      doctorID: session?.user?.doctor_id,
    };
  })();

  const getEmrpatientByDoctor = await client.emr_patient.findMany({
    where: {
      ...checkUser
    }
  })
  const emrPatientList: any = getEmrpatientByDoctor?.filter((item) => item.patientID)?.map((item)=>item.patientID)

  const emrList = (()=>{
    if(emrPatientList.length === 0) return;
    return {
      patientID: {
        in: emrPatientList
      }
    }
  })()

  if (emrData) {

    const isLinked = emrData.link === 1;

    if (isLinked) {
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: args?.data?.take,
          orderBy: {
            id: 'asc',
          },
          where: {

            AND: [
              {
                OR:[
                  {
                    ...checkUser
                  },
                  {
                    doctorID: null
                  },
                
                ]
              },
              {
                OR:[
                  {
                    ...emrList
                  },
                  {
                    patientID:null
                  }
                ]
              }
            ],
            OR: [
              {
                patientID: Number(emrData?.patientID),
              },
              {
                emrPatientID: Number(emrData.id),
              },

              // {
              //   AND:[
              //     {
              //       ...checkUser
              //     }
              //   ]
              // }
            ]
          },
          include: {
            emr_patient: true,
          },
        }),
      ]);
      // console.log(vitalData, 'LINKED VITAL DATA');
      vitals_data = vitalData;
    } else {
 
      const [vitalData]: any = await client.$transaction([
        client.notes_vitals.findMany({
          take: args?.data?.take,
          orderBy: {
            id: 'asc',
          },
          where: {
            // date: {
            //   gte: yearStartDate, // Greater than or equal to the start of the year
            //   lte: yearEndDate, // Less than or equal to the end of the year
            // },
            isDeleted: '0',

            // doctorID: session?.user?.id,
            AND: [
              {
                OR: [
                  {
                    doctorID: null,
                  },
                  {
                    ...checkUser
                  }
                ]
              },
              {
                OR:[
                  {
                    ...emrList
                  },
                  {
                    patientID:null
                  }
                ]
              }
            ],
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
          let patientData: any;
          let emrPatient: any;
          let emrPatientData: any;



          if (!createData?.isEmr) {
            patientData = await client.user.findFirst({
              where: {
                uuid: createData?.uuid
              },
              include: {
                patientInfo: true
              }
            })





          } else {
            emrPatient = await client.emr_patient.findFirst({
              where: {
                id: Number(createData?.uuid)
              }
            })
          }


          emrPatientData = await client.emr_patient.findFirst({
            where: {
              OR: [
                {
                  patientID: patientData?.patientInfo?.S_ID
                },
                {
                  id: emrPatient?.id
                },
              ]
            }
          })


          let doctorData: any;

          if (session?.user?.role === 'doctor') {
            doctorData = await client.employees.findFirst({
              where: {
                EMP_EMAIL: session?.user?.email
              }
            })
          }


          if (createData?.categoryValues && createData?.categoryValues?.length !== 0) {
            console.log("meron naman")
            const result = createData?.categoryValues.map(async (item) => {

              if (Number(item?.value) !== 0) {

                const categoryId = await client.vital_category.findFirst({
                  where: {
                    title: item?.title,
                    OR: [
                      {
                        patientId: Number(createData?.patientID) || Number(patientData?.patientInfo?.S_ID),
                      },
                      {
                        emrPatientId: emrPatientData?.id
                      }
                    ],
                    isDeleted: 0
                  }
                })

                const vitalData = await client.vital_data.create({
                  data: {
                    patientId: Number(createData?.patientID) || Number(patientData?.patientInfo?.S_ID),
                    doctorId: Number(doctorData?.EMP_ID),
                    categoryId: Number(categoryId?.id),
                    value: item?.value,
                    isEMR: createData?.isEmr ? 1 : null,
                    emrPatientId: emrPatient ? emrPatient?.id : null,
                  }
                })

                return vitalData
              }
            })

            await Promise.all(result)
          }


          const vitals = await client.notes_vitals.create({
            data: {
              // clinic: createData?.clinicID,
              report_id: createData?.recordID,
              patientID: patientData?.patientInfo?.S_ID || createData?.patientID,
              doctorID: Number(doctorData?.EMP_ID),
              isEMR: createData?.isEmr ? 1 : null,
              emrPatientID: emrPatient ? emrPatient?.id : null,


              wt: createData?.weight !== "0" ? createData?.weight : null,
              ht: createData?.height !== "0" ? createData?.height : null,
              bmi: createData?.bmi !== "0.00" ? createData?.bmi : null,
              bp1: createData?.bloodPresMM !== "0" ? createData?.bloodPresMM : null,
              bp2: createData?.bloodPresHG !== "0" ? createData?.bloodPresHG : null,
              spo2: createData?.oxygen !== "0" ? createData?.oxygen : null,
              hr: createData?.heartRate !== "0" ? createData?.heartRate : null,
              bt: createData?.bodyTemp !== "0" ? createData?.bodyTemp : null,
              rr: createData?.respRate !== "0" ? createData?.respRate : null,
              bsm: createData?.bsm !== "0" ? createData?.bsm : null,
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

          if (createData?.categoryValues && createData?.categoryValues?.length !== 0) {
            const result = createData?.categoryValues.map(async (item) => {
              if (Number(item?.value) !== 0) {
                const categoryId = await client.vital_category.findFirst({
                  where: {
                    title: item?.title,
                    emrPatientId: createData?.emrID,
                    isDeleted: 0
                  }
                })

                const vitalData = await client.vital_data.create({
                  data: {

                    doctorId: Number(session?.user?.doctor_id),
                    categoryId: Number(categoryId?.id),
                    value: item?.value,
                    isEMR: 1,
                    emrPatientId: createData?.emrID
                  }
                })

                return vitalData
              }
            })

            await Promise.all(result)
          }

          const vitals = await client.notes_vitals.create({
            data: {
              clinic: createData?.clinicID,
              report_id: createData?.recordID,
              emrPatientID: createData?.emrID,
              doctorID: session?.user?.doctor_id,
              isEMR: 1,

              wt: createData?.weight !== "0" ? createData?.weight : null,
              ht: createData?.height !== "0" ? createData?.height : null,
              bmi: createData?.bmi !== "0.00" ? createData?.bmi : null,
              bp1: createData?.bloodPresMM !== "0" ? createData?.bloodPresMM : null,
              bp2: createData?.bloodPresHG !== "0" ? createData?.bloodPresHG : null,
              spo2: createData?.oxygen !== "0" ? createData?.oxygen : null,
              hr: createData?.heartRate !== "0" ? createData?.heartRate : null,
              bt: createData?.bodyTemp !== "0" ? createData?.bodyTemp : null,
              rr: createData?.respRate !== "0" ? createData?.respRate : null,
              bsm: createData?.bsm !== "0" ? createData?.bsm : null,
            },
          });
          const res: any = vitals;
          return {
            ...res,
          };
        } catch (e) {
          console.log(e);
          throw new GraphQLError(e);
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
    t.nullable.int('take')
  },
});

// para kay patient lang to

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

          const patientDetails: any = {
            OR: []
          }

          const emrPatient = await client.emr_patient.findFirst({
            where: {
              patientID: session?.user?.s_id
            }
          })

          if (emrPatient) {
            patientDetails.OR.push({
              emrPatientID: emrPatient.id
            })
          }
          patientDetails.OR.push({
            patientID: Number(session?.user?.s_id)
          })

          const [vitalData]: any = await client.$transaction([
            client.notes_vitals.findMany({
              take: args?.data?.take,
              orderBy: {
                id: 'asc',
              },
              where: {
                ...patientDetails,
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
          let patientDetails: any = {
            OR: []
          }
          const emrPatient = await client.emr_patient.findFirst({
            where: {
              patientID: session?.user?.s_id
            }
          })
          // pwede mag create ng vitals si patient, so hindi laging may value yung doctorId 
          if (session?.user?.role === 'patient') {
            patientDetails.OR.push({
              patientId: session?.user?.s_id
            })
          }
          if (emrPatient) {
            patientDetails.OR.push({
              emrPatientId: emrPatient.id
            })
          }
          const doctorIdCon = (() => {
            if (session?.user?.role !== 'patient') {
              return session?.user?.id
            }
          })()


          if (createData?.categoryValues && createData?.categoryValues?.length !== 0) {
            const result = createData?.categoryValues.map(async (item) => {
              if (!item?.value) return;
              const categoryId = await client.vital_category.findFirst({
                where: {
                  title: item?.title,
                  ...patientDetails,
                  isDeleted: 0
                },
                select: {
                  id: true
                }
              })

              const vitalData = await client.vital_data.create({
                data: {
                  patientId: session?.user?.s_id,
                  doctorId: doctorIdCon,
                  categoryId: categoryId?.id,
                  value: item?.value,
                }
              })

              return vitalData
            })

            await Promise.all(result)
          }


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

                wt: createData?.weight !== "0" ? createData?.weight : null,
                ht: createData?.height !== "0" ? createData?.height : null,
                bmi: createData?.bmi !== "0.00" ? createData?.bmi : null,
                bp1: createData?.bloodPresMM !== "0" ? createData?.bloodPresMM : null,
                bp2: createData?.bloodPresHG !== "0" ? createData?.bloodPresHG : null,
                spo2: createData?.oxygen !== "0" ? createData?.oxygen : null,
                hr: createData?.heartRate !== "0" ? createData?.heartRate : null,
                bt: createData?.bodyTemp !== "0" ? createData?.bodyTemp : null,
                rr: createData?.respRate !== "0" ? createData?.respRate : null,
              },
            });
            console.log(vitals, 'VITALSSSSSSS')
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
          console.log(e, 'error mo bihhhhhhhhhhhhh');
          throw new GraphQLError(e)
        }
      },
    });
  },
});
