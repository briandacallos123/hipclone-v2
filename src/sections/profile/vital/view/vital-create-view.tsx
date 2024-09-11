'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ProfileVitalNewEditForm from '../vital-new-form';
import { Button, Stack } from '@mui/material';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  items: any;
  user: any;
  addedCategory:any;
  openCategory:any;
};

// ----------------------------------------------------------------------

export default function ProfileVitalCreateView({openCategory, addedCategory, open, onClose, refetch, items, user }: Props) {
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
      {/* <DialogTitle>Add New Vital Reading</DialogTitle> */}

      <Stack direction="row" sx={{pr:2}} alignItems="center" justifyContent="space-between">
        <DialogTitle>Add New Vital Reading</DialogTitle>
        {/* <Button onClick={openCategory} startIcon={<Iconify icon="mingcute:add-line" />} variant="contained">Add New Vital Category</Button> */}
      </Stack>

      <ProfileVitalNewEditForm addedCategory={addedCategory} onClose={onClose} items={items} refetch={refetch} user={user} />
    </Dialog>
  );
}
