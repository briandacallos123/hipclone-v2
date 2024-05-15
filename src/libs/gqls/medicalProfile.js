import { gql } from "@apollo/client";

// ALLERGY
export const mutation_create_allergy = gql`
mutation mutation_allergy($data: allergy_input_request!) {
    mutation_create_allergy(data: $data) {
    status
    message
    allergy_data{
        patientID
        emrPatientID
        isEMR
        patient
        allergy
    }
  }
}
`;


export const view_patient_allegy_data = gql`
query query_allergy_view ($data: view_allergy_input_request!) {
  view_patient_allegy_data(data: $data) {
    view_allegy_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      allergy
      isDeleted
    }
    allegy_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      allergy
      isDeleted
}
    total_records
  }
}
`;



//EMR PATIENT
export const emr_view_patient_allegy_data = gql`
query emr_query_allergy_view ($data: emr_view_allergy_input_request!) {
  emr_view_patient_allegy_data(data: $data) {
    emr_view_allegy_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      allergy
      isDeleted
    }
    view_allegy_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      allergy
      isDeleted
    }
    total_records
  }
}
`;
//EMR PATIENT

// ALLERGY






// FAMILY HISTORY
export const mutation_create_family_history = gql`
mutation mutation_family_history($data: family_history_input_request!) {
    mutation_create_family_history(data: $data) {
    status
    message
    family_history_data{
        patientID
        emrPatientID
        isEMR
        patient
        family_history
    }
  }
}
`;


export const view_patient_family_history_data = gql`
query query_family_history_view ($data: view_family_history_input_request!) {
  view_patient_family_history_data(data: $data) {
    family_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      family_history
      isDeleted
    }
    family_history_data_view{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      family_history
      isDeleted
    }
    total_records
  }
}
`;









//EMR PATIENT
export const emr_view_patient_family_history_data = gql`
query emr_query_family_history ($data: emr_view_family_history_input_request!) {
  emr_view_patient_family_history_data(data: $data) {
    emr_family_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      family_history
      isDeleted
    }
    emr_family_history_data_view{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      family_history
      isDeleted
    }
    total_records
  }
}
`;
//EMR PATIENT



// FAMILY HISTORY






// MEDICAL HISTORY
export const mutation_create_medical_history = gql`
mutation mutation_medical_history($data: medical_history_input_request!) {
    mutation_create_medical_history(data: $data) {
    status
    message
    medical_history_data{
        patientID
        emrPatientID
        isEMR
        patient
        medhistory
    }
  }
}
`;




export const view_patient_medical_history_data = gql`
query query_medical_history_view ($data: view_medical_history_input_request!) {
  view_patient_medical_history_data(data: $data) {
    view_medical_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medhistory
      isDeleted
    }
    medical_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medhistory
      isDeleted
    }
    total_records
  }
}
`;







//EMR PATIENT
export const emr_view_patient_medical_history_data = gql`
query emr_query_medical_history ($data: emr_view_medical_history_input_request!) {
  emr_view_patient_medical_history_data(data: $data) {
    emr_view_medical_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medhistory
      isDeleted
    }
    view_medical_history_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medhistory
      isDeleted
    }
    total_records
  }
}
`;
//EMR PATIENT


// MEDICAL HISTORY








// MEDICATION
export const mutation_create_medication = gql`
mutation mutation_medication($data: medication_input_request!) {
  mutation_create_medication(data: $data) {
    status
    message
    create_medication_data{
        patientID
        emrPatientID
        isEMR
        patient
        medication
    }
  }
}
`;









export const view_patient_medication_data = gql`
query query_medication_view ($data: view_medication_input_request!) {
  view_patient_medication_data(data: $data) {
    view_medication_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medication
      isDeleted
    }
    medication_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      medication
      isDeleted
}
    total_records
  }
}
`;








//EMR PATIENT
export const emr_view_patient_medication_data = gql`
query emr_query_medication ($data: emr_view_medication_input_request!) {
  emr_view_patient_medication_data(data: $data) {
    emr_view_medication_data{
        id
        patientID
        emrPatientID
        doctorID
        isEMR
        patient
        doctor
        dateCreated
        medication
        isDeleted
    }
    emr_medication_data{
        id
        patientID
        emrPatientID
        doctorID
        isEMR
        patient
        doctor
        dateCreated
        medication
        isDeleted
    }
    total_records
  }
}
`;
//EMR PATIENT
// MEDICATION






//SMOKING
export const mutation_create_smoking = gql`
mutation mutation_smoking($data: smoking_input_request!) {
    mutation_create_smoking(data: $data) {
    status
    message
    smoking_data{
        patientID
        emrPatientID
        isEMR
        patient
        smoking
    }
  }
}
`;






export const view_patient_smoking_data = gql`
query query_smoking_view ($data: view_smoking_input_request!) {
  view_patient_smoking_data(data: $data) {
    view_smoking_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      smoking
      isDeleted
    }
    smoking_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      smoking
      isDeleted
    }
    total_records
  }
}
`;






//EMR PATIENT
export const emr_view_patient_smoking_data = gql`
query emr_query_medication ($data: emr_view_smoking_input_request!) {
  emr_view_patient_smoking_data(data: $data) {
    emr_view_smoking_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      smoking
      isDeleted
    }
    view_smoking_data{
      id
      patientID
      emrPatientID
      doctorID
      isEMR
      patient
      doctor
      dateCreated
      smoking
      isDeleted
}
    total_records
  }
}
`;
//EMR PATIENT
//SMOKING

