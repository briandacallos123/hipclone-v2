/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useState } from 'react';
import { capitalize } from 'lodash';
// @mui
import { alpha, Theme, styled, useTheme, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
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
// components
import { useLazyQuery } from '@apollo/client';
import { GET_RECORD } from '@/libs/gqls/records';
import Iconify from 'src/components/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
//
import EmrCarouselSearch from './emr-carousel-search';
import EmrListPopover from './emr-list-popover';

// ----------------------------------------------------------------------

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  backgroundColor: alpha(theme.palette.grey[900], 0.48),
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
  },
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
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
  loading?: any;
};
export default function EmrCarousel({ data, loading }: Props) {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const router = useRouter();

  const params = useParams();

  const { id } = params;
  console.log(id, 'params');

  const [dataList, setDataList] = useState<any>([]);
  const currentIndex = dataList.indexOf(_patientList.filter((_) => _.id === id)[0]);

  // console.log('CAROUSEL YAY: ', data);
  // const [getData, { data, loading, error }] = useLazyQuery(GET_RECORD, {
  //   context: {
  //     requestTrackerId: 'getRecord[gREC]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         // searchKeyword: filters.name,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { allRecords } = data;
  //       setDataList(allRecords?.Records_list);
  //     }
  //   });
  // }, [getData]);

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
      if (index >= 0 && index < _patientList.length) {
        const newIndex = _patientList.filter((_, i) => i === index)[0];

        router.push(paths.dashboard.patient.view(newIndex.id));
      }
    },
    [router]
  );

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
          href={paths.dashboard.emr.root}
          color="inherit"
          variant="contained"
        >
          Return to List
        </Button>

        {upMd && <EmrCarouselSearch item={data} />}

        <Box sx={{ flexGrow: 1 }} />

        {!upMd && (
          <>
            <EmrCarouselSearch item={data} />

            <EmrListPopover />

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
              <Box key={item.id} sx={{ px: 1 }}>
                <CarouselItem item={item} isActive={Boolean(item.id === id)} />
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
  const { id, patient } = item;
  if (item?.patientRelation) {
    item = {
      ...item,
      patientInfo: item.patientRelation,
    };
  }
  // if not link walang laman yung patientRelation kaya dapat bumuo tayo
  if (!item?.patientRelation) {
    item = {
      ...item,
      patientInfo: {
        // AGE:
        CONTACT_NO: item?.contact_no,
        FNAME: item?.fname,
        LNAME: item?.lname,
        SEX: item?.gender,
      },
    };
  }

  // if (!item?.patientInfo) {
  //   item.patientInfo = {
  //     ...item.patientRelation,
  //   };
  // }
  const router = useRouter();

  const fullName = `${item?.fname} ${item?.lname}`;
  const info = `${capitalize(Number(item?.gender) === 1 ? 'Male' : 'Female')} ${item?.AGE >= 1 && item?.AGE !== null && item?.AGE ? `, ${item?.AGE} ${item?.AGE > 1 ? "years old":"year old"}`:""}`;
  // const info = `${capitalize(Number(item?.gender) === 1 ? 'Male' : 'Female')}, ${
  //   item?.AGE < 5 ? 'unspecified' : item?.AGE
  // } yr(s) old`;

  const handleNavigate = useCallback(
    (newId: string) => {
      router.push(paths.dashboard.emr.view(newId));
    },
    [router]
  );

  // console.log(item, 'ITEMS');
  return (
    <PaperStyle isActive={isActive} onClick={() => handleNavigate(id)} sx={{ ...sx }}>
      {item?.patientRelation?.userInfo[0]?.display_picture[0] ? (
        <Avatar
          alt={item?.patientRelation?.FNAME}
          src={item?.patientRelation?.userInfo[0]?.display_picture[0].filename.split('public')[1]}
          sx={{ mr: 1 }}
        >
          {item?.patientRelation?.FNAME.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Avatar alt={fullName} sx={{ mr: 1 }}>
          <Avatar sx={{ textTransform: 'capitalize' }}>{fullName[0]}</Avatar>
        </Avatar>
      )}
      {/* <Avatar alt={fullName} sx={{ mr: 1 }}>
        {fullName.trim().charAt(0).toUpperCase()}
      </Avatar> */}

      <ListItemText
        primary={fullName}
        secondary={info}
        primaryTypographyProps={{ typography: 'subtitle2' }}
        secondaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
    </PaperStyle>
  );
}
