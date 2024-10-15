'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { LogoFull } from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hook';
import { NavSectionVertical } from 'src/components/nav-section';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton, NavFooter } from '../_common';
import Link from 'next/link';
import { paths } from '@/routes/paths';
import { Button, Typography } from '@mui/material';
import Iconify from '@/components/iconify';
import { useTheme } from '@mui/material/styles';
import './nav.css'
import { useTutorialProvider } from '@/context/tut-step';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import { useRouter } from 'next/navigation';
import Image from '@/components/image';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useAuthContext();
  const { currentStep: cStep, setCurrentStep }: any = useTutorialProvider();

  const router = useRouter();


  useEffect(() => {
    setCurrentStep(localStorage.getItem('currentStep'))
  }, [localStorage.getItem('currentStep')])


  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();
  // console.log('userVer', user);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >


      {!lgUp && <Link href={paths.dashboard.root}>
        <LogoFull sx={{ mt: 3, ml: 4, mb: 1 }} />
      </Link>
      }
      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || 'doctor',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavFooter /> */}
    </Scrollbar>
  );

  const [openNavIn, setOpenNav] = useState(false);
  const theme = useTheme();

  const handleOpenNav = () => setOpenNav(true)

  const PRIMARY_MAIN = theme.palette.primary.main;

  const customToggle = (
    <Box sx={{
      position: 'fixed',
      right: 0,
      top: 75,
      background: PRIMARY_MAIN,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 1,
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
      pl: 1.5

    }}>
      <Iconify width={17} onClick={handleOpenNav} sx={{
        color: 'white',
      }} icon="fontisto:nav-icon-grid-a" />
    </Box>
  )

  const [successProfile, setSuccProfile] = useState(1);


      useEffect(()=>{
        if(successProfile === 3){
          router.push(paths.dashboard.root)
          localStorage.setItem('currentStep', '100');

        }
      },[successProfile])

  const onIncrementSucc = () => setSuccProfile(successProfile + 1)



  const renderDoneProfile = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: openNavIn ? `calc(100vw - ${NAV.W_VERTICAL}px)` : '100vw',
      bottom: 0,
      zIndex: 50000
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
          zIndex: 99999
        }}>

        </Box>

        <Box sx={{
          zIndex: 99999,
          position: 'absolute',
          bottom: 0,
        }}>
          {/* message */}
          <m.div variants={varFade().inUp}>
            <Box sx={{
              // background: theme.palette.background.default,
              height: 'auto',
              width: 'auto',
              maxWidth: 250,
              left: 10,
              borderRadius: 2,
              zIndex: 99999,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              p: 3
            }}>



              <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onIncrementSucc} variant="contained" size={'small'}>Continue</Button>
              </Box>
            </Box>
          </m.div>

          {/*  */}
        </Box>
      </>

    </Box>
  )

  const successMessage1 = (
    <m.div>

      <Typography

        sx={{
          fontSize: 15,
          mb: 2,
          mt: 1,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        <span>Congratulations, Doctor! 🎉</span><br /><br />
        You've set up your profile and data. Here are the modified sections—feel free to make any changes later on!
      </Typography>
    </m.div>
  )

  const successMessage2 = (
    <m.div>

      <Typography

        sx={{
          fontSize: 15,
          mb: 2,
          mt: 1,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        <span>Congratulations, Doctor! 🎉</span><br /><br />
        🔄 I will now redirect you to your home page. 🏠
      </Typography>
    </m.div>
  )



  const renderBot = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 0,
      bottom: 0,
      zIndex: 50000,


    }}>
      <Box sx={{
        position: 'absolute',
        background: theme.palette.background.default,
        bottom: 200,
        height: 'auto',
        width: 250,
        borderRadius: 5,
        left: 10,
        zIndex: 99999,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        p: 2
      }}>
        {successProfile === 1 && successMessage1}
        {successProfile === 2 && successMessage2}

        <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onIncrementSucc} variant="contained" size={'small'}>Continue</Button>
        </Box>

      </Box>

      <Image
        sx={{
          width: 350,
          height: 450,
          position: 'absolute',
          bottom: -100,
          left: 120,

        }}
        src={'/assets/tutorial-doctor/nurse-tutor.png'}

      />
    </Box>
  )


  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
        zIndex: 10,

      }}
    >
      {Number(cStep) === 15 && renderDoneProfile}

      {Number(cStep) === 15 && openNavIn && successProfile !== 3 && renderBot}

      <NavToggleButton />
      <Box sx={{
        position: 'relative',
        width: 50,
        float: 'right',
      }}>
        <div className={Number(cStep) === 15 && !openNavIn ? 'nav-toggle' : ''}>
          {!lgUp && customToggle}
        </div>
      </Box>

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (

        <Drawer

          open={openNav || openNavIn}
          anchor='right'
          onClose={() => {
            onCloseNav()
            setOpenNav(false)
          }}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              overflow: 'hidden',
              zIndex: 0,

            },
          }}
        >
          {renderContent}



        </Drawer>
      )
      }
    </Box >
  );
}
