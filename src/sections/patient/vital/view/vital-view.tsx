'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { usePathname } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IPatientVital } from 'src/types/patient';
// components
import Iconify from 'src/components/iconify';
//
import { useLazyQuery } from '@apollo/client';
import { get_note_vitals, get_note_vitals_user, get_note_vitals_patient } from '@/libs/gqls/notes/notesVitals';
import { VitalView } from 'src/sections/vital/view';
import PatientVitalCreateView from './vital-create-view';

// ----------------------------------------------------------------------

type Props = {
  items: any;
  uuid: any;
};

export default function PatientVitalView({ items, uuid }: Props) {
  const openCreate = useBoolean();
  // console.log('vitals Data: ', items);
  const { user } = useAuthContext();
  const pathname = usePathname();
  const [isPatient, setIspatient] = useState(true);

  // useEffect(() => {
  //   if (pathname.includes('user')) {
  //     setIspatient(true);
  //   } else {
  //     setIspatient(false);
  //   }
  // }, [pathname]);

  const [chartData, setChartData] = useState<any>([]);
  const [getData, { data, loading, error, refetch }] = useLazyQuery(get_note_vitals_patient, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });
  // for user
  const [
    getDataUser,
    { data: dataUser, loading: userloading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(get_note_vitals_user, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (user?.role === 'doctor') {
      getData({
        variables: {
          data: {
            uuid,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesVitalsPatient } = data;
          setChartData(QueryNotesVitalsPatient?.vitals_data);
        }
      });
    }
  }, [getData, isPatient, user?.role, uuid]);

  const handleRefetch = async () => {
    await refetch({
      variables: {
        data: {
          uuid,
          userType: String(user?.role),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitalsPatient } = data;
        setChartData(QueryNotesVitalsPatient?.vitals_data);
      }
    });
  };

  // ------------------user

  useEffect(() => {
    if (user?.role === 'patient') {
      getDataUser({
        variables: {
          data: {},
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesVitalsUser } = data;
          setChartData(QueryNotesVitalsUser?.vitals_data);
        }
      });
    }
  }, [getDataUser, user?.role]);

  const handleRefetch2 = async () => {
    await userRefetch({
      variables: {
        data: {
          uuid,
          userType: String(user?.role),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitals } = data;
        setChartData(QueryNotesVitals?.vitals_data);
      }
    });
  };

  // console.log('newData: ', chartData);
  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 3 }}>
          <Button
            onClick={openCreate.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Records
          </Button>
        </Stack>

        {chartData && <VitalView items={chartData} loading={loading} />}
      </Box>

      <PatientVitalCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        items={items}
        refetch={handleRefetch}
      />
    </>
  );
}
