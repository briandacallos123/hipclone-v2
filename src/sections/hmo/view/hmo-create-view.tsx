'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { _appointmentList } from 'src/_mock';
//
import HmoNewForm from '../hmo-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function HmoCreateView({ open, onClose }: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Add HMO Claim</DialogTitle>

      <HmoNewForm onClose={onClose} />
    </Dialog>
  );
}
