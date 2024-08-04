import { gql } from '@apollo/client';

export const QueryAllMerchantMedicine = gql`
  query QueryAllMerchantMedicine($data: medicineInputType!) {
    QueryAllMerchantMedicine(data: $data) {
      MedicineType{
        id
        generic_name
        brand_name
        dose
        show_price
        form
        stock
        price
        manufacturer
        attachment_info {
          file_path
          filename
          id
        }
        merchant_store{
          name
          id
          onlinePayment{
            filename
            file_url
            platform
            recepient_contact
          }

        }
      }
      totalRecords
      }
  }
`;

export const CreateMerchantMedecine = gql`
  mutation CreateMerchantMedicine($data: CreateMedicineInputs!,  $file: Upload) {
    CreateMerchantMedicine(data: $data, file: $file) {
      message
      }
  }
`;

export const DeleteMerchantMedicine = gql`
  mutation DeleteMerchantMedicine($data: DeleteMerchantMedicineInp!) {
    DeleteMerchantMedicine(data: $data) {
    
     message
      
      }
  }
`;



export const UpdateMerchantMedicine = gql`
  mutation UpdateMerchantMedicine($data: CreateMedicineInputs!, $file:Upload) {
    UpdateMerchantMedicine(data: $data, file:$file) {
        message
      }
  }
`;



export const QueryAllMedecineForMerchant = gql`
  query QueryAllMedecineForMerchant($data: QueryAllMedecineForMerchantInp!) {
    QueryAllMedecineForMerchant(data: $data) {
      all {
        brand_name
        attachment_info{
          file_path
          filename
        }
        merchant_store{
          name
          id
          is_active
          attachment_store{
            file_url
          }
          onlinePayment{
            filename
            file_url
            platform
            recepient_contact
          }

        }
        dose
        form
        generic_name
        id
        manufacturer
        
        description
        stock
        price
        type
      }
      summaryObjMerchant {
        total
        shortSupply
      }
    }
  }
`;