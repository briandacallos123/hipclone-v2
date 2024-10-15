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
import PatientCarouselSearch from './patient-carousel-search';
import PatientListPopover from './patient-list-popover';

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
export default function PatientCarousel({ data, loading }: Props) {
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
    slidesToShow: data?.length === 1 && 1 || data?.length === 2 && 2 || data?.length === 3 && 3 || 4,
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

  console.log(data,'datadatadatadata')

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={1.5} sx={{ mb: { md: 2 } }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.patient.root}
          color="inherit"
          variant="contained"
        >
          Return to List
        </Button>

        {upMd && <PatientCarouselSearch item={data} />}

        <Box sx={{ flexGrow: 1 }} />

        {!upMd && (
          <>
            <PatientCarouselSearch item={data} />

            <PatientListPopover item={data} currentIndex={currentIndex} />

            <IconButtonStyle
              onClick={() => handleMove(currentIndex - 1)}
              sx={{ width: 32, height: 32 }}
            >
              <Iconify icon="solar:alt-arrow-left-bold" />
            </IconButtonStyle>

            <IconButtonStyle
              onClick={() => handleMove(currentIndex + 1)}
              sx={{ width: 32, height: 32 }}
            >
              <Iconify icon="solar:alt-arrow-right-bold" />
            </IconButtonStyle>
          </>
        )}

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
      </Stack>

      {upMd &&
        (!loading ? (
          <Carousel ref={carouselRef} {...carousel.carouselSettings}>
            {data?.map((item: any) => (
              <Box key={item.S_ID} sx={{ px: 1}}>
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


 
  const fullName = `${item?.patientInfo?.FNAME} ${item?.patientInfo?.LNAME}`;

  const info = `${capitalize(item?.patientInfo?.SEX === 1 ? 'Male' : 'Female')}, ${
    item?.patientInfo?.AGE
  } yr(s) old`;

  const handleNavigate = useCallback(
    (newId: string) => {
      router.push(paths.dashboard.patient.view(newId));
    },
    [router]
  );

  return (
    <PaperStyle
      isActive={isActive}
      onClick={() => handleNavigate(item?.patientInfo?.userInfo?.uuid)}
      sx={{ ...sx }}
    >
      {item?.patientInfo?.userInfo?.display_picture[0] ? (
        <Avatar
          alt={item?.patientInfo?.FNAME}
          src={item?.patientInfo?.userInfo?.display_picture[0].filename}
          sx={{ mr: 1 }}
        >
          {item?.patientInfo?.FNAME.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Avatar alt={item?.patientInfo?.FNAME} sx={{ mr: 1 }}>
          {item?.patientInfo?.FNAME.charAt(0).toUpperCase()}
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
