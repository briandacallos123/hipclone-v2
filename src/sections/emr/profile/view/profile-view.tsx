'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
// types
//
import EmrProfileMedication from '../profile-medication';
import EmrProfileMedical from '../profile-medical';
import EmrProfileAllergy from '../profile-allergy';
import EmrProfileFamily from '../profile-family';
import EmrProfileSmoking from '../profile-smoking';

import { useQuery } from '@apollo/client';
import { GET_PROFILE_RECORD } from '@/libs/gqls/records';

// ----------------------------------------------------------------------

type Props = {
  id: any;
  data: any;
  loading: any;
};

export default function EmrProfileView({ id, data, loading: loading1 }: Props) {
  const [item, setItem] = useState<any>([]);
  // console.log("ITEM: ", data)
  // console.log("ITEM2224: ", item)
  const {
    data: data1,
    loading,
    error,
    refetch,
  } = useQuery(GET_PROFILE_RECORD, {
    context: {
      requestTrackerId: 'getRecord[gREC]',
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        uuid: String(id),
      },
    },
  });

  useEffect(() => {
    if (data1) {
      const { data } = data1;
      if (data) {
        const { QueryOneProfile } = data;
        setItem(QueryOneProfile?.Records_ByIDs);
      }
    }
  }, [data1]);

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         uuid: String(id),
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { QueryOneProfile } = data;
  //       setItem(QueryOneProfile?.Records_ByIDs);
  //     }
  //   });
  // }, [getData, id]);

  ////////////////////////////////

  // const [item, setItem] = useState<any>([]);
  // useEffect(() => {
  //   setItem(data);
  // }, [data, setItem]);

  return (
    <Box
      sx={{
        display: 'grid',
        columnGap: 2,
        rowGap: { md: 3, xs: 0.5 },
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
      }}
    >
      <EmrProfileMedication
        data={data?.patientInfo?.medication || item?.patientInfo?.medication}
        clientside={data}
        loading={loading1}
      />

      <EmrProfileMedical
        data={data?.patientInfo?.medicalhistory || item?.patientInfo?.medicalhistory}
        clientside={data}
        loading={loading1}
      />

      <EmrProfileAllergy
        data={data?.patientInfo?.allergy || item?.patientInfo?.allergy}
        clientside={data}
        loading={loading1}
      />

      <EmrProfileFamily
        data={data?.patientInfo?.family_history || item?.patientInfo?.family_history}
        clientside={data}
        loading={loading1}
      />

      <EmrProfileSmoking
        data={data?.patientInfo?.smoking || item?.patientInfo?.smoking}
        clientside={data}
        loading={loading1}
      />
    </Box>
  );
}
