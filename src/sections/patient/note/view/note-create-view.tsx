'use client';

import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';
// utils
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { LogoFull } from 'src/components/logo';
//
import { useResponsive } from 'src/hooks/use-responsive';

import NoteNewFormSoap from '../note-new-form-soap';
import NoteNewFormText from '../note-new-form-text';
import NoteNewFormLaboratory from '../note-new-form-lab';
import NoteNewFormCertificate from '../note-new-form-certificate';
import NoteNewFormClearance from '../note-new-form-clearance';
import NoteNewFormAbstract from '../note-new-form-abstract';
import NoteNewFormVaccine from '../note-new-form-vaccine';

// ----------------------------------------------------------------------

const PaperStyle = styled(Paper)(({ theme }) => ({
  ...theme.typography.subtitle2,
  textAlign: 'center',
  border: '2px solid transparent',
  cursor: 'pointer',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create(['border', 'color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  refIds?: any;
  refetch: any;
  editData?:any;
};

const FORMS = [
  {
    value: 'soap',
    label: 'S.O.A.P',
    icon: <Iconify icon="solar:heart-pulse-2-bold-duotone" width={48} />,
  },
  {
    value: 'text',
    label: 'Text/Notes',
    icon: <Iconify icon="solar:document-add-bold-duotone" width={48} />,
  },
  {
    value: 'laboratory',
    label: 'Lab Request',
    icon: <Iconify icon="solar:test-tube-minimalistic-bold-duotone" width={48} />,
  },
  {
    value: 'certificate',
    label: 'Certificate',
    icon: <Iconify icon="solar:bookmark-square-minimalistic-bold-duotone" width={48} />,
  },
  {
    value: 'clearance',
    label: 'Clearance',
    icon: <Iconify icon="solar:file-check-bold-duotone" width={48} />,
  },
  {
    value: 'abstract',
    label: 'Abstract',
    icon: <Iconify icon="solar:clipboard-list-bold-duotone" width={48} />,
  },
  {
    value: 'vaccine',
    label: 'Vaccine Cert.',
    icon: <Iconify icon="solar:shield-bold-duotone" width={48} />,
  },
];

// ----------------------------------------------------------------------

export default function PatientNoteCreateView({ editData, open, onClose, refIds, refetch }: Props) {
  const [type, setType] = useState<string | null>(null);

  const openForm = useBoolean();
  // console.log('heyd', refIds?.patientInfo);
  const upMd = useResponsive('up', 'md');
  const reader = () => (
    <>
      {type === 'soap' && 'S.O.A.P'}
      {type === 'text' && 'TEXT/NOTES'}
      {type === 'laboratory' && 'LAB REQUEST'}
      {type === 'certificate' && 'CERTIFICATE'}
      {type === 'clearance' && 'CLEARANCE'}
      {type === 'abstract' && 'ABSTRACT'}
    </>
  );

    useEffect(()=>{
      if(editData){
        openForm.onTrue();
        setType((()=>{
          let formTarget:any;

          switch(editData?.R_TYPE){
            case "4":
              formTarget = "text";
              break;
            case "9":
              formTarget = "certificate";
              break;
            case "8":
              formTarget = "clearance";
              break;
            case "1":
              formTarget = "soap";
              break;
            case "10":
              formTarget = "abstract";
              break;
            case "11":
              formTarget = "vaccine";
              break;
            case "5":
              formTarget = "laboratory";
              break;


          }

          return formTarget;
        })());
      }
    },[editData])
  
    console.log(editData,'EDIT DATAAAAAAAAA!#')

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
        {/* <DialogTitle>Create New Record</DialogTitle> */}

        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="h6">Create New Record</Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </DialogActions>

        <DialogContent sx={{ pb: 3 }}>
          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {FORMS.map((form) => (
              <PaperStyle
                key={form.value}
                onClick={() => {
                  openForm.onTrue();
                  setType(form.value);
                }}
              >
                {form.icon}
                <div>{form.label}</div>
              </PaperStyle>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog fullScreen open={openForm.value}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="h6">{reader()}</Typography>
          </Box>
          <Button variant="outlined" onClick={openForm.onFalse}>
            Close
          </Button>
        </DialogActions>

        {type === 'soap' && (
          <NoteNewFormSoap
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refIds={refIds?.patientInfo}
            refetch={refetch}
            editData={editData}

          />
        )}

        {type === 'text' && (
          <NoteNewFormText
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            editData={editData}
            refIds={refIds}
            refetch={refetch}
          />
        )}

        {type === 'laboratory' && (
          <NoteNewFormLaboratory
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refIds={refIds?.patientInfo}
            refetch={refetch}
            editData={editData}

          />
        )}

        {type === 'certificate' && (
          <NoteNewFormCertificate
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refIds={refIds?.patientInfo}
            refetch={refetch}
            editData={editData}
          />
        )}

        {type === 'clearance' && (
          <NoteNewFormClearance
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refIds={refIds?.patientInfo}
            refetch={refetch}
            editData={editData}
          />
        )}

        {type === 'abstract' && (
          <NoteNewFormAbstract
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refIds={refIds?.patientInfo}
            refetch={refetch}
            editData={editData}

          />
        )}

        {type === 'vaccine' && (
          <NoteNewFormVaccine
            onClose={() => {
              openForm.onFalse();
              onClose();
            }}
            refetch={refetch}
            refIds={refIds?.patientInfo}
            editData={editData}

          />
        )}
      </Dialog>
    </>
  );
}
