'use client';

import React, { useMemo, useCallback } from 'react';
// @mui
import * as Yup from 'yup';
import { useForm, Controller, CustomRenderInterface, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import DialogContent from '@mui/material/DialogContent';
import CardHeader from '@mui/material/CardHeader';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormProvider, { RHFRadioGroup, RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useAuthContext } from '@/auth/hooks';
import Iconify from '@/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function SendSMSCreate({ open, onClose }: Props) {
  const { user } = useAuthContext();
  const name = user?.displayName;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const upMd = useResponsive('up', 'md');

  const NewSchema = Yup.object().shape({
    // type: Yup.string().required('Appointment type is required'),
    // payment: Yup.bool().required('Payment status is required'),
    // status: Yup.string().required('Appointment status is required'),
  });
  const defaultValues = useMemo(
    () => ({
      cancelOption1: 0,
      lateOption1: 0,
      lateOptionTime: null,
      EROption: 0,
      faceOption: 0,
      faceOptionTime: null,
    }),
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  // console.log(values);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        onClose();
        enqueueSnackbar('Message Sent!');
        reset();
      } catch (error) {
        console.log('error');
      }
    },
    [enqueueSnackbar, reset, onClose]
  );

  const CANCEL_APPOINTMENT_OPTION = [
    {
      label: 'Sorry, I have an emergency. Pls call my clinic/secretary to reschedule.',
      value: 1,
    },
    {
      label: 'Sorry, I have an emergency. Pls book another appointment with me.',
      value: 2,
    },
  ];
  const LATE_APPOINTMENT_OPTION = [
    {
      label: (
        <Typography>
          I will be late. I’m available today at{' '}
          <span>
            <Controller
              name="lateOptionTime"
              control={control}
              render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                <TimePicker
                  label="Time"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      error: !!error,
                      size: 'small',
                      helperText: error?.message,
                    },
                  }}
                  sx={{ width: 180 }}
                />
              )}
            />
          </span>
          . Reply thru N-HIP. Click :https://natrapharm.hips-md.com
        </Typography>
      ),
      value: 1,
    },
    {
      label: 'Sorry I will be late. Please check your hip inbox',
      value: 2,
    },
  ];

  const RECOMMEND_APPOINTMENT_OPTION = [
    {
      label:
        'After review of your symptoms, I suggest you proceed to hospital for medical attention.',
      value: 1,
    },
  ];

  const FACE2F_APPOINTMENT_OPTION = [
    {
      label: (
        <Typography>
          Doctor is ready to see you.Proceed to clinic in{' '}
          <span>
            <RHFSelect name="faceOptionTime" label="Duration" sx={{ width: 180 }}>
              <MenuItem value="15">5 Mins</MenuItem>
              <MenuItem value="30">10 Mins</MenuItem>
              <MenuItem value="45">15 Mins</MenuItem>
            </RHFSelect>
          </span>{' '}
          for consultation
        </Typography>
      ),
      value: 1,
    },
  ];
  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720, p: { md: 2, xs: 0 } },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title={
            <Typography variant={!upMd ? 'subtitle1' : 'h6'}>{` Send SMS to ${name}`}</Typography>
          }
          sx={{ pb: { md: 4, xs: 0 } }}
        />
        <DialogContent sx={{ pb: { md: 3, xs: 0 } }}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" />}>
              <Typography sx={{ width: '33%', flexShrink: 0, color: 'primary.main' }}>
                Cancelling Appointment
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RHFRadioGroup name="cancelOption1" options={CANCEL_APPOINTMENT_OPTION} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" />}>
              <Typography sx={{ width: '33%', flexShrink: 0, color: 'primary.main' }}>
                Late for Appointment
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RHFRadioGroup name="lateOption1" options={LATE_APPOINTMENT_OPTION} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" />}>
              <Typography sx={{ width: '33%', flexShrink: 0, color: 'primary.main' }}>
                Recommends ER visit
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RHFRadioGroup name="EROption" options={RECOMMEND_APPOINTMENT_OPTION} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" />}>
              <Typography sx={{ width: '33%', flexShrink: 0, color: 'primary.main' }}>
                Face-to-Face Queue
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RHFRadioGroup name="faceOption" options={FACE2F_APPOINTMENT_OPTION} />
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Send Message
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
