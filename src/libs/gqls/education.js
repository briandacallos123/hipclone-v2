import { gql } from '@apollo/client';

export const EducationMutation = gql`
  mutation EducationMutation($data: EducationInput!) {
    EducationMutation(data: $data) {
      schoolName
    }
  }
`;
export const GetEducations = gql`
  query GetEducations {
    GetEducations {
      message
      data {
        fellowship1 {
          name
          year
        }
        fellowship2 {
          name
          year
        }
        recidency {
          name
          year
        }
        medicalSchool {
          name
          year
        }
      }
    }
  }
`;
