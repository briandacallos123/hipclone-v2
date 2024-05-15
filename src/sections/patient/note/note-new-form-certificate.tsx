import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, FieldValues, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { POST_MED_CERT } from '@/libs/gqls/notes/noteMedCert';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// _mock
import { _patientList, _hospitals } from 'src/_mock';
// components
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';
import { useSessionStorage } from '@/hooks/use-sessionStorage';

// ----------------------------------------------------------------------

const TypographyStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  '& > span': {
    color: theme.palette.primary.main,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  refIds: any;
  refetch: any;
};

export default function NoteNewFormCertificate({ onClose, refIds, refetch: onRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const { getItem } = useSessionStorage();
  const params = useParams();
  const [barringDays, setBarringDays] = useState<any>();
  // const { id } = params;

  // const currentItem = _patientList.filter((item) => item.id === id)[0];
  // console.log('certificate: ', refIds?.FNAME);
  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required'),

    patientType: Yup.number().required('Patient Type is required'),

    date: Yup.date()
      .required('Date is required')
      .default(() => new Date()),

    startDate: Yup.date()
      .required('Start Date is required')
      .default(() => new Date()),

    endDate: Yup.date()
      .required('End Date is required')
      .default(() => new Date()),

    diagnosis: Yup.string().required('Diagnosis is required'),

    day: Yup.number()
      .required('Day is required')
      .integer('Day must be an integer')
      .min(0, 'Day must be greater than or equal to 0'),

    recommendation: Yup.string().required('Recommendation is required'),
  });
  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);
  const [clinicData, setclinicData] = useState<any>([]);

  useEffect(() => {
    drClinicFetch().then((result: any) => {
      const { data } = result;
      if (data) {
        const { doctorClinics } = data;
        setclinicData(doctorClinics);
      }
    });
    return () => drClinicFetch();
  }, []);

  const defaultValues = useMemo(
    () => ({
      hospitalId: null,
      patientType: 1,
      date: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      diagnosis: '',
      day: 0,
      recommendation: '',
    }),
    []
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewNoteSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id));
    }
  }, []);

  // console.log(values);
  const [createMedCert] = useMutation(POST_MED_CERT);
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NotesMedCertInputType'] = {
        clinic: Number(model.hospitalId),
        patientID: Number(refIds?.S_ID),

        R_TYPE: String(9),
        dateCreated: String(formatDate(model.date)),
        InOutPatient: Number(model.patientType),
        s_date: String(formatDate(model.startDate)),
        e_date: String(formatDate(model.endDate)),
        diagnosis: String(model.diagnosis),
        barring: String(model.day),
        remarks: String(model.recommendation),
        // CLINIC
        // patientID
        // R_TYPE
        // dateCreated
        // InOutPatient
        // s_date
        // e_date
        // diagnosis
        // barring
        // remarks
      };
      createMedCert({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
          // refetch();
          reset();
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          // console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createMedCert, enqueueSnackbar, refIds?.S_ID, reset, snackKey]
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

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        // await handleSubmitValue({
        //   ...data,
        // });
        // reset();
        // enqueueSnackbar('Saving!');
        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesLab',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);

        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose, reset]
  );

  const formatDate = (inputDate: any) => {
    const date = new Date(inputDate);

    // Get year, month, and day components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1 and pad with 0 if necessary
    const day = date.getDate().toString().padStart(2, '0');

    // Combine the components into the desired format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  useEffect(() => {
    const sDate = new Date(values.startDate);
    const eDate = new Date(values.endDate);

    // Calculate the time difference in milliseconds
    // const timeDiff = endDate - startDate;
    const timeDifference = eDate.getTime() - sDate.getTime();

    // Calculate the number of days by dividing milliseconds by milliseconds per day
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24) + 1);
    // console.log('1', startDate);
    // console.log('2', endDate);
    // console.log('gg', daysDifference);
    // return daysDifference;

    setValue('day', daysDifference);
    setBarringDays(daysDifference);
  }, [setValue, values.endDate, values.startDate]);

  return (
    <>
      <DialogContent sx={{ py: 3, bgcolor: 'background.neutral' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFAutocomplete
              name="hospitalId"
              label="Hospital/Clinic"
              options={clinicData.map((hospital: any) => hospital.id)}
              getOptionLabel={(option) =>
                clinicData.find((hospital: any) => hospital.id === option)?.clinic_name
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, clinic_name } = clinicData.filter(
                  (hospital: any) => hospital.id === option
                )[0];

                if (!id) {
                  return null;
                }

                return (
                  <li {...props} key={id}>
                    {clinic_name}
                  </li>
                );
              }}
              sx={{ pt: 1 }}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              alignItems="center"
            >
              <RHFRadioGroup
                name="patientType"
                options={[
                  { label: 'In-Patient', value: 1 },
                  { label: 'Out-Patient', value: 2 },
                ]}
                row
                sx={{
                  '& .MuiFormControlLabel-root': { mr: { xs: 2, lg: 4 } },
                }}
              />

              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                  <DatePicker
                    label="Date"
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
            </Box>

            <div>
              <TypographyStyle gutterBottom>
                This is to certify that
                <span>
                  {`${refIds?.FNAME} ${refIds?.LNAME}, ${refIds?.AGE || 'uspecified'} yr(s) old, `}
                  {/* {` ${currentItem.patient.firstName} ${currentItem.patient.lastName}, ${currentItem.patient.age} yr(s) old, `} */}
                </span>
                was examined and treated on
              </TypographyStyle>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <DatePicker
                      label="Start Date"
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
                  name="endDate"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <DatePicker
                      label="End Date"
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
              </Box>
            </div>

            <div>
              <TypographyStyle gutterBottom>
                With the following findings / diagnosis:
              </TypographyStyle>
              <RHFTextField name="diagnosis" label="Finding/Diagnosis" multiline rows={3} />
            </div>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: '1fr 3fr',
              }}
              alignItems="center"
            >
              <RHFTextField
                size="small"
                type="number"
                name="day"
                label="Number of Days"
                value={barringDays}
              />
              <TypographyStyle>
                And would need medical attention for days barring complications.
              </TypographyStyle>
            </Box>

            <RHFTextField
              name="recommendation"
              label="Further Recommendations"
              multiline
              rows={3}
            />

            <Alert severity="error">
              <Typography sx={{ typography: 'body2', '& > span': { typography: 'subtitle2' } }}>
                <span>Disclaimer:</span>&nbsp; This document shall not be copied, modified or
                reproduced in any way without the express written permission of the issuing party.
                This document shall not be used for Medicolegal purposes.
              </Typography>
            </Alert>
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
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
