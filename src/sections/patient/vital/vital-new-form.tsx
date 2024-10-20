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
// prisma
import { POST_VITALS } from '@/libs/gqls/notes/notesVitals';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// _mock
import { _hospitals } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSessionStorage } from '@/hooks/use-sessionStorage';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  items: any;
  refetch: any;
  addedCategory: any;
};

export default function PatientVitalNewEditForm({ addedCategory, onClose, items, refetch }: Props) {
  const addedCategoryTitle = addedCategory?.map((item) => item.title)



  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [condition, setCondition] = useState<boolean>(false);
  const [conditionBP, setConditionBP] = useState<boolean>(false);
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


  const dynamicFields = (() => {
    const validationSchema = addedCategory?.reduce((acc, item) => {
      const { title } = item;
      acc[title] = !condition ? Yup.number().default(0) : Yup.number().moreThan(0, `${title} must be greater than 0`).required(`${title} is required`);
      return acc;
    }, {});
    return validationSchema;
  })();

  const defFields = (() => {
    const validationSchema = addedCategory?.reduce((acc, item) => {
      const { title } = item;
      acc[title] = 0;
      return acc;
    }, {});
    return validationSchema;
  })();

  const NewVitalSchema = Yup.object().shape({
    // hospitalId: Yup.number().nullable().required('Hospital ID is required'),
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
        sugarMonitoring: !condition
    ? Yup.number().default(0)
    : Yup.number()
      .moreThan(0, 'Sugar Monitoring must be greater than 0')
      .required('Sugar Monitoring is required'),
  

        
    ...dynamicFields
  });

  const defaultValues = useMemo(
    () => ({
      // hospitalId: null,
      weight: 0,
      height: 0,
      bodyMass: 0,
      bloodPressureMm: 0,
      bloodPressureHg: 0,
      sugarMonitoring:0,
      oxygen: 0,
      respiratory: 0,
      heart: 0,
      temperature: 0,
      ...defFields
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
      (() => {
        let noZero = true;

        Object.values(values).forEach((item) => {
          if (item !== 0) {
            noZero = false
          }
        })
        console.log(noZero,'code zero')
        return noZero;
      })()
    ) {
      setCondition(true);
    } else if (
      values.weight === 0 &&
      values.height === 0 &&
      (values.bloodPressureMm !== 0 || values.bloodPressureHg === 0) &&
      (values.bloodPressureMm === 0 || values.bloodPressureHg !== 0) &&
      values.oxygen === 0 &&
      values.respiratory === 0 &&
      values.heart === 0 &&
      values.temperature === 0
    ) {
      setConditionBP(true);
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
    defFields
  ]);
  // console.log(values, '@ffff');
  // console.log(condition, '@#####');

  const [createVitals, createVitalsResult] = useMutation(POST_VITALS);

  useEffect(() => {
    const calculatedBMI = Number((values.weight / (values.height * 0.01) ** 2).toFixed(2));
    // console.log(calculatedBMI);
    if (calculatedBMI === Infinity || Number.isNaN(calculatedBMI)) {
      setValue('bodyMass', 0);
    } else {
      setValue('bodyMass', calculatedBMI);
    }
  }, [setValue, values.weight, values.height]);

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['notesVitalInputType'] = {
        // clinicID: model.hospitalId,
        recordID: Number(items?.R_ID),
        patientID: Number(items?.patientInfo?.S_ID),

        weight: String(model.weight),
        height: String(model.height),
        bmi: String(model.bodyMass),
        bloodPresMM: String(model.bloodPressureMm),
        bloodPresHG: String(model.bloodPressureHg),
        oxygen: String(model.oxygen),
        heartRate: String(model.heart),
        bodyTemp: String(model.temperature),
        bsm:String(model?.sugarMonitoring),
        respRate: String(model.respiratory),
        categoryValues: [...model.categoryData]

      };
      createVitals({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
          refetch();
          reset();
          onClose()
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          console.log(error, 'ano error?');
          onClose()

          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createVitals, enqueueSnackbar, items?.R_ID, items?.patientInfo?.S_ID, refetch, reset, snackKey]
  );

  const [myData, setMyData]: any = useState(null);
  // useEffect(() => {
  //   if (snackKey) {
  //     (async () => {
  //       await handleSubmitValue({ ...myData });
  //     })();
  //   }
  // }, [snackKey, myData]);

  const [datas, setData] = useState({});

  useEffect(()=>{
    if(snackKey){

     handleSubmitValue(myData);
    // alert(1)
    }
  },[snackKey])

  console.log(snackKey,'snackKey')

  const onSubmit = useCallback(
    async (data: NexusGenInputs['notesVitalInputType']) => {
      try {

        const categoryData: any = [];

        Object.entries(data).forEach((item) => {
          const [key, val] = item;

          if (addedCategoryTitle.includes(key)) {
            categoryData.push({
              title: key,
              value: val
            })
          }
        })

        
        setMyData({
          ...data,
          categoryData: [...categoryData]
        })

        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });



        setSnackKey(snackbarKey)



        // await handleSubmitValue({
        //   ...data,
        //   categoryData: [...categoryData]
        // });
        // onClose();


        // const snackbarKey: any = enqueueSnackbar('Saving Data...', {
        //   variant: 'info',
        //   key: 'savingVitalsEMR',
        //   persist: true, // Do not auto-hide
        // });
        // setSnackKey(snackbarKey);
        // setMyData(data);
        // await handleSubmitValue({
        //   ...data,
        // });
        // reset();
        // refetch();
        // enqueueSnackbar('Saving!');

        console.info('DATA', data);
      } catch (error) {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        console.error(error);
      }
    },
    [enqueueSnackbar,snackKey, handleSubmitValue, onClose, reset, refetch, addedCategoryTitle]
  );

  const { getItem } = useSessionStorage()

  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id))
    }
  }, [])

  console.log(createVitalsResult,'createVitalsResultcreateVitalsResult')


  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {/* <RHFAutocomplete
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
          /> */}

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 2fr)',
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

            <RHFTextField
              type="number"
              name="sugarMonitoring"
              label="Blood sugar monitoring"
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            {addedCategory?.map((item) => (
              <RHFTextField
                type="number"
                name={item?.title}
                label={item?.title}
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{item?.measuring_unit}</InputAdornment>,
                }}
              />
            ))}
          </Box>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button disabled={createVitalsResult.loading} variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={createVitalsResult.loading}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
