'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ClinicNewForm from '../clinic/clinic-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  appendData: any;
  appendDataClient: any;
  uuid: any;
  provinces: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function UserClinicCreateView({
  uuid,
  provinces,
  appendData,
  appendDataClient,
  open,
  onClose,
  refetch,
}: Props) {
  const upMd = useResponsive('up', 'md');
  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      disableBackdropClick
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 860 },
      }}
    >
      <DialogTitle>Add New Clinic & Schedule</DialogTitle>

      <ClinicNewForm
        provinces={provinces}
        uuid={uuid}
        appendDataClient={appendDataClient}
        onClose={onClose}
        appendData={appendData}
        refetch={refetch}
      />
    </Dialog>
  );
}
