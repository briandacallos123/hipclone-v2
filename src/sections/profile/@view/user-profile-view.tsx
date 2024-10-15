'use client';

import { useState, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import { _userRecord } from 'src/_mock';
// hooks
// import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import useNotesHooks from '@/sections/note/_notesHooks';
import { NoteListView } from '@/sections/note/view';
import ProfileImagingListView from '../imaging/view/imaging-list-view';
import ProfileVitalView from '../vital/view/vital-view';
import ProfileHistoryListView from '../history/view/history-list-view';
// import {reInitialize}
// ----------------------------------------------------------------------

type TabStyleProps = {
  active: boolean;
};

const TabStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TabStyleProps>(({ active, theme }) => ({
  position: 'relative',
  width: 82,
  height: 70,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  '.MuiTypography-root': {
    fontSize: '10px',
    marginTop: theme.spacing(0.5),
  },
  transition: theme.transitions.create(['all'], {
    duration: theme.transitions.duration.standard,
  }),
  ...(active && {
    color: theme.palette.common.white,
    background: theme.palette.primary.main,
  }),
}));

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();
  const upMd = useResponsive('up', 'md');
  
  

  // const { user } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('note');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);
  const [payloads, setPayloads] = useState<any>({});
  const {
    data: medData,
    loading: medLoad,
    refetch,
    tableData1,
    totalData,
    Ids,
    isLoading,
    notesRecordResult,
    clinicData,
    patientLoading
  } = useNotesHooks(payloads);

  const TABS = [
    {
      value: 'note',
      label: 'Medical Note',
      icon: <Iconify icon="solar:document-text-bold-duotone" width={24} />,
    },
    {
      value: 'imaging',
      label: 'Lab Imaging',
      icon: <Iconify icon="solar:gallery-bold-duotone" width={24} />,
    },
    {
      value: 'vital',
      label: 'Vital',
      icon: <Iconify icon="solar:pulse-2-bold-duotone" width={24} />,
    },
    {
      value: 'history',
      label: upMd ? 'Appointment History' : `App't History`,
      icon: <Iconify icon="solar:history-bold-duotone" width={24} />,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Medical Records
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        allowScrollButtonsMobile={false}
        sx={{
          mb: 3,
          '.MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          ...(!upMd && {
            '.MuiTabs-indicator': { display: 'none' },
          }),
        }}
      >
        {TABS.map(
          (
            tab // .filter((tab) => tab.role.includes(user?.role))
          ) => (
            <Tab
              key={tab.value}
              label={
                upMd ? (
                  tab.label
                ) : (
                  <TabStyle key={tab.value} active={Boolean(tab.value === currentTab)}>
                    {tab.icon}
                    <Typography>{tab.label}</Typography>
                  </TabStyle>
                )
              }
              icon={upMd ? tab.icon : ''}
              value={tab.value}
              sx={{
                color: 'primary.main',
                ...(!upMd && {
                  '&:not(:last-of-type)': { mr: 1 },
                }),
              }}
            />
          )
        )}
      </Tabs>
      {/* user medical notes reference */}

      {currentTab === 'note' && (
        <NoteListView
          setPayloads={setPayloads}
          data={medData}
          loading={isLoading}
          refetch={refetch}
          clinicData={clinicData}
          tableData1={tableData1}
          totalData={totalData}
          Ids={Ids}
          notesRecordResult={notesRecordResult}
          patientLoading={patientLoading}
        />
      )}

      {currentTab === 'imaging' && <ProfileImagingListView data={_userRecord.imaging} />}

      {currentTab === 'vital' && <ProfileVitalView data={_userRecord.vital} />}

      {currentTab === 'history' && <ProfileHistoryListView data={_userRecord.history} />}
    </Container>
  );
}
