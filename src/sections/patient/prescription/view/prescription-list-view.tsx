'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fTimestamp } from 'src/utils/format-time';
import { useParams } from 'src/routes/hook';
// _mock
import { _hospitals, _prescriptionList, HOSPITAL_OPTIONS } from 'src/_mock';
// types
import {
  IPrescriptionItem,
  IPrescriptionTableFilters,
  IPrescriptionTableFilterValue,
} from 'src/types/prescription';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { isDateError } from 'src/components/custom-date-range-picker';
import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
//
import {
  PrescriptionDetailsView,
  PrescriptionCreateView,
  PrescriptionEditView,
} from 'src/sections/prescription/view';
import PatientPrescriptionTableRow from '../prescription-table-row';
import PatientPrescriptionTableRowSkeleton from '../prescription-table-row-skeleton';
import PatientPrescriptionTableToolbar from '../prescription-table-toolbar';
import PatientPrescriptionTableFiltersResult from '../prescription-table-filters-result';
import { PrescriptionDelete, Prescriptions } from '../../../../libs/gqls/prescription';
import { DoctorClinicsHistory, DR_CLINICS } from '../../../../libs/gqls/drprofile';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { reset } from 'numeral';
import { C } from '@fullcalendar/core/internal-common';
import { useAuthContext } from 'src/auth/hooks';
import { useContextData } from '../../@view/patient-details-view';
import { useSessionStorage } from '@/hooks/use-sessionStorage';
import PrescriptionCreateFull from '../prescription-create-full';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'prescriptionNumber', label: 'Prescription no.' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'code', label: 'Code' },
  { id: 'date', label: 'Date' },

  { id: '' },
];

const defaultFilters = {
  name: '',
  hospital: [],
  startDate: null,
  endDate: null,
  reset: false
};

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export default function PatientPrescriptionListView({ slug }: Props) {
  const upMd = useResponsive('up', 'md');
  const { id } = useParams();
  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });
  const { user, getDefaultFilters } = useAuthContext();
  const openCreate = useBoolean();
  const openCreateFull = useBoolean();

  const [windowObject, setWindowObject] = useState(null);

  useEffect(() => {
    // Set the window object when the component mounts
    setWindowObject(window);

    // Optionally, clean up or handle resizing, etc.
    return () => {
      setWindowObject(null); // Cleanup if needed
    };
  }, []); // 

  const { allData, setAllData }: any = useContextData();
  const [fetchAll, setFetchAll] = useState(true);

  const { page, rowsPerPage, order, orderBy } = table;

  // const openEdit = useBoolean();

  const [openEdit, setOpenEdit] = useState(null);

  const openView = useBoolean();

  const [editId, setEditId] = useState(null);

  const [viewData, setViewData] = useState(null);

  const [tableData, setTableData] = useState([]);

  const [summary, setSummary] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);


  // const { loading: clinicLoading, data: clinicData } = useQuery(DR_CLINICS);
  
   
  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DoctorClinicsHistory);


  const [clinicData, setclinicData] = useState<any>([]);


  useEffect(()=>{
    if(drClinicData){
      setclinicData(drClinicData?.DoctorClinicsHistory)
    }
  },[drClinicData])

  console.log(clinicData,'awitttttttttttt')



  const containsLetters = (value: any) => /[a-zA-Z]/.test(value);
  const [smartFilters, setSmartFilters]: any = useState(null);
  const { getItem } = useSessionStorage();

  const [isLoading, setIsLoading] = useState(true);

  const [getAllPrescs, prescResult] = useLazyQuery(Prescriptions, {
    context: {
        requestTrackerId: 'orders[QueryAllOrderUser]',
    },
    notifyOnNetworkStatusChange: true,
});
  
  useEffect(()=>{
    getAllPrescs({
      variables:{
        data:{
          skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy: orderBy,
        orderDir: order,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        uuid: id,
        isEmr: containsLetters(id) ? 2 : 1,
        // clinicID: filters?.hospital.map((v: any) => Number(v)) || filters?.hospital,
        clinicID: (() => {
          const myArray: any = [];



          filters?.hospital?.map((i: any) => {
            clinicData?.map((c: any) => {
              if (i === c?.clinic_name) {
                myArray.push(Number(c.id));
              }
              return true;
            });
            return true;
          });

          return myArray;
        })(),

        searchKeyword: Number(filters?.name) || null,
        }
      }
    }).then((res)=>{
      const {QueryAllPrescription} = res.data;

      setTableData(QueryAllPrescription?.Prescription_data);
      setSummary(QueryAllPrescription?.totalRecords);
      setAllData((prev: any) => {
        return { ...prev, prescription:QueryAllPrescription?.Prescription_data };
      });
      setIsLoading(false);
    })
  },[page, rowsPerPage,prescResult.data, orderBy, order, filters.startDate, filters.endDate,id])

  const refetch = ()=>prescResult.refetch()
 
  // const {
  //   data: prescriptionData,
  //   error,
  //   loading,
  //   refetch,
  // }: any = useQuery(Prescriptions, {
  //   context: {
  //     requestTrackerId: 'Prescription_data[Prescription_data]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  //   variables: {
  //     data: {
  //       skip: page * rowsPerPage,
  //       take: rowsPerPage,
  //       orderBy: orderBy,
  //       orderDir: order,
  //       startDate: filters?.startDate,
  //       endDate: filters?.endDate,
  //       uuid: id,
  //       isEmr: containsLetters(id) ? 2 : 1,
  //       // clinicID: filters?.hospital.map((v: any) => Number(v)) || filters?.hospital,
  //       clinicID: (() => {
  //         const myArray: any = [];



  //         filters?.hospital?.map((i: any) => {
  //           clinicData?.map((c: any) => {
  //             if (i === c?.clinic_name) {
  //               myArray.push(Number(c.id));
  //             }
  //             return true;
  //           });
  //           return true;
  //         });

  //         return myArray;
  //       })(),

  //       searchKeyword: Number(filters?.name) || null,
  //     },
  //   },
  // });

  // useEffect(() => {
  //   if (prescriptionData?.QueryAllPrescription?.Prescription_data) {
  //     const { data }: any = prescriptionData;
  //     setTableData(prescriptionData?.QueryAllPrescription?.Prescription_data);
  //     setSummary(prescriptionData?.QueryAllPrescription?.totalRecords);
  //     setAllData((prev: any) => {
  //       return { ...prev, prescription: prescriptionData?.QueryAllPrescription?.Prescription_data };
  //     });
  //     setIsLoading(false);
  //   }
  // }, [prescriptionData, filters.reset]);


  const queryData = () => {
    refetch()
      .then(async (result: any) => {
        const { data } = result;
        setTableData(data?.QueryAllPrescription?.Prescription_data);
        setSummary(data?.QueryAllPrescription?.totalRecords);
      })
      .catch((err: any) => {
        console.log(err);
      });

  };

  const [randKey, setRandkey] = useState(null);
  const [tempData, setTempData]: any = useState(null);
  const [tempId, setTempId]: any = useState(uuidv4());

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isFail, setIsFail] = useState(false);

  const [createMedFunc] = useMutation(PrescriptionDelete, {
    context: {
      requestTrackerId: 'Delete_presc[DELETE_PRESC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [removeSlice, setRemoveSlice] = useState(null);

  useEffect(() => {
    if (isFail) {
      const newData = tableData.filter((i: any) => {
        if (containsLetters(i?.ID)) {
          // return i;
          console.log('ITO YUN: ', i);
        }
      });
      // console.log(removeSlice, 'Promise');
      setTableData([...newData, removeSlice]);
      setIsFail(false);
      closeSnackbar(snackKey);
      setRemoveSlice(null);
      // alert('Error');
    }
  }, [tableData, isFail, removeSlice]);

  const SubmitClient = (data: any, caller: any) => {
    setOpenEdit(null);
    setEditId(null);

    const tempClinicData = clinicData?.filter(
      (i) => Number(i?.id) === Number(data?.CLINIC?.id)
    );

    setTableData((prev: any) => {
      const allIds: any = [];
      let actualData: any = [];

      const cData = {
        ID: tempId, // Use the stored UUID
        client: 1,
        DATE: '1671525697000',
        clinicInfo: tempClinicData[0],
      };

      prev?.forEach((i: any) => {
        if (!allIds.includes(i?.ID)) {
          allIds.push(i?.ID);
          actualData.push(i);
          if (!allIds.includes(cData?.ID)) {
            allIds.push(cData?.ID);
            actualData = [cData, ...actualData];
          }
        }
      });

      setRemoveSlice(actualData[actualData.length - 1]);

      return actualData.slice(0, rowsPerPage);
    });

    setTempId(uuidv4());
  };

  useEffect(() => {
    tableData?.forEach((i) => {
      if (i?.ID.length >= 7) {
        setSummary((prev) => {
          return (prev += 1);
        });
      }
    });
  }, [tableData]);

  function updateDataTable() {
    const tempClinicData = clinicData?.filter(
      (i) => Number(i?.id) === Number(tempData?.CLINIC)
    );

    const findSingle: any = tableData
      ?.map((i: any) => {
        if (i?.ID === tempData?.tempId) {
          return { ...tempData, client: 2, DATE: '1671525697000', clinicInfo: tempClinicData[0] };
        }
        return i;
      })
      .slice(0, rowsPerPage);

    setTableData(findSingle);

  }

  const removeAdded = () => { };

  useEffect(() => {
    if (tempData) {
      updateDataTable();
    }
  }, [tempData]); // Include uuid in the dependencies

  useEffect(() => {
    // if (prescriptionData) {
    // refetch()
    //   .then(async (result: any) => {
    //     const { data } = result;
    //     setTableData(data?.QueryAllPrescription?.Prescription_data);
    //     setSummary(data?.QueryAllPrescription?.totalRecords);
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
    // }
  }, [
    /* data, */ filters.name,
    filters.startDate,
    filters.endDate,
    filters.hospital,
    filters.reset,
    order,
    orderBy,
    page,
    rowsPerPage,
  ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // useEffect(() => {
  //   const data = getItem('defaultFilters');
  //   if (data?.clinic) {
  //     filters.hospital = [data?.clinic?.clinic_name]
  //   }
  // }, []);

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters?.name ||
    !!filters?.hospital?.length ||
    (!!filters?.startDate && !!filters?.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  const notFound = !isLoading && !tableData?.length;

  const handleFilters = useCallback(
    (name: string, value: IPrescriptionTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleEditRow = useCallback(
    (id: any) => {
      setEditId(id);
      // openEdit.onTrue();
      setOpenEdit(id);
    },
    [openEdit]
  );

  const handleViewRow = useCallback(
    (data: any) => {
      setViewData(data);
      openView.onTrue();
    },
    [openView]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({

      name: '',
      hospital: [],
      startDate: null,
      endDate: null,
      reset: false

    });
  }, []);

  const handleDeleteRow = (row: any) => {
    createMedFunc({
      variables: {
        data: {
          prescription_id: Number(row?.ID),
          dateCreated: row?.DATE
        }
      }
    }).then((res) => {
      refetch();
    })
  }

  return (
    <>
      <Box>
        <Card>
          <PatientPrescriptionTableToolbar
            filters={filters}
            onFilters={handleFilters}
            smartFilters={clinicData && smartFilters}
            action={
              upMd
                ? (() => {
                  if (user?.role === 'secretary' || user?.role === 'doctor') {
                    if (user?.permissions?.lab_result === 1 && user?.role === 'secretary') {
                      return <></>;
                    }
                    if (user?.role === 'doctor') {
                      return (
                        <Button
                          // onClick={openCreate.onTrue}
                          onClick={openCreateFull.onTrue}
                          variant="contained"
                          disabled={prescResult.loading}
                          startIcon={<Iconify icon="mingcute:add-line" />}
                          sx={{ ml: 2, width: 180 }}
                        >
                          New Prescription
                        </Button>
                      );
                    }
                  }
                })()
                : (() => {
                  if (user?.role === 'secretary' || user?.role === 'doctor') {
                    if (user?.permissions?.lab_result === 1 && user?.role === 'secretary') {
                      return (
                        <IconButton onClick={openCreate.onTrue}>
                          <Iconify icon="mingcute:add-line" />
                        </IconButton>
                      );
                    }
                    if (user?.role === 'doctor') {
                      return (
                        <IconButton onClick={openCreateFull.onTrue}>
                          <Iconify icon="mingcute:add-line" />
                        </IconButton>
                      );
                    }
                  }
                })()
            }
            //
            // hospitalOptions={HOSPITAL_OPTIONS.map((option) => option)}
            hospitalOptions={clinicData && clinicData}
          />

          {canReset && (
            <PatientPrescriptionTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={summary}
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
                  {prescResult.loading &&
                    [...Array(rowsPerPage)].map((_, i) => (
                      <PatientPrescriptionTableRowSkeleton key={i} />
                    ))}

                  {!prescResult.loading &&
                    tableData?.map((row: any, index: number) => (
                      <PatientPrescriptionTableRow
                        key={row?.id}
                        row={row}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />
                    ))}

                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => {
                      if (loading) return <PatientPrescriptionTableRowSkeleton key={row.id} />;

                      return (
                        <PatientPrescriptionTableRow
                          key={row.id}
                          row={row}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      );
                    })} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, summary)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={summary}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Box>
      {/* create */}
      <PrescriptionCreateView
        clinicData={clinicData}
        open={openCreate.value}
        onClose={() => {
          openCreate.onFalse();
          setEditId(null);
        }}
        queryData={queryData}
        SubmitClient={SubmitClient}

        refetch={refetch}
        runCatch={() => {
          setIsFail(true);
        }}
        tempId={tempId && tempId}
      />

{/* <PrescriptionNewEditForm
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
      /> */}

      <PrescriptionCreateFull
        clinicData={clinicData}
        open={openCreateFull.value}
        onClose={openCreateFull.onFalse}
        window={windowObject}
        refetch={refetch}

      />
      {/*  */}
      <PrescriptionEditView
        queryData={queryData}
        open={openEdit}
        refetch={refetch}
        onClose={() => {
          setOpenEdit(null);
          setEditId(null);
        }}
        SubmitClient={SubmitClient}
        id={editId}
        clinicData={clinicData}
        onCloseView={() => {
          console.log('runnng');
        }}
        setIsRefetch={(d) => {
          // setTempId(uuidv4());

          closeSnackbar(snackKey);

          setTempData(d);
        }}
        runCatch={() => {
          setIsFail(true);
        }}
        tempId={tempId && tempId}
      />

      <PrescriptionDetailsView
        SubmitClient={SubmitClient}
        runCatch={() => {
          setIsFail(true);
        }}
        queryData={queryData}
        refetch={refetch}
        tempId={tempId && tempId}
        open={openView.value}
        clinicData={clinicData}
        setIsRefetch={(d) => {
          // setTempId(uuidv4());

          closeSnackbar(snackKey);

          setTempData(d);
        }}
        onClose={openView.onFalse}
        id={viewData}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IPrescriptionItem[];
  comparator: (a: any, b: any) => number;
  filters: IPrescriptionTableFilters;
  dateError: boolean;
}) {
  const { name, hospital, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData?.filter(
  //     (item) => item?.prescriptionNumber?.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  // if (hospital?.length) {
  //   console.log(inputData, 'yawa321123');
  // inputData = inputData?.filter((item) =>
  //   hospital?.includes(_hospitals?.filter((_) => _.id === item.hospitalId)[0].name)
  // );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData?.filter(
        (item) =>
          fTimestamp(item.date) >= fTimestamp(startDate) &&
          fTimestamp(item.date) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
