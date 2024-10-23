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
import { Prescriptions } from '../../../../libs/gqls/prescription';
import { DR_CLINICS } from '../../../../libs/gqls/drprofile';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useParams } from 'src/routes/hook';

import { reset } from 'numeral';
import { C } from '@fullcalendar/core/internal-common';
import PrescriptionCreateFull from '@/sections/patient/prescription/prescription-create-full';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'prescriptionNumber', label: 'Prescription no.' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'date', label: 'Date' },

  { id: '' },
];

const defaultFilters = {
  name: '',
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export default function PatientPrescriptionListView({ slug }: Props) {
  const upMd = useResponsive('up', 'md');

  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

  const openCreate = useBoolean();

  const { page, rowsPerPage, order, orderBy } = table;

  // const openEdit = useBoolean();

  const [openEdit, setOpenEdit] = useState(null);

  const openView = useBoolean();

  const [editId, setEditId] = useState(null);

  const [viewData, setViewData] = useState(null);

  const [tableData, setTableData] = useState([]);

  const [summary, setSummary] = useState(0);

  const { id } = useParams();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

  // const [isRefetch, setIsRefetch] = useState(false);
  // const [getData, { data, error, loading }]: any = useLazyQuery(labreport_patient_data, {
  //   context: {
  //     requestTrackerId: 'labreport_patient_data[labreport_patient_data]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });
  const { loading: clinicLoading, data: clinicData } = useQuery(DR_CLINICS);

  // const [isSubmit, setIsSubmit] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const containsLetters = (value: any) => /[a-zA-Z]/.test(value);

  const [tableLoading, setTableLoading] = useState(true);

  const {
    data: prData,
    error,
    loading,
    refetch,
  }: any = useQuery(Prescriptions, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    fetchPolicy: 'cache-first',
    variables: {
      data: {
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy: orderBy,
        orderDir: order,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        uuid: id,
        // 2 = emr, 1 = not emr
        isEmr: containsLetters(id) ? 2 : 1,
        clinicID: (() => {
          const myArray: any = [];

          filters?.hospital?.map((i: any) => {
            clinicData?.doctorClinics?.map((c: any) => {
              if (i === c?.clinic_name) {
                myArray.push(Number(c.id));
              }
              return true;
            });
            return true;
          });

          return myArray;
        })(),

        searchKeyword: Number(filters?.name),
      },
    },
    // notifyOnNetworkStatusChange: true,
    // fetchPolicy: isAdded === true ? 'no-cache' : 'no-cache',
  });

  // const containsLetters = (value: any) => /[a-zA-Z]/.test(value);
  // useEffect(()=>{

  // },[id])
  useEffect(() => {
    if (prData) {
      const { QueryAllPrescription } = prData;
      setTableData(QueryAllPrescription?.Prescription_data);
      setSummary(QueryAllPrescription?.totalRecords);
      setTableLoading(false);
    }
  }, [prData]);

  // const queryData = () => {
  //   getData({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         orderBy: orderBy,
  //         orderDir: order,
  //         startDate: filters?.startDate ,
  //         endDate: filters?.endDate,
  //         uuid: id,
  //         // 2 = emr, 1 = not emr
  //         isEmr: containsLetters(id) ? 2 : 1,
  //         clinicID: (() => {
  //           const myArray: any = [];

  //           filters?.hospital?.map((i: any) => {
  //             clinicData?.doctorClinics?.map((c: any) => {
  //               if (i === c?.clinic_name) {
  //                 myArray.push(Number(c.id));
  //               }
  //               return true;
  //             });
  //             return true;
  //           });

  //           return myArray;
  //         })(),

  //         searchKeyword: Number(filters?.name),
  //       },
  //     },
  //   })
  //     .then(async (result: any) => {
  //       const { data } = result;
  //       setTableData(data?.QueryAllPrescription?.Prescription_data);
  //       setSummary(data?.QueryAllPrescription?.totalRecords);
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //     });
  // };

  const [randKey, setRandkey] = useState(null);
  const [tempData, setTempData]: any = useState(null);
  const [tempId, setTempId] = useState(uuidv4());
  // const [uuid, setUuid] = useState(uuidv4());
  const openCreateFull = useBoolean();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isFail, setIsFail] = useState(false);
  // remove client side data if server got an error
  const [windowObject, setWindowObject] = useState(null);

  useEffect(() => {
    // Set the window object when the component mounts
    setWindowObject(window);

    // Optionally, clean up or handle resizing, etc.
    return () => {
      setWindowObject(null); // Cleanup if needed
    };
  }, []); // 
  // console.log(tableData, 'yamateee@@@#@#@');
  const [removeSlice, setRemoveSlice] = useState(null);

  useEffect(() => {
    if (isFail) {
      // console.log('ERRORS@@@');
      const newData = tableData.filter((i: any) => {
        if (!containsLetters(i?.ID)) {
          return i;
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
    // console.log('data@@: ', data);
    // console.log('clinicData?.doctorClinics@@: ', clinicData?.doctorClinics);

    const tempClinicData = clinicData?.doctorClinics?.filter(
      (i) => Number(i?.id) === Number(data?.CLINIC?.id)
    );
    // console.log('CLINIC DATA: ', tempClinicData);

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

      // const holdSlice =

      setRemoveSlice(actualData[actualData.length - 1]);

      // console.log(holdSlice, 'slice@@');
      // console.log(actualData, 'actualData@@');
      return actualData.slice(0, rowsPerPage);
    });

    // const snackbarKey = enqueueSnackbar('Saving prescription...', {
    //   variant: 'info',
    //   key: 'savingPrescription',
    //   persist: true, // Do not auto-hide
    // });

    // setSnackKey(snackbarKey);

    setTempId(uuidv4());

    // after append to client, + 1 to the total records.
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
    const tempClinicData = clinicData?.doctorClinics?.filter(
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
    // setSnackKey(null);
  }

  // remove item if something went wrong.
  const removeAdded = () => {};

  useEffect(() => {
    if (tempData) {
      updateDataTable();
    }
  }, [tempData]); // Include uuid in the dependencies

  // useEffect(() => {
  //   queryData();
  // }, [
  //   filters.name,
  //   filters.startDate,
  //   filters.endDate,
  //   filters.hospital,

  //   order,
  //   orderBy,
  //   page,
  //   rowsPerPage,
  // ]);

  // useEffect(() => {
  //   if (isAdded) {
  //     (async () => {
  //       alert('wew');
  //       await refetch();
  //       setAdded(false);
  //     })();
  //   }
  // }, [page]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name || !!filters.hospital.length || (!!filters.startDate && !!filters.endDate) || !!filters.startDate ||
    !!filters.endDate;


  const notFound = !tableData?.length && !tableLoading;

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
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Box>
        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 3 }}>
          <Button
            onClick={openCreate.onTrue}
            variant="contained"
            disabled={loading}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Prescription
          </Button>
        </Stack> */}

        <Card>
          <PatientPrescriptionTableToolbar
            filters={filters}
            onFilters={handleFilters}
            action={
              upMd ? (
                <Button
                  onClick={openCreateFull.onTrue}
                  variant="contained"
                  disabled={loading}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ ml: 2, width: 180 }}
                >
                  New Prescription
                </Button>
              ) : (
                <IconButton onClick={openCreateFull.onTrue}>
                  <Iconify icon="mingcute:add-line" />
                </IconButton>
              )
            }
            //
            // hospitalOptions={HOSPITAL_OPTIONS.map((option) => option)}
            hospitalOptions={clinicData?.doctorClinics && clinicData?.doctorClinics}
          />

          {canReset && (
            <PatientPrescriptionTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
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
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => (
                      <PatientPrescriptionTableRowSkeleton key={i} />
                    ))}

                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <PatientPrescriptionTableRow
                        key={row?.id}
                        row={row}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
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

      <PrescriptionCreateFull
        clinicData={clinicData?.doctorClinics}
        open={openCreateFull.value}
        onClose={openCreateFull.onFalse}
        window={windowObject}
        refetch={refetch}

      />

      <PrescriptionCreateView
        clinicData={clinicData?.doctorClinics}
        open={openCreate.value}
        refetch={refetch}
        onClose={() => {
          openCreate.onFalse();
          setEditId(null);
        }}
        queryData={() => {
          console.log('yay');
        }}
        SubmitClient={SubmitClient}
        // setIsRefetch={(d: any) => {
        //   closeSnackbar(snackKey);
        //   setAdded(true);
        //   setTempData(d);
        // }}
        runCatch={() => {
          setIsFail(true);
        }}
        tempId={tempId && tempId}
      />
      {/*  */}
      <PrescriptionEditView
        queryData={() => {
          console.log('yay');
        }}
        refetch={refetch}
        open={openEdit}
        onClose={() => {
          setOpenEdit(null);
          setEditId(null);
        }}
        SubmitClient={SubmitClient}
        id={editId}
        clinicData={clinicData?.doctorClinics}
        onCloseView={() => {
          console.log('runnng');
        }}
        setIsRefetch={(d: any) => {
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
        queryData={() => {
          console.log('yay');
        }}
        tempId={tempId && tempId}
        refetch={refetch}
        open={openView.value}
        clinicData={clinicData}
        setIsRefetch={(d: any) => {
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
