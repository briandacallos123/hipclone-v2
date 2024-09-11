import { gql } from '@apollo/client';

export const emr_labreport_patient_data = gql`
  query All_patient_labreport($data: emr_patient_lab_attachments_requests!) {
    emr_labreport_patient_data(data: $data) { 
    e_labreport_patient
      {
        id
        isEMR
        patient
        patientID
        doctor
        clinic
        dateCreated
        type
        labName
        resultDate
        remarks
        isDeleted
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
        emrPatientInfo{
          id
          patientID
          doctorID
          isEMR
          link
          idno
          fname
          mname
          lname
          suffix
          gender
          contact_no
          email
          doctor
          patient
          date_added
          dateofbirth
          address
          status
          isdeleted
          patientRelation{
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
            labreport{
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
              labreport_attachments{
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
          
        }
       
      }
      total_records
      
    }
    
  }
`;



export const emr_mutation_lab_report = gql`
mutation emr_mutation_lab_report_att($data: emr_lab_report_request!,$file: Upload) {
  emr_mutation_lab_report(data: $data,file : $file) {
    status
    message
    emr_lab_report_data{
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


export const labreport_clinic_data = gql`
  query queryLabreportClinics($data:queryLabreportClinicsInp!){
    queryLabreportClinics(data: $data){
      clinicData {
        Province
        clinic_name
        doctorID
        doctor_idno
        id
        isDeleted
        location
        number
        clinicDPInfo {
          clinic
          date
          doctorID
          filename
        }
      }
    }
  }
`;