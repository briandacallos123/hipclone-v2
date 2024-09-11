import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PDFViewer } from '@react-pdf/renderer';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
// _mock
import { _doctorList, _hospitals } from 'src/_mock';
// types
import { INoteItem } from 'src/types/document';
// components
import Iconify from 'src/components/iconify';
import { LogoFull } from 'src/components/logo';
import { TableMobileRow } from 'src/components/table';

import { get_note_lab } from '@/libs/gqls/notes/notesLabReq';
import { get_note_soap } from '@/libs/gqls/notes/notesSoap';
import { get_note_physical } from '@/libs/gqls/notes/notesPhysical';
import { get_note_txt } from '@/libs/gqls/notes/notesTxt';
import { get_note_medClear } from '@/libs/gqls/notes/notesMedClear';
import { get_note_medCert } from '@/libs/gqls/notes/noteMedCert';
import { get_note_Abstract } from '@/libs/gqls/notes/notesAbstract';
import { get_note_vaccine } from '@/libs/gqls/notes/noteVaccine';
//
import { useLazyQuery } from '@apollo/client';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import useNotesHooks from './_notesHooks';

import NotePDFSoap from './note-pdf-soap';
import NotePDFText from './note-pdf-text';
import NotePDFLaboratory from './note-pdf-lab';
import NotePDFCertificate from './note-pdf-certificate';
import NotePDFClearance from './note-pdf-clearance';
import NotePDFAbstract from './note-pdf-abstract';
import NotePDFVaccine from './note-pdf-vaccine';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  ids: any;
};

export default function NoteTableRow({ row, ids, onViewRow}: any) {
  const view = useBoolean();
  const upMd = useResponsive('up', 'md');
  // const { textData, medClearData, medCertData, AbstractData, VaccData } = useNotesHooks(row);

  const [labData, setLabData] = useState<any>([]);
  const [getLabFunc, getLabNotes]: any = useLazyQuery(get_note_lab, {
    context: {
      requestTrackerId: 'getNotesLab[gNOTLab]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [soapData, setSoapData] = useState<any>([]);
  const [getSoapFunc, getSoapNotes]: any = useLazyQuery(get_note_soap, {
    context: {
      requestTrackerId: 'getNotesSoap[gNOTSOP]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [textData, setTxtData] = useState<any>([]);
  const [getTxtsFunc, getTxtsNotes]: any = useLazyQuery(get_note_txt, {
    context: {
      requestTrackerId: 'getNotesTxt[gNOTTXT]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [medClearData, setMedClearData] = useState<any>([]);
  const [getMedClearFunc, getMedClearNotes]: any = useLazyQuery(get_note_medClear, {
    context: {
      requestTrackerId: 'getNotesMedCler[gNOTCLER]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [medCertData, setMedCertData] = useState<any>([]);
  const [getMedCertFunc, getMedCertNotes]: any = useLazyQuery(get_note_medCert, {
    context: {
      requestTrackerId: 'getNotesMedCert[gNOTCERT]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [AbstractData, setAbstData] = useState<any>([]);
  const [getAbstFunc, getAbstNotes]: any = useLazyQuery(get_note_Abstract, {
    context: {
      requestTrackerId: 'getNotesAbs[gNOTABS]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [VaccData, setVaccData] = useState<any>([]);
  const [getVaccFunc, getVaccNotes]: any = useLazyQuery(get_note_vaccine, {
    context: {
      requestTrackerId: 'getNotesVacc[gNOTVAC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [rowData, setRowData] = useState<any>([]);
  // const [labData, setLabData] = useState<any>([]);

  useEffect(() => {
    if (row?.R_TYPE === '1') {
      getSoapFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNoteSoap } = data;

          setSoapData(QueryNoteSoap);
          // console.log('asdadasdadsadasdasdasd', soapData);
        }
      });
      setRowData(soapData);
    }
    if (row?.R_TYPE === '4') {
      getTxtsFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNoteTxt } = data;

          setTxtData(QueryNoteTxt);
        }
      });
      // console.log(())
      setRowData(textData);
    }
    if (row?.R_TYPE === '5') {
      getLabFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID), // need force to number
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesLab } = data;

          setLabData(QueryNotesLab);
        }
      });
      setRowData(labData);
    }
    if (row?.R_TYPE === '8') {
      getMedClearFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesMedCler } = data;

          setMedClearData(QueryNotesMedCler);
        }
      });
      setRowData(medClearData);
    }
    if (row?.R_TYPE === '9') {
      getMedCertFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesMedCert } = data;

          setMedCertData(QueryNotesMedCert);
        }
      });

      setRowData(medCertData);
    }
    if (row?.R_TYPE === '10') {
      getAbstFunc({
        variables: {
          data: {
            recordID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesAbstract } = data;

          setAbstData(QueryNotesAbstract);
        }
      });
      setRowData(AbstractData);
    }
    if (row?.R_TYPE === '11') {
      getVaccFunc({
        variables: {
          data: {
            reportID: Number(row?.R_ID),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesPedCertObj } = data;

          setVaccData(QueryNotesPedCertObj);
        }
      });
      setRowData(VaccData);
    }
  }, [
    labData,
    VaccData,
    AbstractData,
    medCertData,
    medClearData,
    row?.R_ID,
    row?.R_TYPE,
    soapData,
    textData,
    view.value,
  ]);
  // console.log(row, '@___________@');
  // const [getData, { data, loading }]: any = useLazyQuery(get_note_lab);

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         patientID: row?.patientID,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { QueryNotesLab } = data;
  //       // setTable(todaysAPR);
  //       setLabData(QueryNotesLab);
  //     }
  //   });
  // }, [getData, row?.patientID]);

  // console.log('data: ', row?.R_TYPE);

  // const { noteNumber, type, date, doctor, hospitalId } = row;

  // const keyDoctor = _doctorList.filter((_) => _.id === doctor.id)[0].doctor;

  // const keyHospital = _hospitals.filter((_) => _.id === hospitalId)[0];

  // const fullName = `${keyDoctor.firstName} ${keyDoctor.lastName}, ${keyDoctor.title}`;
  const formatDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const renderView = (
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
          {Render(row?.R_TYPE, rowData)}
        </Box>
      </Box>
    </Dialog>
  );

  if (!upMd) {
    return (
      <>
        <TableMobileRow
          menu={[
            {
              label: 'View',
              icon: 'solar:eye-bold',
              func: view.onTrue,
            },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>

            {row?.clinicInfo === null? (
                <Avatar
                  alt={row?.clinicInfo?.clinic_name} 
                  sx={{ mr: 2 }}
                >
                     {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={row?.clinicInfo?.clinic_name} 
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1] || ''}
                  sx={{ mr: 2 }}
                >
                    {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              )}
            <ListItemText
              primary={`#${row?.R_ID}`}
              secondary={
                <>
                  <Typography variant="caption">{reader(row?.R_TYPE)}</Typography>
                  <Typography variant="caption">{row?.clinicInfo?.clinic_name}</Typography>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </TableMobileRow>

        {renderView}
      </>
    );
  }

  return (
    <>
      <TableRow hover>
        <TableCell>{formatDate(row?.R_DATE)}</TableCell>

        {/* <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row?.doctorInfo?.EMP_FULLNAME} sx={{ mr: 2 }}>
              {row?.doctorInfo?.EMP_FULLNAME?.charAt(0)?.toUpperCase()}
            </Avatar>

            <ListItemText
              primary={row?.doctorInfo?.EMP_FULLNAME}
              primaryTypographyProps={{ typography: 'subtitle2' }}
            />
          </div>
        </TableCell> */}

        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>

              {row?.clinicInfo === null  && row?.R_TYPE === '8'  ? (
                <Avatar
                  alt={row?.clinicInfo?.clinic_name} 
                  sx={{ mr: 2 }}
                >
                     {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={row?.clinicInfo?.clinic_name} 
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                    {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              )}

             {/* <Avatar 
            alt={row?.clinicInfo?.clinic_name} 
            src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
            sx={{ mr: 2 }}>
              {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={row?.clinicInfo?.clinic_name}
              secondary={row?.clinicInfo?.location}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
          </div>
        </TableCell>

        <TableCell align="center">
          <ListItemText
            primary={`#${row?.R_ID}`}
            secondary={reader(row?.R_TYPE)}
            primaryTypographyProps={{
              typography: 'subtitle2',
              color: 'primary.main',
              textAlign: 'center',
            }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
              textAlign: 'center',
            }}
          />
        </TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <Tooltip title="View Details" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {renderView}
    </>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <>
      {data === '1' && 'S.O.A.P'}
      {/* {data === '3' && 'Prescriptions'} */}
      {data === '4' && 'Medical Note'}
      {data === '5' && 'Laboratory Request'}
      {data === '9' && 'Medical Certificate'}
      {data === '8' && 'Medical Clearance'}
      {data === '10' && 'Medical Abstract'}
      {data === '11' && 'Medical Certificate for Pediatric COVID-19 Vaccine'}
    </>
  );
}

function Render(data: string, row: any) {
  return (
    <>
      {data === '1' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFSoap item={row} />
        </PDFViewer>
      )}

      {data === '4' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFText item={row} />
        </PDFViewer>
      )}

      {data === '5' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFLaboratory item={row} />
        </PDFViewer>
      )}

      {data === '8' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFClearance item={row} />
        </PDFViewer>
      )}
      {data === '9' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFCertificate item={row} />
        </PDFViewer>
      )}

      {data === '10' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFAbstract item={row} />
        </PDFViewer>
      )}

      {data === '11' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFVaccine item={row} />
        </PDFViewer>
      )}
    </>
  );
}
