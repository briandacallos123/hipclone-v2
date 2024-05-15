'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
// types
import { IPatientProfile } from 'src/types/patient';
//
import PatientProfileMedication from '../profile-medication';
import PatientProfileMedical from '../profile-medical';
import PatientProfileAllergy from '../profile-allergy';
import PatientProfileFamily from '../profile-family';
import PatientProfileSmoking from '../profile-smoking';

import { useLazyQuery,useQuery } from '@apollo/client';
import { GET_PROFILE_RECORD } from '@/libs/gqls/records';

// ----------------------------------------------------------------------

type Props = {
  loading: any;
  id: any;
  data: any;
};

export default function PatientProfileView({id, data,  loading: loading1 }: Props) {



  

  
   
    const [item, setItem] = useState<any>([]);
    // console.log("ITEM: ", data)
    // console.log("ITEM2224: ", item)
    const [getData, { data:data1, loading, error ,refetch}] = useLazyQuery(GET_PROFILE_RECORD, {
      context: {
        requestTrackerId: 'getRecord[gREC]',
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    });
  
    
  
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
          const { QueryOneProfile } = data;
          setItem(QueryOneProfile?.Records_ByIDs);
        }
      });
    }, [getData, id]);

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
        rowGap: {md: 3, xs: 0.5},
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
      }}
    >
      <PatientProfileMedication data={data?.patientInfo?.medication || item?.patientInfo?.medication} clientside={data}  loading1={loading1}/> 

      <PatientProfileMedical data={data?.patientInfo?.medicalhistory || item?.patientInfo?.medicalhistory} clientside={data} loading1={loading1} />

      <PatientProfileAllergy data={data?.patientInfo?.allergy || item?.patientInfo?.allergy} clientside={data} loading1={loading1}/>

      <PatientProfileFamily data={data?.patientInfo?.family_history || item?.patientInfo?.family_history} clientside={data} loading1={loading1}/>

      <PatientProfileSmoking data={data?.patientInfo?.smoking || item?.patientInfo?.smoking} clientside={data} loading1={loading1}/>
    </Box>
  );
}
