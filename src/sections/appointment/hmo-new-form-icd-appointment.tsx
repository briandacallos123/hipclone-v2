import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Skeleton from '@mui/material/Skeleton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RHFTextField } from 'src/components/hook-form';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useLazyQuery } from '@apollo/client';
import { get_all_icd_10 } from '@/libs/gqls/Icd10';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Code' },
  { id: 'description', label: 'Description' },
  // { id: 'reference', label: 'Reference' },
];

type ICDOptionItem = {
  code: string;
  description: string;
  reference: string;
};

const defaultFilters = {
  name: '',
};

const DIAGNOSIS_OPTIONS = [
  {
    code: 'A000',
    description: 'Cholera due to Vibrio cholerae 01, biovar cholerae',
    reference: 'Certain infectious and parasitic diseases',
  },
  {
    code: 'A001',
    description: 'Cholera due to Vibrio cholerae 01, biovar eltor',
    reference: 'Certain infectious and parasitic diseases',
  },
  {
    code: 'A009',
    description: 'Cholera, unspecified',
    reference: 'Certain infectious and parasitic diseases',
  },
];

// ----------------------------------------------------------------------

export default function HmoNewFormICD() {
  const { setValue, watch } = useFormContext();

  const values = watch();

  const open = useBoolean();

  const table = useTable();
  const { page, rowsPerPage, order, orderBy } = table;
  const [filters, setFilters] = useState(defaultFilters);

  const [tableData, setTableData] = useState<any>([]);
  const [totalHMO, setTotal] = useState<number>(0);
  const [total, setTotalSummary] = useState(0);

  // console.log(tableData,'wooowq')

  const [getData, { data, error, loading, refetch }]: any = useLazyQuery(get_all_icd_10, {
    context: {
      requestTrackerId: 'get_all_icd_10[icd_10_input_request]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getData({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy,
          orderDir: order,
          searchKeyword: filters?.name,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { get_all_icd_10 } = data;
        setTableData(get_all_icd_10?.icd10_data);
        setTotal(get_all_icd_10?.total_records);
        setTotalSummary(get_all_icd_10?.summary_total.total);
      }
    });
    //}
  }, [order, orderBy, page, rowsPerPage, filters?.name]);

  // const [tableData] = useState(DIAGNOSIS_OPTIONS);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!tableData?.length && canReset) || !tableData?.length;

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

  const handleSelect = (row: string) => {
    setValue('diagnosis', row);
  };

  return (
    <>
      <RHFTextField
        name="diagnosis"
        label="Diagnosis"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={open.onTrue} edge="end">
                <Iconify icon="solar:clipboard-list-bold" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Dialog
        fullWidth
        maxWidth={false}
        open={open.value}
        onClose={open.onFalse}
        PaperProps={{
          sx: { maxWidth: 840 },
        }}
      >
        <DialogTitle>
          <Typography sx={{ typography: 'subtitle1', '& > span': { typography: 'body1' } }}>
            ICD-10: <span>{values.diagnosis}</span>
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <OptionTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
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
                    .map((row) => (
                      <OptionTableRow
                        key={row.code}
                        row={row}
                        selected={isEqual(row.description, values.diagnosis)}
                        onSelectRow={() => handleSelect(row.description)}
                      />
                    ))} */}
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <OptionTableRowSkeleton key={i} />)}
                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <OptionTableRow
                        key={row.code}
                        row={row}
                        selected={isEqual(row.description, values.diagnosis)}
                        onSelectRow={() => handleSelect(row.description)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, total)}
                  />

                  <TableNoData notFound={notFound && !loading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </DialogContent>

        <DialogActions sx={{ pt: 1 }}>
          <Button variant="outlined" onClick={open.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

// export type ICDOptionTableFilters = {
//   name: string;
// };

// function applyFilter({
//   inputData,
//   comparator,
//   filters,
// }: {
//   inputData: ICDOptionItem[];
//   comparator: (a: any, b: any) => number;
//   filters: ICDOptionTableFilters;
// }) {
//   const { name } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(
//       (item) =>
//         item.code.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
//         item.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
//     );
//   }

//   return inputData;
// }

// ----------------------------------------------------------------------

type OptionTableToolbarProps = {
  filters: any;
  onFilters: (name: string, value: string) => void;
};

function OptionTableToolbar({ filters, onFilters }: OptionTableToolbarProps) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        pt: 0,
      }}
    >
      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder="Search code or description..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

type Props = {
  row: ICDOptionItem;
  selected: boolean;
  onSelectRow: VoidFunction;
};

function OptionTableRow({ row, selected, onSelectRow }: Props) {
  const { code, description, reference } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ typography: 'subtitle2' }}>{code}</TableCell>

      <TableCell>{description}</TableCell>
    </TableRow>
  );
}

function OptionTableRowSkeleton() {
  return (
    <TableRow hover>
      <TableCell padding="checkbox" />

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>
    </TableRow>
  );
}
