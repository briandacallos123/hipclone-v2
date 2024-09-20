import { gql } from '@apollo/client';

export const get_note_medClear = gql`
  query GetNotesMedCler($data: NotesMedClerInputType!) {
    QueryNotesMedCler(data: $data) {
      VISIBILITY
      dateCreated
      dateExamined
      doctorID
      id
      isDeleted
      remarks
      clinicInfo {
        clinic_name
        Province
        doctorID
        id
        location
        number
        clinicDPInfo{
          doctorID
          clinic
          filename
          date
        }
      }
      doctorInfo {
        EMP_FULLNAME
        EMP_TITLE
        LIC_NUMBER
        S2_LIC
        PTR_LIC
        esig_dp{
          type
          doctorID
          filename
        }
        ClinicList {
          Province
          clinic_name
          location
          number
        }
        SPECIALIZATION
        SpecializationInfo {
          name
        }
      }
      patientInfo {
        FNAME
        HOME_ADD
        LNAME
        MNAME
        SEX
        EMAIL
        CONTACT_NO
        AGE
      }
    }
  }
`;

export const POST_MED_CLER = gql`
  mutation POST_MED_CLER($data: NotesMedClerInputType!) {
    PostNotesCler(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteClerInfo {
        dateCreated
        dateExamined
        id
        report_id
        doctorID
        patientID
        remarks
      }
    }
  }
`;

export const UpdateNotesCler = gql`
  mutation UpdateNotesCler($data: NotesMedClerInputType!) {
    UpdateNotesCler(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteClerInfo {
        dateCreated
        dateExamined
        id
        report_id
        doctorID
        patientID
        remarks
      }
    }
  }
`;

export const POST_MED_CLER_EMR = gql`
  mutation POST_MED_CLER_EMR($data: NotesMedClerInputType!) {
    PostNotesClerEMR(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteClerInfo {
        dateCreated
        dateExamined
        id
        report_id
        doctorID
        patientID
        remarks
      }
    }
  }
`;