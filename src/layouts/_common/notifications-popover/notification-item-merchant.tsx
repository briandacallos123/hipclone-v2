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
    group_child?:any;
    is_group_count?:any;
    chat_id?:any;
    siblings?:any;
    isPatient?:any;
  };
  handleReadFunc:void,
  onViewRow:any,
  onReadView:()=>void;
};
export default function NotificationItemMerchant({ notification, onReadView, onViewRow}: NotificationItemProps) {

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
              src={`/assets/${
                (notification?.notification_type === 'order' && 'order.png') ||
                (notification?.notification_type === 'supply' && 'outofsupply.png')
               }`}
              sx={{ width: 24, height: 24 }}
            />
      </Stack>
      
    </ListItemAvatar>
  );

  const message = 
  // order && not read && length is > 1
  (notification?.notification_type === 'order' && !notification?.is_read && notification?.length > 1 && `<p>You have <strong>${notification?.length}</strong> new orders from <strong>${notification?.user}</strong></p>`) ||
 // order && not read && length is equals 1
  (notification?.notification_type === 'order' && !notification?.is_read && notification?.length === 1  && `<p>You have new order from <strong>${notification?.user}</strong></p>`) ||
  // order & already read && length is > 1
  (notification?.notification_type === 'order' && notification?.is_read && notification?.length > 1  && `<p>${notification?.user} made ${notification?.length} orders!</strong></p>`) ||
  // order & already read && length === 1
  (notification?.notification_type === 'order' && notification?.is_read && notification?.length === 1  && `<p>${notification?.user} made an order!</strong></p>`) ||
 
  // supply && not read && length is > 1
  (notification?.notification_type === 'supply' && !notification?.is_read && notification?.length > 1  && `<p><strong>${notification?.length} of your product </strong> are getting out of stock, please review.</p>`) || 
  // supply && not read && length is === 1
  (notification?.notification_type === 'supply' && !notification?.is_read && notification?.length === 1  && `<p><strong>${notification?.medecine[0]?.generic_name}</strong> is getting out of stock.</p>`) || 
// supply && not read && length is === 1
(notification?.notification_type === 'supply' && notification?.is_read && notification?.length === 1  && `<p>${notification?.medecine[0]?.generic_name} already read.</p>`) ||
// supply && already read && length is > 1
(notification?.notification_type === 'supply' && notification?.is_read && notification?.length > 1  && `<p>${notification?.medecine[0]?.generic_name} and ${notification?.length - 1} are short in supplies.</p>`)  
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
          {`${notification?.notification_type.charAt(0).toUpperCase()}${notification?.notification_type.split("").splice(1).join("")}`}
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

     

       {notification?.notification_type === 'order' &&  <Button onClick={()=>{
        onViewRow()
       }} size="small" color="info" variant="outlined">
      
        View Orders
      </Button>}

      {notification?.notification_type === 'order' && !notification?.is_read && <Button onClick={()=>{
          onReadView()
        }} size="small" color="info" variant="outlined">
         Mark as Read
      </Button>}

      {notification?.notification_type === 'supply' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View Supplies
      </Button>}

      {notification?.notification_type === 'supply' && !notification?.is_read && <Button onClick={()=>{
          onReadView()
        }} size="small" color="info" variant="outlined">
         Mark as Read
      </Button>}
      {/* 

   

      {notification?.type === 'done appointment' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View
      </Button>}
      {notification?.type === 'cancelled appointment' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View
      </Button>}
      {!notification?.isUnRead && <Button size="small" variant="outlined" color="warning" onClick={()=>handleReadFunc()}>
         Mark as Read
      </Button>} */}
    </Stack>
  )

  const projectAction = (
    <Stack spacing={2}alignItems="flex-start" sx={{my:1}}>
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
        { projectAction}
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
        textTransform:'capitalize',
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
