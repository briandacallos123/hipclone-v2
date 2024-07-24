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
  isView?:boolean;
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
  isView
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // console.log('Current Item: ', currentItem);
  const [createEmr] = useMutation(CreatePayment, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('First name is required'),
    // accountNumber: Yup.string().required('Last name is required'),
    // instruction: Yup.string().required('Instruction is required'),
  });
  const [snackKey, setSnackKey]: any = useState(null);

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.title,
      accountNumber: currentItem?.acct ?? '',
      instruction: currentItem?.description ?? '',
      id: currentItem?.id ?? '',
      attachment:(()=>{
        return currentItem && `https://hip.apgitsolutions.com/${currentItem?.attachment?.filename?.split('/').splice(1).join("/")}`
      })() || null
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
    formState: { isSubmitting },
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
          enqueueSnackbar(currentItem ? 'Updated sucessfully' : 'Created Successfully');
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
          attachment:values.attachment
        };

        const payload2 = {
          title: values.name,
          acct: values.accountNumber,
          description: values.instruction,
          id: values.id,
          type: 'update',
          attachment:values.attachment

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
        onClose();
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          <RHFSelect disabled={isView} name="name" label="Payment Method">
            <MenuItem value="BDO">BDO</MenuItem>
            <MenuItem value="BPI">BPI</MenuItem>
            <MenuItem value="Philam">Philam</MenuItem>
            <MenuItem value="G-Cash">G-Cash</MenuItem>
            <MenuItem value="PayMaya">PayMaya</MenuItem>
          </RHFSelect>

          <RHFTextField disabled={isView} name="accountNumber" label="Account Number" />
        </Box>

        <RHFTextField disabled={isView} name="instruction" label="Instruction" multiline rows={3} sx={{ my:3 }} />
        <RHFUpload
          disabled={isView}
          thumbnail

          name="attachment"
          maxSize={3145728}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
        />

      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {currentItem ? 'Update' : 'Create'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
