import React, { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { medicineFormOptions } from '@/utils/constants';
import { useResponsive } from '@/hooks/use-responsive';

const PrescriptionSideCreate = ({
    data,
    handleBack,
    onSubmit: onSubmitData,
    refetch
}: any) => {

    const upMd = useResponsive('up', 'md');

    const [inputValue, setInputValue] = React.useState('');

    const NewPrescriptionSchema = Yup.object().shape({
        dose: Yup.string().required('Dose is required'),
        name: Yup.string().required('name is required'),
        quantity: Yup.number().required('quantity is required'),
        frequency: Yup.string(),
        duration: Yup.string(),
        // form: Yup.string()
        //     .required('Form is required')
        //     .test('is-valid-form', 'Form is not valid', value =>
        //         medicineFormOptions.some(option => option.value === value)
        //     ),
        brand: Yup.string().required('brand is required'),
    });



    const defaultValues = useMemo(() => ({
        dose: data?.Dose || '',
        name: data?.GenericName || '',
        quantity: data?.quantity || '',
        frequency: data?.frequency || '',
        duration: data?.duration || '',
        form: data?.Form.trim() || '',
        id: data?.ID,
        isFavorite: data?.isFavorite || '',
        brand: data?.brand || ''
    }), [data]);

    const methods = useForm({
        resolver: yupResolver(NewPrescriptionSchema),
        defaultValues,
    });


    const { control, handleSubmit, reset, watch, setValue } = methods;

    const values = watch();

    const onSubmit = useCallback(async (data) => {
        try {
            onSubmitData(data);
        } catch (error) {
            console.error(error);
        }
    }, [])

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
      setAge(event.target.value);
    };
  

    const handleChangeSelect = (e) => {
        setValue('form',e.target.value)
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ mb: 2 }} gap={2}>
                <RHFTextField name="name" label="Medicine Name" />
                <RHFTextField name="dose" label="Dose" />
                <RHFTextField name="quantity" label="Quantity" />
                <RHFTextField type="text" name="frequency" label="Frequency" />
                <RHFTextField type="text" name="duration" label="Duration" />
                <RHFTextField type="string" name="brand" label="Medical Brand" />



                {!upMd ? 
                <select defaultValue={defaultValues.form ? defaultValues.form:''} onChange={(e)=>handleChangeSelect(e)} style={{
                    padding:'10px',
                    background:'#ededee',
                    border:'1px solid #e1e3e5'
                }}>
                
                   {medicineFormOptions?.map((item) => (
                            <option value={item?.value} key={item?.id} style={{
                                textTransform: 'capitalize',
                                zIndex: 9999,
                                border:'none'
                            }}>{item?.label}</option>
                        ))}
                </select>   
                :
                    <RHFSelect sx={{
                        zIndex: 9999,
                    }}
                        name="form" label="Form">
                        {medicineFormOptions?.map((item) => (
                            <MenuItem value={item?.value} key={item?.id} sx={{
                                textTransform: 'capitalize',
                                zIndex: 9999,
                            }}>{item?.label}</MenuItem>
                        ))}
                    </RHFSelect>
                }
            </Stack>

            <Stack gap={2}>
                <Button type="submit" fullWidth variant="contained">
                    Add
                </Button>
                <Button type="button" fullWidth onClick={handleBack} variant="outlined">
                    Go Back
                </Button>
            </Stack>
        </FormProvider>
    )
}

export default PrescriptionSideCreate