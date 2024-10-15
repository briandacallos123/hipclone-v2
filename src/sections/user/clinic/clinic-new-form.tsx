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
} from 'src/components/hook-form';

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
  provinces: any;
  refetch: any;
};

export default function ClinicNewForm({
  provinces,
  uuid,
  appendDataClient,
  appendData,
  onClose,
  refetch,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const [limitReq, setLimitReq] = useState(false);

  const isLimitReq = limitReq && {
    limitValue:Yup.string().required('Patient Limit is required'),
  }


  const CreateUserSchema = Yup.object().shape({
    clinic_name: Yup.string().required('Clinic name is required'),
    number: Yup.number().required('Number is required').typeError('Number must be a number'),
    location: Yup.string().required('Location is required'),
    Province: Yup.string().required('Province is required'),
    // avatarUrl: '',
    type: Yup.array().required('Type is required').min(1, 'At least one type is required'),
    days: Yup.array().required('Days are required').min(1, 'At least one day is required'),
    start_time:Yup.string().required('Start time is required'),
    end_time:Yup.string().required('End time is required'),
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
      number: null,
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
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  useEffect(()=>{
    if(values.time_interval === '10'){
      setLimitReq(true)
    }
  },[values.time_interval])

  console.log(limitReq,'limit')

  useEffect(()=>{
    if(!values.limitValue && values.time_interval === '10'){
      setLimitReq(true)
    }
  },[values.limitValue, values.time_interval])

  console.log(values.limitValue,'ano valuee')

  const currentStep = localStorage?.getItem('currentStep')

  const [createClinic] = useMutation(CLINIC_POST);
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: any = {
        clinic_name: model.clinic_name,
        location: model.location,
        number: model.number,
        Province: model.Province,
        type: model.type,
        days: model.days,
        start_time: formatDateToTime(model.start_time),
        end_time: formatDateToTime(model.end_time),
        time_interval: model.time_interval,
        uuid: model.uuid,
        limitValue:model?.limitValue
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
          refetch();
          reset();
          onClose()
          if(currentStep && Number(currentStep) !== 100){
            localStorage.setItem('currentStep','7')
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

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                    name="number"
                    label="Clinic Phone Number"
                    helperText="This number will be visible to the public. Please indicate the clinic official contact number."
                  />

                  <RHFSelect name="Province" label="Province">
                    {provinces &&
                      provinces.map((option: any, index: Number) => (
                        <MenuItem key={index} value={option?.Province}>
                          {option?.Province}
                        </MenuItem>
                      ))}
                  </RHFSelect>
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
        </FormProvider>
      </DialogContent>

      <DialogActions>
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
      </DialogActions>
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
