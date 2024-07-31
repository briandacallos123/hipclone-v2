import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// hooks
import { useMutation, useQuery } from '@apollo/client';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { mutation_patient_payment } from '../../libs/gqls/patientPayment';
import { Avatar, MenuItem } from '@mui/material';
import { maxWidth } from '@mui/system';
// ----------------------------------------------------------------------

const _mock = [
  {
    id: '1',
    name: 'Name',
    accountNumber: '135723',
    instruction: 'Instruction',
    attachmentUrl: '/assets/images/home/darkmode.webp',
  },
  {
    id: '2',
    name: 'Name2',
    accountNumber: '123234',
    instruction: 'Instruction',
    attachmentUrl: '/assets/images/home/darkmode.webp',
  },
  {
    id: '3',
    name: 'Name3',
    accountNumber: '135t6',
    instruction: 'Instruction',
    attachmentUrl: '/assets/images/home/darkmode.webp',
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.subtitle2,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '2px solid transparent',
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create(['border', 'color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

// ----------------------------------------------------------------------\

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  refetch?: any;
};

export default function AppointmentPaymentForm({ currentItem, onClose, refetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectId, setSelectId] = useState('');
  const open = useBoolean();
  const [snackKey, setSnackKey]: any = useState(null);
  console.log(currentItem, 'CURRENT ITEM@@@');
  const [uploadData] = useMutation(mutation_patient_payment, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });
  // const [  const [snackKey, setSnackKey] = useState(null);uploadData] = useMutation(GeneralTabMutation, {
  //   context: {
  //     requestTrackerId: 'Prescription_data[Prescription_data]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  const NewAppointmentPaymentSchema = Yup.object().shape({
    p_ref: Yup.string().required('Reference is required'),
    attachmentUrl: Yup.mixed().required('Attachment is required'),
  });

  const defaultValues = useMemo(
    () => ({
      // p_ref: '',
      patientID: Number(currentItem?.patientInfo?.S_ID),
      attachmentUrl: null,
      doctorID: Number(currentItem?.doctorInfo?.EMP_ID) || '',
      clinic: Number(currentItem?.clinicInfo?.id) || '',
      appt_id: Number(currentItem?.id) || '',
      p_ref: '',
      p_desc: '',
      method:null
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewAppointmentPaymentSchema),
    defaultValues,
  });

  // const test = (tester, toTest) => {
  //   tester = tester?.toString();
  //   const containsTester = new RegExp(`${toTest}`, 'i').test(tester);
  //   console.log('CONTAINS: ', containsTester);
  //   return containsTester;
  //   // const containsTester = /\`${tester}\`/.test(inputValue);
  // };

  // const iconSrc =
  //   // (checkWord(name, 'BDO') && '/assets/icons/payment/bdo.jpg') ||
  //   (test(name, 'BDO') && '/assets/icons/payment/bdo.jpg') ||
  //   // (name === 'TEST' && '/assets/icons/payment/bdo.jpg') ||
  //   (test(name, 'BPI') && '/assets/icons/payment/bpi.jpg') ||
  //   (test(name, 'Philam') && '/assets/icons/payment/philam.jpg') ||
  //   (test(name, 'PayMaya') && '/assets/icons/payment/paymaya.jpg') ||
  //   '/assets/icons/payment/gcash.jpg';

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue(values);
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingGeneral',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
      } catch (error) {
        console.error(error);
      }
      // try {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      //   reset();
      //   enqueueSnackbar('Payment success!');
      //   onClose();
      //   console.info('DATA', data);
      // } catch (error) {
      //   console.error(error);
      // }
    },
    [enqueueSnackbar, reset, onClose]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('attachmentUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('attachmentUrl', null);
  }, [setValue]);

  const handleSelect = useCallback(
    (id: string) => {
      open.onTrue();
      setSelectId(id);
    },
    [open, setSelectId]
  );

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['patient_payment_request']) => {
      const data: NexusGenInputs['patient_payment_request'] = {
        appt_id: model.appt_id,
        clinic: model.clinic,
        doctorID: model.doctorID,
        p_desc: model.p_desc,
        p_ref: model.p_ref,
        patientID: model.patientID,
        // mname: model.mname,
        // gender: model.gender,
        // nationality: model.nationality,
        // lname: model.lname,
        // suffix: model.suffix,
        // address: model.address,
        // contact: model.contact,
      };
      uploadData({
        variables: {
          data,
          file: model?.attachmentUrl,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar("Payment Successfully, please wait for doctor's confirmation");
          refetch();
          // reInitialize();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Typography variant="overline">Payment Methods</Typography>
              <RHFSelect name="method">
                <MenuItem value=""/>

                {currentItem?.doctorPayment?.map((item, index) => (
                  <MenuItem sx={{
                    display:'flex',
                    alignItems:"center"
                  }} key={index} value={item?.dpDetails?.acct}>
                    <Typography sx={{mr:1}}>
                      {item?.dpDetails?.title}
                    </Typography>
                    {/* <Typography>
                     ({item?.dpDetails?.acct})
                    </Typography> */}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(3, 1fr)',
                  sm: 'repeat(6, 1fr)',
                }}
                sx={{ mt: 1, mb: 3 }}
              >
                {currentItem?.doctorPayment?.length &&
                  currentItem?.doctorPayment?.map((i: any) => {
                    let path = i?.filename?.split('public');
                    const publicPart = path[1];

                    return <img src={publicPart} alt="payment" />;
                  })}
                
              </Box> */}
              {values?.method && 
              <Box>
                <Stack sx={{my:2}}>
                  <Typography variant="overline">Account Number</Typography>
                  <RHFTextField  disabled={true} name="method" />
                </Stack>
                {(()=>{
                  
                  let targetMethod = currentItem?.doctorPayment?.find((item:any)=>Number(item.dpDetails?.acct) === Number(getValues('method')))
                  const myImg = `/${targetMethod?.filename?.split('/')?.splice(1)?.join("/")}`
                  // console.log(targetMethod,'?????')

                  return <Stack>
                    <Typography variant="overline">QR Code</Typography>
                    <Image src={myImg} alt="payment attachment" width={200} height={200}/>
                  </Stack>
                
                })()}
                {/*  */}

              </Box>
              
              }

              <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="overline">Attach Proof of Payment</Typography>
                

                <RHFTextField name="p_ref" label="Reference Number, Full Name" />

                <RHFTextField name="p_desc" label="Description" multiline rows={3} />

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Attachment</Typography>
                  <RHFUpload
                    name="attachmentUrl"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="body2" color="error.main">
                <strong>Reminder: </strong>Mediko Connect does not handle payment transactions.
                Patients will pay directly to the account/s indicated by the doctor and attach proof
                of payment in Mediko Connect.
              </Typography>

              <Card sx={{ mt: 3 }}>
                <CardHeader title="Payment Instructions" />

                <CardContent>
                  <Stack spacing={2} sx={{ m: 0 }}>
                    <Box>
                      <Typography variant="subtitle1">Step 1:</Typography>
                      <Typography variant="body2">
                        Choose the payment scheme from the list provided.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Step 2:</Typography>
                      <Typography variant="body2">
                        Use the QR code, account number or telephone number to settle account. Click
                        QR code to enlarge image.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Step 3:</Typography>
                      <Typography variant="body2">
                        Once payment is confirmed, send confirmation to doctor. Attach the payment
                        receipt in the payment form.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Step 4:</Typography>
                      <Typography variant="body2">Fill in required details.</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Step 5:</Typography>
                      <Typography variant="body2">Click Submit to confirm payment.</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
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
          Submit
        </LoadingButton>
      </DialogActions>

      <ItemPayment open={open.value} onClose={open.onFalse} id={selectId} />
    </>
  );
}

// ----------------------------------------------------------------------

type ItemPaymentProps = {
  id: string;
  open: boolean;
  onClose: VoidFunction;
};

function ItemPayment({ id, open, onClose }: ItemPaymentProps) {
  const currentItem = _mock.find((_) => _.id === id);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 640 },
      }}
    >
      <DialogTitle>Payment Method Details</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Image alt={currentItem?.name} src={currentItem?.attachmentUrl} sx={{ width: '100%' }} />

          <Typography variant="body2">
            <strong>Account Number: </strong>
            {currentItem?.name}
          </Typography>

          <Stack>
            <Typography variant="overline">Instructions:</Typography>
            <Typography variant="body2">{currentItem?.instruction}</Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
