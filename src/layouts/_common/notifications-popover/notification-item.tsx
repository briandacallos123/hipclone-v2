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
  onViewRow:any
};
export default function NotificationItem({ notification,handleReadFunc, onViewRow }: NotificationItemProps) {
  console.log(notification,'HOY@@@@@')
  // const renderAvatar = (
  //   <ListItemAvatar>
  //       <Box
  //     component="img"
  //     src={`/assets/icons/notification/${
  //       (notification?.type === 'order' && 'ic_order') ||
  //       (notification?.type === 'sent a message' && 'ic_chat') ||
  //       (notification?.type === 'approved appointment' && 'ic_file') ||
  //       (notification?.type === 'done appointment' && 'ic_file') ||
  //       (notification?.type === 'cancelled appointment' && 'ic_file_deleted') ||
        
  //       (notification?.type === 'to approve appointment' && 'ic_file') ||
  //       (notification?.type === 'delivery' && 'ic_delivery')
  //     }.svg`}
  //     sx={{ width: 24, height: 24 }}
  //   />
  //   </ListItemAvatar>
  // )
  const renderAvatar = (
    <ListItemAvatar>
      {(notification.avatarUrl && !notification?.group_child?.length && !notification?.many_appt && !notification?.many_chat)  ? (
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
              src={`/assets/icons/notification/${
                (notification?.type === 'order' && 'ic_order') ||
                (notification?.type === 'sent a message' && 'ic_chat') ||
                (notification?.type === 'approved appointment' && 'ic_file') ||
                (notification?.type === 'done appointment' && 'ic_file') ||
                (notification?.type === 'cancelled appointment' && 'ic_file_deleted') ||
                
                (notification?.type === 'to approve appointment' && 'ic_file') ||
                (notification?.type === 'delivery' && 'ic_delivery')
              }.svg`}
              sx={{ width: 24, height: 24 }}
            />
      </Stack>
      )}
    </ListItemAvatar>
  );

  const message =
  (notification?.child?.length && notification?.isPatient   && `<p>You have <strong>${notification?.child?.length + 1} new updates from your appointments</strong></p>`) ||
  (notification?.many_appt && notification?.isPatient && `<p>You have <strong>${notification?.appt_count} new updates from your appointments</strong></p>`) ||
  (notification?.siblings !== 0 && notification?.appt_id && `<p><strong>${notification?.userName}</strong> have ${notification?.siblings} booking appointments</p>`) ||
   (notification?.siblings !== 0 && notification?.chat_id && `<p><strong>${notification?.userName}</strong> sent ${notification?.siblings} messages</p>`) ||
  (notification?.group_child?.length && notification?.chat_id && `<p>You've read these ${notification?.is_group_count} messages</p>`) ||
  (notification?.group_child?.length && !notification?.chat_id && `<p>You've read these ${notification?.is_group_count} appointment updates</p>`) ||
  (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  (!notification?.many_chat && !notification?.many_appt && `<p><strong>${notification?.userName} </strong>${notification?.title}</p>`) ||
  (notification?.many_appt && `<p>You have <strong>${notification?.appt_count} pending appointments</strong></p>`) ||
  (notification?.many_chat && `<p>You have <strong>${notification?.chat_count} unread messages</strong></p>`)
  ;
   
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
          {fToNow(notification.createdAt)}
          {notification?.category}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.isUnRead && (
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

     

       {notification?.type === 'to approve appointment' &&  <Button onClick={()=>{
        onViewRow()
       }} size="small" color="info" variant="outlined">
      
        View Appointment
      </Button>}

        {/* {notification?.type === 'send a message' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View
      </Button>} */}

      {notification?.type === 'approved appointment' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View
      </Button>}

      {notification?.type === 'sent a message' &&  <Button onClick={()=>{
          onViewRow()
        }} size="small" color="info" variant="outlined">
         View Message
      </Button>}

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
      </Button>}
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
        {/* {notification?.chat_id && projectAction} */}
        { projectAction}
        {btnContainer}
        {/* {notification?.type === 'to approve appointment' && appointment}
        {notification?.type === 'cancelled appointment' && appointmentCancelled}
        {notification?.type === 'done appointment' && doneAppointment}
        {notification?.type === 'labResult' && labResult}
        {notification?.type === 'vitals' && vitals}
        {notification?.type === 'payment' && paymentAction} */}
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
