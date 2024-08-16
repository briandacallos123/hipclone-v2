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
        delivery_history {
          created_at
          id
          status_id {
            id
            name
          }
        }
        delivery_status{
          id
          name
        }
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
          Attachment
        }
        is_deliver
        brand_name
        quantity
        created_at
      }
    } 
  }
`;

export const QueryAllMerchantLogs = gql`
  query QueryAllMerchantLogs($data:merchantLogsInp!){
    QueryAllMerchantLogs(data:$data){
      summary {
        totalRecords
        medicineTotal
        storeTotal
        orderTotal
      }
      merchantLogs {
        id
        content {
          created_at
          id
          title
        }
        createdBy {
          contact
          email
          first_name
        }
        created_at
        medecine {
          generic_name
          form
          manufacturer
          price
          stock
          id
        }
        store {
          address
          description
          distance
          end_time
          id
          rating
        }
        order {
          brand_name
          created_at
          dose
          id
        }
      }
    }
  }
`


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
        delivery_history {
          created_at
          id
          status_id {
            id
            name
          }
        }
        delivery_status{
          id
          name
        }
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
          Attachment
        }
        is_deliver
        brand_name
        quantity
        created_at
      }
    } 
  }
`;

export const QueryAllPatientOrders = gql`
  query QueryAllPatientOrders($data: orderInputType!) {
    QueryAllPatientOrders(data: $data) {
      orderType {
        delivery_history {
          created_at
          id
          status_id {
            id
            name
          }
        }
        delivery_status{
          id
          name
        }
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
          Attachment
        }
        is_deliver
        brand_name
        quantity
        created_at
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
        quantity_sold
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

export const UpdateOrderDeliveryHistory = gql`
  mutation UpdateOrderDeliveryHistory($data: UpdateOrderDeliveryHistoryInp!) {
    UpdateOrderDeliveryHistory(data: $data) {
    
     message
      
      }
  }
`;