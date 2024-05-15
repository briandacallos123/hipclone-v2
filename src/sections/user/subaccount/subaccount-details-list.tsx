'use client';

import { useState, useCallback } from 'react';
// @mui
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserSubaccountItem } from 'src/types/user';
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
import SubaccountCover from './subaccount-cover';
import SubaccountDetailsTableRow from './subaccount-details-table-row';
import SubaccountDetailsTableRowSkeleton from './subaccount-details-table-row-skeleton';
import SubaccountDetailsTableToolbar from './subaccount-details-table-toolbar';

// ----------------------------------------------------------------------

type IUserSubaccountLogItem = {
  id: any;
  fullName: string;
  avatarUrl: string;
  date: Date | number;
  type: string;
};

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
  { id: 'name', label: 'Activity' },
  { id: 'type', label: 'Type', align: 'center' },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

type Props = {
  // currentItem: IUserSubaccountItem;
  currentItem: any;
  searchKeyword: any;
  filters: any;
  table: any;
  totalrecords: any;
  loadings: any;
  tableLoading: any;
  onClose: VoidFunction;
};

export default function SubaccountDetailsList({
  currentItem,
  searchKeyword,
  filters,
  table,
  totalrecords,
  loadings,
  tableLoading,
  onClose,
}: Props) {
  // console.log(totalrecords,"yo")

  // const table = useTable();
  // const { rowsPerPage} = table;

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const loading = false;

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const notFound: any = !tableLoading && !currentItem?.subAccountInfo?.logActionInfo?.length;

  const handleDeleteRows = useCallback(() => {
    // const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    // setTableData(deleteRows);
    // table.onUpdatePageDeleteRows({
    //   totalRows: tableData.length,
    //   totalRowsInPage: dataInPage.length,
    //   totalRowsFiltered: dataFiltered.length,
    // });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  return (
    <>
      <DialogContent>
        <SubaccountCover currentItem={currentItem} />

        <SubaccountDetailsTableToolbar filters={filters} onFilters={searchKeyword} />

        <TableContainer sx={{ mt: 3, position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={totalrecords}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData?.map((row) => row)
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 500 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={totalrecords}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     tableData?.map((row) => row.id)
                //   )
                // }
              />

              <TableBody>
                {tableLoading &&
                  [...Array(table?.rowsPerPage)].map((_, i) => (
                    <SubaccountDetailsTableRowSkeleton key={i} />
                  ))}
                {!tableLoading &&
                  currentItem?.subAccountInfo?.logActionInfo?.map((row: any, index: number) => (
                    <SubaccountDetailsTableRow key={index} row={row} />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, totalrecords)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalrecords}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

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

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserSubaccountLogItem[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
