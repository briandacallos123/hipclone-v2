
import React, { useCallback, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, DialogContent, Grid, InputAdornment, MenuItem, Stack } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { LogoFull } from '@/components/logo';
import FormProvider, { RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar } from '@/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { fData } from '@/utils/format-number';
import OrderDetailsHistory from '../order-details-history';

type OrderViewProp = {
    open: boolean;
    onClose: () => void;
    dataView: any;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const OrderView = ({ dataView, open, onClose }: OrderViewProp) => {


    const defaultValues = useMemo(() => ({
        genericName: dataView?.generic_name || "",
        brandName: dataView?.brand_name || "",
        address: dataView?.patient?.HOME_ADD || "",
        dose: dataView?.dose || "",
        form: dataView?.form || "",
        store: dataView?.store?.name || "",
        attachment: dataView?.attachment || "",
        status: "",
        quantity: Number(dataView?.quantity) || "",
        price: dataView?.price || "",
        value: dataView?.value || "",
        payment: dataView?.payment || '',
        paymentStatus: "",
    }), [dataView?.id])


    const UpdateUserSchema = Yup.object().shape({
        // fname: Yup.string().required('First Name is required'),
    });

    const methods = useForm<any>({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const onSubmit = () => {
        try {

        } catch (error) {
            console.error(error);
        }
    };

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        reset,
        getValues,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (dataView) {
            setValue('genericName', dataView?.generic_name);
            setValue('brandName', dataView?.brand_name);
            setValue('address', dataView?.patient?.HOME_ADD);
            setValue('dose', dataView?.dose);
            setValue('form', dataView?.form);
            setValue('store', dataView?.store?.name);
            // setValue('attachment', dataView?.attachment);
            setValue('quantity', dataView?.quantity);
            setValue('price', dataView?.price);
            setValue('value', dataView?.value);
            setValue('payment', dataView?.payment);
            setValue('reference', dataView?.online_reference);
            setValue('status', dataView?.status_id);
            setValue('paymentStatus', dataView?.is_paid);



        }
    }, [dataView?.id])

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });


            if (file) {
                setValue('attachment', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleRemoveFile = useCallback(
        (inputFile: File | string) => {
            const filtered =
                values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
            setValue('attachment', filtered);
        },
        [setValue]
    );

    const handleRemoveAllFiles = useCallback(() => {
        setValue('attachment', null)
    }, [setValue]);

    const data = {
        timeline:[
            {
                title:"Hello",
                time:"05 Aug 2024 2:58 pm"
            },
            {
                title:"Hello",
                time:"05 Aug 2024 2:58 pm"
            },
            {
                title:"Hello",
                time:"05 Aug 2024 2:58 pm"
            }
        ]
    }


    return (
        <Box>

            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <LogoFull disabledLink />
                        <Typography sx={{ ml: 5, flex: 1 }} variant="h6" component="div">
                            Order View
                        </Typography>
                        {/* <Button sx={{ mr: 2, display: { xs: 'none', lg: 'block' } }} autoFocus variant="outlined" onClick={onClose}>
                            View PDF
                        </Button> */}
                        <Button sx={{ display: { xs: "none", lg: "block" } }} autoFocus variant="contained" onClick={onClose}>
                            Close
                        </Button>
                    </Toolbar>
                </AppBar>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Box sx={{
                            maxWidth: 1400,
                            margin: '0 auto',
                            my: { xs: 5, lg: 10 }
                        }}>
                            <Grid container gap={2} justifyContent="space-between">
                                <Grid item xs={12} lg={8} rowSpacing={2}>

                                    <Box
                                        rowGap={{ md: 3, xs: 2 }}
                                        columnGap={{ md: 2, xs: 1 }}
                                        display="grid"
                                        gridTemplateColumns={{
                                            xs: 'repeat(1, 1fr)',
                                            sm: 'repeat(1, 1fr)',
                                        }}
                                    >
                                        <Box
                                            rowGap={{ md: 3, xs: 2 }}
                                            columnGap={{ md: 2, xs: 1 }}
                                            display="grid"
                                            gridTemplateColumns={{
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(2, 1fr)',
                                            }}
                                        >
                                            <RHFTextField fullWidth InputProps={{
                                                readOnly: true,
                                            }} name="genericName" label="Generic Name" />
                                            <RHFTextField InputProps={{
                                                readOnly: true,
                                            }} name="brandName" label="Brand Name" />
                                        </Box>

                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="address" label="Address" />

                                        <Box
                                            rowGap={{ md: 3, xs: 1 }}
                                            columnGap={{ md: 2, xs: 1 }}
                                            display="grid"
                                            gridTemplateColumns={{
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(2, 1fr)',
                                            }}
                                        >
                                            <RHFTextField InputProps={{
                                                readOnly: true,
                                            }} name="dose" label="Dose" />
                                            <RHFTextField InputProps={{
                                                readOnly: true,
                                            }} name="form" label="Form" />
                                        </Box>
                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="store" label="Store Name" />

                                        {/* <RHFUpload

                                            thumbnail
                                            disabled
                                            name="attachment"
                                            maxSize={3145728}
                                            onDrop={handleDrop}
                                            onRemove={handleRemoveFile}
                                            onRemoveAll={handleRemoveAllFiles}
                                        /> */}
                                        <OrderDetailsHistory history={dataView?.delivery_history}/>

                                    </Box>


                                </Grid>
                                <Grid item xs={12} lg={3}>

                                    <Box
                                        rowGap={{ md: 3, xs: 2 }}
                                        columnGap={{ md: 2, xs: 1 }}
                                        display="grid"
                                        sx={{
                                            width: '100%'
                                        }}
                                        gridTemplateColumns={{
                                            xs: 'repeat(1, 1fr)',
                                            sm: 'repeat(1, 1fr)',
                                        }}
                                    >
                                        <RHFSelect InputProps={{
                                            readOnly: true,
                                        }} name="status" label="Status">
                                            <MenuItem value={1}>Pending</MenuItem>
                                            <MenuItem value={2}>Approve</MenuItem>
                                            <MenuItem value={3}>Cancelled</MenuItem>
                                            <MenuItem value={4}>Done</MenuItem>


                                        </RHFSelect>

                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="quantity" label="Quantity" />

                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="price" label="Price" />

                                        <RHFTextField

                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                            }} name="value" label="Total" />

                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="payment" label="Payment" />

                                        <RHFTextField InputProps={{
                                            readOnly: true,
                                        }} name="reference" label="Reference Number" />

                                        <RHFSelect InputProps={{
                                            readOnly: true,
                                        }} name="paymentStatus" label="Payment Status">
                                            <MenuItem value={1}>Paid</MenuItem>
                                            <MenuItem value={0}>Unpaid</MenuItem>

                                        </RHFSelect>
                                        <Stack  flexDirection="row" justifyContent="flex-end" sx={{mt:5}}>
                                            {/* <Button sx={{ mr: 2, display: { lg: 'none' } }} autoFocus variant="outlined" onClick={onClose}>
                                                View PDF
                                            </Button> */}
                                            <Button sx={{ display: { lg: "none" } }} autoFocus variant="contained" onClick={onClose}>
                                                Close
                                            </Button>
                                        </Stack>
                                    </Box>

                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                </FormProvider>

            </Dialog>
        </Box>
    )
}

export default OrderView