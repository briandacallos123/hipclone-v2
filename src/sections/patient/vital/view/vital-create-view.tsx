'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';

import PatientVitalNewEditForm from '../vital-new-form';
import { Button, Stack } from '@mui/material';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  items: any;
  refetch: any;
  addedCategory:any;
  openCategory:any;
};

// ----------------------------------------------------------------------

export default function PatientVitalCreateView({addedCategory, openCategory, open, onClose, items, refetch }: Props) {
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
      {/* <DialogTitle>Add New Vital Reading</DialogTitle>
       */}

      <Stack direction="row" sx={{ pr: 2 }} alignItems="center" justifyContent="space-between">
        
        <DialogTitle>Add New Vital Reading</DialogTitle>

        <Button size={upMd?'medium':'small'} sx={{
          fontSize:!upMd && 14
        }} onClick={openCategory} startIcon={<Iconify icon="mingcute:add-line" />} variant="contained">Add Category</Button>
      </Stack>

      <PatientVitalNewEditForm addedCategory={addedCategory} onClose={onClose} items={items} refetch={refetch} />
    </Dialog>
  );
}
