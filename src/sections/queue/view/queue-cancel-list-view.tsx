'use client';

import { useState, useCallback, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'src/routes/hook';

// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// _mock
import { _appointmentList } from 'src/_mock';
// hooks

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentItem } from 'src/types/appointment';
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
import Label from 'src/components/label';
//
// prisma
import { GET_QUEUES } from '@/libs/gqls/drappts';
import { useQuery } from '@apollo/client';

import { AppointmentDetailsView } from 'src/sections/appointment/view';
import QueueDoneCancelTableRow from '../queue-done-cancel-table-row';
import QueueListTableRowSkeleton from '../queue-list-table-row-skeleton';
import QueueTableToolbar from '../queue-table-toolbar';
import { useMyContext } from './queue-view';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Patient' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'type', label: 'Type' },
  { id: 'payment', label: 'Payment Status' },
  { id: '', label: 'Action' },
];

const defaultFilters = {
  name: '',
  status: -1,
};

// ----------------------------------------------------------------------
type Props = {
  setCancelTotal: any;
};
export default function QueueCancelListView({ setCancelTotal }: Props) {
  const upMd = useResponsive('up', 'md');
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'schedule' });
  const { page, rowsPerPage, order, orderBy } = table;
  const { id } = useParams();
  const openView = useBoolean();
  const { user } = useAuthContext();
  const [viewId, setViewId] = useState(null);

  const [tableData, setTableData] = useState<any>([]);
  const [totalData, setTotalData] = useState(0);
  const [telemed, setTelemed] = useState(0);
  const [Face2F, setFace2F] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const { triggerR, cRefetch, refetchTabs }: any = useMyContext();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name;

  const [isLoading, setIsLoading] = useState(true);

  const userType = user?.role;
  const {
    data: dataLock,
    loading,
    refetch,
  }: any = useQuery(GET_QUEUES, {
    context: {
      requestTrackerId: 'getQueuesCanc[Apt-Dash-queue]',
    },
    fetchPolicy: 'cache-first',
    variables: {
      data: {
        userType: String(userType),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        uuid: id,
        status: 2,
        searchKeyword: filters.name,
        orderBy,
        orderDir: order,
        type: filters?.status,
      },
    },
    fetchPolicy: 'no-cache',
  });

  const notFound = !isLoading && !tableData?.length;

  useEffect(() => {
    if (cRefetch !== '' && cRefetch === 'cancelled') {
      refetch().then((prev) => {
        triggerR('');
      });
    }
  }, [cRefetch]);

  useEffect(() => {
    if (dataLock) {
      const { QueueAll } = dataLock;
      // setTable(todaysAPR);
      setTableData(QueueAll?.queue_data);
      setTotalData(QueueAll?.total_records);
      setTelemed(QueueAll?.telemed);
      setFace2F(QueueAll?.face2face);
      setIsLoading(false);
    }
  }, [dataLock]);

  useEffect(() => {
    if (dataLock) setCancelTotal(totalData);
  }, [dataLock, setCancelTotal, totalData]);
  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         uuid: id,
  //         status: 2,
  //         searchKeyword: filters.name,
  //         orderBy,
  //         orderDir: order,
  //         type: filters?.status,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { QueueAll } = data;
  //       // setTable(todaysAPR);
  //       setTableData(QueueAll?.queue_data);
  //       setTotalData(QueueAll?.total_records);
  //       setTelemed(QueueAll?.telemed);
  //       setFace2F(QueueAll?.face2face);
  //     }
  //   });
  // }, [filters.name, page, rowsPerPage, order, orderBy, getData, id, filters?.status]);

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      setViewId(id);
      openView.onTrue();
    },
    [openView]
  );

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: totalData },
    {
      value: 1,
      label: 'Telemedicine',
      color: 'success',
      count: telemed,
    },
    {
      value: 2,
      label: 'Face-To-Face',
      color: 'info',
      count: Face2F,
    },
  ] as const;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  useEffect(()=>{
    if(!openView.value && viewId){
      setViewId(null)
    }
  },[openView])

  return (
    <>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === -1 || tab.value === Number(filters.status)) && 'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {(() => {
                    if (tab.value === -1) return totalData || 0;
                    if (tab.value === 1) return telemed || 0;
                    if (tab.value === 2) return Face2F || 0;

                    return 0;
                  })()}
                </Label>
              }
            />
          ))}
        </Tabs>
        <QueueTableToolbar filters={filters} onFilters={handleFilters} />

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
                    if (loading) return <QueueListTableRowSkeleton key={row.id} />;

                    return (
                      <QueueDoneCancelTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    );
                  })} */}
                {loading &&
                  [...Array(rowsPerPage)].map((_, i) => <QueueListTableRowSkeleton key={i} />)}
                {!loading &&
                  tableData?.map((row: any, index: number) => (
                    <QueueDoneCancelTableRow
                      key={index}
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

      {viewId &&   <AppointmentDetailsView
        refetch={refetch}
        open={openView.value}
        refetchToday={() => {
          refetchTabs()
        }}
        onClose={openView.onFalse}
        id={viewId}
        refetchTabs={refetchTabs}
      />}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IAppointmentItem[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
}) {
  if (!inputData) return [];

  return inputData;
}
