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
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
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
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['PaymentMethodInputs']) => {
      const data: NexusGenInputs['PaymentMethodInputs'] = {
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

  // console.log('VALUES: ', values);
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
        };

        const payload2 = {
          title: values.name,
          acct: values.accountNumber,
          description: values.instruction,
          id: values.id,
          type: 'update',
        };

        await handleSubmitValue(values.id !== '' ? payload2 : payload);
        setSnackKey(null);
      })();
    }
  }, [snackKey, defaultValues]);

  const onSubmit = useCallback(
    async (data: IUserPaymentItem) => {
      try {
        if (currentItem) {
          // if editing
          updateData(data);
        } else {
          // if not editing
          appendData(data);
        }

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
          <RHFSelect name="name" label="Payment Method">
            <MenuItem value="BDO">BDO</MenuItem>
            <MenuItem value="BPI">BPI</MenuItem>
            <MenuItem value="Philam">Philam</MenuItem>
            <MenuItem value="G-Cash">G-Cash</MenuItem>
            <MenuItem value="PayMaya">PayMaya</MenuItem>
          </RHFSelect>

          <RHFTextField name="accountNumber" label="Account Number" />
        </Box>

        <RHFTextField name="instruction" label="Instruction" multiline rows={3} sx={{ mt: 3 }} />
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
