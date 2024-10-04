import { useEffect, useState } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';
import { Logo } from 'src/components/logo';
//

// ----------------------------------------------------------------------

export default function FooterNav() {
  const pathname = usePathname();

  const theme = useTheme();

  const [value, setValue] = useState('dashboard');

  useEffect(() => {
    if (pathname.includes('appointment')) {
      setValue('appointment');
    } else if (pathname.includes('chat')) {
      setValue('chat');
    } else if (pathname.includes('calendar')) {
      setValue('calendar');
    } else if (pathname.includes('user')) {
      setValue('account');
    } else {
      setValue('dashboard');
    }
  }, [pathname]);

  const isLight = theme.palette.mode === 'light';

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
       
        boxShadow: `0 -20px 20px ${
          isLight ? alpha(theme.palette.grey[500], 0.2) : alpha(theme.palette.common.black, 0.2)
        }`,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
       
      >
        <BottomNavigationAction
          component={RouterLink}
          href={paths.dashboard.appointment.root}
          label="Appointments"
          value="appointment"
          icon={<Iconify icon="solar:calendar-add-bold-duotone" />}
        />

        <BottomNavigationAction
          component={RouterLink}
          href={paths.dashboard.chat}
          label="Chat"
          value="chat"
          icon={<Iconify icon="solar:chat-round-line-bold-duotone" />}
        />

        <BottomNavigationAction
          component={RouterLink}
          href={paths.dashboard.root}
          value="dashboard"
          icon={<Logo sx={{ width: 60, height: 60 }} />}
          sx={{
            mt: -3.5,
            height: 92,
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.spacing(4, 4, 0, 0),
          }}
        />

        <BottomNavigationAction
          component={RouterLink}
          href={paths.dashboard.feeds}
          label="Health Bites"
          value="health bites"
          sx={{
            textAlign:'center',
            lineHeight:1
          }}
          icon={<Iconify icon="mdi:newspaper-variant-multiple" />}
        />

        <BottomNavigationAction
          component={RouterLink}
          href={paths.dashboard.user.account}
          label="Profile"
          value="account"
        
          icon={<Iconify icon="solar:user-bold-duotone" />}
        />
      </BottomNavigation>
    </Paper>
  );
}
