// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: {
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    isUnRead: boolean;
    type: string;
    avatarUrl?: string | null;
    group_child?: any;
    is_group_count?: any;
    chat_id?: any;
    siblings?: any;
    isPatient?: any;
  };
  handleReadFunc: void,
  onViewRow: any,
  onReadView: () => void;
};
export default function NotificationItemFinal({ notification, onReadView, onViewRow }: NotificationItemProps) {

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
      {/* {(notification.avatarUrl && !notification?.group_child?.length && !notification?.many_appt && !notification?.many_chat)  ? (
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
              src={`/assets/${
                (notification?.notification_type === 'order' && 'order.png') ||
                (notification?.notification_type === 'supply' && 'outofsupply.png')
               }`}
              sx={{ width: 24, height: 24 }}
            />
      </Stack>
      )} */}
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


    //   (notification?.notification_type === 'order' && !notification?.is_read && notification?.length > 1 && `<p>You have <strong>${notification?.length}</strong> new orders from <strong>${notification?.user}</strong></p>`) ||
  //  // order && not read && length is equals 1
  //   (notification?.notification_type === 'order' && !notification?.is_read && notification?.length === 1  && `<p>You have new order from <strong>${notification?.user}</strong></p>`) ||
  //   // order & already read && length is > 1
  //   (notification?.notification_type === 'order' && notification?.is_read && notification?.length > 1  && `<p>${notification?.user} made ${notification?.length} orders!</strong></p>`) ||
  //   // order & already read && length === 1
  //   (notification?.notification_type === 'order' && notification?.is_read && notification?.length === 1  && `<p>${notification?.user} made an order!</strong></p>`) ||

  //   // supply && not read && length is > 1
  //   (notification?.notification_type === 'supply' && !notification?.is_read && notification?.length > 1  && `<p><strong>${notification?.length} of your product </strong> are getting out of stock, please review.</p>`) || 
  //   // supply && not read && length is === 1
  //   (notification?.notification_type === 'supply' && !notification?.is_read && notification?.length === 1  && `<p><strong>${notification?.medecine[0]?.generic_name}</strong> is getting out of stock.</p>`) || 
  // // supply && not read && length is === 1
  // (notification?.notification_type === 'supply' && notification?.is_read && notification?.length === 1  && `<p>${notification?.medecine[0]?.generic_name} already read.</p>`) ||
  // // supply && already read && length is > 1
  // (notification?.notification_type === 'supply' && notification?.is_read && notification?.length > 1  && `<p>${notification?.medecine[0]?.generic_name} and ${notification?.length - 1} are short in supplies.</p>`)  
  // (notification?.child?.length && notification?.isPatient   && `<p>You have <strong>${notification?.child?.length + 1} new updates from your appointments</strong></p>`) ||
  // (notification?.many_appt && notification?.isPatient && `<p>You have <strong>${notification?.appt_count} new updates from your appointments</strong></p>`) ||
  // (notification?.siblings !== 0 && notification?.appt_id && `<p><strong>${notification?.userName}</strong> have ${notification?.siblings} booking appointments</p>`) ||
  //  (notification?.siblings !== 0 && notification?.chat_id && `<p><strong>${notification?.userName}</strong> sent ${notification?.siblings} messages</p>`) ||
  // (notification?.group_child?.length && notification?.chat_id && `<p>You've read these ${notification?.is_group_count} messages</p>`) ||
  // (notification?.group_child?.length && !notification?.chat_id && `<p>You've read these ${notification?.is_group_count} appointment updates</p>`) ||
  // (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  // (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  // (notification?.many_appt && `<p>You have <strong>${notification?.appt_count} pending appointments</strong></p>`) ||
  // (notification?.many_chat && `<p>You have <strong>${notification?.chat_count} unread messages</strong></p>`)
  // ;

  // (!notification?.many_chat ? `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`:`<p>You have <strong>${notification?.chat_count} unread messages</strong></p>`)



  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(message)}
      // primary={reader(`${notification?.userName} ${notification.title}`)}
      // notification
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }}
            />
          }
        >
          {/* {fToNow(notification.createdAt)} */}
          {/* {`${notification?.notification_type.charAt(0).toUpperCase()}${notification?.notification_type.split("").splice(1).join("")}`} */}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.is_read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const appointment = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Approve
      </Button>
      <Button size="small" variant="outlined">
        Cancel
      </Button>
    </Stack>
  );

  const appointmentApproved = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        View
      </Button>
    </Stack>
  );

  const appointmentCancelled = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        View
      </Button>
    </Stack>
  );

  const doneAppointment = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        View
      </Button>
    </Stack>
  );

  const btnContainer = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>



      {notification?.notification_type === 'approved appointment' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}

      {notification?.notification_type === 'to approve appointment' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}

      
      {notification?.notification_type === 'sent payment' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}



     
      {notification?.notification_type === 'reply a message' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}


     


      {notification?.notification_type === 'sent a message' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View Message
      </Button>}

      {notification?.notification_type === 'done appointment' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}
      {notification?.notification_type === 'cancelled appointment' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}

      {notification?.notification_type === 'post feed' && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}
      {(notification?.notification_type === 'approved order' ||notification?.notification_type === 'cancelled order' ||notification?.notification_type === 'done order' ) && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}


      {(notification?.notification_type === 'Your order was delivered!' ||notification?.notification_type === 'Sorry your order was delivery unsuccessfully!' ||notification?.notification_type === 'Your order is on its way!' || notification?.notification_type === 'Your order is waiting for pick up!' )  && <Button onClick={() => {
        onViewRow()
      }} size="small" color="info" variant="outlined">
        View
      </Button>}


      {!notification?.is_read && <Button size="small" variant="outlined" color="warning" onClick={onReadView}>
        Mark as Read
      </Button>}
    </Stack>
  )

  const projectAction = (
    <Stack spacing={2} alignItems="flex-start" sx={{ my: 1 }}>
      {/* {notification.avatarUrl ? (
          <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
        ):
        <Box
            component="img"
            src={`/assets/icons/components/ic_avatar.svg`}
            sx={{ width: 30, height: 30 }}
          />
        } */}
      {/* <Stack  direction="row" spacing={1}>
        {notification.avatarUrl ? (
          <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
        ):
        <Box
            component="img"
            src={`/assets/icons/components/ic_avatar.svg`}
            sx={{ width: 30, height: 30 }}
          />
        }

        <Box sx={{display:'flex',flexDirection:'column'}}>
          {notification?.conversation?.slice(0,5)?.map((item:any)=>(
            <Typography component="small" color="gray" sx={{fontSize:'.8rem'}}>
              {item?.body}
            </Typography>
          ))}
        </Box>
      </Stack>
    

     <Stack direction="row" alignItems="center" spacing={1}>
        <TextField
            sx={{
              borderRadius: 1.5,
              color: 'text.secondary',
              bgcolor: 'background.neutral',
              p:1
          }}
          placeholder='Send a message...'
          /> 
          
        <Box
      component="img"
      src={`/assets/icons/notification/ic_send.svg`}>

      </Box>
     </Stack> */}
    </Stack>
  );

  const labResult = (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <FileThumbnail
        file="http://localhost:8080/httpsdesign-suriname-2015.mp3"
        sx={{ width: 40, height: 40 }}
      />

      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} flexGrow={1} sx={{ minWidth: 0 }}>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }} noWrap>
              design-suriname-2015.mp3
            </Typography>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.disabled' }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  }}
                />
              }
            >
              <span>2.3 GB</span>
              <span>30 min ago</span>
            </Stack>
          }
        />

        <Button size="small" variant="outlined">
          Download
        </Button>
      </Stack>
    </Stack>
  );

  const vitals = (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Weight
      </Label>
      <Label variant="outlined" color="warning">
        Height
      </Label>
      <Label variant="outlined">Blood Pressure</Label>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {/* { projectAction}
        */}
        {btnContainer}

      </Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        textTransform: 'capitalize',
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
