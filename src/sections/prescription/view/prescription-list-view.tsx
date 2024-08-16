'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _hospitals, _prescriptionList, HOSPITAL_OPTIONS } from 'src/_mock';
// prisma
import { PrescriptionsUser } from '@/libs/gqls/prescription';
// import { DoctorClinics } from '@/libs/gqls/drprofile';
import { useLazyQuery, useQuery } from '@apollo/client';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import {
  IPrescriptionItem,
  IPrescriptionTableFilters,
  IPrescriptionTableFilterValue,
} from 'src/types/prescription';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
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
import PrescriptionDetailsView from './prescription-details-view';
import PrescriptionTableRow from '../prescription-table-row';
import PrescriptionTableRowSkeleton from '../prescription-table-row-skeleton';
import PrescriptionTableToolbar from '../prescription-table-toolbar';
import PrescriptionTableFiltersResult from '../prescription-table-filters-result';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'prescriptionNumber', label: 'Prescription no.' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'date', label: 'Date' },
  { id: '' },
];

const TABLE_HEAD_PATIENT = [
  { id: 'prescriptionNumber', label: 'Prescription no.' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'qr', label: 'QR Code' },
  { id: 'date', label: 'Date' },
  { id: '' },
];


// const TABLE_HEAD_PATIENT = [
//   { id: 'prescriptionNumber', label: 'Prescription no.' },
//   { id: 'hospital', label: 'Hospital/Clinic' },
//   { id: 'qr', label: 'QR Code' },
//   { id: 'date', label: 'Date' },
//   { id: '' },
// ];

const defaultFilters = {
  name: null,
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function PrescriptionListView() {
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const table = useTable({ defaultOrderBy: 'date' });
  const { page, rowsPerPage, order, orderBy } = table;
  const openView = useBoolean();

  const [viewId, setViewId] = useState<any>([]);

  const [tableData, setTableData] = useState<any>([]);
  const [tableData1, setTableData1] = useState<any>([]);
  const [totalData, SetTotalData] = useState(0);
  const [clinic, setClinic] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // const loading = false;
  // console.log('tableData', tableData);
  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name || !!filters.hospital.length || !!filters.startDate || !!filters.endDate || (!!filters.startDate && !!filters.endDate);



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

  const handleViewRow = useCallback(
    (id: any) => {
      setViewId(id);
      openView.onTrue();
    },
    [openView]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  const [getPrecsciption, getPrecsciptionResult]: any = useLazyQuery(PrescriptionsUser, {
    context: {
      requestTrackerId: 'prescriptionss[QueryAllPrescriptionUserr]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getPrecsciption({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy,
          orderDir: order,
          searchKeyword: filters?.name || null,
          clinicID: filters?.hospital.length
              ? filters?.hospital.map((v: any) => Number(v))
              : null,
          // clinicIds: filters?.hospital.length ? filters?.hospital.map((v: any) => Number(v)) : null,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;

      if (data) {
        const { QueryAllPrescriptionUser } = data;
        setTableData(QueryAllPrescriptionUser?.Prescription_data);
        SetTotalData(QueryAllPrescriptionUser?.totalRecords);
        setClinic(QueryAllPrescriptionUser?.clinicList)
      }
    });
  }, [
    filters.endDate,
    filters?.hospital,
    filters?.name,
    filters.startDate,
    getPrecsciption,
    order,
    orderBy,
    page,
    rowsPerPage,
  ]);

  console.log(filters,'TRY MOTO_________________')

  const notFound = !tableData.length && !getPrecsciptionResult.loading;

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Prescriptions
        </Typography>

        <Card>
          <PrescriptionTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            hospitalOptions={clinic}
          />

          {canReset && (
            <PrescriptionTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              hospitalOptions={clinic}
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
                    headLabel={user?.role === "patient" ? TABLE_HEAD_PATIENT:TABLE_HEAD}
                    onSort={table.onSort}
                  />
                )}

                <TableBody>
                  {getPrecsciptionResult.loading &&
                    [...Array(rowsPerPage)].map((_, i) => <PrescriptionTableRowSkeleton key={i} />)}
                  {!getPrecsciptionResult.loading &&
                    tableData?.map((row: any) => (
                      <PrescriptionTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalData}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <PrescriptionDetailsView open={openView.value} onClose={openView.onFalse} id={viewId} />
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
  if (!inputData) return [];

  return inputData;
}
