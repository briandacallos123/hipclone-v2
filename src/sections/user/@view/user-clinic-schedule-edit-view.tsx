'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// types
import { ISchedule } from 'src/types/general';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ClinicScheduleNewEditForm from '../clinic/clinic-schedule-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  item?: any;
  open: boolean;
  onClose: VoidFunction;
  setHideSched: any;
  modifySched: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function UserClinicScheduleEditView({
  modifySched,
  setHideSched,
  item,
  open,
  onClose,
  refetch,
}: Props) {
  const isEdited = true;
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
      <DialogTitle>Edit Schedule</DialogTitle>

      <ClinicScheduleNewEditForm
        setHideSched={setHideSched}
        currentItem={item}
        onClose={onClose}
        isEdit={isEdited}
        modifySched={modifySched}
        refetch={refetch}
      />
    </Dialog>
  );
}
