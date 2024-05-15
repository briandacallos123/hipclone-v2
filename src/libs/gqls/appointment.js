import { gql } from '@apollo/client';

export const ALL_APPOINTMENTS = gql`
  query GET_ALL_APPOINTMENTS($data: Appointments_Inputs!) {
    GET_ALL_APPOINTMENTS(data: $data) {
      Appointments {
        clinicInfo {
          clinic_name
          id
          location
        }
        date
        status
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
          FEES
          MEDCERT_FEE
          MEDCLEAR_FEE
          MEDABSTRACT_FEE
        }
        id
        patientInfo {
          EMPID
          FNAME
          LNAME
          HOME_ADD
          OCCUPATION
          EMAIL
        }
        payment_status
        time_slot
        symptoms
        remarks
        type
      }
      summary {
        female
        male
        totalRecords
        total
      }
    }
  }
`;

export const GetAppointmentGraph = gql`
  query GetAppointmentGraph {
    GetAppointmentGraph {
      data {
        January {
          approved
          cancelled
        }
        February {
          approved
          cancelled
        }
        April {
          approved
          cancelled
        }
        August {
          approved
          cancelled
        }
        December {
          approved
          cancelled
        }
        July {
          approved
          cancelled
        }
        March {
          cancelled
          approved
        }
        May {
          cancelled
          approved
        }
        November {
          approved
          cancelled
        }
        October {
          approved
          cancelled
        }
        September {
          approved
          cancelled
        }
        June {
          approved
          cancelled
        }
      }
    }
  }
`;

export const UpdateAppointment = gql`
  mutation UpdateAppointment($data: AppointmentUpdate) {
    UpdateAppointment(data: $data) {
      message
    }
  }
`;
