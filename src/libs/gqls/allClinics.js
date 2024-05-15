import { gql } from '@apollo/client';

export const AllClinics = gql`
  query AllClinics {
    AllClinics {
      clinic_name
      number
      Province
      location
      id
      isDeleted
    }
  }
`;
export const GET_ONE_Clinic = gql`
  query OneClinic($data: DoctorInputs!) {
    OneClinic(data: $data) {
      clinic_name
      Province
      location
      id
    }
  }
`;

export const QueueReadCountPage = gql`
  query QueueReadCountPage($data: QueueCountInp!) {
    QueueReadCountPage(data: $data) {
      queueCount
      queueDone
      queueCancelled
    }
  }
`;

export const GET_CLINIC_USER = gql`
  query AllClinicUser($data: DoctorInputs!) {
    AllClinicUser(data: $data) {
      id
      clinic_name
      Province
      location
    }
  }
`;
