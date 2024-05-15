import { useAuthContext } from "@/auth/hooks";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {Get_User_Status} from '@/libs/gqls/userStatus'


export default function beamsClient() {
  const { user } = useAuthContext();
  // const [isNotOnline, setNotOnline] = useState(false);

  // console.log(isNotOnline,'??????_______________??????______________??????');

  // const [getData, { data, loading }] = useLazyQuery(Get_User_Status, {
  //   context: {
  //     requestTrackerId: 'getRecord[gREC]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // useEffect(()=>{
  //   (async()=>{
  //     try {
  //       const resultData = await getData({
  //         variables: {
  //           data: {
  //             id:Number(user?.id)
  //           },
  //         },
  //       });
  //       const {data} = resultData;

  //       if(data?.Get_User_Status?.isOnline === 0){
          
  //         setNotOnline(true)
  //       }
        
  //     } catch (error) {
        
  //     }
  //   })()
  // },[])

  useEffect(() => {

    // console.log(isNotOnline,'BEFORE_____________________')
    // if(!isNotOnline) return ;

    (async () => {
      const newClient = new PusherPushNotifications.Client({
        instanceId: "f81d984d-91e1-4f42-ac9f-23f57be65cd5"
      });

      if (user){
        newClient
          .start()
          .then((res:any) => newClient.getDeviceId())
          .then((deviceId:any) =>
            console.log("Successfully registered with Beams. Device ID:_________", deviceId)
          )
          .then(() => newClient.addDeviceInterest("general"))
          .then(() => {
            newClient.addDeviceInterest(`forOnly_${user?.id}`);
          })
          .catch(console.error);

      }

      return () => newClient.stop()
        .then(() => console.log('Beams SDK has been stopped'))
        .catch(e => console.error('Could not stop Beams SDK', e));
    })()
  }, [user])

}