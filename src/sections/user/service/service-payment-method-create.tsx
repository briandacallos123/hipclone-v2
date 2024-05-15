'use client';

// @mui
import Dialog from '@mui/material/Dialog';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ServicePaymentMethodNewEditForm from './service-payment-method-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  appendData: any;
  tempId: any;
  resolveData: any;
};

// ----------------------------------------------------------------------

export default function ServicePaymentMethodCreate({
  tempId,
  appendData,
  refetch,
  open,
  resolveData,
  onClose,
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
      <ServicePaymentMethodNewEditForm
        appendData={appendData}
        refetch={refetch}
        resolveData={resolveData}
        onClose={onClose}
        tempId={tempId}
      />
    </Dialog>
  );
}
