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
import { useLazyQuery, useQuery } from '@apollo/client';
import NoteTableRow from '../note-table-row';
import NoteTableToolbar from '../note-table-toolbar';
import NoteTableFiltersResult from '../note-table-filters-result';
import NoteTableRowSkeleton from '../note-table-row-skeleton';
import useNotesHooks from '../_notesHooks';

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
  // isLoading,
}: Props) {
  const upMd = useResponsive('up', 'md');
  const table = useTable({ defaultOrder: 'desc', defaultOrderBy: 'date' });
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { page, rowsPerPage, order, orderBy } = table;
  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setLoading] = useState(true);

  useEffect(()=>{
    if(tableData1?.length){
      setLoading(false)
    }
  },[tableData1])

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
    filters.name,
    filters?.startDate,
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
  ]);
  console.log('the payloads', tableData1);
  // const [tableData1, setTableData1] = useState<any>([]);
  // const [totalData, setTotalData] = useState(0);
  // const [Ids, setIds] = useState<any>([]);
  // console.log('uuid pat: ', id);
  // const [tableData, setTableData] = useState<any>(_hospitals);

  const dateError = isDateError(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData1,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // useEffect(() => {
  //   if (getDefaultFilters('clinic')) {
  //     let { clinic }: any = getDefaultFilters('clinic');
  //     setFilters({
  //       ...filters,
  //       hospital: [clinic?.id],
  //     });
  //   }
  // }, []);

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;
  const [isPatient, setIspatient] = useState<boolean>();

  const canReset =
    !!filters.name ||
    !!filters.hospital.length ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;
  // const notFound = (!tableData1?.length && canReset) || !tableData1?.length;

  const [isLoadingPatient, setIsLoadingPatient] = useState(true);

  useEffect(() => {
    if (tableData1) {
      setIsLoadingPatient(false);
    }
  }, [isLoadingPatient, tableData1]);

  const notFound = !isLoadingPatient && !tableData1.length;

  // console.log(tableData1?.length);
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const { data, loading, refetch }: any = useQuery(GET_RECORD_BY_PATIENT, {
  //   variables: {
  //     data: {
  //       clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //       skip: page * rowsPerPage,
  //       take: rowsPerPage,
  //       orderBy,
  //       orderDir: order,
  //       userType: String(user?.role),
  //       uuid: String(refIds),
  //       emrID: Number(id),
  //       startDate: filters?.startDate,
  //       endDate: filters?.endDate,
  //       searchKeyword: filters.name,
  //     },
  //   },
  //   context: {
  //     requestTrackerId: 'getRecords[gPATMedNote]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  const [getDataUser, { data: userData, loading: patLoad }]: any = useLazyQuery(
    GET_RECORD_BY_PATIENT_USER,
    {
      context: {
        requestTrackerId: 'getRecords[gPATMedNote]',
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const notFoundPatient = !isLoading && !tableData1.length;
  // const [getEMR, { data: EMRdata, loading: loadingEmr }]: any = useLazyQuery(EMR_MED_NOTE, {
  //   variables: {
  //     data: {
  //       clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //       skip: page * rowsPerPage,
  //       take: rowsPerPage,
  //       orderBy,
  //       orderDir: order,
  //       userType: String(user?.role),
  //       uuid: String(refIds),
  //       emrID: Number(id),
  //       startDate: filters?.startDate,
  //       endDate: filters?.endDate,
  //       searchKeyword: filters.name,
  //     },
  //   },
  //   context: {
  //     requestTrackerId: 'getRecords[gPATMedNoteEMR]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // useEffect(() => {
  //   if (user?.role === 'doctor' && data) {
  //     const { allRecordsbyPatient } = data;
  //     // setTable(todaysAPR);
  //     setTableData1(allRecordsbyPatient?.Records_data);
  //     setIds(allRecordsbyPatient?.RecordIds);
  //     setTotalData(allRecordsbyPatient?.total_records);
  //   }
  // }, [data, user?.role]);

  // patient
  // useEffect(() => {
  //   if (user?.role === 'patient') {
  //     getDataUser({
  //       variables: {
  //         data: {
  //           clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //           skip: page * rowsPerPage,
  //           take: rowsPerPage,
  //           orderBy,
  //           orderDir: order,
  //           startDate: filters?.startDate,
  //           endDate: filters?.endDate,
  //           searchKeyword: filters.name,
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { allRecordsbyPatientUser } = data;
  //         // setTable(todaysAPR);
  //         setTableData1(allRecordsbyPatientUser?.Records_data);
  //         setIds(allRecordsbyPatientUser?.RecordIds);
  //         setTotalData(allRecordsbyPatientUser?.total_records);
  //       }
  //     });
  //   }
  // }, [
  //   page,
  //   isPatient,
  //   rowsPerPage,
  //   filters.name,
  //   orderBy,
  //   order,
  //   filters?.hospital,
  //   filters?.endDate,
  //   filters?.startDate,
  //   refIds,
  //   id,
  //   user?.role,
  // ]);
  // emr

  // useEffect(() => {
  //   getEMR({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data && isEMR) {
  //       const { QueryEMR_Record } = data;
  //       // setTable(todaysAPR);
  //       setTableData1(QueryEMR_Record?.EMR_Record?.records);
  //       // setIds(allRecordsbyPatient?.RecordIds);
  //       setTotalData(QueryEMR_Record?.total);
  //     }
  //   });
  // }, [
  //   page,
  //   rowsPerPage,
  //   filters.name,
  //   orderBy,
  //   order,
  //   getData,
  //   filters?.hospital,
  //   filters.endDate,
  //   getEMR,
  //   isEMR,
  // ]);

  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);
  const [clinicData, setclinicData] = useState<any>([]);

  useEffect(() => {
    if (user?.role === 'doctor' && drClinicData) {
      const { doctorClinics } = drClinicData;
      setclinicData(doctorClinics);
    }
  }, [drClinicData, user?.role]);

  // import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
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
  // console.log('@@', clinicData);
  useEffect(() => {
    if (user?.role === 'patient' && userClinicData) {
      const { AllClinicUser } = userClinicData;
      setclinicData(AllClinicUser);
    }
  }, [user?.role, userClinicData]);

  useEffect(() => {
    const clinicItem = tableData1?.map((item: any) => Number(item?.CLINIC));
    setClinicPayload(clinicItem);
  }, []);
  // ========================

  // -paloads-

  return (
    <Card>
      <NoteTableToolbar
        filters={filters}
        onFilters={handleFilters}
        action={action}
        //
        hospitalOptions={clinicData}
      />

      {canReset && (
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
              {isLoading && [...Array(rowsPerPage)].map((_, i) => <NoteTableRowSkeleton key={i} />)}
              {!isLoading &&
                tableData1?.map((row: any, index: number) => (
                  <NoteTableRow
                    key={index}
                    row={row}
                    ids={Ids}
                    onRefetch={refetch}
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
