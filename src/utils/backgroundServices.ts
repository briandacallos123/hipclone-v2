import client from '../../prisma/prismaClient'
import { useState } from 'react';
import { useAuthContext } from '@/auth/hooks';

const BackgroundServices = () => {
    const [isNotOnline, setNotOnline] = useState(false);

    const {user} = useAuthContext();

    const checkUserStatus = async () => {
        // Perform checks to determine if the user is offline but connected to the internet
        // For example, check if there's been recent user activity or use platform-specific APIs
        // Update user status in the database if necessary
    
        try {
            const isOnline = await client.user.findFirst({
                where:{
                    id:Number(user?.id)
                }
            });


            console.log(isOnline,'ONELINE@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

            if(isOnline){
                if(isOnline?.isOnline === 0){
                    setNotOnline(true)
                }
            }

            return true;
    
        } catch (error) {
            console.log(error.message)
        }

      };
      


  return {checkUserStatus, isNotOnline}
}

export default BackgroundServices
