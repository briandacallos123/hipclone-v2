'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import FormProvider, { RHFCheckbox, RHFEditor, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { Button, DialogActions, Divider, MenuItem, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { UpdateMerchantStock } from '@/libs/gqls/medecine';

// import MerchantContext from '@/context/workforce/merchant/MerchantContext';
//
import MerchantUserContext from '@/context/merchant/Merchant';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import NextAuthRegisterView from './next-auth-register-view';
import { revalidateStore } from '../_actions/store';
import StoreManageController from '@/sections/store_manage/view/storeManageController';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'src/components/snackbar';
import { UpdateOrderDeliveryHistory } from '@/libs/gqls/Orders';
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
    editRow?: any;
    editData?: any;
    isEdit?: boolean;
    refetch?: any;
};

// ----------------------------------------------------------------------

export default function MerchantDeliveryHistoryCreate({ editData, refetch, editRow, isEdit, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
    const { login, user } = useAuthContext();
    const path = usePathname();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const confirmApprove = useBoolean();

    const [updateMerchantMedFunc] = useMutation(UpdateOrderDeliveryHistory, {
        context: {
            requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const [errorMsg, setErrorMsg] = useState('');

    const searchParams: any = useSearchParams();


    const returnTo = searchParams.get('returnTo');

    const openReg = useBoolean();

    const password = useBoolean();


    const LoginSchema = Yup.object().shape({
        // status:yup.
    });

    const defaultValues = useMemo(() => {
        return {
            status_id: '',
            order_id: "",
            patient_email: ""
        }
    }, [editRow?.id, editRow, isEdit])

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = methods;

    const values = watch()



    useEffect(() => {
        if (editRow) {
            let lastItem = editRow?.delivery_history[editRow?.delivery_history.length - 1];

            setValue('status_id', Number(lastItem?.status_id?.id))
            setValue('order_id', editRow?.id);
            setValue('patient_email', editRow?.patient?.EMAIL);

        }
    }, [editRow?.id])



    const removeTags = (val: string) => {
        const cleanedDescription = val.replace(/<[^>]+>/g, '');
        return cleanedDescription;
    }
    const onSubmit = useCallback(
        async (data: any) => {
            onClose()
            confirmApprove.onFalse()
            try {
                await updateMerchantMedFunc({
                    variables: {
                        data: {
                            order_id: Number(data?.order_id),
                            status_id: Number(data?.status_id),
                            patient_email: data?.patient_email
                        }
                    }
                }).then((res) => {
                    refetch()
                    enqueueSnackbar('Updated successfully');
                   
                })
                onClose()
            } catch (error) {
                console.error(error);
                reset();
                setErrorMsg(typeof error === 'string' ? error : error.message);
            }
        },
        [id, login, path, reset, returnTo, user, isEdit]
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

    const handleRemoveAllFiles = useCallback(() => {
        setValue('attachment', null)
    }, [setValue]);

    const handleRemoveFile = useCallback(
        (inputFile: File | string) => {
            const filtered =
                values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
            setValue('attachment', filtered);
        },
        [setValue, values.attachment]
    );

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const files = values.attachment || null;


            const newFiles = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0])
            })

            console.log(newFiles, 'NEWFILES________')



            setValue('attachment', newFiles, { shouldValidate: true });
        },
        [setValue, values.attachment]
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
        <Stack spacing={2.5} sx={{ mt: 1 }}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <Stack spacing={1} direction={{ xs: 'column', lg: 'row' }} alignItems="center">
                {/* <RHFTextField name="stock" label="Supply" /> */}
                <RHFSelect name="status_id">
                    {/* <MenuItem value={13}>Approved</MenuItem> */}
                    <MenuItem value={5}>For Pick up</MenuItem>
                    {/* <MenuItem value={12}>Picked Up</MenuItem> */}
                    <MenuItem value={6}>Ongoing Delivery</MenuItem>
                    <MenuItem value={7}>Delivered</MenuItem>
                    <MenuItem value={8}>Failed Delivery</MenuItem>

                </RHFSelect>

            </Stack>





            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                variant="contained"
                onClick={()=>{
                    confirmApprove.onTrue();
                    onClose()
                }}
            >
                Update
            </LoadingButton>

            {/* {renderLoginOption} */}
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
                    sx: { maxWidth: 600 },
                }}
            >
                {/* {renderHead} */}
                <DialogTitle>{editRow ? "Update" : "Create"} Delivery History<br />
                    <Stack sx={{ mt: 2 }} direction="row" alignItems="center" gap={1}>
                        <Iconify icon="ooui:notice" sx={{ color: 'warning.main' }} />
                        <Typography variant="caption">Please note, you can view the whole history once you view the order.</Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        {/*<Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
            </Alert>*/}

                        {renderForm}
                    </FormProvider>
                </DialogContent>
            </Dialog>
            <FinalConfirm onSubmit={handleSubmit(onSubmit)} open={confirmApprove.value} onClose={()=>{
                confirmApprove.onFalse();
                onClose()
            }}/>

            {/* <NextAuthRegisterView open={openReg.value} onClose={openReg.onFalse} /> */}
        </>
    );
}


const FinalConfirm = ({ open, onClose, onSubmit }: any) => {
    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { maxWidth: 500 },
            }}
        >

            <DialogTitle>Are you sure you want to update this?</DialogTitle>
            <DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined">Cancel</Button>
                    <Button  onClick={onSubmit} variant="contained">Yes</Button>

                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}