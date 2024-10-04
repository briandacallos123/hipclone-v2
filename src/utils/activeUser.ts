import React, {useCallback, useEffect, useState} from 'react'
import { useAuthContext } from '@/auth/hooks';
import { useMutation } from '@apollo/client';
import { USER_LOGOUT } from '@/libs/gqls/users';

const activeUser = () => {
    const [isIdle, setIdle] = useState(false);

    const [userLogout] = useMutation(USER_LOGOUT, {
      context: {
        requestTrackerId: 'Prescription_data[Prescription_data]',
      },
      notifyOnNetworkStatusChange: true,
    });

    console.log(isIdle,'ISIDLEEE____________')

    const {user, socket} = useAuthContext()

    
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'visible') {
    //    setIdle(false)
    //   } else {
    //     setIdle(true)
    //   }
    // };

    // useEffect(() => {
      
    //     document.addEventListener('visibilitychange', handleVisibilityChange);
      
    //     return () => {
    //       // document.removeEventListener('mousemove', setUserActive);
    //       // document.removeEventListener('keydown', setUserActive);
    //       document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    //   }, []);


    //   useEffect(() => {
    //     let timeoutId:any;
    
    //     const updateUserStatus = async () => {
    //       await userLogout({
    //         variables: {
    //           data: {
    //             id: Number(user?.id),
    //             value: isIdle ? 1 : 0,
    //           },
    //         },
    //       });
    //       timeoutId = setTimeout(updateUserStatus, 60000); // 1 minute delay
    //     };
    
    //     timeoutId = setTimeout(updateUserStatus, 60000); // Initial call after 1 minute
    
    //     return () => {
    //       if (timeoutId) {
    //         clearTimeout(timeoutId);
    //       }
    //     };
    //   }, [isIdle, user, userLogout]);

      return null
}

export default activeUser
