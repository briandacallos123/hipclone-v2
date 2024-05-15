import { gql } from '@apollo/client';

export const GET_FYD = gql`
  query FindYourDoctor($data: FYDInputType!) {
    findYourDoctor(data: $data) {
      FYD_data {
        EMP_ID
        EMPID
        EMP_FULLNAME
        EMP_FNAME
        EMP_MNAME
        EMP_LNAME
        EMP_SUFFIX
        EMP_TITLE
        user {
          uuid
          uname
          display_picture {
            id
            userID
            idno
            filename
          }
        }
        HMOInfo {
          id
          name
        }
        SpecializationInfo {
          id
          name
        }
        SUBSPECIALTY
        clinicInfo {
          id
          clinic_name
          Province
          location
          isDeleted
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
          ClinicSchedInfo {
            id
            SchedName
            daysArray
            typeArray
            time_interval
            start_time
            end_time
          }
        }
      }
      fyd_totalRecords
    }
  }
`;

export const TAKEN_TIME = gql`
  query TAKEN_TIME($data: TakenInputType!) {
    QueryTakenTimeSlot(data: $data) {
      id
      time_slot
    }
  }
`;
