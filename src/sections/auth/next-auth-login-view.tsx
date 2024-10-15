'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
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
// import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Divider } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useSnackbar } from 'src/components/snackbar';

//
import NextAuthRegisterView from './next-auth-register-view';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  id?: string;
  isLoggedIn?: any;
  setLoggedIn?: any;
  isDoctor?: boolean;
};

// ----------------------------------------------------------------------

export default function NextAuthLoginView({ isDoctor, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
  const { login, user } = useAuthContext();
  const path = usePathname();
  // const pathname = usePath

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams: any = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const openReg = useBoolean();

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Username / Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   if (user) {
  //     console.log(user, 'HAAAAAAAAAAAAAAAAAAAAAAAAAAAA?');
  //   }
  // }, [user]);

  //  console.log(user, 'HAAAAAAAAAAAAAAAAAAAAAAAAAAAA?');

  const [loadingBtn, setLoadingBtn] = useState(false)

  const [myData, setMyData]: any = useState(null);
  const [snackKey, setSnackKey]: any = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSubmitValue = useCallback(async (fData) => {
    try {
      await login?.(fData.email, fData.password, isDoctor ? 'doctor' : 'patient', path);
      closeSnackbar(snackKey);
      enqueueSnackbar('Login Successfully')
      
      window.location.href =
        returnTo ||
        (id && path === `/find-doctor/${id}/`
          ? (() => {
            if (user?.role !== 'doctor') {
              return paths.dashboard.appointment.book(id);
            }
          })()
          : PATH_AFTER_LOGIN);
      reset();



    } catch (error) {
      setLoadingBtn(false)
      closeSnackbar(snackKey);
      enqueueSnackbar(error.message, { variant: 'error' })

      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);

    }
  }, [snackKey])

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...myData });
      })();
    }
  }, [snackKey, myData]);


  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      console.log(isDoctor, 'doctor kaba')
      try {
        setLoadingBtn(true)

        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data)

      } catch (error) {

      }
    },
    [id, login, path, reset, returnTo, user, isDoctor]
  );

  // const renderHead = (
  //   <DialogTitle>
  //     <CardHeader
  //       title="Sign in to Natrapharm-HIP"
  //       subheader={
  //         <Stack direction="row" spacing={0.5}>
  //           <Typography variant="body2">New user?</Typography>

  //           <Typography
  //             component={Link}
  //             onClick={openReg.onTrue}
  //             variant="subtitle2"
  //             sx={{ cursor: 'pointer' }}
  //           >
  //             Create an account
  //           </Typography>
  //         </Stack>
  //       }
  //       sx={{ p: 0 }}
  //     />
  //   </DialogTitle>
  // );

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
    <Stack spacing={2.5} sx={{ mt: 1 }}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

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

      <Link
        variant="body2"
        href={paths.auth.forgotPassword}
        component={RouterLink}
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      {renderLoginOption}
    </Stack>
  );

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={false}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { maxWidth: 400 },
        }}
      >
        {/* {renderHead} */}
        <DialogTitle>Sign in to HIPS</DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {/*<Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
            </Alert>*/}

            {renderForm}
          </FormProvider>
        </DialogContent>
      </Dialog>

      <NextAuthRegisterView open={openReg.value} onClose={openReg.onFalse} />
    </>
  );
}
