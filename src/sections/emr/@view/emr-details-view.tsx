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
import { QueryAllEMRCarousel, QuerySingleEmr, EMR_PATIENTS } from '@/libs/gqls/emr';

import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
//
import EmrCarousel from '../emr-carousel';
import EmrCover from '../emr-cover';
import EmrPanel from '../emr-panel';

// ----------------------------------------------------------------------
const ContextData = createContext({});

export const useContextData = () => {
  return useContext(ContextData);
};

// ----------------------------------------------------------------------

export default function EmrDetailsView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { id }: any = params;
  const [item, setItem] = useState<any>([]);
  const [allData, setAllData] = useState(null);
  const [fetchAll, setFetchAll] = useState(true);

  // console.log(allData, 'allDataallData');

  // for single
  const [getData, { data, loading }] = useLazyQuery(QuerySingleEmr);

  useEffect(() => {
    getData({
      variables: {
        data: {
          id: Number(id),
        },
      },
    }).then((res) => {
      const { data } = res;

      setItem(data?.QuerySingleEmr);
    });
  }, [id]);

  const [dataList, setDataList] = useState<any>([]);
  const [emrfetchCover, setemrfetchCover] = useState<any>(false);

  // for carousel data
  // const { data: dataCarousel } = useQuery(QueryAllEMRCarousel, {
  //   context: {
  //     requestTrackerId: 'getRecord[gREC]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  //   variables: {
  //     data: {
  //       take: 5,
  //       skip: 0,
  //     },
  //   },
  // });
  // useEffect(() => {
  //   if (dataCarousel?.QueryAllEMRCarousel?.emr_data_field) {
  //     let myData = dataCarousel?.QueryAllEMRCarousel?.emr_data_field;

  //     setDataList(myData);
  //   }
  // }, [dataCarousel?.QueryAllEMRCarousel?.emr_data_field]);
  // console.log(dataList, '1122223&&%%$$');
  const [carouselData, setCarouselData]: any = useState([]);
  const {
    data: listData,
    error,
    loading: listLoading,
    refetch,
  }: any = useQuery(EMR_PATIENTS, {
    context: {
      requestTrackerId: 'emr_data_field[emr_data_field]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        searchKeyWord: '',
      },
    },
  });

  useEffect(() => {
    if (listData) {
      setCarouselData(listData?.QueryAllEMR?.emr_data_carousel);
    }
  }, [listData]);
  // console.log(carouselData, 'yes ma prend');

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       // Fetch data for dataList
  //       const resultDataList = await getDataList({
  //         variables: {
  //           data: {
  //             take: 5,
  //             skip: 0,
  //           },
  //         },
  //       });

  //       // Extract dataList from resultDataList
  //       const { data } = resultDataList;
  //       console.log(data, 'data@@');
  //       // if (data) {
  //       //   const { allRecords } = data;
  //       //   setDataList(allRecords?.Records_list || []);
  //       // } else {
  //       //   setDataList([]);
  //       // }

  //       // // Fetch data for item
  //       // const resultData = await getData({
  //       //   variables: {
  //       //     data: {
  //       //       uuid: String(id),
  //       //     },
  //       //   },
  //       // });

  //       // // Extract item from resultData
  //       // const { data: itemData } = resultData;
  //       // if (itemData) {
  //       //   const { QueryOneProfile } = itemData;
  //       //   setItem(QueryOneProfile?.Records_ByIDs || []);
  //       // }
  //     } catch (error) {
  //       // Handle errors here, e.g., show an error message to the user
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  //   fetchData();
  // }, [id]);

  return (
    <ContextData.Provider
      value={{ allData, setAllData, fetchAll, setFetchAll, emrfetchCover, setemrfetchCover }}
    >
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={{ md: 3, xs: 1 }}>
          <EmrCarousel data={carouselData} loading={listLoading} />

          <EmrCover data={item && item} loading={loading} />

          <EmrPanel id={id && id} data={item} loading={loading} />
        </Stack>
      </Container>
    </ContextData.Provider>
  );
}
