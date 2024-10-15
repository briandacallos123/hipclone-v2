'use client';

import { Box } from '@mui/material';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function Loading() {
  return (

    <Box sx={{
      height: '100vh'
    }}>
      <LoadingScreen />
    </Box>
  );


}
