import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
// gqls
import { PATIENT_DATA } from '@/libs/gqls/records';
import { get_note_vitals_user } from '@/libs/gqls/notes/notesVitals';

// hooks
import { useAuthContext } from 'src/auth/hooks';

// components

import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';

export default function PatientDataController() {
  const [allData, setAllData] = useState<any[]>([]);
  const { user } = useAuthContext();

  const [getData, { data, loading }] = useLazyQuery(PATIENT_DATA, {
    context: {
      requestTrackerId: 'getRecord[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    async function fetchData() {
      if (user?.role === 'patient') {
        try {
          // Fetch data for dataList
          // Fetch data for item
          const resultData = await getData({
            variables: {
              data: {
                uuid: String(user?.uuid),
              },
            },
          });

          const { data: itemData } = resultData;
          if (itemData) {
            const { QueryPatientData } = itemData;
            setAllData(QueryPatientData?.Records_ByIDs || []);
          }
        } catch (error) {
          // Handle errors here, e.g., show an error message to the user
          console.error('Error fetching data:', error);
        }
      }
    }

    fetchData();
  }, [getData, user?.role, user?.uuid]);

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
  }, [getDataUser, user?.role, user?.uuid]);
  console.log('chartData', chartData);

  return {
    allData,
    loading,
    chartData,
  };
}
