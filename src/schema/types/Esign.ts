import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import useGoogleStorage from '@/hooks/use-google-storage-uploads2';

// doctorID
// idno
// filename
// type
// uploaded

const client = new PrismaClient();

export const EsignObj = objectType({
  name: 'EsignObj',
  definition(t) {
    t.id('id');
    t.int('doctorID');
    t.int('idno');
    t.string('filename');
    t.int('type');
    t.dateTime('upload');
    t.nullable.field('DoctorInfo', {
      type: DoctorObjectFields4Esign,
    });
  },
});
export const EsignObjSig = objectType({
  name: 'EsignObjSig',
  definition(t) {
    t.string('message');
  },
});

const DoctorObjectFields4Esign = objectType({
  name: 'DoctorObjectFields4Esign',
  definition(t) {
    t.id('EMP_ID');
    t.string('EMP_FULLNAME');
  },
});

export const EsignInputType = inputObjectType({
  name: 'EsignInputType',
  definition(t) {
    t.nullable.int('doctorID');
  },
});

export const EsignInputTypeWFile = inputObjectType({
  name: 'EsignInputTypeWFile',
  definition(t) {
    t.nullable.int('type');
  },
});

export const EsignInputTypeWFileUser = inputObjectType({
  name: 'EsignInputTypeWFileUser',
  definition(t) {
    t.nullable.int('type');
  },
});

export const QueryEsign = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryEsign', {
      type: EsignObj,
      args: { data: EsignInputType! },
      async resolve(_root, args, _ctx) {
        const result: any = await client.esig_dp.findFirst({
          where: {
            doctorID: 6,
          },
          include: {
            doctorInfo: true,
          },
        });
        return result;
      },
    });
  },
});

export const MutationESign = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('MutationESign', {
      type: EsignObjSig,
      args: { data: EsignInputTypeWFile!, file: 'Upload' },
      async resolve(_root, args, _ctx) {
        const { session } = _ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`clinic`', 'allClinic');

        try {
          const sFile = await args?.file;

          let uploadResult: any;

          if (sFile) {
            uploadResult = await useGoogleStorage(
              sFile,
              Number(session?.user?.id),
              'userDisplayEsign'
              );

            await client.esig_dp.create({
                data: {
                  type: args?.data?.type,
                  doctorID: Number(session?.user?.id),
                  filename: String(uploadResult.path),
                },
              });

            // uploadResult = await useUpload(sFile, 'public/documents/');
            // uploadResult.map(async (v: any) => {
            //   await client.esig_dp.create({
            //     data: {
            //       type: args?.data?.type,
            //       doctorID: Number(session?.user?.id),
            //       filename: String(v.path),
            //     },
            //   });
            // });
          }

          console.log(uploadResult, 'WEEEEEEEEEEE');

          return {
            message: String(uploadResult.path),
          };
        } catch (err) {
          return err;
        }
      },
    });
  },
});

export const MutationESignUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('MutationESignUser', {
      type: 'String',
      args: { data: EsignInputTypeWFileUser!, file: 'Upload' },
      async resolve(_root, args, _ctx) {
        const { session }: any = _ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`clinic`', 'allClinic');

        try {
          const id = await client.employees.findFirst({
            where: {
              EMP_EMAIL: session.user.email,
            },
          });

          const result = await client.employees.update({
            where: {
              EMP_ID: id?.EMP_ID,
            },
            data: {
              signature: Number(args?.data?.type),
            },
          });

          return String(args?.data?.type);
        } catch (err) {
          return err;
        }
      },
    });
  },
});
