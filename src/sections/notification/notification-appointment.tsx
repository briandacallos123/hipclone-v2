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
        {isLoading && [...Array(5)].map((_, i) => <NotificationSkeletons key={i} />)}
      </Table>

      {data?.map((notifications:any) => (
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

  // console.log(notification,'_________________________________########################_________________________')
  const renderAvatar = (
    <ListItemAvatar>
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
          src={`/assets/icons/notification/${(notification?.notification_type === 'approved appointment' && 'ic_file') ||
            (notification?.notification_type === 'done appointment' && 'ic_file') ||
            (notification?.notification_type === 'cancelled appointment' && 'ic_file_deleted') ||
            (notification?.notification_type === 'to approve appointment' && 'ic_file') ||
            (notification?.notification_type === 'delivery' && 'ic_delivery') ||
            (notification?.notification_type === 'sent a message' && 'ic_chat') ||
            (notification?.notification_type === 'sent payment' && 'ic_payment') ||
            (notification?.notification_type === 'reply a message' && 'ic_chat') ||
            (notification?.notification_type === 'post feed' && 'ic_post') ||
            (notification?.notification_type === 'approved order' && 'order') ||
            (notification?.notification_type === 'cancelled order' && 'order') ||
            (notification?.notification_type === 'done order' && 'order') ||
            (notification?.notification_type === 'Your order is waiting for pick up!' && 'order') ||
            (notification?.notification_type === 'Your order is waiting for pick up!' && 'order') ||
            (notification?.notification_type === 'Your order is on its way!' && 'order') ||
            (notification?.notification_type === 'Sorry your order was delivery unsuccessfully!' && 'order') ||
            (notification?.notification_type === 'Your order was delivered!' && 'order')||
            (notification?.notification_type === 'Marked as your appointment as paid!' && 'ic_payment') ||
            (notification?.notification_type === 'created prescription' && 'ic_prescription')
            
            
          }.svg`}
          sx={{ width: 24, height: 24 }}
        />
      </Stack>
    
    </ListItemAvatar>
  );

 
  const message =
    // appointment&& for approval && not read && length is > 1
    (notification?.notification_type === 'to approve appointment' && notification?.length === 1 && `<p>${notification?.user}</strong> book an appointment<strong></p>`) ||


    // appointment&& for approval && not read && length is > 1
    (notification?.notification_type === 'to approve appointment' && notification?.length > 1 && `<p>${notification?.user}</strong> booked ${notification?.length} appointments<strong></p>`) ||


    // appointment&& already approved && not read && length is === 1
    (notification?.notification_type === 'approved appointment' && notification?.length === 1 && `<p>${notification?.user}</strong> already approved your appointment</p>`) ||
    // appointment&& already approved && not read && length is > 1
    (notification?.notification_type === 'approved appointment' && notification?.length > 1 && `<p>${notification?.user}</strong> already approved your ${notification?.length} appointments</p>`) ||
    // chat && already approved && not read && length is > 1
    (notification?.notification_type === 'sent a message' && notification?.length > 1 && `<p>${notification?.user}</strong> sent you ${notification?.length} messages</p>`) ||
    // chat && already approved && not read && length is === 1
    (notification?.notification_type === 'sent a message' && notification?.length === 1 && `<p>${notification?.user}</strong> sent you a message</p>`) ||
    //post feed && length === 1
    (notification?.notification_type === 'post feed' && notification?.length === 1 && `<p>${notification?.user}</strong> have a new post</p>`) ||
    //post feed && length > 1
    (notification?.notification_type === 'post feed' && notification?.length > 1 && `<p>You're missing ${notification?.length} new post by <strong>${notification?.user}</strong></p>`) ||
    //sent payment && length > 1
    (notification?.notification_type === 'sent payment' && notification?.length > 1 && `<p>${notification?.user}</strong> sent ${notification?.length} appointment payments</p>`) ||
    //sent payment && length === 1
    (notification?.notification_type === 'sent payment' && notification?.length === 1 && `<p>${notification?.user}</strong> sent a payment</p>`) ||
    //sent reply && length > 1
    (notification?.notification_type === 'reply a message' && notification?.length > 1 && `<p>${notification?.user}</strong> reply ${notification?.length} new messages</p>`) ||
    //sent reply && length > 1
    (notification?.notification_type === 'reply a message' && notification?.length === 1 && `<p>${notification?.user}</strong> sent a reply message</p>`) ||
    //done appt && length === 1
    (notification?.notification_type === 'done appointment' && notification?.length === 1 && `<p>${notification?.user} (Doctor)</strong> marked your appointment as done!</p>`) ||
    //done appt && length === 1
    (notification?.notification_type === 'done appointment' && notification?.length > 1 && `<p>${notification?.user} (Doctor)</strong> marked your ${notification?.length} appointments as done!</p>`) ||
     //done appt && length === 1
    (notification?.notification_type === 'approved order' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your order as <strong>approved</strong>!</p>`) ||
    //done appt && length > 1
    (notification?.notification_type === 'approved order' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your ${notification?.length} order as <strong>approved</strong>!</p>`) || 
       //done appt && length > 1
    (notification?.notification_type === 'cancelled order' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your order as <strong>cancelled</strong>!</p>`) ||
    (notification?.notification_type === 'cancelled order' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your ${notification?.length} order as <strong>cancelled</strong>!</p>`) ||

    (notification?.notification_type === 'done order' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your order as <strong>done</strong>!</p>`) ||

    (notification?.notification_type === 'done order' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> marked your ${notification?.length} order as <strong>done</strong>!</p>`) ||
    // order, 
    (notification?.notification_type === 'Your order is waiting for pick up!' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> ${notification?.notification_type}</p>`) ||
    // order, length > 1
    (notification?.notification_type === 'Your order is waiting for pick up!' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> Your ${notification?.length} order is waiting for pick up!</p>`) ||
    // order, length > 1
    (notification?.notification_type === 'Your order is on its way!' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> ${notification?.notification_type}</p>`) ||
    // order, length > 1
    (notification?.notification_type === 'Your order is on its way!' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> Your ${notification?.length} are on its way!</p>`)  ||
 // order, length > 1
 (notification?.notification_type === 'Sorry your order was delivery unsuccessfully!' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> Sorry your order wasn't delivered successfully! </p>`) ||
// order, length > 1
(notification?.notification_type === 'Sorry your order was delivery unsuccessfully!' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> Sorry your ${notification?.length} orders was delivered unsuccessfully! </p>`) ||
// order, length > 1
(notification?.notification_type === 'Your order was delivered!' && notification?.length === 1 && `<p><strong>${notification?.user} (Merchant) </strong> ${notification?.notification_type} </p>`) ||
(notification?.notification_type === 'Your order was delivered!' && notification?.length > 1 && `<p><strong>${notification?.user} (Merchant) </strong> Your ${notification?.length} order was delivered! </p>`)  ||

// cancelled, length === 1
(notification?.notification_type === 'cancelled appointment' && notification?.length === 1 && `<p><strong>${notification?.user} (Doctor) </strong>marked your appointment as cancelled! </p>`) ||
(notification?.notification_type === 'cancelled appointment' && notification?.length > 1 && `<p><strong>${notification?.user} (Doctor) </strong>marked your ${notification?.length} appointment as cancelled! </p>`) ||
// doctor's approved patient payment, length === 1
(notification?.notification_type === 'Marked as your appointment as paid!' && notification?.length === 1 && `<p><strong>${notification?.user} (Doctor) </strong>marked your appointment as paid! </p>`) ||
(notification?.notification_type === 'Marked as your appointment as paid!' && notification?.length > 1 && `<p><strong>${notification?.user} (Doctor) </strong>marked your ${notification?.length} appointment as paid! </p>`) || 

(notification?.notification_type === 'created prescription' && notification?.length === 1 && `<p><strong>${notification?.user} (Doctor)</strong created new prescription for you!</p>`) 
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
