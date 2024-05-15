'use client';

import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Badge from '@mui/material/Badge';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import DashboardCover from '../dashboard-cover';
import DashboardAppointmentList from '../dashboard-appointment-list';
import DashboardApprovedList from '../dashboard-approved-list';
import DashboardInstruction from '../dashboard-instruction';
import ApprovedController from '../_dashboardAPR-controller';
import FeedsView from '../../feeds/feeds-view';
import DashboardPatientView from './dashboardPatient-view';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  const upMd = useResponsive('up', 'md');

  const { user } = useAuthContext();

  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';
  const isSecretary = user?.role === 'secretary';

  const [currentTab, setCurrentTab] = useState('approval');
  const [isRefetch, setRefetch] = useState(false);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);
  const [totalApt, setTotalApt] = useState<any>();
  const [totalApr, setTotalApr] = useState<any>();

  const {
    table,
    allData,
    tableData,
    tableSummary,
    //
    filters,
    setFilters,
    defaultFilters,
    loading,
  } = ApprovedController();
  // const table = useTable();

  const refetchToday = () => {
    setRefetch(true);
  };
  const notToday = () => {
    setRefetch(false);
  };

  const TABS = [
    {
      value: 'approval',
      label: 'For Approval',
      total: totalApt,
      component: (
        <DashboardAppointmentList
          setTotalApt={setTotalApt}
          refetchToday={refetchToday}
          title="Patients Appointments for Approval"
        />
      ),
    },
    {
      value: 'approved',
      label: `Today's Approved`,
      total: tableSummary,
      component: (
        <DashboardApprovedList
          setTotalApr={setTotalApr}
          title="Today's Approved Appointments"
          table={table}
          allData={allData}
          tableData={tableData}
          tableSummary={tableSummary}
          //
          filters={filters}
          setFilters={setFilters}
          defaultFilters={defaultFilters}
          loading={loading}
        />
      ),
    },
  ];

  
  console.log(user,'_____________________USER__________________')

  const renderDesktop = (
    <>
      <Grid xs={12} md={7}>
        {/* <FeedsView /> */}
        {!isPatient ? (
          <DashboardAppointmentList
            setTotalApt={setTotalApt}
            refetchToday={refetchToday}
            title="Patients Appointments for Approval"
          />
        ) : (
          <FeedsView />
        )}
      </Grid>

      <Grid xs={12} md={5}>
        {!isPatient ? (
          <DashboardApprovedList
            isRefetch={isRefetch}
            setTotalApr={setTotalApr}
            notToday={notToday}
            title="Today's Approved Appointments"
            table={table}
            allData={allData}
            tableData={tableData}
            tableSummary={tableSummary}
            //
            filters={filters}
            setFilters={setFilters}
            defaultFilters={defaultFilters}
            loading={loading}
          />
        ) : (
          <DashboardAppointmentList
            isPatient={isPatient}
            setTotalApt={setTotalApt}
            refetchToday={refetchToday}
            title="Patients Appointments for Approval"
          />
        )}
      </Grid>
    </>
  );

  const renderMobile = (
    <Grid xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          allowScrollButtonsMobile={false}
          sx={{ '.MuiTabs-indicator': { display: 'none' } }}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={
                <Badge badgeContent={tab?.total} color="primary" sx={{ m: 1.3 }}>
                  <Button
                    key={tab.value}
                    variant={(Boolean(tab.value === currentTab) && 'contained') || 'outlined'}
                    sx={{ width: 135, fontSize: '13px' }}
                  >
                    {tab.label}
                  </Button>
                </Badge>
              }
              value={tab.value}
              sx={{ '&:not(:last-of-type)': { m: 0, mr: 1 } }}
            />
          ))}
        </Tabs>
      </Box>

      {TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return (
          isMatched && (
            <Box key={tab.value} sx={{ pt: 3 }}>
              {tab.component}
            </Box>
          )
        );
      })}
    </Grid>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
        {(isDoctor || isSecretary) && (
          <Grid xs={12}>
            <DashboardCover
              uname={user?.username}
              specialty={user?.occupation}
              title={user?.title}
              name={user?.displayName}
              job={user?.occupation}
              email={user?.email}
              avatarUrl={user?.photoURL}
              coverUrl={user?.coverURL}
            />
          </Grid>
        )}
        {upMd && (isDoctor || isSecretary) ? renderDesktop : null}

        {!upMd && (isDoctor || isSecretary) ? renderMobile : null}

        {!isDoctor && !isSecretary && <DashboardPatientView />}
      </Grid>
    </Container>
  );
}
