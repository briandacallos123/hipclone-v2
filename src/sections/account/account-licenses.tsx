import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// _mock
import { _userProfileLicense } from 'src/_mock';
// types
import { IUserProfileLicense } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from '@/auth/hooks';
import { useMutation } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { LicensesUpdate } from '../../libs/gqls/licenses';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserProfileLicense, 'prcExpiry'> {
  prcExpiry: Date | number | null;
}

export default function AccountLicenses() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');
  // const [user] = useState<IUserProfileLicense>(_userProfileLicense);

  const { user, reInitialize } = useAuthContext();

  const [updateLicenses] = useMutation(LicensesUpdate);

  const UpdateUserSchema = Yup.object().shape({
    prcNumber: Yup.string().required('PRC Number is required'),
    prcExpiry: Yup.date().required('PRC Expiry Date is required'),
    ptrNumber: Yup.string().required('PTR Number is required'),
    s2Number: Yup.string().required('S2 Number is required'),
    since: Yup.string().required('Practicing Since (Year) is required'),
  });

  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['LicensesInput']) => {
      const data: NexusGenInputs['LicensesInput'] = {
        PRC: model.PRC,
        PTR: model.PTR,

        practicing_since: model.practicing_since,
        s2_number: model.s2_number,
        validity: model.validity,
        // suffix: model.suffix,
        // address: model.address,
        // contact: model.contact,
      };
      updateLicenses({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Updated successfully!');
          reInitialize();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const defaultValues = {
    prcNumber: user?.PRC ?? '',
    prcExpiry: new Date(user?.validity),
    ptrNumber: user?.PTR ?? '',
    s2Number: user?.s2_number || '',
    since: user?.practicing_since || '',
  };

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          PRC: values?.prcNumber,
          PTR: values?.ptrNumber,
          s2_number: values?.s2Number,
          validity: values?.prcExpiry,
          practicing_since: values?.since,
        });
        // await handleSubmitValue({ ...values, gender: values.gender.toString() });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        //      prcNumber: user?.PRC ?? '',
        // prcExpiry: user?.VALIDITY,
        // ptrNumber: user?.PTR ?? '',
        // s2Number: user?.s2_number || '',
        // since: user?.practicing_since || '',
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingGeneral',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        // await handleSubmitValue({
        //   PRC: data?.prcNumber,
        //   PTR: data?.ptrNumber,
        //   s2_number: data?.s2Number,
        //   validity: data?.prcExpiry,
        //   practicing_since: data?.since,
        // });
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant={upMd ? 'body2' : 'body2'} sx={{ mb: 3, color: 'text.disabled' }}>
          PRC Number, S2 License, or PTR Number will only appear in your prescriptions.
        </Typography>

        <Box
          rowGap={{ md: 3, xs: 1 }}
          columnGap={{ md: 2, xs: 1 }}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFTextField name="prcNumber" label="PRC Number" />

          <Controller
            name="prcExpiry"
            control={control}
            render={({ field, fieldState: { error } }: CustomRenderInterface) => (
              <DatePicker
                label="PRC Expiry Date"
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

          <RHFTextField name="ptrNumber" label="PTR Number" />
          <RHFTextField name="s2Number" label="S2 Number" />
          <RHFTextField name="since" label="Practicing Since (Year)" />

          <Stack spacing={3} alignItems="flex-end" justifyContent="flex-end">
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Box>
      </Card>
    </FormProvider>
  );
}
