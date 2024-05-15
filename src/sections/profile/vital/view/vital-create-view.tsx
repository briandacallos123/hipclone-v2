'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ProfileVitalNewEditForm from '../vital-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  items: any;
  user: any;
};

// ----------------------------------------------------------------------

export default function ProfileVitalCreateView({ open, onClose, refetch, items, user }: Props) {
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

      <ProfileVitalNewEditForm onClose={onClose} items={items} refetch={refetch} user={user} />
    </Dialog>
  );
}
