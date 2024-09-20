'use client';

// sections

import { UserClinicListView } from '@/sections/user/@view';
import { RoleBasedGuard } from '@/auth/guard';

// ----------------------------------------------------------------------

/* export const metadata = {
  title: 'Manage Clinic',
}; */

export default function UserClinicPage() {
  return (
    <RoleBasedGuard hasContent roles={['doctor']}>
      <UserClinicListView />;
    </RoleBasedGuard>
  )



}
