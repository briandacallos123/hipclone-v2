import { gql } from '@apollo/client';

export const get_procedure = gql`
  query procedures($data: data) {
    QueryPayProcedure(data: $data) {
      name
      payment_procedures_category {
        name
      }
    }
  }
`;
export const get_Allprocedure = gql`
  query QueryAllPayProcedure {
    QueryAllPayProcedure {
      id
      name
      payment_procedures_category {
        id
        name
      }
    }
  }
`;

export const GET_PROCEDURES_NEW = gql`
  query QueryAllprocedures {
    QueryAllprocedures {
      id
      name
      payment_procedures {
        id
        name
      }
    }
  }
`;
