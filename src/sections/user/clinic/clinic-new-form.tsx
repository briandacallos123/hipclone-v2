import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// utils
import { fData } from 'src/utils/format-number';
// types
import { IUserClinicNewFormValues } from 'src/types/user';
// prisma
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { CLINIC_POST } from '@/libs/gqls/clinicSched';
import { useMutation } from '@apollo/client';
// nexus
import { NexusGenInputs } from 'generated/nexus-typegen';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFMultiCheckbox,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import './clinic.css'
import { useTheme, alpha } from '@mui/material/styles';
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';
import { validatePhone } from '../subaccount/action/sub-account-act';
import { provinces } from '@/utils/constants';
import { OutlinedInput } from '@mui/material';
import { getCurrentStep, setCurrentStep } from '@/app/dashboard/tutorial-action';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------

const PROVINCE_OPTIONS = ['Abra', 'Bataan', 'Cagayan'];

const APPOINTMENT_TYPE = [
  { label: 'Telemedicine', value: 1 },
  { label: 'Face-To-Face', value: 2 },
];

const APPOINTMENT_DAY = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tueday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

// ----------------------------------------------------------------------

interface FormValuesProps
  extends Omit<IUserClinicNewFormValues, 'avatarUrl' | 'startTime' | 'endTime'> {
  avatarUrl: CustomFile | string | null;
  startTime: Date | null;
  endTime: Date | null;
}

type Props = {
  onClose: VoidFunction;
  appendData: any;
  appendDataClient: any;
  uuid: any;
  handleRefetchStep:any;
  refetch: any;
};

export default function ClinicNewForm({
  uuid,
  appendDataClient,
  appendData,
  onClose,
  refetch,
  handleRefetchStep
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();



  const [limitReq, setLimitReq] = useState(false);

  const isLimitReq = limitReq && {
    limitValue: Yup.string().required('Patient Limit is required'),
  }


  const CreateUserSchema = Yup.object().shape({
    clinic_name: Yup.string().required('Clinic name is required'),

    location: Yup.string().required('Location is required'),
    // Province: Yup.string().required('Province is required'),
    // avatarUrl: '',
    phoneNumber: Yup.string().required('Phone number is required')
      .matches(/^[0-9]{11}$/, 'Phone number must be exactly 10 digits')
      .matches(/^\+?[0-9]\d{1,14}$/, 'Phone number must be valid'),
    type: Yup.array().required('Type is required').min(1, 'At least one type is required'),
    days: Yup.array().required('Days are required').min(1, 'At least one day is required'),
    start_time: Yup.string().required('Start time is required'),
    end_time: Yup.string().required('End time is required'),
    time_interval: Yup.string().required('Time interval is required'),
    ...isLimitReq
  });
  // const UpdateUserSchema = Yup.object().shape({
  //   password: Yup.string().required('New Password is required').min(6, 'Password must be at least 6 characters'),
  //   confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password must match'),
  //   firstName: Yup.string().required('FirstName is required'),
  //   lastName: Yup.string().required('LastName is required'),
  //   middleName: Yup.string().required('MiddleName is required'),
  //   gender: Yup.string().required('Gender is required'),
  // });
  const defaultValues = useMemo(
    () => ({
      clinic_name: '',
      phoneNumber: null,
      location: '',
      Province: 'Zamboanga',
      avatarUrl: '',
      type: [],
      days: [] ?? new Date(),
      startTime: new Date(),
      endTime: new Date(),
      time_interval: '',
    }),
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    getValues,
    formState: { isSubmitting, isDirty, errors },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (values.time_interval === '10') {
      setLimitReq(true)
    }
  }, [values.time_interval])

  const {user} = useAuthContext();

  useEffect(() => {
    if (!values.limitValue && values.time_interval === '10') {
      setLimitReq(true)
    }
  }, [values.limitValue, values.time_interval])

  console.log(values.limitValue, 'ano valuee')


  const [currentStep, setCurrentStepState] = useState(null);

  useEffect(() => {
    if (user?.new_doctor) {
      getCurrentStep(user?.id).then((res) => {
        setCurrentStepState(res.setup_step)
      })
    }
  }, [user])

  const [step, setStep] = useState(3);

  console.log(step, 'steppp')

  const onIncrementStep = useCallback(() => {

    if (values.time_interval) {
      if (values.time_interval === '10') {
        setStep(step + 1);
      } else {
        setStep(step + 2);
      }
    } else {
      setStep(step + 1);

    }


  }, [values])

  const [createClinic] = useMutation(CLINIC_POST);
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: any = {
        clinic_name: model.clinic_name,
        location: model.location,
        number: String(model.phoneNumber),
        Province: model.Province,
        type: model.type,
        days: model.days,
        start_time: formatDateToTime(model.start_time),
        end_time: formatDateToTime(model.end_time),
        time_interval: model.time_interval,
        uuid: model.uuid,
        limitValue: model?.limitValue
      };
      createClinic({
        variables: {
          data,
          file: model.avatarUrl,
        },
      })
        .then(async (res) => {
          const { data: dataResponse } = res;
          appendData(dataResponse?.PostClinic);
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
         
         
          if (currentStep) {
            // localStorage.setItem('currentStep', '7')
            setCurrentStep({
              id:user?.id,
              step:7
            }).then(()=>{
              onClose()
              refetch();
              reset();
              handleRefetchStep()
            })
          }else{
            onClose()
            refetch();
            reset();
          }


        })
        .catch((error) => {
          console.log(error, 'ano error?');
          closeSnackbar(snackKey);
          setSnackKey(null);
          onClose();

          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [snackKey]
  );

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          uuid,
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(async (data: NexusGenInputs['ClinicInsertPayload']) => {
    try {
      appendDataClient(data);

      const snackbarKey = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'savingEducation',
        persist: true, // Do not auto-hide
      });
      setSnackKey(snackbarKey);

      // await handleSubmitValue({
      //   ...data,
      //   uuid,
      // });
      // reset();
      // enqueueSnackbar('Saving data...!');
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }

    },
    [setValue]
  );

  const theme = useTheme();
  const confirm = useBoolean();


  const PRIMARY_MAIN = theme.palette.primary.main;

  const clearUnsaved = useCallback(() => {
    if (step === 3) {
      setValue('avatarUrl', '')
    }
    else if (step === 7) {
      setValue('Province', '')
    }
  }, [values])

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Unsaved Changes"
      content="You have unsaved changes, are you sure you want to skip?"
      sx={{
        zIndex: 99999
      }}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onIncrementStep();
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

    if (isDirty || values.avatarUrl || values.Province) {
      confirm.onTrue()
    } else {
      onIncrementStep()
    }
  }, [isDirty, values])

  console.log(isDirty, 'isDirtyisDirty')

  const handleContinue = useCallback(() => {
    // Resetting isDirty by setting the values to the current values
    reset({}, { keepValues: true });
    // Then increment the step
    onIncrementStep();
  }, [values])

  const [existsPhone, setExistsPhone] = useState(false)


  useEffect(() => {
    if (values.phoneNumber && !Object.keys(errors)?.includes('phoneNumber')) {
      (async () => {
        validatePhone({
          phone: String(values.phoneNumber)
        }).then((res) => {
          const { isExists } = res;
          console.log(res, 'isExistsisExistsisExists')
          if (isExists) {
            setExistsPhone(true)
          } else {
            setExistsPhone(false)
          }
        }).catch((err) => {
          console.log(err, 'errorrrrrrrr')
        })
      })()
    }
  }, [values.phoneNumber, !Object.keys(errors)?.includes('phoneNumber')])

  const RenderChoices = useCallback(({ isRequired }: any) => {
    return (
      <Stack sx={{
        p: 1
      }} direction="row" alignItems='center' gap={2} justifyContent='flex-end'>
        {!isRequired && <Button onClick={onSkip} variant="outlined">Skip</Button>}

        <Button disabled={(() => {
          if (step === 7) {
            return false
          } else if (step === 6) {
            if (!values.phoneNumber) {
              return true;
            }
            else if (String(values.phoneNumber).length !== 11) {
              return true
            }
            if (Object.keys(errors)?.length === 0) {
              if (existsPhone) {
                return true;
              } else {
                return false;
              }
            } else {
              return true
            }
          }
          else if (step === 3) {
            if (!values.avatarUrl) {
              return true;
            } else {
              return false
            }

          }
          else {
            return !isDirty
          }
        })()} onClick={handleContinue} variant="contained">Continue</Button>

      </Stack>
    )
  }, [isDirty, step, Object.keys(errors), values])


  console.log(values, 'valuess')

  const renderTutsFields = (
    <Box sx={{
      mb: 5,
    }}>
      {renderConfirm}
      <Grid container spacing={3} sx={{ mt: 0.2, mb: 3 }}>
        <Grid xs={12} md={4}>
          <div className={step === 3 ? 'showFields-clinic' : ''}>
            <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
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
            {step === 3 && <RenderChoices isRequired={false} />}
          </div>
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <div className={step === 4 ? 'showFields-clinic' : ''}>
              <RHFTextField name="clinic_name" label="Clinic/Hospital Name" />
              {step === 4 && <RenderChoices isRequired={true} />}
            </div>
            <div className={step === 5 ? 'showFields-clinic' : ''}>
              <RHFTextField name="location" label="Clinic Address" />
              {step === 5 && <RenderChoices isRequired={true} />}
            </div>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <div className={step === 6 ? 'showFields-clinic' : ''}>
                <RHFTextField
                  name="phoneNumber"
                  type="number"
                  error={!!errors.phoneNumber || existsPhone}

                  label="Clinic Phone Number"
                  helperText={(errors.phoneNumber ? errors.phoneNumber.message : '') || existsPhone && 'Phone already used' || 'This number will be visible to the public. Please indicate the clinic official contact number.'}
                  onChange={(e) => {
                    setValue('phoneNumber', e.target.value);

                    methods.trigger('phoneNumber'); // Validate on change
                  }}
                />
                {step === 6 && <RenderChoices isRequired={true} />}

              </div>


              <div className={step === 7 ? 'showFields-clinic' : ''}>


              <RHFAutocomplete
                      name="province"
                      label="Province"
                      options={provinces} // Use the whole province objects
                      getOptionLabel={(option) => option.name} // Directly use the name from the option
                      isOptionEqualToValue={(option, value) => option.id === value.id} // Compare IDs for equality
                      renderOption={(props, option) => {
                        const { id, name } = option; // Destructure from option directly

                        return (
                          <li {...props} key={id}>
                            {name}
                          </li>
                        );
                      }}
                      sx={{ pt: 1 }}
                    />
                {step === 7 && <RenderChoices isRequired={false} />}
              </div>

            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="overline" color="text.disabled">
        Fill in clinic schedule
      </Typography>

      <Stack spacing={3} sx={{ mt: 1 }}>
        <div>
          <div className={step === 8 ? 'showFields-clinic' : ''}>
            <RHFMultiCheckbox
              row
              name="type"
              label="Appointment Types"
              options={APPOINTMENT_TYPE}
            />
            {step === 8 && <RenderChoices isRequired={true} />}
          </div>

          <div className={step === 9 ? 'showFields-clinic' : ''}>
            <RHFMultiCheckbox
              row
              name="days"
              label="Appointment Days"
              options={APPOINTMENT_DAY}
            />
            {step === 9 && <RenderChoices isRequired={true} />}
          </div>

        </div>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <div className={step === 10 ? 'showFields-clinic' : ''}>
            <Controller
              name="start_time"
              control={control}
              render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                <TimePicker
                  label="Start Time"
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
            {step === 10 && <RenderChoices isRequired={true} />}
          </div>


          <div className={step === 11 ? 'showFields-clinic' : ''}>
            <Controller
              name="end_time"
              control={control}
              render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                <TimePicker
                  label="End Time"
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
            {step === 11 && <RenderChoices isRequired={true} />}
          </div>

          <div className={step === 12 ? 'showFields-clinic' : ''}>
            <RHFSelect name="time_interval" label="Duration">
              <MenuItem value="15">15 Mins</MenuItem>
              <MenuItem value="30">30 Mins</MenuItem>
              <MenuItem value="45">45 Mins</MenuItem>
              <MenuItem value="60">1 Hour</MenuItem>
              <MenuItem value="0">No Limit</MenuItem>
              <MenuItem value="10">Limited</MenuItem>

            </RHFSelect>
            {step === 12 && <RenderChoices isRequired={true} />}
          </div>

          {values.time_interval === '10' &&
            <div className={(step === 13 && values.time_interval === '10') ? 'showFields-clinic' : ''}>
              <RHFTextField label="Allowed Patient" name="limitValue" type="number">
              </RHFTextField>
              {step === 13 && <RenderChoices isRequired={true} />}
              <Box></Box>
            </div>
          }




        </Box>
      </Stack>
      <DialogActions>

        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <div className={step === 14 ? 'showFields-submit-clinic' : ''}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </LoadingButton>
        </div>

      </DialogActions>
      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,


      }}>

      </Box>
    </Box>
  )

  console.log(currentStep, 'currentStep')
  return (
    <>
      <DialogContent sx={{
        scrollBehavior: 'smooth',

      }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

          {!(currentStep && currentStep < 20) ? <Box>

            <Typography variant="overline" color="text.disabled">
              Fill in clinic details
            </Typography>

            <Grid container spacing={3} sx={{ mt: 0.2, mb: 3 }}>
              <Grid xs={12} md={4}>
                <Card sx={{ py: 5, px: 3, textAlign: 'center' }}>
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
                </Card>
              </Grid>

              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  <RHFTextField name="clinic_name" label="Clinic/Hospital Name" />
                  <RHFTextField name="location" label="Clinic Address" />

                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >
                    <RHFTextField
                      name="phoneNumber"
                      label="Clinic Phone Number"
                      helperText="This number will be visible to the public. Please indicate the clinic official contact number."
                    />

                    {/* <RHFSelect name="Province" label="Province">
                      {provinces &&
                        provinces.map((option: any, index: Number) => (
                          <MenuItem key={index} value={option?.name}>
                            {option?.name}
                          </MenuItem>
                        ))}
                    </RHFSelect> */}
                    <RHFAutocomplete
                      name="province"
                      label="Province"
                      options={provinces} // Use the whole province objects
                      getOptionLabel={(option) => option.name} // Directly use the name from the option
                      isOptionEqualToValue={(option, value) => option.id === value.id} // Compare IDs for equality
                      renderOption={(props, option) => {
                        const { id, name } = option; // Destructure from option directly

                        return (
                          <li {...props} key={id}>
                            {name}
                          </li>
                        );
                      }}
                      sx={{ pt: 1 }}
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Typography variant="overline" color="text.disabled">
              Fill in clinic schedule
            </Typography>

            <Stack spacing={3} sx={{ mt: 1 }}>
              <div>
                <RHFMultiCheckbox
                  row
                  name="type"
                  label="Appointment Types"
                  options={APPOINTMENT_TYPE}
                />

                <RHFMultiCheckbox
                  row
                  name="days"
                  label="Appointment Days"
                  options={APPOINTMENT_DAY}
                />
              </div>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <TimePicker
                      label="Start Time"
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

                <Controller
                  name="end_time"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <TimePicker
                      label="End Time"
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

                <RHFSelect name="time_interval" label="Duration">
                  <MenuItem value="15">15 Mins</MenuItem>
                  <MenuItem value="30">30 Mins</MenuItem>
                  <MenuItem value="45">45 Mins</MenuItem>
                  <MenuItem value="60">1 Hour</MenuItem>
                  <MenuItem value="0">No Limit</MenuItem>
                  <MenuItem value="10">Limited</MenuItem>

                </RHFSelect>
                {values.time_interval === '10' && <RHFTextField label="Allowed Patient" name="limitValue" type="number">
                </RHFTextField>
                }




              </Box>
            </Stack>
          </Box> : renderTutsFields}
        </FormProvider>
      </DialogContent>

      {!currentStep && <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>}
    </>
  );
}

function formatDateToTime(dateString: any) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
