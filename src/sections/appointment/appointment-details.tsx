/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PDFViewer } from '@react-pdf/renderer';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify/iconify';
import { LogoFull } from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
//
import { useAuthContext } from '@/auth/hooks';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import HmoLoaPDF from '../hmo/hmo-pdf';
import AppointmentDetailsCover from './appointment-details-cover';
import AppointmentDetailsComplaint from './appointment-details-complaint';
import AppointmentDetailsRequest from './appointment-details-request';
import AppointmentDetailsRadio from './appointment-details-radio';

// import { HmoCreateView, HmoDetailsView } from '../hmo/view';
import ViewHmoModal from './appointment-hmo-details-view';
import CreateHmoModal from './appointment-hmo-create-view';

import { UpdateAppointment } from '../../libs/gqls/appointment';
import AppointmentPaymentPDF from './appointment-payment-pdf';
import AppointmentLoaAttachment from './appointment-loa-attachtment-pdf';
import AppointmentPaymentView from './view/appointment-payment-view';
import { useMyContext } from '../queue/view/queue-view';
import { DialogTitle } from '@mui/material';
import { usePathname, useParams } from 'src/routes/hook';
import ApprovedController from '../dashboard/_dashboardAPR-controller';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentItem: any;
  listItem: any;
  refetch: any;
  updateRow?: any;
  toggleData?: any;
  refetchToday?: any;
  refetchTabs?: any;
  isHistory?: any;
  resetState?:any;
};

export default function AppointmentDetails({
  updateRow,
  toggleData,
  refetch,
  refetchToday,
  listItem,
  currentItem,
  onClose,
  isHistory,
  refetchTabs,
  resetState
}: Props) {
  const viewPay = useBoolean();
  const viewLoa = useBoolean();
  const { triggerR, cRefetch }: any = useMyContext();
  const [payId, setPayId] = useState('');
  const openPay = useBoolean();
  const handlePay = useCallback(
    (id: string) => {
      openPay.onTrue();
      setPayId(id);
    },
    [openPay, setPayId]
  );

  console.log(listItem,'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

  const { refetch: refetchApprove } = ApprovedController();

  // alert(isHistory);

  const pathname = usePathname();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isLoading, setLoading] = useState(false);
  const upMd = useResponsive('up', 'md');

  const openClaim = useBoolean();
  const { id: paramId } = useParams();
  const viewClaim = useBoolean();
  const { user, socket } = useAuthContext();
  const isHmoView = useBoolean();

  // console.log(user, 'useruseruser');
  const isPatient = user?.role === 'patient';

  const [UpdateAppointments] = useMutation(UpdateAppointment);

  const {
    AddRequest = [],
    doctorInfo,
    Others,
    clinic,
    clinicInfo,
    date,
    doctor_no,
    id,
    patientInfo,
    patient_no,
    payment_status,
    status,
    symptoms,
    time_slot,
    e_time,
    type,
    remarks,
    voucherId,
    userId
  } = currentItem;

  console.log(currentItem?.appt_payment_attachment?.[0], 'mamaw');

  const NewAppointmentSchema = Yup.object().shape({
    // type: Yup.string().required('Appointment type is required'),
    // payment: Yup.bool().required('Payment status is required'),
    // status: Yup.string().required('Appointment status is required'),
  });

  const STATUS_OPTION = [
    {
      label: 'Pending',
      value: 0,
      disabled:
        user?.role === 'secretary'
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
    {
      label: 'Approved',
      value: 1,
      disabled:
        user?.permissions?.appt_approve === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
    {
      label: 'Done',
      value: 3,
      disabled:
        user?.permissions?.appt_done === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
    {
      label: 'Cancelled',
      value: 2,
      disabled:
        user?.permissions?.appt_cancel === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
  ];

  const PAYMENT_STATUS_OPTION = [
    {
      label: 'Paid',
      value: 1,
      disabled:
        user?.permissions?.appt_pay === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
    {
      label: 'Unpaid',
      value: 0,
      disabled:
        user?.permissions?.appt_pay === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
  ];

  const APPOINTMENT_TYPE_OPTION = [
    {
      label: 'Telemedicine',
      value: 1,
      disabled:
        user?.permissions?.appt_type === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
    {
      label: 'Face-to-Face',
      value: 2,
      disabled:
        user?.permissions?.appt_type === 0
          ? true
          : false || user?.role === 'patient'
          ? true
          : false || currentItem?.appt_payment_attachment?.[0]
          ? true
          : false || isHistory
          ? true
          : false,
    },
  ];

  const defaultValues = useMemo(
    () => ({
      type: listItem?.type,
      payment: listItem?.payment_status,
      status:Number(listItem?.status),
      remarks: listItem?.remark,
      id: listItem?.id,
    }),
    [currentItem?.id, listItem?.id, listItem?.appt_id]
    //  [listItem?.id]
  );

 console.log(defaultValues,'DEFALT_____________________________________#######################################')


  const methods = useForm<any>({
    resolver: yupResolver(NewAppointmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const [isQueue, setIsQuee] = useState(null);


  useEffect(()=>{
    setValue('status', Number(listItem?.status))
    setValue('payment', Number(listItem?.payment_status))
    setValue('type', Number(listItem?.type))
  },[listItem?.status, listItem?.id])

  // useEffect(() => {
  //   alert(pathname);

  // }, [isQueue, values?.status, pathname]);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['AppointmentUpdate']) => {
      const data: NexusGenInputs['AppointmentUpdate'] = {
        payment_status: model?.payment_status,
        remarks: model?.remarks,
        status: model?.status,
        type: model?.type,
        id: model?.id,
      };
      UpdateAppointments({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Updated Successfully');
          setSnackKey(null);
          // all devs must place their refetch component here else error!
          refetch();
          refetchToday();
          refetchApprove();
          reset()
          resetState()

          socket.emit('send notification',{
            recepient:Number(userId)
            
          })
          socket.emit('updateAppointment',{
            recepient:Number(userId),
            notification_type:3 
          })
          
          console.log(clinicInfo,'INFO@@@@@@@@@@')
          socket.emit('queueUpdate',{
            clinicUuid:clinicInfo?.uuid
          })

          // console.log(values.status, 'WEW?');
          if (pathname.includes('/dashboard/queue/')) {
            if (Number(values?.status) === 1) {
              triggerR('approved');
            } else if (Number(values?.status) === 2) {
              triggerR('cancelled');
            } else if (Number(values?.status) === 3) {
              triggerR('done');
            }else{
              localStorage.setItem('isPending','true')
            }
          }
          socket.off('send notification')
          socket.off('queueUpdate')

          socket.off('updateAppointment')

          // refetchTabs();

          // if (pathname === '/dashboard/queue/') {
          //   setIsQuee(true);
          // } else {
          //   setIsQuee(false);
          // }
          // switch (values.status) {
          //   case 0:
          //     triggerR('pending');
          //     break;
          //   case 1:

          //     break;
          // }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          console.log(error, 'error@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
          enqueueSnackbar('Something went wrong t', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const [tempData, setTempData] = useState(null);
  const mutationR = (d: any) => {
    setTempData((prev) => {
      return { ...currentItem, hmo_claims: d?.mutation_create_hmo_claims?.hmo_claims_data };
    });
  };

  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          payment_status: Number(values.payment),
          remarks: values.remarks,
          status: Number(values.status),
          type: Number(values?.type),
          id: Number(values.id),
        });
        // setSnackKey(null);
        
        onClose();
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: IAppointmentItem) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true,
        });
        setSnackKey(snackbarKey);

      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, onClose]
  );

  const patientName = patientInfo?.MNAME
    ? `${patientInfo?.FNAME} ${patientInfo?.MNAME} ${patientInfo?.LNAME}`
    : `${patientInfo?.FNAME} ${patientInfo?.LNAME}`;
  const ListpatientName = `${listItem?.patientInfo?.FNAME} ${listItem?.patientInfo?.MNAME} ${listItem?.patientInfo?.LNAME}`;
  const FEES = `${doctorInfo?.FEES}`;
  const MEDCERT_FEE = `${doctorInfo?.MEDCERT_FEE}`;
  const MEDCLEAR_FEE = `${doctorInfo?.MEDCLEAR_FEE}`;
  const MEDABSTRACT_FEE = `${doctorInfo?.MEDABSTRACT_FEE}`;

  const [toggleBtn, setToggle] = useState(false);

  // console.log(FEES,'ListpatientName')
  const renderViewPay = (
    <Dialog fullScreen open={viewPay.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>
          <Button variant="outlined" onClick={viewPay.onFalse}>
            Close
          </Button>
        </DialogActions>
        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <AppointmentPaymentPDF item={currentItem} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );

  const renderViewLoa = (
    <Dialog fullScreen open={viewLoa.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>
          <Button variant="outlined" onClick={viewLoa.onFalse}>
            Close
          </Button>
        </DialogActions>
        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <AppointmentLoaAttachment item={currentItem} appt_patient_info={currentItem} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );

  const isSecretary = () => {
    let text: any;
    if (user?.role === 'patient') {
      text = <></>;
    }
    if (user?.role === 'doctor') {
      if (currentItem?.appt_payment_attachment?.[0]) {
        text = <></>;
      } else {
        text = (
          <>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Save changes
            </LoadingButton>
          </>
        );
      }
    }
    if (user?.role === 'secretary') {
      if (
        user?.permissions?.appt_approve === 0 &&
        user?.permissions?.appt_cancel === 0 &&
        user?.permissions?.appt_done === 0 &&
        user?.permissions?.appt_pay === 0 &&
        user?.permissions?.appt_type === 0 &&
        user?.permissions?.appt_all === 0
      ) {
        text = <></>;
      } else {
        if (currentItem?.appt_payment_attachment?.[0]) {
          text = <></>;
        } else {
          text = (
            <>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                Save changes
              </LoadingButton>
            </>
          );
        }
      }
    }
    return text;
  };

  const convertTime = (timeStr: any) => {
    if (!timeStr) return 'N / A';
    let hour: any = Number(timeStr.split(':')[0]);
    const min = timeStr.split(':')[1];
    let AMPM = 'AM';
    if (hour > 12) {
      hour -= 12;
      AMPM = 'PM';
    }
    if (hour < 10) {
      hour = `0${hour}`;
    }
    return `${hour}:${min} ${AMPM}`;
  };

  const [selectedValue, setSelectedValue] = useState(0);
  const [renderSms, setRenderSms] = useState(null);
  // const selectedStatus = STATUS_OPTION.find((option) => option.value === selectedValue); // Replace `selectedValue` with the actual selected value.

  const sms = () => {
    let text: any;
    if ((selectedValue && selectedValue === 1) || getValues('status') === 1) {
      if (currentItem?.appt_payment_attachment?.[0]) {
        text = <></>;
      } else {
        text = (
          <>
            <Card>
              <CardHeader
                title="SMS MESSAGE"
                sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
              />
              <Typography
                variant="body1"
                sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}
              >
                {`Appointment with ${doctorInfo?.EMP_FULLNAME} on ${date} ${convertTime(
                  time_slot
                )} confirmed. Login to your HIP Account prior to the appointment for payment instruction.`}
              </Typography>
            </Card>
          </>
        );
      }
    } else if ((selectedValue && selectedValue === 2) || getValues('status') === 2) {
      if (currentItem?.appt_payment_attachment?.[0]) {
        text = <></>;
      } else {
        text = (
          <>
            <Card>
              <CardHeader
                title="SMS MESSAGE"
                sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
              />
              <Typography
                variant="body1"
                sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}
              >
                {`Appointment with ${doctorInfo?.EMP_FULLNAME} is cancelled. Please call the doctor's clinic for information.`}
              </Typography>
            </Card>
          </>
        );
      }
    } else if ((selectedValue && selectedValue === 3) || getValues('status') === 3) {
      text = <></>;
    } else if ((selectedValue && selectedValue === 0) || getValues('status') === 0) {
      text = <></>;
    }
    return text;
  };

  useEffect(() => {
    if (selectedValue) {
      setRenderSms(sms());
    }
  }, [selectedValue]);

  useEffect(() => {
    if (Number(getValues('status')) === 1) {
      setSelectedValue(1);
    }
    if (Number(getValues('status')) === 2) {
      setSelectedValue(2);
    }
    if (Number(getValues('status')) === 3) {
      setSelectedValue(3);
    }
    if (Number(getValues('status')) === 0) {
      setSelectedValue(3);
    }
  }, [getValues('status'), status]);

  useEffect(() => {
    if (status === 1) {
      // approve
      setSelectedValue(1);
    } else if (status === 2) {
      // cancel
      setSelectedValue(2);
    } else if (status === 3) {
      // cancel
      setSelectedValue(3);
    } else if (status === 0) {
      // cancel
      setSelectedValue(3);
    }
  }, [status]);

  return (
    <>
      {!upMd && (
        <DialogTitle>
          <AppointmentDetailsCover
            name={patientName}
            avatarUrl={patientInfo?.avatarUrl}
            job={patientInfo?.OCCUPATION}
            email={patientInfo?.EMAIL}
            coverUrl={patientInfo?.coverUrl}
            type={type}
            status={status}
            isPaid={payment_status}
            schedule={date}
            time_slot={time_slot}
            e_time={e_time}
            hospital={clinicInfo?.clinic_name}
            user={user}
            currentItem={currentItem}
          />
        </DialogTitle>
      )}
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={{ md: 2, xs: 0.2 }} sx={{ py: 3, position: 'relative' }}>
            {upMd && (
              <AppointmentDetailsCover
                name={patientName}
                avatarUrl={patientInfo?.avatarUrl}
                job={patientInfo?.OCCUPATION}
                email={patientInfo?.EMAIL}
                coverUrl={patientInfo?.coverUrl}
                type={type}
                status={status}
                isPaid={payment_status}
                schedule={date}
                time_slot={time_slot}
                e_time={e_time}
                hospital={clinicInfo?.clinic_name}
                user={user}
                voucherId={voucherId}
                currentItem={currentItem}
              />
            )}
            {/* <AppointmentDetailsCover
              name={patientName}
              avatarUrl={patientInfo?.avatarUrl}
              job={patientInfo?.OCCUPATION}
              email={patientInfo?.EMAIL}
              coverUrl={patientInfo?.coverUrl}
              type={type}
              status={status}
              isPaid={payment_status}
              schedule={date}
              time_slot={time_slot}
              hospital={clinicInfo?.clinic_name}
              user={user}
            /> */}
            <Stack sx={{ position: 'sticky' }}>
              <AppointmentDetailsComplaint
                data={symptoms}
                Others={Others}
                FEES={doctorInfo?.FEES}
                MEDCERT_FEE={doctorInfo?.MEDCERT_FEE}
                MEDCLEAR_FEE={doctorInfo?.MEDCLEAR_FEE}
                MEDABSTRACT_FEE={doctorInfo?.MEDABSTRACT_FEE}
                AddRequest={AddRequest}
              />
            </Stack>

            {/* <AppointmentDetailsRequest data={currentItem.request} /> */}

            <Box
              gap={{ md: 2, xs: 0.2 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <Card>
                <CardHeader
                  // ti tle={!isPatient ? <>Change Appointment Type</> : <>Appointment Type</>}
                  title={
                    <Typography variant={!upMd ? 'subtitle1' : 'h6'}>
                      {!isPatient ? 'Change Appointment Type' : 'Appointment Type'}
                    </Typography>
                  }
                  sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
                />

                <Box
                  sx={{
                    pt: { md: 0, xs: 0.2 },
                    px: { md: 2, xs: 1.5 },
                    pb: { md: 2, xs: 0.5 },
                    pointerEvents:
                      isPatient || user?.permissions?.appt_type === 0 || isHistory
                        ? 'none'
                        : 'unset',
                  }}
                >
                  <RHFRadioGroup name="type" options={APPOINTMENT_TYPE_OPTION} />
                </Box>
              </Card>

              <Card>
                <CardHeader
                  title={
                    <Typography variant={!upMd ? 'subtitle1' : 'h6'}>
                      {!isPatient ? 'Change Payment Status' : 'Payment Status'}
                    </Typography>
                  }
                  sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.5 } }}
                  action={
                    <Box>
                      {Boolean(currentItem?.payment_status || listItem?.payment_status) &&
                        !isHistory && (
                          <Button
                            variant="contained"
                            onClick={viewPay.onTrue}
                            startIcon={<Iconify icon="solar:eye-bold" />}
                          >
                            View
                          </Button>
                        )}

                      {currentItem?.type === 1 &&
                        currentItem?.payment_status === 0 &&
                        !currentItem?.patient_hmo &&
                        currentItem?.status === 1 &&
                        user?.role === 'patient' &&
                        !isHistory && (
                          <Button
                            variant="contained"
                            onClick={() => handlePay(currentItem)}
                            startIcon={<Iconify icon="solar:dollar-bold" />}
                          >
                            Pay
                          </Button>
                        )}
                    </Box>
                  }
                />

                <Box
                  sx={{
                    pt: { md: 0, xs: 0.2 },
                    px: { md: 2, xs: 1.5 },
                    pb: { md: 2, xs: 0.5 },
                    pointerEvents:
                      isPatient || user?.permissions?.appt_pay === 0 || isHistory
                        ? 'none'
                        : 'unset',
                  }}
                >
                  <RHFRadioGroup
                    name="payment"
                    onChange={(e) => {
                      setValue('payment', Number(e.target.value));
                    }}
                    options={PAYMENT_STATUS_OPTION}
                  />
                </Box>
              </Card>

              <Card>
                <CardHeader
                  title={
                    <Typography variant={!upMd ? 'subtitle1' : 'h6'}>
                      {!isPatient ? 'Change Appointment Status' : 'Appointment Status'}
                    </Typography>
                  }
                  sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
                />

                <Box
                  sx={{
                    pt: { md: 0, xs: 0.2 },
                    px: { md: 2, xs: 1.5 },
                    pb: { md: 2, xs: 0.5 },
                    pointerEvents: isPatient || isHistory ? 'none' : 'unset',
                  }}
                >
                  <RHFRadioGroup name="status" row options={STATUS_OPTION} />
                </Box>
              </Card>
            </Box>

            {/* <AppointmentDetailsRadio type={type} status={status} isPaid={payment_status} /> */}
            {!isPatient ? renderSms : <></>}

            <Card>
              <CardHeader
                title={
                  <Typography variant={!upMd ? 'subtitle1' : 'h6'}>{`Doctor's Note`}</Typography>
                }
                sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
              />

              <CardContent
                sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 0, xs: 0.5 } }}
              >
                <RHFTextField
                  name="remarks"
                  multiline
                  rows={3}
                  defaultValue={remarks}
                  // value={remarks}
                  InputProps={{ readOnly: user?.role !== 'doctor' }}
                />
              </CardContent>
            </Card>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Card>
                {!isHistory && (
                  <CardHeader
                    sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
                    title={
                      <Typography variant={!upMd ? 'subtitle1' : 'h6'}>HMO Details</Typography>
                    }
                    action={
                      currentItem?.patient_hmo === null ? (
                        <></>
                      ) : (
                        <>
                          {currentItem?.hmo_claims !== null || toggleBtn ? (
                            <Button
                              variant="contained"
                              onClick={viewClaim.onTrue}
                              startIcon={<Iconify icon="solar:eye-bold" />}
                            >
                              View Claim
                            </Button>
                          ) : user?.role === 'doctor' && currentItem?.hmo_claims === null ? (
                            <LoadingButton
                              sx={{ mr: { md: 0, xs: 2 } }}
                              variant="contained"
                              onClick={openClaim.onTrue}
                              loading={isLoading}
                              startIcon={<Iconify icon="mingcute:add-line" />}
                            >
                              Add Claim
                            </LoadingButton>
                          ) : null}
                        </>
                      )
                    }
                  />
                )}

                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  {!currentItem?.patient_hmo ? (
                    <Typography variant={!upMd ? 'subtitle1' : 'overline'} color="text.disabled">
                      No HMO Claimed
                    </Typography>
                  ) : (
                    <Paper
                      sx={{
                        py: 1,
                        px: 3,
                        width: 1,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Typography
                        sx={{
                          typography: 'body2',
                          '& > span': { typography: 'subtitle2' },
                        }}
                      >
                        HMO NAME :&nbsp;
                        <span>{currentItem?.patient_hmo?.hmoInfo?.name}</span>
                      </Typography>

                      <Typography
                        sx={{
                          typography: 'body2',
                          '& > span': { typography: 'subtitle2' },
                        }}
                      >
                        MEMBER ID :&nbsp;
                        <span>{currentItem?.patient_hmo?.member_id}</span>
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>

              <Card>
                {!isHistory && (
                  <CardHeader
                    title={
                      <Typography variant={!upMd ? 'subtitle1' : 'h6'}>LOA Attachment</Typography>
                    }
                    sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
                    action={
                      currentItem?.appt_hmo_attachment &&
                      currentItem?.appt_hmo_attachment?.length > 0 && (
                        <Button
                          variant="contained"
                          onClick={viewLoa.onTrue}
                          startIcon={<Iconify icon="solar:eye-bold" />}
                        >
                          View
                        </Button>
                      )
                    }
                  />
                )}

                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="overline" color="text.disabled">
                    {`${
                      // currentItem?.appt_hmo_attachment ?
                      currentItem?.appt_hmo_attachment?.length || 0
                    } LOA attachment(s)`}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        {/* {user?.role === 'patient' ? (
          <></>
        ) : (
          <>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Save changes
            </LoadingButton>
          </>
        )} */}
        {isSecretary()}
      </DialogActions>

      <CreateHmoModal
        mutationR={mutationR}
        toggleBtn={() => setToggle(!toggleBtn)}
        toggleData={toggleData}
        updateRow={updateRow}
        open={openClaim.value}
        onClose={openClaim.onFalse}
        currentItem={currentItem}
        isLoading={isLoading}
        setLoading={setLoading}
      />

      <ViewHmoModal
        tempData={tempData}
        open={viewClaim.value}
        onClose={viewClaim.onFalse}
        listItem={listItem}
        id={currentItem}
      />

      {renderViewLoa}

      {renderViewPay}

      <AppointmentPaymentView
        refetch={refetch}
        open={openPay.value}
        onClose={openPay.onFalse}
        id={payId}
      />
    </>
  );
}
