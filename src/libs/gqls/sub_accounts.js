import { gql } from '@apollo/client';

export const sub_account_doctor_data = gql`
  query All_sub_account_data($data: sub_account_requests!) 
  {
    sub_account_doctor_data(data: $data)
    { 
      sub_account_doctor_all_data
          {
            id
            secretaryID
            doctorID
            idno
            docidno
            status
            appt_all
            appt_approve
            appt_cancel
            appt_done
            appt_type
            appt_pay
            lab_result
            hmo_claim
            pres_view
            doctorInfo
            {
              EMP_ID
              EMP_FULLNAME
              EMP_FNAME
              EMP_MNAME
              EMP_LNAME
              EMP_SUFFIX
              CONTACT_NO
              EMP_EMAIL
              EMP_TITLE
            }
            subAccountInfo
            {
              id
              userType
              email
              idno
              fname
              mname
              lname
              suffix
              gender
              mobile_no
              bday
              occupation
              logActionInfo 
              {
                id
                secretaryID
                patientID
                idno
                request
                patient
                log_type
                log_type_name
                date
                type
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
              }
              userInfo
              {
                id
                username
                uname
                mobile_number
                email
                password
                userType
                register_date
                last_login
                last_activity
                notes
                code
                userTries
                isFirstLogin
                userSkin
                isOnline
                isActivated
                isDeleted
                display_picture{
                  id
                  userID
                  idno
                  filename
                }
              }
            }
          }   
          total_records
          summary_total
          {
            total
            active
            inactive
          }   
    }
    
  }
`;


















export const sub_account_data_by_id = gql`
  query All_sub_account_data_by_id($data: sub_account_requests_by_id!) 
  {
    sub_account_data_by_id(data: $data)
    { 
      sub_account_data_by_ids
      {
            id
            secretaryID
            doctorID
            idno
            docidno
            status
            appt_all
            appt_approve
            appt_cancel
            appt_done
            appt_type
            appt_pay
            lab_result
            hmo_claim
            pres_view
            doctorInfo
            {
              EMP_ID
              EMP_FULLNAME
              EMP_FNAME
              EMP_MNAME
              EMP_LNAME
              EMP_SUFFIX
              CONTACT_NO
              EMP_EMAIL
              EMP_TITLE
            }
            subAccountInfo
            {
              id
              userType
              email
              idno
              fname
              mname
              lname
              suffix
              gender
              mobile_no
              bday
              occupation
              logActionInfo 
              {
                id
                secretaryID
                patientID
                idno
                request
                patient
                log_type
                log_type_name
                date
                type
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
              }
              userInfo
              {
                id
                username
                uname
                mobile_number
                email
                password
                userType
                register_date
                last_login
                last_activity
                notes
                code
                userTries
                isFirstLogin
                userSkin
                isOnline
                isActivated
                isDeleted
                display_picture{
                  id
                  userID
                  idno
                  filename
                }
              }
            }
          }
          total_records
      
    }
    
  }
`;












export const mutation_create_sub_account = gql`
mutation mutation_sub_account($data: user_sub_account_input_request!) {
  mutation_create_sub_account(data: $data) {
    status
    message
    create_sub_account_data{
      id
      userType
      email
      idno
      fname
      mname
      lname
      suffix
      gender
      mobile_no
      bday
      occupation
    }
  }
}
`;





export const mutation_secretary_permission = gql`
mutation mutation_permission($data: secretary_permission_request_type!) {
  mutation_secretary_permission(data: $data) {
    status
    message
    update_secretary_permission_data{
      id
      secretaryID
      doctorID
      idno
      docidno
      status
      appt_all
      appt_approve
      appt_cancel
      appt_done
      appt_type
      appt_pay
      lab_result
      hmo_claim
      pres_view
    }
  }
}
`;







export const email_validation = gql`
query query_email_validation($data: sub_account_input_email_request!) {
  email_validation(data: $data) {
    status
    message
    email_data{
      email
    }
  }
}
`;


export const mobile_no_validation = gql`
query query_mobile_no_validation($data: sub_account_input_mobile_no_request!) {
  mobile_no_validation(data: $data) {
    status
    message
    mobile_no_data{
      mobile_no
    }
  }
}
`;