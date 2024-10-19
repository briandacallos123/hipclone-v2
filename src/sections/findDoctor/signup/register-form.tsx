import React from 'react'

import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, IconButton, Stack, Divider, InputAdornment, Typography, Link, Dialog, DialogTitle, DialogContent, Button, ListItem, MenuItem } from '@mui/material';
import FormProvider, { RHFSelect, RHFTextField } from '@/components/hook-form';
import MapContainer from '@/sections/map/GoogleMap';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from '@/components/iconify';
import { useBoolean } from '@/hooks/use-boolean';
import { signIn } from 'next-auth/react';
import { bgBlur } from '@/theme/css';
import { useTheme } from '@mui/material/styles';
import { registerEmployee } from '@/libs/gqls/users';
import { useMutation } from '@apollo/client';
import bcrypt from 'bcryptjs';
import { useSnackbar } from 'src/components/snackbar';
import { useResponsive } from '@/hooks/use-responsive';
import { paths } from '@/routes/paths';
import Image from '@/components/image';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { validateEmail, validatePhone } from '@/sections/user/subaccount/action/sub-account-act';


const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email format'),
    phoneNumber: Yup.string().required('Phone number is required')
        .matches(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits')
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

const RegisterForm = ({ spec }: any) => {

    console.log(spec, 'specializationn')

    const confirmPassword = useBoolean();
    const noticeDialogValue = useBoolean();

    const password = useBoolean();
    const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const mdUp = useResponsive('up', 'md');

    const [createMedFunc] = useMutation(registerEmployee, {
        context: {
            requestTrackerId: 'Create_Emp[Employee_Key]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const defaultValues: any = {
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        specialization: '',
        phoneNumber: "",
        password: "",
        confirmPassword:'',
        birthDate:""
    };



    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        watch,
        reset,
        control,
        setValue,
        formState: { isSubmitting, errors },
    } = methods;

    const values = watch();

    const [emailTaken, setEmailTaken] = useState(false)

    const [snackKey, setSnackKey]: any = useState(null);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [myData, setMyData]: any = useState(null);

    const handleSubmitValue = useCallback(async (fData) => {

        try {

            createMedFunc({
                variables: {
                    data: {
                        ...fData
                    }
                }
            }).then(() => {
                // enqueueSnackbar('Register successfully');
             
                noticeDialogValue.onTrue()
                setLoadingBtn(false)

                closeSnackbar(snackKey);
                reset();
            }).catch((error) => {
                enqueueSnackbar(error.message, { variant: 'error' })
                if (error.message === 'Email already used') {
                    setEmailTaken(true)
                }
                closeSnackbar(snackKey);
                setLoadingBtn(false)

            })

        } catch (error) {

            enqueueSnackbar(error.message, { variant: 'error' })

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
        async (data: any) => {
            const s = bcrypt.genSaltSync(12);
            

            const newPassword = bcrypt.hashSync(data.password, s);
            delete data.password;
            delete data.confirmPassword;
            delete data.mobile;

            const fData = {
                ...data,
                password: newPassword

            }
            setLoadingBtn(true)

            const snackbarKey: any = enqueueSnackbar('Saving Data...', {
                variant: 'info',
                key: 'savingEducation',
                persist: true, // Do not auto-hide
            });
            setSnackKey(snackbarKey);

            setMyData(fData)



        },
        []
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

            <Typography
                sx={{
                    mt: 2,
                    textAlign: 'center',
                    lineHeight: 1.5,
                    fontSize: '16px',
                    '& > Link': {
                        color: theme.palette.primary.main,
                        cursor: 'pointer'

                    },
                }}
            >
                If you already have an account,
                <Link href={paths.doctor.login}>{` Sign in`}</Link><br />
            </Typography>

        </div>
    );
    const PRIMARY_MAIN = theme.palette.primary.main;

    const noticeDialog = (
        <Dialog open={noticeDialogValue.value}>
            <Image
                sx={{
                    width: 60,
                    height: 60,
                    position: 'absolute',
                    right: 15,
                    top: 15,
                }}
                src={'/assets/registration-doctor/success.svg'}
            />

            <Box gap={3} sx={{
                py: 10,
                px: 7,
                position: 'relative'
            }}>
                <Typography sx={{
                    color: theme.palette.primary.main,
                    fontSize: '25px',
                    fontWeight: 'bold',
                    mb: mdUp ? 1 : 2
                }}>Registration Successful!</Typography>

                <Typography>
                    Your registration is in progress. We need to verify the credentials you provided. Please wait for our confirmation via email before proceeding. Thank you for your patience!
                </Typography>

                <Button onClick={noticeDialogValue.onFalse} sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }} variant="outlined">Close</Button>

            </Box>
        </Dialog>
    )


    const [valResult, setValResult] = useState([])
    const [openReq, setOpenReq] = useState(false);
    let isPassError = valResult?.find((item) => item.error)

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
                padding: 10,
                borderRadius: 10,
                zIndex: 100,

            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <h3>Password must meet the following requirements:</h3>
                    {/* <Button variant="contained" onClick={handleClose}>Close</Button> */}
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

    useEffect(() => {
        if (emailTaken) {
            setEmailTaken(false)
        }
    }, [values.email])


    const [existsEmail, setExistsEmail] = useState(false)


    useEffect(() => {
        if (values.email && !Object.keys(errors)?.includes('email')) {
            (async () => {
                validateEmail(values.email).then((res) => {
                    const { isExists } = res;
                    if (isExists) {
                        setExistsEmail(true)
                    } else {
                        setExistsEmail(false)
                    }
                }).catch((err) => {
                    console.log(err, 'errorrrrrrrr')
                })
            })()
        }
    }, [values.email, !Object.keys(errors)?.includes('email')])

    const [existsPhone, setExistsPhone] = useState(false)


    useEffect(() => {
        if (values.phoneNumber && !Object.keys(errors)?.includes('phoneNumber')) {
            (async () => {
                validatePhone({
                    phone: String(values.phoneNumber)
                }).then((res) => {
                    const { isExists } = res;
                    console.log(res, 'isExistsisExistsisExists')
                    if (isExists) {
                        setExistsPhone(true)
                    } else {
                        setExistsPhone(false)
                    }
                }).catch((err) => {
                    console.log(err, 'errorrrrrrrr')
                })
            })()
        }
    }, [values.phoneNumber, !Object.keys(errors)?.includes('phoneNumber')])


    return (
        <Box sx={{
            background: '#fff',
            px: 5,
            py: 2,
            borderRadius: 1
        }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    {/* {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>} */}

                    {emailTaken &&
                        <Typography
                            sx={{
                                lineHeight: 1.5,
                                fontSize: '15px',
                                color: 'red',
                                '& > span': {
                                    color: 'red', fontWeight: 'bold',
                                    fontSize: mdUp ? '16px' : '15px',
                                    mr: 1

                                },
                            }}
                        >
                            <span>{`Error:`}</span>Email already taken.
                        </Typography>

                    }

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <RHFTextField name="firstName" label="First name" />
                        <RHFTextField name="middleName" label="Middle name" />

                    </Stack>
                    <Stack>
                        <RHFTextField name="lastName" label="Last name" />

                    </Stack>

                    <Stack direction={{ xs: 'column' }} spacing={2}>
                        <RHFTextField name="address" label="Address" />
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                                <DatePicker
                                    label="Date of Birth"
                                    value={field.value}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!error,
                                            helperText: error?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <RHFTextField
                            helperText={(errors.email ? errors.email.message : '') || existsEmail && 'Email already used.'}
                            error={!!errors.email || existsEmail}
                            onChange={(e) => {
                                setValue('email', e.target.value);
                                methods.trigger('email'); // Validate on change
                            }}
                            type="email" name="email" label="Email" />



                        <RHFSelect
                            name="specialization" label="Specialization">

                            {
                                spec?.filter((item) => item?.name !== ' ')?.map((items: any) => (
                                    <MenuItem sx={{
                                        cursor: 'pointer'
                                    }} value={items?.id}>{items?.name}</MenuItem>
                                ))

                            }
                        </RHFSelect>

                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <RHFTextField 
                        type='number'
                        error={!!errors.phoneNumber || existsPhone}
                        helperText={(errors.phoneNumber ? errors.phoneNumber.message : '') || existsPhone && 'Phone already used'}
                        onChange={(e) => {
                          setValue('phoneNumber', e.target.value);
                          
                          methods.trigger('phoneNumber'); // Validate on change
                        }}
                        name="phoneNumber" label="Mobile Phone" />


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
                    {Object.keys(errors).length !== 0 && isPassError && openReq && <ErrorDialog />}


                    {/* {Object.keys(errors).length !== 0 && isPassError && openReq && <ErrorDialog />} */}

                    <LoadingButton
                        fullWidth
                        color="inherit"
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={loadingBtn}
                    >
                        Create account
                    </LoadingButton>

                    {renderLoginOption}
                    {noticeDialog}
                </Stack>
            </FormProvider>
        </Box>
    )
}

export default RegisterForm