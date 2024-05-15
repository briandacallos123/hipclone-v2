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
          { title: t('Homes'), path: paths.dashboard.root, icon: ICONS.dashboard },
          // { title: t('overview'), path: paths.dashboard.overview.root, icon: ICONS.overview },
          // remove temporary
          // {
          //   title: t('notification'),
          //   path: paths.dashboard.notification,
          //   icon: ICONS.notification,
          // },
          {
            title: t('Health Bites'),
            path: paths.dashboard.feeds,
            icon: ICONS.feeds,
            // roles: ['doctor', 'secretary'],
            roles: ['doctor', 'patient'],
            
          },
          {
            title: t('My Doctors'),
            path: paths.dashboard.myDoctors.root,
            icon: ICONS.feeds,
            // roles: ['doctor', 'secretary'],
            roles: [ 'patient'],
          },
          {
            title: t('appointment'),
            path: paths.dashboard.appointment.root,
            icon: ICONS.appointment,
          },
          {
            title: t('queue'),
            path: paths.dashboard.queuePatient.root,
            icon: ICONS.appointment,
            roles: ['patient'],
          },
          { title: t('chat'), path: paths.dashboard.chat, icon: ICONS.chat, value:chatVal !== 0 && chatVal },
          {
            title: t('calendar'),
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
            roles: ['doctor', 'patient', 'secretary'],
          },
          {
            title: t('patient'),
            path: paths.dashboard.patient.root,
            icon: ICONS.patient,
            // roles: ['doctor'],
            roles: ['doctor', 'secretary'],
          },
          // {
          //   title: t('HMO claim'),
          //   path: paths.dashboard.hmo,
          //   icon: ICONS.hmo,
          //   roles: ['doctor', 'secretary'],
          // },
          {
            title: t('EMR'),
            path: paths.dashboard.emr.root,
            icon: ICONS.emr,
            // roles: ['doctor', 'secretary'],
            roles: ['doctor','secretary'],
          },
          {
            title: t('medical record'),
            path: paths.dashboard.user.profile,
            icon: ICONS.record,
            roles: ['patient'],
          },
          {
            title: t('prescription'),
            path: paths.dashboard.prescription,
            icon: ICONS.prescription,
            roles: ['patient'],
          },
        ],
      },
    ],
    [t, chatVal]
  );

  return data;
}
