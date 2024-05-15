import { gql } from '@apollo/client';

export const mutation_patient_payment = gql`
mutation mutation_patient_payments($data: patient_payment_request!,$file: Upload) {
  mutation_patient_payment(data: $data,file : $file) {
    status
    message
    patient_payment_data{
      id
      patientID
      doctorID
      clinic
      appt_id
      patient
      doctor
      filename
      file_url
      date
      isDeleted
    }
  }
}
`;



