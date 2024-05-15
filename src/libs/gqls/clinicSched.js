import { gql } from '@apollo/client';

export const CLINIC_SCHEDLIST = gql`
  query AllSchedules($data: ClinicPayload!) {
    QueryClinics(data: $data) {
      totalClinicSched
      clinic_data {
        ClinicSchedInfo {
          id
          clinic
          type
          days
          start_time
          end_time
          doctorID
          time_interval
        }
        id
        clinic_name
        location
        Province
        number
        doctorID
        clinicDPInfo {
          doctorID
          clinic
          filename
          date
        }
      }
      total
      total_f2f
      total_tm
      provinces {
        Province
      }
    }
  }
`;

export const CLINIC_POST = gql`
  mutation PostClinic($data: ClinicInsertPayload!, $file: Upload) {
    PostClinic(data: $data, file: $file) {
      ClinicSchedInfo {
        SchedName
        clinic
        end_time
        id
        time_interval
        start_time
        isDeleted
        type
        days
        doctorID
      }
      Province
      clinic_name
      doctor_idno
      id
      doctorID
      uuid
      isDeleted
      location
      number
      schedule
    }
  }
`;
export const DeleteClinic = gql`
  mutation DeleteClinic($data: DeleteClinicInputs!) {
    DeleteClinic(data: $data) {
      message
      status
    }
  }
`;
export const DeleteClinicSched = gql`
  mutation MyMutation {
    DeleteOneSched(data: { id: 10 }) {
      days
    }
  }
`;

export const CLINIC_SCHED_POST = gql`
  mutation PostClinicSched($data: ClinicInsertPayload!) {
    PostClinicSched(data: $data) {
      SchedName
      clinic
      days
      end_time
      time_interval
      start_time
      id
      type
      doctorID
    }
  }
`;

export const CLINIT_GET_ONE = gql`
  query QueryOneClinic($data: ClinicInsertPayload!) {
    QueryOneClinic(data: $data) {
      Province
      ClinicSchedInfo {
        SchedName
        clinic
        days
        end_time
        id
        isDeleted
        time_interval
        type
        start_time
        doctorID
      }
      clinic_name
      doctor_idno
      id
      isDeleted
      number
      location
      schedule
      uuid
    }
  }
`;

export const CLINIC_UPDATE_ONE = gql`
  mutation UpdateClinic($data: ClinicInsertPayload!, $file: Upload) {
    UpdateClinic(data: $data, file: $file) {
      ClinicSchedInfo {
        SchedName
        clinic
        days
        doctorID
        end_time
        id
        isDeleted
        time_interval
        type
        start_time
      }
      Province
      clinic_name
      doctor_idno
      id
      isDeleted
      number
      location
      doctorID
      schedule
      uuid
    }
  }
`;

export const SCHED_GET_ONE = gql`
  query QueryOneClinicSched($data: ClinicInsertPayload!) {
    QueryOneClinicSched(data: $data) {
      SchedName
      clinic
      days
      end_time
      id
      isDeleted
      start_time
      time_interval
      doctorID
      type
    }
  }
`;

export const SCHED_UPDATE_ONE = gql`
  mutation UpdateClinicSched($data: ClinicInsertPayload!) {
    UpdateClinicSched(data: $data) {
      SchedName
      clinic
      days
      type
      time_interval
      start_time
      isDeleted
      doctorID
      id
      end_time
    }
  }
`;
