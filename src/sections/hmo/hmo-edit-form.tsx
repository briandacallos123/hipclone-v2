import * as Yup from 'yup';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PDFViewer } from '@react-pdf/renderer';
import { LogoFull } from 'src/components/logo';
// @mui
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate, fTime } from 'src/utils/format-time';
// types
import { IUserSubaccountItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from 'src/components/hook-form';
import { useBoolean } from '@/hooks/use-boolean';
//
import HmoLoaPDF from './hmo-pdf';
import { useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { mutation_export_stat } from '@/libs/gqls/hmoClaims';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  // currentItem?: IUserSubaccountItem;
  currentItem?: any;
  clientside?: any;
  refetch?: any;

};

export default function HmoEditForm({ currentItem,clientside, onClose,refetch }: Props) {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);
  const { user } = useAuthContext();
  const view = useBoolean();

  // console.log(currentItem,"woooow")

  const NewHmoSchema = Yup.object().shape({});

  const {
    id,
    patientHmoInfo,
    member_id,
    date_appt,
    time_appt,
    diagnosis,
    treatment,
    doctorInfo,
    c_clinic,
    c_caddress,
    payment_type,
    export_stat,
  } = currentItem;

  const { EMP_FULLNAME, EMP_EMAIL, CONTACT_NO } = doctorInfo;
  const patient_fullname = `${patientHmoInfo?.patient?.FNAME} ${patientHmoInfo?.patient?.MNAME} ${patientHmoInfo?.patient?.LNAME}`;

  const [openSwitch, setOpenSwitch] = useState(false);

  useEffect(() => {
    setOpenSwitch(clientside?.export_stat === 1 ? true : false);
  }, [clientside?.id,clientside?.export_stat]);
  // console.log(currentItem,"boom");

  const [update_export_stat] = useMutation(mutation_export_stat, {
    context: {
      requestTrackerId: 'mutation_export_stat[export_stat_request_type]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(async (model: NexusGenInputs['export_stat_request_type']) => {
    const data: NexusGenInputs['export_stat_request_type'] = {
      id :  Number(model.id),
      export_stat : Number(model.export_stat),
    };
    update_export_stat({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Update Export Status Successfully');
        refetch();
      })
      .catch((error) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        // runCatch();
      });
  }, [snackKey]);

  const defaultValues = useMemo(
    () => ({
      diagnosis: diagnosis || clientside?.diagnosis || "" ,
      treatment: treatment || clientside?.treatment || "" ,
      phoneNumber: CONTACT_NO || clientside?.CONTACT_NO || "" ,
      email: EMP_EMAIL || clientside?.EMP_EMAIL || "" ,
      hospitalName: c_clinic || clientside?.c_clinic || "" ,
      hospitalAddress: c_caddress || clientside?.c_caddress || "" ,
      paymentType: payment_type || clientside?.payment_type || "" ,
      id: clientside?.id || 0,
      forExport: clientside?.export_stat ,
    }),
    [id]
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewHmoSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          id:Number(values?.id),
          export_stat:Number(values?.forExport),
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        const snackbarKey:any = enqueueSnackbar('Updating Export Status...', {
          variant: 'info',
          key: 'UpdatingPhoneNumber',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset]
  );

  const renderView = (
    <Dialog fullScreen open={view.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>

          <Button variant="outlined" onClick={view.onFalse}>
            Close
          </Button>
        </DialogActions>

        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <HmoLoaPDF item={currentItem} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <HmoPatientCover
                name={patient_fullname}
                currentItem={currentItem}
                date={date_appt}
                time={time_appt}
                avatarUrl=""
              />

              <HmoDetailCover   currentItem={currentItem} name={currentItem?.hmoInfo?.name} mid={member_id} avatarUrl="" />
            </Box>

            <RHFTextField name="diagnosis" label="Diagnosis" InputProps={{ readOnly: true }} />

            <RHFTextField
              name="treatment"
              label="Treatment"
              multiline
              rows={3}
              InputProps={{ readOnly: true }}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="phoneNumber"
                label="Phone Number"
                InputProps={{ readOnly: true }}
              />
              <RHFTextField name="email" label="Email" InputProps={{ readOnly: true }} />
            </Box>

            <RHFTextField
              name="hospitalName"
              label="Hospital/Clinic Name"
              InputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="hospitalAddress"
              label="Hospital/Clinic Address"
              InputProps={{ readOnly: true }}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="paymentType"
                label="Payment Type"
                InputProps={{ readOnly: true }}
              />

              <Stack direction="row" alignItems="center" justifyContent="flex-end">
                <Button
                  onClick={view.onTrue}
                  variant="contained"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                >
                  View LOA
                </Button>
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
              <RHFSwitch
                name="forExport"
                checked={openSwitch}
                label="For export:"
                labelPlacement="start"
                sx={{ m: 0, justifyContent: 'space-between' }}
              />
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            onClose();
            setOpenSwitch(false);
            reset();
          }}
        >
          Cancel
        </Button>

        {/* <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </LoadingButton> */}

        

        {
          user?.role === 'secretary' ? (
            user?.permissions?.hmo_claim === 1 ? (
              export_stat !== 1 ? (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save Changes
                </LoadingButton>
              ) : (
                null // Replace with what you want to render when export_stat === 1
              )
            ) : (
              null // Replace with what you want to render when permissions are not met
            )
          ) : (
            export_stat !== 1 ? (
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                Save Changes
              </LoadingButton>
            ) : (
              null // Replace with what you want to render when user is not a secretary
            )
          )
        }






        {/* {export_stat !== 1 ? 
        ( 
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </LoadingButton>
        ) : 
        <>
        </>
        } */}


      </DialogActions>

      {renderView}
    </>
  );
}

// ----------------------------------------------------------------------

type HmoPatientCoverProps = {
  name: string;
  date: string;
  time: string;
  avatarUrl: string;
  currentItem: any;
};

function HmoPatientCover({ name, date, time, avatarUrl,currentItem }: HmoPatientCoverProps) {
  const theme = useTheme();

  return (
    <Card sx={{ mt: 1, p: 3, display: 'flex' }}>
      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        sx={{ width: '100%', alignSelf: 'center' }}
      >
        {currentItem?.appointmentInfo?.patientInfo[0].userInfo[0].display_picture[0] ? (
            <Avatar
              alt={currentItem?.appointmentInfo?.patientInfo[0].FNAME}
              src={currentItem?.appointmentInfo?.patientInfo[0].userInfo[0].display_picture[0].filename.split('public')[1]}
              sx={{
                mx: 'auto',
                width: 64,
                height: 64,
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {currentItem?.appointmentInfo?.patientInfo[0].FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={currentItem?.appointmentInfo?.patientInfo[0].FNAME}  sx={{
              mx: 'auto',
              width: 64,
              height: 64,
              border: `solid 2px ${theme.palette.common.white}`,
            }}>
              {currentItem?.appointmentInfo?.patientInfo[0].FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}
        {/* <Avatar
          // src={currentItem?.avatarUrl}
          alt={name}
          sx={{
            mx: 'auto',
            width: 64,
            height: 64,
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar> */}

        <ListItemText
          sx={{
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name}
          secondary={
            <>
              <Typography variant="caption">{date}</Typography>
              <Typography variant="caption">{time}</Typography>
            </>
          }
          primaryTypographyProps={{
            typography: 'subtitle1',
          }}
          secondaryTypographyProps={{
            component: 'span',
            display: 'flex',
            flexDirection: 'column',
            sx: { opacity: 0.78 },
          }}
        />
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type HmoDetailCoverProps = {
  name: string;
  mid: string;
  avatarUrl: string;
  currentItem: any;
};

function HmoDetailCover({ name, mid, avatarUrl,currentItem }: HmoDetailCoverProps) {
  const theme = useTheme();

  return (
    <Card sx={{ mt: 1, p: 3, display: 'flex' }}>
      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        sx={{ width: '100%', alignSelf: 'center' }}
      >
        

        <Avatar
          // src={currentItem?.avatarUrl}
          alt={name}
          sx={{
            mx: 'auto',
            width: 64,
            height: 64,
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          sx={{
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name}
          secondary={mid}
          primaryTypographyProps={{
            typography: 'subtitle1',
          }}
          secondaryTypographyProps={{
            typography: 'body2',
            component: 'span',
            sx: { opacity: 0.78 },
          }}
        />
      </Stack>
    </Card>
  );
}
