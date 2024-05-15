import { format } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card, { CardProps } from '@mui/material/Card';
// routes
import { paths } from 'src/routes/paths';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import { RouterLink } from '@/routes/components';
import { useResponsive } from '@/hooks/use-responsive';

// ----------------------------------------------------------------------

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 180,
  height: 180,
  opacity: 1,
  position: 'absolute',
  top: theme.spacing(-3),
  right: theme.spacing(-3),
  [theme.breakpoints.up('md')]: {
    width: 260,
    height: 260,
    top: theme.spacing(-5),
    right: theme.spacing(-6),
  },
}));

const ActionStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 9,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  data: any;
}

export default function OverviewUpcomingAppointment({ title, data, sx, ...other }: Props) {
  const upMd = useResponsive('up', 'md');
  console.log('CAROUSEL: ', data);
  const carousel = useCarousel({
    autoplay: true,
    fade: true,
    speed: 500,
  });

  const renderArrows = (
    <CarouselArrows
      filled
      shape="rounded"
      spacing={1}
      onNext={carousel.onNext}
      onPrev={carousel.onPrev}
      leftButtonProps={{ size: 'small' }}
      rightButtonProps={{ size: 'small' }}
    />
  );

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data?.map((item) => (
          <CarouselItem key={item.id} item={item} title={title} action={!upMd && renderArrows} />
        ))}
      </Carousel>

      <ActionStyle>
        {upMd && renderArrows}

        <Button
          size="small"
          variant="contained"
          component={RouterLink}
          href={paths.dashboard.overview.today}
        >
          View All
        </Button>
      </ActionStyle>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: IAppointmentItem;
  title: string;
  action?: React.ReactNode;
};

function CarouselItem({ item, title, action }: any) {
  const { patientInfo, clinicInfo, date: schedule, time_slot }: any = item;
  // console.log('ITEM: ', item);
  const fullName = `${patientInfo?.FNAME} ${patientInfo?.LNAME}`;

  return (
    <>
      <CardHeader title={title} sx={{ position: 'relative', zIndex: 9 }} action={action} />

      <CardContent sx={{ position: 'relative', zIndex: 9, width: '75%' }}>
        <Typography variant="subtitle1" sx={{ mb: 0.75, textTransform: 'uppercase' }}>
          {fullName}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            typography: 'body2',
          }}
        >
          <Iconify
            icon="solar:map-point-wave-bold-duotone"
            sx={{ minWidth: 20, fontSize: 20, color: 'primary.main' }}
          />
          {clinicInfo?.clinic_name}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            typography: 'body2',
          }}
        >
          <Iconify
            icon="solar:calendar-bold-duotone"
            sx={{ minWidth: 20, fontSize: 20, color: 'primary.main' }}
          />
          {format(new Date(schedule), `eee, dd MMM yyyy (p)`)}
          {/* {schedule} */}
        </Box>
      </CardContent>

      <AvatarStyle alt={fullName} src={patientInfo?.avatarUrl}>
        {fullName.charAt(0).toUpperCase()}
      </AvatarStyle>
    </>
  );
}
