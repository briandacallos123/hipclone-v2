import { gql } from '@apollo/client';

export const get_note_txt = gql`
  query getOneTxtNotes($data: NoteTxtInputType!) {
    QueryNoteTxt(data: $data) {
      dateCreated
      id
      isDeleted
      report_id
      text_data
      title
      attachment {
        file_name
        file_url
        id
      }
      clinicInfo {
        id
        Province
        clinic_name
        doctorID
        isDeleted
        location
        number
      }
      doctorInfo {
        EMPID
        ClinicList {
          Province
          clinic_name
          doctorID
          id
          isDeleted
          location
          number
        }
        EMP_FULLNAME
        EMP_ID
        LIC_NUMBER
        S2_LIC
        PTR_LIC
        esig_dp{
          type
          doctorID
          filename
        }
        SPECIALIZATION
        EMP_TITLE
        SpecializationInfo {
          name
          id
        }
      }
      patientInfo {
        IDNO
        AGE
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
      }
    }
  }
`;

export const POST_NOTES_TXT = gql`
  mutation POST_NOTES_TXT($data: NoteTxtInputType!,  $file: Upload) {
    PostNotesTxt(data: $data, file: $file) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteTxtInfo {
        text_data
        title
        report_id
      }
    }
  }
`;

export const UpdateNotesText = gql`
  mutation UpdateNotesText($data: NoteTxtInputType!,  $file: Upload) {
    UpdateNotesText(data: $data, file: $file) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteTxtInfo {
        text_data
        title
        report_id
      }
    }
  }
`;

export const POST_NOTES_TXT_EMR = gql`
  mutation POST_NOTES_TXT_EMR($data: PostNotesTxtEMRInputs!, $file: Upload) {
    PostNotesTxtEMR(data: $data, file: $file) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteTxtInfo {
        text_data
        title
        report_id
      }
    }
  }
`;



export const DeleteNotesText = gql`
  mutation DeleteNotesText($data: NoteTxtInputType!,  $file: Upload) {
    DeleteNotesText(data: $data, file: $file) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteTxtInfo {
        text_data
        title
        report_id
      }
    }
  }
`;