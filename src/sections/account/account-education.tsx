import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _userProfileEducation } from 'src/_mock';
// types
import { IUserProfileEducation } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { EducationMutation } from '../../libs/gqls/education';
import { useAuthContext } from 'src/auth/hooks';
import { GetEducations } from '../../libs/gqls/education';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import { useTheme } from '@mui/material/styles';
import Image from '@/components/image';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import './styles/education.css'
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';
import { getCurrentStep, setCurrentStep } from '@/app/dashboard/tutorial-action';

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfileEducation;

export default function AccountEducation() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user, reInitialize } = useAuthContext();
  const upMd = useResponsive('up', 'md');
  const router = useRouter();
  // const [user] = useState<IUserProfileEducation>(_userProfileEducation);
  const [updateEducation] = useMutation(EducationMutation);
  const { data: queryData, error, loading, refetch }: any = useQuery(GetEducations);
  const [userData, setUserData] = useState({});
  // console.log('QUERY: ', queryData);

  const [currentStep, setCurrentStepState] = useState(null);
  const [step, setSteps] = useState(1);

  const incrementStep = () => setSteps((prev) => prev + 1)
  
  useEffect(() => {
    if (user?.new_doctor) {
      getCurrentStep(user?.id).then((res) => {
        setCurrentStepState(res.setup_step)
      })
    }
  }, [user?.esig?.filename])

  const language = localStorage?.getItem('languagePref');
  const isEnglish = language && language === 'english';

  // useEffect(() => {
  //   if (queryData) {
  //     setUserData(queryData?.GetEducations?.data);
  //   }
  // }, [queryData]);
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['EducationInput']) => {
      const data: NexusGenInputs['EducationInput'] = {
        medicalSchool: model.medicalSchool,
        recidency: model.recidency,
        fellowship1: model.fellowship1,
        fellowship2: model.fellowship2,
      };
      updateEducation({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          if (snackKey) {
            const { data } = res;
            closeSnackbar(snackKey);
            enqueueSnackbar('Updated Successfully');
            refetch();

            if (currentStep) {
              setCurrentStep({
                id: user?.id,
                step: 6
              }).then(() => {
                router.push(paths.dashboard.user.manage.clinic)
              })
            }

          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
         
        });
    },
    [snackKey, user, step]
  );

  // const defaultValues = {
  //   // medicalSchool: user?.medicalSchool ?? { name: '', year: '' },
  //   // recidency: user?.recidency ?? { name: '', year: '' },
  //   // fellowship1: user?.fellowship1 ?? { name: '', year: '' },
  //   // fellowship2: user?.fellowship2 ?? { name: '', year: '' },
  //   medicalSchool: {},
  //   recidency: {},
  //   fellowship1: {},
  //   fellowship2: {},
  // };
  const defaultValues = useMemo(
    () => ({
      medicalSchool: { name: '', year: '' },
      recidency: { name: '', year: '' },
      fellowship1: { name: '', year: '' },
      fellowship2: { name: '', year: '' },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userData]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (queryData) {
      Object.entries(queryData?.GetEducations?.data).forEach((i, index) => {
        const name = i[0];
        const vals = i[1];
        setValue(name, vals);
      });
    }
  }, [queryData]);

  const values = watch();

  // console.log('SNACK KEY: ', snackKey);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue(values);
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );


  // medicalSchool: user?.medicalSchool ?? { name: '', year: '' },
  //   recidency: user?.recidency ?? { name: '', year: '' },
  //   fellowship1: user?.fellowship1 ?? { name: '', year: '' },
  //   fellowship2: user?.fellowship2 ?? { name: '', year: '' },

  const FIELDS = [
    {
      value: 'medicalSchool',
    },
    {
      value: 'recidency',
    },
    {
      value: 'fellowship1',
    },
    {
      value: 'fellowship2',
    },
  ];

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
        {isEnglish ? 'Please ensure that all education-related fields are completed. 🎓' : 'Pakisigurong kumpleto ang lahat ng field na may kaugnayan sa edukasyon. 🎓'}

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


        {isEnglish ? 'Accurately providing your educational background is essential for verifying your qualifications and credentials. 📚🔍' : 'Ang tumpak na pagbibigay ng iyong background sa edukasyon ay mahalaga para sa pagpapatunay ng iyong mga kwalipikasyon at kredensyal. 📚'}
      </Typography>
    </m.div>
  )


  // 

  const renderFourthTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
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
          setCurrentStep({
            id: user?.id,
            step: 6
          }).then(() => {
            router.push(paths.dashboard.user.manage.clinic)
          })
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
        </Box>}
      </>

    </Box>
  )
  const confirm = useBoolean();

  const clearUnsaved = useCallback(() => {
    switch (step) {
      case 3:
        setValue('medicalSchool', { name: '', year: '' });
        break;
      case 4:
        setValue('recidency', { name: '', year: '' })
        break;
      case 5:
        setValue('fellowship1', { name: '', year: '' })
        break;
      case 6:
        setValue('fellowship2', { name: '', year: '' })
        break;
    }
  }, [step])

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title={isEnglish ? 'Unsaved Changes' : "Mga Hindi Nai-save na Pagbabago"}
      content={isEnglish ? "You have unsaved changes, are you sure you want to skip" : 'Mayroon kang mga hindi nai-save na pagbabago. Sigurado ka bang nais mong laktawan ito?'}
      sx={{
        zIndex: 99999
      }}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            incrementStep();
            clearUnsaved()
            confirm.onFalse();
            reset({}, { keepValues: true });
          }}
        >
          Skip
        </Button>
      }
    />
  );


  const onSkip = useCallback(() => {
    if (isDirty) {
      confirm.onTrue()
    } else {
      incrementStep()


    }
  }, [isDirty])

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isDirty) {
      setHasChanges(true)
    }
  }, [isDirty])

  const handleContinue = useCallback(() => {
    // Resetting isDirty by setting the values to the current values
    reset({}, { keepValues: true });
    // Then increment the step
    incrementStep();
  }, [values, incrementStep])

  const renderChoices = (
    <Stack sx={{
      p: 1
    }} direction="row" alignItems='center' gap={2} justifyContent='flex-end'>
      <Button disabled={step === 3} onClick={onSkip} variant="outlined">Skip</Button>
      <Button disabled={!isDirty} onClick={handleContinue} variant="contained">Continue</Button>

    </Stack>
  )




  const renderTutsField = (
    <Stack rowGap={2}>
      {Object.keys(values)?.map((item, index) => (
        <Grid key={item} container spacing={{ md: 3, xs: 1 }}>
          <Grid xs={12} md={4}>
            <ListItemText
              primary={
                (index === 0 && 'Medical School') ||
                (index === 1 && 'Recidency') ||
                'Fellowship Training'
              }
              secondary={
                (index === 0 && 'Input your medical graduate education') ||
                (index === 1 && 'Input your recidency/postgraduate training') ||
                'Input your medical fellowship training'
              }
              primaryTypographyProps={{ typography: { md: 'h6', xs: 'body1' }, mb: 0.5 }}
              secondaryTypographyProps={{ component: 'span' }}
            />
          </Grid>
          <div className={(() => {
            if (index === 0 && step === 3) {
              return 'showFields-education'
            } else if (index === 1 && step === 4) {
              return 'showFields-education'
            } else if (index === 2 && step === 5) {
              return 'showFields-education'
            } else if (index === 3 && step === 6) {
              return 'showFields-education'
            }
            else {
              return 'default'
            }
          })()}>
            <Grid xs={12} md={8}>

              <Box
                rowGap={{ md: 3, xs: 0 }}
                columnGap={{ md: 2, xs: 1 }}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: '3fr 1fr',
                }}
                sx={{ p: { md: 3, xs: 1 }, borderRadius: 2, bgcolor: 'background.neutral' }}
              >
                <RHFTextField name={`${item}.name`} label="Name of Institution" />
                <RHFTextField name={`${item}.year`} label="Year Completed" />
              </Box>

              {(() => {
                if (index === 0 && step === 3) {
                  return renderChoices
                } else if (index === 1 && step === 4) {
                  return renderChoices
                } else if (index === 2 && step === 5) {
                  return renderChoices
                } else if (index === 3 && step === 6) {
                  return renderChoices

                }
              })()}

              {renderConfirm}
            </Grid>
          </div>

        </Grid>


      ))}
      <Stack spacing={3} alignItems="flex-end" justifyContent="flex-end">
        <div className={step === 7 ? 'showFields-submit-profile-education' : ''}>
          <LoadingButton type={!hasChanges ? 'button' : 'submit'} variant="contained" loading={isSubmitting}>

            Save Changes
          </LoadingButton>
        </div>

      </Stack>
    </Stack>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {Number(currentStep) === 5 && step !== 8 && renderFourthTutorial}



      {!currentStep && <Stack component={Card} spacing={{ md: 3, xs: 1 }} sx={{ p: 3 }}>
        {Object.keys(values)?.map((item, index) => (
          <Grid key={item} container spacing={{ md: 3, xs: 1 }}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary={
                  (index === 0 && 'Medical School') ||
                  (index === 1 && 'Recidency') ||
                  'Fellowship Training'
                }
                secondary={
                  (index === 0 && 'Input your medical graduate education') ||
                  (index === 1 && 'Input your recidency/postgraduate training') ||
                  'Input your medical fellowship training'
                }
                primaryTypographyProps={{ typography: { md: 'h6', xs: 'body1' }, mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Box
                rowGap={{ md: 3, xs: 0 }}
                columnGap={{ md: 2, xs: 1 }}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: '3fr 1fr',
                }}
                sx={{ p: { md: 3, xs: 1 }, borderRadius: 2, bgcolor: 'background.neutral' }}
              >
                <RHFTextField name={`${item}.name`} label="Name of Institution" />
                <RHFTextField name={`${item}.year`} label="Year Completed" />
              </Box>
            </Grid>
          </Grid>
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>}
      {currentStep && renderTutsField}
    </FormProvider>
  );
}
