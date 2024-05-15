'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';

import PatientVitalNewEditForm from '../vital-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  items: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function PatientVitalCreateView({ open, onClose, items, refetch }: Props) {
  const upMd = useResponsive('up', 'md');
  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Add New Vital Reading</DialogTitle>

      <PatientVitalNewEditForm onClose={onClose} items={items} refetch={refetch} />
    </Dialog>
  );
}
