import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';

export const FieldClinics = objectType({
  name: 'FieldClinics',
  definition(t) {
    t.int('id');
    t.string('clinic_name');
    t.string('number');
    t.string('Province');
    t.string('location');
    t.int('doctorID');
    t.string('doctor_idno');
    t.int('doctorID');
    t.int('isDeleted');
    t.nullable.field('Patient', {
      type: PatientClinic,
    });
  },
});

export const ClinicFields = objectType({
  name: 'ClinicFields',
  definition(t) {
    t.id('id');
    t.string('clinic_name');
    t.string('number');
    t.string('Province');
    t.string('location');
    t.int('doctorID');
    t.string('doctor_idno');
    t.int('doctorID');
    t.int('isDeleted');
  },
});

export const PatientClinic = objectType({
  name: 'PatientInfo',
  definition(t) {
    t.id('S_ID');
  },
});

export const DoctorInputs = inputObjectType({
  name: 'DoctorInputs',
  definition(t) {
    // t.nullable.int('sex');
    t.nullable.string('id');
    t.nullable.string('uuid');
    t.nullable.list.field('clinicIds', { type: 'Int' });
  },
});
export const DoctorInputsHistory = inputObjectType({
  name: 'DoctorInputsHistory',
  definition(t) {
    // t.nullable.int('sex');
    t.nullable.string('id');
    t.nullable.string('uuid');
    t.nullable.int('take');
  },
});

export const DoctorClinics = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('doctorClinics', {
      type: FieldClinics,
      args: { data: DoctorInputs! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;
        // const { id }: typeof data = data;

        // console.log(id, 'args@');
        const { session } = ctx;

        const checkUser = (() => {
          if (session?.user?.role === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };
          return {
            doctorID: session?.user?.doctor_id,
          };
        })();

        const result: any = await client.clinic.findMany({
          where: {
            // doctor_idno: '10000',
            // doctor_idno: id,
            // OR: [{ doctorID: session?.user?.id }],
            ...checkUser,
            isDeleted: 0,
            NOT: [{ isDeleted: null }, { clinic_name: '' }],
          },
          distinct: ['clinic_name'],
          include: {
            patient: true,
          },
        });

        return result;
      },
    });
  },
});

export const DoctorClinicsHistory = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('DoctorClinicsHistory', {
      type: FieldClinics,
      args: { data: DoctorInputsHistory! },
      async resolve(_root, args, ctx) {
        const data: any | typeof args.data = args.data;

        // console.log(args?.data, 'args@');
        const { session } = ctx;

        const checkUser = await(async() => {
          if (session?.user?.role === 'secretary')
            return {
              doctorID: session?.user?.permissions?.doctorID,
            };

            const doctorId = await client.employees.findFirst({
              where:{
                EMP_EMAIL:session?.user?.email
              }
            })
          return {
            doctorID: doctorId?.EMP_ID
          };
        })();

        const result: any = await client.clinic.findMany({
          where: {
            // doctorID: session?.user?.id,
            ...checkUser,
            NOT: [{ clinic_name: '' }],
          },
          distinct: ['clinic_name'],
        });

        return result;
      },
    });
  },
});

export const AllClinicUser = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('AllClinicUser', {
      type: ClinicFields,
      args: { data: DoctorInputs! },
      async resolve(_root, args, _ctx) {
        const clinicIDs: any = args?.data!.clinicIds;
        const result: any = await client.clinic.findMany({
          where: {
            id: {
              in: clinicIDs,
            },
          },
        });

        return result;
      },
    });
  },
});

export const OneClinic = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('OneClinic', {
      type: ClinicFields,
      args: { data: DoctorInputs! },
      async resolve(_root, args, _ctx) {
        const result: any = await client.clinic.findFirst({
          where: {
            uuid: String(args?.data!.uuid),
          },
        });

        return result;
      },
    });
  },
});

export const AllClinics = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('AllClinics', {
      type: ClinicFields,
      async resolve(_root, _args, _ctx) {
        const result: any = await client.clinic.findMany();

        return result;
      },
    });
  },
});
