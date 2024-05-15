// // sections
// import { AmplifyForgotPasswordView } from 'src/sections/auth';

// // ----------------------------------------------------------------------

// export const metadata = {
//   title: 'HIP: Forgot Password',
// };

// export default function ForgotPasswordPage() {
//   return <AmplifyForgotPasswordView />;
// }


import { Metadata } from 'next';
import  ForgotPasswordView  from 'src/sections/auth/view/forgot-password-view';

// ----------------------------------------------------------------------

export const metadata : Metadata = {
  title: 'Natrapharm HIP: Forgot Password',
  description: 'Forgot password',
};

const ForgotPasswordPage = () => {
  return (
    <ForgotPasswordView />
  )
}

export default ForgotPasswordPage
