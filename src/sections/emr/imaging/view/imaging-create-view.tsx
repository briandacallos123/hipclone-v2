'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// components
//
import { useResponsive } from 'src/hooks/use-responsive';
import EmrImagingNewForm from '../imaging-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  data?: any;
  setRefetch?: any;
  setLoading?: any;
  isLoading?: any;
};

// ----------------------------------------------------------------------

export default function EmrImagingCreateView({
  setLoading,
  isLoading,
  open,
  onClose,
  data,
  setRefetch,
}: Props) {
  const upMd = useResponsive('up', 'md');
  // console.log(setLoading, 'setRefetch');
  // console.log(setRefetch, 'setLoading');

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
      <DialogTitle>Create New Record</DialogTitle>

      <EmrImagingNewForm
        setRefetch={setRefetch}
        setLoading={setLoading}
        isLoading={isLoading}
        onClose={onClose}
        data={data}
      />
    </Dialog>
  );
}
