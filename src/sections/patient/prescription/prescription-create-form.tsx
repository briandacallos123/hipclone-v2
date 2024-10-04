import React, { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { Box, Button, IconButton, MenuItem, Paper, Stack, Typography } from '@mui/material';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@/auth/hooks';
import { MutationPrescription } from '@/libs/gqls/prescription';
import { useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'src/components/snackbar';
import { Icon } from '@iconify/react'
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';
import Image from '@/components/image';


const PrescriptionCreateForm = ({
    currentItem: myCurrent,
    clinicData: clinic,
    removeItem,
    clearItem,
    refetch,
    closeCreate,
    handleClose
}: any) => {
    const [currentItem, setCurrentItem] = useState([])

    console.log(currentItem, 'wew')

    useEffect(() => {
        if (myCurrent.length) {
            setCurrentItem([...currentItem, ...myCurrent])
        }
    }, [myCurrent])

    useEffect(() => {
        clearItem()
    }, [currentItem])

    const { user } = useAuthContext();
    const { id: uuid } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();



    const [createEmr] = useMutation(MutationPrescription, {
        context: {
            requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const [isTemplateR, setTemplareR] = useState(false)

    const isTemplateRequired = {
        templateName:Yup.string().required('Template Name'),
    }

    const ewan = isTemplateR && {...isTemplateRequired}

    console.log(ewan,'ewannnn')
    const NewPrescriptionSchema = Yup.object().shape({
        items: Yup.array().of(
            Yup.object().shape({
                MEDICINE: Yup.string().required('Medicine is required'),
                MED_BRAND: Yup.string().required('Medicine Brand is required'),
                DOSE: Yup.string().required('Dose is required'),
                FORM: Yup.string().required('Form is required'),
                QUANTITY: Yup.string().required('Quantity is required'),
                FREQUENCY: Yup.string().required('Frequency is required'),
                DURATION: Yup.string().required('Duration is required'),
            })
        ),
        hospitalId: Yup.string().required('Clinic Id is required'),
        ...ewan
    });



    const defaultValues = useMemo(() => ({
        hospitalId: null,
        items: [
            // {
            //     MEDICINE: '',
            //     MED_BRAND: '',
            //     DOSE: '',
            //     FORM: '',
            //     QUANTITY: '',
            //     FREQUENCY: '',
            //     DURATION: '',
            //     is_favorite: ''
            // },
        ],
        doctorID: String(user?.id),
        DOCTOR: String(user?.doctorId),
    }), [user]);

    const methods = useForm({
        resolver: yupResolver(NewPrescriptionSchema),
        defaultValues,
    });

    const { control, handleSubmit, reset, watch } = methods;

    const values = watch();

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'items',
    });


    useEffect(()=>{
        if(values?.isTheme){
            setTemplareR(true)
        }else{
            setTemplareR(false)
        }
    },[values.isTheme])



    const [prevCurrentItem, setPrevCurrentItem] = useState(currentItem);

    useEffect(() => {
        if (Array.isArray(currentItem) && currentItem?.length > 0 && currentItem !== prevCurrentItem) {
            // Clear existing fields
            remove(); // Clear all fields at once

            // Append new items
            currentItem?.forEach(item => {
                append({
                    MEDICINE: item.name || '',
                    MED_BRAND: item.brand || '',
                    DOSE: item.dose || null,
                    FORM: item.form || '',
                    QUANTITY: item.quantity || null,
                    FREQUENCY: item.frequency || null,
                    DURATION: item.duration || null,
                    is_favorite: item?.isFavorite || null
                });
            });

            // Update previous current item
            setPrevCurrentItem(currentItem);
        }
    }, [currentItem, append, remove, prevCurrentItem]);

    const onSubmit = useCallback(
        async (model: any) => {
            // return;

            const data: any = {
                CLINIC: Number(model.hospitalId),
                DOCTOR: model.DOCTOR,
                doctorID: Number(model.doctorID),
                uuid: uuid,
                emrId: Number(model?.emrId),
                PATIENT: model?.PATIENT,
                patientID: Number(model?.patientID),
                isEmr: Number(model.isEmr),
                tempId: model.tempId,
                templateName:model?.templateName,
                isTemplate:model?.isTheme,
                Prescription_Child_Inputs: model?.items?.map((item) => {
                    delete item.id;

                    if (item?.is_favorite) {
                        return {
                            ...item,
                            is_favorite: 1
                        }
                    } else {
                        return {
                            ...item,
                            is_favorite: 0
                        }
                    }
                }),
            };
            createEmr({
                variables: {
                    data,
                },
            })
                .then(async (res) => {
                    const { data } = res;
                    reset();
                    clearItem()
                    enqueueSnackbar('Created successfully!');
                    refetch()
                })
                .catch((error) => {
                    enqueueSnackbar('Something went wrong', { variant: 'error' });

                });
        },
        [uuid]
    );

    const handleRemove = (index: number) => {
        remove(index);
        removeItem(index);
    };

    const popover = usePopover();
    const confirm = useBoolean();




    const handleDelete = (row, index) => {
        handleRemove(index)
        const newItem = currentItem?.filter((item, indexs) => index !== indexs)
        setCurrentItem(newItem)
    }

    const handleFavorite = useCallback((row) => {


        const newItems = fields?.map((item) => {
            if (row?.id === item?.id) {
                if (row?.is_favorite) {
                    return { ...item, is_favorite: false }
                }
                else {

                    enqueueSnackbar('Added to favorites!');

                    return { ...item, is_favorite: true }

                }
            } else {
                return item;
            }
        })
        console.log(newItems, 'new itemssssss')
        replace(newItems);


    }, [fields])

    const resetAll = useCallback(() => {

        setCurrentItem([])
        handleClose()
    }, [])

    useEffect(() => {
        if (closeCreate) {
            reset()
            replace([])
        }
    }, [closeCreate])

    const handleCreate = () => {
        setCurrentItem((prev) => {
            return [...prev, {
                MEDICINE: '',
                MED_BRAND: '',
                DOSE: '',
                FORM: '',
                QUANTITY: '',
                FREQUENCY: '',
                DURATION: ''
            }]
        })
        // append({

        // });
    }

    console.log(values.isTheme,'????huh')

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{ pt: 1, height: '100%' }}>


                <Stack direction='row' justifyContent={values?.isTheme ? 'space-between':'flex-end'} sx={{width:'100%'}}>


                 {values.isTheme && <RHFTextField sx={{
                    maxWidth:{lg:400},
                 }} size="small" name={`templateName`} label="Template Name" />}

                    <RHFSwitch
                        sx={{
                            flex: 1
                        }}
                        name="isTheme"
                        label="Set this as new template"
                    />
                    
                </Stack>

                <RHFAutocomplete
                    name="hospitalId"
                    label="Hospital/Clinic"
                    options={clinic?.doctorClinics?.map((hospital: any) => hospital?.id) || []}
                    getOptionLabel={(option) =>
                        clinic?.doctorClinics?.find((hospital: any) => hospital.id === option)?.clinic_name
                    }
                />

            

                {currentItem?.length === 0 && !fields?.length &&
                    <Box rowGap={2} sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-0%, -50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Image
                            src={'/assets/no-data.svg'}
                            sx={{
                                width: 150,
                                height: 150
                            }}
                            alt="no data"
                        />
                        <Typography variant="h4" sx={{
                            color: 'gray'
                        }}>
                            No prescription selected!
                        </Typography>
                        <Button size='large' onClick={handleCreate} variant="contained">Create</Button>

                    </Box>
                }

                <Stack spacing={2}>
                    {(currentItem?.length !== 0 || fields?.length !== 0) && fields.map((item, index) => (
                        <PrescriptionItems item={item} index={index}
                            onFavorite={() => {
                                handleFavorite(item, index)
                            }} handleDelete={() => {
                                handleDelete(item, index)
                            }} />
                    ))}
                </Stack>


                <Box gap={3} sx={{
                     position: 'relative', // Changed to relative
                     display: 'flex',
                     justifyContent: 'center',
                     flexDirection: 'column',
                     alignItems: 'center',
                     height: '100%', // Ensure it takes full height for centering

                }}>
                    <Button onClick={resetAll} variant="outlined" type="submit">Cancel</Button>
                    <Button disabled={!currentItem?.length} variant="contained" type="submit">Create Prescription</Button>

                </Box>
            </Stack>
        </FormProvider>
    );
};

const PrescriptionItems = ({ item, index, handleDelete, onFavorite }: any) => {

    const popover = usePopover();
    const confirm = useBoolean();

    const renderConfirm = (
        <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title="Delete"
            content="Are you sure want to delete?"
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDelete();
                        confirm.onFalse();
                    }}
                >
                    Delete
                </Button>
            }
        />
    );


    return (
        <Paper key={item.id} sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            width: 1,
            bgcolor: 'background.neutral',
            justifyContent: 'space-between',
            position: 'relative'
        }}>
            <Box sx={{
                position: 'absolute',
                top: 10,
                left: 10
            }}>
                <IconButton onClick={onFavorite}>
                     {item?.is_favorite ? <Iconify icon="material-symbols:favorite" /> : <Iconify icon="carbon:favorite" />}
                </IconButton>

            


            </Box>
            <Stack gap={2} flexDirection="row" alignItems="center" sx={{
                pl:{lg:5}
            }}>
                <Iconify icon="healthicons:rx-outline" height={68} width={68} />

                <Box gap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}>
                    <RHFTextField size="small" name={`items[${index}].is_favorite`} sx={{ display: 'none' }} label="Generic Name" />

                    <RHFTextField size="small" name={`items[${index}].MEDICINE`} label="Generic Name" />
                    <RHFTextField size="small" name={`items[${index}].MED_BRAND`} label="MED_BRAND Name" />
                    <RHFTextField size="small" type="text" name={`items[${index}].DOSE`} label="Dosage (in mg)" placeholder="0" />
                    <RHFTextField size="small" name={`items[${index}].FORM`} label="Form (e.g. tablet, etc.)" />
                    <RHFTextField size="small" type="text" name={`items[${index}].QUANTITY`} label="Quantity" placeholder="0" />
                    <RHFTextField size="small" type="text" name={`items[${index}].FREQUENCY`} label="Frequency (per day)" placeholder="0" />
                    <RHFTextField size="small" type="text" name={`items[${index}].DURATION`} label="Duration (in days)" placeholder="0" />
                </Box>
                
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
            <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={() => handleDelete(index)}
                        >
                          Remove
                        </Button>
                      </Stack>
                {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton> */}


                {/* <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
                    <MenuItem
                        onClick={() => {
                            onFavorite()
                            popover.onClose();
                        }}
                        sx={{ color: 'success.main' }}

                    >
                        <Iconify icon="material-symbols:favorite" />
                        Favorite
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>


                </CustomPopover> */}
            </Stack>
            {renderConfirm}
            <Box sx={{
                position: 'absolute',
                top: 10,
                right: 10
            }}>

                {/* <Icon icon="clarity:favorite-line" fontSize={22} /> */}

            </Box>
        </Paper>
    )
}

export default PrescriptionCreateForm;
