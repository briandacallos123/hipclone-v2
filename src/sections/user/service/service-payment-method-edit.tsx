'use client';

// @mui
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
// _mock
import { _userService } from 'src/_mock';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ServicePaymentMethodNewEditForm from './service-payment-method-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: any;
  // clinicData: any;
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  // deleteId: any;
  appendData: any;
  updateData: any;
  onSuccess: any;
  isView:boolean;
};

// ----------------------------------------------------------------------

export default function ServicePaymentMethodEdit({
  refetch,
  // clinicData,
  id,
  open,
  onClose,
  appendData,
  updateData,
  onSuccess,
  isView
}: Props) {
  const [currentItem, setCurrentItem] = useState();
  // alert(deleteId);

  useEffect(() => {
    setCurrentItem(id);
  }, [id?.id]);
  // const currentItem = _userService.paymentMethod.find((item) => item.id === id);
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
      {currentItem && (
        <ServicePaymentMethodNewEditForm
          // clinicData={clinicData}
          currentItem={currentItem}
          onClose={onClose}
          refetch={refetch}
          appendData={appendData}
          updateData={updateData}
          isView={isView}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
}
