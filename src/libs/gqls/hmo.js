import { gql } from '@apollo/client';

export const GET_ALL_HMO = gql`
  query Hmo {
    Hmo {
      hmo {
        id
        name
      }
      HmoList {
        name
        id
      }
    }
  }
`;

export const CREATE_HMO = gql`
  mutation CreateHMO($data: HmoMutationInput!) {
    CreateHMO(data: $data) {
      id {
        id
        name
      }
    }
  }
`;

export const GET_HMO_BY_UUID = gql`
  query GET_HMO_BY_UUID($data: QueryHmoByUUID_payload!) {
    QueryHmoByUUID(data: $data) {
      EMP_ID
      EMP_FNAME
      EMP_FULLNAME
      EMP_ID
      EMP_LNAME
      EMP_MNAME
      EMP_SUFFIX
      EMP_TITLE
      EMP_EMAIL
      FEES
      MEDCERT_FEE
      MEDCLEAR_FEE
      MEDABSTRACT_FEE
      HMO
      attachment
      SUBSPECIALTY
      SpecializationInfo {
        name
      }
      clinicInfo {
        id
        clinic_name
        location
        schedule
        number
        isDeleted
        ClinicSchedInfo {
          id
          days
          type
          start_time
          end_time
          time_interval
        }
        clinicDPInfo{
          doctorID
          clinic
          filename
          date
        }
      }
    }
  }
`;
