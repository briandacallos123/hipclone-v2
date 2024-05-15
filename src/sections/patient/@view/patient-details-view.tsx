'use client';

// @mui
import { useState, useEffect, createContext, useContext } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// _mock
import { _patientList } from 'src/_mock';
// components
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_PROFILE_RECORD, GET_RECORD } from '@/libs/gqls/records';
import { QueryUUID } from '@/libs/gqls/patient';

import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
//
import PatientCarousel from '../patient-carousel';
import PatientCover from '../patient-cover';
import PatientPanel from '../patient-panel';

// ----------------------------------------------------------------------

const ContextData = createContext({});

export const useContextData = () => {
  return useContext(ContextData);
};

export default function PatientDetailsView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { id }: any = params;
  const [item, setItem] = useState<any>([]);

  const [allData, setAllData] = useState(null);
  const [fetchAll, setFetchAll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);


  const [getData, { data, loading }] = useLazyQuery(GET_PROFILE_RECORD, {
    context: {
      requestTrackerId: 'getRecord[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: uuidData } = useQuery(QueryUUID, {
    variables: {
      data: {
        uuid: id,
      },
    },
  });

  const [dataList, setDataList] = useState<any>([]);

  // refetch for cover section
  const [fetchCover, setfetchCover] = useState<any>(false);

  const [getDataList, { data: dataCarousel, loading: carouselLoading }] = useLazyQuery(GET_RECORD, {
    context: {
      requestTrackerId: 'getRecord[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data for dataList
        const resultDataList = await getDataList({
          variables: {
            data: {
              // searchKeyword: filters.name,
            },
          },
        });

        // Extract dataList from resultDataList
        const { data } = resultDataList;
        if (data) {
          const { allRecords } = data;
          setDataList(allRecords?.Records_list || []);
        } else {
          setDataList([]);
        }

        // Fetch data for item
        const resultData = await getData({
          variables: {
            data: {
              uuid: String(id),
            },
          },
        });

        // Extract item from resultData
        const { data: itemData } = resultData;
        if (itemData) {
          const { QueryOneProfile } = itemData;
          setItem(QueryOneProfile?.Records_ByIDs || []);
          setIsLoading(false);
        }
      } catch (error) {
        // Handle errors here, e.g., show an error message to the user
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [getData, getDataList, id]);

  // useEffect(() => {
  //   getDataList({
  //     variables: {
  //       data: {
  //         // searchKeyword: filters.name,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { allRecords } = data;
  //       setDataList(allRecords?.Records_list);
  //     } else {
  //       setDataList([]);
  //     }
  //   });
  // }, [getDataList, id]);

  return (
    <ContextData.Provider
      value={{ allData, setAllData, fetchAll, setFetchAll, fetchCover, setfetchCover}}
    >
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={{ md: 3, xs: 1 }}>
          <PatientCarousel data={dataList} loading={carouselLoading} />

          <PatientCover data={item} loading={isLoading} />

          <PatientPanel id={id && id} data={item} loading={loading} />
        </Stack>
      </Container>
    </ContextData.Provider>
  );
}
