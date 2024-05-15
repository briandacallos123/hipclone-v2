'use client';

// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
//
import LoginUsername from '../login/login-username';
import LoginPassword from '../login/login-password';
import LoginContact from '../login/login-contact';

// ----------------------------------------------------------------------

export default function UserLoginView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Manage Profile
      </Typography>

      <Stack spacing={3}>
        <LoginUsername />

        <LoginPassword />

        <LoginContact />
      </Stack>
    </Container>
  );
}
