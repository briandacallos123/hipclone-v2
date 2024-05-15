'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _hmoList, HMO_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// types
import { IHmoItem, IHmoTableFilters, IHmoTableFilterValue } from 'src/types/hmo';
// components
import { useResponsive } from 'src/hooks/use-responsive';
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
// ?
import { useLazyQuery, useQuery } from '@apollo/client';
import { Get_All_Hmo_Claims } from '@/libs/gqls/hmoClaims';
import { get_hmo_list } from '@/libs/gqls/hmo_list';

import { YMD } from 'src/utils/format-time';
import HmoAnalytic from '../hmo-analytic';
import HmoTableRow from '../hmo-table-row';
import HmoTableToolbar from '../hmo-table-toolbar';
import HmoTableFiltersResult from '../hmo-table-filters-result';
import HmoTableRowSkeleton from '../hmo-table-row-skeleton';
import HmoDetailsView from './hmo-details-view';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'member_name', label: 'Member ID/Name' },
  { id: 'hmo', label: 'HMO' },
  { id: 'date_appt', label: 'Schedule' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'export_stat', label: 'For Export', align: 'center' },
  { id: 'Action', label: 'Action', align: 'center' },
];

const defaultFilters = {
  name: '',
  status: '-1',
  hmo: [],
  start_date: null,
  end_date: null,
};

// ----------------------------------------------------------------------

export default function HmoListView() {
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = useSettingsContext();

  const table = useTable();
  const { page, rowsPerPage, order, orderBy } = table;

  const openView = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);

  const [viewId, setViewId] = useState(null);

  const [tableData] = useState(_hmoList);

  const [tableData1, setTableData1] = useState<any>([]);
  const [totalHMO, setTotalHMO] = useState<number>(0);

  /// /////////////////////////////////////////////////
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [done, setDone] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  const [cheque, setCheque] = useState(0);
  const [deposit, setDeposit] = useState(0);

  /// /////////////////////////////////////////////////
  const [lastFilterString, setLastFilterString] = useState<string>('');
  const [checkSearchHistory, setSearchHistory] = useState<Boolean>(true);

  const [isLoading, setIsLoading] = useState(true);
  ////////////////////////////////////////////////////////////////////////////
  const {
    data: data2,
    error,
    loading,
    refetch,
  }: any = useQuery(Get_All_Hmo_Claims, {
    context: {
      requestTrackerId: 'Get_All_Hmo_Claims[hmo_claims]',
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        claim_status: filters.status,
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: order,
        searchKeyword: filters?.name,
        start_date: YMD(filters?.start_date) || null,
        end_date: YMD(filters?.end_date) || null,
        hmo: filters?.hmo.map((v: any) => Number(v)),
        // end_date: filters?.end_date,
      },
    },
  });

  useEffect(() => {
    if (data2) {
      const { Get_All_Hmo_Claims } = data2;
      setTableData1(Get_All_Hmo_Claims?.hmo_claims_data);
      setTotalHMO(Get_All_Hmo_Claims?.total_records);
      setTotal(Get_All_Hmo_Claims?.summary_total.total);
      setPending(Get_All_Hmo_Claims?.summary_total.pending);
      setApproved(Get_All_Hmo_Claims?.summary_total.approved);
      setDone(Get_All_Hmo_Claims?.summary_total.done);
      setCancelled(Get_All_Hmo_Claims?.summary_total.cancelled);
      setCheque(Get_All_Hmo_Claims?.payChequeCount);
      setDeposit(Get_All_Hmo_Claims?.payDepositCount);
      setIsLoading(false);
    }
  }, [data2]);
  ////////////////////////////////////////////////////////////////////////////

  // const [getData, { data, error, loading, refetch }]: any = useLazyQuery(Get_All_Hmo_Claims, {
  //   context: {
  //     requestTrackerId: 'Get_All_Hmo_Claims[hmo_claims]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  const [table_hmo_list, setHmoList] = useState<any>([]);
  const [hmo_list, { data: hmo_data }]: any = useLazyQuery(get_hmo_list);

  useEffect(() => {
    hmo_list().then(async (result: any) => {
      const { data } = result;
      const { hmo_list } = data;
      setHmoList(hmo_list);
    });
  }, [hmo_data]);

  // console.log(table_hmo_list, "hmo lissssst");

  /// /////////////////////////////////////////////////////////////////////////
  /*  useEffect(() => {
    //if (checkSearchHistory) {
      getData({
        variables: {
          data: {
            claim_status: Number(filters.status),
            skip: page * rowsPerPage,
            take: rowsPerPage,
            orderBy,
            orderDir: order,
            searchKeyword: filters?.name,
            start_date: filters?.start_date,
            end_date: filters?.end_date,
            hmo: filters?.hmo.map((v: any) => Number(v)),
            // end_date: filters?.end_date,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { Get_All_Hmo_Claims } = data;
          setTableData1(Get_All_Hmo_Claims?.hmo_claims_data);
          setTotalHMO(Get_All_Hmo_Claims?.total_records);
          setTotal(Get_All_Hmo_Claims?.summary_total.total);
          setPending(Get_All_Hmo_Claims?.summary_total.pending);
          setApproved(Get_All_Hmo_Claims?.summary_total.approved);
          setDone(Get_All_Hmo_Claims?.summary_total.done);
          setCancelled(Get_All_Hmo_Claims?.summary_total.cancelled);
        }
      });
   // }
  }, [
    data,
    filters.status,
    getData,
    order,
    orderBy,
    page,
    rowsPerPage,
    filters?.name,
    filters?.start_date,
    filters?.end_date,
    filters?.hmo,
    checkSearchHistory,
  ]); */
  /// /////////////////////////////////////////////////////////////////////////

  /// /////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   /* const checkFilteredHistory: any = (str: string, total: any) => {
  //     if (total === 0) {
  //       return lastFilterString.length >= str.length;
  //     }
  //     return !!total;
  //   };

  //   const fetch: any = checkFilteredHistory(filters?.name, total);
  //   setSearchHistory(Boolean(fetch)); */

  //   // if (total !== 0) {
  //   getData({
  //     variables: {
  //       data: {
  //         claim_status: filters.status,
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         orderBy,
  //         orderDir: order,
  //         searchKeyword: filters?.name,
  //         start_date: YMD(filters?.start_date) || null,
  //         end_date: YMD(filters?.end_date) || null,
  //         hmo: filters?.hmo.map((v: any) => Number(v)),
  //         // end_date: filters?.end_date,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { Get_All_Hmo_Claims } = data;
  //       setTableData1(Get_All_Hmo_Claims?.hmo_claims_data);
  //       setTotalHMO(Get_All_Hmo_Claims?.total_records);
  //       setTotal(Get_All_Hmo_Claims?.summary_total.total);
  //       setPending(Get_All_Hmo_Claims?.summary_total.pending);
  //       setApproved(Get_All_Hmo_Claims?.summary_total.approved);
  //       setDone(Get_All_Hmo_Claims?.summary_total.done);
  //       setCancelled(Get_All_Hmo_Claims?.summary_total.cancelled);
  //       setCheque(Get_All_Hmo_Claims?.payChequeCount);
  //       setDeposit(Get_All_Hmo_Claims?.payDepositCount);
  //     }
  //   });
  //   // }
  // }, [
  //   // data, ito ung nagpapadoble ng request
  //   filters.status,
  //   getData,
  //   order,
  //   orderBy,
  //   page,
  //   rowsPerPage,
  //   filters?.name,
  //   filters?.start_date,
  //   filters?.end_date,
  //   filters?.hmo,
  // ]);
  /// /////////////////////////////////////////////////////////////////////////
  // console.log('wew', Get_All_Hmo_Claims?.total_records);

  // console.log('data: ', summary_total);

  // const dateError = isDateError(filters?.start_date, filters?.end_date);
  /* 
  const dataFiltered = applyFilter({
    inputData: tableData1,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  }); */

  // const loading1 = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.hmo.length ||
    filters.status !== '-1' ||
    (!!filters.start_date && !!filters.end_date) ||
    !!filters.start_date ||
    !!filters.end_date;

  const notFound = !isLoading && !tableData1?.length;

  const getHmoLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getPercentByStatus = (status: string) => (getHmoLength(status) / tableData.length) * 100;

  const TABS = [
    { value: '-1', label: 'All', color: 'default', count: total || 0 },
    { value: 'cheque', label: 'Cheque', color: 'info', count: deposit || 0 },
    { value: 'Deposit', label: 'Deposit', color: 'warning', count: cheque || 0 },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IHmoTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (data: any) => {
      setViewId(data);
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
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          HMO Claims
        </Typography>

        {upMd && (
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
                <HmoAnalytic
                  title="Total"
                  total={total}
                  percent={100}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.text.primary}
                />

                {/* <HmoAnalytic
                title="Pending"
                total={pending}
                percent={(pending / total) * 100}
                icon="solar:clock-circle-bold-duotone"
                color={theme.palette.warning.main}
              /> */}

                {/* <HmoAnalytic
                title="Approved"
                total={approved}
                percent={(approved / total) * 100}
                icon="solar:check-circle-bold-duotone"
                color={theme.palette.info.main}
              /> */}

                {/* <HmoAnalytic
                title="Done"
                total={done}
                percent={(done / total) * 100}
                icon="solar:check-circle-bold-duotone"
                color={theme.palette.success.main}
              /> */}

                {/* <HmoAnalytic
                title="Cancelled"
                total={cancelled}
                percent={(cancelled / total) * 100}
                icon="solar:close-circle-bold-duotone"
                color={theme.palette.error.main}
              /> */}
              </Stack>
            </Scrollbar>
          </Card>
        )}

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
                      ((tab.value === '-1' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <HmoTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            hmoOptions={table_hmo_list.map((option: any) => option)}
          />

          {canReset && (
            <HmoTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={totalHMO}
              hmoOptions={table_hmo_list}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData1?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData1?.map((row: any) => row.id)
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
                    // rowCount={tableData1?.length}
                    // numSelected={table.selected.length}
                    onSort={table.onSort}
                    // onSelectAllRows={(checked) =>
                    //   table.onSelectAllRows(
                    //     checked,
                    //     tableData1?.map((row: any) => row.id)
                    //   )
                    // }
                  />
                )}

                <TableBody>
                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => {
                      if (loading) return <HmoTableRowSkeleton key={row.id} />;

                      return (
                        <HmoTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      );
                    })} */}
                  {/* {loading
                    ? [...Array(rowsPerPage)].map((_, i) => <HmoTableRowSkeleton key={i} />)
                    : tableData1?.map((row: any, index: number) => (
                        <HmoTableRow
                          key={index}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row)}
                        />
                      ))} */}

                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <HmoTableRowSkeleton key={i} />)}
                  {!loading &&
                    tableData1?.map((row: any, index: number) => (
                      <HmoTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalHMO)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalHMO}
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

      <HmoDetailsView
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
        refetch={refetch}
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
  inputData: IHmoItem[];
  comparator: (a: any, b: any) => number;
  filters: IHmoTableFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];

  return inputData;
}
