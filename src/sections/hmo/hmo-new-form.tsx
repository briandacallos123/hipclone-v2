import * as Yup from 'yup';
import { useEffect, useCallback, useMemo } from 'react';
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
import HmoNewFormICD from './hmo-new-form-icd';

// ----------------------------------------------------------------------

const DIAGNOSIS_OPTIONS = [
  {
    code: 'A000',
    description: 'Cholera due to Vibrio cholerae 01, biovar cholerae',
    reference: 'Certain infectious and parasitic diseases',
  },
  {
    code: 'A001',
    description: 'Cholera due to Vibrio cholerae 01, biovar eltor',
    reference: 'Certain infectious and parasitic diseases',
  },
  {
    code: 'A009',
    description: 'Cholera, unspecified',
    reference: 'Certain infectious and parasitic diseases',
  },
];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
};

export default function HmoNewForm({ onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewHmoSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      forExport: true,
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
    if (values.hospitalName) {
      setValue(
        `hospitalAddress`,
        _hospitals.filter((_) => _.id === values.hospitalName)[0].address
      );
    }
    if (!values.hospitalName) {
      setValue(`hospitalAddress`, '');
    }
  }, [setValue, values.hospitalName]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        onClose();
        enqueueSnackbar('Create success!');
        console.info('DATA', data);
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
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="email" label="Email" />
            </Box>

            <RHFAutocomplete
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
            />

            <RHFTextField
              name="hospitalAddress"
              label="Hospital/Clinic Address"
              InputProps={{ readOnly: true }}
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
              <RHFSelect name="paymentType" label="Payment Type">
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
              </RHFSelect>
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
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  );
}
