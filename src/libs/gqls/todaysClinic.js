import { gql } from '@apollo/client';

export const GetAllTodaysClinic = gql`
  query GetAllTodaysClinic($data: TodaysClinicInputs) {
    GetAllTodaysClinic(data: $data) {
      TotalRecords
      Female
      Male
      All
      TodaysClinicType {
        clinicInfo {
          clinic_name
          id
          location
        }
        date
        doctorInfo {
          EMP_FULLNAME
          EMP_ID
        }
        id
        patientInfo {
          EMAIL
          EMPID
          SEX
          OCCUPATION
          HOME_ADD
          FNAME
          LNAME
          MNAME
        }
        payment_status
        type
        remarks
        time_slot
        status
      }
    }
  }
`;
export const GetClinicDataLength = gql`
  query GetClinicDataLength {
    GetClinicDataLength {
      totalRecords
    }
  }
`;
export const GetAppointmentsLength = gql`
  query GetAppointmentsLength {
    GetAppointmentsLength {
      totalRecords
    }
  }
`;
