import { gql } from '@apollo/client';

export const labreport_patient_data = gql`
  query All_patient_labreport($data: patient_lab_attachments_requests!) {
    labreport_patient_data(data: $data) { 
    labreport_patient
      {
        id
        isEMR
        patient
        patientID
        emrPatientID
        doctor
        clinic
        dateCreated
        type
        labName
        resultDate
        remarks
        isDeleted
        labreport_attachments
        {
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
        doctorInfo{
          EMPID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX  
          CONTACT_NO  
          EMP_EMAIL  
          EMP_TITLE
        }
        clinicInfo{
          id
          doctor_idno
          clinic_name
          schedule
          s_clinicschedule
          e_clinicschedule
          location
          number
          Province
          date
          clinicDPInfo{
            doctorID
            clinic
            filename
            date
          }
        }
        patientInfo{
          IDNO
          FULLNAME
          FNAME
          LNAME
          MNAME
          SUFFIX
          SEX
          BDAY
          BPLACE
          BLOOD_TYPE
          AGE
          HOME_ADD
          EMAIL
          userInfo{
            uuid
            id
            display_picture{
              id
              userID
              idno
              filename
            }
          }
        }
        emrPatientInfo{
          id
          patientID
          patientRelation{
            IDNO
            FNAME
            LNAME
            MNAME
            SUFFIX
            SEX
            BDAY
            BPLACE
            BLOOD_TYPE
            AGE
            HOME_ADD
            EMAIL
          }
        }
       
      }
      total_records
      clinic{
        id
        clinic_name
      }
      
    }
    
  }
`;



export const mutation_lab_report = gql`
mutation mutation_lab_report_att($data: lab_report_request!,$file: Upload) {
  mutation_lab_report(data: $data,file : $file) {
    status
    message
    lab_report_data{
      id
      patientID
      emrPatientID
      doctorID
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
    }
  }
}
`;


export const update_lab_report = gql`
mutation update_lab_report($data: lab_report_request!,$file: Upload) {
  update_lab_report(data: $data,file : $file) {
    status
    message
    lab_report_data{
      id
      patientID
      emrPatientID
      doctorID
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
    }
  }
}
`;



