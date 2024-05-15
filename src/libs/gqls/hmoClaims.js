import { gql } from '@apollo/client';

export const Get_All_Hmo_Claims = gql`
  query AllHmoClaims($data: Request_payloads_hmo_claims!) {
    Get_All_Hmo_Claims(data: $data) {
      hmo_claims_data {
        id
        appt_id
        hmo
        claim_status
        member_name
        member_id
        doctor
        date_appt
        time_appt
        diagnosis_code
        diagnosis
        dispo_code
        disposition
        ver_code
        treatment
        approval_no
        c_email
        c_contact
        c_clinic
        c_caddress
        payment_type
        dateCreated
        export_stat
        isDeleted
        hmoInfo {
          id
          name
        }
        patientHmoInfo {
          id
          patientID
          idno
          hmo
          member_id
          isDeleted
          patient {
            S_ID
            IDNO
            FNAME
            MNAME
            LNAME
            SUFFIX
            SEX
            AGE
            HOME_ADD
          }
        }
        appointmentInfo {
          id
          patient_no
          date
          time_slot
          comment
          symptoms
          patientInfo{
            S_ID
            IDNO
            FNAME
            LNAME
            MNAME
            SEX
            userInfo{
              id
              display_picture{
                id
                userID
                idno
                filename
              }
            }
          }
          appt_hmo_attachment{
            id
            appt_hmo_id
            filename
            file_url
            file_size
            file_type
            date
            isDeleted
          }
        }
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
        }
      }
      payChequeCount
      payDepositCount
      total_records
      summary_total {
        total
        pending
        approved
        done
        cancelled
      }
    }
  }
`;

export const Get_Hmo_Claim_By_Id = gql`
  query AllHmoClaims_by_id($data: Request_payloads_hmo_claims_by_id!) {
    Get_Hmo_Claim_By_Id(data: $data) {
      hmo_claims_data_by_id {
        id
        appt_id
        hmo
        claim_status
        member_name
        member_id
        doctor
        date_appt
        time_appt
        diagnosis_code
        diagnosis
        dispo_code
        disposition
        ver_code
        treatment
        approval_no
        c_email
        c_contact
        c_clinic
        c_caddress
        payment_type
        dateCreated
        export_stat
        isDeleted
        hmoInfo {
          id
          name
        }
        patientHmoInfo {
          id
          patientID
          idno
          hmo
          member_id
          isDeleted
          patient {
            S_ID
            IDNO
            FNAME
            MNAME
            LNAME
            SUFFIX
            SEX
            AGE
            HOME_ADD
          }
        }
        appointmentInfo {
          id
          patient_no
          date
          time_slot
          comment
          symptoms
          patientInfo{
            S_ID
            IDNO
            FNAME
            LNAME
            MNAME
            SEX
            userInfo{
              id
              display_picture{
                id
                userID
                idno
                filename
              }
            }
          }
          appt_hmo_attachment{
            id
            appt_hmo_id
            filename
            file_url
            file_size
            file_type
            date
            isDeleted
          }
        }
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
        }
      }
    }
  }
`;

export const mutation_export_stat = gql`
  mutation mutation_export_stat($data: export_stat_request_type!) {
    mutation_export_stat(data: $data) {
      status
      message
      export_stat_data {
        id
        export_stat
      }
    }
  }
`;

export const mutation_create_hmo_claims = gql`
  mutation mutation_create_hmo_claimss($data: create_hmo_claims_input_request!) {
    mutation_create_hmo_claims(data: $data) {
      status
      message
      hmo_claims_data {
        id
        appt_id
        hmo
        claim_status
        member_name
        member_id
        doctor
        doctorID
        date_appt
        time_appt
        diagnosis_code
        diagnosis
        dispo_code
        disposition
        ver_code
        treatment
        approval_no
        c_email
        c_contact
        c_clinic
        c_caddress
        payment_type
        dateCreated
        export_stat
        isDeleted
      }
    }
  }
`;
