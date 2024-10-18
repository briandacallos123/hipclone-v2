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

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  subheader: string;
  list?: {
    respiratoryRateValue: string;
    heartRateValue: string;
    bmiHGValue: string;
    bmiMMValue: string;
    date: string;
  }[];
  chart: {
    categories?: string[];
    colors?: string[][];
    data: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
  loading: boolean;
}

export default function VitalChart({
  title,
  subheader,
  list,
  chart,

  loading,
  ...other
}: Props) {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');
  const open = useBoolean();
  const { user } = useAuthContext();

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
    },
    xaxis: {
      categories,
    },

    ...options,
  });

  // console.log(chartOptions, 'CHARTOPTIONS_____________');
  // console.log(data, 'DATA_____________');

  return (
    <Card
      {...other}
      sx={{
        width: '100%',
        height: { xs: 180, md: 270 },
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <CardHeader title={title} subheader={subheader} sx={{ p: { xs: 0.7, md: 2 } }} />

      {loading ? (
        <Box sx={{ p: 3, pt: 2 }}>
          <Skeleton variant="rounded" height={180} />
        </Box>
      ) : (
        <Chart
          dir="ltr"
          type="area"
          series={data && data}
          options={chartOptions}
          height={upMd ? 180 : 165}
          width="100%"
        />
      )}
    </Card>
  );
}
