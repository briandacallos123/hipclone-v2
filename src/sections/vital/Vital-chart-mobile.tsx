import { ApexOptions } from 'apexcharts';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import VitalFullscreen from './vital-fullscreen';
// ----------------------------------------------------------------------

interface Props extends CardProps {
  chartFull: any;
  list: any;
  title: string;
  total: number;
  subheader: string;
  percent: number;
  dashboardVital?: any;
  refetch:()=>void;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function VitalChartMobile({
  title,
  percent,
  total,
  chart,
  dashboardVital,
  subheader,
  chartFull,
  list,
  sx,
  refetch,
  ...other
}: Props) {
  const theme = useTheme();
  const open = useBoolean();
  const dashboard = dashboardVital;
  console.log('dashboard', dashboard);
  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    series,
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
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    legend: {
      show: false,
    },

    ...options,
  });

  const renderTrending = (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: alpha(theme.palette.success.main, 0.16),
          ...(percent < 0 && {
            color: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}

        {fPercent(percent)}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {' than last week'}
        </Box>
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1.5, pr: 2, ...sx }} {...other}>
      {/* <CardHeader
        title={title}
        subheader={subheader}
        action={
          <IconButton onClick={open.onTrue}>
            <Iconify icon="solar:maximize-bold" />
          </IconButton>
        }
        sx={{ p: { xs: 0.7, md: 2, flexGrow: 1 } }}
      /> */}

      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="caption">{subheader}</Typography>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <Stack direction="row">
          <Chart type="line" series={series} options={chartOptions} width={175} height={80} />
          <IconButton sx={{ alignSelf: 'flex-start', mb: 2 }} onClick={open.onTrue}>
            <Iconify icon="solar:maximize-bold" />
          </IconButton>
        </Stack>
      </Box>
      {!dashboard && (
        <VitalFullscreen
          title={title}
         refetch={refetch}
          list={list}
          open={open.value}
          onClose={open.onFalse}
          chart={chartFull}
        />
      )}
    </Card>
  );
}
