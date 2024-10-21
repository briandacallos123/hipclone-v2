/* eslint-disable @next/next/no-img-element */
import { useLazyQuery } from '@apollo/client';
// react
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Button, Grid, IconButton, Stack, Typography, Card } from '@mui/material';
import { alpha, Theme, styled, useTheme, SxProps } from '@mui/material/styles';
import { borderRadius } from '@mui/system';
// gql
import { QueryPatientIncomingAppt } from '@/libs/gqls/drappts';
// uitls
import { dateForAppt, formatMilitaryTime } from '@/utils/format-time';
// hooks
import { useResponsive } from '@/hooks/use-responsive';
// routes
import { paths } from '@/routes/paths';
// theme
import { bgGradient } from 'src/theme/css';
// component
import Image from '@/components/image';
import { Icon } from '@iconify/react';
import Iconify from '@/components/iconify';
import UpcomingSkeleton from './upcoming-skeleton';
import PatientUpcommingCarousel from './patientUpcommingCarousel';

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

const PatientUpcomingAppt = () => {
  const theme = useTheme();
  const [take, setTake] = useState(5);
  const [skip, setSkip] = useState(0);
  const [data, setData]: any = useState({
    tableData: [],
    totalRecords: 0,
  });
  const [isLeftEnd, setLeftEnd] = useState(false);
  const upMd = useResponsive('up', 'md');

  const [activeDoctor, setActiveDoctor]: any = useState(null);

  const isEndDisable = data?.tableData?.findIndex((obj: any) => {
    return obj?.id === activeDoctor?.id;
  });

  useEffect(() => {
    if (data?.tableData.length && !activeDoctor) {
      setActiveDoctor(data?.tableData[0]);
    }
  }, [data?.tableData, skip]);

  const [getUpcomming, upcommingResult] = useLazyQuery(QueryPatientIncomingAppt, {
    context: {
      requestTrackerId: 'getUpcomming[gUpcomming]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getUpcomming({
      variables: {
        data: {
          take,
          skip,
        },
      },
    }).then((res) => {
      const { QueryPatientIncomingAppt } = res?.data;
      setData({
        tableData: QueryPatientIncomingAppt?.appointments_data,
        totalRecords: QueryPatientIncomingAppt?.total_records,
      });
    });
  }, [skip, take]);

  const noDataFound = !upcommingResult.loading && !data?.tableData?.length;

  const onIncrement = useCallback(() => {
    getUpcomming({
      variables: {
        data: {
          take,
          skip: skip + 5,
        },
      },
    }).then((res) => {
      const { QueryPatientIncomingAppt } = res?.data;

      setData((prev: any) => {
        return {
          tableData: [...prev?.tableData, ...QueryPatientIncomingAppt?.appointments_data],
          totalRecords: prev?.totalRecords + QueryPatientIncomingAppt?.total_records,
        };
      });
    });
  }, [upcommingResult.data, data?.tableData, data?.totalRecords, skip, take]);

  const doctorName = activeDoctor?.doctorInfo?.EMP_MNAME
    ? `${activeDoctor?.doctorInfo?.EMP_FNAME} ${activeDoctor?.doctorInfo?.EMP_MNAME} ${activeDoctor?.doctorInfo?.EMP_LNAME}`
    : `${activeDoctor?.doctorInfo?.EMP_FNAME} ${activeDoctor?.doctorInfo?.EMP_LNAME}`;

  const doctorTitle = `${activeDoctor?.doctorInfo?.EMP_TITLE}`;

  const doctorClinic = activeDoctor?.clinicInfo?.clinic_name;

  const doctorImage =
    activeDoctor?.doctorInfo?.EMP_ATTACHMENT?.filename?.includes('storage') &&
    activeDoctor?.doctorInfo?.EMP_ATTACHMENT?.filename;

  const changeActiveDoctor = useCallback(
    (row: any) => {
      console.log(row, 'rowwwwwwww');
      setActiveDoctor(row);
    },
    [activeDoctor]
  );

  const handleMove = useCallback(
    (dir: string) => {
      let index = data?.tableData?.findIndex((obj: any) => {
        return obj.id === activeDoctor.id;
      });
      let indexActive: any;

      switch (dir) {
        case 'left':
          if (index !== 0) {
            indexActive = index - 1;
          } else {
            indexActive = 0;
          }
          break;
        case 'right':
          if (index !== data?.totalRecords - 1) {
            indexActive = index + 1;
          } else {
            onIncrement();
          }
          break;
      }

      setActiveDoctor(data?.tableData[indexActive]);
    },
    [data?.tableData, activeDoctor?.id, isLeftEnd, onIncrement, take, skip]
  );

  console.log('dataAppt', data);
  console.log(`${process.env.NEXT_PUBLIC_DOMAIN}/assets/illustrations/doctor.png`);

  const NoDataDetails = (
    <>
      {upMd ? (
        <Box
          rowGap={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            minHeight: '210px',
          }}
        >
          <Typography variant="h5">No Upcoming Appointment</Typography>
          <Button component="a" href={paths.dashboard.appointment.find} variant="contained">
            Book Now!
          </Button>
        </Box>
      ) : (
        <Box
          rowGap={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Grid container spacing={1} sx={{ position: 'relative' }}>
            <Grid item xs={7}>
              <Stack direction="column" sx={{ p: 2 }} spacing={2}>
                <Typography variant="h6">Book and schedule with the nearest Doctor</Typography>
                <Button component="a" href={paths.dashboard.appointment.find} variant="contained">
                  Book Now!
                </Button>
              </Stack>
            </Grid>

            <Stack sx={{ position: 'absolute', right: -25, bottom: 0, top: 20 }}>
              <img
                src="/assets/illustrations/doctorMale.png"
                alt=""
                style={{ width: '260px', height: '300px' }}
              />
            </Stack>
          </Grid>
        </Box>
      )}
    </>
  );

  return (
    <Stack gap={2} sx={{ pb: 3 }}>
      {upMd && (
        <>
          <Typography variant="h5">Your Up-coming Appointments</Typography>

          <Box
            sx={{
              background: '#3156e3',
              p: 2,
              borderRadius: 2,
            }}
          >
            {upcommingResult?.loading ? (
              <UpcomingSkeleton />
            ) : (
              !noDataFound && (
                <Grid container>
                  <Grid
                    sx={{
                      position: 'relative',
                    }}
                    item
                    lg={12}
                  >
                    <Stack sx={{ mb: 1 }} alignItems="center" direction="row" gap={1}>
                      <IconButtonStyle
                        disabled={isEndDisable === 0}
                        onClick={() => handleMove('left')}
                        sx={{ width: 32, height: 32 }}
                      >
                        <Iconify icon="solar:alt-arrow-left-bold" />
                      </IconButtonStyle>
                      <Typography
                        sx={{
                          color: 'white',
                          fontSize: 12,
                        }}
                      >
                        {isEndDisable + 1} / {data?.totalRecords}
                      </Typography>
                      <IconButtonStyle
                        disabled={isEndDisable === data?.totalRecords - 1}
                        onClick={() => handleMove('right')}
                        sx={{ width: 32, height: 32 }}
                      >
                        <Iconify icon="solar:alt-arrow-right-bold" />
                      </IconButtonStyle>
                    </Stack>

                    <Stack gap={2}>
                      <Stack direction="row" gap={{ xs: 1, md: 0 }}>
                        {!upMd &&
                          (doctorImage ? (
                            <Avatar src={doctorImage} />
                          ) : (
                            <Avatar
                              sx={{
                                width: 60,
                                height: 60,
                              }}
                            >
                              {doctorName[0]?.toUpperCase()}
                            </Avatar>
                          ))}
                        <Box>
                          <Typography sx={{ color: 'white' }}>{doctorName}</Typography>
                          <Typography sx={{ color: '#d1d1d1' }}>
                            {doctorTitle} | {doctorClinic}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack gap={1}>
                        <Stack direction="row" gap={2}>
                          <Icon color="white" icon="clarity:calendar-line" fontSize={22} />
                          <Typography sx={{ color: 'white' }}>
                            {dateForAppt(activeDoctor?.date)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" gap={2}>
                          <Icon color="white" icon="teenyicons:clock-outline" fontSize={22} />
                          <Typography sx={{ color: 'white' }}>
                            {formatMilitaryTime(activeDoctor?.time_slot)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    {upMd && (
                      <Image
                        src={doctorImage || '/assets/illustrations/doctorMale.png'}
                        sx={{
                          width: { xs: 100, lg: 150 },
                          height: { xs: 150, lg: 200 },
                          position: 'absolute',
                          borderRadius: 2,
                          right: 0,
                          top: -70,
                          // top: -80
                        }}
                        alt="myImage"
                      />
                    )}
                  </Grid>

                  <Grid xs={12} item lg={12}></Grid>
                </Grid>
              )
            )}
            {noDataFound && NoDataDetails}
          </Box>
        </>
      )}

      {!upMd && (
        <Card
          sx={{
            ...bgGradient({
              color: alpha(theme.palette.primary.darker, 0.8),
              // imgUrl: user?.coverURL,
            }),
            p: 2,
            background: 'url(/assets/background/bg-blueee.jpg)',
            backgroundSize: 'cover',
            height: '300px',
            color: 'common.white',
          }}
        >
          {upcommingResult?.loading ? (
            <UpcomingSkeleton />
          ) : (
            <>
              {noDataFound ? (
                NoDataDetails
              ) : (
                <PatientUpcommingCarousel
                  isLeftEnd={isLeftEnd}
                  handleMove={handleMove}
                  changeActiveDoctor={changeActiveDoctor}
                  total={data?.totalRecords}
                  onIncrement={onIncrement}
                  activeDoctor={activeDoctor}
                  loading={upcommingResult.loading}
                  data={data?.tableData}
                />
              )}
            </>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default PatientUpcomingAppt;
