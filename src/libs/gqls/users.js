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