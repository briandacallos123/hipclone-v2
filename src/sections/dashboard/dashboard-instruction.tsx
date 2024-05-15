import Link from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

const LinkStyle = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle2,
  textDecoration: 'none',
  color: theme.palette.primary.main,
}));

// ----------------------------------------------------------------------

export default function DashboardInstruction() {
  return (
    <Card>
      <CardHeader
        title="Appointment Instructions"
        subheader="What to do after booking your appointment?"
      />

      <CardContent>
        <Stack spacing={2} sx={{ m: 0 }}>
          <Box>
            <Typography variant="subtitle1">Step 1:</Typography>
            <Typography variant="body2">Check if your appointment has been created.</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1">Step 2:</Typography>
            <Typography variant="body2">
              Wait for SMS from your doctor to confirm your schedule and provide additional
              instructions.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1">Step 3:</Typography>
            <Typography variant="body2">
              If applicable, settle account conveniently. Click&nbsp;
              <Iconify
                icon="solar:clipboard-text-bold"
                width={18}
                sx={{ color: 'text.disabled', mb: -0.3 }}
              />
              &nbsp;icon to go to payment page.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1">Step 4:</Typography>
            <Typography variant="body2">
              Click&nbsp;<LinkStyle href={paths.dashboard.user.profile}>Medical Record</LinkStyle>
              &nbsp;to upload laboratory and imaging results prior to appointment. You can also view
              your medical notes and prescriptions&nbsp;
              <LinkStyle href={paths.dashboard.prescription}>here</LinkStyle>.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1">Step 5:</Typography>
            <Typography variant="body2">
              For Telemedicine: On the day of appointment, proceed to&nbsp;
              <LinkStyle href={paths.dashboard.appointment.root}>Appointment</LinkStyle>&nbsp;page.
              You will receive SMS when your doctor is ready to start consultation.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
