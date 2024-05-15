'use client';

import { useState } from 'react';
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
import { fDate } from 'src/utils/format-time';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
  { id: 'value', label: 'Value' },
];

type Props = {
  title: string;
  open: boolean;
  onClose: VoidFunction;
  list: { value: string; date: string }[];
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
export default function VitalFullscreen({ title, open, onClose, chart, list }: Props) {
  const [openMobile, setOpenMobile] = useState(true);
  const [collapseDesktop, setCollapseDesktop] = useState(false);
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');
  const handleToggleNav = () => {
    setCollapseDesktop(!collapseDesktop);
  };

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
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow hover>
                    <TableCell>{fDate(row.date)}</TableCell>

                    <TableCell sx={{ typography: 'subtitle2' }}>{row.value}</TableCell>
                  </TableRow>
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
