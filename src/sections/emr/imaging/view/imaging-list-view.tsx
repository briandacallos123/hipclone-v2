'use client';

import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// _mock
import { _imagingList } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
//
import { ImagingListView } from 'src/sections/imaging/view';
import EmrImagingCreateView from './imaging-create-view';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type Props = {
  slug?: any;
  data?: any;
};

export default function EmrImagingListView({ slug, data }: Props) {
  const upMd = useResponsive('up', 'md');
  const [isRefetch, setRefetch]= useState(false);
  const [isLoading, setLoading] = useState(false);
  // console.log('DATA@@:', data);
  const openCreate = useBoolean();

  const [tableData] = useState(_imagingList.filter((_) => _.patientId === slug));

  return (
    <>
      <ImagingListView
        data_slug={slug}
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
            <IconButton onClick={openCreate.onTrue}>
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          )
        }
      />

      <EmrImagingCreateView setRefetch={setRefetch} setLoading={setLoading} isLoading={isLoading} open={openCreate.value} onClose={openCreate.onFalse} data={data} />
    </>
  );
}
