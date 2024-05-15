'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// hooks
import { useAuthContext } from 'src/auth/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IPatientVital } from 'src/types/patient';
// components
import Iconify from 'src/components/iconify';
// prisma

import { useLazyQuery } from '@apollo/client';
import { get_note_vitals_user } from '@/libs/gqls/notes/notesVitals';
//
import { VitalView } from 'src/sections/vital/view';
import ProfileVitalCreateView from './vital-create-view';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function ProfileVitalView({ data }: Props) {
  const openCreate = useBoolean();
  const { user } = useAuthContext();
  const [chartData, setChartData] = useState<any>([]);

  // console.log('@@@@', user);
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
    if (user?.role === 'patient') {
      getDataUser({
        variables: {
          data: {
            uuid: String(user.uuid),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesVitalsUser } = data;
          setChartData(QueryNotesVitalsUser?.vitals_data);
        }
      });
    }
  }, [getDataUser, user?.role, user.uuid]);

  const handleRefetch2 = async () => {
    await userRefetch({
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
  };
  // patient user vital
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

        {chartData && <VitalView items={chartData} loading={userloading} />}
      </Box>

      <ProfileVitalCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        refetch={handleRefetch2}
        items={chartData}
        user={user}
      />
    </>
  );
}
