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
import { useTheme, alpha } from '@mui/material/styles';
import { ConfirmDialog } from '@/components/custom-dialog';

// server action
import { validateEmail, validatePhone } from './action/sub-account-act';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  setIsRefetch?: any;
  refetch: any;
  isLoading: any;
  setLoading: any;
};

export default function SubaccountNewForm({ isLoading, setLoading, onClose, setIsRefetch, refetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);

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

  const [step, setStep] = useState(1);


  const onIncrementStep = () => setStep(step + 1);

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
    middleName: Yup.string(),
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
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = methods;



  const values = watch();

  console.log(values, 'values')

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
          email: values?.email,
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

        if (currentStep && Number(currentStep) !== 100) {
          localStorage.setItem('currentStep', '13');
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

        const snackbarKey: any = enqueueSnackbar('Creating Sub Account...', {
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
    [enqueueSnackbar, onClose, reset, emailValidation, MobileNoValidation]
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

  const theme = useTheme();
  const confirm = useBoolean();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Unsaved Changes"
      content="You have unsaved changes, are you sure you want to skip?"
      sx={{
        zIndex: 99999
      }}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onIncrementStep();
            // clearUnsaved()
            confirm.onFalse();
            reset({}, { keepValues: true });
          }}
        >
          Skip
        </Button>
      }
    />
  );
  const handleContinue = useCallback(() => {
    // Resetting isDirty by setting the values to the current values
    reset({}, { keepValues: true });
    // Then increment the step
    onIncrementStep();
  }, [values])

  const onSkip = useCallback(() => {
    if (isDirty) {
      confirm.onTrue()
    } else {
      onIncrementStep()
    }
  }, [isDirty])

  const [emailChange, setEmailChange] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const [rePasswordChange, setRepasswordChange] = useState(false);

  const [load, setLoad] = useState(false);

  const [existsEmail, setExistsEmail] = useState(false)

  useEffect(()=>{
    if(values.email && Object.keys(errors)?.length === 0){
     (async()=>{
      validateEmail(values.email).then((res)=>{
       const {isExists} = res;
       if(isExists){
        setExistsEmail(true)
       }else{
        setExistsEmail(false)
       }
      }).catch((err)=>{
        console.log(err,'errorrrrrrrr')
      })
     })()
    }
  },[values.email, Object.keys(errors)?.length === 0])

  const [existsPhone, setExistsPhone] = useState(false)


  useEffect(()=>{
    if(values.phoneNumber && Object.keys(errors)?.length === 0){
     (async()=>{
      validatePhone({
        phone:String(values.phoneNumber)
      }).then((res)=>{
       const {isExists} = res;
       console.log(res,'isExistsisExistsisExists')
       if(isExists){
        setExistsPhone(true)
       }else{
        setExistsPhone(false)
       }
      }).catch((err)=>{
        console.log(err,'errorrrrrrrr')
      })
     })()
    }
  },[values.phoneNumber, Object.keys(errors)?.length === 0])

  console.log(Object.keys(errors),'error ba?')
  console.log(values.phoneNumber ,'values.phoneNumber  ba?')


  const RenderChoices = useCallback(({ isRequired }: any) => {
    return (
      <Stack sx={{
        p: 1
      }} direction="row" alignItems='center' gap={2} justifyContent='flex-end'>
        {!isRequired && <Button onClick={onSkip} variant="outlined">Skip</Button>}
        <LoadingButton loading={load} disabled={
          (() => {
            if (step === 6) {
              if(!values.phoneNumber){
                return true
              }else if(String(values.phoneNumber).length !== 11){
                return true
              }
              if(Object.keys(errors)?.length === 0){
                if(existsPhone){
                  return true;
                }else{
                  return false;
                }
              }else{
                return true
              }
           
            }else if(step === 5){
              if(!values.email){
                return true
              }

              if(Object.keys(errors)?.length === 0){
                if(existsEmail){
                  return true;
                }else{
                  return false;
                }
              }else{
                return true
              }
            }
             else if (emailChange) {
              if (Object.keys(errors)?.length !== 0) {
                return true
              } else {
                return false
              }
            }else if(step === 7){
             if(passwordChange){
              if (Object.keys(errors)?.length !== 0) {
                return true
              } else {
                return false
              }
             }
             else{
              return true
             }
            }else if(step === 8){
              if(rePasswordChange){
                if (Object.keys(errors)?.length !== 0) {
                  return true
                } else {
                  return false
                }
              }
              else{
                return true
               }
            }
             else {
              return !isDirty
            }
          })()
        } onClick={handleContinue} variant="contained">Continue</LoadingButton>

      </Stack>
    )
  }, [isDirty, step, statusMobilePhoneData, Object.keys(errors), existsEmail])

 

  const renderTutsFields = (
    <Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <div className={step === 1 ? 'showFields-sub' : ''}>
          <RHFTextField name="firstName" label="First Name" />
          {step === 1 && <RenderChoices isRequired={true} />}
        </div>

        <div className={step === 2 ? 'showFields-sub' : ''}>
          <RHFTextField name="lastName" label="Last Name" />
          {step === 2 && <RenderChoices isRequired={true} />}
        </div>

        <div className={step === 3 ? 'showFields-sub' : ''}>
          <RHFTextField name="middleName" label="Middle Name" />
          {step === 3 && <RenderChoices isRequired={false} />}
        </div>


        <div className={step === 4 ? 'showFields-sub' : ''}>
          <RHFSelect name="gender" label="Gender">
            <MenuItem value="1">Male</MenuItem>
            <MenuItem value="2">Female</MenuItem>

          </RHFSelect>
          {step === 4 && <RenderChoices isRequired={true} />}
        </div>

        <div className={step === 5 ? 'showFields-sub' : ''}>
          <RHFTextField
            helperText={(errors.email ? errors.email.message : '') || existsEmail && 'Email already used.' }
            name="email"
            type='email'
            error={!!errors.email || existsEmail}
            label="Email Address"
            onChange={(e) => {
              setValue('email', e.target.value);
              setEmailChange(true)
              methods.trigger('email'); // Validate on change
            }}
            
          />
          {step === 5 && <RenderChoices isRequired={true} />}
        </div>


        {renderConfirm}
        <div className={step === 6 ? 'showFields-sub' : ''}>
          <RHFTextField
            name="phoneNumber"
            type='number'
            label="Phone Number"
            error={!!errors.phoneNumber || existsPhone}
            helperText={(errors.phoneNumber ? errors.phoneNumber.message : '') || existsPhone && 'Phone already used'}
            onChange={(e) => {
              setValue('phoneNumber', e.target.value);
              
              methods.trigger('phoneNumber'); // Validate on change
            }}
          />
          {step === 6 && <RenderChoices isRequired={true} />}
        </div>
        {/* <Stack>
    
    </Stack>     */}
        {INPUT_FIELD.map((field, index) => (
          <div className={(() => {
            if (index === 0 && step === 7) {
              return 'showFields-sub'
            } else if (index === 1 && step === 8) {
              return 'showFields-sub'
            }
          })()}>
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
              onChange={(e) => {
                if(index === 0){
                  methods.setValue('password', e.target.value);
                  setPasswordChange(true)
                  methods.trigger('password')
                }else if(index === 1){
                  methods.setValue('confirmPassword', e.target.value);
                  setRepasswordChange(true)
                  methods.trigger('confirmPassword')
                }
              }}
            />
            {(() => {
              if (index === 0 && step === 7) {
                return <RenderChoices isRequired={true} />
              } else if (index === 1 && step === 8) {
                return <RenderChoices isRequired={true} />
              }
            })()}
          </div>
        ))}
      </Box>
      <DialogActions>
        <Button sx={{
          mr:1
        }} variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <div className={step === 9 ? 'showFields-submit-sub' : ''}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}

        >
          Create
        </LoadingButton>
        </div>

       
      </DialogActions>
      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

      }}>

      </Box>
    </Box>
  )

  const tutsCondition = currentStep && Number(currentStep) < 20

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {!tutsCondition ? <Box
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
          </Box> :
            renderTutsFields
          }
        </FormProvider>
      </DialogContent>

     {!tutsCondition &&  <DialogActions>
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
      </DialogActions>}
    </>
  );
}
