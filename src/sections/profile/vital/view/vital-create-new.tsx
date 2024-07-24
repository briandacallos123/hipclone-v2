'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ProfileVitalNewEditForm from '../vital-new-form';
import VitalNewCategoryForm from '../vital-new-category-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  items: any;
  user: any;
  addedCategory:any;
};

// ----------------------------------------------------------------------

export default function VitalCreateNew({addedCategory, open, onClose, refetch, items, user }: Props) {
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
      <DialogTitle>Add New Vital Category</DialogTitle>

      <VitalNewCategoryForm addedCategory={addedCategory} onClose={onClose} items={items} refetch={refetch} user={user} />
    </Dialog>
  );
}
