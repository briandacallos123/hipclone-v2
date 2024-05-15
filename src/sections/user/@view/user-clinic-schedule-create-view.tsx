'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ClinicScheduleNewEditForm from '../clinic/clinic-schedule-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  id: any;
  refetch: any;
  modifySched: any;
  appendClinic: any;
  setHideSched: any;
};

// ----------------------------------------------------------------------

export default function UserClinicScheduleCreateView({
  appendClinic,
  refetch,
  modifySched,
  open,
  onClose,
  setHideSched,
  id,
}: Props) {
  const isEdit = false;
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
      <DialogTitle>Add New Schedule</DialogTitle>

      <ClinicScheduleNewEditForm
        isEdit={isEdit}
        modifySched={modifySched}
        onClose={onClose}
        id={id}
        currentItem={id}
        setHideSched={setHideSched}
        appendClinic={appendClinic}
        refetch={refetch}
      />
    </Dialog>
  );
}
