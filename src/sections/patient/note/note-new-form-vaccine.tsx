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
import { DeleteNotesVacc, POST_NOTE_VACC, UpdateNotesVacc } from '@/libs/gqls/notes/noteVaccine';
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

const RADIO_OPTIONS = [
  {
    label: 'I have throughly explained the risk and benefits of COVID-19 vaccination.',
    value: '0',
  },
  {
    label: `Based on evaluation done on date of certification, the patient can't receive COVID-19 vaccine.`,
    value: '1',
  },
  {
    label: `Parent/Legal Guardian is aware that the treatment will still be subjected to health screening at the vaccination site, and that if symptoms arise, re-evaluation is necessary prior to vaccination.`,
    value: '2',
  },
];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  refIds: any;
  refetch: any;
  editData?:any;
};

export default function NoteNewFormVaccine({editData:editRow, onClose, refIds, refetch: onRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [editData, setEditData] = useState(editRow)
  const { getItem } = useSessionStorage();
  // console.log('@@refetch', onRefetch);
  const params = useParams();



  // const { id } = params;

  // const currentItem = _patientList.filter((item) => item.id === id)[0];

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required'),

    patientType: Yup.string().required('Patient Type is required'),

    date: Yup.date()
      .required('Date is required')
      .default(() => new Date()),

    diagnosis: Yup.string().required('Diagnosis is required'),

    option: Yup.string().required('Option is required'),
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
      hospitalId: editData?.clinic || null,
      patientType: editData?.InOutPatient || '0',
      date: editData?.dateCreated && new Date(editData?.dateCreated) || new Date(),
      diagnosis:editData?.diagnosis || '',
      option: editData?.eval || '0',
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
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const manualReset = ()=>{
    setValue('hospitalId',null)
    setValue('patientType','0')
    setValue('date',new Date())
    setValue('diagnosis','')
    setValue('option','0')

    // hospitalId: editData?.clinic || null,
    // patientType: editData?.InOutPatient || '0',
    // date: editData?.dateCreated && new Date(editData?.dateCreated) || new Date(),
    // diagnosis:editData?.diagnosis || '',
    // option: editData?.eval || '0',
  }
  
  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id));
    }
  }, []);

  const [createNoteVacc] = useMutation(POST_NOTE_VACC);
  const [updateNoteVacc] = useMutation(UpdateNotesVacc);

  
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NotesPedCertObjInputType'] = {
        clinic: Number(model.hospitalId),
        patientID: Number(refIds?.S_ID),

        R_TYPE: String(11),
        dateCreated: String(formatDate(model.date)),
        InOutPatient: Number(model.patientType),
        diagnosis: String(model.diagnosis),
        eval: String(model.option),
        pedia_id:editData && Number(editData?.id),
        R_ID:editData && Number(editData?.R_ID)
      };
     (editData ?updateNoteVacc: createNoteVacc)({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar(editData ? "Update Success!":'Create Success!');

          // reset();
          manualReset()
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar(error?.message, { variant: 'error' });
        });
    },
    [createNoteVacc, enqueueSnackbar, refIds?.S_ID, reset, snackKey]
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
        onClose();

        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesVacc',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        // await handleSubmitValue({
        //   ...data,
        // });

        // enqueueSnackbar('saving!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose]
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
                  { label: 'In-Patient', value: '0' },
                  { label: 'Out-Patient', value: '1' },
                  { label: 'Vaccination', value: '3' },
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
                {/* <span>
                  {` ${currentItem.patient.firstName} ${currentItem.patient.lastName}, ${currentItem.patient.age} yr(s) old, `}
                </span>
                from
                <span>{` ${currentItem.patient.address}, `}</span> */}
                <span>
                  {`${refIds?.FNAME} ${refIds?.LNAME}, ${refIds?.AGE || 'uspecified'} yr(s) old, `}
                  {/* {` ${currentItem.patient.firstName} ${currentItem.patient.lastName}, ${currentItem.patient.age} yr(s) old, `} */}
                </span>
                is diagnosed of
              </TypographyStyle>

              <RHFTextField name="diagnosis" label="Finding/Diagnosis" multiline rows={3} />
            </div>

            <RHFRadioGroup
              name="option"
              options={RADIO_OPTIONS}
              sx={{
                '& .MuiFormControlLabel-root': { mb: { xs: 2, lg: 0 } },
              }}
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
        <Button variant="outlined" onClick={()=>{
          onClose();
          manualReset()
        }}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {editData ? "Update":"Create"}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
