"use client"
import React, { useEffect, useState } from 'react'
import { StoreManageView } from '@/sections/store_manage'
import { useLazyQuery } from '@apollo/client';
import { QuerySingleStore } from '@/libs/gqls/store';

const page = ({params}:any) => {
  const {id} = params;

  const [tableData, setTableData] = useState(null)
  
  const [getStoreSingle, singleResult] = useLazyQuery(QuerySingleStore, {
    context: {
        requestTrackerId: 'querySingleStore[SingleStore]',
      },
      notifyOnNetworkStatusChange: true,
  });

  useEffect(()=>{
    getStoreSingle({
        variables: {
          data: {
            id:Number(id)
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
  
        if (data) {
            // console.log(data,'DATA KITAAAAAAAAAAAAAAAAA')
            const {QuerySingleStore} = data;
            setTableData(QuerySingleStore)
        //   const { QueryAllPrescriptionUserQr } = data;
        //   setCurrentItem(QueryAllPrescriptionUserQr?.Prescription_data)
  
        }
      });
  },[singleResult?.data])
  
  return <StoreManageView  singleResult={singleResult} tableData={tableData}/>
  

}

export default page