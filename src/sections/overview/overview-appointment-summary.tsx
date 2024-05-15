import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[][];
    data: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
}

export default function OverviewAppointmentSummary({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.success.light, theme.palette.success.main],
      [theme.palette.error.light, theme.palette.error.main],
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
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart dir="ltr" type="line" series={data} options={chartOptions} height={364} />
    </Card>
  );
}
