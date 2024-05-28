import { gql } from '@apollo/client';


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
        }
    }
`