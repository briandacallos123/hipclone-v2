import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { IImagingItem } from 'src/types/document';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '@/auth/hooks';
import { mutation_lab_report } from '@/libs/gqls/labreport_patient';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { YMD } from 'src/utils/format-time';
import { TYPE_OPTIONS } from '@/sections/patient/imaging/type_option';
//

// ----------------------------------------------------------------------

// const TYPE_OPTIONS = [
//   {
//     group: 'Audio',
//     classify: ['Audiometry', 'Auscultation (any organ)', 'Tympanometry', 'Audio - Others'],
//   },
//   { group: 'Biopsy', classify: ['Biopsy', 'Biopsy - Others'] },
//   { group: 'Blood Tests', classify: ['Blood Tests', 'Blood Test - Others'] },
//   {
//     group: 'Gastroenterology/Hepatology',
//     classify: ['Liver Fibroscan', 'Liver Shearwave Elastography', 'Gastroenterology - Others'],
//   },
//   {
//     group: 'Heart Station',
//     classify: [
//       'Cardiac Catheterization',
//       'Echocardiography',
//       'Echocardiography w/ Doppler',
//       'Electrocardiography (ECG)',
//       'Holter Monitoring',
//       'Impedance Cardiography (ICG)',
//       'Stress Echocardiography',
//       'Treadmill Exercise Test',
//       'Treadmill Stress Echo',
//       'Treadmill Stress Test',
//       'Heart Station - Others',
//     ],
//   },
// ];

// ----------------------------------------------------------------------

interface FormValuesProps
  extends Omit<IImagingItem, 'hospitalId' | 'startDate' | 'endDate' | 'attachment'> {
  hospitalId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  // attachment: (CustomFile | string)[];
  attachment: any;
}

type Props = {
  onClose: VoidFunction;
  setRefetch: any;
  isLoading: any;
  setLoading: any;
};

export default function ProfileImagingNewForm({isLoading, setLoading, onClose, setRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const NewImagingSchema = Yup.object().shape({
    type: Yup.mixed().required(),
    resultdate: Yup.date().required(),
    remark: Yup.string().required(),
    labName: Yup.string().required(),
    attachment: Yup.array().test(     // validation
      'conditional-validation',
      'At least one attachment is required',
      function (value) {
        if (!Array.isArray(value) || value.length === 0) {
          return this.createError({
            path: 'attachment',
            message: 'At least one attachment is required',
          });
        }

        return true;
      }
    ),
  });

  const defaultValues = useMemo(
    () => ({
      hospitalId: null, // clinic name
      resultdate: new Date(),
      remark: '',
      type: '',
      attachment: [] || null,
    }),
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewImagingSchema),
    defaultValues,
  });

  // const [submitting, setSubmitting] = useState(false);

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const [uploadData] = useMutation(mutation_lab_report, {
    context: {
      requestTrackerId: 'mutation_lab_report[lab_report_request]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['lab_report_request']) => {
      const data: NexusGenInputs['lab_report_request'] = {
        // email: model.email,
        patientID: Number(user?.s_id) || null,
        doctorID: null,
        isEMR: 0,
        patient: String(user?.patientIDNO) || null,
        doctor: null,
        clinic: null,
        type: model.type,
        resultDate: YMD(model.resultDate),
        labName: model.labName,
        remarks: model.remarks,
      };
      uploadData({
        variables: {
          data,
          file: model?.attachment,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Create Lab Report successfully!');
          setLoading(false)
          setRefetch(true);
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading(false)
        });
    },
    [snackKey]
  );

  // console.log(values);

  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          type: values?.type,
          clinic: values?.hospitalId,
          resultDate: YMD(values?.resultdate),
          labName: values?.labName,
          remarks: values?.remark,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {

      setLoading(true)

      try {
        const snackbarKey: any = enqueueSnackbar('Creating Data...', {
          variant: 'info',
          key: 'creatinglabreport',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.attachment || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('attachment', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.attachment]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
      setValue('attachment', filtered);
    },
    [setValue, values.attachment]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('attachment', []);
  }, [setValue]);

  // const options = TYPE_OPTIONS.reduce((acc, item) => {
  //   acc.push(...item.classify.map(classification => classification.name));
  //   return acc;
  // }, []);

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>

          <RHFAutocomplete
                name="type"
                label="Type"
                options={TYPE_OPTIONS.flatMap((group) => [
                  {
                    isGroup: true,
                    group: group.group,
                  },
                  ...group.classify.map((i) => i.name),
                ])}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option} // Display only the name in the input field
                isOptionEqualToValue={(option, value) => option === value} // Compare based on the name property
                renderOption={(props, option) => {
                  if (option.isGroup) {
                    return null; // Hide the group
                  }

                  return (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  );
                }}
                sx={{ pt: 1 }}
              />
            {/* <RHFSelect native name="type" label="Type" InputLabelProps={{ shrink: true }}>
              {TYPE_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </RHFSelect> */}

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="labName" label="Laboratory Name" />

              <Box>
                <Controller
                  name="resultdate"
                  control={control}
                  render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                    <DatePicker
                      label="Result Date"
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

                {/* <Controller
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
                /> */}
              </Box>
            </Box>

            <RHFTextField name="remark" label="Remarks" multiline rows={3} />

            <RHFUpload
              multiple
              thumbnail
              accept={{ 'application/pdf': [], 'image/png': [], 'image/jpg': [], 'image/jpeg': [] }}  // only pdf & img
              name="attachment"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              // onUpload={() => console.info('ON UPLOAD')}
            />
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
          // loading={submitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
