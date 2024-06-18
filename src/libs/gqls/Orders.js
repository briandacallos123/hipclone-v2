import { gql } from '@apollo/client';

export const QueryAllMedicineOrders = gql`
  query QueryAllMedicineOrders($data: orderInputType!) {
    QueryAllMedicineOrders(data: $data) {
      totalRecords
      summary {
        delivery
        pickup
      }
      orderType {
        dose
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

export const QueryAllMedecineByStore = gql`
  query QueryAllMedecineByStore($data: medicineInputType!) {
    QueryAllMedecineByStore(data: $data) {
      MedicineType {
        id
        generic_name
        brand_name
        dose
        form
        price
        manufacturer
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
  mutation CreateOrders($data: CreateOrdersInp!) {
    CreateOrders(data: $data) {
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