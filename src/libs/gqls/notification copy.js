import { gql } from "@apollo/client";

export const notification_read = gql`
  mutation MyMutation($data:NotifUpdateInput){
    NotificationUpdate(data: $data) {
      message
    }
  }
`

export const notification_query = gql`
query MyQuery($data:NotificationPayloads) {
    NotifacationQuery(data:$data) {
      NotificationData {
        chat_id
       
        id
        is_read
        created_at
        appt_data{
          id
          status
        }
        notification_type_id{
          title
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