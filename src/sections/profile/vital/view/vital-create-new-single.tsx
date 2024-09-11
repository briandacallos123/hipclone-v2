'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ProfileVitalNewEditForm from '../vital-new-form';
import ProfileVitalNewEditFormSingle from '../vital-new-form-single';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  items: any;
  user: any;
  addedCategory:any;
  data?:any;
};

// ----------------------------------------------------------------------

export default function VitalCreateNewSingle({data, addedCategory, open, onClose, refetch, items, user }: Props) {
  const upMd = useResponsive('up', 'md');
  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 520 },
      }}
    >
      <DialogTitle>Add New Vital Reading</DialogTitle>

      <ProfileVitalNewEditFormSingle data={data} addedCategory={addedCategory} onClose={onClose} items={items} refetch={refetch} user={user} />
    </Dialog>
  );
}
