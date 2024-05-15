import { gql } from '@apollo/client';

export const get_eSign = gql`
  query QueryEsignData($data: EsignInputType) {
    QueryEsign(data: $data) {
      filename
    }
  }
`;
