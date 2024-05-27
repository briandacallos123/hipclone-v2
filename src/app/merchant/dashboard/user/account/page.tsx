// sections
// import { UserAccountView } from 'src/sections/account/view';
import { MerchantAccountView } from '@/sections/medecine/account/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Manage Profile',
};

export default function UserAccountPage() {
  return <MerchantAccountView />;
}
