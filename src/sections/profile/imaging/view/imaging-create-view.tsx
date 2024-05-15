'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// components
//
import ProfileImagingNewForm from '../imaging-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  setRefetch: any;
  setLoading: any;
  isLoading: any;
};

// ----------------------------------------------------------------------

export default function ProfileImagingCreateView({setLoading, isLoading, open, onClose,setRefetch }: Props) {
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
      <DialogTitle>Create New Record</DialogTitle>

      <ProfileImagingNewForm setRefetch={setRefetch} setLoading={setLoading} isLoading={isLoading} onClose={onClose} />
    </Dialog>
  );
}
