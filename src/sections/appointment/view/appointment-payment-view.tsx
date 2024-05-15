'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _appointmentList } from 'src/_mock';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
//
import AppointmentPaymentForm from '../appointment-payment-form';

// ----------------------------------------------------------------------

type Props = {
  id: string | null;
  open: boolean;
  onClose: VoidFunction;
  refetch?: any;
};

// ----------------------------------------------------------------------

export default function AppointmentPaymentView({ id, open, onClose, refetch }: Props) {
  // const currentItem = _appointmentList.find((item) => item.id === id);

  const isSm = useResponsive('down', 'md');

  return (
    <Dialog
      fullWidth
      fullScreen={isSm}
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 1080 },
      }}
    >
      <DialogTitle>Appointment Payment</DialogTitle>

      <AppointmentPaymentForm refetch={refetch} currentItem={id} onClose={onClose} />
    </Dialog>
  );
}
