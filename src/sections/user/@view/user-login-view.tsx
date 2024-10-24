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
import { useResponsive } from '@/hooks/use-responsive';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { useAuthContext } from '@/auth/hooks';
import { getCurrentStep, getTutsLanguage, setCurrentStep } from '@/app/dashboard/tutorial-action';

// ----------------------------------------------------------------------

export default function UserLoginView() {
  const settings = useSettingsContext();
  const [step, setSteps] = useState(1);
  const incrementStep = () => setSteps((prev) => prev + 1)
  const { setDoneTuts }: any = useTutorialProvider();
  const upMd = useResponsive('up', 'md');

  // const [currentStep, setCurrentStep] = useState(null);

  // const language = localStorage?.getItem('languagePref');
  // const isEnglish = language && language === 'english';
  const { user } = useAuthContext();

  const [isEnglish, setLanguage] = useState(null);
  const [currentStep, setCurrentStepState] = useState(null);

  console.log(currentStep,'current buddyyyyyyyy')


  useEffect(() => {
    if (user?.new_doctor) {
      getCurrentStep(user?.id).then((res) => {
        setCurrentStepState(res.setup_step)

      })
      getTutsLanguage({
        id:user?.id
      }).then((res)=>{
        const {language} = res;
        setLanguage(language)
      })
    }
  }, [user])




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
        <span>{isEnglish ? "Keep Your Account Secure!" : "Panatilihing Ligtas ang Iyong Account!"} 🔒</span><br /><br />
        {isEnglish ? "As a valued doctor, maintaining the security of your account is essential" : "Bilang isang mahalagang doktor, mahalaga ang pagpapanatili ng seguridad ng iyong account."}
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
        <span>{isEnglish ? "Keep Your Account Secure!" : "Panatilihing Ligtas ang Iyong Account!"} 🔒</span><br /><br />

        {isEnglish ? "You can easily change your password to ensure your personal and patient information remains safe." : "Maaari mong madaling baguhin ang iyong password upang matiyak na mananatiling ligtas ang iyong personal at impormasyon ng pasyente."}
      </Typography>
    </m.div>
  )

  const [manualDone, setManualDone] = useState(false);

  const renderTwelveTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}>

      {step >= 3 && <Box sx={{
        background: 'white',
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 9999,
        padding: 1
      }}>
        <Button onClick={() => {
          if (currentStep) {
            setCurrentStep({
              id:user?.id,
              step:14
            }).then((res)=>{
              setManualDone(true)

              getCurrentStep(user?.id).then((res) => {
                setCurrentStepState(res.setup_step)
              })

            })
            // router.push(paths.dashboard.user.manage.login)
          }
        }} variant="outlined">
          Skip this part...
        </Button>
      </Box>}

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

        {step < 3 && <Box sx={{
          zIndex: 99999,
          position: 'absolute',
          bottom: 0,
          right: upMd ? 100 : null
        }}>
          {/* message */}
          <m.div variants={varFade().inUp}>
            <Box sx={{
              background: theme.palette.background.default,
              height: 'auto',
              width: 'auto',
              maxWidth: 250,
              left: upMd ? 0 : 10,
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
        </Box>}
      </>

    </Box>
  )


  const successMessage1 = (
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
        <span>{isEnglish ? 'Congratulations, Doctor!' : 'Maligayang bati, Doktor'} 🎉</span><br /><br />

        {isEnglish ? ' You’ve successfully completed the setup of your profile and necessary data. You\'re now ready to start using the system effectively!' : 'Matagumpay mong nakumpleto ang pag-set up ng iyong profile at kinakailangang datos. Handa ka nang simulan ang epektibong paggamit ng sistema!'}
      </Typography>
    </m.div>
  )


  const successMessage2 = (
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
        <span>{isEnglish ? 'Congratulations, Doctor!' : 'Maligayang bati, Doktor'} 🎉</span><br /><br />
        {isEnglish ? 'I know you’re excited, and I\'m here to help you explore other sections of our system that will assist you in your practice' : 'Alam kong sabik ka, at nandito ako upang tulungan kang tuklasin ang iba pang mga bahagi ng aming sistema na makakatulong sa iyong praktis'}
      </Typography>
    </m.div>
  )
  const successMessage3 = (
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
        <span>{isEnglish ? 'Congratulations, Doctor!' : 'Maligayang bati, Doktor'} 🎉</span><br /><br />

        {!upMd && (isEnglish ? "By the way, all the information you fill out can be accessed through the icon up there 🛠️. You can go back 🔙 if you need to make any changes." : 'Sa pamamagitan ng lahat ng impormasyon na iyong pupunan ay maa-access sa icon na iyon sa itaas 🛠️. Maaari kang bumalik 🔙 kung kailangan mong gumawa ng anumang pagbabago')}

        {upMd && (isEnglish ? "All your changes can be found here. 📋 If you need to make any adjustments, you can do so here. ✏️" : ' lahat ng iyong binago ay dito mo pwedeng matagpuan. 📋 Kung sakaling may kailangan kang baguhin, maaari kang magtungo rito. ✏️')}
      </Typography>
    </m.div>
  )

  const [successProfile, setSuccProfile] = useState(1);


  useEffect(() => {

    if (successProfile === 4) {
      setCurrentStep({
        id:user?.id,
        step:15
      }).then(()=>{
        setDoneTuts()
      })
    }
  }, [successProfile,])

  const onIncrementSucc = () => setSuccProfile(successProfile + 1)
  const router = useRouter();


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
          right: upMd ? 100 : null
        }}>
          {/* message */}
          <m.div variants={varFade().inUp}>
            <Box sx={{
              background: theme.palette.background.default,
              height: 'auto',
              width: 'auto',
              maxWidth: 250,
              left: upMd ? 0 : 10,
              borderRadius: 5,
              zIndex: 99999,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              p: 3
            }}>
              {successProfile === 1 && successMessage1}
              {successProfile === 2 && successMessage2}
              {successProfile === 3 && successMessage3}


              {successProfile !== 4 && <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
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
      {(Number(currentStep) === 14) && successProfile !== 4 && renderDoneProfile}

      {Number(currentStep) === 13 && step !== 5 && renderTwelveTutorial}

      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Manage Login
      </Typography>

      <Stack spacing={3}>
        <LoginUsername />

        <LoginPassword manualDone={manualDone} tutsStart={step == 3} recheck={handleRecheck} />

        {/* <LoginContact /> */}
      </Stack>
    </Container>
  );
}
