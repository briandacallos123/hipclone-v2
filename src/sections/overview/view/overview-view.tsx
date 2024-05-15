'use client';

import { useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _appointmentList, _patientList } from 'src/_mock';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings';
//
import DashboardCover from '../../dashboard/dashboard-cover';
import DashboardInstruction from '../../dashboard/dashboard-instruction';
import OverviewWidgetSummary from '../overview-widget-summary';
import OverviewUpcomingAppointment from '../overview-upcoming-appointment';
import OverviewPatientGender from '../overview-patient-gender';
import OverviewAppointmentSummary from '../overview-appointment-summary';
import { useQuery } from '@apollo/client';
import { GetPatientGender } from '../../../libs/gqls/PatientsGender';
import { GetAppointmentGraph } from '../../../libs/gqls/appointment';
import { GetAllTodaysClinic } from '../../../libs/gqls/todaysClinic';
import { GetClinicDataLength, GetAppointmentsLength } from '../../../libs/gqls/todaysClinic';
// ----------------------------------------------------------------------

export default function OverviewView() {
  const settings = useSettingsContext();
  const { data: patientGender, loading, error } = useQuery(GetPatientGender);
  const { data: clinicLength, loading: loadingClinic } = useQuery(GetClinicDataLength);
  const { data: appLength, loading: loadingApp } = useQuery(GetAppointmentsLength);
  const { data: appGraph } = useQuery(GetAppointmentGraph);
  const { data: todaysClinic } = useQuery(GetAllTodaysClinic, {
    variables: {
      data: {
        take: 10,
        skip: 0,
        status: 0,
      },
    },
  });
  // console.log(todaysClinic, 'yawa@@s');
  const { user } = useAuthContext();

  const isDoctor = user?.role === 'doctor';

  const [completedData, setCompletedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);

  // Array of month names

  useEffect(() => {
    if (appGraph?.GetAppointmentGraph?.data) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const completed : any  = [];
      const cancelled : any= [];

      monthNames.forEach((month) => {
        completed.push(appGraph?.GetAppointmentGraph?.data[month]?.approved || 0);
        cancelled.push(appGraph?.GetAppointmentGraph?.data[month]?.cancelled || 0);
      });

      setCompletedData(completed);
      setCancelledData(cancelled);
    }
  }, [appGraph?.GetAppointmentGraph?.data]);

  if (!isDoctor) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <DashboardCover
              name={user?.displayName}
              job={user?.jobTitle}
              email={user?.email}
              avatarUrl={user?.photoURL}
              coverUrl={user?.coverURL}
            />
          </Grid>

          <Grid component={Stack} spacing={3} xs={12} lg={7}>
            <OverviewUpcomingAppointment
              title="Upcoming Appointment"
              data={todaysClinic?.GetAllTodaysClinic?.TodaysClinicType}
            />

            <OverviewAppointmentSummary
              title="Appointment Summary"
              subheader="No. of appointments in a year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                data: [
                  { name: 'Completed', data: completedData },
                  { name: 'Cancelled', data: cancelledData },
                  // { name: 'Completed', data: [10, 91, 69, 62, 49, 51, 35, 41, 10, 43, 74, 123] },
                  // { name: 'Cancelled', data: [45, 77, 99, 88, 77, 56, 13, 34, 10, 53, 21, 154] },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} lg={5}>
            <DashboardInstruction />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <DashboardCover
            name={user?.displayName}
            job={user?.jobTitle}
            email={user?.email}
            avatarUrl={user?.photoURL}
            coverUrl={user?.coverURL}
          />
        </Grid>

        <Grid xs={6} lg={3}>
          <OverviewWidgetSummary
            title="App't Requests"
            isLoading={loadingApp}
            total={
              appLength?.GetAppointmentsLength && appLength?.GetAppointmentsLength?.totalRecords
            }
            color="success"
            path={paths.dashboard.overview.request}
          />
        </Grid>

        <Grid xs={6} lg={3}>
          <OverviewWidgetSummary
            title="Today's Clinic"
            isLoading={loadingClinic}
            total={
              clinicLength?.GetClinicDataLength && clinicLength?.GetClinicDataLength?.totalRecords
            }
            color="info"
            path={paths.dashboard.overview.today}
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <OverviewUpcomingAppointment
            title="Upcoming Appointment"
            data={todaysClinic?.GetAllTodaysClinic?.TodaysClinicType}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <OverviewPatientGender
            title="Patients Gender"
            chart={{
              series: [
                {
                  label: 'Male',
                  value: patientGender?.GetPatientGender
                    ? patientGender?.GetPatientGender?.MaleCount
                    : 0,
                },
                {
                  label: 'Female',
                  value: patientGender?.GetPatientGender
                    ? patientGender?.GetPatientGender?.FemaleCount
                    : 0,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <OverviewAppointmentSummary
            title="Appointment Summary"
            subheader="No. of appointments in a year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              data: [
                { name: 'Completed', data: completedData },
                { name: 'Cancelled', data: cancelledData },
                // { name: 'Completed', data: [10, 91, 69, 62, 49, 51, 35, 41, 10, 43, 74, 123] },
                // { name: 'Cancelled', data: [45, 77, 99, 88, 77, 56, 13, 34, 10, 53, 21, 154] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
