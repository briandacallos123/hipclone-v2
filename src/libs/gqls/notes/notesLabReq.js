import { gql } from '@apollo/client';

export const get_note_lab = gql`
  query getOneLabNotes($data: NotesLabInputType!) {
    QueryNotesLab(data: $data) {
      dateCreated
      doctorID
      emrPatientID
      fasting
      id
      isDeleted
      isEMR
      others
      patient
      procedures
      record_id
      patientInfo {
        IDNO
        CONTACT_NO
        EMAIL
        FNAME
        HOME_ADD
        LNAME
        MNAME
        SEX
        STATUS
        S_ID
        isDeleted
        AGE
      }
      doctorInfo {
        EMPID
        EMP_FULLNAME
        EMP_ID
        EMP_TITLE
        SPECIALIZATION
        LIC_NUMBER
        S2_LIC
        PTR_LIC
        esig_dp{
          type
          doctorID
          filename
        }
        SpecializationInfo {
          name
        }
        ClinicList {
          clinic_name
          location
          number
          Province
        }
      }
      clinicInfo {
        id
        isDeleted
        location
        doctor_idno
        clinic_name
        number
      }
    }
  }
`;

export const POST_NOTES_LAB = gql`
  mutation POST_NOTES_LAB($data: NotesLabInputType!) {
    PostNotesLabReq(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      NotesLabObj {
        fasting
        others
        procedures
        emrPatientID
        isEMR
        doctorID
        record_id
        id
      }
    }
  }
`;



export const POST_NOTES_LAB_EMR = gql`
  mutation POST_NOTES_LAB_EMR($data: NotesLabInputType!) {
    PostNotesLabReqEMR(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      NotesLabObj {
        fasting
        others
        procedures
        emrPatientID
        isEMR
        doctorID
        record_id
        id
      }
    }
  }
`;