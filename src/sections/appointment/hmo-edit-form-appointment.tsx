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

// import { useLazyQuery } from '@apollo/client';
// import { NexusGenInputs } from 'generated/nexus-typegen';
// import { useMutation } from '@apollo/client';
// import { mutation_export_stat } from '@/libs/gqls/hmoClaims';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  // currentItem?: IUserSubaccountItem;
  currentItem?: any;
  clientside?: any;
  refetch?: any;
  listItem?: any;
  tempData?: any;

};

export default function HmoEditForm({ currentItem,clientside, tempData,onClose,refetch,listItem }: Props) {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);

  const view = useBoolean();

  // console.log(currentItem,"woooow")

  const NewHmoSchema = Yup.object().shape({});

  // `${currentItem?.patientInfo?.FNAME} ${currentItem?.patientInfo?.MNAME} ${currentItem?.patientInfo?.LNAME}`
  const patient_fullname = currentItem?.patientInfo?.MNAME ? `${currentItem?.patientInfo?.FNAME} ${currentItem?.patientInfo?.MNAME} ${currentItem?.patientInfo?.LNAME}`:`${currentItem?.patientInfo?.FNAME} ${currentItem?.patientInfo?.LNAME}`;

  const [openSwitch, setOpenSwitch] = useState(false);


  const defaultValues = useMemo(
    () => ({
      diagnosis: tempData?.hmo_claims?.diagnosis || currentItem?.hmo_claims?.diagnosis || listItem?.hmo_claims?.diagnosis ||   "" ,
      treatment: tempData?.hmo_claims?.treatment || currentItem?.hmo_claims?.treatment || listItem?.hmo_claims?.treatment ||   "" ,
      phoneNumber: tempData?.hmo_claims?.c_contact|| currentItem?.hmo_claims?.c_contact || listItem?.hmo_claims?.c_contact ||  "" ,
      email: tempData?.hmo_claims?.c_email  || currentItem?.hmo_claims?.c_email || listItem?.hmo_claims?.c_email ||  "" ,
      hospitalName: tempData?.hmo_claims?.c_clinic || currentItem?.hmo_claims?.c_clinic || listItem?.hmo_claims?.c_clinic ||   "" ,
      hospitalAddress:  tempData?.hmo_claims?.c_caddress || currentItem?.hmo_claims?.c_caddress || listItem?.hmo_claims?.c_caddress ||  "" ,
      paymentType: tempData?.hmo_claims?.payment_type || currentItem?.hmo_claims?.payment_type || listItem?.hmo_claims?.payment_type ||   "" ,
    }),
    [currentItem?.id,listItem?.id,tempData?.id]
  );

  // console.log(defaultValues,'defaultValues')

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewHmoSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(()=>{
    if(tempData){
      setValue("diagnosis",tempData?.hmo_claims?.diagnosis)
      setValue("treatment",tempData?.hmo_claims?.treatment)
      setValue("phoneNumber",tempData?.hmo_claims?.c_contact )
      setValue("email",tempData?.hmo_claims?.c_email)
      setValue("hospitalName",tempData?.hmo_claims?.c_clinic )
      setValue("hospitalAddress",tempData?.hmo_claims?.c_caddress)
      setValue("paymentType",tempData?.hmo_claims?.payment_type)
    }
  },[tempData])

  const values = watch();


  return (
    <>
      <DialogContent>
        <FormProvider methods={methods}>
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
                date={currentItem?.hmo_claims?.date_appt || listItem?.hmo_claims?.date_appt || tempData?.hmo_claims?.date_appt}
                time={currentItem?.hmo_claims?.time_appt || listItem?.hmo_claims?.time_appt || tempData?.hmo_claims?.time_appt}
                avatarUrl=""
              />

              <HmoDetailCover name={currentItem?.patient_hmo?.hmoInfo?.name} mid={currentItem?.patient_hmo?.member_id} avatarUrl="" />
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
            <RHFTextField
              name="paymentType"
              label="Payment Type"
              InputProps={{ readOnly: true }}
            />

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
          Close
        </Button>
      </DialogActions>

      {/* {renderView} */}
    </>
  );
}

// ----------------------------------------------------------------------

type HmoPatientCoverProps = {
  name: string;
  date: string;
  time: string;
  avatarUrl: string;
};

function HmoPatientCover({ name, date, time, avatarUrl }: HmoPatientCoverProps) {
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
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          sx={{
            textTransform:'capitalize',
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
};

function HmoDetailCover({ name, mid, avatarUrl }: HmoDetailCoverProps) {
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
          {name?.charAt(0).toUpperCase()}
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
