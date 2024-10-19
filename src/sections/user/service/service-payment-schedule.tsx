import * as Yup from 'yup';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
// _mock
import { _userService } from 'src/_mock';
// types
import { IUserService } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFRadioGroup } from 'src/components/hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { GetPaymentSched, UpdatePaymentSched } from '../../../libs/gqls/services';
import { NexusGenInputs } from 'generated/nexus-typegen';
import './styles/service.css';
// ----------------------------------------------------------------------

type FormValuesProps = IUserService;

const ServicePaymentSchedule = forwardRef(({ tutorialTab, incrementTutsTab}, ref) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [user] = useState<IUserService>(_userService);
  let currentStep = localStorage?.getItem('currentStep')

  const { data, loading, refetch } = useQuery(GetPaymentSched);
  const [updateSched] = useMutation(UpdatePaymentSched, {
    context: {
      requestTrackerId: 'Prescription_MutationGetPaymentSched_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['PaymentSchedInput']) => {
      const data: NexusGenInputs['PaymentSchedInput'] = {
        isPaySchedShow: model.isPaySchedShow,
      };
      updateSched({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          refetch();
          enqueueSnackbar('Updated sucessfully');
          if(currentStep && Number(currentStep) !== 100){
            localStorage.setItem('currentStep','10')
            incrementTutsTab();
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          //  console.log(error, 'ERRORD DAW@');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      paymentSchedule: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
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
  console.log(values, 'ANO TO?');

  useEffect(() => {
    if (data?.GetPaymentSched) {
      setValue('paymentSchedule', (()=>{
        let val:any;

        if(data?.GetPaymentSched?.isPaySchedShow){
          val = 1;
        }else{
          val = 2
        }
        return val;
      })());
    }
  }, [data?.GetPaymentSched]);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          isPaySchedShow: Number(values.paymentSchedule) === 1 ? 1 : 0,
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingPayments',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // enqueueSnackbar('Update success!');
        // console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div ref={ref} className={tutorialTab && tutorialTab === 9 ?'service-fee service-fee-mt':''}>
      <Card>
        <CardHeader title="Payment Schedule (for Telemedicine only)" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFRadioGroup
            row
            name="paymentSchedule"
            label="Payment prior to booking?"
            spacing={4}
            options={[
              { value: 1, label: 'Yes. Payment before consulation' },
              { value: 2, label: 'No. Payment after consulation' },
            ]}
          />

          <Stack spacing={3} alignItems="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={loading}
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
      </div>
    </FormProvider>
  );
})


export default ServicePaymentSchedule