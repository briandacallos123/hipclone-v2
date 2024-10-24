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
import VitalCreateNew from './vital-create-new';
import {GetAllVitalCategories, QueryAllVitalData} from '@/libs/gqls/vitals'
import VitalCreateNewSingle from './vital-create-new-single';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function   ProfileVitalView({ data }: Props) {
  const openCreate = useBoolean();
  const openCreateVital = useBoolean();
  const openCreateSingle = useBoolean();

  const { user } = useAuthContext();
  const [chartData, setChartData] = useState<any>([]);
  const [chart2Data, setChart2Data] = useState([]);
  const [addCategory, setAddCategory] = useState([])

  const [take, setTake] = useState(100)

  // console.log('@@@@', user);
  const [
    getDataUser,
    dateResult
    // { data: dataUser, loading: userloading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(get_note_vitals_user, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [
    getVitalDataDynamic,
    vitalDataResults,
  ] = useLazyQuery(QueryAllVitalData, {
    context: {
      requestTrackerId: 'getVitalsDynamicData[getDynamicVitals]',
    },
    notifyOnNetworkStatusChange: true,
  });


  const [
    getVitalsData,
    vitalsResult,
  ] = useLazyQuery(GetAllVitalCategories, {
    context: {
      requestTrackerId: 'getVitalsCategory[getRecVitals]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(()=>{
    getVitalsData().then(async(res:any)=>{
      const {data} = res;
      if(data){ 
        const {QueryAllCategory} = data;
        setAddCategory(QueryAllCategory?.dataList)
      }
    })
  },[vitalsResult.data])

  useEffect(() => {
    if (user?.role === 'patient') {
      getVitalDataDynamic({
        variables: {
          data: {
            uuid: null,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
    
        if (data) {
          const { QueryAllVitalData } = data;
          setChart2Data(QueryAllVitalData?.listData);
        }
      });
    }
  }, [vitalDataResults.data, user?.role, user?.uuid]);

  useEffect(() => {
    if (user?.role === 'patient') {
      getDataUser({
        variables: {
          data: {
            uuid: String(user.uuid),
            take
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
  }, [dateResult.data, user?.role, user.uuid]);

  
  const openVitalCategory = () => {
    openCreateVital.onTrue()
  }

  const [singleData, setSingleData] = useState(null);

  const openVitalSingle = (props:any) => {
    setSingleData(props)
    openCreateSingle.onTrue()

  }

  return (
    <>
      <Box>
        <Stack  gap={1} direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 3}}>
          <Button
            onClick={openCreate.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Records
          </Button>
        
        </Stack>

        {chartData && <VitalView openSingle={openVitalSingle} items2={chart2Data} items={chartData} loading={dateResult.loading} />}
      </Box>

      <ProfileVitalCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        refetch={()=>{
          dateResult.refetch()
          vitalDataResults.refetch()
        }}
        items={chartData}
        addedCategory={addCategory}
        openCategory={openVitalCategory}
        user={user}
      />
       <VitalCreateNewSingle
        open={openCreateSingle.value}
        onClose={openCreateSingle.onFalse}
        refetch={()=>{
          dateResult.refetch()
          vitalDataResults.refetch()
        }}
        items={chartData}
        addedCategory={addCategory}
        openCategory={openVitalCategory}
        data={singleData}
        user={user}
      />

      <VitalCreateNew

        open={openCreateVital.value}
        onClose={openCreateVital.onFalse}
        refetch={()=>{
          vitalsResult.refetch()
        }}
        items={chartData}
        addedCategory={addCategory}
        user={user}
      />
    </>
  );
}
