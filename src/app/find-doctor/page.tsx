// @mui
import Box from '@mui/material/Box';
// sections
import { AppointmentFindView } from 'src/sections/appointment/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Find Your Doctor',
};

export default function FindYourDoctorPage() {
  return (
    <Box sx={{ mt: { xs: 2, md: 5 }, pb: 3 }}>
      <AppointmentFindView />
    </Box>
  );
}
