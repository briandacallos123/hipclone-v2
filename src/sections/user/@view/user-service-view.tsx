'use client';

// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
//
import ServiceProfessionalFee from '../service/service-professional-fee';
import ServiceAdditionalFee from '../service/service-additional-fee';
import ServicePaymentSchedule from '../service/service-payment-schedule';
import ServiceHmo from '../service/service-hmo';
import ServicePaymentMethodList from '../service/service-payment-method-list';

// ----------------------------------------------------------------------

export default function UserServiceView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Manage Service
      </Typography>

      <Stack spacing={3}>
        <ServiceProfessionalFee />

        <ServiceAdditionalFee />

        <ServicePaymentSchedule />

        <ServiceHmo />

        <ServicePaymentMethodList />
      </Stack>
    </Container>
  );
}
