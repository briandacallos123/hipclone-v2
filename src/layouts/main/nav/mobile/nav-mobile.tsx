'use client';

import { useEffect } from 'react';
// @mui
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { usePathname } from 'src/routes/hook';
// components
import SvgColor from 'src/components/svg-color';
import Scrollbar from 'src/components/scrollbar';
import { LogoFull } from 'src/components/logo';
//
import { NavProps } from '../types';
import NavItem from './nav-item';
import { LoginButton, SignupButton, GotoDashboard } from '../../../_common';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

export default function NavMobile({ offsetTop, data }: NavProps) {
  const pathname = usePathname();
  const { user }  = useAuthContext();
  const nav = useBoolean();

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <IconButton
        onClick={nav.onTrue}
        sx={{
          ml: 1,
          ...(offsetTop && {
            color: 'text.primary',
          }),
        }}
      >
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={nav.value}
        onClose={nav.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <LogoFull sx={{ mx: 2.5, my: 3 }} />

          <List component="nav" disablePadding>
            {data.map((link) => (
              <NavItem key={link.title} item={link} />
            ))}
          </List>

          <Stack spacing={2} sx={{ mt: 3, px: 2 }}>
           {!user && (<><SignupButton /><LoginButton /></>)}
           {user && (<GotoDashboard />)}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
