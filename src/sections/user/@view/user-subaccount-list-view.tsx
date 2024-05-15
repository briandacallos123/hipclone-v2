'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// _mock
import { _userSubaccount } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IUserSubaccountItem, IUserSubaccountTableFilters } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
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
import UserSubaccountDetailsView from './user-subaccount-details-view';
import UserSubaccountCreateView from './user-subaccount-create-view';
import UserSubaccountEditView from './user-subaccount-edit-view';
import SubaccountTableRow from '../subaccount/subaccount-table-row';
import SubaccountTableRowSkeleton from '../subaccount/subaccount-table-row-skeleton';
import SubaccountTableToolbar from '../subaccount/subaccount-table-toolbar';
import { useQuery } from '@apollo/client';
import { sub_account_doctor_data } from '@/libs/gqls/sub_accounts';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'status', label: 'Status', width: 100, align: 'center' },
  { id: 'action', label: 'Action', width: 100, align: 'center' },
];

const defaultFilters = {
  name: '',
  status: -1,
};

// ----------------------------------------------------------------------

export default function UserSubaccountListView() {
  const [isLoading, setLoading] = useState(false);
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = useSettingsContext();

  const table = useTable();
  const { page, rowsPerPage, order, orderBy } = table;

  const confirm = useBoolean();

  const openCreate = useBoolean();

  const openView = useBoolean();
  const openViewList = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);

  const openEdit = useBoolean();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdList, setSelectedIdList] = useState(null);
  // console.log(selectedId,'selectedIdselectedIdselectedIdselectedId')
  // console.log(selectedIdList,'selectedIdList')

  const [selectedEditId, setSelectedEditId] = useState(null);
  ////////////////////////////////////////////////////
  const [tableData, setTableData] = useState<any>([]);
  const [totalSubAccount, setTotalSubAccount] = useState<number>(0);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  ////////////////////////////////////////////////////
  // const ids = tableData.map((entry):any => entry?.subAccountInfo?.id);

  function getIdByIndex(index:any) {
    if (index >= 0 && index < tableData.length) {
      const selectedEntry = tableData[index];
      return selectedEntry?.subAccountInfo?.id;
    } else {
      return null; // Kung ang index ay hindi wasto
    }
  }
  
  // Piliin ang id gamit ang index 1 (second entry)
  const selectedId123 = getIdByIndex(1);
  
  // console.log(selectedId123,"selectedIdselectedIdselectedIdselectedIdselectedIdselectedId");
  // console.log(selectedEntry,'tableData?.subAccountInfo?.idtableData?.subAccountInfo?.id'); 


  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== -1;

  const [tableLoading, setTableLoading] = useState(true);
  const notFound = !tableLoading && !tableData?.length;
  // const getStatusLength = (status: boolean) =>
  //   tableData.filter((item) => item.status.toString() === status.toString()).length;

  const {
    data: subData,
    error,
    loading,
    refetch,
  }: any = useQuery(sub_account_doctor_data, {
    context: {
      requestTrackerId: 'sub_account_doctor_data[sub_account_doctor_all_data]',
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        status: Number(filters.status),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: order,
        searchKeyword: filters?.name,
      },
    },
  });

  useEffect(() => {
    if (subData) {
      // console.log(subData, 'subData');
      const { sub_account_doctor_data } = subData;
      setTableData(sub_account_doctor_data?.sub_account_doctor_all_data);
      setTotalSubAccount(sub_account_doctor_data?.total_records);
      setTotal(sub_account_doctor_data?.summary_total.total);
      setActive(sub_account_doctor_data?.summary_total.active);
      setInactive(sub_account_doctor_data?.summary_total.inactive);
      setTableLoading(false)
    }
  }, [subData]);

  ////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //     getData({
  //       variables: {
  //         data: {
  //           status: Number(filters.status),
  //           skip: page * rowsPerPage,
  //           take: rowsPerPage,
  //           orderBy,
  //           orderDir: order,
  //           searchKeyword: filters?.name,
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { sub_account_doctor_data } = data;
  //         setTableData(sub_account_doctor_data?.sub_account_doctor_all_data);
  //         setTotalSubAccount(sub_account_doctor_data?.total_records);
  //         setTotal(sub_account_doctor_data?.summary_total.total);
  //         setActive(sub_account_doctor_data?.summary_total.active);
  //         setInactive(sub_account_doctor_data?.summary_total.inactive)
  //       }
  //     });
  //   //}
  // }, [
  //   //data, ito ung nagpapadoble ng request
  //   filters.status,
  //   // getData,
  //   order,
  //   orderBy,
  //   page,
  //   rowsPerPage,
  //   filters?.name,
  // ]);
  ////////////////////////////////////////////////////////////////////////////

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: total || 0 },
    {
      value: 1,
      label: 'Active',
      color: 'success',
      count: active || 0,
    },
    {
      value: 0,
      label: 'Inactive',
      color: 'error',
      count: inactive || 0,
    },
  ] as const;

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

  const handleDeleteRow = useCallback(
    (id: string) => {
      // const deleteRow = tableData.filter((row: any) => row.id !== id);
      // setTableData(deleteRow);
      // table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [, /*dataInPage.length*/ table, tableData]
  );

  const handleDeleteRows = useCallback(
    () => {
      // const deleteRows = tableData.filter((row: any) => !table.selected.includes(row.id));
      // setTableData(deleteRows);
      // table.onUpdatePageDeleteRows({
      //   totalRows: tableData.length,
      //   totalRowsInPage: dataInPage.length,
      //   totalRowsFiltered: dataFiltered.length,
      // });
    },
    [
      /*dataFiltered.length, dataInPage.length, table, tableData*/
    ]
  );

  const handleEditRow = useCallback(
    (data: any) => {
      setSelectedEditId(data);
      openEdit.onTrue();
    },
    [openEdit]
  );

  const handleViewRow = useCallback(
    (data: any) => {
      setSelectedId(data);
      setSelectedIdList(data?.subAccountInfo?.id)
      openView.onTrue();
    },
    [openView]
  );

  // console.log(setSelectedId,"handleViewRowhandleViewRowhandleViewRow")


  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

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
          <Typography variant="h5">Manage Sub-account</Typography>

          <LoadingButton
            onClick={openCreate.onTrue}
            variant="contained"
            loading={isLoading}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Sub-account
          </LoadingButton>
        </Stack>

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

          <SubaccountTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     tableData?.map((row: any) => row.id)
              //   )
              // }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
                {upMd && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length}
                    numSelected={table.selected.length}
                    // onSort={table.onSort}
                    // onSelectAllRows={(checked) =>
                    //   table.onSelectAllRows(
                    //     checked,
                    //     tableData?.map((row: any) => row.id)
                    //   )
                    // }
                  />
                )}

                <TableBody>
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <SubaccountTableRowSkeleton key={i} />)}
                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <SubaccountTableRow
                        key={index}
                        row={row}
                        // selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row)}
                        onEditRow={() => handleEditRow(row)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        isLoading={isLoading} 
                        setLoading={setLoading}
                      />
                    ))}

                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row:any) => {
                      if (loading) return <SubaccountTableRowSkeleton key={row.id} />;

                      return (
                        <SubaccountTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          // onEditRow={() => handleEditRow(row.id)}
                          // onDeleteRow={() => handleDeleteRow(row.id)}
                        />
                      );
                    })} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalSubAccount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalSubAccount}
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

      <UserSubaccountCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        refetch={refetch}
        isLoading={isLoading} 
        setLoading={setLoading}
      />

      <UserSubaccountEditView
        open={openEdit.value}
        refetch={refetch}
        onClose={() => {
          setSelectedEditId(null);
          openEdit.onFalse();
        }}
        id={selectedEditId}
        isLoading={isLoading} 
        setLoading={setLoading}
      />

      <UserSubaccountDetailsView open={openView.value} onClose={openView.onFalse} id={selectedId} idlist={selectedIdList}/>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserSubaccountItem[];
  comparator: (a: any, b: any) => number;
  filters: IUserSubaccountTableFilters;
}) {
  if (!inputData) return [];

  return inputData;
}
