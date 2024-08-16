import { gql } from '@apollo/client';

export const GET_ALL_CHATS = gql`
    query GetConversation {
        allConversations{
            id
            unreadCount
            type
            lastActivity
            participants{
            id
            address
            role
            status
            avatarUrl
            email
            name
            lastActivity      
            },
            messages{
            read_ids
            id
            body
            lastActivity
            createdAt
            contentType
            senderId
            attachments{
                id
                preview
                name
                size
                modifiedAt
                createdAt
                path
            }
            }
        }
    }
`
export const GET_CONTACTS = gql`
    query DoctorPatient {
        allDoctorPatient {
        id
        status
        role
        email
        name
        lastActivity
        address
        avatarUrl
        phoneNumber
        }
}
`
export const GET_CONVERSATION = gql`
    query Conversation($id:String!) {
          conversation(id:$id){
            id
            unreadCount
            type
            lastActivity
            participants{
            id
            address
            role
            status
            avatarUrl
            email
            name
            lastActivity
            
            },
            messages{
            id
            body
            createdAt
            lastActivity
            contentType
            senderId
            attachments{
                id
                preview
                name
                size
                modifiedAt
                createdAt
                path
            }
            }
        }
    }
`

export const CREATE_REPLY_CONVERSATION = gql`
    mutation CreateReplyConversation($data: CreateUpdateConversationType) {
    createReplyConversation(data: $data) {
        id
        unreadCount
        type
        lastActivity
        participants {
        id
        address
        role
        status
        avatarUrl
        email
        name
        lastActivity
        }
        messages {
        id
        body
        createdAt
        lastActivity
        contentType
        senderId
        attachments {
            id
            preview
            name
            size
            modifiedAt
            createdAt
            path
        }
        }
    }
}
`

export const REPLY_CONVERSATION_SUB = gql`
       subscription  ReplyMessage ($id: String!) {
        replyMessage(id: $id) {
            id
            unreadCount
            type
            lastActivity
            participants {
            id
            address
            role
            status
            avatarUrl
            email
            name
            lastActivity
            }
            messages {
            id
            body
            createdAt
            lastActivity
            contentType
            senderId
            attachments {
                id
                preview
                name
                size
                modifiedAt
                createdAt
                path
            }
            }
        }
    }    
`
