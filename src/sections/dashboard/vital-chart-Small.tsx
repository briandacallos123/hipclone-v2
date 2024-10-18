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
import { fNumber } from '@/utils/format-number';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  subheader: string;
  list?: { value: string; date: string }[];
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
  isLegend?:boolean;
  isSmall?:boolean
}

export default function VitalChartSmall({
  title,
  subheader,
  list,
  chart,

  loading,
  isLegend,
  isSmall=false,
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
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      type: 'gradient',
    },
    xaxis: {
      categories,
    },

    tooltip: {
      enabled:true,
      x: {
        show: true,
      },
      followCursor: true,
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
      marker: {
        show: true,
      },
    },
    legend: {
      show: true,
      floating: true,
      offsetY: 10,
      position:'top',
      onItemClick: {
        toggleDataSeries: true
    },
      onItemHover: {
        highlightDataSeries: true
    },
    },

    ...options,
  });

  // console.log(chart.categories,'________________CATEGORRIES2___________________')
  // console.log(chartOptions,'________________CATEGORRIES2___________________')
  
  // console.log(data,'________________DATA2___________________')

  return (
    <>
      {upMd && (
        <Card
          {...other}
          sx={{
            p:isSmall ? .5:1 ,
            width: { xs: 200, md: 'auto' },
            height: { xs: 180, md: 350 },
            '& .MuiCardHeader-title': {
              fontSize: 12,
              textAlign: isSmall ? "left":"center",
            },
            boxShadow: 'none',
            border: 'none',
          
          }}
        >

          {isSmall ? <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                Body Temperature
              </Typography>:
              <CardHeader  title={title} subheader={subheader} sx={{ p: { xs: 0.7, md: isSmall ? 0:2} }} />
         
              }
          
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
              width={
                (upMd && isSmall && '25%') ||
                ((upMd && !isSmall) ? '70%':200 )
              }
              height={upMd ? '40%' : 165}
            />
          )}
        </Card>
      )}
    </>
  );
}
