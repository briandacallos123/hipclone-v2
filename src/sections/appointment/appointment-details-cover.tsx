import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha, styled } from '@mui/material/styles';
// types
import { useResponsive } from 'src/hooks/use-responsive';
import { IHospital } from 'src/types/general';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Label from 'src/components/label';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  name: any;
  avatarUrl: any;
  job: any;
  email: any;
  coverUrl: any;
  type: any;
  status: any;
  isPaid: any;
  schedule: any;
  hospital: any;
  voucherId?:string;
  time_slot: any;
  e_time?:any;
  user: any;
  currentItem: any;
};

export default function AppointmentDetailsCover({
  name,
  avatarUrl,
  job,
  email,
  coverUrl,
  type,
  status,
  isPaid,
  schedule,
  hospital,
  time_slot,
  user,
  currentItem,
  e_time,
  voucherId
}: Props) {
  const theme = useTheme();

  const convertTime = (timeStr: any) => {
    if (!timeStr) return 'N / A';
    let hour: any = Number(timeStr.split(':')[0]);
    const min = timeStr.split(':')[1];
    let AMPM = 'AM';
    if (hour > 12) {
      hour -= 12;
      AMPM = 'PM';
    }
    if (hour < 10) {
      hour = `0${hour}`;
    }
    return `${hour}:${min} ${AMPM}`;
  };
  const upMd = useResponsive('up', 'md');

  console.log(
    'currentItem?.patientInfo?.userInfo[0].display_picture[0]',
    currentItem?.patientInfo?.userInfo[0].display_picture[0]
  );
  console.log('currentItem', currentItem);

  return (
    <Box
      gap={{ md: 2, xs: 1 }}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <Card
        component={Stack}
        spacing={2}
        direction={{ xs: 'row', md: 'row' }}
        alignItems="center"
        sx={{
          p: { md: 3, xs: 1 },
          background: 'url(/assets/background/banner-bg.png)',
          backgroundSize: 'cover',
          height: 1,
          color: 'common.white',
        }}
      >
        {currentItem?.patientInfo?.userInfo?.[0]?.display_picture?.[0] ? (
          <Avatar
            alt={currentItem?.patientInfo?.FNAME}
            src={
              currentItem?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split(
                'public'
              )[1]
            }
            sx={{
              width: { xs: 64, md: 100 },
              height: { xs: 64, md: 100 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {currentItem?.patientInfo?.FNAME.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <Avatar
            alt={currentItem?.patientInfo?.FNAME}
            sx={{
              width: { xs: 64, md: 100 },
              height: { xs: 64, md: 100 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {currentItem?.patientInfo?.FNAME.charAt(0).toUpperCase()}
          </Avatar>
        )}

        {/* <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            width: { xs: 64, md: 100 },
            height: { xs: 64, md: 100 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        /> */}

        <ListItemText
          primary={name}
          secondary={
            <>
              <Typography variant="body2">{job}</Typography>
              <Typography variant="body2">{email}</Typography>
            </>
          }
          primaryTypographyProps={{
            typography: 'h6',
            textAlign: { xs: 'unset', md: 'unset' },
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            display: 'flex',
            flexDirection: 'column',
            textAlign: { xs: 'unset', md: 'unset' },

            sx: { opacity: 0.78, color: 'common.white' },
          }}
        />
      </Card>

      <Card sx={{ p: { md: 3, xs: 1 }, display: 'flex' }}>
        <Stack
          direction="column"
          alignItems="flex-start"
          sx={{ width: '100%', alignSelf: 'center' }}
        >
          <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
            <Label
              variant="soft"
              color={(type === 1 && 'success') || 'info'}
              sx={{ textTransform: { sm: 'uppercase' }, py: { md: 2, xs: 1 } }}
            >
              {type === 1 ? 'telemedecine' : 'face-to-face'}
            </Label>

            <Label
              variant="soft"
              color={
                (status === 1 && 'success') ||
                (status === 2 && 'error') ||
                (status === 3 && 'info') ||
                'warning'
              }
              sx={{ textTransform: { sm: 'uppercase' }, py: { md: 2, xs: 1 } }}
            >
              {(status === 1 && 'approved') ||
                (status === 2 && 'cancelled') ||
                (status === 3 && 'done') ||
                'pending'}
            </Label>

            <Label
              variant="soft"
              color={(isPaid === 1 && 'info') || 'error'}
              sx={{ textTransform: { sm: 'uppercase' }, py: { md: 2, xs: 1 } }}
            >
              {isPaid === 1 ? 'paid' : 'unpaid'}
            </Label>
          </Stack>

          <Stack spacing={1} direction="row" sx={{ typography: { md: 'body2', xs: 'caption' } }}>
            <Iconify
              icon="solar:map-point-wave-bold-duotone"
              sx={{ minWidth: 25, fontSize: 25, color: 'primary.main' }}
            />
            {hospital}
          </Stack>

          <Stack spacing={1} direction="row" sx={{ typography: { md: 'body2', xs: 'caption' } }}>
            <Iconify
              icon="ph:qr-code-duotone"
              sx={{ minWidth: 25, fontSize: 25, color: 'primary.main' }}
            />
            {voucherId} (Voucher Code)
          </Stack>

          <Stack spacing={1} direction="row" sx={{ typography: { md: 'body2', xs: 'caption' } }}>
            <Iconify
              icon="solar:calendar-bold-duotone"
              sx={{ minWidth: 25, fontSize: 25, color: 'primary.main' }}
            />
            {schedule} ({!e_time ? convertTime(time_slot): `${convertTime(time_slot)} - ${convertTime(e_time)}`})
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
