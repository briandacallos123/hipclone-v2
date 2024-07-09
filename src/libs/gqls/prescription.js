import { gql } from '@apollo/client';

export const Prescriptions = gql`
  query QueryAllPrescription($data: AllPrescriptionInput!) {
    QueryAllPrescription(data: $data) {
      Prescription_data {
        presCode
        DATE
        FollowUp
        DOCTOR
        ID
        PATIENTEMR
        REMARKS
        patientID
        patient {
          isEMR
          patientID
          ID
          IDNO
          FULLNAME
          FNAME
          LNAME
          MNAME
          AGE
          SEX
          HOME_ADD
          CONTACT_NO
          userInfo {
            id
            uuid
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        prescriptions_child {
          DOSE
          FORM
          FREQUENCY
          MEDICINE
          MED_BRAND
          PR_ID
          QUANTITY
          DURATION
        }
        clinicInfo {
          Province
          clinic_name
          id
          isDeleted
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_TITLE
          LIC_NUMBER
          PTR_LIC
          S2_LIC
          EMP_EMAIL
          SpecializationInfo {
            id
            name
          }
          DoctorClinics {
            clinic_name
            location
            number
          }
          esig_dp {
            type
            doctorID
            filename
          }
        }
        isFavorite
      }
      totalRecords
    }
  }
`;

// --------------------------------------------

export const PrescriptionsUser = gql`
  query QueryAllPrescriptionUser($data: AllPrescriptionInputUser!) {
    QueryAllPrescriptionUser(data: $data) {
      Prescription_data {
        DATE
        presCode
        FollowUp
        DOCTOR
        ID
        PATIENTEMR
        REMARKS
        patientID
        patient {
          isEMR
          patientID
          ID
          IDNO
          FULLNAME
          FNAME
          LNAME
          MNAME
          AGE
          SEX
          HOME_ADD
          CONTACT_NO
          userInfo {
            id
            uuid
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        prescriptions_child {
          DOSE
          FORM
          FREQUENCY
          MEDICINE
          MED_BRAND
          PR_ID
          QUANTITY
          DURATION
        }
        clinicInfo {
          Province
          clinic_name
          id
          isDeleted
          location
          clinicDPInfo {
            doctorID
            clinic
            filename
            date
          }
        }
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_TITLE
          LIC_NUMBER
          PTR_LIC
          S2_LIC
          SpecializationInfo {
            id
            name
          }
          DoctorClinics {
            clinic_name
            location
            number
          }
          user {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        isFavorite
      }
      totalRecords
    }
  }
`;

export const PrescriptionsUserQr = gql`
  query QueryAllPrescriptionUserQr($data: AllPrescriptionInputUserQr!) {
    QueryAllPrescriptionUserQr(data: $data) {
      Prescription_data {
        DATE
        DOCTOR
        FollowUp
        prescriptions_child {
          DOSE
          DURATION
          FORM
          FREQUENCY
          MED_BRAND
          PR_ID
          QUANTITY
          MEDICINE
        }
        doctorID
        doctorInfo {
          EMP_EMAIL
          EMP_FNAME
          DoctorClinics {
            clinic_name
            location
            number
          }
          EMP_FULLNAME
          EMP_ID
          EMP_MNAME
          EMP_TITLE
          LIC_NUMBER
          PTR_LIC
          S2_LIC
          SpecializationInfo {
            id
            name
          }
          esig_dp {
            doctorID
            filename
            type
          }
          user {
            display_picture {
              id
              filename
              idno
              userID
            }
            id
          }
        }
        ID
        PATIENTEMR
        PR_ID
        REMARKS
        clinicInfo {
          Province
          clinicDPInfo {
            clinic
            date
            doctorID
            filename
          }
          clinic_name
          id
          isDeleted
          location
          number
        }
        isFavorite
        patientID
        patient {
          AGE
          CONTACT_NO
          EMAIL
          FNAME
          FULLNAME
          HOME_ADD
          ID
          LNAME
          MNAME
          IDNO
          SEX
          isEMR
          patientID
          userInfo {
            display_picture {
              filename
              id
              idno
              userID
            }
            id
            uuid
          }
        }
      }
    }
  }
`;

// --------------------------------------------

export const ViewPrescription = gql`
  query QueryAllPrescription($data: Prescription_Single_Input!) {
    QueryPrescription(data: $data) {
      Prescription_data {
        clinicInfo {
          Province
          clinic_name
          id
          isDeleted
          location
          string
        }
        patient {
          isEMR
          patientID
          ID
          IDNO
          FULLNAME
          FNAME
          LNAME
          MNAME
          AGE
          SEX
          HOME_ADD
        }
        DATE
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          LIC_NUMBER
          EMP_MNAME
          EMP_TITLE
          SpecializationInfo {
            id
            name
          }
        }
        FollowUp
        ID
        PATIENTEMR
        REMARKS
        isFavorite
      }
    }
  }
`;

export const MutationPrescription = gql`
  mutation PrescriptionM($data: PrescriptionUpsertType!) {
    MutationPrescription(data: $data) {
      ID
      DATE
      DOCTOR
      FollowUp
      ID
      PATIENTEMR
      REMARKS
      doctorID
      isFavorite
      CLINIC
      patientID
      tempId
      doctorInfo {
        EMP_ID
        EMP_FULLNAME
        EMP_FNAME
        EMP_MNAME
        EMP_TITLE
        LIC_NUMBER
        SpecializationInfo {
          id
          name
        }
        DoctorClinics {
          clinic_name
          location
          number
        }
      }

      patient {
        isEMR
        patientID
        ID
        IDNO
        FULLNAME
        FNAME
        LNAME
        MNAME
        AGE
        SEX
        HOME_ADD
        CONTACT_NO
        gender
        contact_no
        mname
        fname
        lname
      }
      prescriptions_child {
        DOSE
        FORM
        FREQUENCY
        MEDICINE
        MED_BRAND
        PR_ID
        QUANTITY
        DURATION
      }
      message
    }
  }
`;

//  patient {
//    S_ID
//    LNAME
//    FNAME
//    MNAME
//    AGE
//   SEX
//    HOME_ADD
// }
export const MutationPrescriptionChild = gql`
  mutation MutationPrescriptionChild($data: [Prescription_Child_Input_Yawa!]) {
    MutationPrescriptionChild(data: $data) {
      Prescription_data {
        ID
        PR_ID
      }
    }
  }
`;
