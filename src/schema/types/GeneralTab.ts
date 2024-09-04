import { extendType, objectType, inputObjectType } from 'nexus';
import { GraphQLError } from 'graphql/error/GraphQLError';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import useGoogleStorage from '@/hooks/use-google-storage-uploads';

export const GeneralTabInput = inputObjectType({
  name: 'GeneralTabInput',
  definition(t) {
    // t.nullable.string('fname');
    // t.nullable.string('lname');

    // t.nullable.string('email');
    t.nullable.string('fname');
    t.nullable.string('mname');
    t.nullable.string('gender');
    t.nullable.string('nationality');
    t.nullable.string('lname');
    t.nullable.string('suffix');
    t.nullable.string('address');
    t.nullable.string('contact');
    t.nullable.string('contact');
    t.nullable.dateTime('birthDate');

  },
});

const GeneralTabType = objectType({
  name: 'GeneralTabType',
  definition(t) {
    // t.nullable.string('nationality');
    t.field('status', {
      type: 'String',
    });
    t.field('message', {
      type: 'String',
    });
    t.field('EmployeeObj', {
      type: EmployeeObj,
    });
  },
});
const EmployeeObj = objectType({
  name: 'EmployeeObj',
  definition(t) {
    t.id('EMP_ID');
    t.nullable.string('EMP_FNAME');
    t.nullable.string('EMP_MNAME');
    t.nullable.string('EMP_LNAME');
    t.nullable.string('EMP_EMAIL');
    t.nullable.string('EMP_SEX');
    t.nullable.string('EMP_NATIONALITY');
    t.nullable.string('EMP_SUFFIX');
    t.nullable.string('EMP_ADDRESS'); //  = 1
    t.nullable.string('CONTACT_NO'); //  = 1
  },
});

function assignEmployees(data) {
  const { fname, name, mname, email, gender, contact, lname, nationality, suffix, address } = data;

  return {
    EMP_FNAME: fname,
    EMP_MNAME: mname,
    EMP_LNAME: lname,
    EMP_EMAIL: email,
    EMP_SEX: gender,
    EMP_NATIONALITY: nationality,

    EMP_SUFFIX: suffix,
    EMP_ADDRESS: address,
    CONTACT_NO: contact,
  };
}
function extractDateFromISOString(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const GeneralTabMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('GeneralTabMutation', {
      type: GeneralTabType,
      args: { data: GeneralTabInput!, file: 'Upload' },
      async resolve(_, args, _ctx) {
        let targetTable: any = '';

        const { session } = _ctx;

        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`prescriptions`',
          'QueryAllPrescription'
        );


        switch (session?.user?.role) {
          case 'doctor':
            targetTable = 'employees';
            break;

          case 'secretary':
            targetTable = 'sub_account';
            break;

          default:
            targetTable = 'patient';
            break;
        }

        // console.log(targetTable, 'WEW?@@@');

        try {
          let response: any;

          if (targetTable === 'employees') {
            const empData = assignEmployees(args?.data);

            response = await client.employees
              .update({
                where: {
                  EMP_ID: session?.user?.id,
                },
                data: empData,
              })
              .then(async (result: any) => {
                const sFile = await args?.file;

                if (sFile?.type !== undefined) {
                  const res: any = await useGoogleStorage(
                    sFile,
                    session?.user?.id,
                    'userDisplayProfile'
                  );
                  await client.display_picture.create({
                    data: {
                      userID: session?.user?.id,
                      idno: String(result?.EMPID),
                      filename: String(res!.path),
                    },
                  });
                }

                return result;
              });
          } else if (targetTable === 'sub_account') {
            const { fname, mname, gender, nationality, lname, suffix, address, contact }: any =
              args?.data;

            const secretary: any = await client.user.findFirst({
              where: {
                id: Number(session?.user?.id),
              },
            });

            const secId: any = await client.sub_account.findFirst({
              where: {
                email: secretary?.email,
              },
            });

            response = await client.sub_account
              .update({
                where: {
                  id: Number(secId?.id),
                },
                data: {
                  fname: fname,
                  mname: mname,
                  lname: lname,
                  gender: String(gender),
                  suffix: suffix,
                  mobile_no: contact,
                },
              })
              .then(async (result: any) => {
                const sFile = await args?.file;

                if (sFile?.type !== undefined) {
                  // console.log('Wwalang file');
                  const res: any = useUpload(sFile, 'public/uploads/');
                  res?.map(async (v: any) => {
                    await client.display_picture.create({
                      data: {
                        userID: session?.user?.id,
                        idno: null,
                        filename: String(v!.path),
                      },
                    });
                  });
                }

                return result;
              });
          } else if (targetTable === 'patient') {


            const { fname, mname, gender, nationality, lname, suffix, address, contact, birthDate }: any =
              args?.data;


            const bday = extractDateFromISOString(birthDate);

            const updatedData = {
              FNAME: fname,
              MNAME: mname,
              LNAME: lname,
              SEX: Number(gender),
              NATIONALITY: nationality,
              SUFFIX: suffix,
              HOME_ADD: address,
              CONTACT_NO: contact,
              BDAY: bday
            };

            const patientId = await client.user.findFirst({
              where: {
                id: Number(session?.user?.id),
              },
              include: {
                patientInfo: {
                  select: {
                    S_ID: true,
                  },
                },
              },
            });
            // console.log('PATIENTID: ', patientId?.patientInfo?.S_ID);
            // console.log('Nasa patient sya pre', updatedData, Number(session?.user?.id));

            response = await client.patient
              .update({
                where: {
                  S_ID: Number(patientId?.patientInfo?.S_ID),
                },
                data: updatedData,
              })
              .then(async (result: any) => {
                const sFile = await args?.file;

                if (sFile?.type !== undefined) {
                  // const res: any = useUpload(sFile, 'public/uploads/');
                  const res: any = await useGoogleStorage(
                    sFile,
                    session?.user?.id,
                    'userDisplayProfile'
                  );

                  await client.display_picture.create({
                    data: {
                      userID: session?.user?.id,
                      idno: String(result?.IDNO),
                      filename: String(res!.path),
                    },
                  });
                }

                return result;
              });
          }

          const responseData = {
            status: 'success',
            message: 'Updated successfully',
            EmployeeObj: response,
          };

          return responseData;
        } catch (err) {
          console.log(err)
          return new GraphQLError(err);
        }
      },
    });
  },
});
