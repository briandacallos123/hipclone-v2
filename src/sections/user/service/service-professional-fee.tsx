import * as Yup from 'yup';
import { useCallback, useMemo, useState, useEffect } from 'react';
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
import { UpdateProfFees, GetProfFees } from '@/libs/gqls/services';
import { useMutation, useQuery } from '@apollo/client';
import { CreatePayment } from '@/libs/gqls/services';
import { NexusGenInputs } from 'generated/nexus-typegen';
import './styles/service.css';
import { getCurrentStep, setCurrentStep} from '@/app/dashboard/tutorial-action';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------

type FormValuesProps = { price: number; isViewable: boolean };

export default function ServiceProfessionalFee({step, tutorialTab, incrementTutsTab }: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { data, loading, refetch } = useQuery(GetProfFees);

  const [snackKey, setSnackKey] = useState(null);

  const [UpdateFees] = useMutation(UpdateProfFees, {
    context: {
      requestTrackerId: 'ProfFees[ProfFees]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { user:myUser }:any = useAuthContext();

  const [currentStep, setCurrentStepState] = useState(null);

  useEffect(() => {
    if (myUser?.new_doctor) {
      getCurrentStep(myUser?.id).then((res) => {
        const {setup_step} = res;
        setCurrentStepState(res.setup_step)
      })
    }
  }, [myUser])

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UpdateFeeInputsProf']) => {
      const data: NexusGenInputs['UpdateFeeInputsProf'] = {
        FEES: model.FEES,
        isShow: model.isShow,
      };
      UpdateFees({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          refetch();
          enqueueSnackbar('Updated sucessfully');
          if(currentStep){
            setCurrentStep({
              id:myUser?.id,
              step:8
            }).then((res)=>{
              incrementTutsTab();
            })
            
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          //  console.log(error, 'ERRORD DAW@');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey, myUser]
  );

  const [user] = useState<IUserService>(_userService);

  // const UpdateUserSchema = Yup.object().shape({

  // });

  const UpdateUserSchema = Yup.object().shape({
    FEES: Yup.number()
      .typeError('Professional Fee must be a number')
      .required('Professional Fee is required')
      .min(0, 'Professional Fee must be at least 0'),
  });
  const defaultValues = useMemo(
    () => ({
      FEES: null,
      isViewable: null,
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
    setValue,
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          FEES: values?.FEES,
          isShow: values?.isViewable === true ? 1 : 0,
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  useEffect(() => {
    if (data) {
      setValue('FEES', data?.GetProfFee?.FEES === 0 ? null : data?.GetProfFee?.FEES);
      setValue(
        'isViewable',
        (() => {
          if (data?.GetProfFee?.isFeeShow === 0) {
            return false;
          }
          return true;
        })()
      );
    }
  }, [data]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const snackbarKey = enqueueSnackbar('Updating Data...', {
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

  console.log('tutorialTab: ', tutorialTab);

  const tutorialTabDesign = {
    zIndex: 99999,

  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className={(tutorialTab && tutorialTab === 7 && step === 2) ? 'showFields-service':''}>
        <Card>
          <CardHeader title="Professional Fee (for Telemedicine only)" />

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
                Professional Fee
              </Typography>

              <RHFTextField
                name="FEES"
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
                  disabled={!isDirty}
                  loading={isSubmitting}
                  
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </div>
    </FormProvider>
  );
}
