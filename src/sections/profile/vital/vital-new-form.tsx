import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { POST_VITALS_USER } from '@/libs/gqls/notes/notesVitals';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
// import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  items: any;
  refetch: any;
  user: any;
};

export default function ProfileVitalNewEditForm({ onClose, items, refetch, user }: Props) {
  // user na to
  const { enqueueSnackbar } = useSnackbar();
  const [condition, setCondition] = useState<boolean>(false);
  const NewVitalSchema = Yup.object().shape({
    weight: !condition
      ? Yup.number().default(0)
      : Yup.number().moreThan(0, 'Weight must be greater than 0').required('Weight is required'),
    height: !condition
      ? Yup.number().default(0)
      : Yup.number().moreThan(0, 'Height must be greater than 0').required('Height is required'),
    bodyMass: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Body Mass must be greater than 0')
          .required('Body Mass is required'),
    bloodPressureMm: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Blood Pressure (mm) must be greater than 0')
          .required('Blood Pressure (mm) is required'),
    bloodPressureHg: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Blood Pressure (Hg) must be greater than 0')
          .required('Blood Pressure (Hg) is required'),
    oxygen: !condition
      ? Yup.number().default(0)
      : Yup.number().moreThan(0, 'Oxygen must be greater than 0').required('Oxygen is required'),
    respiratory: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Respiratory rate must be greater than 0')
          .required('Respiratory rate is required'),
    heart: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Heart rate must be greater than 0')
          .required('Heart rate is required'),
    temperature: !condition
      ? Yup.number().default(0)
      : Yup.number()
          .moreThan(0, 'Temperature must be greater than 0')
          .required('Temperature is required'),
  });

  // const {
  //   data: drClinicData,
  //   error: drClinicError,
  //   loading: drClinicLoad,
  //   refetch: drClinicFetch,
  // }: any = useQuery(DR_CLINICS);
  // const [clinicData, setclinicData] = useState<any>([]);

  // useEffect(() => {
  //   drClinicFetch().then((result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { doctorClinics } = data;
  //       setclinicData(doctorClinics);
  //     }
  //   });
  //   return () => drClinicFetch();
  // }, []);

  const defaultValues = useMemo(
    () => ({
      weight: 0,
      height: 0,
      bodyMass: 0,
      bloodPressureMm: 0,
      bloodPressureHg: 0,
      oxygen: 0,
      respiratory: 0,
      heart: 0,
      temperature: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewVitalSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    if (
      values.weight === 0 &&
      values.height === 0 &&
      values.bloodPressureMm === 0 &&
      values.bloodPressureHg === 0 &&
      values.oxygen === 0 &&
      values.respiratory === 0 &&
      values.heart === 0 &&
      values.temperature === 0
    ) {
      setCondition(true);
    } else {
      setCondition(false);
    }
  }, [
    condition,
    values.bloodPressureHg,
    values.bloodPressureMm,
    values.heart,
    values.height,
    values.oxygen,
    values.respiratory,
    values.temperature,
    values.weight,
  ]);
  // user
  // console.log('@@@', items);

  const [createVitals] = useMutation(POST_VITALS_USER);
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['notesVitalInputType'] = {
        weight: String(model.weight),
        height: String(model.height),
        bmi: String(model.bodyMass.toFixed(2)),
        bloodPresMM: String(model.bloodPressureMm),
        bloodPresHG: String(model.bloodPressureHg),
        oxygen: String(model.oxygen),
        heartRate: String(model.heart),
        bodyTemp: String(model.temperature),
        respRate: String(model.respiratory),
      };
      createVitals({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          enqueueSnackbar('Create success!');
          refetch();
          reset();
        })
        .catch((error) => {
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createVitals, enqueueSnackbar, items?.patientID, items?.report_id, refetch, reset]
  );

  useEffect(() => {
    const calculatedBMI = Number((values.weight / (values.height * 0.01) ** 2).toFixed(2));
    // console.log(calculatedBMI);
    if (calculatedBMI === Infinity || Number.isNaN(calculatedBMI)) {
      setValue('bodyMass', 0);
    } else {
      setValue('bodyMass', calculatedBMI);
    }
  }, [setValue, values.weight, values.height]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await handleSubmitValue({
          ...data,
        });
        reset();
        refetch();
        onClose();
        enqueueSnackbar('Create success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose, refetch, reset]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
            sx={{ mt: 3 }}
          >
            <RHFTextField
              type="number"
              name="weight"
              label="Weight"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="height"
              label="Height"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="bodyMass"
              label="Body Mass Index"
              placeholder="0"
              value={values.bodyMass.toFixed(2)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">kg/m2</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="bloodPressureMm"
              label="Blood Pressure (mm)"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">mm/Hg</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="bloodPressureHg"
              label="Blood Pressure (Hg)"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">mm/Hg</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="oxygen"
              label="Oxygen Saturation"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="respiratory"
              label="Respiratory Rate"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">breathes/min</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="heart"
              label="Heart Rate"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
              }}
            />

            <RHFTextField
              type="number"
              name="temperature"
              label="Body Temperature"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
              }}
            />
          </Box>
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
