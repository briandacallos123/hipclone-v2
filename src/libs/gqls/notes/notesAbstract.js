import { gql } from '@apollo/client';

export const get_note_Abstract = gql`
  query GetNoteAbstract($data: NoteAbstInputType) {
    QueryNotesAbstract(data: $data) {
      clinicInfo {
        Province
        clinic_name
        doctor_idno
        location
        number
      }
      doctorInfo {
        EMP_FULLNAME
        EMP_TITLE
        LIC_NUMBER
        S2_LIC
        PTR_LIC
        SPECIALIZATION
        SpecializationInfo {
          name
        }
        ClinicList {
          clinic_name
          location
          number
        }
        esig_dp{
          type
          doctorID
          filename
        }
      }
      clinic
      complaint
      complications
      dateCreated
      doctorID
      finaldiag
      findings
      id
      illness
      isDeleted
      labdiag
      pastmed
      patientID
      patientInfo {
        AGE
        CONTACT_NO
        EMAIL
        FNAME
        IDNO
        HOME_ADD
        LNAME
        MNAME
        STATUS
        SEX
        S_ID
        isDeleted
      }
      persoc
      physical
      procedures
      report_id
      symptoms
      treatplan
    }
  }
`;

export const POST_NOTES_ABS = gql`
  mutation POST_NOTES_ABS($data: NoteAbstInputType) {
    PostNotesAbs(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteAbsInfo {
        clinic
        complaint
        complications
        dateCreated
        doctorID
        finaldiag
        findings
        id
        illness
        isDeleted
        labdiag
        pastmed
        patientID
        persoc
        physical
        procedures
        report_id
        symptoms
        treatplan
      }
    }
  }
`;

export const POST_NOTES_ABS_EMR = gql`
  mutation POST_NOTES_ABS_EMR($data: NoteAbstInputType) {
    PostNotesAbsEMR(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteAbsInfo {
        clinic
        complaint
        complications
        dateCreated
        doctorID
        finaldiag
        findings
        id
        illness
        isDeleted
        labdiag
        pastmed
        patientID
        persoc
        physical
        procedures
        report_id
        symptoms
        treatplan
      }
    }
  }
`;
