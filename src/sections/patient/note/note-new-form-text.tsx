import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, FieldValues, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { POST_NOTES_TXT } from 'src/libs/gqls/notes/notesTxt';
// _mock
import { _hospitals } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from 'src/components/hook-form';
//
import { useSessionStorage } from '@/hooks/use-sessionStorage';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  refIds: any;
  refetch: any;
};

export default function NoteNewFormText({ onClose, refIds, refetch: onRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const { getItem } = useSessionStorage();
  // console.log('refIds', refIds.patientInfo?.S_ID);
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

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required'),
    title: Yup.string().trim().required('Title is required'),
    date: Yup.date()
      .required('Date is required')
      .default(() => new Date()),
    remark: Yup.string().trim(),
    attachments: Yup.array()
      .required('At least one attachment is required')
      .test('is-array', 'At least one attachment is required', function (value) {
        return Array.isArray(value) && value.length > 0;
      }),
  });
  // patient
  const defaultValues = useMemo(
    () => ({
      hospitalId: null,
      title: '',
      date: new Date(),
      remark: '',
      attachments: [],
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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id));
    }
  }, []);

  const values = watch();
  const [createNotesText] = useMutation(POST_NOTES_TXT);

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NoteTxtInputType'] = {
        CLINIC: Number(model.hospitalId),
        patientID: Number(refIds.patientInfo?.S_ID),
        R_TYPE: String(4),
        dateCreated: String(formatDate(model.date)),
        title: String(model.title),
        text_data: String(model.remark),
      };
      createNotesText({
        variables: {
          data,
          file: model?.attachments,
        },
      })
        .then(async () => {
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
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [refIds, createNotesText, enqueueSnackbar, reset, snackKey]
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
        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesTXT',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        // await handleSubmitValue({
        //   ...data,
        //   uuid: String(id),
        // });
        reset();
        // onClose();
        // enqueueSnackbar('Saving!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose, reset]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.attachments || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('attachments', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.attachments]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.attachments && values.attachments?.filter((file: any) => file !== inputFile);
      setValue('attachments', filtered);
    },
    [setValue, values.attachments]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('attachments', []);
  }, [setValue]);

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
            >
              <RHFTextField name="title" label="Title" />

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

            <RHFTextField name="remark" label="Text/Note" multiline rows={3} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Attachments</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="attachments"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
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
