import { gql } from '@apollo/client';

export const LicensesUpdate = gql`
  mutation LicenseMutation($data: LicensesInput!) {
    LicenseMutation(data: $data) {
      LicenseData {
        LIC_NUMBER
        PRACTICING_SINCE
        PTR_LIC
        S2_LIC
        VALIDITY
      }
      message
      status
    }
  }
`;
