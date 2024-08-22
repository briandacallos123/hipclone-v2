import { gql } from "@apollo/client";

export const USER_REGISTER = gql`
mutation registerUser($input: UserProfileUpsertType!) {
  registerUser(data: $input) {
    lastName
    firstName
    username
    uname
    mobile_phone
    password
    email
  }
}
`;

export const USER_LOGOUT = gql`
mutation logoutUserLogin($data: updateUserInp!) {
  logoutUserLogin(data: $data) {
    email
  }
}
`;

export const USER_UPDATE_USERNAME = gql`
mutation mutationUpdateUsername($data: UserUpdateProfileUpsertType!) {
  mutationUpdateUsername(data: $data) {
    status
    message
    update_username_data{
      uname
    }
  }
}
`;

export const USER_UPDATE_MOBILE_PHONE = gql`
mutation mutationUpdatePhone($data: UserUpdatePhoneProfileUpsertType!) {
  mutationUpdatePhone(data: $data) {
    status
    message
    update_phone_data{
      mobile_phone
    }
  }
}
`;


export const USER_UPDATE_PASSWORD = gql`
mutation mutationUpdatePassword($data: UserUpdatePasswordProfileUpsertType!) {
  mutationUpdatePassword(data: $data) {
    status
    message
    update_password_data{
      password
    }
  }
}
`;


export const QueryUserProfile = gql`
query QueryUserProfile($data: UserProfileInpType!) {
  QueryUserProfile(data: $data) {
    firstName
    id
    lastName
    invalid
    middleName
    uname
    username
    address
    contact
    dateOfBirth
    displayName
    nationality
    occupation
    sex
    suffix
    coverURL
    doctorId
    photoURL
    practicing_since
    s2_number
    title
    validity
    PTR
    PRC
    esig {
      doctorID
      filename
      id
      idno
      type
      uploaded
    }
    esigDigital {
      doctorID
      filename
      id
      idno
      type
      uploaded
    }
    esigFile {
      doctorID
      filename
      id
      idno
      type
      uploaded
    }
  }
}
`;