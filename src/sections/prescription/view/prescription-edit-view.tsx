'use client';

// @mui
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _prescriptionList } from 'src/_mock';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify/iconify';
//
import PrescriptionNewEditForm from '../prescription-new-edit-form';
import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { DR_CLINICS } from '../../../libs/gqls/drprofile';
// ----------------------------------------------------------------------

type Props = {
  id: any;
  open: any;
  onClose: VoidFunction;
  queryData: any;
  SubmitClient: any;
  setIsRefetch: any;
  clinicData: any;
  tempId: any;
  runCatch: any;
  onCloseView: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function PrescriptionEditView({
  SubmitClient,
  queryData,
  id,
  open,
  onClose,
  setIsRefetch,
  clinicData,
  tempId,
  refetch,
  runCatch,
  onCloseView,
}: Props) {
  const upMd = useResponsive('up', 'md');
  // const currentItem = _prescriptionList.find((item) => item.id === id);
  const [currentItem, setCurrentItem] = useState(null);

  // getData, { data, error, loading };
  // console.log(currentItem, 'yay@');
  // loading: clinicLoading, data: clinicData
  // const [getData, { data: clinicData, error, loading: clinicLoading }] = useLazyQuery(DR_CLINICS);

  useEffect(() => {
    setCurrentItem(id);
    // getData({
    //   variables: {
    //     data: {
    //       id: id?.DOCTOR,
    //     },
    //   },
    // }).then(async (result: any) => {
    // const { data } = result;
    // setSummary(data?.QueryAllEMR?.summary);
    // });
  }, [id?.ID]);

  // console.log('REFETCH?', refetch);
  return (
    <>
      {currentItem && (
        <Dialog
          fullScreen={!upMd}
          fullWidth
          maxWidth={false}
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: { maxWidth: 860 },
          }}
        >
          <DialogTitle>
            <CardHeader
              title="Repeat Prescriptions"
              action={
                <Button
                  component={Link}
                  href="https://www.mims.com/philippines/drug"
                  target="_blank"
                  variant="contained"
                  startIcon={<Iconify icon="solar:arrow-right-outline" />}
                >
                  MIMS
                </Button>
              }
              sx={{ p: 0 }}
            />
          </DialogTitle>

          <PrescriptionNewEditForm
            clinic={clinicData}
            currentItem={currentItem}
            onClose={onClose}
            refetch={refetch}
            queryData={queryData}
            SubmitClient={SubmitClient}
            tempId={tempId}
            onCloseView={onCloseView}
            setIsRefetch={setIsRefetch}
            runCatch={runCatch}
          />
        </Dialog>
      )}
    </>
  );
}
