'use client';

// sections

import { UserServiceView } from '@/sections/user/@view';
import { RoleBasedGuard } from '@/auth/guard';
// ----------------------------------------------------------------------
/* 
export const metadata = {
  title: 'Manage Service',
};
 */
export default function UserServicePage() {
  return(
  <RoleBasedGuard hasContent roles={['doctor']}>  
  <UserServiceView />;
  </RoleBasedGuard>
  )
}
