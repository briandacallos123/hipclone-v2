import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useMutation } from '@apollo/client';
import { CreatePayment } from '@/libs/gqls/services';
import { NexusGenInputs } from 'generated/nexus-typegen';
import Image from '@/components/image';
import { borderRadius } from '@mui/system';
import './styles/payment.css';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

type IUserPaymentItem = {
  id: string;
  name: string;
  accountNumber: string;
  instruction: string;
};

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  refetch?: any;
  appendData?: any;
  tempId?: any;
  resolveData?: any;
  updateData?: any;
  onSuccess?: any;
  isTuts?: any;
  isView?: boolean;
  incrementTutsTab?: () => void;
};

export default function ServicePaymentMethodNewEditForm({
  refetch,
  currentItem,
  appendData,
  tempId,
  onClose,
  resolveData,
  updateData,
  onSuccess,
  isView,
  isTuts,
  incrementTutsTab
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  // console.log('Current Item: ', currentItem);
  const [createEmr] = useMutation(CreatePayment, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  let currentStep = localStorage?.getItem('currentStep');

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    accountNumber: Yup.string().required('Last name is required'),
    instruction: Yup.string().required('Instruction is required'),
    // attachment: Yup.string() // Require at least one attachment
    // .required('Attachments are required'),
  });
  const [snackKey, setSnackKey]: any = useState(null);

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.title,
      accountNumber: currentItem?.acct ?? '',
      instruction: currentItem?.description ?? '',
      id: currentItem?.id ?? '',
      attachment: currentItem?.attachment?.filename || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem?.id]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty },
  } = methods;
  const values = watch();





  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: any = {
        acct: model.acct,
        description: model.description,
        title: model.title,
        id: model.id,
        type: model.type,
        tempId: model.tempId,
      };
      createEmr({
        variables: {
          data,
          file: model?.attachment,
        },
      })
        .then(async (res) => {
          // console.log(res, 'response');
          const { data } = res;
          closeSnackbar(snackKey);
          // console.log('RESOLVE: ', data);
          !currentItem ? resolveData(data?.CreatePayment) : onSuccess(data?.CreatePayment);
          // setIsRefetch(data?.MutationPrescription);
          reset();
          refetch();
          onClose();
          enqueueSnackbar(currentItem ? 'Updated sucessfully' : 'Created Successfully');
          if (currentStep && Number(currentStep) !== 100) {
            localStorage.setItem('currentStep', '12');
            router.push(paths.dashboard.user.manage.subaccount);
            // incrementTutsTab()
          }
        })

        .catch((error) => {
          closeSnackbar(snackKey);
          console.log(error, 'ERRORD DAW@');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  console.log('VALUES: ', values);
  // console.log('CURRENT ITEM: ', currentItem);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        const payload = {
          title: values.name,
          acct: values.accountNumber,
          description: values.instruction,
          type: 'create',
          tempId,
          attachment: values.attachment
        };

        const payload2 = {
          title: values.name,
          acct: values.accountNumber,
          description: values.instruction,
          id: values.id,
          type: 'update',
          attachment: values.attachment

        };

        await handleSubmitValue(values.id !== '' ? payload2 : payload);
        setSnackKey(null);
      })();
    }
  }, [snackKey, defaultValues]);

  const onSubmit = useCallback(
    async (data: IUserPaymentItem) => {
      try {
        // if (currentItem) {
        //   updateData(data);
        // } else {
        //   appendData(data);
        // }

        // await new Promise((resolve) => setTimeout(resolve, 500));

        const snackbarKey = enqueueSnackbar(!currentItem ? 'Saving Data...' : 'Updating Data...', {
          variant: 'info',
          key: 'savingPayments',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        // await handleSubmitValue({
        //   title: data.name,
        //   acct: data.accountNumber,
        //   title: data.instruction,

        // });
        // reset();
     
        // enqueueSnackbar(currentItem ? 'Update success!' : 'Create success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [currentItem, enqueueSnackbar, onClose, reset]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.attachment || null;
      const newFiles = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      })
      setValue('attachment', newFiles, { shouldValidate: true });
    },
    [values.attachment]
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

  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const renderFifthTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}>


      <>
        <Box sx={{
          background: PRIMARY_MAIN,
          opacity: .4,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9991
        }}>

        </Box>


      </>

    </Box>
  )

  const [step, setStep] = useState(1);

  const onIncrementStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, [step])


  const handleContinue = useCallback(() => {
    // Resetting isDirty by setting the values to the current values
    reset({}, { keepValues: true });
    // Then increment the step
    onIncrementStep();
  }, [values])

  const confirm = useBoolean();

  const clearUnsaved = () => {
    if(step === 4){
      setValue('attachment','')
    }
  }

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Unsaved Changes"
      content="You have unsaved changes, are you sure you want to skip?"
      sx={{
        zIndex: 99999
      }}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onIncrementStep();
            clearUnsaved()
            confirm.onFalse();
            reset({}, { keepValues: true });
          }}
        >
          Skip
        </Button>
      }
    />
  );

  const onSkip = useCallback(() => {
    if (isDirty || values.attachment) {
      confirm.onTrue()
    } else {
      onIncrementStep()
    }
  }, [isDirty, values.attachment])


  const RenderChoices = useCallback(({ isRequired }: any) => {
    return (
      <Stack sx={{
        p: 1,
        position:'relative'
      }} direction="row" alignItems='center' gap={2} justifyContent='flex-end'>
        {!isRequired && <Button onClick={onSkip} variant="outlined">Skip</Button>}
        <Button disabled={(() => {
          if (step === 7) {
            return false
          }else if(step === 4){
            if(values.attachment){
              return false
            }else{
              return true
            }
          } 
          else {
            return !isDirty
          }
        })()} onClick={handleContinue} variant="contained">Continue</Button>

      </Stack>
    )
  }, [isDirty, step, values.attachment])


  const tutsField = (
    <Box sx={{
      pb: 10,
      overflow:'hidden'
    }}>
      <DialogTitle>
        <Typography variant="h6">Payment Method</Typography>
        <Typography variant="body2" color="text.disabled">
          Fill-in details for patients to know how to pay with varities of options.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{ pt: 1 }}
        >
          <div className={step === 1 ? 'showFields' : ''}>
            <RHFSelect InputProps={{
              readOnly: isView,
            }} name="name" label="Payment Method">
              <MenuItem value="BDO">BDO</MenuItem>
              <MenuItem value="BPI">BPI</MenuItem>
              <MenuItem value="Philam">Philam</MenuItem>
              <MenuItem value="G-Cash">G-Cash</MenuItem>
              <MenuItem value="PayMaya">PayMaya</MenuItem>
            </RHFSelect>
            {step === 1 && <RenderChoices isRequired={true} />}
          </div>

          <div className={step === 2 ? 'showFields' : ''}>
            <RHFTextField InputProps={{
              readOnly: isView,
            }} name="accountNumber" label="Account Number" />
            {step === 2 && <RenderChoices isRequired={true} />}
          </div>
        </Box>

        <div className={step === 3 ? 'showFields' : ''}>
          <RHFTextField InputProps={{
            readOnly: isView,
          }} name="instruction" label="Instruction" multiline rows={3} sx={{ my: 3 }} />
          {step === 3 && <RenderChoices isRequired={true} />}
        </div>


      </DialogContent>
      {/* <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
       <div className={step === 4 ? 'showFields' : ''}>
            <RHFUpload
              disabled={isView}
              thumbnail
              name="attachment"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            {step === 4 && <RenderChoices isRequired={false} />}
          </div>
      </Box> */}

      <div className={step === 4 ? 'showFields' : ''}>
      <RHFUpload
              disabled={isView}
              thumbnail
              name="attachment"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
             {step === 4 && <RenderChoices isRequired={false} />}
      </div>

      <Stack sx={{
        p:2
      }} direction="row" justifyContent='flex-end' gap={1}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        {/* <div className={'showFields-submit-payment'}> */}

        <div className={step === 5 ? 'showFields-submit-payment':''}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {currentItem ? 'Update' : 'Create'}
          </LoadingButton>
        </div>
      </Stack>

      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

      }}>

      </Box>
    </Box>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!currentStep ? <div className={'service-fee'}>
        <DialogTitle>
          <Typography variant="h6">Payment Method</Typography>
          <Typography variant="body2" color="text.disabled">
            Fill-in details for patients to know how to pay with varities of options.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ pt: 1 }}
          >
            <RHFSelect InputProps={{
              readOnly: isView,
            }} name="name" label="Payment Method">
              <MenuItem value="BDO">BDO</MenuItem>
              <MenuItem value="BPI">BPI</MenuItem>
              <MenuItem value="Philam">Philam</MenuItem>
              <MenuItem value="G-Cash">G-Cash</MenuItem>
              <MenuItem value="PayMaya">PayMaya</MenuItem>
            </RHFSelect>

            <RHFTextField InputProps={{
              readOnly: isView,
            }} name="accountNumber" label="Account Number" />
          </Box>

          <RHFTextField InputProps={{
            readOnly: isView,
          }} name="instruction" label="Instruction" multiline rows={3} sx={{ my: 3 }} />


        </DialogContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          {isView ? <Image
            alt="image"
            src={values?.attachment}
            sx={{
              borderRadius: 5,
              width: 400,
              height: 400

            }}
          /> : <RHFUpload
            disabled={isView}
            thumbnail
            name="attachment"
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
          />}
        </Box>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isDirty}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {currentItem ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </div> :
        tutsField
      }
    </FormProvider>
  );
}
