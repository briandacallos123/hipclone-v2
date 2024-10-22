import { gql } from '@apollo/client';

export const get_note_vitals = gql`
  query getOneVitalsNotes($data: notesVitalInputType!) {
    QueryNotesVitals(data: $data) {
      vitals_data {
        bmi
        bp
        bp1
        bp2
        bt
        chiefcomplaint
        clinic
        date
        dateCreated
        doctor
        doctorID
        emrPatientID
        hr
        ht
        id
        isDeleted
        isEMR
        patient
        patientID
        report_id
        rr
        spo2
        wt
      }
    }
  }
`;

export const get_note_vitals_patient = gql`
  query getOneVitalsNotesPatient($data: notesVitalInputType!) {
    QueryNotesVitalsPatient(data: $data) {
      vitals_data {
        bmi
        bp
        bp1
        bsm
        bp2
        bt
        chiefcomplaint
        clinic
        date
        dateCreated
        doctor
        doctorID
        emrPatientID
        hr
        ht
        id
        isDeleted
        isEMR
        patient
        patientID
        report_id
        rr
        spo2
        wt
      }
    }
  }
`;

export const DeleteNotesVitalPatient = gql`
  mutation DeleteNotesVitalPatient($data: notesVitalInputType!) {
    DeleteNotesVitalPatient(data: $data) {
     message
    }
  }
`;

export const get_note_vitals_patient_emr = gql`
  query getOneVitalsNotesEMR($data: notesVitalInputType!) {
    QueryNotesVitalsEMRPatient(data: $data) {
      vitals_data {
        bmi
        bp
        bp1
        bp2
        bt
        chiefcomplaint
        clinic
        date
        dateCreated
        doctor
        doctorID
        emrPatientID
        hr
        ht
        id
        bsm
        isDeleted
        isEMR
        patient
        patientID
        report_id
        rr
        spo2
        wt
      }
    }
  }
`;

export const POST_VITALS = gql`
  mutation POST_VITALS($data: notesVitalInputType!) {
    PostVitals(data: $data) {
      bmi
      bp1
      bp2
      bt
      hr
      ht
      rr
      spo2
      wt
      report_id
      doctorID
      clinic
      patientID
      date
      bsm
    }
  }
`;

export const POST_VITALS_EMR = gql`
  mutation POST_VITALS_EMR($data: notesVitalInputType!) {
    PostVitalsEMR(data: $data) {
      bmi
      bp1
      bp2
      bt
      hr
      ht
      rr
      spo2
      wt
      report_id
      doctorID
      clinic
      emrPatientID
      date
    }
  }
`;

// user

export const get_note_vitals_user = gql`
  query getOneVitalsNotesUser($data: notesUserVitalInputType!) {
    QueryNotesVitalsUser(data: $data) {
      vitals_data {
        bmi
        bp
        bp1
        bp2
        bt
        chiefcomplaint
        clinic
        date
        dateCreated
        doctor
        doctorID
        emrPatientID
        hr
        bsm
        ht
        id
        isDeleted
        isEMR
        patient
        patientID
        report_id
        rr
        spo2
        wt
      }
    }
  }
`;

// user post

export const POST_VITALS_USER = gql`
  mutation POST_VITALS_USER($data: notesVitalInputType!) {
    PostVitalsUser(data: $data) {
      R_ID
      notes_vitals {
        bmi
        bp1
        bp2
        bt
        hr
        ht
        rr
        spo2
        wt
        report_id
        patientID
        date
      }
    }
  }
`;
