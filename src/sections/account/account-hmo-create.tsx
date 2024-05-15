'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import AccountHmoNewEditForm from './account-hmo-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  hmoList: any;
  d: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function AccountHmoCreate({ hmoList, refetch, d, open, onClose }: Props) {
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
      <DialogTitle>Add New HMO</DialogTitle>

      <AccountHmoNewEditForm refetch={refetch} d={d} hmoList={hmoList} onClose={onClose} />
    </Dialog>
  );
}
