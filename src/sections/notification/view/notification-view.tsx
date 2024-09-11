'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import NotificationAppointment from '../notification-appointment';
import NotificationChat from '../notification-chat';
import NotificationPatient from '../notification-patient';
import NotificationEmr from '../notification-emr';
import NotificationImaging from '../notification-imaging';
import NotificationController from '@/layouts/_common/notifications-popover/notification-controller';

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

export default function NotificationView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const {allData, handleReadFunc, isLoading, queryResults} = NotificationController({isRun:true})

  const upMd = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('appointment');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);



  const TABS = [
    {
      value: 'appointment',
      label: 'Appointments',
      icon: <Iconify icon="solar:calendar-add-bold-duotone" width={24} />,
      role: ['doctor', 'patient'],
    },
    {
      value: 'chat',
      label: 'Chat',
      icon: <Iconify icon="solar:chat-round-line-bold-duotone" width={24} />,
      role: ['doctor', 'patient'],
    },
    // {
    //   value: 'patient',
    //   label: 'Patient',
    //   icon: <Iconify icon="solar:user-bold-duotone" width={24} />,
    //   role: ['doctor'],
    // },
    // {
    //   value: 'emr',
    //   label: 'My EMR',
    //   icon: <Iconify icon="solar:user-id-bold-duotone" width={24} />,
    //   role: ['doctor'],
    // },
    // {
    //   value: 'imaging',
    //   label: upMd ? 'Laboratory & Imaging' : 'Lab Imaging',
    //   icon: <Iconify icon="solar:gallery-bold-duotone" width={24} />,
    //   role: ['doctor', 'patient'],
    // },
  ];

  const [apptData, setApptData] = useState([]);
  const [chatData, setChatData] = useState([]);

  // useEffect(()=>{
  //   const appt = allData?.filter((item:any)=>item?.appt_data?.id);
  //   setApptData(appt);

  //   const chat = allData?.filter((item:any)=>item?.chat_id);
  //   setChatData(chat);
  // },[allData])

  console.log(allData,'___________________________________????????')
  // console.log(chatData,'___________________________________!!!!!!!!!!')
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        All Notifications
      </Typography>

      {/* <Tabs
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
        {TABS.filter((tab) => tab.role.includes(user?.role)).map((tab) => (
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
        ))}
      </Tabs> */}

<NotificationAppointment isLoading={queryResults.loading} handleReadFunc={handleReadFunc} data={allData}/>

      {/* {currentTab === 'appointment' && }

      {currentTab === 'chat' && <NotificationChat isLoading={isLoading} handleReadFunc={handleReadFunc} data={chatData}/>} */}

      {/* {currentTab === 'patient' && <NotificationPatient />}

      {currentTab === 'emr' && <NotificationEmr />}

      {currentTab === 'imaging' && <NotificationImaging />} */}
    </Container>
  );
}
