import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { ISchedule } from 'src/types/general';
// prisma
import { CLINIC_SCHED_POST, SCHED_UPDATE_ONE } from '@/libs/gqls/clinicSched';
import { useMutation } from '@apollo/client';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFMultiCheckbox, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { Typography } from '@mui/material';
// ----------------------------------------------------------------------

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

interface FormValuesProps extends Omit<ISchedule, 'startTime' | 'endTime'> {
  startTime: Date | null;
  endTime: Date | null;
}

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  id?: any;
  isEdit?: any;
  modifySched?: any;
  appendClinic?: any;
  refetch?: any;
  setHideSched?: any;
};

export default function ClinicScheduleNewEditForm({
  modifySched,
  appendClinic,
  currentItem,
  onClose,
  refetch,
  setHideSched,
  id,
  isEdit,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    days: Yup.array().required('Days is required').min(1, 'At least one Type must be selected'),
    type: Yup.array().required('Type is required').min(1, 'At least one Type must be selected'),
 
    start_time: Yup.date().required('Start Time is required'),
    end_time: Yup.date().required('End Time is required'),
    time_interval: Yup.string().required('Time Interval is required'),
  });

  const convertTime = (timeStr: any) => {
    if (!timeStr) {
      return null;
    }

    let [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // Check if the timeStr includes a timezone (ends with 'Z')
    if (timeStr.endsWith('Z')) {
      // Extract the milliseconds (if available)
      const date = new Date(timeStr);
      return isNaN(date) ? null : date;
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  };
  const newFormatTimeString = (timeString) => {
    const date = new Date(timeString);
    return isNaN(date) ? null : date;
  };
  // Test cases
  // eslint-disable-next-line react-hooks/exhaustive-deps



  const sTime = convertTime(currentItem?.start_time);
  const sTimeNew = newFormatTimeString(currentItem?.start_time);
  const eTime = convertTime(currentItem?.end_time);
  const eTimeNew = newFormatTimeString(currentItem?.end_time);
  // console.log('startTime new', newFormatTimeString(currentItem?.start_time)); // 2023-10-23T04:00:00.000Z
  // console.log('startTime old', currentItem?.start_time); // 2023-10-23T10:23:45.000Z
  // console.log('startTime fromatye', sTime);

  const defaultValues = useMemo(
    () => ({
      type: currentItem?.type ?? [],
      days: currentItem?.days ?? [],
      // start_time: sTime ? convertTime(sTime) : new Date(),
      // end_time: eTime ? convertTime(eTime) : new Date(),
      start_time: new Date(sTime) ?? new Date(),
      end_time: (new Date(eTime) || new Date(eTimeNew)) ?? new Date(),
      time_interval: currentItem?.time_interval,
      numberPatient:0
    }),
    [currentItem?.days, currentItem?.time_interval, currentItem?.type, eTime, sTime, sTimeNew]
  );


  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    if (values?.time_interval === '1') {
      setShowTime(true)
    }
  }, [values?.time_interval])

  // useEffect(() => {
  //   if(currentItem){
  //     setValue('type',currentItem?.type);
  //     setValue('days',currentItem?.type);
  //   }
  // }, [currentItem?.id]);

  const [PostClinicSched] = useMutation(CLINIC_SCHED_POST);
  const [UpdateClinicSched] = useMutation(SCHED_UPDATE_ONE);
  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model:any) => {

      const data: any = {
        refId: Number(currentItem?.id),
        type: model.type,
        days: model.days,
        start_time: model.start_time,
        end_time: model.end_time,
        numberPatient:model?.numberPatient,
        time_interval: model.time_interval,
      };
      try {
        if (isEdit) {
          // Update the record
          await UpdateClinicSched({
            variables: {
              data,
            },
          }).then((res) => {
            // console.log('RESPONSE: ', response);
            const { data } = res;
            modifySched(data?.PostClinicSched);
            closeSnackbar(snackKey);
            setSnackKey(null);
            enqueueSnackbar('Update success!');
            refetch();
          });
        } else {
          // Create a new record
          await PostClinicSched({
            variables: {
              data,
            },
          }).then(async (res) => {
            const { data } = res;
            // Additional handling for successful create
            modifySched(data?.PostClinicSched);
            closeSnackbar(snackKey);
            setSnackKey(null);
            enqueueSnackbar('Create success!');
            reset();
            refetch();
          });
        }
      } catch (error) {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        console.error(error);
      }
    },
    // [PostClinicSched, UpdateClinicSched, enqueueSnackbar, id, isEdit, reset]
    [snackKey]
  );


  const appendNum = (val: any) => {
    return val < 10 ? `0${val}` : val
  }

  useEffect(() => {
    if (snackKey) {
      (async () => {
        const startTime = `${appendNum(values.start_time.getHours())}:${appendNum(values.start_time.getMinutes())}:${appendNum(values.start_time.getSeconds())}`;
        const endTime = `${appendNum(values.end_time.getHours())}:${appendNum(values.end_time.getMinutes())}:${appendNum(values.end_time.getSeconds())}`;

        await handleSubmitValue({
          ...values,
          start_time: startTime,
          end_time: endTime
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      // appendClinic({
      //   ...data,
      //   refId: currentItem.id,
      //   endTime: String(data?.endTime),
      //   start_time: String(data?.start_time),
      // });
      const snackbarKey = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'savingEducation',
        persist: true, // Do not auto-hide
      });
      setSnackKey(snackbarKey);

      onClose();
      setHideSched();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const isOptionChecked = (option: any, selectedValues: any) => {
    return selectedValues.includes(Number(option.value));
  };

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <div>
              <Box sx={{
                mb:1
              }}>
                <Typography variant="body2" color="gray">Clinic Name</Typography>
                <Typography variant="body1" sx={{
                  textTransform:'capitalize'
                }}>{currentItem?.clinic_name}</Typography>

              </Box>
              
              <RHFMultiCheckbox
                row
                name="type"
                label="Appointment Types"
                options={APPOINTMENT_TYPE}
                checked={true}
                defaultChecked={defaultValues.type.map((option: any) => {
                  const ids: any = APPOINTMENT_TYPE?.map((i: any) => i == option);
                  if (ids?.includes(option)) {
                    return true;
                  }
                })}
              />
              {/* <RHFCheckbox name="type" label="Appointment Types" checked={true} /> */}

              <RHFMultiCheckbox
                row
                name="days"
                label="Appointment Days"
                options={APPOINTMENT_DAY}
                defaultChecked={defaultValues.days.map((value: any) =>
                  APPOINTMENT_DAY.includes(value)
                )}
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
                <MenuItem value="1">Limited</MenuItem>

              </RHFSelect>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              {showTime && <RHFTextField
                name="numberPatient"
                type="number"
                placeholder='Number of patients'
              />}
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
          {isEdit ? 'Update' : 'Create'}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
