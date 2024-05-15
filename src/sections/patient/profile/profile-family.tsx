'use client';

import isEqual from 'lodash/isEqual';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
//
import { _medicalProfile } from '@/_mock';
// utils
import { fDate } from 'src/utils/format-time';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
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
import { view_patient_family_history_data } from '@/libs/gqls/medicalProfile';
import PatientProfileCreateView from './view/profile-create-view';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContextData } from '../@view/patient-details-view';import { useParams } from 'src/routes/hook';

// ----------------------------------------------------------------------

type Props = CardProps & {
  data: any;
  clientside: any;
  loading1: any;
  // loading1: any;
};

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'createDate', label: 'Date Created' },
];

const defaultFilters = {
  name: '',
};

export default function PatientProfileFamily({ data, clientside, loading1: loading1 }: Props) {
  const table = useTable();
  const { id } = useParams();
  const upMd = useResponsive('up', 'md');
  const [isLoading, setLoading] = useState(false);
  const popover = usePopover();
  const openCreate = useBoolean();
  const openView = useBoolean();
  const { page, rowsPerPage } = table;
  const [tableData, setTableData] = useState<any>([]);
  const [tableData1, setTableData1] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const { allData, setAllData }: any = useContextData();

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name;

  const [tableLoading, setTableLoading] = useState(true);
  const notFound = !tableLoading && !tableData1?.length;
  const notFound12 = !isLoading && !tableData?.length;

  ////////////////////////////////////////////////////////////////////////////
  const {
    data: data2,
    error,
    loading,
    refetch,
  }: any = useQuery(view_patient_family_history_data, {
    context: {
      requestTrackerId: 'view_patient_family_history_data[view_family_history_input_request]',
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        uuid: String(id),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        searchKeyword: filters?.name,
      },
    },
  });

  useEffect(() => {
    if (data2) {
      const { view_patient_family_history_data } = data2;
      setTableData(view_patient_family_history_data?.family_history_data);
      setTableLoading(false);
      setTableData1(view_patient_family_history_data?.family_history_data_view);
      setTotalRecords(view_patient_family_history_data?.total_records);
      setAllData((prev: any) => {
        return {
          ...prev,
          family_history: view_patient_family_history_data?.family_history_data_view,
        };
      });
     
    }
  }, [data2]);
  ////////////////////////////////////////////////////////////////////////////

  const [mockData] = useState(_medicalProfile);

  const dataFiltered = applyFilter({
    inputData: mockData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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

  const renderDataOrSkeletons = () => {
    if (loading1) {
      return [...Array(5)].map((_, index) => <Skeleton key={index} variant="text" />);
    } else if (!loading1 && tableData1?.length > 0) {
      return tableData1.map((item: any) => (
        <Typography key={item.id} variant="body2">
          •&nbsp; {item?.family_history || '-'}
        </Typography>
      ));
    } else {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
          }}
        >
          <Typography variant="body2">No Family History available</Typography>
        </div>
      );
    }
  };

  const nodatatext = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <Typography variant="body2">No Family History available</Typography>
      </div>
    );
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Family History</Typography>}
          action={
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          }
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: 2 }}
        />

        <Stack sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          {tableLoading && [...Array(5)].map((_, i) => <Skeleton key={i} sx={{ mb: 1 }} />)}

          {!tableLoading &&
            tableData1?.map((item: any, index: number) => (
              <Typography key={item.id} variant="body2">
                •&nbsp; {item?.family_history || '-'}
              </Typography>
            ))}
          {notFound && nodatatext()}
        </Stack>
      </Card>

      <PatientProfileCreateView
        clientside={clientside}
        open={openCreate.value}
        onClose={openCreate.onFalse}
        category="Family History"
        refetch={refetch}
        isLoading2={isLoading}
        setLoading2={setLoading}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {isLoading ? (
          <LoadingButton loading={isLoading}>
            <Iconify icon="mingcute:add-line" />
            Add
          </LoadingButton>
        ) : (
          <MenuItem
            onClick={() => {
              openCreate.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="mingcute:add-line" />
            Add
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            openView.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <Dialog
        fullScreen={!upMd}
        fullWidth
        maxWidth={false}
        open={openView.value}
        // onClose={openView.onFalse}
        PaperProps={{
          sx: { maxWidth: 720 },
        }}
      >
        <DialogTitle>Family History Information</DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <ItemTableToolbar filters={filters} onFilters={handleFilters} />

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
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <ItemTableRowSkeleton key={i} />)}
                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <ItemTableRow key={index} row={row} />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalRecords)}
                  />

                  <TableNoData notFound={notFound12 && !loading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalRecords}
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
          <Button variant="outlined" onClick={openView.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

type ItemTableFilters = {
  name: string;
};

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: ItemTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

type ItemTableToolbarProps = {
  filters: any;
  onFilters: (name: string, value: string) => void;
};

function ItemTableToolbar({ filters, onFilters }: ItemTableToolbarProps) {
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
        placeholder="Search name..."
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

type ItemTableRowProps = {
  row: any;
};

function ItemTableRow({ row }: ItemTableRowProps) {
  const { name, date } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ typography: 'subtitle2' }}>{row?.family_history}</TableCell>

      <TableCell>{row?.dateCreated}</TableCell>
    </TableRow>
  );
}

function ItemTableRowSkeleton() {
  return (
    <TableRow hover>
      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>
    </TableRow>
  );
}
