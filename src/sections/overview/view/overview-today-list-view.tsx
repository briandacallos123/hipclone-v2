'use client';

import { useState, useCallback } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useRouter } from 'src/routes/hook';
// _mock
import { _appointmentList, HOSPITAL_OPTIONS } from 'src/_mock';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import {
  IAppointmentItem,
  IAppointmentTableFilters,
  IAppointmentTableFilterValue,
} from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { AppointmentDetailsView } from '../../appointment/view';
import OverviewListAnalytic from '../overview-list-analytic';
import OverviewListTableRow from '../overview-list-table-row';
import OverviewListTableRowSkeleton from '../overview-list-table-row-skeleton';
import OverviewListTableToolbar from '../overview-list-table-toolbar';
import OverviewListTableFiltersResult from '../overview-list-table-filters-result';
import { useQuery } from '@apollo/client';
import { GetAllTodaysClinic } from '../../../libs/gqls/todaysClinic';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'scheduleDate', label: 'Schedule' },
  { id: 'isPaid', label: 'Payment', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OverviewTodayListView() {
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable();

  const openView = useBoolean();

  const [viewId, setViewId] = useState(null);

  const [tableData] = useState(_appointmentList.filter((_) => _.status === 'approved'));

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

  const {
    data,
    loading: serverLoading,
    error,
    refetch,
  } = useQuery(GetAllTodaysClinic, {
    // fetchPolicy: 'no-cache',
    variables: {
      data: {
        skip: table.page * table.rowsPerPage,
        take: table.rowsPerPage,
        orderBy: table.orderBy,
        orderDir: table.order,
        status: Number(filters?.status),
        // status: (() => {
        //   const val = filters.status;
        //   let status: any;
        //   switch (val) {
        //     case 'Male':
        //       status = 1;
        //       break;
        //     case 'Female':
        //       status = 2;
        //       break;
        //     default:
        //       status = 0;
        //       break;
        //   }
        //   return status;
        // })(),
        searchKeyword: filters?.searchKeyword,
      },
    },
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // console.log('DATA@@@', data);
  const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || !!filters.hospital.length || filters.status !== -1;

  const notFound = !serverLoading && !data?.GetAllTodaysClinic?.TodaysClinicType?.length;

  const getAppointmentLength = (status: string) =>
    tableData.filter((item) => item.patient.gender === status).length;

  const getPercentByStatus = (status: string) =>
    (getAppointmentLength(status) / tableData.length) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: data?.GetAllTodaysClinic?.All || 0},
    { value: 1, label: 'Male', color: 'info', count: data?.GetAllTodaysClinic?.Male || 0},
    { value: 2, label: 'Female', color: 'error', count: data?.GetAllTodaysClinic?.Female || 0},
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IAppointmentTableFilterValue) => {
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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h5">{`Today's Clinic`}</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:arrow-left-outline" />}
            onClick={router.back}
          >
            Back
          </Button>
        </Stack>

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <OverviewListAnalytic
                title="Total"
                total={data?.GetAllTodaysClinic && data?.GetAllTodaysClinic?.All}
                percent={100}
                icon="solar:users-group-two-rounded-bold-duotone"
                color={theme.palette.text.primary}
              />

              <OverviewListAnalytic
                title="Male"
                total={data?.GetAllTodaysClinic && data?.GetAllTodaysClinic?.Male}
                percent={data?.GetAllTodaysClinic && data?.GetAllTodaysClinic?.Male}
                icon="solar:men-bold-duotone"
                color={theme.palette.info.main}
              />
              <OverviewListAnalytic
                title="Female"
                total={data?.GetAllTodaysClinic && data?.GetAllTodaysClinic?.Female}
                percent={data?.GetAllTodaysClinic && data?.GetAllTodaysClinic?.Female}
                icon="solar:women-bold-duotone"
                color={theme.palette.error.main}
              />
              {/* <OverviewListAnalytic
                title="Unspecified"
                total={getAppointmentLength('unspecified')}
                percent={getPercentByStatus('unspecified')}
                icon="solar:question-circle-bold-duotone"
                color={theme.palette.warning.main}
              /> */}
            </Stack>
          </Scrollbar>
        </Card>

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
                      ((tab.value === -1 || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OverviewListTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            hospitalOptions={HOSPITAL_OPTIONS.map((option) => option)}
          />

          {/* {canReset && (
            <OverviewListTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Approve">
                    <IconButton color="info">
                      <Iconify icon="solar:play-circle-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Cancel">
                    <IconButton color="error">
                      <Iconify icon="solar:close-circle-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Done">
                    <IconButton color="success">
                      <Iconify icon="solar:check-circle-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
                {upMd && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row: any) => row?.id)
                      )
                    }
                  />
                )}

                <TableBody>
                  {serverLoading &&
                    [...Array(table.rowsPerPage)].map((_, i) => (
                      <OverviewListTableRowSkeleton key={i} />
                    ))}
                  {!serverLoading &&
                    data?.GetAllTodaysClinic?.TodaysClinicType?.map((row: any, index: number) => (
                      <OverviewListTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: any) => {
                      if (loading) return <OverviewListTableRowSkeleton key={row.id} />;

                      return (
                        <OverviewListTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      );
                    })} */}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, data?.GetAllTodaysClinic.TotalRecords)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.GetAllTodaysClinic?.TotalRecords}
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

      {viewId && <AppointmentDetailsView
        refetch={refetch}
        open={openView.value}
        onClose={() => {
          openView.onFalse();
          setViewId(null);
        }}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        id={viewId}
      />}
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
  inputData: IAppointmentItem[];
  comparator: (a: any, b: any) => number;
  filters: IAppointmentTableFilters;
  dateError: boolean;
}) {
  const { name, status, hospital, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el: any, index: any) => [el, index] as const);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item: any) =>
        item.patient.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.patient.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item: any) => item.patient.gender === status);
  }

  if (hospital.length) {
    inputData = inputData.filter((item) => hospital.includes(item.hospital.name));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (item) =>
          fTimestamp(item.schedule) >= fTimestamp(startDate) &&
          fTimestamp(item.schedule) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
