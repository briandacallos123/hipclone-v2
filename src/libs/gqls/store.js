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

export const UpdateStatusStore = gql`
  mutation UpdateStatusStore($data: DeleteStoreInp!) {
    UpdateStatusStore( data: $data) {
      message
    }
  }
`;


export const DeleteStore = gql`
  mutation DeleteStore($data: DeleteStoreInp!) {
    DeleteStore(data: $data) {
      message
    }
  }
`;



export const QueryAllStore = gql`
  query QueryAllStore($data: storeInputType) {
    QueryAllStore(data: $data) {
      data {
        address
        attachment_store {
          file_url
          filename
          id
        }
        days
        description
        id
        is_active
        is_deliver
        name
        product_types
        rating
      }
      summary {
        active
        inactive
      }
      totalRecords
    }
  }
`;

export const QueryAllStoreNoId = gql`
  query QueryAllStoreNoId($data: storeInputType) {
    QueryAllStoreNoId(data: $data) {
      address
      days
      distance
      description
      id
      attachment_store {
        file_url
        filename
        id
      }
      is_active
      is_deliver
      name
      product_types
      rating
    }
  }
`;