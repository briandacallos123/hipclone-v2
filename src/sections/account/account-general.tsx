'use client';

import * as Yup from 'yup';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import isEqual from 'lodash/isEqual';
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// _mock
import { _userProfile } from 'src/_mock';
// utils
import { fData } from 'src/utils/format-number';
// types
import { IUserProfile } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFUpload,
  RHFSelect,
} from 'src/components/hook-form';
import { gql, useMutation } from '@apollo/client';
import { useAuthContext } from '@/auth/hooks';
import { GeneralTabMutation, MutationESign } from '../../libs/gqls/subprofilegeneral';
import { NexusGenInputs } from 'generated/nexus-typegen';
import SignatureCanvas from 'react-signature-canvas';
import { Button, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import AccountGeneralSig from './account-general-dialog';
import Iconify from '@/components/iconify';
import Image from '@/components/image';
import { useTheme } from '@mui/material/styles';
import { useUnsavedChanges } from '@/context/changes-watcher';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';

import './generalStyle.css'
import { getCurrentStep, getTutsLanguage, setCurrentStep } from '@/app/dashboard/tutorial-action';
// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserProfile, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

export default function AccountGeneral({ handleChangeTabTuts }: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');
  const { user, reInitialize } = useAuthContext();
  const mySig = useRef();
  // const [user] = useState<IUserProfile>(_userProfile);
  const router = useRouter();
  // const useNotSec = user?.role !== 'secretary' && {
  //   address: Yup.string().required('Address is required'),
  // };

  const targetRef = useRef();

  // Inside your component
  const { isDirty, setIsDirty }: any = useUnsavedChanges();


  const UpdateUserSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    mname: Yup.string(),
    lname: Yup.string().required('Last Name is required'),
    suffix: Yup.string(),
    gender: Yup.string().oneOf(['1', '2'], 'Invalid Gender').required('Gender is required'),
    birthDate: Yup.date(),
    nationality: Yup.string(),
    // ...useNotSec,
    contact: Yup.string().required('Contact is required'),
    avatarUrl: Yup.mixed().notRequired(),
  });

  const defaultValues = useMemo(
    () => ({
      fname: user?.firstName || '',
      mname: user?.middleName || '',
      lname: user?.lastName || '',
      email: user?.email || '',
      contact: user?.contact || '',
      suffix: user?.suffix || '',
      gender: user?.sex,
      defaultESig: null,
      birthDate: new Date(user?.birthDate) || new Date(),
      nationality: user?.nationality || '',
      address: user?.address || '',
      avatarUrl: user?.photoURL || null,
      title: user?.title || null,
      prcNumber: user?.PRC ?? '',
      prcExpiry: new Date(user?.validity),
      ptrNumber: user?.PTR ?? '',
      s2Number: user?.s2_number || '',
      since: user?.practicing_since || '',
      signatureUrl:
        (() => {
          const url = user?.esig?.filename;
          const parts = url?.split('public');
          const publicPart = parts ? parts[1] : null;

          console.log(publicPart, '@@@@@@@');

          return publicPart;
        })() || null,
    }),
    [user]
  );
  console.log(user, '##');
  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Warn on page unload



  const [uploadData] = useMutation(GeneralTabMutation, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [uploadDataSign] = useMutation(MutationESign, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [snackKey, setSnackKey]: any = useState(null);
  const [snackKey2, setSnackKey2]: any = useState(null);

  const [currentStep, setCurrentStepState] = useState(null);

  const [languagePrefer, setLanguageOptions] = useState(null)

  const [step, setSteps] = useState(null);

  const newDoctor = user?.new_doctor;

  const hasEsig = user?.esig?.filename;

  useEffect(() => {
    if(user?.new_doctor){
      getCurrentStep(user?.id).then((res) => {
        setCurrentStepState(res.setup_step)
        setSteps(1)
      })
  
      getTutsLanguage({
          id:user?.id
      }).then((res)=>{
        setLanguageOptions(res?.language)
      })
  
  
      if (user?.esig?.filename) {
        setSteps(3)
  
      }
    }
  }, [user?.esig?.filename, user?.id])

  const esigCalled = localStorage?.getItem('esigCalled')


  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: any = {
        // email: model.email,
        fname: model.fname,
        mname: model.mname,
        gender: model.gender,
        nationality: model.nationality,
        lname: model.lname,
        suffix: model.suffix,
        address: model.address,
        contact: model.contact,
        birthDate: model.birthDate
      };
      uploadData({
        variables: {
          data,
          file: model?.avatarUrl,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Updated successfully!');
     
          if (currentStep) {
            await setCurrentStep({
              id:user.id,
              step:4
            })
          }
          reInitialize();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  // for sig
  const handleSubmitValueSig = useCallback(
    async (model: NexusGenInputs['EsignInputTypeWFile']) => {
      const data: NexusGenInputs['EsignInputTypeWFile'] = {
        // email: model.email,
        type: model.type,
      };

      uploadDataSign({
        variables: {
          data,
          file: model?.signatureUrl,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey2);
          setSnackKey2(null);
          enqueueSnackbar('Updated successfully!');
          reInitialize();
          setIsDirty(false);
        })
        .catch((error) => {
          closeSnackbar(snackKey2);
          setSnackKey2(null);
          enqueueSnackbar('Something went wrong', { variant: 'error' });

          // runCatch();
        });
    },
    [snackKey2]
  );

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...values, gender: values.gender.toString() });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingGeneral',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

  const awit = (b, o) => {
    console.log(b, o);
  };





  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
      if (step && newDoctor) {
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
        setSteps(5)
      }
    },
    [setValue]
  );

  const openPay = useBoolean();



  useEffect(() => {
    if (snackKey2) {
      (async () => {
        await handleSubmitValueSig({
          ...values,
          type: Number(values?.defaultESig),
        });
      })();
    }
  }, [snackKey2]);

  const handleSaveSig = () => {
    try {
      alert('huh');
      const snackbarKey: any = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'savingGeneral',
        persist: true, // Do not auto-hide
      });
      setSnackKey2(snackbarKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropSig = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('signatureUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('signatureUrl', null);
  }, [setValue]);

  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (user) {
      const url = user?.esig?.filename;
      const parts = url?.split('public');
      const publicPart = parts ? parts[1] : null;

      setValue('signatureUrl', publicPart);
    }
  }, [user]);

  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const incrementStep = useCallback(() => {
    // if (user?.esig?.filename && step == 2) {
    //   setSteps(5)
    // } else {
    //   setSteps((prev) => prev + 1)

    // }

    setSteps((prev) => prev + 1)

  }, [user, step])

  const openSig = () => {
    openPay.onTrue();
    if (currentStep) {
      incrementStep()
    }
  };

  

  const firstStep = (
    <m.div>
      <Typography sx={{
        mb: 1
      }} variant={'h5'}>Welcome! 🎉</Typography>

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
        {languagePrefer === 'english' ? "Before you start using the system, we need to set up your medical profile, including images and other important information." : "Bago mo simulan ang paggamit ng sistema, kailangan nating i-set up ang iyong medical profile, kasama na ang mga larawan at iba pang mahalagang impormasyon."}
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


        {languagePrefer === 'english' ? 'After updating all your needs, don’t forget to save the changes! 💾✍️' : 'Matapos i-update ang lahat ng iyong pangangailangan, huwag kalimutang i-save ang mga pagbabago! 💾✍️'}
      </Typography>
    </m.div>
  )

  const renderSecondTutorial = (
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

        {step < 3 && !esigCalled && <Box sx={{
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
        </Box>}
      </>

    </Box>
  )


  return (
    <Box>
      {Number(currentStep) === 3 && step < 4 && renderSecondTutorial}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4} spacing={3}>
            {!(step && step === 3 && hasEsig) ? <Card sx={{ py: { md: 10, xs: 1 }, px: { md: 3, xs: 1 }, mb: 3, textAlign: 'center' }}>

              {/* {!(step && step === 1 && !(user?.esig?.filename && Number(step) === 3)) ? <Card sx={{ py: { md: 10, xs: 1 }, px: { md: 3, xs: 1 }, mb: 3, textAlign: 'center' }}> */}
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Card> :
              <div className="showFields-profile">
                <Box sx={{ py: { md: 10, xs: 1 }, px: { md: 3, xs: 1 }, mb: 3, textAlign: 'center' }}>
                  <RHFUploadAvatar
                    name="avatarUrl"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 3,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.disabled',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </div>
            }

            {user?.role === 'doctor' && (
              <div className={(step === 3 && !hasEsig) ? 'showFields-profile' : ''}>
                <Box sx={{ py: { md: 2, xs: 1 }, px: { md: 3, xs: 1 }, textAlign: 'center' }}>
                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    <Stack justifyContent='flex-end' alignItems='flex-end'>
                      <div className={(step === 3 && !hasEsig) ? 'showFields-submit-edit-profile' : ''}>
                        <Button
                          onClick={openSig}
                          variant="contained"
                          color="primary"
                          sx={{
                            position: 'absolute',
                            right: 10,
                            top: 5,
                            fontSize: '11px',
                            width: '30px',
                            height: '25px',
                          }}
                          startIcon={
                            <Iconify icon="tabler:edit" sx={{ width: '15px', height: '15px' }} />
                          }
                        >
                          {user?.esig?.filename ? 'Edit' : 'Create'}


                        </Button>
                      </div>
                    </Stack>
                    <Stack direction="column">
                      <span
                        style={{
                          marginBottom: '8px',
                          position: 'absolute',
                          top: 0,
                          paddingBottom: '88px',
                        }}
                      >
                        E-Signature Preview
                      </span>
                      <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user?.esig?.filename ? (
                          <Image
                            src={user?.esig?.filename}
                            sx={{
                              width: 200,
                              height: 180,

                            }}
                            alt="best"
                          />

                        ) :
                          <Box>
                            <Image
                              src={'/assets/icons/empty/ic_content.svg'}
                              sx={{
                                width: 150,
                                height: 150
                              }}
                            />
                            <Typography variant="h6" color="gray">No signature created.</Typography>

                          </Box>
                        }
                      </Box>

                      {user?.esig?.filename && <Stack sx={{
                        width: '100%',
                        textAlign: 'center'

                      }} direction="column" alignSelf="flex-end">
                        <Typography variant="subtitle2">
                          {user?.middleName
                            ? `${user?.firstName} ${user?.middleName} ${user?.lastName}, ${user?.title}`
                            : `${user?.firstName} ${user?.lastName},  ${user?.title}`}
                        </Typography>

                        {getValues('prcNumber') && (
                          <Typography sx={{ fontSize: 11 }}>
                            License No: {getValues('prcNumber')}
                          </Typography>
                        )}

                        {getValues('ptrNumber') && (
                          <Typography sx={{ fontSize: 11 }}>
                            PTR No: {getValues('ptrNumber')}
                          </Typography>
                        )}
                        {getValues('s2Number') && (
                          <Typography sx={{ fontSize: 11 }}>
                            S2 No: {getValues('s2Number')}
                          </Typography>
                        )}
                      </Stack>}

                    </Stack>
                  </Stack>
                </Box>
              </div>
            )}
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={{ md: 3, xs: 1 }}
                columnGap={{ md: 2, xs: 1 }}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="fname" label="First Name" />
                <RHFTextField name="mname" label="Middle Name" />
                <RHFTextField name="lname" label="Last Name" />

                <RHFTextField
                  name="suffix"
                  label="Name Suffix"
                  helperText="e.g.: I, II, Jr., Sr., etc."
                />

                <RHFSelect name="gender" label="Gender">
                  <MenuItem value="1">Male</MenuItem>
                  <MenuItem value="2">Female</MenuItem>

                </RHFSelect>

                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <DatePicker
                      label="Date of Birth"
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

                {user?.role !== 'secretary' && (
                  <RHFTextField name="nationality" label="Nationality" />
                )}
                {user?.role !== 'secretary' && <RHFTextField name="address" label="Address" />}
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="email"
                  label="Email Address"
                />
                <RHFTextField name="contact" label="Phone Number" />
              </Box>


            </Card>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <div className={step === 5 ? 'showFields-submit-profile' : ''}>
                <LoadingButton ref={targetRef} type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </div>
            </Stack>

          </Grid>
        </Grid>
      </FormProvider>

      <AccountGeneralSig
        reset={() => setRefetch(true)}
        isOpen={openPay.value}
        onClose={() => openPay.onFalse()}
        step={step > 3 ? step : null}
        onIncrementStep={incrementStep}
        decrementStep={() => {
          setSteps((prev) => prev - 1)
        }}
        setStep={(stepVal) => {
          setSteps(stepVal)
        }}
      // setImageResult={(res: any) => {
      //   setImgName(res?.MutationESign?.message);
      // }}
      // setImage={(res) => {
      //   const currentImg = defaultValues?.signatureUrl.split('/')[2];

      //   if (imgName !== currentImg) {
      //     setValue('signatureUrl', res);
      //   }

      // }}
      />
    </Box>
  );
}
