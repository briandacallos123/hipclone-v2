import { gql } from '@apollo/client';

export const get_note_medCert = gql`
  query GetMedcert($data: NotesMedCertInputType!) {
    QueryNotesMedCert(data: $data) {
      clinicInfo {
        clinic_name
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
        SpecializationInfo {
          id
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
      VISIBILITY
      barring
      clinic
      dateCreated
      diagnosis
      doctorID
      e_date
      hospital
      id
      isDeleted
      patientID
      patientInfo {
        FNAME
        LNAME
        SEX
        AGE
      }
      remarks
      report_id
      s_date
    }
  }
`;
export const POST_MED_CERT = gql`
  mutation POST_MED_CERT($data: NotesMedCertInputType!) {
    PostNotesCert(data: $data) {
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteCertInfo {
        InOutPatient
        barring
        doctorID
        e_date
        s_date
        report_id
        patientID
        isDeleted
        id
        diagnosis
        dateCreated
        remarks
      }
    }
  }
`;

export const POST_MED_CERT_EMR = gql`
  mutation POST_MED_CERT_EMR($data: NotesMedCertInputType!) {
    PostNotesCertEMR(data: $data) {
      R_DATE
      R_ID
      R_TYPE
      doctorID
      emrPatientID
      isDeleted
      isEMR
      patientID
      noteCertInfo {
        InOutPatient
        barring
        doctorID
        e_date
        s_date
        report_id
        patientID
        isDeleted
        id
        diagnosis
        dateCreated
        remarks
      }
    }
  }
`;
