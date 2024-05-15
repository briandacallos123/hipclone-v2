'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
// _mock
import { _patientList } from 'src/_mock';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import { useParams } from 'src/routes/hook';
//
import { PatientProfileView } from './profile/view';
import { PatientNoteView } from './note/view';
import { PatientImagingView } from './imaging/view';
import { PatientPrescriptionView } from './prescription/view';
import { PatientVitalView } from './vital/view';
import { PatientHistoryView } from './history/view';
import { useAuthContext } from 'src/auth/hooks';


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

type Props = {
  data?: any;
  id?: any;
  loading: any;
};

export default function PatientPanel({ id: uuid, data, loading }: Props) {
  const upMd = useResponsive('up', 'md');

  const params = useParams();
  const [item, setItem] = useState<any>([]);

  useEffect(() => setItem(data), [data]);
  const { id } = params;
  const { user } = useAuthContext();

  

  const mockItem = _patientList.filter(
    (items: any) => items.id === 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'
  )[0];

  const userTab = user?.role === 'secretary' ?  'imaging' : 'profile'

  const [currentTab, setCurrentTab] = useState(userTab);


  

  // useEffect(()=>{
    
  // },[currentTab])

  

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'profile',
      label: 'Medical Profile',
      icon: <Iconify icon="solar:user-bold-duotone" width={24} />,
      role: ['doctor'],
    },
    {
      value: 'note',
      label: 'Medical Note',
      icon: <Iconify icon="solar:document-text-bold-duotone" width={24} />,
       role: ['doctor'],
    },
    {
      value: 'imaging',
      label: 'Lab Imaging',
      icon: <Iconify icon="solar:gallery-bold-duotone" width={24} />,
      role: ['doctor','secretary'],
    },
    {
      value: 'vital',
      label: 'Vital',
      icon: <Iconify icon="solar:pulse-2-bold-duotone" width={24} />,
      role: ['doctor'],
    },
    {
      value: 'prescription',
      label: 'Prescription',
      icon: <Iconify icon="solar:pill-bold-duotone" width={24} sx={{ transform: 'scaleX(-1)' }} />,
      role: ['doctor','secretary'],
    },
    {
      value: 'history',
      label: upMd ? 'Appointment History' : `App't History`,
      icon: <Iconify icon="solar:history-bold-duotone" width={24} />,
       role: ['doctor','secretary'],
    },
  ];

  return (
    <Box>
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
      </Tabs>

      {currentTab === 'profile' && <PatientProfileView id={uuid} data={item} loading={loading} />}

      {currentTab === 'note' && <PatientNoteView slug={item} uuid={uuid}  />}

      {currentTab === 'imaging' && ( <PatientImagingView slug={item?.patientInfo?.userInfo?.uuid} data={item} />)}

      {currentTab === 'vital' && <PatientVitalView items={item} uuid={uuid} />}

      {currentTab === 'prescription' && <PatientPrescriptionView slug={mockItem?.patient.id} />}

      {currentTab === 'history' && <PatientHistoryView slug={item?.patientInfo?.S_ID} />}
    </Box>
  );
}
