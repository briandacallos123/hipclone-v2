'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import SubaccountNewForm from '../subaccount/subaccount-new-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  isLoading: any;
  setLoading: any;
};

// ----------------------------------------------------------------------

export default function UserSubaccountCreateView({
  isLoading,
  setLoading,
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
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Create New Sub-account</DialogTitle>

      <SubaccountNewForm
        isLoading={isLoading}
        setLoading={setLoading}
        onClose={onClose}
        refetch={refetch}
      />
    </Dialog>
  );
}
