'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _userProfileHmo } from 'src/_mock';
//
import AccountHmoNewEditForm from './account-hmo-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function AccountHmoEdit({ id, open, onClose }: Props) {
  const currentItem = _userProfileHmo.find((item) => item.id === id);

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
      <DialogTitle>{`Edit ${currentItem?.name}`}</DialogTitle>

      <AccountHmoNewEditForm currentItem={currentItem} onClose={onClose} />
    </Dialog>
  );
}
