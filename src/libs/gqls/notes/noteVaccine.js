import { gql } from '@apollo/client';

export const get_note_vaccine = gql`
  query GetNoteVaccine($data: NotesPedCertObjInputType!) {
    QueryNotesPedCertObj(data: $data) {
      clinicInfo {
        Province
        clinic_name
        location
        number
      }
      doctorInfo {
        ClinicList {
          Province
          clinic_name
          doctor_idno
          location
          number
        }
        EMP_FULLNAME
        EMP_TITLE
        SPECIALIZATION
        SpecializationInfo {
          name
        }
        LIC_NUMBER
        S2_LIC
        PTR_LIC
        esig_dp{
          type
          doctorID
          filename
        }
      }
      InOutPatient
      patientInfo {
        AGE
        FNAME
        LNAME
        MNAME
        SEX
        BDAY
      }
      VISIBILITY
      clinic
      dateCreated
      diagnosis
      doctorID
      eval
      id
      isDeleted
    }
  }
`;

export const POST_NOTE_VACC = gql`
  mutation POST_NOTE_VACC($data: NotesPedCertObjInputType!) {
    PostNotesVacc(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteVaccInfo {
        InOutPatient
        VISIBILITY
        clinic
        dateCreated
        diagnosis
        doctorID
        eval
        id
        isDeleted
        patientID
        report_id
      }
    }
  }
`;


export const POST_NOTE_VACC_EMR = gql`
  mutation POST_NOTE_VACC_EMR($data: NotesPedCertObjInputType!) {
    PostNotesVaccEMR(data: $data) {
      CLINIC
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteVaccInfo {
        InOutPatient
        VISIBILITY
        clinic
        dateCreated
        diagnosis
        doctorID
        eval
        id
        isDeleted
        patientID
        report_id
      }
    }
  }
`;