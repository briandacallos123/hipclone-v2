'use client';

import * as Yup from 'yup';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
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
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useAuthContext } from '@/auth/hooks';
// import { GeneralTabMutation, MutationESign } from '../../libs/gqls/subprofilegeneral';
import { NexusGenInputs } from 'generated/nexus-typegen';
// import SignatureCanvas from 'react-signature-canvas';
import { Button, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import AccountGeneralSig from '@/sections/account/account-general-dialog';
import Iconify from '@/components/iconify';
import { QueryUserProfile } from '@/libs/gqls/users';
import { useParams } from 'next/navigation';
import AppointmentNewScheduleCard from '@/sections/appointment/appointment-new-schedule-card';
// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserProfile, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

export default function ProfileView({ dataVal }: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');
  const { id } = useParams()
  const mySig = useRef();
  const [data, setData]: any = useState({});
  // const [user] = useState<IUserProfile>(_userProfile);


  //   const [getDoctorProfile, profileResult] = useLazyQuery(QueryUserProfile, {
  //     context: {
  //        requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
  //        },
  //        notifyOnNetworkStatusChange: true,
  //    });

  //    useEffect(()=>{
  //     getDoctorProfile({
  //         variables:{
  //             data:{
  //                 id:Number(id)
  //             }
  //         }
  //     }).then((res)=>{
  //         const {data} = res;
  //         setData(data?.QueryUserProfile);
  //     })
  //    },[])

  const UpdateUserSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    mname: Yup.string(),
    lname: Yup.string().required('Last Name is required'),
    suffix: Yup.string(),
    gender: Yup.string().oneOf(['1', '2'], 'Invalid Gender').required('Gender is required'),
    birthDate: Yup.date().required('Date of Birth is required'),
    nationality: Yup.string(),
    // ...useNotSec,
    contact: Yup.string().required('Contact is required'),
    avatarUrl: Yup.mixed().notRequired(),
  });


  const defaultValues = useMemo(
    () => ({
      fname: data?.firstName || '',
      mname: data?.middleName || '',
      lname: data?.lastName || '',
      email: data?.email || '',
      contact: data?.contact || '',
      suffix: data?.suffix || '',
      gender: data?.sex,
      defaultESig: null,
      birthDate: new Date(data?.dateOfBirth) || new Date(),
      nationality: data?.nationality || '',
      address: data?.address || '',
      avatarUrl: data?.photoURL || null,
      title: data?.title || null,
      prcNumber: data?.PRC ?? '',

      prcExpiry: new Date(data?.validity),
      ptrNumber: data?.PTR ?? '',
      s2Number: data?.s2_number || '',
      since: data?.practicing_since || '',
      signatureUrl: '',
    }),
    [dataVal]
  );


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


  useEffect(() => {
    if (dataVal) {
      setValue('fname', dataVal?.firstName);
      setValue('mname', dataVal?.middleName);
      setValue('lname', dataVal?.lastName);
      setValue('email', dataVal?.email);
      setValue('contact', dataVal?.contact);
      setValue('suffix', dataVal?.suffix);
      setValue('gender', dataVal?.sex);
      setValue('birthDate', new Date(dataVal?.dateOfBirth));
      setValue('nationality', dataVal?.nationality);
      setValue('address', dataVal?.address);
      setValue('title', dataVal?.title);
      setValue('prcNumber', dataVal?.PRC);
      setValue('prcExpiry', dataVal?.validity);
      setValue('email', dataVal?.email);
      setValue('ptrNumber', dataVal?.PTR);
      setValue('s2Number', dataVal?.s2_number);
      setValue('since', dataVal?.practicing_since);
      setValue('avatarUrl', dataVal?.photoURL);
      // setValue('signatureUrl', (() => {
      //     const url = dataVal?.esig?.filename;
      //     const parts = url?.split('public');
      //     const publicPart = parts ? parts[1] : null;

      //     return publicPart;
      //   })() || null,);
      setValue('signatureUrl', `/${dataVal?.esig?.filename?.split('/').splice(1).join("/")}`);


    }
  }, [dataVal]);

  const values = watch();

  console.log(values, '????????????????????????????????????????????????????????????????')

  //   const [uploadData] = useMutation(GeneralTabMutation, {
  //     context: {
  //       requestTrackerId: 'Prescription_data[Prescription_data]',
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   });
  //   const [uploadDataSign] = useMutation(MutationESign, {
  //     context: {
  //       requestTrackerId: 'Prescription_data[Prescription_data]',
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   });

  const [snackKey, setSnackKey]: any = useState(null);
  const [snackKey2, setSnackKey2]: any = useState(null);
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
      //   uploadData({
      //     variables: {
      //       data,
      //       file: model?.avatarUrl,
      //     },
      //   })
      //     .then(async (res) => {
      //       const { data } = res;
      //       closeSnackbar(snackKey);
      //       enqueueSnackbar('Updated successfully!');
      //       reInitialize();
      //     })
      //     .catch((error) => {
      //       closeSnackbar(snackKey);
      //       enqueueSnackbar('Something went wrong', { variant: 'error' });
      //       // runCatch();
      //     });
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

      //   uploadDataSign({
      //     variables: {
      //       data,
      //       file: model?.signatureUrl,
      //     },
      //   })
      //     .then(async (res) => {
      //       const { data } = res;
      //       closeSnackbar(snackKey2);
      //       setSnackKey2(null);
      //       enqueueSnackbar('Updated successfully!');
      //       reInitialize();
      //     })
      //     .catch((error) => {
      //       closeSnackbar(snackKey2);
      //       setSnackKey2(null);
      //       enqueueSnackbar('Something went wrong', { variant: 'error' });

      //     });
    },
    [snackKey2]
  );


  useEffect(() => {
    console.log(values.signaturePad, 'signaturePadsignaturePadsignaturePadsignaturePad   ');
  }, [values]);
  // const [uploadtest] = useMutation(gql`
  //   mutation simpleUpload($file: Upload) {
  //     simpleUpload(file: $file)
  //   }
  // `);

  // doctor = employee table, sexytary = subaccounts_employee, user = user;

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

      console.log('Changes@@@@@@@@@@');
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      console.log(newFile, 'newfiledaw');

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const openPay = useBoolean();

  const openSig = () => {
    openPay.onTrue();
  };

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
  const [isProfile, setIsProfile] = useState(true);


  const handleRemoveFile = useCallback(() => {
    setValue('signatureUrl', null);
  }, [setValue]);

  const [refetch, setRefetch] = useState(false);



  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4} spacing={3}>
            <Card sx={{ py: { md: 10, xs: 1 }, px: { md: 3, xs: 1 }, mb: 3, textAlign: 'center' }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                disabled
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
                    {/* Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)} */}
                  </Typography>
                }
              />
            </Card>
            <Card sx={{ py: { md: 2, xs: 1 }, px: { md: 3, xs: 1 }, textAlign: 'center' }}>
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {/* <Button
                  onClick={openSig}
                  variant="contained"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    right: 10,
                    top: 5,
                    fontSize: '11px',
                    width: '25px',
                    height: '25px',
                  }}
                  startIcon={
                    <Iconify icon="tabler:edit" sx={{ width: '15px', height: '15px' }} />
                  }
                >
                  Edit
                </Button> */}
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
                  <Box sx={{ width: '135%', height: '58px' }}>
                    {dataVal?.esig?.filename && (
                      <img
                        alt=" "
                        style={{ width: '25%', height: '115%' }}
                        src={
                          (() => {
                            const url = dataVal?.esig?.filename;
                            const parts = url?.split('public');
                            const publicPart = parts ? parts[1] : null;

                            return publicPart;
                          })() || null
                        }
                      />
                    )}
                  </Box>

                  <Stack direction="column" alignSelf="flex-end">
                    {/* <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                        {user?.middleName
                          ? `${user?.firstName} ${user?.middleName} ${user?.lastName}, ${user?.title}`
                          : `${user?.firstName} ${user?.lastName},  ${user?.title}`}
                      </Typography> */}

                    {getValues('prcNumber') && (
                      <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                        License No: {getValues('prcNumber')}
                      </Typography>
                    )}

                    {getValues('ptrNumber') && (
                      <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                        PTR No: {getValues('ptrNumber')}
                      </Typography>
                    )}
                    {getValues('s2Number') && (
                      <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                        S2 No: {getValues('s2Number')}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Card>
            {/* {user?.role === 'doctor' && (
              <Card sx={{ py: { md: 2, xs: 1 }, px: { md: 3, xs: 1 }, textAlign: 'center' }}>
                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    onClick={openSig}
                    variant="contained"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: 5,
                      fontSize: '11px',
                      width: '25px',
                      height: '25px',
                    }}
                    startIcon={
                      <Iconify icon="tabler:edit" sx={{ width: '15px', height: '15px' }} />
                    }
                  >
                    Edit
                  </Button>
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
                    <Box sx={{ width: '135%', height: '58px' }}>
                      {user?.esig?.filename && (
                        <img
                          alt=" "
                          style={{ width: '25%', height: '115%' }}
                          src={
                            (() => {
                              const url = user?.esig?.filename;
                              const parts = url?.split('public');
                              const publicPart = parts ? parts[1] : null;

                              console.log(publicPart, '@@@@@@@');

                              return publicPart;
                            })() || null
                          }
                        />
                      )}
                    </Box>

                    <Stack direction="column" alignSelf="flex-end">
                      <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                        {user?.middleName
                          ? `${user?.firstName} ${user?.middleName} ${user?.lastName}, ${user?.title}`
                          : `${user?.firstName} ${user?.lastName},  ${user?.title}`}
                      </Typography>

                      {getValues('prcNumber') && (
                        <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                          License No: {getValues('prcNumber')}
                        </Typography>
                      )}

                      {getValues('ptrNumber') && (
                        <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                          PTR No: {getValues('ptrNumber')}
                        </Typography>
                      )}
                      {getValues('s2Number') && (
                        <Typography sx={{ fontSize: 11, textAlign: 'left' }}>
                          S2 No: {getValues('s2Number')}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            )} */}
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
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="fname" label="First Name" />
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="mname" label="Middle Name" />
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="lname" label="Last Name" />

                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="email" label="Email" />

                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="suffix"
                  label="Name Suffix"
                  helperText="e.g.: I, II, Jr., Sr., etc."
                />

                {/* <RHFSelect InputProps={{
                  readOnly: true,
                }} name="gender" label="Gender">
                  <MenuItem value={1}>Male</MenuItem>
                  <MenuItem value={2}>Female</MenuItem>

                </RHFSelect> */}

                {/* {user?.role === 'patient' && <Controller
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
                />} */}

                {/* {user?.role !== 'secretary' && (
                  <RHFTextField name="nationality" label="Nationality" />
                )}
                {user?.role !== 'secretary' && <RHFTextField name="address" label="Address" />}
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="email"
                  label="Email Address"
                /> */}
                <RHFTextField InputProps={{
                  readOnly: true,
                }} name="contact" label="Phone Number" />
              </Box>

              {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack> */}
            </Card>
            <Card>
              <CardHeader title="Hospitals" />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {dataVal?.clinicInfo?.map((item: any) => (
                  <div key={item.id} style={{ flex: '50%', padding: '8px' }}>
                    <AppointmentNewScheduleCard data={item} isProfile={isProfile} />
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <AccountGeneralSig
        reset={() => setRefetch(true)}
        isOpen={openPay.value}
        onClose={() => openPay.onFalse()}
        data={dataVal}
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
