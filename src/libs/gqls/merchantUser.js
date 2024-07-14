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
  mutation UpdateMerchantMedicine($data: CreateMedicineInputs!) {
    UpdateMerchantMedicine(data: $data) {
        message
      }
  }
`;