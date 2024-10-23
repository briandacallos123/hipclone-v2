'use client';

// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { useTheme } from '@mui/material/styles';
//
import { useResponsive } from 'src/hooks/use-responsive';

import ServiceProfessionalFee from '../service/service-professional-fee';
import ServiceAdditionalFee from '../service/service-additional-fee';
import ServicePaymentSchedule from '../service/service-payment-schedule';
import ServiceHmo from '../service/service-hmo';
import ServicePaymentMethodList from '../service/service-payment-method-list';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { paths } from '@/routes/paths';
import { useRouter } from 'next/navigation';
import './circular-highlight.css'; // Import your CSS file
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import Image from '@/components/image';
import { useAuthContext } from '@/auth/hooks';
import { getCurrentStep } from '@/app/dashboard/tutorial-action';
// ----------------------------------------------------------------------

export default function UserServiceView() {
  const settings = useSettingsContext();

  const [tutorialTab, setTutsTab] = useState<number | null>(null);
  const targetRef = useRef(null)
  const { user } = useAuthContext();



  // let currentStep = localStorage?.getItem('currentStep')

  const [currentStep, setCurrentStepState] = useState(null);

  useEffect(() => {
    if (user?.new_doctor) {
      getCurrentStep(user?.id).then((res) => {
        const {setup_step:tuts} = res;
        setCurrentStepState(res.setup_step)
        if (tuts && tuts >= 7 && tuts <= 11) {
          setTutsTab(tuts)
        } else {
          setTutsTab(null)
        }
      })
    }
  }, [])

  const incrementTutsTab = useCallback(() => {
    setTutsTab((prev: any) => prev + 1);
    if (tutorialTab) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });

    }
  }, [tutorialTab])

  const upMd = useResponsive('up', 'md');


  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;
  const [step, setSteps] = useState(1);

  const incrementStep = () => setSteps((prev) => prev + 1)

  const language = localStorage?.getItem('languagePref');
  const isEnglish = language && language === 'english';

  const firstStep = (
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
        {isEnglish ? 'Please ensure you fill in all required services fields. 🏥✅' : 'Pakisigurong punan ang lahat ng kinakailangang field para sa mga serbisyo. 🏥✅'}

      </Typography>
    </m.div>
  )
  const renderFifthTutorial = (
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
          right: upMd ? 100 : 30
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



              <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end' }}>
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

  const dummyRef = useRef(null)


  return (
    <Container sx={{
      position: 'relative'
    }} maxWidth={settings.themeStretch ? false : 'lg'}>

      {Number(currentStep) === 7 && step !== 2 && renderFifthTutorial}

      {tutorialTab && renderTuts}
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Manage Service
      </Typography>
      <Stack spacing={3}>
        <ServiceProfessionalFee step={step} incrementTutsTab={incrementTutsTab} tutorialTab={tutorialTab} />

        <ServiceAdditionalFee ref={tutorialTab === 7 ? targetRef : dummyRef} incrementTutsTab={incrementTutsTab} tutorialTab={tutorialTab} />

        <ServicePaymentSchedule ref={tutorialTab === 8 ? targetRef : dummyRef} incrementTutsTab={incrementTutsTab} tutorialTab={tutorialTab} />

        <ServiceHmo ref={tutorialTab === 9 ? targetRef : dummyRef} incrementTutsTab={incrementTutsTab} tutorialTab={tutorialTab} />

        <ServicePaymentMethodList ref={tutorialTab === 10 ? targetRef : dummyRef} incrementTutsTab={incrementTutsTab} tutorialTab={tutorialTab} />
      </Stack>
    </Container>
  );
}
