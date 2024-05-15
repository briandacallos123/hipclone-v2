import { gql } from '@apollo/client';


export const Get_User_Status = gql`
  query MyQuery {
    Get_User_Status(data: {id: 1}) {
      email
      id
      isOnline
    }
  }
`;