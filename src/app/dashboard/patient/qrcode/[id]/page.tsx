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
// import PrescriptionDetails from '../prescription-details';
// import PrescriptionPDF from '../prescription-pdf';
// import PrescriptionEditView from './prescription-edit-view';
    import PrescriptionPDFQr from '../../../../../sections/prescription/view/qrcode'
import { useLazyQuery } from '@apollo/client';
import { ViewPrescription } from '@/libs/gqls/prescription';
import { PrescriptionsUserQr } from '@/libs/gqls/prescription';
import { useParams, useRouter } from 'src/routes/hook';
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

export default function PatientQr({
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
//   const [currentItem, seCurrentItem] = useState();
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();
//   console.log(currentItem, 'currentItem@@ ');
const [currentItem, setCurrentItem] = useState(null)
const [isLoading, setIsLoading] = useState(true);
const [isOpen, setOpen] = useState(false)

const {id:myId} = useParams();

//   const [getData, { data, error, loading }]: any = useLazyQuery(ViewPrescription);

  const [getPrecsciption, { data, loading, error }] = useLazyQuery(PrescriptionsUserQr, {
    context: {
        requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
      },
      notifyOnNetworkStatusChange: true,
  });

  const view = useBoolean();
  console.log(currentItem,'HUHHHHHHHHHHHH')

  useEffect(()=>{
    getPrecsciption({
        variables: {
          data: {
            id:Number(myId)
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
  
        if (data) {
          const { QueryAllPrescriptionUserQr } = data;
          setCurrentItem(QueryAllPrescriptionUserQr?.Prescription_data)
  
        }
        setIsLoading(false);
      });
  },[])

  useEffect(()=>{
    if(currentItem){
        view.onTrue()
    }
  },[currentItem])

 



  const edit = useBoolean();
  // const [openEdit, setOpenEdit] = useState(false);

  // console.log(edit, 'edit');
  return (
    <>
      <Dialog
        fullScreen={!upMd}
        fullWidth
        maxWidth={false}
        open={view.value}
        onClose={()=>{

        }}
        PaperProps={{
          sx: { maxWidth: 720 },
        }}
      >

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <Button variant="contained" onClick={view.onTrue}>
            View and Print
          </Button>
        </DialogActions>
      </Dialog>
 

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
              <PrescriptionPDFQr item={currentItem} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
