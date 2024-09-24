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
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { POST_MED_CLER, UpdateNotesCler } from 'src/libs/gqls/notes/notesMedClear';
// _mock
import { _patientList, _hospitals } from 'src/_mock';
// components
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSessionStorage } from '@/hooks/use-sessionStorage'
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
  editData?:any;
};

export default function NoteNewFormClearance({editData, onClose, refIds, refetch: onRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isEdit, setIsEdit] = useState(editData);

  const {getItem} = useSessionStorage()
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

  const params = useParams();

  // const { id } = params;

  // const currentItem = _patientList.filter((item) => item.id === id)[0];

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required'),

    date: Yup.date()
      .required('Date is required')
      .default(() => new Date()),

    dateExamined: Yup.date()
      .required('Date Examined is required')
      .default(() => new Date()),

    remark: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      hospitalId: Number(editData?.clinicInfo?.id) || null,
      date: editData?.dateCreated && new Date(editData?.dateCreated) || new Date(),
      dateExamined:editData?.dateCreated?.dateExamined && new Date(editData?.dateCreated?.dateExamined) || new Date(),
      remark: editData?.remarks || '',
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

  useEffect(()=>{
    const data = getItem('defaultFilters');
   if(data?.clinic){
     setValue('hospitalId',Number(data?.clinic?.id))
   }
   },[])


  const [createNotesText] = useMutation(POST_MED_CLER);
  const [UpdateNotesText] = useMutation(UpdateNotesCler);

  

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NotesMedClerInputType'] = {
        clinic: Number(model.hospitalId),
        patientID: Number(refIds?.S_ID),
        R_TYPE: String(8),
        dateCreated: String(formatDate(model.date)),
        dateExamined: String(formatDate(model.dateExamined)),
        remarks: String(model.remark),
        medical_ID:isEdit && Number(isEdit?.id),
        recordID:isEdit && Number(isEdit?.R_ID)
      };
     (isEdit? UpdateNotesText: createNotesText)({
        variables: {
          data,
        },
      })
        .then(async () => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar(editData ? "Updated Successfully":"Create success!");
          // refetch();
          reset();
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createNotesText, enqueueSnackbar, refIds, reset,isEdit, snackKey]
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
        // enqueueSnackbar('Saving!');

        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesCler',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        // reset();
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
              options={clinicData.map((hospital: any) => Number(hospital.id))}
              getOptionLabel={(option) =>
                clinicData.find((hospital: any) => Number(hospital.id) === Number(option))?.clinic_name
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
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

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
                was seen and examined on
              </TypographyStyle>

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
                <Controller
                  name="dateExamined"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <DatePicker
                      label="Date Examined"
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
                <TypographyStyle>And is clear to perform his/her duties.</TypographyStyle>
              </Box>
            </div>

            <RHFTextField name="remark" label="Remarks" multiline rows={3} />

            <Alert severity="error">
              <Typography sx={{ typography: 'body2', '& > span': { typography: 'subtitle2' } }}>
                <span>Disclaimer:</span>&nbsp; This document shall be not copied, modified or
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
          reset()
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
