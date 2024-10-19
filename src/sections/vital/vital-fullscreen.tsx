'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// utils
import { fDate, fDateTime } from 'src/utils/format-time';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Chart, { useChart } from 'src/components/chart';
import Scrollbar from '@/components/scrollbar';
import Iconify from 'src/components/iconify';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { MenuItem } from '@mui/material';
import { useBoolean } from '@/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useMutation } from '@apollo/client';
import { DeleteNotesVitalPatient } from '@/libs/gqls/notes/notesVitals';
import VitalFullScreenRow from './vital-fs-row';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
  { id: 'value', label: 'Value' },
  { id: '', label: 'Action' },
];

type Props = {
  title: string;
  open: boolean;
  onClose: VoidFunction;
  list: { value: string; date: string }[];
  refetch: any;
  chart: {
    categories: string[];
    data: {
      name: string;
      data: number[];
    }[];
    colors?: string[][];
    options?: ApexOptions;
  };
};
const NAV_WIDTH = 800;
export default function VitalFullscreen({ refetch, title, open, onClose, chart, list }: Props) {
  const [openMobile, setOpenMobile] = useState(true);
  const [collapseDesktop, setCollapseDesktop] = useState(false);
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');
  const handleToggleNav = () => {
    setCollapseDesktop(!collapseDesktop);
  };

  const [dataList, setDataList] = useState([]);
  const [tempData, setTempData] = useState(false);

  const isTemp = dataList.find((item) => Number(item.id) === 0);

  // console.log(tempData,'tempData');

  // useEffect(()=>{
  //   if(dataList.find((item)=>Number(item.id) === 0)){
  //     setTempData(true)
  //   }
  // },[dataList])

  useEffect(() => {
    if (list?.length !== 0) {
      setDataList(list);
    }
  }, [list]);

  const renderBtn = (
    <IconButton
      onClick={handleToggleNav}
      sx={{
        top: 12,
        right: 0,
        zIndex: 9,
        width: 32,
        height: 32,
        borderRight: 0,
        position: 'absolute',
        borderRadius: `12px 0 0 12px`,
        boxShadow: theme.customShadows.z8,
        bgcolor: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        '&:hover': {
          bgcolor: theme.palette.background.neutral,
        },
        ...(lgUp && {
          ...(!collapseDesktop && {
            right: NAV_WIDTH,
          }),
        }),
      }}
    >
      <Iconify
        width={16}
        icon={collapseDesktop ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
      />
    </IconButton>
  );

  const upMd = useResponsive('up', 'md');

  const table = useTable();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    data,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  const dataFiltered = applyFilter({
    inputData: list,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 52 : 72;
  const popover = usePopover();
  const confirm = useBoolean();
  const [deleteRow, setDeleteRow] = useState(null);

  const [deleteNotesVitals] = useMutation(DeleteNotesVitalPatient, {
    context: {
      requestTrackerId: 'Create_notes[Create_notes_vitals]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleDeleteRow = useCallback((row) => {
    deleteNotesVitals({
      variables: {
        data: {
          vital_id: Number(row?.id),
          category_delete: String(row?.category),
          dateCreated: row?.dataDate,
        },
      },
    }).then(() => {
      refetch();
      enqueueSnackbar('Deleted successfully!');
    });
  }, []);

  const [listData, setListData] = useState([]);

  useEffect(() => {
    console.log(list, 'awit bosing');
  }, [list]);

  // let isContainNull = list?.find((item)=>Number(item?.id)=== 0);

  const notFound = !dataFiltered.length;
  const renderList = (
    <>
      <CardHeader title="Chart Timeline" sx={{ pb: 3 }} />

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
              {list
                ?.filter((item) => Number(item?.data) !== 0 && item)
                ?.slice(
                  isTemp ? 1 : table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <VitalFullScreenRow
                    row={row}
                    handleDelete={() => {
                      handleDeleteRow(row);
                    }}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, list.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );

  return (
    <Dialog fullScreen open={open}>
      <DialogActions>
        <Box sx={{ typography: 'h5', flex: 1 }}>{title} Chart</Box>

        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

      <DialogContent sx={{ p: 3, width: '100%' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: '100%', overflow: 'hidden' }}
          spacing={3}
        >
          <Card sx={{ m: { md: 3 }, p: { md: 3 }, mt: 1, width: 1 }}>
            <Chart
              dir="ltr"
              type="line"
              series={data}
              options={chartOptions}
              height={upMd ? 500 : 200}
              width={upMd ? '100%' : 350}
            />
          </Card>
          {lgUp ? (
            <Box sx={{ position: 'relative' }}>
              {renderBtn}
              <Stack
                sx={{
                  height: 1,
                  flexShrink: 0,
                  width: NAV_WIDTH,
                  borderLeft: `solid 1px ${theme.palette.divider}`,
                  transition: theme.transitions.create(['width'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  ...(collapseDesktop && {
                    width: 1,
                  }),
                }}
              >
                {!collapseDesktop && <Box>{renderList}</Box>}
              </Stack>
            </Box>
          ) : (
            <Card>{renderList}</Card>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: { value: string; date: string }[];
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
}
