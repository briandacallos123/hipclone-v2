import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, useFieldArray, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// _mock
import { _hospitals } from 'src/_mock';
// types
import { IPrescriptionItem } from 'src/types/prescription';
// components
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { NexusGenInputs } from 'generated/nexus-typegen';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useMutation } from '@apollo/client';
import { MutationPrescription, MutationPrescriptionChild } from '@/libs/gqls/prescription';
import { useAuthContext } from '@/auth/hooks';
import { useParams } from 'src/routes/hook';
import { useContextData as patientContextData } from '../patient/@view/patient-details-view';
import { useContextData as emrContextData } from '../emr/@view/emr-details-view';
import { useSessionStorage } from '@/hooks/use-sessionStorage';
//

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IPrescriptionItem, 'hospitalId' | 'upDate'> {
  hospitalId: string | null;
  upDate: Date | null;
}

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  clinic?: any;
  queryData?: any;
  SubmitClient?: any;
  tempId?: any;
  runCatch?: any;
  onCloseView?: any;
  refetch?: any;
};

export default function PrescriptionNewEditForm({
  queryData,
  clinic,
  currentItem,
  onClose,
  SubmitClient,
  tempId,
  onCloseView,
  refetch,
  runCatch,
}: Props) {
  const { getItem } = useSessionStorage();
  const { fetchCover, setfetchCover }: any = patientContextData();
  const { emrfetchCover }: any = emrContextData();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [childId, setChildId] = useState(null);
  const { user } = useAuthContext();
  const { id } = useParams();
  const [createEmr] = useMutation(MutationPrescription, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log(clinic,'CLINICCCCCCCC')

  const [createPrescriptionChild] = useMutation(MutationPrescriptionChild);

  const NewPrescriptionSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        MEDICINE: Yup.string().required('Medicine is required'),
        MED_BRAND: Yup.string().required('Medicine Brand is required'),
        DOSE: Yup.string().required('Dose is required'),
        FORM: Yup.string().required('Form is required'),
        QUANTITY: Yup.string().required('Quantity is required'),
        FREQUENCY: Yup.string().required('Frequency is required'),
        DURATION: Yup.string().required('Duration is required'),
      })
    ),
    hospitalId: Yup.string().required('Clinic Id is required'),
  });

  const cDate = currentItem && new Date(Number(currentItem?.DATE));

  // let myChild = [...currentItem?.prescriptions_child].reverse();
  let newArray = currentItem && [...currentItem?.prescriptions_child];
  const defaultValues = useMemo(
    () => ({
      hospitalId: null,
      items: (currentItem && newArray.reverse()) ?? [
        {
          MEDICINE: '',
          MED_BRAND: '',
          DOSE: '',
          FORM: '',
          QUANTITY: '',
          FREQUENCY: '',
          DURATION: '',
        },
      ],
      upDate: cDate ?? new Date(),
      REMARKS: (currentItem && currentItem?.REMARKS) ?? '',
      patientID: (currentItem && currentItem?.patientID) ?? '',
      // isEMR: currentItem && currentItem?.patient?.isEMR,
      doctorID: (currentItem && currentItem?.doctorInfo?.EMP_ID) || String(user?.id),
      DOCTOR: (currentItem && currentItem?.DOCTOR) || String(user?.doctorId),
      emrId: id,
      isEmr: null,
      PATIENTEMR: null,
      tempId,
      CLINIC: currentItem && currentItem?.clinicInfo?.id,
    }),
    [currentItem && currentItem, tempId]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewPrescriptionSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id));
    }
  }, []);

  useEffect(() => {
    if (values?.hospitalId) {
      const id = clinic?.find((i) => i.clinic_name === values?.hospitalId);

      setValue('CLINIC', id);
    }
  }, [values?.hospitalId]);

  const containsLetters = (value: any) => /[a-zA-Z]/.test(value);

  useEffect(() => {
    // patientid
    if (containsLetters(id)) {
      setValue('isEmr', 1);
      // emr
    } else {
      setValue('isEmr', 2);
    }
  }, [id]);

  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['PrescriptionUpsertType']) => {
      const data: NexusGenInputs['PrescriptionUpsertType'] = {
        DOCTOR: model.DOCTOR,
        REMARKS: model.REMARKS,
        PATIENTEMR: model.PATIENTEMR,
        REPORT_ID: model.REPORT_ID,
        doctorID: Number(model.doctorID),
        CLINIC: Number(model.CLINIC),
        uuid: model.uuid,
        emrId: Number(model.emrId),
        PATIENT: model.PATIENT,
        patientID: Number(model.patientID),
        isEmr: Number(model.isEmr),
        tempId: model.tempId,
        Prescription_Child_Inputs: model.Prescription_Child_Inputs,
      };
      createEmr({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          // console.log(res, 'response');
          const { data } = res;

          reset();

          enqueueSnackbar('Create success!');
          refetch();
          closeSnackbar(snackKey);
          setSnackKey(null);
          // setfetchCover(true);
        })
        .catch((error) => {
          console.log(error, 'error@@');
          closeSnackbar(snackKey);
          setSnackKey(null);

          enqueueSnackbar('Something went wrong', { variant: 'error' });
          runCatch();
        });
    },
    [snackKey]
  );

  const handleAdd = () => {
    append({
      MEDICINE: '',
      MED_BRAND: '',
      DOSE: null,
      FORM: '',
      QUANTITY: null,
      FREQUENCY: null,
      DURATION: null,
      PR_ID: null,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (snackKey) {
      (async () => {
        // await handleSubmitValue(values);
        // const clinicId = clinic?.doctorClinics?.find((i) => {
        //   if (values.hospitalId === Number(i.clinic_name)) {
        //     return i.id;
        //   }
        // });
        await handleSubmitValue({
          ...values,
          Prescription_Child_Inputs: values?.items,
          CLINIC: values.hospitalId,
          uuid: id,
          emrId: Number(values?.emrId),
        });
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        // client side

        // SubmitClient(data);
        onClose();
        onCloseView();
        // console.log(data, 'data@');
        // server side
        // console.log(values.hospitalId);
        // console.log(clinic?.doctorClinics);

        // console.log(clinicId.id, 'HEHE');
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        // await handleSubmitValue({
        //   ...data,
        //   Prescription_Child_Inputs: values?.items,
        //   CLINIC: clinicId?.id,
        //   uuid: id,
        //   emrId: Number(values?.emrId),
        // });
      } catch (error) {
        console.error(error);
      }
    },
    // [currentItem, enqueueSnackbar, onClose, reset]
    [values?.items, values?.hospitalId]
  );
  // console.log(clinic?.doctorClinics, 'CLINICS@@');

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <RHFAutocomplete
              name="hospitalId"
              label="Hospital/Clinic"
              options={
                // clinic?.doctorClinics?.length &&
                clinic?.map((hospital: any) => hospital?.id) || []
                // clinic?.doctorClinics?.map((hospital) => hospital?.clinic_name) || []
              }
              getOptionLabel={(option) =>
                clinic?.find((hospital) => hospital.id === option)?.clinic_name
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, clinic_name } = clinic?.filter(
                  (hospital) => hospital.id === option
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
            />

            <Stack spacing={2}>
              {fields.map((item, index) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    width: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Iconify icon="healthicons:rx-outline" height={68} width={68} />

                  <Box
                    gap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFTextField
                      size="small"
                      name={`items[${index}].MEDICINE`}
                      label="Generic Name"
                    />

                    <RHFTextField
                      size="small"
                      name={`items[${index}].MED_BRAND`}
                      label="MED_BRAND Name"
                    />

                    <RHFTextField
                      size="small"
                      type="text"
                      name={`items[${index}].DOSE`}
                      label="Dosage (in mg)"
                      placeholder="0"
                    />

                    <RHFTextField
                      size="small"
                      name={`items[${index}].FORM`}
                      label="Form (e.g. tablet, etc.)"
                    />

                    <RHFTextField
                      size="small"
                      type="text"
                      name={`items[${index}].QUANTITY`}
                      label="Quantity"
                      placeholder="0"
                    />

                    <RHFTextField
                      size="small"
                      type="text"
                      name={`items[${index}].FREQUENCY`}
                      label="Frequency (per day)"
                      placeholder="0"
                    />

                    <RHFTextField
                      size="small"
                      type="text"
                      name={`items[${index}].DURATION`}
                      label="Duration (in days)"
                      placeholder="0"
                    />

                    {index !== 0 && (
                      <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={() => handleRemove(index)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>

            <Stack direction="row" justifyContent="flex-start">
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
              >
                Add Item
              </Button>
            </Stack>

            <Box
              gap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: '1fr 3fr' }}
            >
              <Controller
                name="upDate"
                control={control}
                render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                  <DatePicker
                    label="Date create"
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

              <RHFTextField fullWidth name="REMARKS" label="remarks" />
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
          {'Create'}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
