import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// hooks
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
// components
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import client from '../../../prisma/prismaClient'
import ScannerView from 'src/sections/scan/view'
import ScanFullView from './scan-full-view';
// ----------------------------------------------------------------------

// const OPTIONS = [
//   {
//     label: 'Manage Profile',
//     linkTo: paths.dashboard.user.account,
//   },
//   {
//     label: 'Manage Log-in',
//     linkTo: paths.dashboard.user.login,
//   },
// ];

// const DOCTOR_OPTIONS = [
//   {
//     label: 'Manage Clinic',
//     linkTo: paths.dashboard.user.clinic,
//   },
//   {
//     label: 'Manage Service',
//     linkTo: paths.dashboard.user.service,
//   },
//   {
//     label: 'Manage Sub-account',
//     linkTo: paths.dashboard.user.subaccount,
//   },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();
  const { user, logout, socket } = useAuthContext();

  /* console.log(user?.photoURL); */
  

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      
      
      await logout();
      socket.emit('logout',user?.id);
      popover.onClose();
      router.replace('/');

      // const urlWithoutParams = window.location.pathname;
      // window.history.replaceState({}, document.title, urlWithoutParams);

   
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={'/assets/scanner.svg'}
          alt={user?.displayName}
          sx={{
            width: 30,
            height: 30,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <ScanFullView open={popover.open ? true: false} handleClose={popover.onClose}/>

       
      {/* <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
       <ScannerView/>
       
      
      </CustomPopover> */}
    </>
  );
}
