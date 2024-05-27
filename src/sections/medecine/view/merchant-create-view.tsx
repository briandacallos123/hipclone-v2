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
import Typography from '@mui/material/Typography';
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
import { Divider, Tooltip } from '@mui/material';
import { signIn } from 'next-auth/react';
// import MerchantContext from '@/context/workforce/merchant/MerchantContext';
//
// import { UseMerchantMedContext } from '@/context/merchant/Merchant';
import { UseOrdersContext } from '@/context/dashboard/medecine/Medecine';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import NextAuthRegisterView from './next-auth-register-view';

// ----------------------------------------------------------------------

type FormValuesProps = {
    email: string;
    password: string;
};

type Props = {
    open: boolean;
    onClose: VoidFunction;
    id?: NULL | string;
    isLoggedIn?: any;
    setLoggedIn?: any;
    editRow?:any;
    isEdit?:boolean
};

// ----------------------------------------------------------------------

export default function MedecineCreateView({editRow, isEdit, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
    const { login, user } = useAuthContext();
    const path = usePathname();
    const {createOrder}:any = UseOrdersContext()
    const [errorMsg, setErrorMsg] = useState('');

    const searchParams: any = useSearchParams();


    const returnTo = searchParams.get('returnTo');

    const openReg = useBoolean();

    const password = useBoolean();
    
 
    

    const LoginSchema = Yup.object().shape({
        generic_name: Yup.string().required('Password is required'),
        dose: Yup.string().required('Password is required'),
        form: Yup.string().required('Password is required'),
        quantity: Yup.string().required('Password is required'),
       
    });

    const defaultValues = useMemo(()=>{
       return {
        generic_name:'',
        dose: '',
        form: "",
        quantity:"",
        
      
       }
    },[editRow?.id, editRow])




//     <Stack spacing={1} direction="row" alignItems="center">

//     <RHFTextField name="firstName" label="First Name" />
//     <RHFTextField name="middleName" label="Middle Name" />
// </Stack>
// <Stack spacing={1} direction="row" alignItems="center">
//     <RHFTextField name="lastName" label="Last Name" />
//     <RHFTextField name="contact" label="Contact" />
// </Stack>


    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    useEffect(()=>{
        // if(editRow?.id){
        //     setValue('email', editRow?.email)
        //     setValue('firstName', editRow?.first_name)
        //     setValue('lastName', editRow?.last_name)
        //     setValue('middleName', editRow?.middle_name)
        //     setValue('contact', editRow?.contact)
        //     setValue('id', editRow?.id)
        // }else{
        //     reset()
        // }
        // setValue('contact', editRow?.contact)
    },[editRow?.id, editRow])

    // useEffect(() => {
    //   if (user) {
    //     console.log(user, 'HAAAAAAAAAAAAAAAAAAAAAAAAAAAA?');
    //   }
    // }, [user]);

    //  console.log(user, 'HAAAAAAAAAAAAAAAAAAAAAAAAAAAA?');

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            try {
                // const qty = data?.quantity;
                // delete data?.quantity
                createOrder({
                    ...data,
                    // quantity:Number(qty)
                })
                // delete data.repassword

                // if(isEdit){
                //     // alert("bakit")
                //     delete data.password
                //     await UpdateMerchantFunc(data)
                // }else{

                //     delete data.id
                //     await createMerchantFunc(data)
                // }
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
        <Stack spacing={2.5} sx={{ mt: 1, w:'100%' }}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
           
            <Stack spacing={1} direction="row" >
                 <RHFTextField fullWidth name="generic_name" label="Generic Name" />
                <RHFTextField name="dose" label="Dose" />
                
            </Stack>
            <Stack spacing={1} direction="row" alignItems="center">
             <RHFTextField name="form" label="Form" />
                <RHFTextField name="quantity" label="Quantity" />
            </Stack>
            

         

            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Proceed
            </LoadingButton>

            
            <Divider/>
            <Stack gap={1} alignItems="center">
                <Typography sx={{textAlign:'center', color:'gray'}} variant="body2">or </Typography>
                <Typography sx={{textAlign:'center', color:'gray'}} variant="body2">scan prescription qr code </Typography>
                <Tooltip title="Scan Qr">
                    <img style={{
                        width:'30px',
                        cursor:'pointer'
                    }} src="/assets/scannerAtMedicine.svg" alt="scanner" />
                </Tooltip>
            </Stack>

          
        </Stack>
    );

  
    return (
        <>
        <Stack sx={{maxWidth:700}}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                       

                       {renderForm}
                   </FormProvider>
        </Stack>
            {/* <Dialog
                fullWidth
                maxWidth={false}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { maxWidth: 600 },
                }}
            >
                <DialogTitle>{editRow? "Update":"Create"} New Medecine</DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                       

                        {renderForm}
                    </FormProvider>
                </DialogContent>
            </Dialog> */}

           
        </>
    );
}
