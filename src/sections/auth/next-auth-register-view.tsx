'use client';

import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
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
import { Box, Button, DialogActions, DialogContentText, Divider } from '@mui/material';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import MapContainer from '../map/GoogleMap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fontSize } from '@mui/system';
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

function createPasswordSchema() {
  return Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};:"\\|,.<>/? )');
}



// ----------------------------------------------------------------------

const passwordRequirements = [
  'Password is required',
  'Password must be at least 8 characters',
  'Password must contain at least one number',
  'Password must contain at least one lowercase letter',
  'Password must contain at least one uppercase letter',
  'Password must contain at least one special character (!@#$%^&*()_+-=[]{};:"\|,.<>/? )'
]

function validatePassword(password) {
  // Regex patterns for each requirement
  const patterns = [
    // Password is required (non-empty)
    /.+/,

    // Password must be at least 8 characters
    /.{8,}/,

    // Password must contain at least one number
    /\d/,

    // Password must contain at least one lowercase letter
    /[a-z]/,

    // Password must contain at least one uppercase letter
    /[A-Z]/,

    // Password must contain at least one special character
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/
  ];

  const errors: any = [];

  patterns.forEach((pattern, index) => {
    if (!pattern.test(password)) {
      const payload = {
        error: true,
        label: passwordRequirements[index]
      }
      errors.push(payload);
    } else {
      const payload = {
        error: false,
        label: passwordRequirements[index]
      }
      errors.push(payload);
    }
  });

  return errors;
}

export default function NextAuthRegisterView({ open, onClose }: Props) {
  const { login } = useAuthContext();

  const pathname = usePathname();

  const isLogin = pathname.includes('auth/login');

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams: any = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const [passChecked, setPassChecked] = useState([]);

  const [passError, setPassError] = useState(null)


  const confirmPassword = useBoolean();

  const [mapData, setMapData] = useState({ lat: null, lng: null })

  const [map, showMap] = useState(false)




  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    address: Yup.string().required('address is required'),
    phoneNumber: Yup.string().required('Phone number is required')
      .matches(/^[0-9]{11}$/, 'Phone number must be exactly 10 digits')
      .matches(/^\+?[0-9]\d{1,14}$/, 'Phone number must be valid'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};:"\\|,.<>/? )'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const [registerUser] = useMutation(USER_REGISTER);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UserProfileUpsertType']) => {
      const s = bcrypt.genSaltSync(12);
      const data: NexusGenInputs['UserProfileUpsertType'] = {
        firstName: model.firstName,
        lastName: model.lastName,
        // username: model.username,
        email: model.email,
        password: bcrypt.hashSync(model.password, s),
        address: model.address,
        phoneNumber: model.phoneNumber,
        latitude: model.latitude,
        longitude: model.longitude
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



  const defaultValues: any = {
    firstName: '',
    lastName: '',
    email: '',
    // username: '',
    password: '',
    address: '',
    phoneNumber: "",
    confirmPassword: "",
  };

  const methods = useForm<NexusGenInputs['UserProfileUpsertType']>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {

    if (errors?.password && !passError) {
      setPassError(errors?.password?.message)
    }
    if (passError) {
      if (passError !== errors?.password?.message) {
        setPassChecked((prev) => {
          return [...prev, passError]
        })
        setPassError(null)
      }
    }

  }, [errors?.password, passError])





  const values = watch()

  const onSubmit = useCallback(
    async (data: NexusGenInputs['UserProfileUpsertType']) => {
      try {
        const newData: any = { ...data }
        newData.latitude = mapData?.lat
        newData.longitude = mapData?.lng

        await handleSubmitValue(newData);
      } catch (error) {
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    [handleSubmitValue, mapData]
  );

  const [valResult, setValResult] = useState([])




  const successModal = useBoolean();
  const privacyModal = useBoolean();

  const renderTerms = (
    <Typography
      component="div"
      sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
    >
      {'By signing up, I agree to '}
      <Button onClick={() => successModal.onTrue()} sx={{ cursor: 'pointer' }}>
        Terms of Service
      </Button>
      {' and '}
      <Button onClick={() => privacyModal.onTrue()} sx={{ cursor: 'pointer' }}>
        Privacy Policy
      </Button>
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



  useEffect(() => {
    if (values.address.length >= 10) {
      (async () => {
        const payload = {
          address: values.address
        }
        try {
          // https://hip.apgitsolutions.com/api/getLocation
          // https://hip.apgitsolutions.com/
          const response = await axios.post('/api/getLocation', payload);
          setMapData({
            ...mapData,
            lat: response?.data?.latitude,
            lng: response?.data?.longitude
          })
          showMap(true)
        } catch (error) {

        }

      })()
    }
  }, [values.address])

  let isPassError = valResult?.find((item) => item.error)
  const [openReq, setOpenReq] = useState(false);

  const handleClose = () => {
    setOpenReq(false)
  }

  useEffect(() => {
    if (errors?.password) {
      const validationResult: any = validatePassword(values.password);
      setValResult([...validationResult])
      setOpenReq(true)
    }
  }, [values.password, errors.password])

  const ErrorDialog = () => {

    return (
      <div style={{
        position: 'absolute',
        bottom:0,
        left:10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        zIndex: 100,
        boxShadow: '1px 1px 3px black'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h3>Password must meet the following requirements:</h3>
          <Button variant="contained" onClick={handleClose}>Close</Button>
        </Stack>
        <div>
          <ul>
            {valResult?.map((item) => {
              if (item?.error) {
                return <li style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Iconify icon="entypo:cross" sx={{
                    color: 'error.main',
                    fontSize: 18
                  }} />
                  <Typography color="error.main">{item?.label}</Typography>
                </li>
              } else {
                return <li style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Iconify icon="material-symbols:check" sx={{
                    color: 'success.main',
                    fontSize: 18
                  }} />
                  <Typography color="success.main">{item?.label}</Typography>
                </li>
              }
            })}
          </ul>

        </div>
      </div>
    )
  }

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
        <Stack direction="column" spacing={2}>
          <RHFTextField fullWidth name="address" label="Address" />

        </Stack>
        <Stack>
          {map && <MapContainer lat={mapData?.lat} lng={mapData?.lng} />}
        </Stack>

        <Stack sx={{
          position: 'relative'
        }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

      <DialogContent sx={{ pb: 3, position: 'relative' }}>
        {renderForm}

        {renderTerms}
        <TermsDialog open={successModal.value} handleClose={successModal.onFalse} />

        <PrivacyDialog open={privacyModal.value} handleClose={privacyModal.onFalse} />

      </DialogContent>
        {Object.keys(errors).length !== 0 && isPassError && openReq && <ErrorDialog />}

    </Dialog>
  );
}

type TermsDialogProps = {
  open: boolean;
  handleClose: () => void;
}

const TermsDialog = ({ open, handleClose }: TermsDialogProps) => {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {" Terms of service"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

type PrivacyDialogProps = {
  open: boolean;
  handleClose: () => void;
}


const PrivacyDialog = ({ open, handleClose }: PrivacyDialogProps) => {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Privacy Policy
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
