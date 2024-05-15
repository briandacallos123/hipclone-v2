import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { USER_UPDATE_PASSWORD } from '@/libs/gqls/users';

// ----------------------------------------------------------------------

type FormValuesProps = { oldPassword: string; newPassword: string; confirmPassword: string };

export default function LoginPassword() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isloading, setLoading]: any = useState(false);

  const showOldPass = useBoolean();

  const showNewPass = useBoolean();

  const showConfirmPass = useBoolean();

  const defaultValues = useMemo(
    () => ({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const UpdateUserSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(6, 'Password must be at least 6 characters')
      .test(
        'no-match',
        'New password must be different than old password',
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),

    // const VerifySchemaSchema = Yup.object().shape({
    //   password: Yup.string().required(),
    //   confirmPass: Yup.string()
    //     .required()
    //     .oneOf([Yup.ref('password')], 'Passwords must match'),
    // });
  });

  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [user_password_update] = useMutation(USER_UPDATE_PASSWORD, {
    context: {
      requestTrackerId: 'mutationUpdatePassword[UserUpdatePasswordProfileUpsertType]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UserUpdatePasswordProfileUpsertType']) => {
      const data: NexusGenInputs['UserUpdatePasswordProfileUpsertType'] = {
        password: model.password,
        newpassword: model.newpassword,
        confirmpassword: model.confirmpassword,
      };
      user_password_update({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          // console.log(res?.data?.mutationUpdatePassword?.status,'datadatadata')
          if(res?.data?.mutationUpdatePassword?.status === "Failed"){
            enqueueSnackbar('Old Password do not match.', { variant: 'error' });
            setLoading(false)
          }else{
            enqueueSnackbar('Update Password Successfully!');
            setLoading(false)
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading(false)
          // runCatch();
        });
    },
    [snackKey]
  );

  const values = watch();
  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          password: values?.oldPassword,
          newpassword: values?.newPassword,
          confirmpassword: values?.confirmPassword,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {

      setLoading(true)
      
      try {
        const snackbarKey: any = enqueueSnackbar('Updating Password...', {
          variant: 'info',
          key: 'UpdatingPassword',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset]
  );

  const INPUT_FIELD = [
    {
      value: 'oldPassword',
      label: 'Old Password',
      state: showOldPass.value,
      func: showOldPass.onToggle,
    },
    {
      value: 'newPassword',
      label: 'New Password',
      state: showNewPass.value,
      func: showNewPass.onToggle,
    },
    {
      value: 'confirmPassword',
      label: 'Confirm Password',
      state: showConfirmPass.value,
      func: showConfirmPass.onToggle,
    },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {INPUT_FIELD.map((field) => (
          <Box
            key={field.label}
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: '1fr 3fr',
            }}
          >
            <div>
              <Typography variant="overline" gutterBottom>
                {field.label}
              </Typography>
              {field.value === 'newPassword' && (
                <Stack
                  component="span"
                  direction="row"
                  alignItems="center"
                  sx={{ typography: 'body2', color: 'text.disabled' }}
                >
                  <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be
                  minimum 6+
                </Stack>
              )}
            </div>

            <RHFTextField
              name={field.value}
              placeholder={field.label}
              type={field.state ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={field.func} edge="end">
                      <Iconify icon={field.state ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        ))}

        <Stack spacing={3} alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={isloading}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
