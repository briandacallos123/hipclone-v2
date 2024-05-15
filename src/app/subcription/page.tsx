'use client';

// @mui
import Box from '@mui/material/Box';
// sections

import HomePlan from '@/sections/home/home-plan';

// ----------------------------------------------------------------------

export default function FindYourDoctorPage() {
  return (
    <Box sx={{ mt: { xs: 2, md: 5 }, pb: 3 }}>
      <HomePlan />
    </Box>
  );
}
