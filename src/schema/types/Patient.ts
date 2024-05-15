// // /* eslint-disable no-lone-blocks */
// // /* eslint-disable default-case */
// // // import { PrismaClient } from '@prisma/client';
// // import { extendType, objectType, inputObjectType } from 'nexus';
// // import client from '../../../prisma/prismaClient';
// // import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';

// // // const client = new PrismaClient();




// export const Patient = objectType({
//   name: 'PatientInfo',
//   definition(t) {
//     t.id('S_ID');
//     t.int('IDNO');
//     t.string('FNAME');
//     t.string('LNAME');
//     t.string('MNAME');
//     t.string('EMAIL');
//     t.string('HOME_ADD');
//     t.string('CONTACT_NO');
//     t.int('SEX');
//     t.int('STATUS');
//     t.int('isDeleted');
//     t.nullable.list.field('medication', {
//       type: medication,
//     });
//     t.nullable.list.field('medicalhistory', {
//       type: medicalhistory,
//     });
//     t.nullable.list.field('smoking', {
//       type: smoking,
//     });
//     t.nullable.list.field('allergy', {
//       type: allergy,
//     });
//     t.nullable.list.field('family_history', {
//       type: family_history,
//     });
//     t.nullable.list.field('notes_vitals', {
//       type: notes_vitals,
//     });
//   },
// });

// // const medication = objectType({
// //   name: "medication",
// //   definition(t) {
// //       t.int("id");
// //       t.int("patientID");
// //       t.nullable.int("emrPatientID");
// //       t.nullable.int("doctorID");
// //       t.nullable.int("isEMR");
// //       t.nullable.string("patient");
// //       t.nullable.string("doctor");
// //       t.nullable.date("dateCreated");
// //       t.nullable.string("medication");
// //       t.nullable.int("isDeleted");
// //   },
// // });

// // const medicalhistory = objectType({
// //   name: "medicalhistory",
// //   definition(t) {
// //       t.int("id");
// //       t.int("patientID");
// //       t.nullable.int("emrPatientID");
// //       t.nullable.int("doctorID");
// //       t.nullable.int("isEMR");
// //       t.nullable.string("patient");
// //       t.nullable.string("doctor");
// //       t.nullable.date("dateCreated");
// //       t.nullable.string("medhistory");
// //       t.nullable.int("isDeleted");
// //   },
// // });

// // const allergy = objectType({
// //   name: "allergy",
// //   definition(t) {
// //       t.int("id");
// //       t.int("patientID");
// //       t.nullable.int("emrPatientID");
// //       t.nullable.int("doctorID");
// //       t.nullable.int("isEMR");
// //       t.nullable.string("patient");
// //       t.nullable.string("doctor");
// //       t.nullable.date("dateCreated");
// //       t.nullable.string("allergy");
// //       t.nullable.int("isDeleted");
// //   },
// // });

// // const smoking = objectType({
// //   name: "smoking",
// //   definition(t) {
// //       t.int("id");
// //       t.int("patientID");
// //       t.nullable.int("emrPatientID");
// //       t.nullable.int("doctorID");
// //       t.nullable.int("isEMR");
// //       t.nullable.string("patient");
// //       t.nullable.string("doctor");
// //       t.nullable.date("dateCreated");
// //       t.nullable.string("smoking");
// //       t.nullable.int("isDeleted");
// //   },
// // });

// const family_history = objectType({
//   name: "family_history",
//   definition(t) {
//       t.int("id");
//       t.int("patientID");
//       t.nullable.int("emrPatientID");
//       t.nullable.int("doctorID");
//       t.nullable.int("isEMR");
//       t.nullable.bigInt("patient");
//       t.nullable.string("doctor");
//       t.nullable.date("dateCreated");
//       t.nullable.string("family_history");
//       t.nullable.int("isDeleted");
//   },
// });


// const notes_vitals = objectType({
//   name: "notes_vitals",
//   definition(t) {
//       t.int("id");
//       t.nullable.int("patientID");
//       t.nullable.int("doctorID");
//       t.nullable.int("isEMR");
//       t.nullable.string("patient");
//       t.nullable.string("doctor");
//       t.nullable.int("clinic");
//       t.nullable.dateTime("date");
//       t.nullable.string("dateCreated");
//       t.nullable.int("report_id");
//       t.nullable.string("wt");
//       t.nullable.string("ht");
//       t.nullable.string("hr");
//       t.nullable.string("rr");
//       t.nullable.string("bmi");
//       t.nullable.string("bt");
//       t.nullable.string("spo2");
//       t.nullable.string("bp");
//       t.nullable.string("bp1");
//       t.nullable.string("bp2");
//       t.nullable.string("chiefcomplaint");
//       t.nullable.string("isDeleted");
//   },
// });






// // export const AllPatientInputType = inputObjectType({
// //   name: 'AllPatientInputType',
// //   definition(t) {
// //     t.nullable.int('sex');
// //     t.nullable.int('take');
// //     t.nullable.int('skip');
// //     t.nullable.string('orderBy');
// //     t.nullable.string('orderDir');
// //     t.nullable.string('searchKeyword');
// //   },
// // });

// // const SummaryObject = objectType({
// //   name: 'SummaryObjects',
// //   definition(t) {
// //     t.nullable.int('total');
// //     t.nullable.int('male');
// //     t.nullable.int('female');
// //     t.nullable.int('unspecified');
// //   },
// // });

// // export const PatientTransactionObject = objectType({
// //   name: 'PatientTransactionObject',
// //   definition(t) {
// //     t.nullable.list.field('patient_data', {
// //       type: Patient,
// //     });
// //     t.int('total_records');
// //     t.field('summary', {
// //       type: SummaryObject,
// //     });
// //   },
// // });

// // export const QueryAllPatient = extendType({
// //   type: 'Query',
// //   definition(t) {
// //     t.nullable.field('QueryAllPatient', {
// //       type: PatientTransactionObject,
// //       args: { data: AllPatientInputType! },
// //       async resolve(_root, args, ctx) {
// //         const data: any | typeof args.data = args.data;
// //         const { take, skip, orderBy, orderDir }: typeof data = data;

// //         let order: any;
// //         switch (args?.data!.orderBy) {
// //           case 'name':
// //             {
// //               order = [{ FNAME: args?.data!.orderDir }];
// //             }
// //             break;
// //           case 'email':
// //             {
// //               order = [{ EMAIL: args?.data!.orderDir }];
// //             }
// //             break;
// //           case 'phoneNumber':
// //             {
// //               order = [{ CONTACT_NO: args?.data!.orderDir }];
// //             }
// //             break;
// //           case 'gender':
// //             {
// //               order = [{ SEX: args?.data!.orderDir }];
// //             }
// //             break;
// //           default:
// //             order = {};
// //         }
// //         const orderConditions = {
// //           orderBy: order,
// //         };
// //         const whereconditions = filters(args);
// //         const sex = (() => {
// //           if (args?.data?.sex === -1) return {};
// //           return {
// //             SEX: Number(args?.data!.sex),
// //           };
// //         })();

        

//         const { session } = ctx;
//         console.log(session,"weqwe")
//         await cancelServerQueryRequest(client, session?.user?.id, '`patient`', 'QueryAllPatient');
//         try {
//           const [patient, _count, count]: any = await client.$transaction([
//             client.patient.findMany({
//               take,
//               skip,
//               where: {
//                 ...sex,
//                 ...whereconditions,
//               },
//               ...orderConditions,
//               include:{
//                 medication:{
//                   where:{
//                     isDeleted: 0,
//                     doctorID:session?.user?.id,
//                   }
//                 },
//                 medicalhistory:{
//                   where:{
//                     isDeleted: 0,
//                     doctorID:session?.user?.id,
//                   }
//                 },
//                 smoking:{
//                   where:{
//                     isDeleted: 0,
//                     doctorID:session?.user?.id,
//                   }
//                 },
//                 allergy:{
//                   where:{
//                     isDeleted: 0,
//                     doctorID:session?.user?.id,
//                   }
//                 },
//                 family_history:{
//                   where:{
//                     isDeleted: 0,
//                     doctorID:session?.user?.id,
//                   }
//                 },
//                 notes_vitals:{
//                   where:{
//                     isDeleted: "0",
//                     isEMR: 0,
//                   }
//                 },
//               }
//             }),
//             client.patient.groupBy({
//               by: ['SEX'],
//               orderBy: {
//                 SEX: 'asc',
//               },
//               where: {
//                 AND: [{ isDeleted: 0 }, { ...whereconditions }],
//               },
//               _count: {
//                 S_ID: true,
//               },
//             }),
//             client.patient.aggregate({
//               where: {
//                 // OR: [{ ...sex }, { ...whereconditions }],
//                 ...whereconditions,
//                 ...sex,
//               },
//               _count: {
//                 S_ID: true,
//               },
//             }),
//           ]);
//           const _result: any = patient;
//           const _total: any = count;
//           const _totalSum: any = _count;
//           let total = 0;
//           _totalSum.map((i: any) => (total += i?._count?.S_ID));
//           const totalSum = {
//             total,
//             male: _totalSum.find((v: any) => v?.SEX === 1)?._count?.S_ID,
//             female: _totalSum.find((v: any) => v?.SEX === 2)?._count?.S_ID,
//             unspecified: _totalSum.find((v: any) => v?.SEX === 3)?._count?.S_ID,
//           };


//           // console.log(transformedPatients);

//           const response: any = {
//             patient_data: _result,
//             total_records: Number(_total?._count?.S_ID),
//             summary: totalSum,

//           };
//           return response;
//         } catch (error) {
//           /*  throw new Error('Request cancelled.') */
//         }
//       },
//     });
//   },
// });

// const filters = (args: any) => {
//   let whereConSearch: any = {};
//   let multicondition: any = {};
//   if (args?.data!.searchKeyword) {
//     whereConSearch = {
//       OR: [
//         {
//           FNAME: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           LNAME: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           MNAME: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           EMAIL: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           CONTACT_NO: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           HOME_ADD: {
//             contains: args?.data!.searchKeyword,
//           },
//         },
//         {
//           AND: [
//             {
//               FNAME: {
//                 contains: args?.data!.searchKeyword,
//               },
//             },
//             {
//               LNAME: {
//                 contains: args?.data!.searchKeyword,
//               },
//             },
//           ],
//         },
//       ],
//     };
//   }
//   multicondition = {
//     ...multicondition,
//     ...{
//       ...whereConSearch,
//     },
//   };
//   return multicondition;
// };





