import { gql } from '@apollo/client';


export const get_all_icd_10 = gql`
  query Allicd10($data: icd_10_input_request!) {
    get_all_icd_10(data: $data) { 
      icd10_data
      {
        id
        code
        description
      }
      total_records
      summary_total{
        total
      }
    }
  }
`;