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

const PaperStyle = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme }) => ({
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
}));

// ----------------------------------------------------------------------
type Props = {
  data?: any;
  loading?: boolean;
};
const sample = [{ item: 'test1' }, { item: 'test2' }];

export default function VitalsCarousel({ data, loading }: Props) {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const router = useRouter();

  const params = useParams();

  const { id } = params;
  const [dataList, setDataList] = useState<any>([]);
  // const currentIndex = data.indexOf(
  //   data.filter((_: any) => _?.patientInfo?.userInfo?.uuid === id)[0]
  // );
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useCarousel({
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    initialSlide: 1,
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

  // useEffect(() => {
  //   if (carouselRef.current?.slickGoTo) {
  //     carouselRef.current.slickGoTo(currentIndex);
  //   }
  // }, [carouselRef, currentIndex]);

  const handleMove = useCallback(
    (index: any) => {
      if (carouselRef.current) {
        carouselRef.current.slickGoTo(index); // Move the carousel
      }
    },
    [carouselRef]
  );

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={1.5} sx={{ mb: { md: 2 } }}>
        <Box sx={{ flexGrow: 1 }} />

        {!upMd && (
          <>
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
      </Stack>
      <Carousel ref={carouselRef} {...carousel.carouselSettings}>
        {sample?.map((vital: any, index: any) => (
          <Box key={index} sx={{ px: 1 }}>
            <CarouselItem
              key={index}
              item={vital.item}
              // isActive={Boolean(item?.patientInfo?.userInfo?.uuid === id)}
            />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  isActive?: boolean;
  item?: any;
  sx?: SxProps<Theme>;
};

function CarouselItem({ isActive, item, sx }: CarouselItemProps) {
  const theme = useTheme();
  const router = useRouter();

  const fullName = `{item?.patientInfo?.FNAME} {item?.patientInfo?.LNAME}`;

  const info = ` Male, 1 yr(s) old`;

  const handleNavigate = useCallback(
    (newId: string) => {
      router.push(paths.dashboard.patient.view(newId));
    },
    [router]
  );

  return (
    <PaperStyle onClick={() => {}} sx={{ ...sx }}>
      <Stack>{item}</Stack>
    </PaperStyle>
  );
}
