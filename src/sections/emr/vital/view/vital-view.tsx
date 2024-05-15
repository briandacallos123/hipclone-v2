'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// hooks
import { usePathname } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
// types
// components
import Iconify from 'src/components/iconify';
//
import { useLazyQuery } from '@apollo/client';
import { get_note_vitals, get_note_vitals_patient_emr } from '@/libs/gqls/notes/notesVitals';
import { VitalView } from 'src/sections/vital/view';
import EmrVitalCreateView from './vital-create-view';

// ----------------------------------------------------------------------

type Props = {
  items: any;
  uuid: any;
};

export default function EmrVitalView({ items, uuid }: Props) {
  const openCreate = useBoolean();
  // console.log('vitals Data: ', items);

  const pathname = usePathname();
  const [isPatient, setIspatient] = useState(true);

  useEffect(() => {
    if (pathname.includes('user')) {
      setIspatient(true);
    } else {
      setIspatient(false);
    }
  }, [pathname]);

  const [chartData, setChartData] = useState<any>([]);
  const [getData, { data, loading, error, refetch }] = useLazyQuery(get_note_vitals_patient_emr, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getData({
      variables: {
        data: {
          patientID: Number(items?.patientInfo?.S_ID),
          emrID: Number(uuid),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitalsEMRPatient } = data;
        setChartData(QueryNotesVitalsEMRPatient?.vitals_data);
      }
    });
  }, [getData, items?.patientInfo?.S_ID, uuid]);

  const handleRefetch = async () => {
    await refetch({
      variables: {
        data: {
          patientID: items?.patientInfo?.S_ID,
          emrID: Number(uuid),
          isPatient,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitalsEMRPatient } = data;
        setChartData(QueryNotesVitalsEMRPatient?.vitals_data);
      }
    });
  };

  const report_ID = chartData[0]?.report_id;
  // console.log('newData2: ', report_ID);
  // console.log('newData2: ', chartData);
  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 3 }}>
          <Button
            onClick={openCreate.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Record
          </Button>
        </Stack>

        {chartData && <VitalView items={chartData} loading={loading} />}
      </Box>

      <EmrVitalCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        items={items}
        repID={report_ID}
        refetch={handleRefetch}
      />
    </>
  );
}
