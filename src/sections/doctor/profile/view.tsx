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
import { } from 'src/_mock';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
// import AccountGeneral from '../account-general';
import AccountGeneral from './account-general';
// import AccountPortfolio from '../account-portfolio';
// import AccountLicenses from '../account-licenses';
// import AccountEducation from '../account-education';
import AccountLicenses from './account-licenses';
import AccountEducation from './account-education';
import { useLazyQuery } from '@apollo/client';
import { QueryUserProfile } from '@/libs/gqls/users';
import { useParams } from 'next/navigation';
import { InvalidDoctor } from '@/sections/error';
import { Skeleton } from '@mui/material';
// import AccountNotifications from '../account-notifications';
// import AccountSocialLinks from '../account-social-links';
// import AccountInformation from '../account-information';
// import AccountHmoList from '../account-hmo-list';

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

    const { id } = useParams()

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const [data, setData]: any = useState(null);
    const [isInvalid, setIsInvalid] = useState(false);

    const [getDoctorProfile, profileResult] = useLazyQuery(QueryUserProfile, {
        context: {
            requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        getDoctorProfile({
            variables: {
                data: {
                    id: Number(id)
                }
            }
        }).then((res) => {
            const { data } = res;
            setData(data?.QueryUserProfile);
            setIsInvalid(data?.QueryUserProfile?.invalid);
        })
    }, [])

    const TABS = [
        {
            value: 'general',
            label: 'General',
            role: ['doctor', 'patient'],
            icon: <Iconify icon="solar:user-circle-bold-duotone" width={24} />,
        },
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
    ];

    if (profileResult.loading) {
        return (
            <Box sx={{
                maxWidth: 900,
                margin: '0 auto',
                pt: 20
            }}>
                <Skeleton width="100%" />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40 }} />

                    <Skeleton width="100%" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40 }} />

                    <Skeleton width="100%" />
                </div>

                <Skeleton width="100%" />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton variant="circular" width={32} height={32} />
                </div>
            </Box>
        )
    }

    if (isInvalid) {
        return <Box>

            <InvalidDoctor />

        </Box>
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'md'}>
            <Box sx={{
                maxWidth: 1200,
                margin: '0 auto',
                pt: 10
            }}>

                <Typography
                    variant="h5"
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                >
                    Doctor's Profile
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

                {currentTab === 'general' && <AccountGeneral dataVal={data} />}

                {currentTab === 'license' && <AccountLicenses dataVal={data} />}

                {currentTab === 'education' && <AccountEducation />}
            </Box>
        </Container>
    );
}
