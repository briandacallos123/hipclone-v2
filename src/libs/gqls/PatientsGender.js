import { gql } from '@apollo/client';

export const GetPatientGender = gql`
  query GetPatientGender {
    GetPatientGender {
      FemaleCount
      MaleCount
    }
  }
`;
