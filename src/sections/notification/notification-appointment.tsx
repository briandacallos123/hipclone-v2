// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// _mock
import { _notificationAppointment } from 'src/_mock';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify/iconify';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { AppointmentDetailsView } from '../appointment/view';
import { useBoolean } from '@/hooks/use-boolean';
import NotificationSkeletons from './notification-skeleton';
import { Table } from '@mui/material';
import { TableNoData } from '@/components/table';
// ----------------------------------------------------------------------

function getAvatar(image:any){
  const url = image || '';
  const parts = url.split('public');
  const publicPart = parts[1];

  console.log(image,'???????????')
  return publicPart
}

export default function NotificationAppointment({data, handleReadFunc, isLoading}:any) {
  const navigate = useRouter();
  const openView = useBoolean();
  const notification_data = data?.map((item:any)=>{
    return{
      userName:item?.user?.name,
      id:item?.id,
      isUnRead:item?.is_read === 1 ? true:false,
      title:item?.notification_content?.content,
      createdAt:item?.created_at,
      avatarUrl:getAvatar(item?.user?.avatarAttachment?.filename),
      type:item?.notification_type_id?.title,
      appt_id: Number(item?.appt_data?.id),
      chat_id:item?.chat_id,
      many_chat:item?.is_many_chat,
      chat_count:item?.chat_length,
      child:item?.children,
      many_appt:item?.appt_data?.id && item?.children,
      appt_count:item?.appt_count,
      isPatient:item?.isPatient,
      is_group_count: item?.group_child?.length && item?.group_child?.length + 1 || 0,
      group_child:item?.group_child || []
      // appt_approved:notificationData?.data?.apprChild?.length && notificationData?.data?.apprChild?.length + 1 ,
      // appt_cancelled:notificationData?.data?.cancelChild?.length && notificationData?.data?.cancelChild?.length + 1,
      // appt_done:notificationData?.data?.doneChild?.length && notificationData?.data?.doneChild?.length + 1
    }
  })
  

  const [viewId, setViewId] = useState(null);

  const handleViewRow = useCallback((d:any)=>{
    
    if(d?.many_apt){
      navigate.push(paths.dashboard.appointment.root);
      return;
    }
    else{
      setViewId(d)
      openView.onTrue();
    }

    handleReadFunc({
      id:Number(d?.id),
      statusRead:1,
      conversation_id:d?.conversation_id,
      chat_id:d?.chat_id,
      notifIds:d?.child && [...d?.child]
    })
  },[])

  
  const notFound = !isLoading && !data?.length;

  return (
    <Stack>
       {viewId && <AppointmentDetailsView
        updateRow={()=>{
          console.log("updatedrow")
        }}
        refetch={()=>{
          console.log("refetech")
        }}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
        notif={true}
      />}

    <List disablePadding>
      <Table>
        {isLoading && !notification_data?.length && [...Array(5)].map((_, i) => <NotificationSkeletons key={i} />)}
      </Table>

      {notification_data?.map((notifications:any) => (
        <NotificationItem handleView={()=>{
          handleViewRow(notifications)
        }} key={notifications?.id} notification={notifications} />
      ))}

       
    </List>
    <TableNoData sx={{width:{sm:200, lg:1000}}} notFound={notFound} /> 
    </Stack>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: {
    id: string;
    fullName: string;
    createdAt: Date;
    isUnRead: boolean;
    type: string;
    avatarUrl: string | null;
  };
};

function NotificationItem({ notification, handleView }: any) {

  console.log(notification,'_________________________________########################_________________________')
  const renderAvatar = (
    <ListItemAvatar>
      {notification?.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          <Box
            component="img"
            src="/assets/icons/notification/ic_file.svg"
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

 
  const message = (notification?.group_child?.length && notification?.chat_id && `<p>You've read these ${notification?.is_group_count} messages</p>`) ||
  (notification?.group_child?.length && !notification?.chat_id && `<p>You've read these ${notification?.is_group_count} appointment updates</p>`) ||
  (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  (notification?.many_appt && notification?.isPatient && `<p>You have <strong>${notification?.appt_count} new updates from your appointments</strong></p>`) ||
  (notification?.many_appt && `<p>You have <strong>${notification?.appt_count} pending appointments</strong></p>`) ||
  (notification?.many_chat && `<p>You have <strong>${notification?.chat_count} unread messages</strong></p>`)
  ;
   

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        reader(message)
        // <Typography
        //   sx={{
        //     typography: 'subtitle2',
        //     '& > span': { typography: 'body2', color: 'text.disabled' },
        //   }}
        // >
        //   {notification.fullName}&nbsp;
        //   <span>{reader(notification.type)}</span>
        // </Typography>
      }
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mt: 0.5,
            typography: 'caption',
            color: 'text.disabled',
          }}
        >
          <Iconify icon="solar:clock-circle-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
          {fToNow(notification.createdAt)}
        </Stack>
      }
    />
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        mb: 0.5,
        alignItems: 'flex-start',
        borderRadius: (theme) => theme.spacing(1),
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={()=>{
        handleView()
      }}
    >
      {renderAvatar}

      {renderText}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

// function reader(data: string) {
//   return (
//     <>
//       {data === 'telemedicine' && 'has booked a telemedicine appointment.'}
//       {data === 'face-to-face' && 'has booked a face-to-face appointment.'}
//     </>
//   );
// }


function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        textTransform:'capitalize',
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
