'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {} from 'src/_mock';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import AccountGeneral from '../account-general';
import AccountPortfolio from '../account-portfolio';
import AccountLicenses from '../account-licenses';
import AccountEducation from '../account-education';
import AccountNotifications from '../account-notifications';
import AccountSocialLinks from '../account-social-links';
import AccountInformation from '../account-information';
import AccountHmoList from '../account-hmo-list';

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

export default function UserAccountView() {
  const settings = useSettingsContext();

  const upMd = useResponsive('up', 'md');

  const { user } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  useEffect(()=>{
    let hasStep = localStorage?.getItem('currentStep');
    if(hasStep && hasStep === '4'){
      setCurrentTab('license')
    }else if(hasStep && hasStep === '5'){
      setCurrentTab('education')
    }
  },[])

  const handleChangeTabTuts = () => {
    
  }

  const TABS = [
    {
      value: 'general',
      label: 'General',
      role: ['doctor', 'patient'],
      icon: <Iconify icon="solar:user-circle-bold-duotone" width={24} />,
    },
    // {
    //   value: 'portfolio',
    //   label: 'Portfolio',
    //   role: ['doctor'],
    //   icon: <Iconify icon="solar:folder-2-bold-duotone" width={24} />,
    // },
    {
      value: 'license',
      label: 'Licenses',
      role: ['doctor'],
      icon: <Iconify icon="solar:medal-ribbon-bold-duotone" width={24} />,
    },
    {
      value: 'education',
      label: upMd ? 'Education & Training' : 'Edutcation',
      role: ['doctor'],
      icon: <Iconify icon="solar:square-academic-cap-bold-duotone" width={24} />,
    },
    // {
    //   value: 'notification',
    //   label: 'Notifications',
    //   role: ['doctor'],
    //   icon: <Iconify icon="solar:bell-bold-duotone" width={24} />,
    // },
    // {
    //   value: 'social_link',
    //   label: 'Social Links',
    //   role: ['doctor'],
    //   icon: <Iconify icon="solar:share-bold-duotone" width={24} />,
    // },
    // {
    //   value: 'information',
    //   label: upMd ? 'Employment/Emergency/Physician' : 'Information',
    //   role: ['patient'],
    //   icon: <Iconify icon="solar:user-id-bold-duotone" width={24} />,
    // },
    // {
    //   value: 'hmo',
    //   label: 'HMO',
    //   role: ['patient'],
    //   icon: <Iconify icon="solar:medical-kit-bold-duotone" width={24} />,
    // },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Manage Profile
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

      {currentTab === 'general' && <AccountGeneral handleChangeTabTuts={handleChangeTabTuts} />}

      {/* {currentTab === 'portfolio' && <AccountPortfolio />} */}

      {currentTab === 'license' && <AccountLicenses />}

      {currentTab === 'education' && <AccountEducation />}

      {/* {currentTab === 'notification' && <AccountNotifications />} */}

      {/* {currentTab === 'social_link' && <AccountSocialLinks />} */}

      {/* {currentTab === 'information' && <AccountInformation />} */}

      {/* {currentTab === 'hmo' && <AccountHmoList />} */}
    </Container>
  );
}
