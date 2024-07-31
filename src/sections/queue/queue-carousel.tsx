import { useCallback, useEffect, useState } from 'react';
import { capitalize } from 'lodash';
// @mui
import { alpha, Theme, styled, useTheme, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _patientList } from 'src/_mock';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// types
import { IPatientItem } from 'src/types/patient';
// components
import { useLazyQuery } from '@apollo/client';
import { GET_RECORD } from '@/libs/gqls/records';
import Iconify from 'src/components/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
//
import PatientCarouselSearch from '../patient/patient-carousel-search';
import PatientListPopover from '../patient/patient-list-popover';
import { Typography } from '@mui/material';
import { bgGradient } from 'src/theme/css';
// ----------------------------------------------------------------------

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  backgroundColor: alpha(theme.palette.grey[900], 0.48),
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
  },
}));

interface PaperStyleProps {
  isActive: boolean;
}

const PaperStyle = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<PaperStyleProps>(({ isActive, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  border: '2px solid transparent',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: theme.palette.background.neutral,
  transition: theme.transitions.create(['border'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    border: `2px solid ${theme.palette.primary.light}`,
  },
  ...(isActive && {
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  }),
}));

// ----------------------------------------------------------------------
type Props = {
  data?: any;
  loading: boolean;
};
export default function QueueCarousel({ data, loading }: Props) {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const router = useRouter();

  const params = useParams();

  const { id } = params;
  const [dataList, setDataList] = useState<any>([]);
  const currentIndex = data.indexOf(
    data.filter((_: any) => _?.patientInfo?.userInfo?.uuid === id)[0]
  );


  const carousel = useCarousel({
    slidesToShow: data?.length > 3 ? 3 : data?.length,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    initialSlide: currentIndex,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  const { carouselRef } = carousel;

  useEffect(() => {
    if (carouselRef.current?.slickGoTo) {
      carouselRef.current.slickGoTo(currentIndex);
    }
  }, [carouselRef, currentIndex]);

  const handleMove = useCallback(
    (index: number) => {
      if (index >= 0 && index < data.length) {
        const newIndex = data.filter((_, i) => i === index)[0];

        router.push(paths.dashboard.patient.view(newIndex?.patientInfo?.userInfo?.uuid));
      }
    },
    [data, router]
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          
        }),
        background: 'url(/assets/background/banner-bg.png)',
        backgroundSize: 'cover',
        // overflow: 'hidden',
        // position: 'relative',
        p:2,
        borderRadius:2
      }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={1.5} sx={{ mb: {xs:1, md: 2 } }}>
       
        <Typography variant="h5" color="white">List of your other schedule</Typography>
        {/* <Typography variant="h5" color="white">List of other clinic that you're also scheduled</Typography> */}

       

        <Box sx={{ flexGrow: 1 }} />

       
       
        {upMd && (
          <CarouselArrows
            filled
            spacing={1}
            icon="solar:alt-arrow-right-bold"
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            leftButtonProps={{ sx: { width: 32, height: 32 } }}
            rightButtonProps={{ sx: { width: 32, height: 32 } }}
          />
        )}
         {!upMd && <CarouselArrows
            filled
            spacing={1}
            icon="solar:alt-arrow-right-bold"
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            leftButtonProps={{ sx: { width: 32, height: 32 } }}
            rightButtonProps={{ sx: { width: 32, height: 32 } }}
          />}
      </Stack>

      {
        (!loading ? (
          <Carousel ref={carouselRef} {...carousel.carouselSettings}>
            {data?.map((item: any) => (
              <Box key={item.S_ID} sx={{ px: 1 }}>
                <CarouselItem
                  key={item.S_ID}
                  item={item}
                  isActive={Boolean(item?.patientInfo?.userInfo?.uuid === id)}
                />
              </Box>
            ))}
          </Carousel>
        ) : (
          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
            sx={{ px: 1 }}
          >
            {[...Array(4)].map((i) => (
              <Skeleton key={i} width="100%" height={92} />
            ))}
          </Box>
        ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  isActive: boolean;
  item: any;
  sx?: SxProps<Theme>;
};

function CarouselItem({ isActive, item, sx }: CarouselItemProps) {
  const theme = useTheme();
  const router = useRouter();

 
  const fullName = `${item?.clinicInfo?.clinic_name}`

  const info = `${item?.clinicInfo?.Province}`

  const handleNavigate = useCallback(
    (voucher: string) => {
      router.push(paths.queue.root(voucher));
    },
    [router]
  );

  return (
    <PaperStyle
      isActive={isActive}
      onClick={() => handleNavigate(item?.voucherId)}
      sx={{ ...sx, }}
    >
      {item?.patientInfo?.userInfo?.display_picture[0] ? (
        <Avatar
          alt={item?.patientInfo?.FNAME}
          src={item?.patientInfo?.userInfo?.display_picture[0].filename.split('public')[1]}
          sx={{ mr: 1 }}
        >
          {item?.patientInfo?.FNAME.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Avatar alt={item?.patientInfo?.FNAME} sx={{ mr: 1 }}>
          {item?.clinicInfo?.clinic_name?.charAt(0).toUpperCase()}
        </Avatar>
      )}

     

      <ListItemText
        primary={fullName}
        secondary={info}
        primaryTypographyProps={{
          typography: 'subtitle2',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        secondaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
    </PaperStyle>
  );
}
