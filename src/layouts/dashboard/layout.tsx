// @mui
'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import Main from './main';
import Header from './header';
import FooterNav from './footer-nav';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import Image from '@/components/image';
import { useTheme } from '@mui/material/styles';
import Typewriter from "typewriter-effect";
import { Button, Stack, Typography } from '@mui/material';
import { MotionContainer, varFade } from 'src/components/animate';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { useAuthContext } from '@/auth/hooks';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const router = useRouter();

  const lgUp = useResponsive('up', 'lg');

  const mdUp = useResponsive('up', 'md');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;



  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>

        {!mdUp && <FooterNav />}
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>

        {!mdUp && <FooterNav />}
      </>
    );
  }
  const theme = useTheme();


  const PRIMARY_MAIN = theme.palette.primary.main;

  const myName = 'brian';

  const fourthStep = (
    <m.div>
      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        To get you started with <span>Mediko Connect</span>, we’d like to help you set up your profile. This will ensure you have access to all our features and resources tailored to your needs.
      </Typography>
    </m.div>
  )

  const secondStep = (
    <m.div>
     
      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        Hello, and welcome to Mediko Connect! 🌟 <span>I’m Ruby</span>, your friendly virtual assistant. 🤖 
      </Typography>
    </m.div>
  )

  const thirdStep = (
    <m.div>
      <Typography
        sx={{
          fontSize: 15,
          mb: 2,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
       I’m here to help you navigate our application and make your experience as smooth as possible 😊.
      </Typography>
    </m.div>
  )

  // 

  const firstStep = (
    <m.div>
      <Typography sx={{

        mb: 1
      }} variant={'h5'}>Welcome! 🎉

      </Typography>

      <Typography

        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        Thank you for joining us! We’re thrilled to have you as part of our community.
      </Typography>
    </m.div>
  )

  const [step, setSteps] = useState(1);

  const incrementStep = () => setSteps((prev) => prev + 1)

  let currentStep = Number(localStorage.getItem('currentStep'));



  const firstStepFinal = (
    <m.div>
      <Typography sx={{

        mb: 1
      }} variant={'h5'}>Final🎉

      </Typography>

      <Typography

        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        I’d like to guide you through the various sections of our platform, each designed with unique functionalities to enhance your experience. 🌟✨
      </Typography>
    </m.div>
  )

  const firstSecondStep = (
    <m.div>
      <Typography sx={{

        mb: 1
      }} variant={'h5'}>Home Page 🌟

      </Typography>

      <Typography

        sx={{
          fontSize: 15,
          lineHeight: 1.5,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        The home page is your central hub, showcasing a list of today's appointments awaiting your approval. 🗓️ This streamlined view helps you stay organized and efficiently manage your schedule at a glance. ✔️
      </Typography>
    </m.div>
  )

  const [stepFinal, setStepFinal] = useState(1)

  const onIncrementF = () => setStepFinal(stepFinal + 1);

  const renderFinalTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    }}>

      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
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
            background: theme.palette.background.default,
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
            {stepFinal === 1 && firstStepFinal}
            {stepFinal === 2 && firstSecondStep}

            <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onIncrementF} variant="contained" size={'small'}>Continue</Button>

            </Box>
          </Box>
        </m.div>

        <Image
          sx={{
            width: 350,
            height: 450,
            position: 'relative',
            bottom: -120,
            right: -120,
            zIndex: 1000

          }}
          src={'/assets/tutorial-doctor/nurse-tutor.png'}

        />
      </Box>
    </Box>
  )


  const [isFinal, setFinal] = useState(false);


  useEffect(() => {
    if (step === 5) {
      localStorage.setItem('currentStep', '3')
      router.push(paths.dashboard.user.manage.profile)
    }


  }, [step, currentStep])



  const renderFirstTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}>

      {step !== 5 &&
        <>
          <Box sx={{
            background: PRIMARY_MAIN,
            opacity: .4,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9991
          }}>

          </Box>

          <Box sx={{
            zIndex: 99999,
            position: 'absolute',
            bottom: 0,
            // right:0
          }}>
            {/* message */}
            <m.div variants={varFade().inUp}>
              <Box sx={{
                background: theme.palette.background.default,
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
                {step === 1 && firstStep}
                {step === 2 && secondStep}
                {step === 3 && thirdStep}
                {step === 4 && fourthStep}

                <Box sx={{ width: '90%', pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={incrementStep} variant="contained" size={'small'}>Continue</Button>
                  {/* <Button onClick={decrementStep} variant="contained" size={'small'}>Back</Button> */}
                </Box>
              </Box>
            </m.div>

            <Image
              sx={{
                width: 350,
                height: 450,
                position: 'relative',
                bottom: -100,
                right: -120,

              }}
              src={'/assets/tutorial-doctor/nurse-tutor.png'}

            />
          </Box>
        </>
      }
    </Box>
  )


  return (
    <>
      <Header onOpenNav={nav.onTrue} />
      {/* {isFinal && renderFinalTutorial} */}

      {(user?.new_doctor && (Number(currentStep) < 3 || !currentStep)) && renderFirstTutorial}

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 }
        }}
      >
        {renderNavVertical}

        <Main sx={{

        }}>{children}</Main>
      </Box>

      {!mdUp && <FooterNav />}
    </>
  );
}
