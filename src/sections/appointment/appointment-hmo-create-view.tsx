'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { _appointmentList } from 'src/_mock';
//
import HmoNewForm from './hmo-new-form-appointment';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentItem:any
  updateRow:any
  toggleBtn:any
  toggleData:any
  mutationR:any
  isLoading:any
  setLoading:any
};

// ----------------------------------------------------------------------

export default function HmoCreateView({isLoading, setLoading,toggleData,mutationR,toggleBtn, updateRow, open, onClose ,currentItem}: Props) {
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
      <DialogTitle>Add HMO Claim</DialogTitle>

      <HmoNewForm isLoading={isLoading} setLoading={setLoading} mutationR={mutationR} toggleBtn={toggleBtn} updateRow={updateRow} toggleData={toggleData} onClose={onClose} currentItem={currentItem}/>
    </Dialog>
  );
}
