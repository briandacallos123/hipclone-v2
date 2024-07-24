import { gql } from '@apollo/client';

export const GetPaymentMethod = gql`
  query GetPaymentMethod($data: PaymentMethodInputType) {
    GetPaymentMethod(data: $data) {
      data {
        title
        id
        doctorID
        description
        acct
        attachment{
          id,
          filename
        }
      }
      totalRecords
    }
  }
`;
// export const CreatePayment = gql`
//   mutation CreateNewStoreTesting($data: CreateNewStoreTestingInput,  $file: Upload!) {
//     CreateNewStoreTesting(file: $file, data: $data) {
//      message
//     }
//   }
// `;
export const CreatePayment = gql`
  mutation CreatePayment($data: PaymentMethodInputs,  $file: Upload!) {
    CreatePayment(file: $file, data: $data) {
      description
      acct
      doctorID
      id
      title
      tempId
    }
  }
`;
export const DeletePayment = gql`
  mutation DeletePayment($data: PaymentMethodInputsDel) {
    DeletePayment(data: $data) {
      title
    }
  }
`;
export const UpdateFees = gql`
  mutation UpdateFees($data: UpdateFeeInputs) {
    UpdateFee(data: $data) {
      abstract
      certificate
      clearance
      isAddReqFeeShow
    }
  }
`;
export const GetFees = gql`
  query GetFees {
    GetFees {
      abstract
      certificate
      clearance
      isAddReqFeeShow
    }
  }
`;
export const GetProfFees = gql`
  query GetProfFees {
    GetProfFee {
      FEES
      isFeeShow
    }
  }
`;

export const UpdateProfFees = gql`
  mutation UpdateProfFee($data: UpdateFeeInputsProf) {
    UpdateProfFee(data: $data) {
      FEES
    }
  }
`;
export const GetPaymentSched = gql`
  query GetPaymentSched {
    GetPaymentSched {
      isPaySchedShow
    }
  }
`;

export const UpdatePaymentSched = gql`
  mutation UpdatePaymentSched($data: PaymentSchedInput) {
    UpdatePaymentSched(data: $data) {
      isPaySchedShow
    }
  }
`;
