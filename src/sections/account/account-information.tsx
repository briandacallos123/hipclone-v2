import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// _mock
import { _userProfileInformation } from 'src/_mock';
// types
import { IUserProfileInformation } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfileInformation;

export default function AccountInformation() {
  const { enqueueSnackbar } = useSnackbar();

  const [user] = useState<IUserProfileInformation>(_userProfileInformation);

  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = {
    employment: user?.employment ?? {
      occupation: '',
      employerName: '',
      employerAddress: '',
      employerNumber: '',
    },
    emergency: user?.emergency ?? {
      name: '',
      address: '',
      phoneNumber: '',
      relationship: '',
    },
    physician: user?.physician ?? {
      referringPhysician: '',
      primaryPhysician: '',
      otherPhysician: '',
    },
  };

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar('Update success!');
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
        <Stack spacing={5}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Typography variant="overline">Employment Information</Typography>

            <Box sx={{ display: { xs: 'none', md: 'block' } }} />

            <RHFTextField name="employment.occupation" label="Occupation" />
            <RHFTextField name="employment.employerName" label="Company Name" />
            <RHFTextField name="employment.employerAddress" label="Company Address" />
            <RHFTextField name="employment.employerNumber" label="Company Phone Number" />
          </Box>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Typography variant="overline">Emergency Contact Information</Typography>

            <Box sx={{ display: { xs: 'none', md: 'block' } }} />

            <RHFTextField name="emergency.name" label="Full Name" />
            <RHFTextField name="emergency.address" label="Address" />
            <RHFTextField name="emergency.phoneNumber" label="Phone Number" />
            <RHFTextField name="emergency.relationship" label="Relationship" />
          </Box>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Typography variant="overline">Physician Information</Typography>

            <Box sx={{ display: { xs: 'none', md: 'block' } }} />

            <RHFTextField name="physician.referringPhysician" label="Referring Physician" />
            <RHFTextField name="physician.primaryPhysician" label="Primary Physician" />
            <RHFTextField name="physician.otherPhysician" label="Other Physicians" />
          </Box>
        </Stack>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
