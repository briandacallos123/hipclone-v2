'use client';

// @mui
import Box from '@mui/material/Box';
// sections
import { FindDoctorView } from '@/sections/findDoctor/view';
import { RoleBasedGuard } from '@/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

/* export const metadata = {
  title: 'Find Your Doctor',
}; */

export default function FindYourDoctorPage() {
  const { user } = useAuthContext();

  // if (user) {
  //   return (
  //     <RoleBasedGuard hasContent roles={['patient']}>
  //       <FindDoctorView />
  //     </RoleBasedGuard>
  //   );
  // }

  return (
    <Box sx={{ mt: { xs: 2, md: 5 }, pb: 3 }}>
      <FindDoctorView />
    </Box>
  );
}
