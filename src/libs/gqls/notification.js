import { gql } from "@apollo/client";

export const notification_read = gql`
  mutation MyMutation($data:NotifUpdateInput){
    NotificationUpdate(data: $data) {
      message
    }
  }
`

export const notification_read_merchant = gql`
  mutation NotificationUpdateMerchant($data:NotificationUpdateMerchantInp){
    NotificationUpdateMerchant(data: $data) {
      message
    }
  }
`

export const NotificationQueryMerchant = gql`
query NotificationQueryMerchant($data:NotificationPayloads) {
  NotificationQueryMerchant(data:$data) {
    notifData {
      is_read
      notification_type
      user 
      length 
      medecine {
        description
        dose
        generic_name
        id
        manufacturer
        price
        merchant_store{
          name
        }
      }
      orders{
        id
        generic_name
         
      }
    }
   
    }
  }
`


export const notification_query = gql`
query MyQuery($data:NotificationPayloads) {
    NotifacationQuery(data:$data) {
      NotificationData {
        chat_id
        notif_group_id
        id
        is_read
        created_at
        appt_data{
          id
          status
        }
        notification_type_id{
          title
          id
        }
       
        notification_content {
          content
          created_at
          id
        }
        user {
          name
          avatarAttachment {
            filename
          }
        }
      }
      NotificationDataUnread {
        id
        notification_content {
          content
          created_at
          id
        }
        notification_type_id {
          title
        }
      }
      countAll
      countUnread
    }
  }
`
export const notification_query_final = gql`
  query NotifacationQueryFinal($data:NotificationPayloads){
    NotifacationQueryFinal(data:$data){
        notifDataFinal{
          is_read
          length
          date
          notification_type
          user
          notifIds
          post_feed
          chat{
            id
          }
          prescription{
            ID
          }
          orders {
            attachment {
              id
            }
            brand_name
            created_at
            dose
            generic_name
          }
          appointments {
            Others
            add_date
            clinic
            id
            date
            doctorID
            e_time
            doctor_no
            remarks
            status
            symptoms
            time_slot
          }
        }
      }
  }
`;



export const NotificationReadFinal = gql`
  mutation NotificationUpdateFinal($data:NotificationUpdateFinalInp){
    NotificationUpdateFinal(data: $data) {
      message
    }
  }
`