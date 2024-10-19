'use client';

// sections

import { UserSubaccountListView } from '@/sections/user/@view';
import { RoleBasedGuard } from '@/auth/guard';

// ----------------------------------------------------------------------

/* export const metadata = {
  title: 'Manage Sub-account',
};
 */
export default function UserSubaccountPage() {
  return (
    <RoleBasedGuard hasContent roles={['doctor']}>
      <UserSubaccountListView />;
    </RoleBasedGuard>
  )
}
