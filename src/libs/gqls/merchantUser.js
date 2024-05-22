import { gql } from '@apollo/client';

export const QueryAllMerchantMedicine = gql`
  query QueryAllMerchantMedicine($data: medicineInputType!) {
    QueryAllMerchantMedicine(data: $data) {
      MedicineType{
        id
        generic_name
        brand_name
        dose
        form
        price
        manufacturer
      }
      }
  }
`;

export const CreateMerchantMedecine = gql`
  mutation CreateMerchantMedicine($data: CreateMedicineInputs!) {
    CreateMerchantMedicine(data: $data) {
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