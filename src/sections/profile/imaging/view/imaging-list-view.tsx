'use client';
import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IImagingItem } from 'src/types/document';
// components
import Iconify from 'src/components/iconify';
//
import { ImagingListView } from '@/sections/imaging/view';
import ProfileImagingCreateView from './imaging-create-view';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type Props = {
  data: IImagingItem[];
};

export default function ProfileImagingListView({ data }: Props) {
  const upMd = useResponsive('up', 'md');
  const [isRefetch, setRefetch] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const openCreate = useBoolean();

  return (
    <>
      <ImagingListView
        data={data}
        isRefetch={isRefetch}
        setRefetch={setRefetch}
        action={
          upMd ? (
            <LoadingButton
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreate.onTrue}
              loading={isLoading}
              sx={{ ml: 2, width: 140 }}
            >
              New Record
            </LoadingButton>
          ) : (
            <IconButton onClick={openCreate.onTrue} >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          )
        }
      />

      <ProfileImagingCreateView setRefetch={setRefetch} setLoading={setLoading} isLoading={isLoading} open={openCreate.value} onClose={openCreate.onFalse} />
    </>
  );
}
