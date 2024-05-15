import { gql } from '@apollo/client';

export const GeneralTabMutation = gql`
  mutation GeneralTabMutation($data: GeneralTabInput!, $file: Upload) {
    GeneralTabMutation(data: $data, file: $file) {
      status
      message
      EmployeeObj {
        EMP_FNAME
        EMP_MNAME
        EMP_EMAIL
        EMP_SEX
        EMP_LNAME
        EMP_NATIONALITY
        EMP_SUFFIX
        EMP_ADDRESS
        CONTACT_NO
      }
    }
  }
`;

export const MutationESign = gql`
  mutation MutationESign($data: EsignInputTypeWFile!, $file: Upload) {
    MutationESign(data: $data, file: $file) {
      message
    }
  }
`;

export const MutationESignUser = gql`
  mutation MyMutation2($data: EsignInputTypeWFileUser) {
    MutationESignUser(data: $data)
  }
`;
