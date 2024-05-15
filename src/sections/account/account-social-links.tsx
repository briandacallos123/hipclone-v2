import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
// _mock
import { _userProfileSocialLink } from 'src/_mock';
// types
import { IUserProfileSocialLink } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfileSocialLink;

export default function AccountSocialLinks() {
  const { enqueueSnackbar } = useSnackbar();

  const [user] = useState<IUserProfileSocialLink>(_userProfileSocialLink);

  const defaultValues = {
    facebook: user?.facebook,
    instagram: user?.instagram,
    linkedin: user?.linkedin,
    twitter: user?.twitter,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
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
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {Object.keys(user).map((link) => (
          <RHFTextField
            key={link}
            name={link}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    width={24}
                    icon={
                      (link === 'facebook' && 'eva:facebook-fill') ||
                      (link === 'instagram' && 'ant-design:instagram-filled') ||
                      (link === 'linkedin' && 'eva:linkedin-fill') ||
                      (link === 'twitter' && 'eva:twitter-fill') ||
                      ''
                    }
                    color={
                      (link === 'facebook' && '#1877F2') ||
                      (link === 'instagram' && '#DF3E30') ||
                      (link === 'linkedin' && '#006097') ||
                      (link === 'twitter' && '#1C9CEA') ||
                      ''
                    }
                  />
                </InputAdornment>
              ),
            }}
          />
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
