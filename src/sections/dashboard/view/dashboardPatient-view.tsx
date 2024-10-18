/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
// MUI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import VitalChart from '../vital-chart';
import PatientDataController from './_patientDataController';
import FeedsView from '../../feeds/feeds-view';
import { fDate, fDateTime } from '@/utils/format-time';
import VitalChartSmall from '../vital-chart-Small';
import ProfileVitalViewDashboard from '@/sections/profile/vital/view/vital-view-dashboard';
import { Skeleton } from '@mui/material';
import PatientUpcomingAppt from './dashboard-p-upcoming-appt';

export default function DashboardPatientView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const upMd = useResponsive('up', 'md');
  const theme = useTheme();

  const { allData, chartData, loading, getDataResult } = PatientDataController();

  const allChartData: any = Array(6).fill(0); // Initialize allChartData with default values

  if (chartData && chartData.length > 0) {
    allChartData[0] = chartData[0]?.bmi || 0;
    allChartData[1] = chartData[0]?.bp1 || 0;
    allChartData[2] = chartData[0]?.bp2 || 0;
    allChartData[3] = chartData[0]?.spo2 || 0;
    allChartData[4] = chartData[0]?.hr || 0;
    allChartData[5] = chartData[0]?.rr || 0;
  }

  const BMIData = chartData?.map((item: any) => item?.bmi || 0);
  const BP1Data = chartData?.map((item: any) => item?.bp1 || 0);
  const BP2Data = chartData?.map((item: any) => item?.bp2 || 0);
  const OxygenData = chartData?.map((item: any) => item?.spo2 || 0);
  const HeartRateData = chartData?.map((item: any) => item?.hr || 0);
  const RespData = chartData?.map((item: any) => item?.rr || 0);
  const dataDate = chartData?.map((item: any) => item?.date || new Date());
  const TempData = chartData?.map((item: any) => item?.bt || 0);

  const weightData = chartData?.map((item: any) => item?.wt || 0)[0];
  const HeightData = chartData?.map((item: any) => item?.ht || 0)[0];

  const mergeBp: any = [];
  mergeBp.push(BP1Data);
  mergeBp.push(BP2Data);

  const BPCombinedData = [];

  for (let i = 0; i < chartData.length; i++) {
    const bp1Value = chartData[i]?.bp1 || 0;
    const bp2Value = chartData[i]?.bp2 || 0;
    BPCombinedData.push(bp1Value, bp2Value);
  }

  const notFoundAllergy = allData?.patientInfo?.allergy.length <= 0;
  const notFoundHistory = allData?.patientInfo?.family_history.length <= 0;

  const categories = dataDate?.map((_: any) => `${fDate(_, 'MMM dd')}`);

  const isEmptyMedication = allData?.patientInfo?.medication.length <= 0;

  const SkeletonField = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Skeleton variant="rectangular" width={'100%'} height={30} />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Skeleton variant="rectangular" width={'100%'} height={30} />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Skeleton variant="rectangular" width={'100%'} height={30} />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Skeleton variant="rectangular" width={'100%'} height={30} />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Skeleton variant="rectangular" width={'100%'} height={30} />
        </Grid>
      </Grid>
    );
  };
  console.log('user', user);

  return (
    <>
      {!upMd && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            width: '100vw',
            height: '35vh', // Add height or minHeight
          }}
        />
      )}
      <Grid container sx={{ width: '100%', pl: { md: 0, xs: 2 }, zIndex: 2 }} spacing={3}>
        <Grid md={12} xs={12} sx={{ position: 'relative' }}>
          {!upMd && (
            <Stack sx={{ position: 'absolute', zIndex: 3, left: 0, right: 0, top: 25 }}>
              <Avatar
                src={user?.photoURL}
                alt="IMG"
                sx={{
                  mx: 'auto',
                  width: { xs: 200, md: 128 },
                  height: { xs: 200, md: 128 },
                  border: `solid 2px ${theme.palette.common.white}`,
                }}
              />
            </Stack>
          )}
          <Card
            sx={{
              zIndex: 2,
              mt: { md: 0, xs: 15 },
              p: { xs: 1, md: 3 },
              mb: 2,
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Grid gap={{ xs: 2, md: 0 }} alignItems="center" container xs={12} sm={12} lg={6}>
              {upMd && (
                <Grid xs={12} item lg={4}>
                  <Avatar
                    src={user?.photoURL}
                    alt="IMG"
                    sx={{
                      mx: 'auto',
                      width: { xs: 100, md: 128 },
                      height: { xs: 100, md: 128 },
                      border: `solid 2px ${theme.palette.common.white}`,
                    }}
                  />
                </Grid>
              )}

              {upMd && (
                <Grid
                  xs={12}
                  item
                  lg={4}
                  sx={{
                    color: { md: 'black', xs: 'white' },
                    pt: 1,
                  }}
                >
                  <Stack spacing={0.5} textAlign={{ xs: 'center' }}>
                    <Typography>
                      {!user?.firstName ? user?.uname : `${user?.firstName} ${user?.lastName}`}
                    </Typography>
                    <Typography>{user?.occupation}</Typography>
                    <Typography>{`+63${user?.contact}`}</Typography>
                  </Stack>
                </Grid>
              )}

              <Grid xs={12} item lg={4} sx={{ zIndex: 3 }}>
                <Stack
                  spacing={1}
                  sx={{ pl: { xs: 5, md: 0 }, pt: { md: 0, xs: 10 } }}
                  direction="column"
                  alignItems={{ xs: 'flex-start', md: 'flex-start' }}
                >
                  {!upMd && (
                    <>
                      {getDataResult?.loading ? (
                        <Skeleton variant="rectangular" width="60%" height={30} />
                      ) : (
                        <Stack direction="row" gap={1}>
                          <Typography sx={{ color: theme.palette.primary.main }}>Name</Typography>
                          <Typography>
                            {!user?.firstName
                              ? user?.uname
                              : `${user?.firstName} ${user?.lastName}`}
                          </Typography>
                        </Stack>
                      )}

                      {getDataResult?.loading ? (
                        <Skeleton variant="rectangular" width="60%" height={30} />
                      ) : (
                        <Stack direction="row" gap={1}>
                          <Typography sx={{ color: theme.palette.primary.main }}>
                            Contact
                          </Typography>
                          <Typography>{`+63${user?.contact}`}</Typography>
                        </Stack>
                      )}
                    </>
                  )}

                  {getDataResult?.loading ? (
                    <Skeleton variant="rectangular" width="60%" height={30} />
                  ) : (
                    <Stack direction="row" gap={1}>
                      <Typography sx={{ color: theme.palette.primary.main }}>Age</Typography>
                      <Typography>{allData?.patientInfo?.AGE}</Typography>
                    </Stack>
                  )}

                  {getDataResult?.loading ? (
                    <Skeleton variant="rectangular" width="60%" height={30} />
                  ) : (
                    <Stack direction="row" gap={1}>
                      <Typography sx={{ color: theme.palette.primary.main }}>
                        Nationality
                      </Typography>
                      <Typography>{user?.nationality}</Typography>
                    </Stack>
                  )}

                  {getDataResult?.loading ? (
                    <Skeleton variant="rectangular" width="60%" height={30} />
                  ) : (
                    <Stack direction="row" gap={1}>
                      <Typography sx={{ color: theme.palette.primary.main }}>Birth Date</Typography>
                      <Typography>{fDate(allData?.patientInfo?.BDAY)}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>

              {/* allergies & history */}
              <Grid xs={12} lg={12} item sx={{ width: '100%' }}>
                {/* allergy */}
                <Stack sx={{ pt: 2, w: '100%' }}>
                  <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3 }}>
                    Allergies
                  </Typography>
                  {getDataResult?.loading && <SkeletonField />}
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(5, 1fr)',
                    }}
                    sx={{ p: 3 }}
                  >
                    {allData?.patientInfo?.allergy?.map((item: any) => (
                      <Chip label={item.allergy} color="primary" sx={{ fontSize: '10px' }} />
                    ))}

                    {notFoundAllergy && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'grey',
                        }}
                      >
                        No allergies found.
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {/* ewan */}
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3 }}>
                    Family history
                  </Typography>
                  {getDataResult?.loading && <SkeletonField />}
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(5, 1fr)',
                    }}
                    sx={{ p: 3 }}
                  >
                    {allData?.patientInfo?.family_history?.map((item: any) => (
                      <Chip label={item.family_history} color="primary" sx={{ fontSize: '10px' }} />
                    ))}
                    {notFoundHistory && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'grey',
                        }}
                      >
                        No family history found.
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Grid xs={12} sm={12} lg={6}>
              <PatientUpcomingAppt />
            </Grid>
            {/* <Grid sx={{
            width: '100%',
          }} gap={{xs:2, lg:1}} container justifyContent={{xs:'center', lg:"flex-end"}}>
            <Grid lg={2} item>
              <Avatar
                src={user?.photoURL}
                alt="IMG"
                sx={{
                  mx: 'auto',
                  width: { xs: 70, md: 128 },
                  height: { xs: 70, md: 128 },
                  border: `solid 2px ${theme.palette.common.white}`,
                }}
              />
              <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
                <Typography>{!user?.firstName ? user?.uname : `${user?.firstName} ${user?.lastName}`}</Typography>
                <Typography>{user?.occupation}</Typography>
                <Typography>{`+63${user?.contact}`}</Typography>
              </Stack>

              <Stack direction="row" spacing={3} justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme.palette.primary.main }}>Age</Typography>
                  <Typography>{allData?.patientInfo?.AGE}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: theme.palette.primary.main }}>Nationality</Typography>
                  <Typography>{user?.nationality}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: theme.palette.primary.main }}>Birth Date</Typography>
                  <Typography>{allData?.patientInfo?.BDAY}</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid lg={9} item>
              <Stack sx={{ pt: 2 }}>
                <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3, mb: -2 }}>
                  Allergies
                </Typography>
                {getDataResult?.loading && <SkeletonField />}
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(5, 1fr)'
                  }}
                  sx={{ p: 3 }}
                >

                  {allData?.patientInfo?.allergy?.map((item: any) => (
                    <Chip label={item.allergy} color="primary" sx={{ fontSize: '10px' }} />
                  ))}

                  {
                    notFound && <Typography variant="body1" sx={{
                      color: 'grey'
                    }}>No allergies found.</Typography>
                  }

                </Box>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3, mb: -2 }}>
                  Family history
                </Typography>
                {getDataResult?.loading && <SkeletonField />}
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(auto-fit, minmax(150px, 1fr))'
                  }}
                  sx={{ p: 3 }}
                >
                  {allData?.patientInfo?.family_history?.map((item: any) => (
                    <Chip label={item.family_history} color="primary" sx={{ fontSize: '10px' }} />
                  ))}
                     {
                    notFound && <Typography variant="body1" sx={{
                      color: 'grey'
                    }}>No family history found.</Typography>
                  }
                </Box>
              </Stack>
            </Grid>
          </Grid>
           */}
          </Card>

          <Card>
            <ProfileVitalViewDashboard />
          </Card>
        </Grid>

        <Grid md={12} xs={12}>
          <Grid md={12} xs={12}>
            <Card sx={{ pb: 1, height: { lg: 300 } }}>
              <VitalChart
                title=""
                subheader=""
                chart={{
                  categories,
                  data: [
                    { name: 'BP Hg', data: BP2Data },
                    { name: 'BP mm', data: BP1Data },
                    // { name: 'BP mm', data: BPCombinedData },
                    { name: 'Respiratory Rate', data: RespData },
                    { name: 'Heart Rate', data: HeartRateData },
                  ],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  bmiHGValue: `${BP2Data[index]}`,
                  bmiMMValue: `${BP1Data[index]}`,
                  respiratoryRateValue: `${RespData[index]}`,
                  heartRateValue: `${HeartRateData[index]}`,
                  date: dataDate[index],
                }))}
                loading={loading}
              />
              <Grid md={12}>
                <Stack
                  direction="row"
                  justifyItems="flex-start"
                  alignItems="flex-start"
                  spacing={3}
                >
                  {/* <VitalChartSmall
                  isLegend={true}
                  title="Blood Pressure"
                  subheader=""
                  chart={{
                    data: [
                      { name: 'BP Hg', data: BP2Data, color: theme.palette.primary.main },
                      { name: 'BP Mm', data: BP1Data, color: theme.palette.warning.main }
                    ],
                  }}
                  loading={loading}
                /> */}
                  {/* <VitalChartSmall
                  title="Respiratory Rate"
                  subheader=""
                  chart={{
                    data: [
                      { name: 'Bpm', data: HeartRateData, color: theme.palette.primary.light },
                    ],
                  }}
                  loading={loading}
                /> */}
                </Stack>
              </Grid>
            </Card>
          </Grid>
          <Stack
            direction={upMd ? 'row' : 'column'}
            spacing={2}
            justifyContent="space-between"
            sx={{ width: '100%', pt: 3 }}
          >
            <Card sx={{ width: upMd ? '70%' : '100%', p: 3 }}>
              <CardHeader title="Medication" />
              <Stack
                alignItems={!isEmptyMedication ? 'center' : 'flex-start'}
                justifyContent="center"
                sx={{ width: '100%' }}
              >
                <Stepper
                  activeStep={allData?.patientInfo?.medication.length}
                  orientation="vertical"
                >
                  {!isEmptyMedication ? (
                    <>
                      {allData?.patientInfo?.medication?.map((step: any, index: any) => (
                        <Step key={index}>
                          <StepLabel>{step.medication}</StepLabel>
                        </Step>
                      ))}
                    </>
                  ) : (
                    <Stack>
                      <EmptyContent
                        title="No Medication Data"
                        sx={{
                          '& span.MuiBox-root': { height: 160 },
                        }}
                      />
                    </Stack>
                  )}
                </Stepper>
              </Stack>
            </Card>
            <Card sx={{ width: '100%', p: 3 }}>
              <Stack>
                <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                  blood type:
                </Typography>
                <Typography variant="subtitle1">
                  {reader(allData?.patientInfo?.BLOOD_TYPE)}
                </Typography>
              </Stack>
              {HeightData && (
                <Stack>
                  <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                    Height:
                  </Typography>
                  <Typography variant="subtitle1">{`${HeightData} Cm`}</Typography>
                </Stack>
              )}
              {weightData && (
                <Stack>
                  <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                    Weight:
                  </Typography>
                  <Typography variant="subtitle1">{`${weightData} Kg`}</Typography>
                </Stack>
              )}
              <Stack>
                <VitalChartSmall
                  isSmall={true}
                  title="Body Temperature"
                  subheader=""
                  chart={{
                    data: [{ name: 'Celcius', data: TempData, color: '#FF5630' }],
                  }}
                  loading={loading}
                />
              </Stack>

              <Box sx={{ position: 'absolute', top: 2, bottom: 0, right: upMd ? -10 : -60 }}>
                <img
                  src="/assets/illustrations/humanBody.png"
                  alt=""
                  style={{ width: upMd ? '100%' : '80%', height: '95%' }}
                />
              </Box>
            </Card>
          </Stack>
        </Grid>
        <Grid md={12} xs={12} sx={{ pt: 2 }}>
          <Card sx={{ p: 2 }}>
            <CardHeader title="Health Bites" sx={{ pb: 1 }} />
            <FeedsView />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

function reader(data: number) {
  return (
    <>
      {data === 1 && 'AB+'}
      {data === 2 && 'AB+'}
      {data === 3 && 'A+'}
      {data === 4 && 'A-'}
      {data === 5 && 'B+'}
      {data === 6 && 'B-'}
      {data === 7 && 'O+'}
      {data === 8 && 'O-'}
    </>
  );
}
