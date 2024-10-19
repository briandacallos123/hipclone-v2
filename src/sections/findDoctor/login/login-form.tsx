import React from 'react'

import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, IconButton, Stack, Divider, InputAdornment, Typography, Link, Alert } from '@mui/material';
import FormProvider, { RHFTextField } from '@/components/hook-form';
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
import { useAuthContext } from '@/auth/hooks';
import { usePathname } from 'next/navigation';
import { PATH_AFTER_LOGIN } from '@/config-global';


const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
        .required('Password is required')

});

const LoginForm = () => {
    const { login, user } = useAuthContext();
    const path = usePathname();
    const [errorMsg, setErrorMsg] = useState('');

    const confirmPassword = useBoolean();
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
        email: '',
        password: "",
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
        formState: { isSubmitting, errors },
    } = methods;

    const [loadingBtn, setLoadingBtn] = useState(false)

    const [myData, setMyData]: any = useState(null);
    const [snackKey, setSnackKey]: any = useState(null);

    const handleSubmitValue = useCallback(async (fData) => {

        login?.(fData.email, fData.password, 'patient', path).then(() => {
            setLoadingBtn(false)
            closeSnackbar(snackKey);
            window.location.href = PATH_AFTER_LOGIN
            enqueueSnackbar('Login Successfully')
        }).catch((err) => {
            setLoadingBtn(false)
            closeSnackbar(snackKey);
            setSnackKey(null)
            enqueueSnackbar(err.message, { variant: 'error' })

        })



    }, [snackKey])

    useEffect(() => {
        if (snackKey || myData) {

            (async () => {
                await handleSubmitValue({ ...myData });
            })();

            console.log("Wala na dito")
        }
    }, [snackKey, myData]);
    console.log(myData, "myData myData")

    const onSubmit = useCallback(
        async (data: any) => {
            const s = bcrypt.genSaltSync(12);

            try {
                setLoadingBtn(true)

                const snackbarKey: any = enqueueSnackbar('Saving Data...', {
                    variant: 'info',
                    key: 'savingEducation',
                    persist: true, // Do not auto-hide
                });
                console.log("nag run naman")
                setSnackKey(snackbarKey);
                setMyData(data)



            } catch (error) {
                setLoadingBtn(false)

                setErrorMsg(typeof error === 'string' ? error : error.message);
            }
        },
        [snackKey, myData]
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
                If you don't have an account,
                <Link href={paths.doctor.register}>{` Sign up`}</Link><br />
            </Typography>

        </div>
    );


    return (
        <Box sx={{
            background: '#fff',
            px: 5,
            py: 5,
            borderRadius: 1
        }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5} sx={{ mt: 1 }}>

                    {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <RHFTextField name="email" label="Email" />
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



                    </Stack>

                    {/* {Object.keys(errors).length !== 0 && isPassError && openReq && <ErrorDialog />} */}

                    <LoadingButton
                        fullWidth
                        color="inherit"
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={loadingBtn}
                    >
                        Login
                    </LoadingButton>
                    {renderLoginOption}

                </Stack>
            </FormProvider>
        </Box>
    )
}

export default LoginForm