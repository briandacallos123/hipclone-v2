import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// _mock
import { _userProfileLicense } from 'src/_mock';
// types
import { IUserProfileLicense } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from '@/auth/hooks';
import { useMutation } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { LicensesUpdate } from '../../libs/gqls/licenses';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import Image from '@/components/image';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import './styles/licences.css'
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserProfileLicense, 'prcExpiry'> {
  prcExpiry: Date | number | null;
}

export default function AccountLicenses() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');
  // const [user] = useState<IUserProfileLicense>(_userProfileLicense);

  const { user, reInitialize } = useAuthContext();

  const [updateLicenses] = useMutation(LicensesUpdate);
  const currentStep = localStorage?.getItem('currentStep')

  const UpdateUserSchema = Yup.object().shape({
    prcNumber: Yup.string().required('PRC Number is required'),
    // prcExpiry: Yup.date().required('PRC Expiry Date is required'),
    // ptrNumber: Yup.string().required('PTR Number is required'),
    // s2Number: Yup.string().required('S2 Number is required'),
    // since: Yup.string().required('Practicing Since (Year) is required'),
  });

  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['LicensesInput']) => {
      const data: NexusGenInputs['LicensesInput'] = {
        PRC: model.PRC,
        PTR: model.PTR,

        practicing_since: model.practicing_since,
        s2_number: model.s2_number,
        validity: model.validity,
        // suffix: model.suffix,
        // address: model.address,
        // contact: model.contact,
      };
      updateLicenses({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Updated successfully!');
          reInitialize();

          if (currentStep && Number(currentStep) !== 100) {
            localStorage.setItem('currentStep', '5')
          }

        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const defaultValues = {
    prcNumber: user?.PRC ?? '',
    prcExpiry: new Date(user?.validity) || new Date(),
    ptrNumber: user?.PTR ?? '',
    s2Number: user?.s2_number || '',
    since: user?.practicing_since || null,
  };

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;


  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          PRC: values?.prcNumber,
          PTR: values?.ptrNumber,
          s2_number: values?.s2Number,
          validity: values?.prcExpiry,
          practicing_since: values?.since,
        });

        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        //      prcNumber: user?.PRC ?? '',
        // prcExpiry: user?.VALIDITY,
        // ptrNumber: user?.PTR ?? '',
        // s2Number: user?.s2_number || '',
        // since: user?.practicing_since || '',
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingGeneral',
          persist: true,
          style: {
            zIndex: 9999
          }
        });
        setSnackKey(snackbarKey);

        // await handleSubmitValue({
        //   PRC: data?.prcNumber,
        //   PTR: data?.ptrNumber,
        //   s2_number: data?.s2Number,
        //   validity: data?.prcExpiry,
        //   practicing_since: data?.since,
        // });
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;
  const [step, setSteps] = useState(1);

  const language = localStorage?.getItem('languagePref');
    const isEnglish = language && language === 'english';

  const incrementStep = () => setSteps((prev) => prev + 1)

  // useEffect(() => {
  //   if (step === 8) {
  //     if (currentStep && Number(currentStep) !== 100) {
  //       localStorage.setItem('currentStep', '5')
  //       reInitialize();
  //     }
  //   }
  // }, [step])


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
        {language === 'english' ? ' Great! 🎉 Please ensure that all required license fields are filled out completely. ✅' : 'Magaling! 🎉 Pakisigurong kumpleto ang lahat ng kinakailangang field ng lisensya. ✅'}
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
        {language === 'tagalog' ? "Mahalaga ito para sa pagpapanatili ng pagsunod at pagtiyak ng tamang dokumentasyon ng iyong mga kredensyal. 📜✨ Huwag kalimutang i-save ang iyong mga pagbabago! 💾" : 'It is important for maintaining compliance and ensuring proper documentation of your credentials. 📜✨ Do not forget to save your changes! 💾'}
      </Typography>
    </m.div>
  )


  const [hideChoices, setHideChoices] = useState(false);
  const [angGulo, setAngGulo] = useState(false);

  const hideC = () => setHideChoices(true)


  const renderThirdTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 900
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
          // zIndex: -1
        }}>

        </Box>

        {step < 3 && <Box sx={{
          zIndex: 2001,
          position: 'absolute',
          bottom: 0,
          right:upMd ? 100:null
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
              zIndex: 2001,
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

  const [noData, setNoData] = useState(false);

  // validate kung may tinuype na sya per field
  const [hasChanges, setChanges] = useState(false);


  useEffect(() => {
    if (isDirty) {
      setChanges(true)
    }
    if (step === 8) {
      const dVal = JSON.stringify(defaultValues)
      const val = JSON.stringify(values);

      if (dVal === val) {
        setChanges(false)
      }

    }
  }, [isDirty, step, values])


  const validateField = (target: string) => {
    if (getValues(`${target}`)) {
      setNoData(true)
    }
  }

  const clearUnsaved = useCallback(() => {
    switch (step) {
      case 3:
        setValue('prcNumber', '');
        break;
      case 4:
        setValue('prcExpiry', '')
        break;
      case 5:
        setValue('ptrNumber', '')
        break;
      case 6:
        setValue('s2Number', '')
        break;
      case 7:
        setValue('since', '')
        break;
    }
  }, [step])

  const handleContinue2 = useCallback(() => {
    // Resetting isDirty by setting the values to the current values
    reset({}, { keepValues: true });
    // Then increment the step
    incrementStep();
  }, [values, incrementStep])

  // in case na mayt changes tapos gusto nya i skip
  const confirm = useBoolean();

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title={isEnglish ? 'Unsaved Changes':"Mga Hindi Nai-save na Pagbabago"}
      content={isEnglish ? "You have unsaved changes, are you sure you want to skip":'Mayroon kang mga hindi nai-save na pagbabago. Sigurado ka bang nais mong laktawan ito?'}
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

  const renderChoices = (
    <Stack sx={{
      p: 1
    }} direction="row" alignItems='center' gap={2} justifyContent='flex-end'>
      {step !== 3 && <Button onClick={onSkip} variant="outlined">Skip</Button>}
      <Button disabled={(() => {
        if (step === 3 && values.prcNumber === '') {
          return true
        } else if (step === 3 && values.prcNumber !== '') {
          return false
        }
        else {
          return !isDirty
        }

      })()} onClick={handleContinue2} variant="contained">Continue</Button>

    </Stack>
  )



  const componentsRender = (
    <Box>
      <Typography variant={upMd ? 'body2' : 'body2'} sx={{ mb: 3, color: 'text.disabled' }}>
        PRC Number, S2 License, or PTR Number will only appear in your prescriptions.
      </Typography>

      <Box
        rowGap={{ md: 3, xs: 1 }}
        columnGap={{ md: 2, xs: 1 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}

      >
        <div className={(step === 3 && (!hideChoices || angGulo)) ? 'showFields-license' : ''}>
          {noData && <Typography></Typography>}
          <RHFTextField name="prcNumber" label="PRC Number" />
          {step === 3 && renderChoices}
        </div>

        {/* <div onClick={hideC} className={(step === 4 && (!hideChoices || angGulo)) ? 'showFields-license' : ''}> */}

        <div onClick={hideC} className={step === 4 ? 'showFields-license':''}>
          <Controller
            name="prcExpiry"
            className="showFields-license"
            control={control}
            render={({ field, fieldState: { error } }: CustomRenderInterface) => (
              <DatePicker
                label="PRC Expiry Date"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}

                // onClose={() => {
                //   setAngGulo(true)
                // }}
                onOpen={() => {
                  setAngGulo(false)

                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,

                  },
                }}
              />
            )}
          />
          {step === 4 && renderChoices}
        </div>

        <div className={step === 5 ? 'showFields-license' : ''}>
          <RHFTextField name="ptrNumber" label="PTR Number" />
          {step === 5 && renderChoices}
        </div>

        <div className={step === 6 ? 'showFields-license' : ''}>
          <RHFTextField name="s2Number" label="S2 Number" />
          {step === 6 && renderChoices}
        </div>

        <div className={step === 7 ? 'showFields-license' : ''}>
          <RHFTextField name="since" label="Practicing Since (Year)" />
          {step === 7 && renderChoices}
        </div>
        {renderConfirm}



        <Stack spacing={3} alignItems="flex-end" justifyContent="flex-end">
          <div className={step === 8 ? 'showFields-submit-license' : ''}>
            {/* <div className={ 'showFields-submit'}> */}
            <LoadingButton type={!hasChanges ? 'button' : 'submit'} variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </div>

        </Stack>
      </Box>
    </Box>
  )



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>


      {Number(currentStep) === 4 && step !== 9 && renderThirdTutorial}


      {!currentStep ? <Card sx={{ p: 3, position: 'relative' }}>
        <Typography variant={upMd ? 'body2' : 'body2'} sx={{ mb: 3, color: 'text.disabled' }}>
          PRC Number, S2 License, or PTR Number will only appear in your prescriptions.
        </Typography>

        <Box
          rowGap={{ md: 3, xs: 1 }}
          columnGap={{ md: 2, xs: 1 }}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}

        >
          <div className="showFields-license">
            <RHFTextField name="prcNumber" label="PRC Number" />
          </div>

          <div>
            <Controller
              name="prcExpiry"
              control={control}
              render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                <DatePicker
                  label="PRC Expiry Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </div>

          <RHFTextField name="ptrNumber" label="PTR Number" />
          <RHFTextField name="s2Number" label="S2 Number" />
          <RHFTextField name="since" label="Practicing Since (Year)" />

          <div className={`${step === 8 ? 'showFields-license' : ''} `}>
            <Stack spacing={3} alignItems="flex-end" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </div>
        </Box>
      </Card> : componentsRender}
    </FormProvider>
  );
}
