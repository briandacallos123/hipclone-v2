'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { NexusGenInputs, NexusGenObjects } from 'generated/nexus-typegen';
import {  notification_read, NotificationQueryMerchant } from 'src/libs/gqls/notification';
import { useAuthContext } from '@/auth/hooks'

export default function NotificationControllerMerchant({ isRun }: { isRun: boolean }) {
  const [allData, setAllData]: any = useState([]);

  const [summarize, setSummarize]: any = useState(null);
  const [isLoading, setLoading] = useState(true)
  const [chatLength, setChatLength] = useState([])
  const { user } = useAuthContext()
  const [toRefetch, setToRefetch] = useState(false)

  const [queryFunc, queryResults] = useLazyQuery(NotificationQueryMerchant, {
    context: {
      requestTrackerId: 'queryFuncMerchant[notification_query_merchant]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [readNotif] = useMutation(notification_read, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });




  useEffect(() => {
    if (!isRun) {
      return;
    }
    // setLoading(true)
    queryFunc({
      variables: {
        data: {
          take: 50
        },
      },
    }).then(async (result: any) => {
      const { data } = result;

   
      const { notifData } = data?.NotificationQueryMerchant

  

      // localStorage.setItem('chatCount', JSON.stringify(chatLength))

      if (data) {
        setAllData(notifData);
      }
    }).catch((err) => {
      setLoading(false)
    })


  }, [])




  function modifyData(d: any) {
    const { all, unreadOrders, shortSupply } = d;

    let notificationData:any = [];
    
    all?.forEach((item)=>{
      notificationData.push(item);
    })

  
    return notificationData;

    
    
  }


  const handleReadFunc = useCallback(
    async (model: NexusGenInputs['NotificationUpdate']) => {
      const data: NexusGenInputs['NotificationUpdate'] = {
        // email: model.email,
        id: model?.id,
        statusRead: model?.read,
        conversation_id: model?.conversation_id,
        chat_id: model?.chat_id,
        notifIds: model?.notifIds?.length !== 0 ? [...model?.notifIds?.map((i: any) => Number(i?.id)), model.id] : []
      };
      readNotif({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          await queryResults.refetch()

        })
        .catch((error: any) => {
          console.log(error, 'ERROR SA HANDLE READ FUND')
        });
    },
    []
  );



  return {
    allData, isLoading, summarize, queryResults, handleReadFunc, chatLength
  }
}