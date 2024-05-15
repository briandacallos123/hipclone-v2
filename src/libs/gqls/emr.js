import { gql } from '@apollo/client';

export const EMR_PATIENTS = gql`
  query QueryAllEMR($data: ALL_EMR_INPUT!) {
    QueryAllEMR(data: $data) {
      emr_data_field {
        fname
        id
        idno
        mname
        lname
        gender
        contact_no
        email
        fullname
        link
        patientRelation {
          CONTACT_NO
          EMAIL
          FNAME
          IDNO
          LNAME
          SUFFIX
          uuid
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
          labreport {
            id
            isEMR
            patient
            doctor
            clinic
            dateCreated
            type
            labName
            resultDate
            remarks
            isDeleted
            labreport_attachments {
              id
              patient
              doctor
              clinic
              labreport_id
              file_name
              file_url
              file_size
              file_type
              date
              isDeleted
            }
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
        records {
          R_ID
          R_TYPE
          R_DATE
          CLINIC
          isDeleted
          isEMR
          patientID
          emrPatientID
          clinicInfo {
            clinic_name
            doctorID
            doctor_idno
            id
            isDeleted
            location
          }
          doctorInfo {
            EMPID
            EMP_FULLNAME
            EMP_ID
          }
          patientInfo {
            FNAME
            EMAIL
            CONTACT_NO
            IDNO
            LNAME
            MNAME
            SUFFIX
            S_ID
          }
        }
      }

      emr_data_carousel {
        fname
        id
        idno
        mname
        lname
        gender
        contact_no
        email
        fullname
        link
        AGE
        patientRelation {
          CONTACT_NO
          EMAIL
          FNAME
          IDNO
          LNAME
          SUFFIX
          uuid
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
          labreport {
            id
            isEMR
            patient
            doctor
            clinic
            dateCreated
            type
            labName
            resultDate
            remarks
            isDeleted
            labreport_attachments {
              id
              patient
              doctor
              clinic
              labreport_id
              file_name
              file_url
              file_size
              file_type
              date
              isDeleted
            }
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
        records {
          R_ID
          R_TYPE
          R_DATE
          CLINIC
          isDeleted
          isEMR
          patientID
          emrPatientID
          clinicInfo {
            clinic_name
            doctorID
            doctor_idno
            id
            isDeleted
            location
          }
          doctorInfo {
            EMPID
            EMP_FULLNAME
            EMP_ID
          }
          patientInfo {
            FNAME
            EMAIL
            CONTACT_NO
            IDNO
            LNAME
            MNAME
            SUFFIX
            S_ID
          }
        }
      }

      summary {
        link
        unlink
        total
        allRecords
      }
    }
  }
`;

export const QueryAllEMRCarousel = gql`
  query QueryAllEMRCarousel($data: ALL_EMR_INPUT!) {
    QueryAllEMRCarousel(data: $data) {
      emr_data_field {
        fname
        id
        idno
        mname
        lname
        gender
        contact_no
        email
        fullname
        link
        patientRelation {
          CONTACT_NO
          EMAIL
          FNAME
          IDNO
          LNAME
          SUFFIX
          uuid
          AGE
          SEX
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
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
    }
  }
`;

export const MutationEmrPatient = gql`
  mutation MyMutation($data: EmrPatientUpsertType!) {
    MutationEmrPatient(data: $data) {
      create_emr_patient_data {
        id
        fname
        suffix
        lname
        gender
        status
        address
        email
        contact_no
        dateofbirth
      }
      status
      message
    }
  }
`;
export const QuerySingleEmr = gql`
  query QuerySingleEmr($data: SINGLE_EMR_INPUT!) {
    QuerySingleEmr(data: $data) {
      fname
      id
      idno
      mname
      lname
      gender
      contact_no
      email
      fullname
      link
      doctorInfo {
        EMPID
        EMP_ID
      }
      patientRelation {
        CONTACT_NO
        EMAIL
        FNAME
        IDNO
        LNAME
        SUFFIX
        uuid
        S_ID
        AGE
        HOME_ADD
        BLOOD_TYPE
        OCCUPATION
        EMERGENCYNAME
        EMERGENCYADDRESS
        EMERGENCYCONTACTNO
        EMERGENCYRELATIONSHIP
        EMPLOYERSNAME
        EMPLOYERSADDRESS
        EMPLOYERSPHONENO
        PRIMARYCAREPHYSICIAN
        REFFERINGPHYSICIAN
        OTHERPHYSICIAN
        BDAY
        userInfo {
          id
          display_picture {
            id
            userID
            idno
            filename
          }
        }
        labreport {
          id
          isEMR
          patient
          doctor
          clinic
          dateCreated
          type
          labName
          resultDate
          remarks
          isDeleted
          labreport_attachments {
            id
            patient
            doctor
            clinic
            labreport_id
            file_name
            file_url
            file_size
            file_type
            date
            isDeleted
          }
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
  }
`;

export const EMR_MED_NOTE = gql`
  query EMR_MED_NOTE($data: ALL_EMR_INPUT!) {
    QueryEMR_Record(data: $data) {
      EMR_Record {
        records {
          R_DATE
          R_TYPE
          clinicInfo {
            clinic_name
            location
          }
        }
      }
      total
    }
  }
`;
export const QueryAllPatient = gql`
  query QueryAllPatient($data: RecordInputs!) {
    QueryAllPatient(data: $data) {
      IDNO
      FNAME
      LNAME
      EMAIL
      CONTACT_NO
      userInfo {
        uuid
      }
    }
  }
`;
export const LinkAccount = gql`
  mutation LinkAccount($data: LinkAccountInputs!) {
    LinkAccount(data: $data) {
      fname
      id
      idno
      mname
      lname
      gender
      contact_no
      email
      fullname
      link
      patientRelation {
        CONTACT_NO
        EMAIL
        FNAME
        IDNO
        LNAME
        SUFFIX
        uuid
        userInfo {
          id
          display_picture {
            id
            userID
            idno
            filename
          }
        }
        labreport {
          id
          isEMR
          patient
          doctor
          clinic
          dateCreated
          type
          labName
          resultDate
          remarks
          isDeleted
          labreport_attachments {
            id
            patient
            doctor
            clinic
            labreport_id
            file_name
            file_url
            file_size
            file_type
            date
            isDeleted
          }
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
  }
`;

export const get_all_emr_note_soap = gql`
  query get_all_emr_note_soap_all($data: emr_note_soap_input_request!) {
    get_all_emr_note_soap(data: $data) {
      emr_note_soap_data {
        id
        patientID
        doctorID
        clinic
        dateCreated
        report_id
        complaint
        illness
        wt
        hr
        rr
        bmi
        ht
        bt
        bp
        bp1
        bp2
        spo2
        remarks0
        remarks1
        remarks2
        diagnosis
        plan
        isDeleted
        physicalInfo {
          id
          patientID
          doctorID
          clinic
          date
          report_id
          vision_r
          vision_l
          pupils
          glasses_lenses
          hearing
          bmi_status
          bmi_comment
          skin_status
          skin_comment
          heent_status
          heent_comment
          teeth_status
          teeth_comment
          neck_status
          neck_comment
          lungs_status
          lungs_comment
          heart_status
          heart_comment
          abdomen_status
          abdomen_comment
          gusystem_status
          gusystem_comment
          musculoskeletal_status
          musculoskeletal_comment
          backspine_status
          backspine_comment
          neurological_status
          neurological_comment
          psychiatric_status
          psychiatric_comment
        }
      }
    }
  }
`;
