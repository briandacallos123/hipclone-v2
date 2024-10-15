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
import { Box, Button } from '@mui/material';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import Image from '@/components/image';
import { useEffect, useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useTutorialProvider } from '@/context/tut-step';

// ----------------------------------------------------------------------

export default function UserLoginView() {
  const settings = useSettingsContext();
  const [step, setSteps] = useState(1);
  const incrementStep = () => setSteps((prev) => prev + 1)

  const {setCurrentStep:setStep}:any = useTutorialProvider();

  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    setCurrentStep(localStorage?.getItem('currentStep'))
  }, [localStorage?.getItem('currentStep')])
  // const currentStep = 
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const firstStep = (
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
        <span>Keep Your Account Secure! 🔒</span><br /><br />
        As a valued doctor, maintaining the security of your account is essential
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
        <span>Keep Your Account Secure! 🔒</span><br /><br />
        You can easily change your password to ensure your personal and patient information remains safe.
      </Typography>
    </m.div>
  )

  const renderTwelveTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
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
          zIndex: 9991
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
              {step === 1 && firstStep}
              {step === 2 && secondStep}


              <Box sx={{ width: '90%', pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={incrementStep} variant="contained" size={'small'}>Continue</Button>
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
        You’ve successfully completed the setup of your profile and necessary data. You're now ready to start using the system effectively!
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
        I know you’re excited, and I'm here to help you explore other sections of our system that will assist you in your practice:
      </Typography>
    </m.div>
  )
  const successMessage3 = (
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
        By the way, all the information you fill out can be accessed through the icon up there 🛠️. You can go back 🔙 if you need to make any changes.
      </Typography>
    </m.div>
  )

  const [successProfile, setSuccProfile] = useState(1);


  useEffect(() => {

    if (successProfile === 4) {
      localStorage.setItem('currentStep', '15');
      setStep('15')
      setCurrentStep('15')
    }
  }, [successProfile])

  const onIncrementSucc = () => setSuccProfile(successProfile + 1)

  const renderDoneProfile = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
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
          zIndex: 9991
        }}>

        </Box>

        {Number(currentStep) === 14 && <Box sx={{
          zIndex: 99999,
          position: 'absolute',
          bottom: 0,
        }}>
          {/* message */}
          <m.div variants={varFade().inUp}>
            <Box sx={{
              background: theme.palette.background.default,
              height: 230,
              width: 250,
              left: 10,
              borderRadius: 5,
              zIndex: 99999,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              pt: 3,
              px: 2
            }}>
              {successProfile === 1 && successMessage1}
              {successProfile === 2 && successMessage2}
              {successProfile === 3 && successMessage3}


              {successProfile !== 4 && <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onIncrementSucc} variant="contained" size={'small'}>Continue</Button>
              </Box>}
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
        </Box>}
      </>

    </Box>
  )


  const handleRecheck = () => {
    setCurrentStep(localStorage.getItem('currentStep'))

  }


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {(Number(currentStep) === 14 ) && successProfile !== 5 && renderDoneProfile}

      {Number(currentStep) === 13 && step !== 3 && renderTwelveTutorial}

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

        <LoginPassword recheck={handleRecheck} />

        {/* <LoginContact /> */}
      </Stack>
    </Container>
  );
}
