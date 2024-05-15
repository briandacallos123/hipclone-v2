// // sections
// import { AmplifyVerifyView } from 'src/sections/auth';

// // ----------------------------------------------------------------------

// export const metadata = {
//   title: 'HIP: Verify',
// };

// export default function VerifyPage() {
//   return <AmplifyVerifyView />;
// }


// sections
import { Metadata } from 'next';
import VerifyView from 'src/sections/auth/view/verify-view';

// ----------------------------------------------------------------------

export const metadata : Metadata = {
  title: 'Natrapharm HIP: Verify',
  description: 'Verify',
};

export default function VerifyViewPage() {
  return <VerifyView />;
}
