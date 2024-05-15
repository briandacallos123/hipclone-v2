import { useMemo, useCallback, useEffect, useState } from 'react';
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
import { styled, lighten, darken } from '@mui/material/styles';
// _mock
import { _hospitals } from 'src/_mock';
// types
import { IImagingItem } from 'src/types/document';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '@/auth/hooks';
import { emr_mutation_lab_report } from '@/libs/gqls/labreport_emr_patient';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// import { Get_payment_procedures_category_data } from 'src/libs/gqls/paymentProcedures';
import { get_Allprocedure } from 'src/libs/gqls/payProcedure';
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

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

interface FormValuesProps extends Omit<IImagingItem, 'hospitalId' | 'resultdate' | 'attachment'> {
  hospitalId: string | null;
  resultdate: Date | null;
  // attachment: (CustomFile | string)[];
  attachment: any;
}

type Props = {
  onClose: VoidFunction;
  data?: any;
  setRefetch?: any;
  setLoading?: any;
  isLoading?: any;
};
const REQUEST_OPTIONS: any[] = [];
export default function EmrImagingNewForm({setLoading, isLoading,setRefetch, onClose, data: data1 }: Props) {
  // console.log(data1, 'data1');

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

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewImagingSchema = Yup.object().shape({
    hospitalId: Yup.number().required(),
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
      type: null,
      attachment: [] || null,
    }),
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewImagingSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [uploadData] = useMutation(emr_mutation_lab_report, {
    context: {
      requestTrackerId: 'emr_mutation_lab_report[emr_lab_report_request]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['emr_lab_report_request']) => {
      const data: NexusGenInputs['emr_lab_report_request'] = {
        // email: model.email,
        emrPatientID: data1?.id || null,
        doctorID: Number(data1?.doctorInfo?.EMP_ID) || null,
        isEMR: 1,
        patient: String(data1?.idno) || null,
        doctor: String(data1?.doctorInfo?.EMPID) || null,
        clinic: model.clinic,
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
          setRefetch(true)
          
          // reInitialize();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading(false)

          // runCatch();
        });
    },
    [snackKey]
  );

  const values = watch();

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

  //

  //

  //
  // const REQUEST_OPTIONS: any = [];
  // const [category, setCategory] = useState<string>(
  //   REQUEST_OPTIONS.length > 0 ? REQUEST_OPTIONS[0].group : ''
  // );
  // procedureData.forEach((procedure) => {
  //   const category1 = procedure.payment_procedures?.name || 'Other';
  //   const item = {
  //     id: procedure.id,
  //     name: procedure.name,
  //   };

  //   const existingCategory = REQUEST_OPTIONS.find((option: any) => option.group === category);

  //   if (existingCategory) {
  //     existingCategory.items.push(item);
  //   } else {
  //     REQUEST_OPTIONS.push({ group: category1, items: [item] });
  //   }
  // });
  //

  const {
    data: getData,
    error: getError,
    loading: getLoad,
    refetch: procedureFetch,
  }: any = useQuery(get_Allprocedure);

  const [procedureData, setProcedureData] = useState<any>([]);

  useEffect(() => {
    if (getData) {
      const { QueryAllPayProcedure } = getData;
      setProcedureData(QueryAllPayProcedure);
    }
  }, [getData]);

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
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

              {/* <RHFAutocomplete
                name="type"
                label="Type"
                options={procedureData.map((prod: any) => prod.payment_procedures?.id)} // Use category IDs as options
                getOptionLabel={(option) =>
                  procedureData.find((item: any) => item.payment_procedures?.id === option)
                    ?.payment_procedures.name
                }
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const category = procedureData.find(
                    (item: any) => item.payment_procedures.id === option
                  );

                  return (
                    <>
                      <GroupHeader>{category.payment_procedures.name}</GroupHeader>
                      {procedureData
                        .filter((item: any) => item.payment_procedures.id === option)
                        .map((item: any) => (
                          <GroupItems key={item.id}>{item.name}</GroupItems>
                        ))}
                    </>
                  );
                }}
                sx={{ pt: 1 }}
              /> */}
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
                  render={({ field, fieldState: { error } } : CustomRenderInterface) => (
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
              accept={{ 'application/pdf': [], 'image/png': [], 'image/jpg': [], 'image/jpeg': [] }} 
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
          // loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
