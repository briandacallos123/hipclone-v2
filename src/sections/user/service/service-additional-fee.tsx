import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// _mock
import { _userService } from 'src/_mock';
// types
import { IUserService } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from 'src/components/hook-form';
import { UpdateFees, GetFees } from '@/libs/gqls/services';
import { useMutation, useQuery } from '@apollo/client';
import { CreatePayment } from '@/libs/gqls/services';
import { NexusGenInputs } from 'generated/nexus-typegen';

// ----------------------------------------------------------------------

type FormValuesProps = {
  certificate: number;
  clearance: number;
  abstract: number;
  isViewable: boolean;
};

export default function ServiceAdditionalFee() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [user] = useState<IUserService>(_userService);
  const [snackKey, setSnackKey] = useState(null);

  const [createEmr] = useMutation(UpdateFees, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data, loading, refetch } = useQuery(GetFees);
  // const { abstract, certificate, clearance } = data?.GetFees;

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UpdateFeeInputs']) => {
      const data: NexusGenInputs['UpdateFeeInputs'] = {
        abstract: model.abstract,
        certificate: model.certificate,
        clearance: model.clearance,
        isAddReqFeeShow: model.isAddReqFeeShow,
      };
      createEmr({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          refetch();
          enqueueSnackbar('Updated sucessfully');
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

  // const UpdateUserSchema = Yup.object().shape({});

  const UpdateUserSchema = Yup.object().shape({
    certificate: Yup.number()
      .typeError('Medical Certificate must be a number')
      .min(1, 'Medical Certificate is required')
      .required('Medical Certificate is required'),
    clearance: Yup.number()
      .typeError('Medical Clearance must be a number')
      .min(1, 'Medical Clearance is required')
      .required('Medical Clearance is required'),
    abstract: Yup.number()
      .typeError('Medical Abstract must be a number')
      .min(1, 'Medical Abstract is required')
      .required('Medical Abstract is required'),
    // isViewable: Yup.boolean().required(
    //   'Please specify if patients can view the fee prior to booking'
    // ),
  });

  const defaultValues = useMemo(
    () => ({
      certificate: data?.GetFees?.certificate || null,
      clearance: data?.GetFees?.clearance || null,
      abstract: data?.GetFees?.abstract || null,
      isViewable: false,
    }),

    []
  );

  // console.log(defaultValues, 'WEW');
  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (data?.GetFees) {
      setValue('certificate', data?.GetFees?.certificate);
      setValue('clearance', data?.GetFees?.clearance);
      setValue('abstract', data?.GetFees?.abstract);
      setValue(
        'isViewable',
        (() => {
          if (data?.GetFees?.isAddReqFeeShow === 0) {
            return false;
          }
          return true;
        })()
      );
    }
  }, [data]);

  const values = watch();
  // console.log(values, 'VALUES');

  useEffect(() => {
    if (snackKey) {
      (async () => {
        // console.log(values, 'yey');
        await handleSubmitValue({
          ...values,
          isAddReqFeeShow: values?.isViewable === true ? 1 : 0,
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
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
      <Card>
        <CardHeader title="Additional Request Fee (for Telemedicine only)" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: '1fr 3fr',
            }}
          >
            <Typography variant="overline" gutterBottom>
              Medical Certificate
            </Typography>
            <RHFTextField
              name="certificate"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      ₱
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            {/* {loading ? (
              <TableCell>
                <Skeleton
                  height={40}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: '30%',
                    },
                  }}
                />
              </TableCell>
            ) : (
              
            )} */}
          </Box>

          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: '1fr 3fr',
            }}
          >
            <Typography variant="overline" gutterBottom>
              Medical Clearance
            </Typography>

            <RHFTextField
              name="clearance"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      ₱
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: '1fr 3fr',
            }}
          >
            <Typography variant="overline" gutterBottom>
              Medical Abstract
            </Typography>

            <RHFTextField
              name="abstract"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      ₱
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
            <RHFSwitch
              name="isViewable"
              label="Can patients view fee prior to booking?"
              sx={{ color: 'text.disabled' }}
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
        </Stack>
      </Card>
    </FormProvider>
  );
}
