import { gql } from '@apollo/client';

export const QueryAllMerchant = gql`
  query QueryAllMerchant($data: merchantInputType!) {
    QueryAllMerchant(data: $data) {
      merchantType {
        contact
        email
        first_name
        id
        last_name
        middle_name
        store {
          id
          address
          lat
          lng
          name
        }
        user_status
      }
        active
        inactive
      }
  }
`;

export const QueryMerchantDashboard = gql`
  query QueryMerchantDashboard{
    QueryMerchantDashboard {
      ordersCount
      salesProfit
      storeCount
      orders {
        created_at
        price
        quantity
      }
     }
  }
`;


export const CreateMerchant = gql`
  mutation CreateMerchant($data: CreateMerchantInp!) {
    CreateMerchant(data: $data) {
    
        contact
        email
        first_name
        last_name
        middle_name
        user_status
      
      }
  }
`;

export const DeleteMerchant = gql`
  mutation DeleteMerchant($data: DeleteMerchInp!) {
    DeleteMerchant(data: $data) {
    
     message
      
      }
  }
`;



export const EditMerchant = gql`
  mutation EditMerchant($data: EditMerchInp!, $file:Upload) {
    EditMerchant(data: $data, file:$file) {
        message
      }
  }
`;
