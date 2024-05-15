
"use client"

import { RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/form-provider'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useForm, useFieldArray, Controller, CustomRenderInterface } from 'react-hook-form';
import React, { useCallback, useMemo } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';

type QueuePatientCreate = {
    onSubmit?:any
}

const QueuePatientCreate = ({onSubmit}:QueuePatientCreate) => {

    const NewPrescriptionSchema = Yup.object().shape({
        voucher: Yup.string().required('Clinic Id is required'),
      });
      const defaultValues = useMemo(
        () => ({
            voucher:null
        }),
        []
      );

    const methods = useForm<any>({
        resolver: yupResolver(NewPrescriptionSchema),
        defaultValues,
      });

      
    const {
        reset,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
      } = methods;

    

  return (
    <Stack>
         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box   
                gap={2}
                display="grid"
                gridTemplateColumns={{
                // xs: 'repeat(2, 1fr)',
                sm: 'repeat(1, 1fr)',
                
            }}>
                
                        <RHFTextField
                            size="small"
                            type="text"
                            name="voucher"
                            // label="Voucher..."
                            // placeholder="0"
                        />
                          <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                                >
                                {'Submit'}
                            </LoadingButton>
                    <Divider/>
            </Box>
        </FormProvider>
    </Stack>
  )
}

export default QueuePatientCreate