/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { capitalize } from 'lodash';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// prisma
import { useBoolean } from 'src/hooks/use-boolean';

import { TAKEN_TIME } from '@/libs/gqls/fyd';
import { get_hmo_list } from '@/libs/gqls/hmo_list';
import { BOOK_POST } from '@/libs/gqls/drappts';
import { useMutation, useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
// types
import { IAppointmentFindItem, IAppointmentFormValue } from 'src/types/appointment';
// components
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';
import FormProvider, { RHFRadioGroup, RHFSwitch } from 'src/components/hook-form';
//
import { useSearch } from '@/auth/context/Search';
import { YMD } from '@/utils/format-time';
import EmptyContent from '@/components/empty-content/empty-content';
import { useTheme } from '@mui/material/styles';
import AppointmentNewOthers from './appointment-new-others';
import AppointmentNewScheduleCard from './appointment-new-schedule-card';
import { Button } from '@mui/material';
import ConsentDialog from '@/components/custom-dialog/conscentDialog';
import { useAuthContext } from '@/auth/hooks';

// import CONSENTPDF from 'src/assets/Consent-Form.pdf';
// import TERMSPDF from 'src/assets/Terms-and-Conditions.pdf';
// ----------------------------------------------------------------------

type TypeOptionValue = { label: string; value: any };
type TimeOptionValue = { label: string; value: any };
interface FormValuesProps
  extends Omit<IAppointmentFormValue, 'scheduleDate' | 'scheduleTime' | 'hmo'> {
  scheduleDate: Date | null;
  scheduleTime: Date | null;

  name: string;
  mid: string;
  attachment: CustomFile | string | null;
}

type Props = {
  currentItem: any;
  hmoData: any;
  refetch?: any;
};

export default function AppointmentNewForm({ currentItem, hmoData, refetch }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { setTriggerRef, triggerRef }: any = useSearch();
  const {socket} = useAuthContext()
  const [typeOptions, setTypeOptions] = useState<TypeOptionValue[]>();
  const [tempValue, setTempValue] = useState<any>([]);
  const [tempDays, setTempDays] = useState<any>([]);
  const [takenTime, setTakenTime] = useState<any>([]);
  const [tempStartTime, setTempStartTime] = useState<any>([]);
  const [tempEndTime, setTempEndTime] = useState<any>([]);
  const [timeDuration, setDuration] = useState<any>([]);

  const [timeOptions, setTimeOptions] = useState<any>([]);
    const [mergeOptions, setMergeOptions] = useState<any>([]);
  const [renderTime, setRenderTime] = useState<TimeOptionValue[]>();
  // const [newTimeSlots, setTimeslots] = useState<any>([]);
  // console.log('ffssgg: ', timeS)
  const [snackKey, setSnackKey]: any = useState(null);
  const [requireHmo, setRequireHmo] = useState(false);

  // console.log(snackKey, 'Null kaba?');

  const newObj = {
    useHmo: Yup.boolean(),
    hmo: Yup.object().when(['useHmo'], (useHmo, schema) => {
      return useHmo
        ? schema.shape({
            name: Yup.string().required('HMO Name is required'),
            mid: Yup.string().required('HMO MID is required'),
          })
        : schema.shape({
            name: Yup.string().default(''),
            mid: Yup.string().default(''),
          });
    }),
    attachment: Yup.array().when(['useHmo'], (useHmo, schema) => {
      return useHmo
        ? schema.required('At least one attachment is required when using HMO').test(
            'is-array',
            'At least one attachment is required when using HMO',
            // eslint-disable-next-line prefer-arrow-callback
            function (value) {
              return Array.isArray(value) && value.length > 0;
            }
          )
        : schema;
    }),
  };

  let renderData = hmoData && requireHmo && { ...newObj };
  // console.log('renderData@@@', renderData);

  const [requireOther, setRequireOther] = useState(false);

  // console.log(requireOther, 'REquire ba?');
  const NewAppoinmentSchema = Yup.object().shape({
    location: Yup.number().required('Location is required'),
    type: Yup.string().required('Type is required'),
    typeAgreement: Yup.boolean(),
    scheduleDate: Yup.date().required('Schedule Date is required'),
    scheduleTime: Yup.string().required('Schedule Time is required'),
    chiefComplaint: Yup.array().of(Yup.string()).typeError('Chief Complaint must be a string'),
    cheifOther: requireOther
      ? Yup.string().required("Please specify value here if complaint's is empty")
      : Yup.string(),
    additionalRequest: Yup.array()
      .of(Yup.string())
      .typeError('Additional Request must be a string'),
    additionalOther: Yup.string(),
    agreement: Yup.boolean()
      .required('Agreement is required')
      .test('is-not-false', 'Agreement must be true', (value) => value === true),
    ...renderData,
  });

  const defaultValues = useMemo(
    () => ({
      location: null,
      type: '',
      typeAgreement: false,
      scheduleDate: null,
      scheduleTime: null,
      chiefComplaint: [],
      cheifOther: '',
      additionalRequest: [1],
      additionalOther: '',
      useHmo: false,
      hmo: { name: '', mid: '' },
      attachment: [],
      agreement: false,
      typeAgree: null,
      end_time:null
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewAppoinmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (getValues('useHmo')) {
      setRequireHmo(true);
    } else setRequireHmo(false);
  }, [getValues('useHmo')]);

  // console.log(values);

  const [bookAppt] = useMutation(BOOK_POST);
  const confirm = useBoolean();
  const confirmAggreement = useBoolean();
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['BookingObjInputType'] = {
        doctorID: Number(currentItem?.EMP_ID),
        clinic: Number(model.location),
        date: String(model.scheduleDate),
        time_slot: String(convertDates(model.scheduleTime)),
        type: Number(model.type),
        symptoms: model.chiefComplaint,
        comment: String(model.additionalOther),
        others: String(model.additionalOther),
        AddRequest: model.additionalRequest,
        hmo: model.hmo.name,
        member_id: String(model.hmo.mid),
        end_time: model.end_time
      };
      bookAppt({
        variables: {
          data,
          file: model?.attachment,
        },
      })
        .then(async (res) => {
          socket.emit('send notification',{
            recepient:Number(currentItem?.EMP_ID),
            notification_type:1
          })
          socket.emit('updateAppointment',{
            recepient:Number(currentItem?.EMP_ID),
            notification_type:1
          })
          
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
          reset();
          setTriggerRef(true);

          
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          // console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [bookAppt, currentItem?.EMP_ID, enqueueSnackbar, snackKey]
  );

  const [myData, setMyData]: any = useState(null);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...myData });
        // setSnackKey(null);
      })();
    }
  }, [snackKey, myData]);

  useEffect(() => {
    if (getValues('cheifOther')) {
      setRequireOther(false);
    }
  }, [getValues('cheifOther')]);

  const emptyReqField =
    getValues('location') === null &&
    getValues('type') === '' &&
    getValues('scheduleDate') === null &&
    getValues('scheduleTime') === null &&
    getValues('agreement') === false;

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        // if (emptyReqField) {
        //   enqueueSnackbar('Please check the text fields');
        // }
        // if (!data?.symptoms?.length) {
        //   setRequireOther(true);
        //   return true;
        // }
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        router.push(paths?.dashboard?.appointment?.root);
        // console.info('DATA', data);
        // await handleSubmitValue({
        //   ...data,
        // });
        refetch();

        reset();
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, refetch, reset, router]
  );
  // console.log(tempValue);

  useEffect(() => {
    if (getValues('date') !== null && tempValue) {
      setTypeOptions(
        [...Array(tempValue.length)].map((item, index) => ({
          label: tempValue[index] === 1 ? 'Telemedicine' : 'Face-to-Face',
          value: tempValue[index],
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues('location'), tempValue]);


  const formattedTakenTime = takenTime.map((time: any) => {
    const [hours, minutes] = time.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${period}`;
  });

  const formatTimeString = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return isNaN(date) ? null : date.toISOString();
  };

  const newFormatTimeString = (timeString) => {
    const date = new Date(timeString);
    return isNaN(date) ? null : date.toISOString();
  };

  const removeDuplicateTimes = (timeArray) => {
    const uniqueTimes = [];

    for (const time of timeArray) {
      if (!uniqueTimes.includes(time)) {
        uniqueTimes.push(time);
      }
    }

    return uniqueTimes;
  };

  const renderTimesWithinInterval = (
    startTimeString: any[],
    endTimeString: any[],
    intervalMinutes: any[],
    takenTimes: string[]
  ) => {
    if (
      !startTimeString ||
      !endTimeString ||
      !Array.isArray(startTimeString) ||
      !Array.isArray(endTimeString) ||
      // !intervalMinutes ||
      // !Array.isArray(intervalMinutes) ||
      !takenTimes
    ) {
      // Handle missing or invalid input here.
      console.error('Invalid input parameters.');
      return [];
    }

    const formattedStartTimes = startTimeString.map(
      (timeString) => formatTimeString(timeString) || newFormatTimeString(timeString)
    );

    const formattedEndTimes = endTimeString.map(
      (timeString) => formatTimeString(timeString) || newFormatTimeString(timeString)
    );

    if (formattedStartTimes.some((time) => !time) || formattedEndTimes.some((time) => !time)) {
      // Handle invalid time strings.
      console.error('Invalid time strings.');
      return [];
    }

    const startTimes = formattedStartTimes.map((time) => new Date(time));
    const endTimes = formattedEndTimes.map((time) => new Date(time));

    if (startTimes.some((time) => isNaN(time)) || endTimes.some((time) => isNaN(time))) {
      // Handle invalid dates.
      console.error('Invalid dates.');
      return [];
    }

    const timesWithinInterval = [];

    for (let i = 0; i < startTimes.length; i++) {
      let currentTime = startTimes[i];
      const endTime = endTimes[i];
      const currentInterval = intervalMinutes[i];
      

      

      // let isUnli = currentInterval === "unlimited";

      console.log(currentTime)
    
        if(typeof currentInterval === 'string' && currentInterval  === 'unlimited'){
          const currentTimeString = currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const currentTimeStringEnd = endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          // console.log(currentTimeStringEnd.toString(),'___________________!_!_!_!_!_!_!!!!!!!!!!!!!!!!!!!!!!!!_____________')

         

          const concatTime = `${currentTimeString} - ${currentTimeStringEnd}`;


              timesWithinInterval.push(concatTime);

          currentTime.setTime(currentTime.getTime()  * 60 * 1000);
        }

        else{
          while (currentTime <= endTime) {
            const currentTimeString = currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
          
    
    
            timesWithinInterval.push(currentTimeString);
    
           currentTime.setTime(currentTime.getTime() + currentInterval * 60 * 1000);
           
          }
        
        }

     
    }

    const filteredTimes = timesWithinInterval.filter((time) => !takenTimes?.includes(time));


    const currentTime = new Date(); // Get the current time
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    const currDay = new Date();

    currDay.setHours(0, 0, 0, 0);


    if (currDay.getTime() === new Date(getValues('scheduleDate')).getTime()) {
      const finaltime = filteredTimes?.filter((time) => {
        // Parse the time in the array and compare it to the current time
        const timeComponents = time.split(' ');
        let timeHours = parseInt(timeComponents[0].split(':')[0]);
        const timeMinutes = parseInt(timeComponents[0].split(':')[1]);

        if (timeComponents[1] === 'PM' && timeHours !== 12) {
          timeHours += 12; // Convert to 24-hour format
        }

        if (
          timeHours > currentHours ||
          (timeHours === currentHours && timeMinutes >= currentMinutes)
        ) {
          return true; // Include this time in the filtered list
        }

        return false; // Exclude this time
      });
      return removeDuplicateTimes(finaltime);
    }

    return removeDuplicateTimes(filteredTimes);
  };

  const resultTime = renderTimesWithinInterval(
    tempStartTime,
    tempEndTime,
    timeDuration,
    formattedTakenTime
  );



  const formattedStartTimes = tempStartTime.map((timeString: any) => formatTimeString(timeString));
  // console.log('resultS', tempStartTime);
  // console.log('resultE', tempEndTime);
  // console.log('vv', formattedStartTimes);
  // console.log('formatTimeString', newFormatTimeString(tempStartTime[1]));
  // Create a new Date instance with the current date and time
  const currDay = new Date();

  // Set the time to 00:00:00
  currDay.setHours(0, 0, 0, 0);

  // console.log('dd', currDay);
  // console.log(getValues('scheduleDate'));

  // Compare the resulting date with getValues('scheduleDate')
  // if (currDay.getTime() === new Date(getValues('scheduleDate')).getTime()) {
  //   console.log('same');
  // } else {
  //   console.log('nope');
  // }

  useEffect(() => {
    if (renderTime) {
      const timeData = resultTime?.filter((item:any)=>!item?.includes('-'));

      setTimeOptions(
        [...Array(timeData.length)].map((item, index) => ({
          label: timeData[index],
          value: timeData[index],
        }))
      );
      
      const timeDataMerge:any = resultTime?.filter((item:any)=>item?.includes('-'));

      if(timeDataMerge?.length){
        const endDatez = timeDataMerge[0].split('-')[1]
      

        const timeValue = endDatez // Your time value
        const date = new Date(); // Get current date
        const [hours, minutes] = timeValue.split(':'); // Split the time value into hours and minutes

        // Set the hours and minutes of the date object
        date.setHours(parseInt(hours, 10) + (timeValue.includes('PM') ? 12 : 0));
        date.setMinutes(parseInt(minutes, 10));

        const formattedDate = date.toString(); // Get the string representation of the date
        const formattedDate22 = date // Get the string representation of the date

        console.log(formattedDate,'_____________formated_____');
        console.log(formattedDate22,'_____________formated2_____');
        // console.log(String(convertDates(formattedDate)),'_____________>???');
        setValue('end_time',formattedDate22);
      }
      // }

      setMergeOptions(
        [...Array(timeDataMerge.length)].map((item, index) => ({
          label: timeDataMerge[index],
          value: timeDataMerge[index],
        }))
      );

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues('scheduleDate'), takenTime, onsubmit, renderTime]);

  // console.log('formated', formattedTakenTime);
  // console.log('@@@@@', convertDates(getValues('scheduleTime')));

  // // console.log('@@time', renderTime);
  // console.log('@@Str--', tempStartTime);
  // console.log('@@@End--', tempEndTime);
  // console.log('@@@dur--', timeDuration);
  // console.log('@-@-@', renderTimesWithinInterval(tempStartTime, tempEndTime, timeDuration));

  // --------------------------------------------------------------

  const [getList] = useLazyQuery(TAKEN_TIME, {
    context: {
      requestTrackerId: 'appointments[QueryTakenTimeSlot]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [dataDate, setDataDate] = useState<any>();
  const [clinicData, setClinicData] = useState<any>();

  useEffect(() => {
    getList({
      variables: {
        data: {
          doctorID: Number(currentItem?.EMP_ID),
          date: new Date(dataDate),
          clinic: Number(clinicData),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryTakenTimeSlot } = data;
        const timeSlots = QueryTakenTimeSlot.map((item: any) => item.time_slot);
        setTakenTime(timeSlots);
        // setTakenTime(QueryTakenTimeSlot);
      }
    });
  }, [clinicData, currentItem?.EMP_ID, dataDate, getList, reset]);

  // console.log('@-@1', YMD(dataDate));

  // console.log('@##@@', convertDate(getValues('scheduleDate')));

  // console.log('@##@@', convertDates(getValues('scheduleTime')));

  useEffect(() => {
    if (getValues('type') === '1' && getValues('typeAgreement') === false) {
      confirm.onTrue();
    }
  }, [getValues('type'), getValues('typeAgree')]);

  const CalendarLegends = [
    { name: 'Selected', color: theme.palette.success.main },
    { name: 'Available', color: theme.palette.success.lighter },
    { name: 'Not Available', color: theme.palette.error.lighter },
  ];

  // const isDateDisabled = (date: Date) => {
  //   const day = date.getDay();

  //   // Check if the day is included in tempDays array
  //   if (!tempDays.includes(day)) {
  //     return true; // Disable if the day is not available
  //   }

  //   // Check if there are available time slots for the selected date
  //   const selectedDateString = date.toISOString().split('T')[0]; // Get selected date in format 'YYYY-MM-DD'
  //   const hasAvailableTimeSlots = resultTime.some((timeSlot) => {
  //     const [time] = timeSlot.split(' '); // Extract time part
  //     return time.includes(selectedDateString);
  //   });

  //   return hasAvailableTimeSlots; // Disable if there are no available time slots for the selected date
  // };

  const isDateDisabled = (date: Date) => {
    const day = date.getDay();

    return !tempDays.includes(day);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Card>
          <CardHeader title="SELECT LOCATION" />

          <Controller
            name="location"
            control={control}
            render={() => (
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ p: 3 }}
              >
                {currentItem?.clinicInfo?.map((item: any) => (
                  <AppointmentNewScheduleCard
                    key={item.id}
                    data={item}
                    checked={item.id === getValues('location')}
                    onChange={() => {
                      setValue('location', item?.id);
                      const clinicTypes =
                        item?.ClinicSchedInfo?.map((_) => _.type).flatMap((_) => [..._]) || [];
                      const uniqueClinicTypes = clinicTypes.reduce(
                        (accumulator: any, currentValue: any) => {
                          if (!accumulator.includes(currentValue)) {
                            accumulator.push(currentValue);
                          }
                          return accumulator;
                        },
                        []
                      );
                      setTempValue(uniqueClinicTypes);
                      setTempDays(
                        item?.ClinicSchedInfo?.map((_) => _.days).flatMap((_) => [..._]) || []
                      );

                      const sTimeList = item?.ClinicSchedInfo.map((g: any) => g.start_time);
                      const uniqueSTimeList = sTimeList.reduce(
                        (accumulator: any, currentValue: any) => {
                          if (!accumulator.includes(currentValue)) {
                            accumulator.push(currentValue);
                          }
                          return accumulator;
                        },
                        []
                      );

                      setTempStartTime(uniqueSTimeList);

                      const eTimeList = item?.ClinicSchedInfo.map((g: any) => g.end_time);
                      const uniqueETimeList = eTimeList.reduce(
                        (accumulator: any, currentValue: any) => {
                          if (!accumulator.includes(currentValue)) {
                            accumulator.push(currentValue);
                          }
                          return accumulator;
                        },
                        []
                      );
                      setTempEndTime(eTimeList);

                         setDuration(item?.ClinicSchedInfo.map((g: any) => {
                        if(g.time_interval === '0'){
                          return 'unlimited'
                        }else{
                          return g.time_interval
                        }
                      }));


                      // console.log('time s: ', item?.ClinicSchedInfo.map((item: any) => item.end_time);
                      // calculateMinutesBetweenTimes(item?.start_time, item?.end_time);
                    }}
                    // setTimeS={() => setTimeS()}
                  />
                ))}
              </Box>
            )}
          />
        </Card>

        {typeOptions && getValues('location') !== null && (
          <Card>
            <CardHeader title="SELECT APPOINTMENT TYPE" />

            <Stack alignItems="center" sx={{ p: 3 }}>
              <RHFRadioGroup
                name="type"
                row
                options={typeOptions && typeOptions}
                sx={{
                  '& .MuiFormControlLabel-root': { mr: 4 },
                }}
              />
              {getValues('type') === '1' && (
                <RHFSwitch
                  name="typeAgreement"
                  label="I read and agree to the Terms and Conditions for telemedecine appointment."
                />
              )}
            </Stack>
          </Card>
        )}

        {((getValues('type') === '1' && getValues('typeAgreement') === true) ||
          getValues('type') === '2') && (
          <Card>
            <CardHeader title="SELECT DATE & TIME" />

            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ p: 2 }}
            >
              <Stack>
                <Controller
                  name="scheduleDate"
                  control={control}
                  render={({ field }: CustomRenderInterface) => (
                    <StaticDatePicker<Date>
                      value={field.value}
                      shouldDisableDate={isDateDisabled}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        setClinicData(getValues('location'));
                        setDataDate(getValues('scheduleDate'));
                        setRenderTime(
                          renderTimesWithinInterval(tempStartTime, tempEndTime, timeDuration, formattedTakenTime)
                        );
                      }}
                      slotProps={{
                        actionBar: {
                          sx: { display: 'none' },
                        },
                      }}
                      disablePast
                      sx={{
                        '.MuiDateCalendar-root': {
                          '.MuiDayCalendar-weekContainer': {
                            '.MuiButtonBase-root': {
                              backgroundColor: theme.palette.success.lighter,
                              [`&.Mui-selected`]: {
                                backgroundColor: theme.palette.success.main,
                                color: theme.palette.common.white,
                              },
                              [`&.Mui-disabled`]: {
                                backgroundColor: theme.palette.error.lighter,
                              },
                              '&:before': {
                                backgroundColor: theme.palette.info,
                                pointerEvents: 'none', // Prevent interaction with these days
                              },
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={3}
                  sx={{ px: { md: 5, xs: 0 } }}
                >
                  {CalendarLegends.map((item) => (
                    <Stack key={item.name} direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color,
                        }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {getValues('scheduleDate') !== null && resultTime.length !== 0 ? (
                // <Stack alignItems="center" sx={{ pt: 5, px: 5, width: '550px' }}>
                //   <RHFRadioGroup
                //     name="scheduleTime"
                //     row
                //     options={timeOptions && timeOptions}
                //     sx={{
                //       '& .MuiFormControlLabel-root': { m: 0.3 },
                //     }}
                //   />
                // </Stack>
                <Controller
                  name="scheduleTime"
                  control={control}
                  render={({ field }: any) => {
                    const onChange = (value: any) => {
                      setValue('scheduleTime', value);
                    };

                    return (
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
                          SELECT TIME SLOT
                        </Typography>
                        <Box
                          sx={{
                            WebkitColumnCount: 2,
                            MozColumnCount: 2,
                            columnCount: 2,
                            display:'flex',
                            flexDirection:'column'
                          }}
                        >
                          {timeOptions?.map((item: any) => (
                            <Stack key={item.label} direction="row" alignItems="center" spacing={2}>
                              <Checkbox
                                checked={field.value === item.value}
                                onChange={() => onChange(item.value)}
                              />
                              <Typography variant="body2">{item.label}</Typography>
                            </Stack>
                          ))}


                            {mergeOptions?.length !== 0 && <>
                              <Typography variant="subtitle1" sx={{ color: 'text.disabled', my:2 }}>
                                Open Schedule
                              </Typography>

                                {mergeOptions?.map((item:any)=>(
                                  <Stack key={item.label} direction="row" alignItems="center" spacing={2}>
                                  <Checkbox
                                    checked={field.value === item.value}
                                    onChange={() => onChange(item.value)}
                                  />
                                  <Typography variant="body2">{item.label}</Typography>
                                </Stack>
                                ))}
                            </>}
                         

                          
                        </Box>
                      </Stack>
                    );
                  }}
                />
              ) : (
                <Stack>
                  <EmptyContent title="No available time slot" />
                </Stack>
              )}

              {/* {getValues('scheduleDate') !== null && (
                <Controller
                filteredTimes.length === 0
                  name="scheduleTime"
                  control={control}
                  render={({ field }: CustomRenderInterface) => (
                    <StaticTimePicker
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        actionBar: {
                          sx: { display: 'none' },
                        },
                      }}
                    />
                  )}
                />
              )} */}
            </Box>
          </Card>
        )}

        {getValues('scheduleTime') !== null && (
          <>
            <AppointmentNewOthers values={values} hmoData={hmoData} />

            <Stack
              spacing={3}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center">
                <RHFSwitch name="agreement" label="I read and agree to the" />
                <Button
                  onClick={() => {
                    confirmAggreement.onTrue();
                  }}
                  sx={{
                    textDecoration: 'underline',
                  }}
                >
                  Data Privacy Policy.
                </Button>
              </Stack>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Book Now
              </LoadingButton>
            </Stack>
          </>
        )}
      </Stack>

      {/* dialog for consent letters */}

      {/* type */}
      <ConsentDialog
        viewMore={ConsentData()[0]?.linkFile}
        open={confirm.value}
        onClose={confirm.onFalse}
        title={ConsentData()[0]?.title}
        content={ConsentData()[0]?.body}
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setValue('type', '1');
              // setValue('typeAgree', 1);
              setValue('typeAgreement', true);
              confirm.onFalse();
            }}
          >
            Agree
          </Button>
        }
      />

      {/* agreement */}
      <ConsentDialog
        viewMore={ConsentData()[1]?.linkFile}
        open={confirmAggreement.value}
        onClose={() => {
          confirmAggreement.onFalse();
          setValue('agreement', false);
        }}
        title={ConsentData()[1]?.title}
        content={ConsentData()[1]?.body}
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              // setValue('typeAgree', 1);
              if (getValues('agreement') === false) {
                setValue('agreement', true);
              }
              confirmAggreement.onFalse();
            }}
          >
            Agree
          </Button>
        }
      />
    </FormProvider>
  );
}

function ConsentData() {
  return [
    {
      id: 1,
      title: 'Telemedicine Consultation Consent Form for Patients(Consent for Videoconferencing)',
      linkFile:
        'https://natrapharm.hips-md.com/Consent%20Form%20for%20Patients%20for%20videoconferencing%20NTP%20HIP%20final%200625.pdf',
      body: '1. I understand the concept of Telemedicine as the delivery of health care services, where distance is a critical factor, by health care professions using information and communication technologies for the exchange of valid information for diagnosis, treatment, and prevention of disease and injuries, among others. Telemedicine consultations involve a live two-way audio and video conferencing, patient pictures, medical images, patient’s medical records and other things that may be pertinent to the consultation.',
    },
    {
      id: 2,
      title: 'Terms and Conditions of Use',
      linkFile:
        'https://natrapharm.hips-md.com/Terms%20and%20Conditions%20of%20Use%20NTP%20HIP%20Final%200625.pdf',
      body: 'This Terms and Conditions of Use ("Terms") sets forth the terms and conditions governing your use of the HIPS, which is offered by HIP, Inc. This Terms form a legal contract between you and HIP and govern your access to and use of the HIPS. Please read the Terms and Privacy Policy carefully before using the Service. By clicking "I ACCEPT", you are acknowledging that you have read and understood this Terms and are entering into a legally binding agreement just as you would by signing a paper contract. If you do not agree to this Terms, you are not authorized to use HIPS.',
    },
  ];
}

// function convertTo24HourFormat(timeString: any) {
//   // Create a Date object and set the time from the input string
//   const dateObj = new Date(`2000-01-01 ${timeString}`);

//   // Get the hours, minutes, and seconds in 24-hour format
//   const hours24 = dateObj.getHours();
//   const minutes = dateObj.getMinutes();
//   const seconds = dateObj.getSeconds();

//   // Format the result as "HH:mm:ss"
//   const formattedTime = `${hours24.toString().padStart(2, '0')}:${minutes
//     .toString()
//     .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//   return formattedTime;
// }

// function convertTo24HourFormat(timeString: any) {
//   // Create a Date object and set the time from the input string
//   const dateObj = new Date(`2000-01-01 ${timeString}`);

//   // Get the hours, minutes, and seconds in 24-hour format
//   const hours24 = dateObj.getHours();
//   const minutes = dateObj.getMinutes();
//   const seconds = dateObj.getSeconds();

//   // Format the result as "HH:mm:ss"
//   const formattedTime = `${hours24.toString().padStart(2, '0')}:${minutes
//     .toString()
//     .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//   return formattedTime;
// }

function convertDates(inputTimeString: any) {
  if (!inputTimeString) {
    return null;
  }
  const [time, ampm] = inputTimeString.split(' ');

  // Split the time into hours and minutes
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  // Convert to 24-hour format
  let hours24 = hours;
  if (ampm === 'PM' && hours !== 12) {
    hours24 += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours24 = 0;
  }

  // Create a new Date object and set the hours and minutes
  const currentDate = new Date();
  currentDate.setHours(hours24, minutes, 0, 0);

  // Format the result as a custom date string with the desired time zone
  const options: any = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };

  const formattedDate = currentDate.toLocaleString('en-US', options);

  return formattedDate;
}

function convertDate(inputDateString: any) {
  // Create a Date object from the input date string
  const date = new Date(inputDateString);

  // Extract the date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  const Formatdate = new Date(formattedDate);

  return Formatdate;
}
