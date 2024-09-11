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
import { useSettingsContext } from 'src/components/settings';
import VitalChart from '../vital-chart';
import PatientDataController from './_patientDataController';
import FeedsView from '../../feeds/feeds-view';
import { fDate } from '@/utils/format-time';
import VitalChartSmall from '../vital-chart-Small';
import ProfileVitalViewDashboard from '@/sections/profile/vital/view/vital-view-dashboard';

export default function DashboardPatientView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const upMd = useResponsive('up', 'md');
  const theme = useTheme();

  console.log(user,'USERRRRRRRRRR')

  const { allData, chartData, loading } = PatientDataController();

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

  const mergeBp:any = []
  mergeBp.push(BP1Data)
  mergeBp.push(BP2Data)

 
  //   const items: number[] = [5, 6, 7, 5, 7, 12];

  // const loading = false;

  const BPCombinedData = [];

  for (let i = 0; i < chartData.length; i++) {
    const bp1Value = chartData[i]?.bp1 || 0;
    const bp2Value = chartData[i]?.bp2 || 0;
    BPCombinedData.push(bp1Value, bp2Value);
  }

  console.log('mergeBp_____________________', mergeBp);
  console.log('mergeBpCOMBINEDDDD_____________________', BPCombinedData);

  const categories = dataDate?.map((_: any) => `${fDate(_, 'MMM dd')}`);


  return (
    <Grid container spacing={3} sx={{ width: '100%', p: 2 }}>
      <Grid md={12} xs={12}>
        <Card sx={{ p: 1, mb:2 }}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              src={user?.photoURL}
              alt="IMG"
              sx={{
                mx: 'auto',
                width: { xs: 60, md: 128 },
                height: { xs: 60, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            />
            <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
              <Typography>{!user?.firstName ? user?.uname:`${user?.firstName} ${user?.lastName}`}</Typography>
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

            <Stack sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3, mb: -2 }}>
                Allergies
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ p: 3 }}
              >
                {allData?.patientInfo?.allergy?.map((item: any) => (
                  <Chip label={item.allergy} color="primary" sx={{ fontSize: '10px' }} />
                ))}
              </Box>
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ textAlign: 'left', pl: 3, mb: -2 }}>
                Family history
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ p: 3 }}
              >
                {allData?.patientInfo?.family_history?.map((item: any) => (
                  <Chip label={item.family_history} color="primary" sx={{ fontSize: '10px' }} />
                ))}
              </Box>
            </Stack>
          </Stack>
        </Card>
        <Card>
          <ProfileVitalViewDashboard/>
        </Card>
      </Grid>
      <Grid md={12} xs={12}>
        <Grid md={12} xs={12}>
          <Card sx={{ pb: 1, height:{lg:300} }}>
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
              <Stack direction="row" justifyItems="flex-start" alignItems="flex-start" spacing={3}>
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
            <Stack alignItems="flex-start" justifyContent="center" sx={{ width: '100%' }}>
              <Stepper activeStep={allData?.patientInfo?.medication.length} orientation="vertical">
                {allData?.patientInfo?.medication?.map((step: any, index: any) => (
                  <Step key={index}>
                    <StepLabel>{step.medication}</StepLabel>
                  </Step>
                ))}
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
            {HeightData && <Stack>
              <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                Height:
              </Typography>
              <Typography variant="subtitle1">{`${HeightData} Cm`}</Typography>
            </Stack>}
            {weightData && <Stack>
              <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                Weight:
              </Typography>
              <Typography variant="subtitle1">{`${weightData} Kg`}</Typography>
            </Stack>}
            <Stack>

             <VitalChartSmall
                  isSmall={true}
                  title="Body Temperature"
                  subheader=""
                  chart={{
                    data: [{ name: 'Celcius', data: TempData, color:'#FF5630' }],
                  }}
                  loading={loading}
                />
            </Stack>
          

            <Box sx={{ position: 'absolute', top: 0, bottom: 0, right: -10 }}>
              <img
                src="/assets/illustrations/humanBody.png"
                alt=""
                style={{ width: '100%', height: '95%' }}
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
