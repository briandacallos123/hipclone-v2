import { gql } from '@apollo/client';

export const QueueGetClinicOfPatient = gql`
  query QueueGetClinicOfPatient($data:QueueClinicInp){
    QueueGetClinicOfPatient(data:$data){
      appointments_data {
        voucherId
        AddRequest
        add_date
        Others
        clinic
        date
        doctorID
        payment_status
        remarks
        status
        symptoms
        time_slot
        clinicInfo {
          Province
          clinic_name
          date
          doctor_idno
          e_clinicschedule
          id
          isDeleted
          location
          number
          time_interval
          schedule
          s_clinicschedule
          uuid
        }
      }
    }
  }
`

export const QueryQueuePatient = gql`
    query QueuePatient($data:QueuePatientInp){
        QueuePatient(data:$data){
            appointments_data{
              voucherId
                clinicInfo {
                  clinic_name
                  Province
                  location
                  id
                  uuid
                  }
                patientInfo {
                    FNAME
                    LNAME
                    UUID
                    EMAIL
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
                AddRequest
                Others
                add_date
                userId
                type
                time_slot
                symptoms
                status
                remarks
                patient_no
                payment_status
                patientID
                date
            }
            position
            is_not_today
            notApproved
            is_paid
            is_done
            notAppNotToday{
              AddRequest
              Others
              add_date
              voucherId
              userId
              type
              time_slot
              status
              clinicInfo {
                clinic_name
                Province
                location
                id
                uuid
                }
              patientInfo {
                  FNAME
                  LNAME
                  UUID
                  EMAIL
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
            }
        }
    }
`

