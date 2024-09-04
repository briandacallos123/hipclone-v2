/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLError } from 'graphql/error/GraphQLError';
// import { PrismaClient } from '@prisma/client';
import { unserialize } from 'php-serialize';
import { extendType, inputObjectType, objectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { useUpload } from '../../hooks/use-upload';
import useGoogleStorage from '@/hooks/use-google-storage-uploads';

/// ////////////////////////////////////////////////////
export const appt_payment_attachment_obj = objectType({
  name: 'appt_payment_attachment_obj',
  definition(t) {
    t.nullable.int('id');
    t.nullable.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.int('appt_id');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.string('filename');
    t.nullable.string('file_url');
    t.nullable.date('date');
    t.nullable.int('isDeleted');
  },
});
/// ////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
export const patient_payment_request = inputObjectType({
  name: 'patient_payment_request',
  definition(t) {
    t.nullable.int('patientID');
    t.nullable.int('doctorID');
    t.nullable.int('clinic');
    t.nullable.int('appt_id');
    t.nullable.string('patient');
    t.nullable.string('doctor');
    t.nullable.string('p_ref');
    t.nullable.string('p_desc');
  },
});
/// ////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////
export const patient_payment_transactions = objectType({
  name: 'patient_payment_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    // t.nullable.field('patient_payment_data', {
    //   type: 'String',
    // });
    // t.string('patient_payment_data');
    t.list.field('patient_payment_data', {
      type: appt_payment_attachment_obj,
    });
  },
});
/// ////////////////////////////////////////////////////

export const mutation_patient_payment = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('mutation_patient_payment', {
      type: patient_payment_transactions,
      args: {
        data: patient_payment_request!,
        file: 'Upload',
      },
      async resolve(_, args, ctx) {
        const { patientID, doctorID, clinic, appt_id, patient, doctor, p_ref, p_desc }: any =
          args.data;
        const { session } = ctx;
        await cancelServerQueryRequest(
          client,
          session?.user?.id,
          '`mutation_patient_payment`',
          'patient_payment_request'
        );

        console.log(session, 'session');
        let res: any;

        try {
          if (session.user.role === 'patient') {
            const findfirst_appt = await client.appt_payment_attachment.findFirst({
              where: {
                appt_id: appt_id,
              },
            });

            if (findfirst_appt) {
              res = {
                status: 'Failed',
                message: 'Create Payment Is Already Inserted',
              };
            } 
            
              res = await client.appointments.update({
                where: {
                  id: Number(appt_id),
                },
                data: {
                  p_ref,
                  p_desc,
                  // si doctor mag ddecide kung paid na or hindi pa.
                  // payment_status: 1,
                },
              });

              // const labReportID = res.id;

              const sFile = await args?.file;
              if (sFile) {
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString();

                const res: any = await useGoogleStorage(
                  sFile,
                  session?.user?.id,
                  'patientPaymentToAppt'
                );

                await client.appt_payment_attachment.create({
                  data: {
                    patientID,
                    doctorID,
                    clinic,
                    appt_id,
                    patient,
                    doctor,
                    filename: String(res.path),
                    file_url: String(res.path),
                    file_size: String(res.filesize),
                    file_type: String(res.filetype),
                    date: formattedDate,
                  },
                });

                // const uploadResult = await useUpload(sFile, 'public/documents/');
                // uploadResult.map(async (v: any) => {
                //   await client.appt_payment_attachment.create({
                //     data: {
                //       patientID,
                //       doctorID,
                //       clinic,
                //       appt_id,
                //       patient,
                //       doctor,
                //       filename: String(v.fileName),
                //       file_url: String(v.path),
                //       file_size: String(v.fileSize),
                //       file_type: String(v.fileType),
                //       date: formattedDate,
                //     },
                //   });
                // });
              }

              // console.log(session?.user,'HAAAAAAAAAAAA????????????????????')
             
              // const notifContent = await client.notification_content.create({
              //   data:{
              //     content:"send payment"
              //   }
              // })
             
             
              // await client.notification.create({
              //   data:{
              //     user_id:Number(session?.user?.id),
              //     notifiable_id:Number(doctorID),
              //     notification_type_id:8,
              //     notification_content_id:Number(notifContent?.id),
              //     appt_id:Number(appt_id)
              //   }
              // })

              res = {
                status: 'Success',
                message: 'Create Payment Successfully',
                // patient_payment_data: "",
                patient_payment_data: [res],
              };
            
          } else {
            res = {
              status: 'Failed',
              message: 'You are not permitted to perform this action',
              patient_payment_data: [],
            };
          }

          const notifContent = await client.notification_content.create({
            data: {
              content: "sent a payment"
            }
          })

          await client.notification.create({
            data: {
              user_id: Number(session?.user?.id),
              notifiable_id: Number(doctorID),
              notification_type_id: 8,
              notification_content_id: Number(notifContent?.id),
              appt_id: Number(appt_id),
              user_id_user_role: 5,
              notifiable_user_role: 2
            }
          })


        } catch (error) {
          throw new GraphQLError(error);
        }
        return res;
      },
    });
  },
});
