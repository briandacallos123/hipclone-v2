import { gql } from '@apollo/client';

export const GET_RECORD = gql`
  query User($data: AllRecordInputType!) {
    allRecords(data: $data) {
      male
      female
      total_records
      total_records_fix
      Records_data {
        isEMR
        R_ID
        R_DATE
        CLINIC
        R_TYPE
        patientID
        emrPatientID
        clinicInfo {
          doctorID
          clinic_name
          id
          location
          isDeleted
          doctor_idno
          doctorInfo {
            EMP_FULLNAME
          }
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        patientInfo {
          FNAME
          MNAME
          LNAME
          EMAIL
          SEX
          HOME_ADD
          CONTACT_NO
          SUFFIX
          BDAY
          IDNO
          S_ID
          userInfo {
            uuid
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
      }
      Records_list {
        patientInfo {
          S_ID
          FNAME
          LNAME
          SEX
          AGE
          emr_patient {
            id
            idno
            fname
            mname
            lname
            gender
            contact_no
            email
            patientID
            link
          }
          userInfo {
            uuid
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
          medication {
            id
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
            doctorID
            isEMR
            patient
            doctor
            clinic
            date
            dateCreated
            report_id
            wt
            ht
            hr
            rr
            bmi
            bt
            spo2
            bp
            bp1
            bp2
            chiefcomplaint
            isDeleted
          }
        }
      }
    }
  }
`;
export const GET_PROFILE_RECORD = gql`
  query User($data: AllRecordInputType!) {
    QueryOneProfile(data: $data) {
      Records_ByIDs {
        R_ID
        clinicInfo {
          doctorID
          clinic_name
          id
          location
          isDeleted
          doctor_idno
          doctorInfo {
            EMP_FULLNAME
          }
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        patientInfo {
          S_ID
          isEMR
          FNAME
          MNAME
          LNAME
          EMAIL
          SEX
          CONTACT_NO
          SUFFIX
          AGE
          IDNO
          BDAY
          HOME_ADD
          BLOOD_TYPE
          OCCUPATION
          EMERGENCYNAME
          EMERGENCYADDRESS
          EMERGENCYCONTACTNO
          EMPLOYERSNAME
          EMPLOYERSADDRESS
          EMPLOYERSPHONENO
          EMERGENCYRELATIONSHIP
          PRIMARYCAREPHYSICIAN
          REFFERINGPHYSICIAN
          OTHERPHYSICIAN
          emr_patient {
            id
            idno
            fname
            mname
            lname
            gender
            contact_no
            email
            patientID
            link
          }
          userInfo {
            uuid
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
          medication {
            id
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
            doctorID
            isEMR
            patient
            doctor
            clinic
            date
            dateCreated
            report_id
            wt
            ht
            hr
            rr
            bmi
            bt
            spo2
            bp
            bp1
            bp2
            chiefcomplaint
            isDeleted
          }
        }
      }
    }
  }
`;

export const GET_RECORD_BY_PATIENT = gql`
  query QueryRecordPat($data: AllRecordInputType!) {
    allRecordsbyPatient(data: $data) {
      Records_data {
        R_ID
        isEMR
        patientID
        emrPatientID
        R_DATE
        doctorInfo {
          EMP_FULLNAME
        }
        clinicInfo {
          clinic_name
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        notes_text {
          file_name
          file_url
          notes_text_id
        }
        R_TYPE
      }

      total_records
    }
  }
`;

// doctor patient

export const GET_RECORD_PATIENT = gql`
  query GET_RECORD_PATIENT($data: AllRecordInputType!) {
    allRecordsbyPatientNew(data: $data) {
      clinic{
        clinic_name
        id
      }
      Records_data {
        R_ID
        isEMR
        patientID
        emrPatientID
        R_DATE
        patientInfo{
          S_ID
          isEMR
          FNAME
          MNAME
          LNAME
          EMAIL
          SEX
          CONTACT_NO
          SUFFIX
          AGE
          IDNO
          BDAY
          HOME_ADD
          BLOOD_TYPE
          OCCUPATION
          EMERGENCYNAME
          EMERGENCYADDRESS
          EMERGENCYCONTACTNO
          EMPLOYERSNAME
          EMPLOYERSADDRESS
          EMPLOYERSPHONENO
          EMERGENCYRELATIONSHIP
          PRIMARYCAREPHYSICIAN
          REFFERINGPHYSICIAN
          OTHERPHYSICIAN
        }
        doctorInfo {
          EMP_FULLNAME
          LIC_NUMBER
        }
        esig{
          filename
        }
        clinicInfo {
          clinic_name
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        notes_text {
          file_name
          file_url
          notes_text_id
        }
        R_TYPE
      }

      total_records
    }
  }
`;

// ----------------------------------------

// doctor EMR patient

export const GET_RECORD_EMR_PATIENT = gql`
  query GET_RECORD_EMR_PATIENT($data: AllRecordInputType!) {
    allRecordsbyEMRNew(data: $data) {
      Records_data {
        R_ID
        isEMR
        patientID
        emrPatientID
        R_DATE
        doctorInfo {
          EMP_FULLNAME
        }
        clinicInfo {
          clinic_name
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        notes_text {
          file_name
          file_url
          notes_text_id
        }
        R_TYPE
      }

      total_records
    }
  }
`;

// ----------------------------------------

export const GET_RECORD_BY_PATIENT_USER = gql`
  query QueryRecordBypatientUser($data: AllRecordUserInputType!) {
    allRecordsbyPatientUser(data: $data) {
      Records_data {
        R_ID
        isEMR
        CLINIC
        patientID
        emrPatientID
        R_DATE
        doctorInfo {
          EMP_FULLNAME
        }
        clinicInfo {
          clinic_name
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        notes_text {
          file_name
          file_url
          notes_text_id
        }
        R_TYPE
      }
      clinic{
        id
        clinic_name
        number
        location
        Province
        doctorID
      }
      total_records
    }
  }
`;

// new patient data dashboard

export const PATIENT_DATA = gql`
  query PATIENT_DATA($data: AllRecordInputType!) {
    QueryPatientData(data: $data) {
      Records_ByIDs {
        R_DATE
        R_ID
        patientInfo {
          allergy {
            allergy
          }
          AGE
          BDAY
          BLOOD_TYPE
          CONTACT_NO
          EMAIL
          EMERGENCYADDRESS
          EMERGENCYCONTACTNO
          EMERGENCYNAME
          EMERGENCYRELATIONSHIP
          EMPLOYERSADDRESS
          EMPLOYERSNAME
          EMPLOYERSPHONENO
          FNAME
          HOME_ADD
          IDNO
          PRIMARYCAREPHYSICIAN
          OTHERPHYSICIAN
          SEX
          SUFFIX
          LNAME
          MNAME
          OCCUPATION
          REFFERINGPHYSICIAN
          family_history {
            family_history
          }
          medicalhistory {
            medhistory
          }
          medication {
            medication
          }
          smoking {
            smoking
          }
          userInfo {
            id
          }
        }
        clinicInfo {
          id
        }
      }
    }
  }
`;
