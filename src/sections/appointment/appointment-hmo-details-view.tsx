'use client';

// @mui
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _userSubaccount } from 'src/_mock';
//
import HmoEditForm from './hmo-edit-form-appointment';

// ----------------------------------------------------------------------

type Props = {
  id?: any;
  listItem?: any;
  tempData?: any;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function HmoDetailsView({ id,listItem,tempData, open, onClose}: Props) {

  
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
      <DialogTitle>HMO Claim Details</DialogTitle>

  <HmoEditForm tempData={tempData} listItem={listItem && listItem} currentItem={id && id } onClose={onClose}/>
    </Dialog>
  );
}
