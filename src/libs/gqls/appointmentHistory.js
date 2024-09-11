import { gql } from '@apollo/client';

export const GET_ALL_PATIENT_APPOINTMENTS = gql`
  query GET_ALL_PATIENT_APPOINTMENTS($data: Patient_Appointments_Inputs) {
    GET_ALL_PATIENT_APPOINTMENTS(data: $data) {
      summary {
        all
        approve
        cancelled
        done
        totalRecords
        pending
      }

      patientAppointment {
        date
        status
        id
        time_slot
        remarks
        type
        add_date
        payment_status
        doctorInfo {
          CONTACT_NO
          EMP_EMAIL
          EMP_FNAME
          EMP_FULLNAME
        }
        clinicInfo {
          clinic_name
          location
          id
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        patientInfo {
          EMAIL
          EMPID
          FNAME
          HOME_ADD
          IDNO
          LNAME
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PATIENT_APPOINTMENTS_USER = gql`
  query GET_ALL_PATIENT_APPOINTMENTS_USER($data: Patient_Appointments_Inputs_user) {
    GET_ALL_PATIENT_APPOINTMENTS_USER(data: $data) {
      summary {
        all
        approve
        cancelled
        done
        totalRecords
        pending
      }
      clinic{
        id
        clinic_name
      }

      patientAppointment {
        date
        time_slot
        status
        id
        remarks
        type
        payment_status
        doctorInfo {
          CONTACT_NO
          EMP_EMAIL
          EMP_FNAME
          EMP_FULLNAME
        }
        clinicInfo {
          clinic_name
          location
          id
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        patientInfo {
          EMAIL
          EMPID
          FNAME
          HOME_ADD
          IDNO
          LNAME
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PATIENT_APPOINTMENTS_CLINIC = gql`
  query GET_ALL_PATIENT_APPOINTMENTS_CLINIC($data: GET_ALL_PATIENT_APPOINTMENTS_CLINIC_INPUT) {
    GET_ALL_PATIENT_APPOINTMENTS_CLINIC(data: $data) {
      clinic {
        doctorID
        clinic_name
        id
        isDeleted
        location
        number
      }
    }
  }
`;
