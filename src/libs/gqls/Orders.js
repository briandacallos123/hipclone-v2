import { gql } from '@apollo/client';

export const QueryAllMedicineOrders = gql`
  query QueryAllMedicineOrders($data: orderInputType!) {
    QueryAllMedicineOrders(data: $data) {
      totalRecords
      summary {
        delivery
        pickup
        pending,
        cancelled,
        done,
        approved
      }
      orderType {
        attachment{
          file_path
          id
          filename
        }
        value
        dose
        payment
        price
        online_reference
        status_id
        form
        generic_name
        store{
          name
        }
        id
        is_paid
        patient {
          CONTACT_NO
          EMAIL
          FNAME
          HOME_ADD
          IDNO
          LNAME
          MNAME
          SEX
          STATUS
          S_ID
          isDeleted
        }
        is_deliver
        brand_name
        quantity
      }
    } 
  }
`;


export const QueryAllOrdersForMerchantHistory = gql`
  query QueryAllOrdersForMerchantHistory($data: orderInputType!) {
    QueryAllOrdersForMerchantHistory(data: $data) {
      totalRecords
      summary {
        delivery
        pickup
        done
        cancelled
      }
      orderType {
        dose
        price
        form
        status_id
        generic_name
        store{
          name
        }
        id
        is_paid
        attachment {
          file_path
          filename
          id
        }
        patient {
          CONTACT_NO
          EMAIL
          FNAME
          HOME_ADD
          IDNO
          LNAME
          MNAME
          SEX
          STATUS
          S_ID
          isDeleted
        }
        store {
          name
          attachment_store {
            filename
            id
            file_url
          }
        }
        is_deliver
        brand_name
        quantity
      }
    } 
  }
`;

export const QueryAllPatientOrders = gql`
  query QueryAllPatientOrders($data: orderInputType!) {
    QueryAllPatientOrders(data: $data) {
      orderType {
        brand_name
        dose
        form
        status_id
        generic_name
        id
        is_deliver
        is_paid
        quantity
        store {
          name
          attachment_store {
            filename
            id
            file_url
          }
        }
        patient {
          CONTACT_NO
          EMAIL
          FNAME
          HOME_ADD
          LNAME
        }
        attachment {
          file_path
          filename
          id
        }
      }
      summary {
        pickup
        delivery
        pending,
        done,
        approved,
        cancelled
      }
      totalRecords
    } 
  }
`;

export const QueryAllMedecineByStore = gql`
  query QueryAllMedecineByStore($data: medicineInputType!) {
    QueryAllMedecineByStore(data: $data) {
      MedicineType {
        id
        generic_name
        brand_name
        dose
        type
        form
        description
        price
        manufacturer
        stock
        attachment_info{
          id
          file_path
          filename
        }
      }
    }
  }
`;

export const CreateOrders = gql`
  mutation CreateOrders($data: CreateOrdersInp!, $file: Upload) {
    CreateOrders(data: $data, file:$file) {
      message
      }
  }
`;

export const DeleteOrder = gql`
  mutation DeleteOrder($data: DeleteOrdersInp!) {
    DeleteOrder(data: $data) {
    
     message
      
      }
  }
`;

export const UpdateOrder = gql`
  mutation UpdateOrderStatus($data: UpdateOrderInputs!) {
    UpdateOrderStatus(data: $data) {
    
     message
      
      }
  }
`;

// patient

export const QueryAllMedicineOrdersPatient = gql`
  query QueryAllMedicineOrdersPatient($data: orderInputType!) {
    QueryAllMedicineOrdersPatient(data: $data) {
  
        brand_name
        dose
        quantity
        form
        generic_name
        is_deliver
        is_paid
        id
      
      }
  }
`;