'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Box, Button, Divider, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Tooltip } from '@mui/material';
import { signIn } from 'next-auth/react';
// import MerchantContext from '@/context/workforce/merchant/MerchantContext';
//
// import { UseMerchantMedContext } from '@/context/merchant/Merchant';
import { UseOrdersContext } from '@/context/dashboard/medecine/Medecine';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import NextAuthRegisterView from './next-auth-register-view';
import MedecineCreateView from './merchant-create-view';
import { Icon } from '@iconify/react';
import MedecineMerchantView from './medecine-create-merchant-view';
import ScanViewOrder from '@/sections/scan/ScanViewOrder';
import { PrescriptionsUserQr } from '@/libs/gqls/prescription';
import { useLazyQuery } from '@apollo/client';
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

// ----------------------------------------------------------------------

export default function MedecineCreateFullView({ editRow, isEdit, setLoggedIn, isLoggedIn, open, onClose, id }: Props) {
    const { login, user, socket } = useAuthContext();
    const path = usePathname();
    const { createOrder }: any = UseOrdersContext()
    const [errorMsg, setErrorMsg] = useState('');
    const [code, setCode] = useState(null);
    const [openScanner, setOpenScanner] = useState(false)
    // const presInp = useRef(null);
    const [presInput, setPresInput]:any = useState(null)
    const [openInp, setOpenInp] = useState(false)
    const [presData, setPresData] = useState(null)
    const [disableSubmit, setDisableSubmit] = useState(false)

    const [tabsVComplete, setTabsComplete] = useState({
        order: false,
        method: false,
        store: false,
        payment: false
    })

    const [getPrescription, { data, loading, error }] = useLazyQuery(PrescriptionsUserQr, {
        context: {
            requestTrackerId: 'prescriptions[QueryAllPrescriptionUserById]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (code || presInput) {

            if(presInput?.length < 4) return;

            getPrescription({
                variables: {
                    data: {
                        // pag prescription id, id yung key pag code, dapat presCode yung key
                        id: code || Number(presInput)
                    },
                },
            }).then(async (result: any) => {
                const { data } = result;

                if (data) {
                    const { QueryAllPrescriptionUserQr } = data;
                    setPresData(QueryAllPrescriptionUserQr?.Prescription_data)
                    setDisableSubmit(false)
                    // console.log(data, 'AWIWIAWIWIW_______________________________')
                    //   setCurrentItem(QueryAllPrescriptionUserQr?.Prescription_data)

                }
                // setIsLoading(false);
            });
        }
    }, [code, presInput])

    const [value, setValues] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValues(newValue);
    };

    const handleCode = (id: number) => {

    }


    const searchParams: any = useSearchParams();


    const returnTo = searchParams.get('returnTo');

    const openReg = useBoolean();

    const password = useBoolean();


    const customChecker = !openInp && !openScanner && {
        generic_name: Yup.string().required('Password is required'),
        dose: Yup.string().required('Password is required'),
        form: Yup.string().required('Password is required'),
        quantity: Yup.string().required('Password is required'),
    }

    const LoginSchema = Yup.object().shape({
       ...customChecker

    });

    const defaultValues = useMemo(() => {
        return {
            generic_name:  '',
            dose: '',
            form: "",
            quantity: "",
            method: "Pick Up",
            store_id: '',
            merchant_id: '',
            paid: 1,
            prescription_id:null

        }
    }, [editRow?.id, editRow, presData])






    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { isSubmitting },
    } = methods;


    const resetData = () => {
        setValue('generic_name','')
        setValue('dose','')
        setValue('form','')
        setValue('quantity','')
    }

    const values = watch()

    useEffect(() => {

    }, [editRow?.id, editRow])



    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            try {

                data.quantity = Number(data.quantity);

                data.is_deliver = (() => {
                    if (data?.method === "Pick Up") {
                        return 0
                    }
                    return 1;
                })()
                data.is_paid = 1;
                delete data.method;
                delete data.paid;

                console.log(presInput,'MERON BA?')
                if(presInput){
                    data.prescription_id = Number(presInput)
                }
               
                await createOrder({
                    ...data,

                })

                reset()
                setTabsComplete({
                    order: false,
                    method: false,
                    store: false,
                    payment: false
                })
                setValues(0)

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
        [id, login, path, reset, returnTo, user, isEdit, presInput]
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

    const checkPrev = (id: string) => {
        let isDone = false;
        // generic_name: '',
        // dose: '',
        // form: "",
        // quantity: "",
        if (id === 'order') {

            if (values.generic_name && values.dose && values.form && values.quantity) {
                isDone = true;
                // return;
            }
        } else if (id === 'method') {
            if (values.method) {
                isDone = true;
                // return;
            }
        } else if (id === 'store') {
            if (values.merchant_id) {
                isDone = true;
            }
        }

        return isDone
    }

    const renderForm = (
        <Stack spacing={2.5} sx={{ mt: 1 }}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

             <Box>
                <Stack spacing={1} direction="row" alignItems="center">
                    <RHFTextField disabled={openInp || openScanner} name="generic_name" label="Generic Name" />
                    <RHFTextField disabled={openInp || openScanner} name="dose" label="Dose" />

                </Stack>
                <Stack spacing={1} direction="row" alignItems="center">
                    <RHFTextField disabled={openInp || openScanner} name="form" label="Form" />
                    <RHFTextField disabled={openInp || openScanner} name="quantity" label="Quantity" />
                </Stack>
            </Box> 
            <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
                <Button onClick={()=>{
                    if(openScanner){
                        setOpenScanner(false)
                    }
                    setOpenInp(!openInp)
                    setDisableSubmit(true)
                    resetData()
                }}>Use Prescription# ?</Button>
                <Button onClick={()=>{
                      if(openInp){
                        setOpenInp(false)
                    }
                    resetData()
                    setDisableSubmit(true)
                    setOpenScanner(!openScanner)
                }}>Use Qr Code ?</Button>
            </Stack>


                {openInp && 
                <>
                 <Divider />
                 {/* <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">or prescription # </Typography> */}
                  <TextField onChange={(e)=>setPresInput(e.target.value)} label="Prescription #"/>
                  <Divider />
                </>
                }

{openScanner && 
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Tooltip title="Scan Qr">
                    <img  style={{
                        width: '30px',
                        cursor: 'pointer'
                    }} src="/assets/scannerAtMedicine.svg" alt="scanner" />
                </Tooltip>

                {/* {openScanner && <Stack>
                    <ScanViewOrder/>
            </Stack>} */}
                    </Stack>
                }


            {/* 
            <Divider />
           <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">or prescription # </Typography>
            <TextField label="prescription #"/>
            <Divider />

            <Stack gap={1} alignItems="center">
               {!openScanner &&  <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">or </Typography>}
                <Typography sx={{ textAlign: 'center', color: 'gray' }} variant="body2">scan prescription qr code </Typography>
                <Tooltip title="Scan Qr">
                    <img onClick={()=>setOpenScanner(!openScanner)} style={{
                        width: '30px',
                        cursor: 'pointer'
                    }} src="/assets/scannerAtMedicine.svg" alt="scanner" />
                </Tooltip>
            </Stack>
            {openScanner && <Stack>
                    <ScanViewOrder/>
            </Stack>} */}


            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                disabled={disableSubmit}
            >
                Submit
            </LoadingButton>
        </Stack>
    );

    const TABS = [
        {
            id: 1,
            label: "Delivery Method",
            val: 0,
        },
        {
            id: 2,
            label: "Merchant",
            val: 1,
        },
        {
            id: 3,
            label: "Order",
            val: 2,
        },

        // {
        //     id: 4,
        //     label: "Payment Method",
        //     val: 3
        // },
    ]


    const renderDelivery = (
        <Stack>

            {/* <InputLabel id="demo-simple-select-label">Method</InputLabel> */}
            <Stack direction="row" gap={2} sx={{ mb: 3 }}>
                <Iconify icon="gridicons:notice" />
                <Typography sx={{ color: 'gray' }} variant="body2">Please note that delivery varies depending on location and merchant pricing.</Typography>
            </Stack>
            <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="center" gap={3}>

                <Select
                    // labelId=""
                    id="demo-simple-select"
                    value={getValues('method')}
                    onChange={(e) => {
                        // console.log(e.target.value,'VAA@@')
                        const val = e.target.value;
                        setValue('method', val)
                    }}
                    // value={age}
                    label="Method"
                // onChange={handleChange}
                >

                    <MenuItem value="Pick Up">Pick Up</MenuItem>
                    <MenuItem value="For Delivery">For Delivery</MenuItem>
                </Select>
            </Stack>
            <Box>
                <LoadingButton
                    fullWidth
                    color="inherit"
                    size="large"
                    // type="submit"
                    variant="contained"
                    // loading={isSubmitting}
                    onClick={() => {
                        const isDone = checkPrev('method')
                        // console.log(isDone,'ISDONE_______')
                        if (isDone) {
                            setTabsComplete({ ...tabsVComplete, method: true })
                            setValues(1)
                        }
                    }}
                >
                    Proceed
                </LoadingButton>
            </Box>
        </Stack>
    )

    const handleStore = (store: any) => {

        // // setValue('store',storeId)
        // console.log(storeId,'????????????')
        setValue('store_id', store?.store?.id)
        setValue('merchant_id', store?.id)



    }

    console.log(values, 'vLA?')

    useEffect(() => {
        const isDone = checkPrev('store')

        if (isDone) {
            setTabsComplete({ ...tabsVComplete, store: true })
            setValues(2)
        }
    }, [getValues('store_id')])

    // useEffect(()=>{
    //     const isDone = checkPrev('store')

    //     if(isDone){
    //         onSubmit(values)
    //     }
    // },[getValues('merchant_id')])

    return (
        <>
            <Dialog
                fullWidth
                maxWidth={false}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { maxWidth: value === 1 ? 1300 : 800 },

                }}
            >
                {/* {renderHead} */}
                <DialogTitle>{editRow ? "Update" : "Create"} New Medecine</DialogTitle>

                <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="disabled tabs example">
                    {/* <Tab label="Active" />
                    <Tab label="Disabled" disabled={}/>
                    <Tab label="Active" /> */}

                    {TABS?.map(({ val, label }) => (
                        <Tab label={label} disabled={value !== val} />
                    ))}
                </Tabs>

                <Stack alignItems="center" sx={{
                    p: 5
                }}>

                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

                        {value === 0 && renderDelivery}
                        {value === 1 && <MedecineMerchantView handleStore={handleStore} />}

                        {value === 2 && renderForm}
                        {/* {value === 3 && <h1>Hello</h1>} */}
                    </FormProvider>
                </Stack>
            </Dialog>

            {/* <NextAuthRegisterView open={openReg.value} onClose={openReg.onFalse} /> */}
        </>
    );
}
