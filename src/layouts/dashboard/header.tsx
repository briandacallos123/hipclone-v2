// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import SvgColor from 'src/components/svg-color';
import { LogoFull } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
import { Searchbar, AccountPopover, Scanner, SettingsButton, NotificationsPopover } from '../_common';
import NotificationController from '../_common/notifications-popover/notification-controller';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/auth/hooks';
import Iconify from '@/components/iconify/iconify';
import HeaderCart from '../_common/header-cart';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { useOrdersContext } from '@/context/checkout/CreateOrder';
import HeaderOrders from '../_common/header-order';
import QueuePopover from '../_common/queue-popover';
import Link from 'next/link';
import { paths } from '@/routes/paths';
import { Box } from '@mui/material';
import { getCurrentStep } from '@/app/dashboard/tutorial-action';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();
  const {state}:any = useCheckoutContext()
  const {allData, isLoading, summarize, queryResults, handleReadFunc} = NotificationController({isRun:true});
  const { user, socket } = useAuthContext();
  const {cart} = state
  const [myCart, setMyCart] = useState([])
  const { state : ordersCart } = useOrdersContext();

 
  // console.log(allData,"allDataallDataallDataallDataallDataallDataallDataallDataallData")

  useEffect(()=>{
    if (socket?.connected) {
      socket.on('getNotification', async(u: any) => {
        console.log(u?.recepient,'u?.recepient')
        
        if(typeof u?.recepient === 'object'){
          // const r = u?.recepient;
          const r = u?.recepient;
          let foundUser = r.find((item:any)=>{
            if(Number(item) === Number(user?.id)){
              return true;
            }
          })
          if(foundUser){
            await queryResults.refetch()
          }
         
          return true;
        }
        if(Number(u?.recepient[0]) === Number(user?.id)){
          await queryResults.refetch()
        }
        
      })
    }

   return () => {
    socket?.off('getNotification')
   }
  },[socket?.connected])
  

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Link href={paths.dashboard.root}>
        <LogoFull sx={{ mr: 2.5 }} />
      </Link>}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* comment temporarily */}
        
        {user?.role === 'patient' && <QueuePopover/>}
        {/* {user?.role !== 'patient' && <Scanner/>} */}
        {user?.role === 'patient' && cart?.length !== 0 &&  <HeaderCart cart={cart} count={cart?.length}/>}
        {user?.role === 'patient' && ordersCart?.order &&  <HeaderOrders order={ordersCart?.order} />}

        
        <NotificationsPopover queryResults={queryResults} handleReadFunc={handleReadFunc} notificationData={allData} isLoading={queryResults.loading} summarize={summarize}/>

        <SettingsButton />

        <AccountPopover />

      </Stack>
    </>
  );

  const [currentStep, setCurrentStepState] = useState(null);
  
  useEffect(() => {
    if(user){
      getCurrentStep(user?.id).then((res) => {
        setCurrentStepState(res.setup_step)
      })
    }
  }, [user?.esig?.filename])

 

  const PRIMARY_MAIN = theme.palette.primary.main;


  const renderTuts = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
    }}>


      <>
        <Box sx={{
          background: PRIMARY_MAIN,
          opacity: .4,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -10
        }}>

        </Box>


      </>

    </Box>
  )

  let bg = !currentStep && bgBlur({
    color: theme.palette.background.default,
  })

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: currentStep ? 0 : theme.zIndex.appBar + 1,
        ...bg,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >

      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
