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
import { Divider, MenuItem } from '@mui/material';
import { signIn } from 'next-auth/react';

// import MerchantContext from '@/context/workforce/merchant/MerchantContext';
//
import MerchantUserContext from '@/context/merchant/Merchant';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import NextAuthRegisterView from './next-auth-register-view';
import { revalidateStore } from '../_actions/store';
import StoreManageController from '@/sections/store_manage/view/storeManageController';
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
    editData?:any;
    isEdit?: boolean
};

// ----------------------------------------------------------------------

export default function MerchantCreateView({editData, editRow, isEdit, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
    const { login, user } = useAuthContext();
    const path = usePathname();
    const { state, createMerchantMedFunc, updateMerchantMedFunc}: any = MerchantUserContext()

    const [errorMsg, setErrorMsg] = useState('');

    const searchParams: any = useSearchParams();


    const returnTo = searchParams.get('returnTo');

    const openReg = useBoolean();

    const password = useBoolean();

    // console.log(editData,'EDIT DATAAAAAAAAAAAAAAAAAAAAAAA')

    const LoginSchema = Yup.object().shape({
        generic_name: Yup.string().required('Password is required'),
        dose: Yup.string().required('dose is required'),
        form: Yup.string().required('form is required'),
        price: Yup.string().required('price is required'),
        manufacturer: Yup.string().required('manufacturer is required'),
        brand_name: Yup.string().required('brand_name is required'),
        stock: Yup.string().required('stock is required'),
        description: Yup.string().required('description is required'),
        attachment: Yup.mixed().required('Attachment is required'),
        type: Yup.string().required('type is required'),
        show_price: Yup.string().required('show_price is required'),

    });

    const defaultValues = useMemo(() => {
        return {
            generic_name: editData?.generic_name || '',
            dose: editData?.dose || '',
            form: editData?.form || "",
            price: editData?.price || "",
            manufacturer: editData?.manufacturer || "",
            brand_name:editData?.brand_name || "",
            attachment: null,
            description:editData?.description || "",
            stock: editData?.stock || '',
            id,
            type: "",
            show_price: false
        }
    }, [editRow?.id, editRow, isEdit])

  




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
        watch,
        formState: { isSubmitting },
    } = methods;

    const values = watch()

    useEffect(() => {
        if(isEdit){
            setValue('generic_name', editData?.generic_name)
            setValue('dose', editData?.dose)
            setValue('form', editData?.form)
            setValue('price',  editData?.price)
            setValue('type',  editData?.type)
            setValue('manufacturer', editData?.manufacturer)
            setValue('brand_name', editData?.brand_name)
            setValue('stock', editData?.stock)
            setValue('description', editData?.description)
            setValue('id', editData?.id)
            setValue('attachment',`/${editData?.attachment_info?.file_path?.split("/").splice(1).join("/")}`)

        }else{
            reset()
        }
    }, [editRow?.id, editData, isEdit])

    

    const removeTags = (val: string) => {
        const cleanedDescription = val.replace(/<[^>]+>/g, '');
        return cleanedDescription;
    }
    const onSubmit = useCallback(
        async (data: any) => {
            try {
                const file = data?.attachment;
                delete data.attachment;
                data.description = removeTags(data.description)
                data.show_price = JSON.parse((data.show_price).toLowerCase())
                data = { ...data, price: parseFloat(data.price), store_id: Number(data.id), stock: Number(data.stock) }

                

                if(isEdit){
                    await updateMerchantMedFunc(data, file)
                }else{
                    delete data.id
                    await createMerchantMedFunc(data, file)

                }
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
            <Stack spacing={1} direction={{xs:'column',lg:'row'}} alignItems="center">
                <RHFTextField name="generic_name" label="Generic Name" />
                <RHFSelect name="type" label="Type">

                    <MenuItem value="branded">
                        Branded
                    </MenuItem>
                    <MenuItem value="generic">
                        Generic
                    </MenuItem>

                </RHFSelect>
            </Stack>
            <Stack spacing={1} direction={{xs:'column',lg:'row'}} alignItems="center">

                <RHFTextField name="dose" label="Dose" />
                <RHFTextField name="form" label="Form" />
            </Stack>
            <Stack spacing={1} direction={{xs:'column',lg:'row'}} alignItems="center">
                <RHFTextField name="price" label="Price" />
                <RHFTextField name="manufacturer" label="Manufacturer" />

            </Stack>
            <Stack spacing={1}>
                <RHFCheckbox sx={{ ml: 1 }} name="show_price" label="Show Price?" />

            </Stack>
            <Stack direction={{xs:'column',lg:'row'}} spacing={1} alignItems="center">
                <RHFTextField name="brand_name" label="Brand Name" />
                <RHFTextField name="stock" label="Stocks" type="number" />
            </Stack>
            <Stack direction="row" alignItems="center">
                <RHFTextField
                    name="description"
                    multiline
                    fullWidth
                    rows={4}
                    placeholder='Tell something about this medecine...'
                    sx={{
                        p: 1,
                    }}
                />
                {/* <RHFEditor simple placeholder='Tell something about the medecine...' name="description" /> */}
            </Stack>
            <Stack>
                <RHFUpload
                    //   multiple
                    thumbnail
                    //   accept={{ 'application/pdf': [], 'image/png': [], 'image/jpg': [], 'image/jpeg': [] }}  // only pdf & img
                    name="attachment"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
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
                Create
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
                <DialogTitle>{editRow ? "Update" : "Create"} New Medecine</DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        {/*<Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
            </Alert>*/}

                        {renderForm}
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* <NextAuthRegisterView open={openReg.value} onClose={openReg.onFalse} /> */}
        </>
    );
}
