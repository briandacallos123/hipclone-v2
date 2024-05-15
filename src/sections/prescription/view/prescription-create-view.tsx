'use client';

// @mui
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
// components
import Iconify from 'src/components/iconify/iconify';
//
import { useResponsive } from 'src/hooks/use-responsive';

import PrescriptionNewEditForm from '../prescription-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  clinicData: any;
  queryData: any;
  SubmitClient: any;
  // setIsRefetch: any;
  tempId: any;
  runCatch: any;
  refetch: any;
};

// ----------------------------------------------------------------------

export default function PrescriptionCreateView({
  clinicData,
  open,
  onClose,
  // setIsRefetch,
  tempId,
  runCatch,
  queryData,
  refetch,
  SubmitClient,
}: Props) {
  const upMd = useResponsive('up', 'md');
  // const [currentItem, setCurrentItem] = useState(null);

  //   useEffect(() => {
  //     setCurrentItem(id);
  //   }, [id?.ID]);
  return (
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
          title="Create New Prescriptions"
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
        currentItem={null}
        onClose={onClose}
        queryData={queryData}
        SubmitClient={SubmitClient}
        tempId={tempId}
        onCloseView={() => {
          console.log('running');
        }}
        // setIsRefetch={setIsRefetch}/
        runCatch={runCatch}
        refetch={refetch}
      />
    </Dialog>
  );
}
