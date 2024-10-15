'use client';

import { useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// _mock
import { _imagingList } from 'src/_mock';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
//
import { ImagingListView } from 'src/sections/imaging/view';
import PatientImagingCreateView from './imaging-create-view';
import LoadingButton from '@mui/lab/LoadingButton';
import { DoctorClinicsHistory } from '@/libs/gqls/drprofile';
import { useQuery } from '@apollo/client';

// ----------------------------------------------------------------------

type Props = {
  slug?: any;
  data?: any;
};

export default function PatientImagingListView({ slug, data }: Props) {
  const upMd = useResponsive('up', 'md');
  const [isRefetch, setRefetch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const openCreate = useBoolean();
  const [editData, setEditData] = useState(null);

  const { user } = useAuthContext();

  const [tableData] = useState(_imagingList.filter((_) => _.patientId === slug));
  
  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DoctorClinicsHistory);


  const [clinicData, setclinicData] = useState<any>([]);


  useEffect(()=>{
    if(drClinicData){
      setclinicData(drClinicData?.DoctorClinicsHistory)
    }
  },[drClinicData])

  return (
    <>
      <ImagingListView
        data_slug={slug}
        isRefetch={isRefetch}
        setRefetch={setRefetch}
        editData={editData}
        setEditData={setEditData}
        clinicData={clinicData}
        action={
          upMd ? (
            
            (()=>{
             if(user?.role === 'secretary' || user?.role === 'doctor'){
               if(user?.permissions?.lab_result === 1 && user?.role === 'secretary'){
                 return  <LoadingButton
                 variant="contained"
                 startIcon={<Iconify icon="mingcute:add-line" />}
                 onClick={openCreate.onTrue}
                 loading={isLoading}
                 sx={{ ml: 2, width: 140 }}
               >
                 New Record
               </LoadingButton>
               }
               if(user?.role === 'doctor'){
                return  <LoadingButton
                 variant="contained"
                 startIcon={<Iconify icon="mingcute:add-line" />}
                 onClick={openCreate.onTrue}
                 loading={isLoading}
                 sx={{ ml: 2, width: 140 }}
               >
                 New Record
               </LoadingButton>
               }
             }
            })()
           ) : (
            (()=>{
              if(user?.role === 'secretary' || user?.role === 'doctor'){
                if(user?.permissions?.lab_result === 1 && user?.role === 'secretary'){
                  return  <IconButton onClick={openCreate.onTrue}>
                  <Iconify icon="mingcute:add-line" />
                </IconButton>
                }
                if(user?.role === 'doctor'){
                  return  <IconButton onClick={openCreate.onTrue}>
                  <Iconify icon="mingcute:add-line" />
                </IconButton>
                }
              }
             })()
           )
        }
      />

      <PatientImagingCreateView
        setRefetch={setRefetch}
        editData={editData}
        setLoading={setLoading} 
        isLoading={isLoading}
        clinicData={clinicData}
        open={openCreate.value || editData}
        onClose={()=>{
          openCreate.onFalse()
          setEditData(null)
        }}
        data={data}
      />
    </>
  );
}
