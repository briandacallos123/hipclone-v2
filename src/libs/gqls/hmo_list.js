import { gql } from '@apollo/client';

export const get_hmo_list = gql`
  query get_hmo_list
  {
    hmo_list
    { 
      id 
      name
    }
  }
`;
