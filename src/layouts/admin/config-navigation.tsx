"use client"

import { useEffect, useMemo, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import { useAuthContext } from '@/auth/hooks';
// import SvgColor from 'src/components/svg-color';
// import NotificationController from '../_common/notifications-popover/notification-controller';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={name} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('solar:widget-5-bold-duotone'),
  overview: icon('solar:spedometer-max-bold-duotone'),
  notification: icon('solar:bell-bold-duotone'),
  appointment: icon('solar:calendar-add-bold-duotone'),
  chat: icon('solar:chat-round-line-bold-duotone'),
  calendar: icon('solar:calendar-bold-duotone'),
  patient: icon('solar:user-bold-duotone'),
  hmo: icon('solar:medical-kit-bold-duotone'),
  emr: icon('solar:user-id-bold-duotone'),
  record: icon('solar:document-medicine-bold-duotone'),
  prescription: icon('solar:jar-of-pills-bold-duotone'),
  feeds: icon('mdi:newspaper-variant-multiple'),
  orders:icon('fluent-mdl2:activate-orders'),
  store:icon('material-symbols:store'),
  medecine:icon('game-icons:miracle-medecine')
};


// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const [chatVal, setChatVal] = useState(null)

  const setChat = () =>{
   const intervalId = setInterval(()=>{
     const chatNewVal:any = JSON.parse(localStorage.getItem('chatCount'))?.length
      if(!chatVal && chatNewVal !== 0){
        setChatVal(chatNewVal)
      }else if(chatVal && chatVal !== chatNewVal){
        setChatVal(chatNewVal)
      }
    },1000)

    return () => clearInterval(intervalId);
  }

  setChat()



  
  

  const data = useMemo(
    () => [
      {
        subheader: t('HIPS'),
        items: [
          { title: t('Dashboard'), path: paths.admin.dashboard, icon: ICONS.dashboard },
          { title: t('Merchant'), path: paths.admin.merchant.root, icon: ICONS.patient },
       
       
        ],
      },
    ],
    [t, chatVal]
  );

  return data;
}
