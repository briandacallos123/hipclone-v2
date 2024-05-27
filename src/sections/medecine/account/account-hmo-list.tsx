'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// types
import { IUserProfileHmo } from 'src/types/user';
// _mock
import { _userProfileHmo } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
import AccountHmoTableRow from './account-hmo-table-row';
import AccountHmoCreate from './account-hmo-create';
import AccountHmoEdit from './account-hmo-edit';
import AccountHmoTableRowSkeleton from './account-hmo-table-row-skeleton';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_HMO } from '@/libs/gqls/hmo';
// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'name', label: 'Name' }, { id: 'mid', label: 'HMO ID' }, { id: '' }];

// ----------------------------------------------------------------------

export default function AccountHmoList() {
  const table = useTable();

  const confirm = useBoolean();

  const { page, rowsPerPage, order, orderBy } = table;

  const openCreate = useBoolean();

  const openEdit = useBoolean();

  const [editId, setEditId] = useState<string>('');

  const [tableData, setTableData] = useState([]);
  const [hmoList, setHmoList] = useState([]);

  const [summary, setSummary] = useState<any>(null);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  // });

  // const loading = false;

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 52 : 72;

  const [getData, { data, error, loading, refetch }]: any = useLazyQuery(GET_ALL_HMO, {
    context: {
      requestTrackerId: 'emr_data_field[emr_data_field]',
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [isLoading, setLoading] = useState(true);

  const notFound = !tableData?.length && !isLoading;
  const [count, setCount] = useState(0);

  // console.log(hmoList, 'yawa@@');
  useEffect(() => {
    console.log('USEEFFECTCALLED!');
    setLoading(true);
    getData({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy,
          orderDir: order,
          // status: Number(filters.status),
          // searchKeyWord: filters?.name,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      // console.log(data, 'data');
      setTableData((prev) => {
        console.log('DATA@@@@@@@@@?: ', data?.Hmo?.hmo);
        return data?.Hmo?.hmo;
      });
      setHmoList(data?.Hmo?.HmoList);

      setSummary(data?.Hmo?.totalRecords);
      setLoading(false);
      // setSummary(data?.QueryAllEMR?.summary);
    });
  }, [count, order, orderBy, page, rowsPerPage]);

  const refetchCustom = () => {
    setLoading(true);
    getData({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy,
          orderDir: order,
          // status: Number(filters.status),
          // searchKeyWord: filters?.name,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      // console.log(data, 'data');
      setTableData((prev) => {
        console.log('DATA@@@@@@@@@?: ', data?.Hmo?.hmo);
        return data?.Hmo?.hmo;
      });
      setHmoList(data?.Hmo?.HmoList);

      setSummary(data?.Hmo?.totalRecords);
      setLoading(false);
      // setSummary(data?.QueryAllEMR?.summary);
    });
  };

  useEffect(() => {
    console.log('tableDATA@@@@@@@@@@@@', tableData);
  }, [tableData]);
  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    // table.onUpdatePageDeleteRows({
    //   totalRows: tableData.length,
    //   totalRowsInPage: dataInPage.length,
    //   totalRowsFiltered: dataFiltered.length,
    // });
  }, [table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      setEditId(id);
      openEdit.onTrue();
    },
    [openEdit]
  );

  return (
    <>
      <Box>
        <Stack alignItems="flex-end" sx={{ mb: 3 }}>
          <Button
            onClick={openCreate.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New HMO
          </Button>
        </Stack>

        <Card>
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
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
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
                      tableData.map((row) => row?.id)
                    )
                  }
                />

                <TableBody>
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <AccountHmoTableRowSkeleton key={i} />)}

                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <AccountHmoTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => {
                      if (loading) return <AccountHmoTableRowSkeleton key={row.id} />;

                      return (
                        <AccountHmoTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
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
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Box>

      <AccountHmoCreate
        d={tableData}
        // hmoList={hmoList}
        open={openCreate.value}
        onClose={openCreate.onFalse}
        hmoList={hmoList}
        // refetch={async () => {
        //   const result = await refetch();
        //   // setTableData(result?.data?.)
        //   // console.log(result, 'result!!');
        //   setTableData(result?.data?.Hmo?.hmo);
        //   setSummary(result?.data?.Hmo?.totalRecords);
        // }}
        refetch={() => {
          refetchCustom();
          // setCount((prev) => {
          //   console.log(prev, 'PREV@@@');
          //   return (prev += 1);
          // });
        }}
      />

      <AccountHmoEdit open={openEdit.value} onClose={openEdit.onFalse} id={editId} />

      <ConfirmDialog
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
      />
    </>
  );
}

// ----------------------------------------------------------------------

{
  /* function applyFilter({
  inputData,
  comparator,
}: {
  inputData: IUserProfileHmo[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
} */
}
