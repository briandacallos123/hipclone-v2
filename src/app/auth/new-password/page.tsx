// sections
import { Metadata } from 'next';
import NewPasswordView from 'src/sections/auth/view/new-password-view';

// ----------------------------------------------------------------------

export const metadata : Metadata = {
  title: 'Natrapharm HIP: New Password',
  description: 'New password',
};

export default function NewPasswordPage() {
  return <NewPasswordView />;
}
