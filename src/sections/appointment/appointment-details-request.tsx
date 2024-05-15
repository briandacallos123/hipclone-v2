// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// utils
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  data: {
    professionalFee: number;
    medicalCertificate: number;
    medicalClearance: number;
    medicalAbstract: number;
    other: string;
  };
};

// ----------------------------------------------------------------------

export default function AppointmentDetailsRequest({ data }: Props) {
  const ADDITIONAL_FEES = [
    { type: 'Medical Certificate', amount: data.medicalCertificate },
    { type: 'Medical Clearance', amount: data.medicalClearance },
    { type: 'Medical Abstract', amount: data.medicalAbstract },
  ];

  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <Card>
        <CardHeader title="Request Fee" />

        <CardContent>
          <Stack direction="row" sx={{ mb: 1 }}>
            <Stack sx={{ width: 1 }}>
              <Typography variant="subtitle1">Professional fee</Typography>
            </Stack>
            <Stack sx={{ width: 1 }}>
              <Typography variant="subtitle1">{fCurrency(data.professionalFee)}</Typography>
            </Stack>
          </Stack>

          <Typography variant="subtitle1">Additional fees</Typography>
          {ADDITIONAL_FEES.map((item) => (
            <Stack key={item.type} direction="row">
              <Stack sx={{ width: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {item.type}
                </Typography>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                  {fCurrency(item.amount)}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Other Requests" />

        <CardContent>
          <Typography variant="body2">{data.other}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
