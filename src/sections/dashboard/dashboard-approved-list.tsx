'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card, { CardProps } from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// _mock
import { _appointmentApprovedList } from 'src/_mock';
// types
import { IAppointmentApprovedItem } from 'src/types/appointment';
// components
import Scrollbar from 'src/components/scrollbar';
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
import { GET_APPT_TODAY_NEW } from '@/libs/gqls/drappts';
import { useQuery } from '@apollo/client';
import DashboardApprovedTableRow from './dashboard-approved-table-row';
import DashboardApprovedTableRowSkeleton from './dashboard-approved-table-row-skeleton';
import DashboardApprovedTableToolbar from './dashboard-approved-table-toolbar';
import DashboardApprovedTableFiltersResult from './dashboard-approved-table-filters-result';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Hospital/Clinic', align: 'left' },
  { id: 'count', label: 'Approved', align: 'right' },
];

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  isRefetch?: any;
  notToday?: any;
  setTotalApr?: any;
  table: any;
  allData?: any;
  tableData?: any;
  tableSummary?: any;
  filters: any;
  setFilters: any;
  defaultFilters: any;
  loading?: any;
}
// const defaultFilters = {
//   name: '',
// };

export default function DashboardApprovedList({
  isRefetch,
  notToday,
  title,
  subheader,
  setTotalApr,

  table,
  allData,
  tableData,
  tableSummary,
  filters,
  setFilters,
  defaultFilters,
  loading,
}: Props) {
  const router = useRouter();

  // const table = useTable();
  // const { page, rowsPerPage, order, orderBy } = table;
  const { user } = useAuthContext();
  console.log(user, 'user');
  // const [tableData, setTable] = useState(_appointmentApprovedList);
  // const [tableData1, setTable1] = useState<any>([]);
  // const [filters, setFilters] = useState(defaultFilters);
  const [totalData, setTotalData] = useState(0);
  // const dataFiltered = applyFilter({
  //   inputData: tableData1,
  //   comparator: getComparator(table.order, table.orderBy),
  // });

  const denseHeight = table.dense ? 56 : 76;
  const canReset = !!filters.name;
  // const userType = user?.role;

  const handleViewRow = useCallback(
    (row: any) => {
      router.push(paths.dashboard.queue(row?.clinicInfo?.uuid));
    },
    [router]
  );

  const [isLoading, setLoading] = useState(true);

  // const { data, loading, refetch }: any = useQuery(GET_APPT_TODAY_NEW, {
  //   context: {
  //     requestTrackerId: 'getTodayAPR[Apt-Dash-TodaysAPR]',
  //   },
  //   fetchPolicy: 'cache-first',
  //   variables: {
  //     data: {
  //       userType: String(userType),
  //       skip: page * rowsPerPage,
  //       take: rowsPerPage,
  //       searchKeywordAPR: filters?.name,
  //     },
  //   },
  // });

  const notFound = (!tableData?.length && canReset) || !tableData?.length;
  // const notFound = !totalData && !loading;

  // useEffect(() => {
  //   if (data) {
  //     const { todaysAPRNew } = data;
  //     // setTable(todaysAPR);
  //     setTable1(todaysAPRNew?.appointData);
  //     setTotalData(todaysAPRNew?.totalAPR);
  //     setLoading(false);
  //     setTotalApr(todaysAPRNew?.totalAPR);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (isRefetch) {
  //     refetch().then((res) => {
  //       const { todaysAPRNew } = data;
  //       // setTable(todaysAPR);
  //       setTable1(todaysAPRNew?.appointData);
  //       setTotalData(todaysAPRNew?.totalAPR);
  //       notToday();
  //     });
  //   }
  // }, [isRefetch]);

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         searchKeywordAPR: filters?.name,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { todaysAPRNew } = data;
  //       // setTable(todaysAPR);
  //       setTable1(todaysAPRNew?.appointData);
  //       setTotalData(todaysAPRNew?.totalAPR);
  //     }
  //   });
  // }, [filters?.name, page, rowsPerPage]);

  // // console.log('dadsdsadasdsad', tableData1);
  const handleFilters = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFilters((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <DashboardApprovedTableToolbar filters={filters} onFilters={handleFilters} />
      {canReset && (
        <DashboardApprovedTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={tableData.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
      <TableContainer sx={{ pt: 0, position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="medium">
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {/* {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => {
                  if (loading) return <DashboardApprovedTableRowSkeleton key={row.id} />;

                  return (
                    <DashboardApprovedTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  );
                })} */}
              {loading &&
                [...Array(table.rowsPerPage)].map((_, i) => (
                  <DashboardApprovedTableRowSkeleton key={i} />
                ))}
              {!loading &&
                tableData?.map((row: any, index: number) => (
                  <DashboardApprovedTableRow
                    key={index}
                    row={row}
                    onViewRow={() => handleViewRow(row)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
              />

              <TableNoData notFound={notFound && !loading} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={tableSummary}
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
}: {
  inputData: IAppointmentApprovedItem[];
  comparator: (a: any, b: any) => number;
}) {
  if (!inputData) return [];
  // const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
