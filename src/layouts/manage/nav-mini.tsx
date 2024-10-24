// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { Logo } from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';
import Link from 'next/link';
import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();

  const navData = useNavData();

  // console.log('userMini', user)
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        {/*  */}

        <Link href={paths.dashboard.root}>
           <Logo sx={{ mx: 'auto', my: 2 }} />
      </Link>

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role || 'doctor',
          }}
        />
      </Stack>
    </Box>
  );
}
