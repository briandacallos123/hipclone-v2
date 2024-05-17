import { gql } from '@apollo/client';

export const QueryAllMerchant = gql`
  query QueryAllMerchant($data: merchantInputType!) {
    QueryAllMerchant(data: $data) {
        merchantType {
            contact
            email
            first_name
            last_name
            middle_name
            user_status
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

