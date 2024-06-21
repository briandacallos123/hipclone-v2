
import { Box,Divider,  Dialog, DialogContentText, DialogTitle, Stack } from '@mui/material';
import React, { useCallback, useMemo } from 'react'
import { RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/form-provider'
import { useForm, useFieldArray, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSearchParams } from 'src/routes/hook';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuthContext } from '@/auth/hooks';
import { PATH_AFTER_LOGIN_QUEUE } from '@/config-global';
import { paths } from 'src/routes/paths';

type QueueLoginViewProps = {
    open:boolean;
    onClose:()=>void
}

const QueueLoginView = ({open, onClose}:QueueLoginViewProps) => {
    const { login } = useAuthContext();
    const searchParams: any = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    const NewPrescriptionSchema = Yup.object().shape({
        voucher: Yup.string().required('Voucher Code is required'),
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

      const onSubmit = useCallback(async(data:any)=>{
        // await login?.('','', data?.voucher);
        localStorage.setItem('voucherCode', data?.voucher);

        window.location.href = paths.queue.root(data?.voucher)
      },[])

      
    const {
        reset,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
      } = methods;

    const renderContent = (
        <Stack spacing={2.5} sx={{ mt: 1 }}>
           
                 
                        
            <RHFTextField
                size="small"
                type="text"
                name="voucher"
                // label="Voucher..."
                placeholder="Voucher Code..."
            />
            <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    >
                    {'Submit'}
                </LoadingButton>
        
                    
           
        </Stack>  
        
    )
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 400 },
      }}
    >
         <DialogTitle>Login your Appointment Code</DialogTitle>
         <DialogContentText sx={{ p: 3 }}>
         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
             {renderContent}
        </FormProvider>
            </DialogContentText>
        
      
    </Dialog>
  )
}

export default QueueLoginView