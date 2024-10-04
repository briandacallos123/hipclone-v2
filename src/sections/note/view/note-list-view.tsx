'use client';

import { useState, useCallback, useEffect } from 'react';
// @muis
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _hospitals, HOSPITAL_OPTIONS } from 'src/_mock';
// hooks
import { usePathname } from 'src/routes/hook';
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { INoteItem, INoteTableFilters, INoteTableFilterValue } from 'src/types/document';
// components
import Scrollbar from 'src/components/scrollbar';
import { isDateError } from 'src/components/custom-date-range-picker';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import { GET_RECORD_BY_PATIENT, GET_RECORD_BY_PATIENT_USER } from '@/libs/gqls/records';
import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
import { EMR_MED_NOTE } from '@/libs/gqls/emr';
import { DR_CLINICS } from '@/libs/gqls/drprofile';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import NoteTableRow from '../note-table-row';
import NoteTableToolbar from '../note-table-toolbar';
import NoteTableFiltersResult from '../note-table-filters-result';
import NoteTableRowSkeleton from '../note-table-row-skeleton';
import useNotesHooks from '../_notesHooks';
import { useSessionStorage } from '@/hooks/use-sessionStorage';
import { DoctorClinicsHistory } from '@/libs/gqls/drprofile';
import { Box, Button, Dialog, DialogActions } from '@mui/material';
import { LogoFull } from '@/components/logo';
import { PDFViewer } from '@react-pdf/renderer';

import NotePDFSoap from '../note-pdf-soap';
import NotePDFText from '../note-pdf-text';
import NotePDFLaboratory from '../note-pdf-lab';
import NotePDFCertificate from '../note-pdf-certificate';
import NotePDFClearance from '../note-pdf-clearance';
import NotePDFAbstract from '../note-pdf-abstract';
import NotePDFVaccine from '../note-pdf-vaccine';
import { useBoolean } from '@/hooks/use-boolean';
import QRCode from 'qrcode'
import { isToday } from 'src/utils/format-time';
import { DeleteNotesLabReq, get_note_lab } from '@/libs/gqls/notes/notesLabReq';
import { DeleteNotesSoap, get_note_soap } from '@/libs/gqls/notes/notesSoap';
import { DeleteNotesText, get_note_txt } from '@/libs/gqls/notes/notesTxt';
import { DeleteNotesCler, get_note_medClear } from '@/libs/gqls/notes/notesMedClear';
import { DeleteNotesCert, get_note_medCert } from '@/libs/gqls/notes/noteMedCert';
import { DeleteNotesAbs, get_note_Abstract } from '@/libs/gqls/notes/notesAbstract';
import { DeleteNotesVacc, get_note_vaccine } from '@/libs/gqls/notes/noteVaccine';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
  // { id: 'doctor', label: 'Doctor' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
];

const defaultFilters = {
  name: '',
  hospital: [],
  startDate: null,
  endDate: null,
  recType: '-1',
  reset: false
};

// ----------------------------------------------------------------------
type Props = {
  refIds?: any;
  action?: React.ReactNode;
  id?: any;
  isEMR?: any;
  setPayloads: any;
  data: any;
  loading: any;
  refetch: any;
  tableData1: any;
  totalData: any;
  Ids: any;
  notesRecordResult: any;
  clinicData: any;
  patientLoading?: any;
  updateRow?:any;
  setClearData?:any;
  clearData?:any;
  refetchChild?:any;
  setRefetchChild?:any;
};
export default function NoteListView({
  refIds,
  action,
  id,
  isEMR,
  setPayloads,
  data,
  loading,
  refetch,
  tableData1,
  totalData,
  Ids,
  notesRecordResult,
  clinicData,
  patientLoading,
  updateRow,
  clearData,
  setClearData,
  refetchChild,
  setRefetchChild

}: Props) {
  const upMd = useResponsive('up', 'md');
  const table = useTable({ defaultOrder: 'desc', defaultOrderBy: 'date' });
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { page, rowsPerPage, order, orderBy } = table;
  const [filters, setFilters] = useState(defaultFilters);
  const { getItem } = useSessionStorage();
  const [isClinic, setIsClinic] = useState(0);

  // console.log(clinicData,'clinicDataclinicDataclinicDataclinicDataclinicDataclinicDataclinicDataclinicDataclinicDataclinicData')
  useEffect(() => {
    setPayloads({
      //
      clinicIds: filters?.hospital.map((v: any) => Number(v)) || filters?.hospital,
      skip: page * rowsPerPage,
      take: rowsPerPage,
      orderBy,
      orderDir: order,
      userType: String(user?.role),
      uuid: String(refIds),
      emrID: Number(id),
      checkEMR: isEMR,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      searchKeyword: filters?.name,
      recordType: String(filters?.recType),
    });
  }, [
    filters?.endDate,
    filters?.hospital,
    filters?.hospital?.length,
    filters.name,
    filters?.startDate,
    filters,
    id,
    isEMR,
    order,
    orderBy,
    page,
    refIds,
    rowsPerPage,
    setPayloads,
    user?.role,
    filters?.recType,
    filters.reset
  ]);

  const dateError = isDateError(filters.startDate, filters.endDate);

  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DoctorClinicsHistory);

  const dataFiltered = applyFilter({
    inputData: tableData1,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // default filters
  // useEffect(() => {
  //   const data = getItem('defaultFilters');
  //   if (data?.clinic) {
  //     filters.hospital = [Number(data?.clinic?.id)]
  //   }
  // }, []);

  const denseHeight = table.dense ? 56 : 76;
  const [isPatient, setIspatient] = useState<boolean>();

  const canReset =
    !!filters.name ||
    !!filters.hospital?.length ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

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

  const [isLoadingPatient, setIsLoadingPatient] = useState(true);

  const notFound = !loading && !tableData1.length;

  const handleFilters = useCallback(
    (name: string, value: INoteTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = () => {
    setFilters({
      name: '',
      hospital: [],
      startDate: null,
      endDate: null,
      recType: '-1',
      reset: false
    });
  };


  const [getDataUser, { data: userData, loading: patLoad }]: any = useLazyQuery(
    GET_RECORD_BY_PATIENT_USER,
    {
      context: {
        requestTrackerId: 'getRecords[gPATMedNote]',
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const notFoundPatient = !patientLoading && !tableData1?.length;


  useEffect(() => {
    if (isClinic === 1) {
      const clinicItem = tableData1?.map((item: any) => Number(item?.CLINIC));
      setClinicPayload(clinicItem);
    }
  }, [tableData1, isClinic]);
  // console.log(tableData1,'BOSSSSSSSSSSSSSSSSSSSSSSS________________________')

  const [clinicPayload, setClinicPayload] = useState<any>([]);
  const {
    data: userClinicData,
    error: userClinicError,
    loading: userClinicLoad,
    refetch: userClinicFetch,
  }: any = useQuery(GET_CLINIC_USER, {
    variables: {
      data: {
        clinicIds: clinicPayload || filters?.hospital,
      },
    },
  });


  useEffect(() => {
    const clinicItem = tableData1?.map((item: any) => Number(item?.CLINIC));
    setClinicPayload(clinicItem);
  }, []);

  const view = useBoolean();
  const [noteData, setNoteData] = useState(null)
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  console.log(imgSrc,'imgSrcimgSrc')

  const [openNotes, setOpenNotes] = useState(false);

  // useEffect(() => {
  //   if (imgSrc || openNotes) {
  //     view.onTrue()
  //   }
  // }, [imgSrc, openNotes])




  const [link, setLink] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState(null)
  const [rowData, setRowData] = useState<any>(null);

  const generateQR = async (text: any) => {
    try {
      const res = await QRCode.toDataURL(text)
      setQrImage(res)
    } catch (err) {
      console.error(err)
    }
  }

  console.log(link, "MYLINKKK")

  useEffect(()=>{
    if(noteData){
      (async()=>{
        const row = noteData;
        let domain = "";
        switch (row?.R_TYPE) {
          case "4":
            domain = `records/medical-note/${row?.qrcode}`;
            break;
          case "9":
            domain = `records/medical-certificate/${row?.qrcode}`;
            break;
          case "8":
              domain = `records/medical-clearance/${row?.qrcode}`;
              break;
          case "5":
            domain = `records/medical-request/${row?.qrcode}`;
            break;
          case "1":
            domain = `records/medical-soap/${row?.qrcode}`;
            break;
          case "10":
              domain = `records/medical-abstract/${row?.qrcode}`;
              break;
          case "11":
              domain = `records/medical-vaccine/${row?.qrcode}`;
              break;
    
        }
        const myLink = `https://hip.apgitsolutions.com/${domain}`;
    
        setLink(myLink)
        await generateQR(myLink)
    
        if (row?.notes_text?.length !== 0) {
          try {
            const response = await fetch('/api/getImage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: row?.notes_text[0]?.file_name
              }),
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setImgSrc(objectUrl);
            setNoteData(row)
    
            // Clean up object URL on component unmount
            return () => {
              URL.revokeObjectURL(objectUrl);
            };
          } catch (error) {
            console.error('Error fetching image:', error);
          }
        }
      })()
    }
  },[noteData])

  const [targetQuery, setTargetQuery] = useState<number | null>(null);


  useEffect(()=>{
    if(refetchChild){
      console.log(targetQuery,'target mo boi')
      switch(targetQuery){
        case 1:
          getSoapNotes.refetch();
          break;
        case 4:
          getTxtsNotes.refetch();
          break;
        case 5:
          getLabNotes.refetch();
          break;
        case 8:
          getMedClearNotes.refetch();
          break;
        case 9:
          getMedCertNotes.refetch();
          break;
        case 10:
          getAbstNotes.refetch();
          break;
        case 11:
          getVaccNotes.refetch();
          break;
      }
      setRefetchChild(false)
    }
  },[refetchChild, targetQuery])

  const handleViewRow = async (row: any) => {

    setNoteData(row)

    
    //  else {
    //   setNoteData(row)
    //   setOpenNotes(true)
    // }



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

          setTargetQuery(1);

          // setSoapData(QueryNoteSoap);
          setRowData(QueryNoteSoap);
          // console.log('asdadasdadsadasdasdasd', soapData);
        }
      });
      // setRowData(soapData);
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

          // setTxtData(QueryNoteTxt);
      setTargetQuery(4);

      setRowData(QueryNoteTxt);

        }
      });
      // console.log(())
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
          setTargetQuery(5);

          setRowData(QueryNotesLab);

          // setLabData(QueryNotesLab);
        }
      });
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
          setTargetQuery(8);

          // setMedClearData(QueryNotesMedCler);
      setRowData(QueryNotesMedCler);

        }
      });
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
          setTargetQuery(9);

          setRowData(QueryNotesMedCert);

          // setMedCertData(QueryNotesMedCert);
        }
      });

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
          setTargetQuery(10);

          setRowData(QueryNotesAbstract);

          // setAbstData(QueryNotesAbstract);
        }
      });
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
          setTargetQuery(11);

          setRowData(QueryNotesPedCertObj);

          // setVaccData(QueryNotesPedCertObj);
        }
      });
    }
   
  }


  const renderView = (
    <Dialog fullScreen open={view.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>

          <Button variant="outlined" onClick={()=>{
            view.onFalse()
             setOpenNotes(false)
            setRowData(null)
            setNoteData(null)
          }}>
            Close
          </Button>
        </DialogActions>

        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          {Render(noteData?.R_TYPE, rowData, imgSrc, qrImage)}
        </Box>
      </Box>
    </Dialog>
  );

  const [isEdit, setIsEdit] = useState(false);

  useEffect(()=>{
    if(rowData && !isEdit){
      view.onTrue();
    }
    if(rowData && isEdit){
      const newData = {
        ...rowData,
        R_TYPE: noteData?.R_TYPE,
        R_ID:noteData?.R_ID
      }
      updateRow(newData)
    }
  },[rowData, noteData, isEdit])


   // useEffect(() => {
  //   if (imgSrc || openNotes) {
  //     view.onTrue()
  //   }
  // }, [imgSrc, openNotes])

  useEffect(()=>{
    if(clearData){
      setNoteData(null)
      setIsEdit(false)
      setClearData(false)
      setRowData(null)
    }
  },[clearData])

  const handleViewUpdate = async( row:any) => {
    setNoteData(row)
    setIsEdit(true)
 

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

          setTargetQuery(1);

          // setSoapData(QueryNoteSoap);
          setRowData(QueryNoteSoap);
          // console.log('asdadasdadsadasdasdasd', soapData);
        }
      });
      // setRowData(soapData);
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

          // setTxtData(QueryNoteTxt);
      setTargetQuery(4);

      setRowData(QueryNoteTxt);

        }
      });
      // console.log(())
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
          setTargetQuery(5);

          setRowData(QueryNotesLab);

          // setLabData(QueryNotesLab);
        }
      });
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
          setTargetQuery(8);

          // setMedClearData(QueryNotesMedCler);
      setRowData(QueryNotesMedCler);

        }
      });
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
          setTargetQuery(9);

          setRowData(QueryNotesMedCert);

          // setMedCertData(QueryNotesMedCert);
        }
      });

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
          setTargetQuery(10);

          setRowData(QueryNotesAbstract);

          // setAbstData(QueryNotesAbstract);
        }
      });
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
          setTargetQuery(11);

          setRowData(QueryNotesPedCertObj);

          // setVaccData(QueryNotesPedCertObj);
        }
      });
    }
 
    // const newData = {
    //   ...data,
    //   R_TYPE: row?.R_TYPE
    
    // }
    

  
  }

  const finalLoading = user?.role !== 'patient' ? loading : patientLoading


  const [targetPdf, setTargetPdf] = useState(null);
  const [targetRow, setTargetRow] = useState(null);

  // console.log(targetPdf,' data galing sa pdf')
  // console.log(targetRow,' data galing sa row')
  
  useEffect(()=>{
    if(targetPdf || targetRow){
      const newData = {
        ...targetPdf,
        R_TYPE: targetRow?.R_TYPE
      }
     updateRow(newData)
    }
    
  },[targetPdf, targetRow])

  // delete mutation functions
  const [deleteNotesVacc] = useMutation(DeleteNotesVacc);
  const [deleteNotesText] = useMutation(DeleteNotesText);
  const [deleteSoap] = useMutation(DeleteNotesSoap);
  const [deleteAbstract] = useMutation(DeleteNotesAbs);
  const [deleteClearance] = useMutation(DeleteNotesCler);
  const [deleteCertificate] = useMutation(DeleteNotesCert);
  const [deleteLabRequest] = useMutation(DeleteNotesLabReq);
  
  

  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  // pamalit sa row data kasi nag tatama sila nung update tsaka view
  const [deleteRowData, setDeleteRowData] = useState(null)

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const deleteData = useCallback(async () => {
  
  }, [isDeleted, deleteRowData, targetQuery, deleteRow]);
  
  useEffect(()=>{
    // console.log(isDeleted,'delete')
    // console.log(deleteRowData,'deleteRowData')
    // console.log(targetQuery,'targetQuery')
    // console.log(deleteRow,'deleteRow')

    if(isDeleted && deleteRowData && targetQuery && deleteRow){
     (async()=>{
      try {
       (()=>{
        return new Promise(async(resolve, reject)=>{
          switch (targetQuery) {
            case 1:
              
              await deleteSoap({
                variables: {
                  data: {
                    R_ID: Number(deleteRow?.R_ID),
                    soap_id: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              break;
            case 4:
              await deleteNotesText({
                variables: {
                  data: {
                    recordID: Number(deleteRow?.R_ID),
                    notesID: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              break;
            case 5:
              await deleteLabRequest({
                variables: {
                  data: {
                    recordID: Number(deleteRow?.R_ID),
                    notesID: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              
              break;
            case 8:
              await deleteClearance({
                variables: {
                  data: {
                    recordID: Number(deleteRow?.R_ID),
                    medical_ID: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              break;
            case 9:
              // await getMedCertNotes.refetch();
              await deleteCertificate({
                variables: {
                  data: {
                    R_ID: Number(deleteRow?.R_ID),
                    cert_id: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              break;
            case 10:
              await deleteAbstract({
                variables: {
                  data: {
                    recordId: Number(deleteRow?.R_ID),
                    abs_id: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              });
              break;
            case 11:
              await deleteNotesVacc({
                variables: {
                  data: {
                    R_ID: Number(deleteRow?.R_ID),
                    pedia_id: Number(deleteRowData?.id),
                    dateCreated: deleteRow?.R_DATE
                  },
                },
              }).then((res)=>{
                resolve("success")
              }).catch((err)=>{
                reject("error")
              })
              
          }
        })
       })().then(()=>{
        enqueueSnackbar("Deleted successfully")
        refetch();
        setDeleteRow(null)
        setIsDeleted(false)
        setDeleteRowData(null)
       }).catch((err)=>{
        enqueueSnackbar(err,{variant:"error"})

       })

      } catch (error) {
        throw error; // Rethrow error to be handled by the caller
      }
     })()
     
      // deleteData().then(()=>{
      //   refetch();
      //   setDeleteRow(null)
      //   setIsDeleted(false)
      //   setDeleteRowData(null)
      // })
    }
  },[isDeleted, deleteRowData, targetQuery, deleteRow])
  console.log(targetQuery, "delete behhhh!")


  const handleDelete = useCallback((row)=>{
    
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

          setTargetQuery(1);

          // setSoapData(QueryNoteSoap);
          setDeleteRowData(QueryNoteSoap);
          // console.log('asdadasdadsadasdasdasd', soapData);
        }
      });
      // setRowData(soapData);
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

          // setTxtData(QueryNoteTxt);
      setTargetQuery(4);

      setDeleteRowData(QueryNoteTxt);

        }
      });
      // console.log(())
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
          setTargetQuery(5);

          setDeleteRowData(QueryNotesLab);

          // setLabData(QueryNotesLab);
        }
      });
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
          setTargetQuery(8);

          // setMedClearData(QueryNotesMedCler);
          setDeleteRowData(QueryNotesMedCler);

        }
      });
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
          setTargetQuery(9);

          setDeleteRowData(QueryNotesMedCert);

          // setMedCertData(QueryNotesMedCert);
        }
      });

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
          setTargetQuery(10);

          setDeleteRowData(QueryNotesAbstract);

          // setAbstData(QueryNotesAbstract);
        }
      });
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
          setTargetQuery(11);

          setDeleteRowData(QueryNotesPedCertObj);

          // setVaccData(QueryNotesPedCertObj);
        }
      });
    }
    setIsDeleted(true)
    setDeleteRow(row)
  },[]);



  return (
    <Card>
      <NoteTableToolbar
        filters={filters}
        onFilters={handleFilters}
        action={action}
        //
        hospitalOptions={clinicData}
      />

      {canReset && clinicData?.length !== 0 && (
        <NoteTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          //
          hospitalOptions={clinicData}
          onResetFilters={handleResetFilters}
          //
          results={totalData}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
            {upMd && (
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />
            )}

            <TableBody>
              {/* {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => {
                  if (loading) return <NoteTableRowSkeleton key={row.id} />;

                  return <NoteTableRow key={row.id} row={row} />;
                })} */}
              {finalLoading && [...Array(rowsPerPage)].map((_, i) => <NoteTableRowSkeleton key={i} />)}
              {!finalLoading &&
                tableData1?.map((row: any, index: number) => (
                  <NoteTableRow
                    key={index}
                    row={row}
                    ids={Ids}
                    onRefetch={refetch}
                    onViewRow={() => {
                      handleViewRow(row)
                    }}
                    onEditRow={()=>{
                      handleViewUpdate(row)
                    }}
                    onDeleteRow={()=>{
                      handleDelete(row)
                    }}
                    // onEditRow={(data:any)=>{
                    //   onEditFunc
                    //   // handleViewUpdate(data, row)
                    // }}
                  // onViewRow={() => handleViewRow(String(row.id))}
                  />
                ))}
              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
              />

              {user?.role !== 'patient' && notFound && (
                <TableNoData notFound={notFound && notFound} />
              )}
              {user?.role === 'patient' && <TableNoData notFound={notFoundPatient} />}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {renderView}

      <TablePaginationCustom
        count={totalData || 0}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: INoteItem[];
  comparator: (a: any, b: any) => number;
  filters: INoteTableFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];

  return inputData;
}

function Render(data: string, row: any, img: any, qrImage:any) {

  data = String(data)
  console.log(img,'IMAGE')
  console.log(qrImage,'qrImageqrImage')
  
  return (
    <>
      {data === '1' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFSoap qrImage={qrImage} item={row} />
        </PDFViewer>
      )}

      {data === '4' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFText  qrImage={qrImage} imgSrc={img} item={row} />
        </PDFViewer>
      )}

      {data === '5' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFLaboratory qrImage={qrImage} item={row} />
        </PDFViewer>
      )}

      {data === '8' && (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotePDFClearance  qrImage={qrImage} item={row} />
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

