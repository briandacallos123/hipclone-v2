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
import { _notificationChat } from 'src/_mock';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify/iconify';
import { useCallback, useState } from 'react';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { ChatView } from '../chat/view';
import { Table } from '@mui/material';
import NotificationSkeletons from './notification-skeleton';
import { TableNoData } from '@/components/table';
// import NotificationSkeleton from '@/layouts/_common/notifications-popover/NotificationSkeleton';
// ----------------------------------------------------------------------
function getAvatar(image:any){
  const url = image || '';
  const parts = url.split('public');
  const publicPart = parts[1];

  console.log(image,'???????????')
  return publicPart
}

export default function NotificationChat(
  {data, handleReadFunc, isLoading}:any
) {
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
  const [chatView, setChatView] = useState({
    open:false,
    id:null
  })
  const navigate = useRouter();

  const handleViewRow = useCallback((d:any)=>{
    if(d?.chat_id){
      if(d?.many_chat !== undefined){
        navigate.push(paths.dashboard.chat);
      }
      else{
        setChatView({
          open:true,
          id:d?.chat_id
        })
      }
    }

    handleReadFunc({
      id:Number(d?.id),
      statusRead:1,
      conversation_id:d?.conversation_id,
      chat_id:d?.chat_id,
      notifIds:d?.child && [...d?.child]
    })
  },[]);

  const handleCloseChat = useCallback(()=>{
    setChatView({
      open:false,
      id:null
    })
  },[])

  const notFound = !isLoading && !data?.length;

  return (
   <>
    {chatView?.open && <ChatView closeChat={handleCloseChat} id={chatView?.id} isNotif={chatView?.open} />}
    <Table>
        {isLoading && !notification_data?.length && [...Array(5)].map((_, i) => <NotificationSkeletons key={i} />)}
      </Table>
    <List disablePadding>
      {notification_data.map((notifications:any) => (
        <NotificationItem handleView={()=>{
          handleViewRow(notifications)
        }} key={notifications?.id} notification={notifications} />
      ))}
    </List>

    <TableNoData sx={{width:{sm:200, lg:1000}}} notFound={notFound} />   
   </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: {
    id: string;
    fullName: string;
    createdAt: Date;
    isUnRead: boolean;
    type?: string;
    avatarUrl: string | null;
  };
};

function NotificationItem({ notification, handleView }: any) {
  



  const message = (notification?.group_child?.length && notification?.chat_id && `<p>You've read these ${notification?.is_group_count} messages</p>`) ||
  (notification?.group_child?.length && !notification?.chat_id && `<p>You've read these ${notification?.is_group_count} appointment updates</p>`) ||
  (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  (notification?.many_appt && notification?.isPatient && `<p>You have <strong>${notification?.appt_count} new updates from your appointments</strong></p>`) ||
  (notification?.many_appt && `<p>You have <strong>${notification?.appt_count} pending appointments</strong></p>`) ||
  (notification?.many_chat && `<p>You have <strong>${notification?.chat_count} unread messages</strong></p>`)
  ;

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
            src="/assets/icons/notification/ic_chat.svg"
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

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
        //   <span>has chatted you.</span>
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
          {fToNow(notification?.createdAt)}
        </Stack>
      }
    />
  );

  return (
    <ListItemButton
      onClick={()=>{
        handleView()
      }}
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
    >
      {renderAvatar}

      {renderText}
    </ListItemButton>
  );
}

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

