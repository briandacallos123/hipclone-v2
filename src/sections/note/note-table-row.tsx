import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
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
import QRCode from 'qrcode';

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
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { MenuItem, Stack } from '@mui/material';
import { isToday } from '@/utils/format-time';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------

type Props = {
  row: any;
  ids: any;
  onEditRow?: any;
  onDeleteRow?: any;
  rowData: any;
  onDownloadRow: any;
  esigData: any;
  qrImage: any;
  imgSrc: any;
};

export default function NoteTableRow({
  row,
  onDeleteRow,
  ids,
  onViewRow,
  onEditRow,
  rowData,
  onDownloadRow,
  esigData,
  qrImage,
  imgSrc,
}: any) {
  const view = useBoolean();

  console.log('----rowData------------------rowData', rowData);
  const upMd = useResponsive('up', 'md');
  // const { textData, medClearData, medCertData, AbstractData, VaccData } = useNotesHooks(row);
  const confirm = useBoolean();
  const { user } = useAuthContext();

  // useEffect(() => {
  //   if (!upMd) {
  //     onDownloadRow();
  //   }
  // }, [upMd]);

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteRow();
            confirm.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

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

  // const [rowData, setRowData] = useState<any>([]);
  // const [labData, setLabData] = useState<any>([]);

  // console.log(rowData,'ROWDATAAAAAAAAAAAAAAAAA!!!!!!!!')

  // useEffect(() => {
  //   if (row?.R_TYPE === '1') {
  //     getSoapFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNoteSoap } = data;

  //         setSoapData(QueryNoteSoap);
  //         // console.log('asdadasdadsadasdasdasd', soapData);
  //       }
  //     });
  //     setRowData(soapData);
  //   }
  //   if (row?.R_TYPE === '4') {
  //     getTxtsFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNoteTxt } = data;

  //         setTxtData(QueryNoteTxt);
  //       }
  //     });
  //     // console.log(())
  //     setRowData(textData);
  //   }
  //   if (row?.R_TYPE === '5') {
  //     getLabFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID), // need force to number
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNotesLab } = data;

  //         setLabData(QueryNotesLab);
  //       }
  //     });
  //     setRowData(labData);
  //   }
  //   if (row?.R_TYPE === '8') {
  //     getMedClearFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNotesMedCler } = data;

  //         setMedClearData(QueryNotesMedCler);
  //       }
  //     });
  //     setRowData(medClearData);
  //   }
  //   if (row?.R_TYPE === '9') {
  //     getMedCertFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNotesMedCert } = data;

  //         setMedCertData(QueryNotesMedCert);
  //       }
  //     });

  //     setRowData(medCertData);
  //   }
  //   if (row?.R_TYPE === '10') {
  //     getAbstFunc({
  //       variables: {
  //         data: {
  //           recordID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNotesAbstract } = data;

  //         setAbstData(QueryNotesAbstract);
  //       }
  //     });
  //     setRowData(AbstractData);
  //   }
  //   if (row?.R_TYPE === '11') {
  //     getVaccFunc({
  //       variables: {
  //         data: {
  //           reportID: Number(row?.R_ID),
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { QueryNotesPedCertObj } = data;

  //         setVaccData(QueryNotesPedCertObj);
  //       }
  //     });
  //     setRowData(VaccData);
  //   }
  // }, [
  //   labData,
  //   VaccData,
  //   AbstractData,
  //   medCertData,
  //   medClearData,
  //   row?.R_ID,
  //   row?.R_TYPE,
  //   soapData,
  //   textData,
  //   view.value,
  // ]);
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

  const generateQR = async (text: any) => {
    try {
      const res = await QRCode.toDataURL(text);
      setQrImage(res);
    } catch (err) {
      console.error(err);
    }
  };

  const [link, setLink] = useState<string | null>(null);
  const [qrImage2, setQrImage] = useState(null);
  // const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   if (view.value) {
  //     (async () => {
  //       let domain = '';
  //       switch (row?.R_TYPE) {
  //         case '4':
  //           domain = `records/medical-note/${row?.qrcode}`;
  //           break;
  //         case '9':
  //           domain = `records/medical-certificate/${row?.qrcode}`;
  //           break;
  //         case '8':
  //           domain = `records/medical-clearance/${row?.qrcode}`;
  //           break;
  //         case '1':
  //           domain = `records/medical-soap/${row?.qrcode}`;
  //           break;
  //         case '10':
  //           domain = `records/medical-abstract/${row?.qrcode}`;
  //           break;
  //         case '11':
  //           domain = `records/medical-vaccine/${row?.qrcode}`;
  //           break;
  //       }
  //       // const myLink = `https://hip.apgitsolutions.com/${domain}`;
  //       const myLink = `http://localhost:9092/${domain}`;

  //       setLink(myLink);
  //       await generateQR(myLink);

  //       if (row?.notes_text?.length !== 0) {
  //         try {
  //           const response = await fetch('/api/getImage', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               image: row?.notes_text[0]?.file_name,
  //             }),
  //           });

  //           if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //           }

  //           const blob = await response.blob();
  //           const objectUrl = URL.createObjectURL(blob);
  //           setImgSrc(objectUrl);

  //           // Clean up object URL on component unmount
  //           return () => {
  //             URL.revokeObjectURL(objectUrl);
  //           };
  //         } catch (error) {
  //           console.error('Error fetching image:', error);
  //         }
  //       }
  //     })();
  //   }
  // }, [view.value]);

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
          {Render(row?.R_TYPE, rowData, imgSrc, qrImage)}
        </Box>
      </Box>
    </Dialog>
  );

  if (!upMd) {
    return (
      <>
        <TableMobileRow
        // menu={[
        //   {
        //     label: 'View',
        //     icon: 'solar:eye-bold',
        //     func: view.onTrue,
        //   },
        // ]}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flex: 7, alignItems: 'center' }}>
              {row?.clinicInfo === null ? (
                <Avatar alt={row?.clinicInfo?.clinic_name} sx={{ mr: 2 }}>
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
            <div style={{ flex: 1 }}>
              {/* <IconButton onClick={onDownloadRow}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton> */}
              {RenderDownload(row?.R_TYPE, rowData, imgSrc, qrImage, esigData, onDownloadRow)}
            </div>
          </div>
        </TableMobileRow>

        {renderView}
        {renderConfirm}
      </>
    );
  }

  const popover = usePopover();
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
            {row?.clinicInfo === null && row?.R_TYPE === '8' ? (
              <Avatar alt={row?.clinicInfo?.clinic_name} sx={{ mr: 2 }}>
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
        {renderConfirm}
        <TableCell align="center" sx={{ px: 1 }}>
          {user?.role !== 'patient' ? (
            <>
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>

              <Stack direction="row" justifyContent="flex-end">
                <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
                  {isToday(row?.R_DATE) && (
                    <MenuItem
                      onClick={() => {
                        onEditRow();
                      }}
                      sx={{ color: 'success.main' }}
                    >
                      <Iconify icon="mdi:pencil" />
                      Edit
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={() => {
                      // popover.onClose();
                      onViewRow();
                      // view.onTrue()
                    }}
                    sx={{ color: 'success.main' }}
                  >
                    <Iconify icon="mdi:eye" />
                    View
                  </MenuItem>

                  {isToday(row?.R_DATE) && (
                    <MenuItem
                      onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <Iconify icon="ic:baseline-delete" />
                      Delete
                    </MenuItem>
                  )}
                </CustomPopover>
              </Stack>
            </>
          ) : (
            <Tooltip title="View Details" placement="top" arrow>
              <IconButton onClick={onViewRow}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Tooltip>
          )}
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

function Render(data: string, row: any, img: any, qrImage: any) {
  console.log(data, 'DATAAAAAAAAA');
  console.log(img, 'imgimg');
  console.log(qrImage, 'qrImage');

  return (
    <>
      {data === '1' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFSoap qrImage={qrImage} item={row} />
        </PDFViewer>
      )}

      {data === '4' && img && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFText qrImage={qrImage} imgSrc={img} item={row} />
        </PDFViewer>
      )}

      {data === '5' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFLaboratory item={row} />
        </PDFViewer>
      )}

      {data === '8' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFClearance qrImage={qrImage} item={row} />
        </PDFViewer>
      )}
      {data === '9' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFCertificate qrImage={qrImage} item={row} />
        </PDFViewer>
      )}

      {data === '10' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFAbstract qrImage={qrImage} item={row} />
        </PDFViewer>
      )}

      {data === '11' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFVaccine qrImage={qrImage} item={row} />
        </PDFViewer>
      )}
    </>
  );
}

function RenderDownload(
  data: string,
  row: any,
  img: any,
  qrImage: any,
  esigData: any,
  onDownloadRow: any
) {
  const [dataReady, setDataReady] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  const handleDownload = async () => {
    try {
      // Fetch the data for the PDF
      const fetchedData = await onDownloadRow();

      // Assume onDownloadRow returns data needed for PDF rendering
      setPdfData(fetchedData);

      // Mark the data as ready for download
      setDataReady(true);
    } catch (error) {
      console.error('Error fetching data for PDF:', error);
    }
  };

  return (
    <>
      {data === '1' && (
        <PDFDownloadLink
          document={<NotePDFSoap qrImage={qrImage} item={row} esigData={esigData} />}
          fileName="Mednote(SOAP).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                if (row) {
                  onDownloadRow();
                }
                onDownloadRow();
              }, 500);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}

      {data === '4' && (
        <PDFDownloadLink
          document={<NotePDFText qrImage={qrImage} imgSrc={img} item={row} esigData={esigData} />}
          fileName="Mednote(TEXT).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                onDownloadRow();
              }, 1000);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}

      {data === '5' && (
        <PDFDownloadLink
          document={<NotePDFLaboratory item={row} qrImage={qrImage} esigData={esigData} />}
          fileName="Mednote(Laboratory).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                onDownloadRow();
              }, 1000);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}

      {data === '8' && (
        <PDFDownloadLink
          document={<NotePDFClearance qrImage={qrImage} item={row} esigData={esigData} />}
          fileName="Mednote(Clearance).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                onDownloadRow();
              }, 1000);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}
      {data === '9' && (
        <PDFDownloadLink
          document={<NotePDFCertificate qrImage={qrImage} item={row} esigData={esigData} />}
          fileName="Mednote(Certificate).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          {({ loading }) =>
            loading ? (
              <Iconify icon="eos-icons:loading" width={30} />
            ) : (
              <IconButton color="default" onClick={() => onDownloadRow()}>
                <Iconify icon="eva:cloud-download-fill" width={30} />
              </IconButton>
            )
          }
        </PDFDownloadLink>
      )}

      {data === '10' && (
        <PDFDownloadLink
          document={<NotePDFAbstract qrImage={qrImage} item={row} esigData={esigData} />}
          fileName="Mednote(Abstract).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                onDownloadRow();
              }, 1000);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}

      {data === '11' && (
        <PDFDownloadLink
          document={<NotePDFVaccine qrImage={qrImage} item={row} esigData={esigData} />}
          fileName="Mednote(VAccine).pdf"
          style={{
            textDecoration: 'none',

            color: '#fff',

            border: 'none',
            borderRadius: '5px',
          }}
          onClick={() => onDownloadRow()}
        >
          <IconButton
            color="default"
            onClick={() => {
              onDownloadRow();
              setTimeout(() => {
                onDownloadRow();
              }, 1000);
            }}
          >
            <Iconify icon="eva:cloud-download-fill" width={30} />
          </IconButton>
        </PDFDownloadLink>
      )}
    </>
  );
}
