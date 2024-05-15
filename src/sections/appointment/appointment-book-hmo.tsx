'use client';

// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  data: any;
  isLoading: any;
  setLoading: any;
};

export default function AppointmentBookHmo({ data, isLoading, setLoading }: any) {
  console.log(isLoading, 'isLoading???');

  return (
    <Card>
      <CardHeader title="HMO Accreditations" />

      <Typography sx={{ px: 3, typography: 'caption', color: 'error.main', lineHeight: 1.5 }}>
        Only Cocolife accepts telemedicine consultations through HIPS. For other HMOs,
        please contact your coordinator.
      </Typography>

      <Stack sx={{ p: 3 }}>
        {!isLoading
          ? data?.map((item: any) => (
              <Typography key={item} variant="body1">
                •&nbsp; {item.name}
              </Typography>
            ))
          : [...Array(5)].map((_, index) => (
              <Skeleton sx={{ width: 180, height: 17, marginBottom: 1 }} />
            ))}
      </Stack>
    </Card>
  );
}
