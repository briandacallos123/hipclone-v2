import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { DoctorAppointments } from './DoctorAppointments';

const CountType = objectType({
  name: 'CountType',
  definition(t) {
    t.int('queueCount');
    t.int('queueDone');
    t.int('queueCancelled');
  },
});

export const QueueCountInp = inputObjectType({
  name: 'QueueCountInp',
  definition(t) {
    t.nullable.string('uuid');
    t.nullable.string('userType');
  },
});

export const QueueReadCountPage = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueueReadCountPage', {
      type: CountType,
      args: { data: QueueCountInp! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;
        const { uuid }: typeof data = data;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const { session } = ctx;
        await cancelServerQueryRequest(client, session?.user?.id, '`appointments`', 'TodaysDone');

        // for done
        const checkUser = (() => {
          if (args?.data!.userType === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.id,
          };
        })();

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);
        
        try {
          
        const [queueAll, queueDone, queueCancelled]: any = await client.$transaction([
          client.appointments.findMany({
            where: {
              doctorID: session?.user?.id,
              NOT: [{ time_slot: null }, { patientInfo: null }],

              status: 1,
              clinicInfo: {
                uuid,
                isDeleted: 0,

                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                lte:currentDateBackward
              },
            },
            include: {
              patientInfo: true,
              clinicInfo: true,
              doctorInfo: true,
            },
          }),
          client.appointments.findMany({
            where: {
              ...checkUser,
              NOT: [{ time_slot: null }, { patientInfo: null }],
              // type: 1,
              status: 3,
              clinicInfo: {
                uuid,
                isDeleted: 0,

                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                lte:currentDateBackward
              },
            },
            include: {
              patientInfo: true,
              clinicInfo: true,
              doctorInfo: true,
            },
          }),
          client.appointments.findMany({
            where: {
              ...checkUser,
              NOT: [{ time_slot: null }, { patientInfo: null }],
              // type: 1,
              status: 2,
              clinicInfo: {
                uuid,
                isDeleted: 0,

                NOT: [{ clinic_name: null }, { clinic_name: '' }],
              },
              date: {
                gte: formattedDateAsDate,
                lte:currentDateBackward
              },
            },
            include: {
              patientInfo: true,
              clinicInfo: true,
              doctorInfo: true,
            },
          }),
        ]);

    
        return {
          queueCount: queueAll?.length,
          queueDone: queueDone?.length,
          queueCancelled: queueCancelled?.length,
        };
        } catch (error) {
          throw new GraphQLError(error)
        }
      },
    });
  },
});

export const queue_data = objectType({
  name:"queue_data",
  definition(t) {
    t.nullable.list.field('appointments_data',{
      type:DoctorAppointments
    }),
    t.int('position');
    t.boolean('is_not_today')
  },
})

export const QueuePatientInp = inputObjectType({
  name:"QueuePatientInp",
  definition(t){
    t.nullable.string("voucherCode")
    // t.nullable.string('uuid')
  }
})

export const QueuePatient = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueuePatient', {
      type: queue_data,
      args: { data: QueuePatientInp! },
      async resolve(_root, args, ctx) {

       try{
        const { voucherCode}:any = args?.data
        const { session } = ctx;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedDateAsDate = new Date(formattedDate);

        const currentDateBackward = new Date();
        currentDateBackward.setHours(23, 59, 59, 59);

        const appt = await client.appointments.findFirst({
          where:{
            voucherId:voucherCode
          }
        })
        // console.log(appt)

        const patient = await client.patient.findFirst({
          where:{
            S_ID:Number(appt?.patientID)
          }
        })


        // get clinic based on id of clinic on appt
        const clinicInfo = await client.clinic.findFirst({
          where:{
            id:Number(appt?.clinic)
          }
        })

        const resultFirst = await client.appointments.findMany({
          where:{
            isDeleted:0,
            status:1,
            clinicInfo: {
              uuid:clinicInfo?.uuid,
              isDeleted: 0,
              NOT: [{ clinic_name: null }, { clinic_name: '' }],
            },
            date: {
              gte: formattedDateAsDate,
              // lte: currentDateBackward,
            },
            
          },
          include: {
            clinicInfo: true,
          }
        })

        console.log(resultFirst,'HEHHE')

        const result = await client.appointments.findMany({
          where:{
            isDeleted:0,
            status:1,
            clinicInfo: {
              uuid:clinicInfo?.uuid,
              isDeleted: 0,
              NOT: [{ clinic_name: null }, { clinic_name: '' }],
            },
            date: {
              gte: formattedDateAsDate,
              lte: currentDateBackward,
            },
            
          },
          include: {
            clinicInfo: true,
          }
        })


        const position = result.map(async(it:any)=>{
          return await client.patient.findFirst({
            where:{
              S_ID:Number(it?.patientID)
            }
          })
        })

        const teka = await Promise.all(position);

        const patientPos = teka.findIndex((item:any)=>item.EMAIL === patient?.EMAIL)
        
     
        const haveSchedNotToday = () => {
          if(resultFirst?.length){
            return true
          }else{
            false
          }
        
        }

        // console.log(haveSchedNotToday(),'MERON BA?')


        return {
          appointments_data: resultFirst,
          position:patientPos !== -1 ? patientPos : (resultFirst && 1),
          is_not_today:haveSchedNotToday()
        }
       }catch(err){
        console.log(err,'__ERORR')
       }

      }
    })
  }
})
