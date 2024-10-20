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
import { POST_VITALS, POST_VITALS_USER } from '@/libs/gqls/notes/notesVitals';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useParams, usePathname } from 'next/navigation';
// import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// ----------------------------------------------------------------------

type dataProps = {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  adornment: string;

}

type Props = {
  onClose: VoidFunction;
  items: any;
  refetch: any;
  user: any;
  addedCategory: any;
  data: dataProps;
};

export default function ProfileVitalNewEditFormSingle({ data, addedCategory, onClose, items, refetch, user }: Props) {
  // user na to
  const addedCategoryTitle = addedCategory?.map((item) => item.title)
  const { id } = useParams();
  console.log(addedCategory,'categoryaded')
  
  const pathname = usePathname();

  const isEmr = pathname.includes('my-emr');
 

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [condition, setCondition] = useState<boolean>(false);
  

  const defFields = (() => {
    const validationSchema = addedCategory?.reduce((acc, item) => {
      const { title } = item;
      acc[title] = 0;
      return acc;
    }, {});
    return validationSchema;
  })();



  const NewVitalSchema = Yup.object().shape({
    [data?.name]: Yup.number().moreThan(0, `${data?.name} must be greater than 0`).required('Weight is required'),
    // ...dynamicFields
  });




  const defaultValues = useMemo(
    () => ({
      [data?.name]: 0
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.name]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewVitalSchema),
    defaultValues,
  });

  // console.log(defaultValues,'DEFFFFFFFF')

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
      // values.weight === 0 &&
      // values.height === 0 &&
      // values.bloodPressureMm === 0 &&
      // values.bloodPressureHg === 0 &&
      // values.oxygen === 0 &&
      // values.respiratory === 0 &&
      // values.heart === 0 &&
      // values.temperature === 0 &&
      (() => {
        let noZero = true;

        Object.values(values).forEach((item) => {
          if (item !== 0) {
            noZero = false
          }
        })
        return noZero;
      })()



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
    defFields
    // ...defFields
  ]);
  // user
  // console.log(id,'IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
  const [snackKey, setSnackKey] = useState(null);

  const [createVitals, createVitalsResult] = useMutation(id ? POST_VITALS : POST_VITALS_USER);


  const handleSubmitValue = useCallback(
    async (model: any) => {
      const field = data?.name;
      let payload: any;

    

      if (model?.categoryData?.length === 0) {
        if (data?.name !== "bloodPresMM") {
          payload = {
            [field]: String(model[`${data?.name}`]),
            uuid: id
          }
        } else {
          payload = {
            bloodPresMM: String(model?.bloodPresMM),
            bloodPresHG: String(model?.bloodPresHG),
            uuid: id
          }
        }
      } else {
        payload = {
          categoryValues: model?.categoryData,
          uuid: id
        }
      }



      createVitals({
        variables: {
          data: { 
            ...payload,
            isEmr
          
          },
        },
      })
        .then(async (res) => {


          if (snackKey) {

            closeSnackbar(snackKey);
            enqueueSnackbar('Created Successfully');
            refetch();
            reset();
            onClose()

            // enqueueSnackbar('Create success!');
            // refetch();
            // 
          }
        })
        .catch((error) => {
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });

      // const data: NexusGenInputs['notesVitalInputType'] = {
      //   field: String(model.weight)
      // };

    },
    [createVitals,isEmr, data, snackKey, enqueueSnackbar, items?.patientID, items?.report_id, refetch, reset]
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

  const [datas, setData] = useState({});

  useEffect(() => {
    if (snackKey) {
      (async () => {
        // await handleSubmitValue(values);
        // setSnackKey(null);
        const categoryData: any = [];

        Object.entries(datas).forEach((item) => {
          const [key, val] = item;
          if (addedCategoryTitle.includes(key)) {
            categoryData.push({
              title: key,
              value: val
            })
          }
        })

        if (datas?.new) {
          await handleSubmitValue({
            new: true,
            categoryData: [...categoryData]
          });
        } else {

          await handleSubmitValue({
            ...datas,
            categoryData: [...categoryData]
          });
        }

      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (datas: any) => {
      try {

        setData(datas)

        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);


        // onClose();

      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, data, handleSubmitValue, onClose, refetch, reset, addedCategoryTitle]
  );
  // console.log(addedCategoryTitle,'????')


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
            }}
            sx={{ mt: 3 }}
          >
            {data?.name === 'bloodPresMM' ?
              <>
                <RHFTextField
                  fullWidth
                  type={data?.type}
                  name={data?.name}
                  label={data?.label}
                  placeholder={data?.placeholder}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{data?.adornment}</InputAdornment>,
                  }}
                />
                <RHFTextField
                  fullWidth
                  type={data?.type}
                  name={'bloodPresHG'}
                  label={'Blood Pressure'}
                  placeholder={'0'}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{data?.adornment}</InputAdornment>,
                  }}
                />
              </>

              :
              <RHFTextField
                fullWidth
                type={data?.type}
                name={data?.name}
                label={data?.label}
                placeholder={data?.placeholder}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{data?.adornment}</InputAdornment>,
                }}
              />
            }

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
          loading={createVitalsResult.loading}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
