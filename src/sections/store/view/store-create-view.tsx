'use client';

import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
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
import FormProvider, { RHFCheckbox, RHFTextField, RHFMultiCheckbox, RHFEditor,RHFAutocomplete, RHFUpload, RHFAutocompleteAp } from 'src/components/hook-form';
import { Box, Divider, Tooltip } from '@mui/material';
import { signIn } from 'next-auth/react';
// import MerchantContext from '@/context/workforce/merchant/MerchantContext';
//
// import { UseMerchantMedContext } from '@/context/merchant/Merchant';
import { UseOrdersContext } from '@/context/dashboard/medecine/Medecine';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import NextAuthRegisterView from './next-auth-register-view';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { formatClinicTime } from '@/utils/format-time';
import storeController from '../StoreController';
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
    editRow?: any;
    isEdit?: boolean
};

const complete_option = [
    'medecine','foods'
]

// ----------------------------------------------------------------------
const APPOINTMENT_DAY = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tueday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];
  
export default function StoreCreateView({ editRow, isEdit, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
    const { login, user } = useAuthContext();
    const path = usePathname();
    const { createOrder }: any = UseOrdersContext()
    const [errorMsg, setErrorMsg] = useState('');
    const {handleSubmitCreate} = storeController()
    const searchParams: any = useSearchParams();


    const returnTo = searchParams.get('returnTo');

    const openReg = useBoolean();

    const password = useBoolean();




    const LoginSchema = Yup.object().shape({
        // storeName: Yup.string().required('Password is required'),
        // address: Yup.string().required('Password is required'),
        // start_time: Yup.string().required('Password is required'),
        // end_time: Yup.string().required('Password is required'),
        // delivery: Yup.string().required('Password is required'),


    });

    const defaultValues = useMemo(() => {
        return {
            storeName: '',
            storeAdd : '',
            start_time: "",
            end_time: "",
            attachment: null,
            description:"",
            delivery:"",
            product_types:[],
            days:[]
        }
    }, [editRow?.id, editRow])



    const removeTags = (val:string) => {
        const cleanedDescription = val.replace(/<[^>]+>/g, '');
        return cleanedDescription;
    }


    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { isSubmitting },


    } = methods;

    const values = watch()



    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            data.description = removeTags(data.description)
            // data.start_time = 
            // data.end_time = formatClinicTime(data.end_time)
            const start_time = formatClinicTime(data.start_time)
            const end_time = formatClinicTime(data.end_time)

           
            delete data.start_time;
            delete data.end_time;

         
           const newData = {...data}
           newData.startTime = start_time;
           newData.endTime = end_time;



            try {
                handleSubmitCreate(newData)
             
                onClose()
            } catch (error) {
                console.error(error);
                reset();
                setErrorMsg(typeof error === 'string' ? error : error.message);
            }
        },
        [id, login, path, reset, returnTo, user, isEdit]
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


    const handleRemoveFile = useCallback(
        (inputFile: File | string) => {
            const filtered =
                values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
            setValue('attachment', filtered);
        },
        [setValue, values.attachment]
    );

    const handleRemoveAllFiles = useCallback(() => {
        setValue('attachment', null)
    }, [setValue]);

    const renderForm = (
        <Stack spacing={2.5} sx={{ mt: 1, w: '100%' }}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Stack spacing={1} direction="row" >
                <RHFTextField fullWidth name="storeName" label=" Name" />
                <RHFTextField fullWidth name="storeAdd" label="Address" />

            </Stack>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                }}
            >
                <Controller
                    name="start_time"
                    control={control}
                    render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                        <TimePicker
                            label="Start Time"
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

                <Controller
                    name="end_time"
                    control={control}
                    render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                        <TimePicker
                            label="End Time"
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
            </Box>
            <RHFMultiCheckbox
                row
                name="days"
                label="Appointment Days"
                options={APPOINTMENT_DAY}
                defaultChecked={defaultValues?.days?.map((value: any) =>
                  APPOINTMENT_DAY.includes(value)
                )}
              />
            <Stack>
                <RHFAutocompleteAp options={complete_option} name="product_types"/>
            </Stack>
            <RHFCheckbox name="delivery" label="Do you do delivery?" />
            <Stack direction="row" alignItems="center">
                <RHFEditor placeholder='Tell something about the medecine...' name="description" />

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
                Proceed
            </LoadingButton>


            {/* <Divider />
            <Stack gap={1} alignItems="center">
                <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">or </Typography>
                <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">scan prescription qr code </Typography>
                <Tooltip title="Scan Qr">
                    <img style={{
                        width: '30px',
                        cursor: 'pointer'
                    }} src="/assets/scannerAtMedicine.svg" alt="scanner" />
                </Tooltip>
            </Stack> */}


        </Stack>
    );


    return (
        <>
            {/* <Stack sx={{maxWidth:700}}>
            
        </Stack> */}
            <Dialog
                fullWidth
                maxWidth={false}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { maxWidth: 600 },
                }}
            >
                <DialogTitle>{editRow ? "Update" : "Create"} New Store</DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>


                        {renderForm}
                    </FormProvider>
                </DialogContent>
            </Dialog>


        </>
    );
}