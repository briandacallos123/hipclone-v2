'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// hooks
import { useParams, usePathname } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
// types
// components
import Iconify from 'src/components/iconify';
//
import { useLazyQuery } from '@apollo/client';
import { get_note_vitals, get_note_vitals_patient_emr } from '@/libs/gqls/notes/notesVitals';
import { VitalView } from 'src/sections/vital/view';
import EmrVitalCreateView from './vital-create-view';
import VitalCreateNewSingle from '@/sections/profile/vital/view/vital-create-new-single';
import { useAuthContext } from '@/auth/hooks';
import { GetAllVitalCategories, QueryAllVitalData } from '@/libs/gqls/vitals';
import VitalCreateNew from '@/sections/profile/vital/view/vital-create-new';

// ----------------------------------------------------------------------

type Props = {
  items: any;
  uuid: any;
};

export default function EmrVitalView({ items, uuid }: Props) {
  const openCreate = useBoolean();
  // console.log('vitals Data: ', items);
  const [take, setTake] = useState(100);

  const {id} = useParams()

  const pathname = usePathname();

  const isEmr = pathname.includes('my-emr')

  const { user } = useAuthContext();

  const [isPatient, setIspatient] = useState(true);

  const [addCategory, setAddCategory] = useState([])

  useEffect(() => {
    if (pathname.includes('user')) {
      setIspatient(true);
    } else {
      setIspatient(false);
    }
  }, [pathname]);

  const [
    getVitalsData,
    vitalsResult,
  ] = useLazyQuery(GetAllVitalCategories, {
    context: {
      requestTrackerId: 'getVitalsCategory[getRecVitals]',
    },
    notifyOnNetworkStatusChange: true,
  });


  useEffect(() => {
    getVitalsData({
      variables: {
        data: {
          uuid,
          isEmr
        }
      }
    }).then(async (res: any) => {
      const { data } = res;
      if (data) {
        const { QueryAllCategory } = data;
        setAddCategory(QueryAllCategory?.dataList)
      }
    })
  }, [vitalsResult.data])

  console.log(addCategory,'addCategory')

  const [chartData, setChartData] = useState<any>([]);
  
  const [getData, getDataResult] = useLazyQuery(get_note_vitals_patient_emr, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const loading = getDataResult.loading;



  useEffect(() => {
    getData({
      variables: {
        data: {
          patientID: Number(items?.patientInfo?.S_ID),
          emrID: Number(uuid),
          take
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitalsEMRPatient } = data;
        setChartData(QueryNotesVitalsEMRPatient?.vitals_data);
      }
    });
  }, [getData, items?.patientInfo?.S_ID, uuid, getDataResult.data]);

  const [
    getVitalDataDynamic,
    vitalDataResults,
  ] = useLazyQuery(QueryAllVitalData, {
    context: {
      requestTrackerId: 'getVitalsDynamicData[getDynamicVitals]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [chart2Data, setChart2Data] = useState([]);

  useEffect(() => {
    getVitalDataDynamic({
      variables: {
        data: {
          uuid,
          isEmr
        },
      },
    }).then(async (result: any) => {
      const { data } = result;

      if (data) {
        const { QueryAllVitalData } = data;
        setChart2Data(QueryAllVitalData?.listData);
      }
    });
  }, [vitalDataResults.data, user?.role, user?.uuid]);

  const refetch = () => {
    getDataResult.refetch();
    vitalDataResults.refetch()

  }

  // const handleRefetch = async () => {
  //   await refetch({
  //     variables: {
  //       data: {
  //         patientID: items?.patientInfo?.S_ID,
  //         emrID: Number(uuid),
  //         isPatient,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { QueryNotesVitalsEMRPatient } = data;
  //       setChartData(QueryNotesVitalsEMRPatient?.vitals_data);
  //     }
  //   });
  // };

  const openCreateVital = useBoolean();

  const openVitalCategory = () => {
    openCreateVital.onTrue()
  }

  const report_ID = chartData[0]?.report_id;

  const [singleData, setSingleData] = useState(null);

  const openCreateSingle = useBoolean();

  const openVitalSingle = (props:any) => {
    setSingleData(props)
    openCreateSingle.onTrue()
  }

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

        {chartData && <VitalView items2={chart2Data}  refetch={refetch} openSingle={openVitalSingle} items={chartData} loading={loading} />}
      </Box>

      <VitalCreateNew
        open={openCreateVital.value}
        onClose={openCreateVital.onFalse}
        refetch={() => {
          refetch()
          vitalsResult.refetch()
        }}
        uuid={id}
        items={chartData}
        addedCategory={addCategory}
        user={user}
      />

      <VitalCreateNewSingle
        open={openCreateSingle.value}
        onClose={openCreateSingle.onFalse}
        refetch={() => {
          // vitalDataResults.refetch()
          // dataResults.refetch()
          vitalsResult.refetch()
          getDataResult.refetch()
          vitalDataResults.refetch()
        }}
        items={chartData}
        addedCategory={addCategory}
        openCategory={openVitalCategory}
        data={singleData}
        user={user}
      />

      <EmrVitalCreateView
        open={openCreate.value}
        onClose={openCreate.onFalse}
        items={items}
        repID={report_ID}
        addedCategory={addCategory}
        
        refetch={() => {
          // vitalDataResults.refetch()
          // dataResults.refetch()
          // vitalsResult.refetch()
          vitalDataResults.refetch()
          getDataResult.refetch()
        }}
        openCategory={openVitalCategory}

      />
    </>
  );
}
