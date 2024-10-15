import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
//
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useLazyQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { mutation_create_sub_account, email_validation, mobile_no_validation } from '@/libs/gqls/sub_accounts';
import { useAuthContext } from '@/auth/hooks';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';



// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  setIsRefetch?: any;
  refetch:any;
  isLoading:any;
  setLoading:any;
};

export default function SubaccountNewForm({isLoading, setLoading,onClose, setIsRefetch,refetch }: Props) {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);

  const router = useRouter();

  const showPass = useBoolean();
  // console.log(refetch,"refetch")

  const showConfirmPass = useBoolean();





  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    }),
    []
  );


  const currentStep = localStorage?.getItem('currentStep')





  const [emailValidation, setEmailValidation] = useState('');
  const handleEmailChange = (event: any) => {
    setEmailValidation(event.target.value);
  };



  // console.log(emailValidation, "VALIDATION")

  const [tableData, setTableData] = useState<any>([]);
  const [messageEmailData, setMessageEmail] = useState<any>([]);
  const [statusEmailData, setStatusEmail] = useState<any>([]);
  const [getDataEmail, { data: data1 }]: any = useLazyQuery(email_validation, {
    context: {
      requestTrackerId: 'email_validation[sub_account_input_email_request]',
    },
    notifyOnNetworkStatusChange: true,
  });



  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    getDataEmail({
      variables: {
        data: {
          email: emailValidation
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { email_validation } = data;

        setTableData(email_validation?.email_data);
        setMessageEmail(email_validation?.message);
        setStatusEmail(email_validation?.status);
      }
    });
    //}
  }, [
    emailValidation
  ]);

  ////////////////////////////////////////////////////////////////////////////
  const [MobileNoValidation, setMobileNoValidation] = useState('');
  const handleMobileNoChange = (event: any) => {
    setMobileNoValidation(event.target.value);
  };
  const [tableData1, setTableData1] = useState<any>([]);
  const [messageMobilePhoneData, setMessageMobilePhone] = useState<any>([]);
  const [statusMobilePhoneData, setStatusMobilePhone] = useState<any>([]);
  const [getDataMobile, { data: data2 }]: any = useLazyQuery(mobile_no_validation, {
    context: {
      requestTrackerId: 'mobile_no_validation[sub_account_input_mobile_no_request]',
    },
    notifyOnNetworkStatusChange: true,
  });
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    getDataMobile({
      variables: {
        data: {
          mobile_no: MobileNoValidation
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { mobile_no_validation } = data;

        setTableData1(mobile_no_validation?.mobile_no_data);
        setMessageMobilePhone(mobile_no_validation?.message);
        setStatusMobilePhone(mobile_no_validation?.status);
      }
    });
    //}
  }, [
    MobileNoValidation
  ]);


  const UpdateUserSchema = Yup.object().shape({
    password: Yup.string().required('New Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password must match'),
    firstName: Yup.string().required('FirstName is required'),
    lastName: Yup.string().required('LastName is required'),
    middleName: Yup.string().required('MiddleName is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email format'),

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

  const values = watch();
  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
            fname: values?.firstName,
            lname: values?.lastName,
            mname: values?.middleName,
            gender: values?.gender,
            mobile_no: MobileNoValidation,
            email:emailValidation,
            password: values?.password,
            confirmpasword: values?.confirmPassword,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const noValueEmail = values.email === '';
  const noValueMobilePhone = values.phoneNumber === '';

  const [create_sub_account] = useMutation(mutation_create_sub_account, {
    context: {
      requestTrackerId: 'mutation_create_sub_account[user_sub_account_input_request]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(async (model: NexusGenInputs['user_sub_account_input_request']) => {
    const data: NexusGenInputs['user_sub_account_input_request'] = {
      email: model.email,
      fname: model.fname,
      mname: model.mname,
      lname: model.lname,
      gender: model.gender,
      mobile_no: model.mobile_no,
      password: model.password,
      confirmpasword: model.confirmpasword,

    };
    create_sub_account({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Create Sub Account Successfully!');
        refetch();
        setLoading(false)

        if(currentStep && Number(currentStep) !== 100){
          localStorage.setItem('currentStep','13');
          router.push(paths.dashboard.user.manage.login)
        }
      })
      .catch((error) => { 
        closeSnackbar(snackKey);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        setLoading(false)
        // runCatch();
      });
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {

      setLoading(true)

      try {

        const snackbarKey:any = enqueueSnackbar('Creating Sub Account...', {
          variant: 'info',
          key: 'UpdatingPhoneNumber',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
        // if (messageMobilePhoneData === "Phone Number Already Taken"){
        //   enqueueSnackbar('Mobile number already taken', { variant: 'error' });
        // }
        // else if (messageEmailData === "Email Already Taken"){
        //   enqueueSnackbar('Email already taken', { variant: 'error' });
        // }else{
        //   const snackbarKey:any = enqueueSnackbar('Creating Sub Account...', {
        //     variant: 'info',
        //     key: 'UpdatingPhoneNumber',
        //     persist: true, // Do not auto-hide
        //   });
        //   setSnackKey(snackbarKey);
        //   onClose();
        // }

        // if (!emailValidation && !MobileNoValidation ) {
        //   enqueueSnackbar('Email and Phone Number is required', { variant: 'error' });
        // }else if (!emailValidation ){
        //   enqueueSnackbar('Email is required', { variant: 'error' });
        // }else if(!MobileNoValidation) {
        //   enqueueSnackbar('Phone Number is required', { variant: 'error' });
        // }else {
        //   const snackbarKey:any = enqueueSnackbar('Creating Sub Account...', {
        //     variant: 'info',
        //     key: 'UpdatingPhoneNumber',
        //     persist: true, // Do not auto-hide
        //   });
        //   setSnackKey(snackbarKey);
        //   onClose();
        // }
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset,emailValidation,MobileNoValidation]
  );

  const INPUT_FIELD = [
    {
      value: 'password',
      label: 'Password',
      state: showPass.value,
      func: showPass.onToggle,
    },
    {
      value: 'confirmPassword',
      label: 'Confirm Password',
      state: showConfirmPass.value,
      func: showConfirmPass.onToggle,
    },
  ];

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="firstName" label="First Name" />
            <RHFTextField name="lastName" label="Last Name" />
            <RHFTextField name="middleName" label="Middle Name" />

            <RHFSelect name="gender" label="Gender">
              <MenuItem value="1">Male</MenuItem>
              <MenuItem value="2">Female</MenuItem>
              {/* <MenuItem value="unspecified">Unspecified</MenuItem> */}
            </RHFSelect>

            <RHFTextField
              name="email"
              type='email'
              label="Email Address"
              // onChange={handleEmailChange}
              // onFocus={handleEmailChange}
              // onKeyDown={handleEmailChange}
              // value={emailValidation}
              // helperText={
              //   <>
              //     {emailValidation ?
              //       (statusEmailData === 'Failed' && <Typography sx={{ typography: 'caption', color: 'error.main' }}>
              //         *{messageEmailData}
              //       </Typography>
              //       ) :
              //       (noValueEmail && <Typography sx={{ typography: 'caption', color: 'error.main' }}>
              //         *Email is required
              //       </Typography>)
              //     }
              //   </>
              // }
            />

            <RHFTextField
              name="phoneNumber"
              type='number'
              label="Phone Number"
              onChange={handleMobileNoChange}
              value={MobileNoValidation}
              helperText={

                <>
                  {MobileNoValidation ?
                    (statusMobilePhoneData === 'Failed' && <Typography sx={{ typography: 'caption', color: 'error.main' }}>
                      *{messageMobilePhoneData}
                    </Typography>
                    ) :
                    (noValueMobilePhone && <Typography sx={{ typography: 'caption', color: 'error.main' }}>
                      *Phone number is required
                    </Typography>)
                  }
                </>

              }
            />
            {/* <Stack>
            
            </Stack>     */}
            {INPUT_FIELD.map((field) => (
              <RHFTextField
                key={field.label}
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
            ))}
          </Box>
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
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
