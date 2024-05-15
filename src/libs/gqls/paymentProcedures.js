import { gql } from '@apollo/client';

export const Get_payment_procedures_category_data = gql`
  query Get_payment_procedures_category_data($data: payment_procedures_category_request!) {
    payment_procedures_category_data(data: $data) {
      procedures_category_data {
        id
        name
        payment_procedures {
          id
          name
          isDeleted
        }
      }
    }
  }
`;


