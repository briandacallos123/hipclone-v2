import { gql } from '@apollo/client';

export const PATIENT_APPTS = gql`
  query PatientAppointmentData($data: AllPatientAPTInputType!) {
    patientAppointment(data: $data) {
      total_records
      summary {
        total
        pending
        approved
        cancelled
        done
        telemed
        face2Face
      }
      AptHistory_data {
        id
        add_date
        status
        patient_no
        payment_status
        time_slot
        type
        date
        clinic
        clinicInfo {
          clinic_name
          location
          doctorInfo {
            EMP_FULLNAME
          }
        }
      }
    }
  }
`;
