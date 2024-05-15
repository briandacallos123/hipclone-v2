import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
// _mock
import { _jobTitles, _userProfilePortfolio } from 'src/_mock';
// types
import { IUserProfilePortfolio } from 'src/types/user';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload, RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserProfilePortfolio, 'signatureUrl'> {
  signatureUrl: CustomFile | string | null;
}

export default function AccountPortfolio() {
  const { enqueueSnackbar } = useSnackbar();

  const [user] = useState<IUserProfilePortfolio>(_userProfilePortfolio);

  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = {
    specialty: user?.specialty,
    subSpecialty: user?.subSpecialty,
    title: user?.title || '',
    signatureUrl: user?.signatureUrl || null,
  };

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
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

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('signatureUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('signatureUrl', null);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFSelect name="specialty" label="Specialty">
            {_jobTitles.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect name="subSpecialty" label="Sub-specialty">
            {_jobTitles.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
        </Box>

        <RHFTextField name="title" label="Medical Degree/Title" sx={{ mt: 3 }} />

        <Stack spacing={1.5} sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Digital Signature</Typography>
          <RHFUpload
            name="signatureUrl"
            maxSize={3145728}
            onDrop={handleDrop}
            onDelete={handleRemoveFile}
          />
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
