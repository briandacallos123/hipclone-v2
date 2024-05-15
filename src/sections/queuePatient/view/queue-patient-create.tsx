
"use client"

import { RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/form-provider'
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useForm, useFieldArray, Controller, CustomRenderInterface } from 'react-hook-form';
import React, { useCallback, useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';

type QueuePatientCreate = {
    onSubmit?:any
}

const QueuePatientCreate = ({onSubmit}:QueuePatientCreate) => {
    const [val, setVal] = useState(null)
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

   const handleChange = (e) => {
    setVal(e.target.value)
   }

  return (
    <Stack>
      <Box 
        gap={2}      
        display="grid"
        gridTemplateColumns={{
          sm: 'repeat(1, 1fr)',
      }}
        >

          <TextField   
            size="small"
            type="text"
            name="voucher"
            onChange={handleChange}
            />
            <Button 
              type="submit"
              variant="contained"
              loading={isSubmitting}
              onClick={()=>{
                onSubmit(val)
              }}
              >
                Submit
            </Button>
      </Box>
       
        
    </Stack>
  )
}

export default QueuePatientCreate