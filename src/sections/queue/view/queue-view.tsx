'use client';

import { useState, useCallback, useEffect, useContext, createContext } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { useParams } from 'src/routes/hook';
// _mock
import { _hospitals } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
//
import { GET_ONE_Clinic, QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { useLazyQuery, useQuery } from '@apollo/client';
import QueueCover from '../queue-cover';
import QueueApproveListView from './queue-approve-list-view';
import QueueDoneListView from './queue-done-list-view';
import QueueCancelListView from './queue-cancel-list-view';
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

const MyContext = createContext({});

export const useMyContext = () => {
  return useContext(MyContext);
};

export default function QueueView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();
  const params = useParams();
  const [aprTotal, setAprTotal] = useState(0);
  const [doneTotal, setDoneTotal] = useState(0);
  const [cancelTotal, setCancelTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = params;
  const [clinicData, setClinicData] = useState<any>([]);
  const [queueCounts, setQueueCounts]: any = useState(null);
  const [getData, { data, loading }]: any = useLazyQuery(GET_ONE_Clinic);
  
  const {
    data: countData,
    loading: countLoading,
    refetch: refetchTabs,
  }: any = useQuery(QueueReadCountPage, {
    context: {
      requestTrackerId: 'getAppointments[Apt]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      // payload request
      data: {
        uuid: id,
        userType: (() => {
          if (user?.role === 'doctor') return 'doctor';
          return 'secretary';
        })(),
      },
    },
    fetchPolicy: 'no-cache',
  });

  // console.log(user, 'USER@@@@@@@@');

  useEffect(() => {
    if (countData) {
      setQueueCounts(countData?.QueueReadCountPage);
    }
  }, [countData]);

  useEffect(() => {
    getData({
      variables: {
        data: {
          uuid: String(id),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { OneClinic } = data;
        setClinicData(OneClinic);
        setIsLoading(false);
        var myFilters: any = sessionStorage.getItem('defaultFilters');
        // Deserialize the JSON string back to an object
        var retrievedObject = JSON.parse(myFilters);
        let myObj = {
          clinic: { ...OneClinic },
        };

        var objectString = JSON.stringify(myObj);
        sessionStorage.setItem('defaultFilters', objectString);
      }
    });
  }, [getData, id]);

  useEffect(() => {
    if (clinicData) {
      setTimeout(() => {
        var myFilters: any = sessionStorage.getItem('defaultFilters');
        // Deserialize the JSON string back to an object
        var retrievedObject = JSON.parse(myFilters);

        // console.log(retrievedObject, 'yawa');
      }, 5000);
    }
  }, []);
  useEffect(() => {
    const changes = JSON.parse(sessionStorage.getItem('hasChanges'));

    if (changes) {
      refetchTabs()?.then(() => {
        const nextItem = JSON.parse(sessionStorage.getItem('nextItem'));
        const patientView = JSON.parse(sessionStorage.getItem('patientView'));

        if (nextItem) {
          sessionStorage.removeItem('nextItem');
        }
        if (patientView) {
          sessionStorage.removeItem('patientView');
        }
      });
    }
  }, [sessionStorage.getItem('hasChanges')]);

  // const currentItem = _hospitals.filter((hospital) => hospital.id === id)[0];

  const upMd = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('approved');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  console.log(queueCounts?.queueCounts, 'COUNT@@@@@@@');
  const TABS = [
    {
      value: 'approved',
      label: upMd ? `Today's Queue` : 'Queue',
      total: queueCounts?.queueCount || 0,
      icon: <Iconify icon="solar:clipboard-text-bold-duotone" width={24} />,
    },
    {
      value: 'done',
      label: upMd ? `Today's Done` : 'Done',
      total: queueCounts?.queueDone || 0,
      icon: <Iconify icon="solar:check-circle-bold-duotone" width={24} />,
    },
    {
      value: 'cancelled',
      label: upMd ? `Today's Cancelled` : 'Cancelled',
      total: queueCounts?.queueCancelled || 0,
      icon: <Iconify icon="solar:close-circle-bold-duotone" width={24} />,
    },
  ];

  const [cRefetch, setCRefetch]: any = useState('');

  const triggerR = (val: String) => {
    setCRefetch(val);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <QueueCover
        name={clinicData?.clinic_name}
        address={`${clinicData?.location}, ${clinicData?.Province} `}
        avatarUrl={user?.photoURL}
        coverUrl={user?.coverURL}
        isLoading={isLoading}
      />

      <Tabs
        value={currentTab}
        variant={upMd ? 'standard' : 'fullWidth'}
        onChange={handleChangeTab}
        allowScrollButtonsMobile={false}
        sx={{
          my: 3,
          '.MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          ...(!upMd && {
            '.MuiTabs-indicator': { display: 'none' },
          }),
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={
              upMd ? (
                // tab.label
                <Badge
                  badgeContent={tab?.total === 0 ? '0' : tab?.total}
                  color="primary"
                  sx={{ m: 1.3 }}
                >
                  <Typography>{tab.label}</Typography>
                </Badge>
              ) : (
                <Badge  badgeContent={tab?.total === 0 ? '0' : tab?.total} color="primary" sx={{ m: 1.3 }}>
                  <TabStyle key={tab.value} active={Boolean(tab.value === currentTab)}>
                    {tab.icon}
                    <Typography>{tab.label}</Typography>
                  </TabStyle>
                </Badge>
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

      <MyContext.Provider value={{ triggerR, cRefetch, refetchTabs }}>
        {currentTab === 'approved' && <QueueApproveListView setAprTotal={setAprTotal} />}

        {currentTab === 'done' && <QueueDoneListView setDoneTotal={setDoneTotal} />}

        {currentTab === 'cancelled' && <QueueCancelListView setCancelTotal={setCancelTotal} />}
      </MyContext.Provider>
    </Container>
  );
}
