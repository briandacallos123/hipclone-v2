import { gql } from '@apollo/client';

// query FindYourDoctor($data: FYDInputType! ){
//     findYourDoctor(data: $data){

export const DR_CLINICS = gql`
  query docClinics($data: DoctorInputs) {
    doctorClinics(data: $data) {
      id
      clinic_name
      doctorID
      location
      number
      Province
      isDeleted
    }
  }
`;
export const DoctorClinicsHistory = gql`
  query DoctorClinicsHistory($data: DoctorInputsHistory) {
    DoctorClinicsHistory(data: $data) {
      id
      clinic_name
      doctorID
      location
      number
      Province
      isDeleted
    }
  }
`;
