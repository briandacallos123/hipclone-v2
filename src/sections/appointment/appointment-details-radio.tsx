// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// components
import { RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const STATUS_OPTION = [
  { label: 'Pending', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Done', value: 3 },
  { label: 'Cancelled', value: 2 },
];

const PAYMENT_STATUS_OPTION = [
  { label: 'Paid', value: 1 },
  { label: 'Unpaid', value: 0 },
];

const APPOINTMENT_TYPE_OPTION = [
  { label: 'Telemedicine', value: 1 },
  { label: 'Face-to-Face', value: 2 },
];

// ----------------------------------------------------------------------

export default function AppointmentDetailsRadio() {
  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(3, 1fr)',
      }}
    >
      <Card>
        <CardHeader title="Change Appointment Type" />

        <CardContent>
          <RHFRadioGroup name="type" options={APPOINTMENT_TYPE_OPTION} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Change Payment Status" />

        <CardContent>
          <RHFRadioGroup name="payment" options={PAYMENT_STATUS_OPTION} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Change Appointment Status" />

        <CardContent>
          <RHFRadioGroup name="status" options={STATUS_OPTION} />
        </CardContent>
      </Card>
    </Box>
  );
}
