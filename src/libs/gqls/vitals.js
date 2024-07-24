import { gql } from '@apollo/client';

// category
export const GetAllVitalCategories = gql`
    query QueryAllCategory($data: QueryAllCategoryInput) {
        QueryAllCategory(data:$data){
            dataList {
                measuring_unit
                title
                id
          }
        }
    }
`


export const POST_VITALS_CATEGORY = gql`
  mutation CreateNewCategoryVitals($data: CreateNewCategoryVitalsInp!) {
    CreateNewCategoryVitals(data: $data) {
      message
    }
  }
`;

// end of cateogry

// vital dynamic data

export const QueryAllVitalData = gql`
    query QueryAllVitalData($data:QueryAllVitalDataInp) {
        QueryAllVitalData(data:$data){
            listData {
                vital_category {
                  id
                  measuring_unit
                  title
                }
                value
                patientId
                createdAt
                id
                doctorId
                categoryId
              }
        }
    }
`
