'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import EmrNewEditForm from '../emr-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function EmrCreateView({ ...rest }: Props) {
  const upMd = useResponsive('up', 'md');

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={rest.open}
      onClose={rest.onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Create New Patient</DialogTitle>

      <EmrNewEditForm {...rest} />
    </Dialog>
  );
}
