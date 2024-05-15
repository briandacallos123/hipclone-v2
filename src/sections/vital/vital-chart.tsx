'use client';

import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// hooks
import { useAuthContext } from '@/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import VitalFullscreen from './vital-fullscreen';
import VitalChartMobile from './Vital-chart-mobile';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  subheader: string;
  list: { value: string; date: string }[];
  chart: {
    categories: string[];
    colors?: string[][];
    data: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
  loading: boolean;
  isDashboard: any;
}

export default function VitalChart({
  title,
  subheader,
  list,
  chart,
  isDashboard,
  loading,
  ...other
}: Props) {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');
  const open = useBoolean();
  const { user } = useAuthContext();

  const dashboardVital = isDashboard;
  console.log('dashboardasdasdVital', dashboardVital);

  const isDoctor = user?.role === 'doctor';
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

  return (
    <>
      {upMd && !dashboardVital && (
        <Card {...other} sx={{ width: { xs: 200, md: 'auto' }, height: { xs: 180, md: 270 } }}>
          <CardHeader
            title={title}
            subheader={subheader}
            action={
              <IconButton onClick={open.onTrue}>
                <Iconify icon="solar:maximize-bold" />
              </IconButton>
            }
            sx={{ p: { xs: 0.7, md: 2 } }}
          />

          {loading ? (
            <Box sx={{ p: 3, pt: 2 }}>
              <Skeleton variant="rounded" height={180} />
            </Box>
          ) : (
            <Chart
              dir="ltr"
              type="line"
              series={data}
              options={chartOptions}
              height={upMd ? 180 : 165}
              width={upMd ? '100%' : 200}
            />
          )}
        </Card>
      )}
      {!upMd && (
        <VitalChartMobile
          chartFull={chart}
          list={list}
          title={title}
          subheader={subheader}
          percent={2.6}
          total={765}
          chart={{
            series: data,
          }}
        />
      )}
      {!isDoctor && dashboardVital && (
        <VitalChartMobile
          dashboardVital={dashboardVital}
          chartFull={chart}
          list={list}
          title={title}
          subheader={subheader}
          percent={2.6}
          total={765}
          chart={{
            series: data,
          }}
        />
      )}

      <VitalFullscreen
        title={title}
        open={open.value}
        onClose={open.onFalse}
        chart={chart}
        list={list}
      />
    </>
  );
}
