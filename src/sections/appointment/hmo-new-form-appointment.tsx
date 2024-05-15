import * as Yup from 'yup';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// _mock
import { _hospitals } from 'src/_mock';
// utils
import { fDate, fTime } from 'src/utils/format-time';
// types
import { IHmoItem } from 'src/types/hmo';
import { IUserSubaccountItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFSelect } from 'src/components/hook-form';
import { Typography } from '@mui/material';
import HmoNewFormICD from './hmo-new-form-icd-appointment';

import { NexusGenInputs } from 'generated/nexus-typegen';
import { useLazyQuery,useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { mutation_create_hmo_claims } from '@/libs/gqls/hmoClaims';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';


// ----------------------------------------------------------------------

// const DIAGNOSIS_OPTIONS = [
//   {
//     code: 'A000',
//     description: 'Cholera due to Vibrio cholerae 01, biovar cholerae',
//     reference: 'Certain infectious and parasitic diseases',
//   },
//   {
//     code: 'A001',
//     description: 'Cholera due to Vibrio cholerae 01, biovar eltor',
//     reference: 'Certain infectious and parasitic diseases',
//   },
//   {
//     code: 'A009',
//     description: 'Cholera, unspecified',
//     reference: 'Certain infectious and parasitic diseases',
//   },
// ];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentItem: any;
  updateRow: any;
  toggleBtn: any;
  toggleData: any;
  mutationR: any;
  isLoading: any;
  setLoading: any;
};

export default function HmoNewForm({isLoading, setLoading,updateRow,mutationR,toggleBtn,toggleData, onClose,currentItem }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);


    const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);
  const [clinicData, setclinicData] = useState<any>([]);

  // console.log(clinicData,"clinicDataclinicData")

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


  const NewHmoSchema = Yup.object().shape({
    treatment: Yup.string().required(),
    phoneNumber: Yup.number().required(),
    email: Yup.string().required(),
    hospitalName: Yup.string().required(),
    paymentType: Yup.string().required(),
    });

  const defaultValues = useMemo(
    () => ({
      appt_id: Number(currentItem?.id )|| 0,
      hmo: currentItem?.patient_hmo?.hmo || 0,
      member_name: String(currentItem?.patient_hmo?.idno ) || 0,
      member_id: currentItem?.patient_hmo?.member_id || 0,
      doctor: String(currentItem?.clinicInfo?.doctor_idno) || 0,
      doctorID: Number(currentItem?.doctorInfo?.EMP_ID) || 0,
      diagnosis: '',
      treatment: '',
      phoneNumber: '',
      email: '',
      hospitalName: null,
      hospitalAddress: '',
      paymentType: '',
    }),
    []
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewHmoSchema),
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
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,

          appt_id: values?.appt_id,
          hmo: values?.hmo,
          member_name: values?.member_name,
          member_id: values?.member_id,
          doctor: values?.doctor,
          doctorID: Number(values?.doctorID),
          treatment: values?.treatment,
          diagnosis: values?.diagnosis,
          c_email: values?.email,
          c_contact: String(values?.phoneNumber),
          c_clinic: String(values?.hospitalName),
          c_caddress:  String(values?.hospitalAddress),
          payment_type: values?.paymentType,

        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);


  //////////////////////////////////////////////////
  const [create_hmo_claims] = useMutation(mutation_create_hmo_claims, {
    context: {
      requestTrackerId: 'mutation_create_hmo_claims[create_hmo_claims_input_request]',
    },
    notifyOnNetworkStatusChange: true,
  });


  const handleSubmitValue = useCallback(async (model: NexusGenInputs['create_hmo_claims_input_request']) => {
    const data: NexusGenInputs['create_hmo_claims_input_request'] = {
      appt_id: model.appt_id,
      hmo: model.hmo,
      claim_status: model.claim_status,
      member_name: model.member_name,
      member_id: model.member_id,
      doctor: model.doctor,
      doctorID: model.doctorID,
      diagnosis: model.diagnosis,
      treatment: model.treatment,
      c_email: model.c_email,
      c_contact: model.c_contact,
      c_clinic: model.c_clinic,
      c_caddress: model.c_caddress,
      payment_type: model.payment_type,

    };
    create_hmo_claims({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        // console.log(res,'RESPONSE')
        const {data} = res;
        const message = data?.mutation_create_hmo_claims?.message;
        const status = data?.mutation_create_hmo_claims?.status;

        if(status === "Failed"){
          closeSnackbar(snackKey);
          enqueueSnackbar(message , { variant: 'error' });
          setLoading(false)
        }else{
          closeSnackbar(snackKey);
          updateRow(data);
          toggleData();
          toggleBtn();
          mutationR(data);
          enqueueSnackbar('Create Hmo Claims Successfully!');
          setLoading(false)
        }

        // refetch();
      })
      .catch((error) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        setLoading(false)
        // runCatch();
      });
  }, [snackKey]);
  //////////////////////////////////////////////////



  useEffect(() => {
    if (values.hospitalName) {
      setValue(
        `hospitalAddress`,
        clinicData?.filter((d:any) => d.clinic_name === values.hospitalName)[0].location
      );
    }
    if (!values.hospitalName) {
      setValue(`hospitalAddress`, '');
    }
  }, [setValue, values.hospitalName]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {

      setLoading(true)

      try {
        const snackbarKey: any = enqueueSnackbar('Creating Hmo Claims...', {
          variant: 'info',
          key: 'UpdatingHmoClaims',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // onClose();
        // enqueueSnackbar('Create success!');
        // console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <HmoNewFormICD />

            <RHFTextField name="treatment" label="Treatment" multiline rows={3} />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="phoneNumber" label="Phone Number" type="number" />
              <RHFTextField name="email" label="Email" type="email" />
            </Box>

            <RHFAutocomplete
            name="hospitalName"
            label="Hospital/Clinic"
            options={clinicData.map((hospital: any) => hospital.clinic_name)}
            getOptionLabel={(option) =>
              clinicData.find((hospital: any) => hospital.clinic_name === option)?.clinic_name
            }
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(props, option) => {
              const { clinic_name } = clinicData.filter(
                (hospital: any) => hospital.clinic_name === option
              )[0];

              if (!clinic_name) {
                return null;
              }

              return (
                <li {...props} key={clinic_name}>
                  {clinic_name}
                </li>
              );
            }}
            sx={{ pt: 1 }}
          />

            {/* <RHFAutocomplete
              name="hospitalName"
              label="Hospital/Clinic Name"
              options={_hospitals.map((hospital) => hospital.id)}
              getOptionLabel={(option) =>
                _hospitals.find((hospital) => hospital.id === option)?.name
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, name } = _hospitals.filter((hospital) => hospital.id === option)[0];

                if (!id) {
                  return null;
                }

                return (
                  <li {...props} key={id}>
                    {name}
                  </li>
                );
              }}
            /> */}

            <RHFTextField
              name="hospitalAddress"
              label="Hospital/Clinic Address"
              InputProps={{ readOnly: true }}
            />
            {/* 
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            > */}
            <RHFSelect name="paymentType" label="Payment Type">
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
            </RHFSelect>
            {/* </Box> */}
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
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  );
}
