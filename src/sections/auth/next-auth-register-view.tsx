'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
import { USER_REGISTER } from 'src/libs/gqls/users';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutation } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import bcrypt from 'bcryptjs';
/* import Password from 'node-php-password'; */
import { Divider } from '@mui/material';
import { signIn } from 'next-auth/react';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function NextAuthRegisterView({ open, onClose }: Props) {
  const { login } = useAuthContext();

  const pathname = usePathname();

  const isLogin = pathname.includes('auth/login');

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams: any = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // phonenumber: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    username: Yup.string().required('Username is required'),
    // confirmPassword: Yup.string()
    //   .required('Confirm password is required')
    //   .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const [registerUser] = useMutation(USER_REGISTER);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UserProfileUpsertType']) => {
      const s = bcrypt.genSaltSync(12);
      const data: NexusGenInputs['UserProfileUpsertType'] = {
        firstName: model.firstName,
        lastName: model.lastName,
        username: model.username,
        email: model.email,
        password: bcrypt.hashSync(model.password, s),
      };
      registerUser({
        variables: {
          input: data,
        },
      })
        .then(async (res) => {
          const { registerUser: regData } = res.data;
          await login(regData.email, model.password);
          window.location.href = returnTo || PATH_AFTER_LOGIN;
        })
        .catch((error) => {
          setErrorMsg(typeof error === 'string' ? error : error.message);
        });
    },
    [login, registerUser, returnTo]
  );

  const defaultValues: NexusGenInputs['UserProfileUpsertType'] = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  };

  const methods = useForm<NexusGenInputs['UserProfileUpsertType']>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: NexusGenInputs['UserProfileUpsertType']) => {
      try {
        await handleSubmitValue(data);
      } catch (error) {
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    [handleSubmitValue]
  );

  // const renderHead = (
  //   <DialogTitle>
  //     <CardHeader
  //       title="Get started absolutely free"
  //       subheader={
  //         <Stack direction="row" spacing={0.5}>
  //           <Typography variant="body2"> Already have an account? </Typography>

  //           {isLogin ? (
  //             <Typography
  //               component={Link}
  //               onClick={onClose}
  //               variant="subtitle2"
  //               sx={{ cursor: 'pointer' }}
  //             >
  //               Sign in
  //             </Typography>
  //           ) : (
  //             <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
  //               Sign in
  //             </Link>
  //           )}
  //         </Stack>
  //       }
  //       sx={{ p: 0 }}
  //     />
  //   </DialogTitle>
  // );

  const renderTerms = (
    <Typography
      component="div"
      sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary" sx={{ cursor: 'pointer' }}>
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary" sx={{ cursor: 'pointer' }}>
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderLoginOption = (
    <div>
      <Divider
        sx={{
          my: 1.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={() => signIn('google')}>
          <Iconify icon="eva:google-fill" color="#DF3E30" />
        </IconButton>
      </Stack>
    </div>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="email" label="Email address" />
          <RHFTextField name="phoneNumber" label="Phone number" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmPassword"
            label="Confirm password"
            type={confirmPassword.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>

        {renderLoginOption}
      </Stack>
    </FormProvider>
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      {/* {renderHead} */}
      <DialogTitle>Get started absolutely free</DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {renderForm}

        {renderTerms}
      </DialogContent>
    </Dialog>
  );
}