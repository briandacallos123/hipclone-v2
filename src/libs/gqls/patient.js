import { gql } from '@apollo/client';

export const ALL_PATIENT = gql`
  query User($data: AllPatientInputType!) {
    QueryAllPatient(data: $data) {
      patient_data {
        CONTACT_NO
        EMAIL
        FNAME
        HOME_ADD
        LNAME
        IDNO
        MNAME
        SEX
        STATUS
        S_ID
        isDeleted
        medication {
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
        medicalhistory {
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
        smoking {
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
        allergy {
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
        family_history {
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
        notes_vitals {
          id
          patientID
          date
          wt
          ht
          hr
          rr
          bmi
          bt
          spo2
          bp
        }
      }
      total_records
      summary {
        total
        male
        female
        unspecified
      }
    }
  }
`;

export const QueryUUID = gql`
  query GetLinkedAcc($data: GetLinkedAccInp!) {
    GetLinkedAcc(data: $data) {
      data {
        contact_no
        email
        fname
        fullname
        gender
        id
        idno
        link
        lname
        mname
        patientID
      }
      message
    }
  }
`;
