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

import { Grid, Typography } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import Image from '@/components/image';
import PatientUpcomingSearch from './PatientUpcomingSearch';
import PatientUpcomingList from './PatientUpcomingList';
import { Icon } from '@iconify/react';
import { dateForAppt, formatMilitaryTime } from '@/utils/format-time';
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
  activeDoctor?: any;
  onIncrement?: () => void;
  total?: number;
  changeActiveDoctor?: () => void;
  isLeftEnd?:boolean;
};

export default function PatientUpcommingCarousel({ total, changeActiveDoctor, onIncrement, data, loading, activeDoctor, handleMove, isLeftEnd }: Props) {

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
        breakpoint: 360,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  const { carouselRef } = carousel;

  useEffect(() => {
    if (carousel?.currentIndex === (total - 3)) {
      onIncrement();
    }
  }, [carousel?.currentIndex, total])


  console.log(carousel?.currentIndex, 'mossing');


  useEffect(() => {
    if (carouselRef.current?.slickGoTo) {
      console.log(currentIndex, 'currentIndex');

      carouselRef.current.slickGoTo(currentIndex);
    }
  }, [carouselRef, currentIndex]);





  const doctorName = activeDoctor?.doctorInfo?.EMP_MNAME ? `${activeDoctor?.doctorInfo?.EMP_FNAME} ${activeDoctor?.doctorInfo?.EMP_MNAME} ${activeDoctor?.doctorInfo?.EMP_LNAME}` : `${activeDoctor?.doctorInfo?.EMP_FNAME} ${activeDoctor?.doctorInfo?.EMP_LNAME}`

  const doctorTitle = `${activeDoctor?.doctorInfo?.EMP_TITLE}`

  const doctorClinic = activeDoctor?.clinicInfo?.clinic_name;

  const doctorImage = activeDoctor?.doctorInfo?.EMP_ATTACHMENT?.filename?.includes('storage') && activeDoctor?.doctorInfo?.EMP_ATTACHMENT?.filename


  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2
      }}
    >
      <Stack flexGrow={1} direction="column" spacing={1.5} sx={{ mb: { xs: 1, md: 2 } }}>


        {/* <Typography variant="h5" color="white">List of other clinic that you're also scheduled</Typography> */}



        <Box sx={{ flexGrow: 1 }} />

        {!upMd &&
          <Stack gap={3} justifyContent="space-between">
            <Typography variant="h6" color="white">Up-coming Appointments</Typography>
            <Stack>

              <Stack direction='row' justifyContent='flex-end' alignItems='center' gap={1}>

                <PatientUpcomingSearch item={data} />
                <PatientUpcomingList item={data} currentIndex={carousel?.currentIndex} />

                {/* <CarouselArrows
                  filled
                  spacing={1}
                  icon="solar:alt-arrow-right-bold"
                  onNext={carousel.onNext}
                  onPrev={carousel.onPrev}
                  leftButtonProps={{ sx: { width: 32, height: 32 } }}
                  rightButtonProps={{ sx: { width: 32, height: 32 } }}
                /> */}
                <IconButtonStyle
                  disabled={isLeftEnd}
                  onClick={() => handleMove('left')}
                  sx={{ width: 32, height: 32 }}
                >
                  <Iconify icon="solar:alt-arrow-left-bold" />
                </IconButtonStyle>

                <IconButtonStyle
                  onClick={()=>handleMove('right')}
                  sx={{ width: 32, height: 32 }}
                >
                  <Iconify icon="solar:alt-arrow-right-bold" />
                </IconButtonStyle>

              </Stack>
            </Stack>
            <Stack gap={3}>
              <Stack direction="row" alignItems='center' gap={{ xs: 1, md: 0 }}>
                {!upMd && (doctorImage ?
                  <Avatar
                    src={doctorImage}
                  />
                  : <Avatar sx={{
                    width: 60,
                    height: 60
                  }}>
                    {doctorName[0]?.toUpperCase()}
                  </Avatar>)}
                <Box>
                  <Typography sx={{ color: 'white', fontSize: 16 }}>{doctorName}</Typography>
                  <Typography sx={{ color: '#d1d1d1', fontSize: 14 }}>{doctorTitle} | {doctorClinic}</Typography>
                </Box>
              </Stack>

              <Stack gap={1}>
                <Stack direction="row" gap={2}>
                  <Icon color="white" icon="clarity:calendar-line" fontSize={18} />
                  <Typography sx={{ color: 'white', fontSize: 14 }}>{dateForAppt(activeDoctor?.date)}</Typography>

                </Stack>
                <Stack direction="row" gap={2}>
                  <Icon color="white" icon="teenyicons:clock-outline" fontSize={18} />
                  <Typography sx={{ color: 'white', fontSize: 14 }}>{formatMilitaryTime(activeDoctor?.time_slot)}</Typography>

                </Stack>
              </Stack>
            </Stack>
          </Stack>
        }

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

      {/* {upMd &&
        (!loading ? (
          <Carousel ref={carouselRef} {...carousel.carouselSettings}>
            {data?.map((item: any) => (
              <Box key={item.S_ID} sx={{ px: 1 }}>
                <CarouselItem
                  key={item.S_ID}
                  changeActiveDoctor={() => changeActiveDoctor(item)}
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
        ))} */}
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  isActive: boolean;
  item: any;
  sx?: SxProps<Theme>;
  changeActiveDoctor?: () => void;
};

function CarouselItem({ isActive, item, changeActiveDoctor, sx }: CarouselItemProps) {
  const theme = useTheme();
  const router = useRouter();

  console.log(item, 'carousel item')


  const fullName = item?.doctorInfo?.EMP_MNAME ? `${item?.doctorInfo?.EMP_FNAME} ${item?.doctorInfo?.EMP_MNAME} ${item?.doctorInfo?.EMP_LNAME}` : `${item?.doctorInfo?.EMP_FNAME} ${item?.doctorInfo?.EMP_LNAME}`

  const info = `${item?.doctorInfo?.EMP_TITLE}`

  const handleNavigate = useCallback(
    (voucher: string) => {
      router.push(paths.queue.root(voucher));
    },
    [router]
  );

  return (
    // <PaperStyle
    //   isActive={isActive}
    //   onClick={() => handleNavigate(item?.voucherId)}
    //   sx={{ ...sx, }}
    // >
    //   <Grid container>
    //     <Grid lg={8}>
    //       <Typogra
    //     </Grid>
    //     <Grid lg={4}></Grid>

    //   </Grid>
    // </PaperStyle>

    <PaperStyle
      isActive={isActive}
      onClick={changeActiveDoctor}
      sx={{ ...sx, }}
    >
      {item?.doctorInfo?.EMP_ATTACHMENT ? (
        <Avatar
          alt={item?.patientInfo?.FNAME}
          src={item?.doctorInfo?.EMP_ATTACHMENT}
          sx={{ mr: 1 }}
        />
      ) : (
        <Avatar alt={item?.patientInfo?.FNAME} sx={{ mr: 1 }}>
          {item?.doctorInfo?.EMP_FNAME?.charAt(0).toUpperCase()}
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
