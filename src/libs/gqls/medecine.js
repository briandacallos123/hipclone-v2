import { gql } from '@apollo/client';

export const QuerySingleMedecine = gql`
  query QuerySingleMedecine($data: QuerySinelgMedecineInp!) {
    QuerySingleMedecine(data: $data) {
        brand_name
        dose
        form
        generic_name
        id
        manufacturer
        description
        attachment_info {
          file_path
          filename
          id
        }
        merchant_store {
          address
          attachment_store {
            file_url
            filename
            id
          }
          days
          description
          distance
          id
          is_active
          is_deliver
          name
          product_types
          rating
        }
        price
        show_price
        stock
    }
  }
`;
