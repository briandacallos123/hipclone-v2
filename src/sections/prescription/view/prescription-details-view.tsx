'use client';
import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
// _mock
import { _prescriptionList } from 'src/_mock';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from '@/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { LogoFull } from 'src/components/logo';
//
import PrescriptionDetails from '../prescription-details';
import PrescriptionPDF from '../prescription-pdf';
import PrescriptionEditView from './prescription-edit-view';
import { useLazyQuery } from '@apollo/client';
import { ViewPrescription } from '@/libs/gqls/prescription';
import QRCode from 'qrcode'
// ----------------------------------------------------------------------

type Props = {
  id: any;
  open: boolean;
  onClose: any;
  SubmitClient?: any;
  runCatch?: any;
  tempId?: any;
  setIsRefetch?: any;
  clinicData?: any;
  queryData?: any;
  refetch?: any;
};

// ----------------------------------------------------------------------

export default function PrescriptionDetailsView({
  setIsRefetch,
  tempId,
  clinicData,
  runCatch,
  queryData,
  SubmitClient,
  id,
  open,
  onClose,
  refetch,
}: Props) {
  // const currentItem = _prescriptionList.filter((item)  => item.id === id)[0];
  const [currentItem, seCurrentItem] = useState();
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();
  console.log(currentItem, 'currentItem@@ ');
  const [getData, { data, error, loading }]: any = useLazyQuery(ViewPrescription);

  useEffect(() => {
    seCurrentItem(id);
    // getData({
    //   variables: {
    //     data: {
    //       id: Number(id?.ID),
    //     },
    //   },
    // }).then(async (result: any) => {
    //   const { data } = result;
    //   console.log(data?.QueryPrescription?.Prescription_data, 'new');

    //   seCurrentItem(data?.QueryPrescription?.Prescription_data);
    // });
  }, [id?.ID]);

  const view = useBoolean();

  const edit = useBoolean();
  // const [openEdit, setOpenEdit] = useState(false);

  // console.log(edit, 'edit');

  const [qrImage, setQrImage] = useState(null)

  const generateQR = async(text:any) => {
    try {
      const res = await QRCode.toDataURL(text)
      // return <img width="50%" height="50%" src={res}/>
      setQrImage(res)
    } catch (err) {
      console.error(err)
    }
  }
  const [link, setLink] = useState<string | null>(null)

  useEffect(()=>{
    (async()=>{
      
      const link = `https://hip.apgitsolutions.com/dashboard/prescription/${currentItem?.presCode}`
      setLink(link)
      await generateQR(link)
    })()
  },[currentItem?.ID])
  
  return (
    <>
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
        <DialogTitle>
          {user?.role === 'doctor' ? (
            <CardHeader
              title="Prescription Information"
              action={
                <Button
                  onClick={edit.onTrue}
                  variant="contained"
                  startIcon={
                    <Iconify
                      icon="solar:repeat-one-minimalistic-bold"
                      sx={{ transform: 'rotate(90deg)' }} 
                    />
                  }
                >
                  Repeat
                </Button>
              }
              sx={{ p: 0 }}
            />
          ) : (
            <CardHeader title="Prescription Information" sx={{ p: 0 }} />
          )}
        </DialogTitle>

        {qrImage && <PrescriptionDetails link={link} qr={qrImage} currentItem={currentItem} />}

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <Button variant="contained" onClick={view.onTrue}>
            View and Print
          </Button>
        </DialogActions>
      </Dialog>

      <PrescriptionEditView
        clinicData={clinicData}
        queryData={queryData}
        tempId={tempId}
        refetch={refetch}
        setIsRefetch={setIsRefetch}
        runCatch={runCatch}
        SubmitClient={SubmitClient}
        open={edit.value}
        onCloseView={onClose}
        onClose={edit.onFalse}
        id={id}
      />

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Box sx={{ ml: 2, flex: 1 }}>
              <LogoFull disabledLink />
            </Box>

            <Button variant="outlined" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <PrescriptionPDF item={currentItem} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
