import { gql } from '@apollo/client';


export const CreateNewStore = gql`
  mutation CreateNewStore($data: CreateNewStoreInp!, $file: Upload!) {
    CreateNewStore(file: $file, data: $data) {
      message
    }
  }
`;

export const UpdateStore = gql`
  mutation UpdateStore($data: CreateNewStoreInp!, $file: Upload!) {
    UpdateStore(file: $file, data: $data) {
      message
    }
  }
`;



export const QueryAllStore = gql`
  query QueryAllStore($data: storeInputType) {
    QueryAllStore(data: $data) {
      address
      days
    attachment_store {
      file_url
      filename
      id
    }
    description
    id
    is_active
    is_deliver
    name
    product_types
    rating
    }
  }
`;