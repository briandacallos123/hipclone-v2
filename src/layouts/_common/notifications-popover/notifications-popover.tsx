'use client';

import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _notifications } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
//
import NotificationItem from './notification-item';
import './notification-animation.css';
import { fTime } from '@/utils/format-time';
import AppointmentDetailsView from '../../../sections/appointment/view/appointment-details-view'
import { ChatView } from '@/sections/chat/view';
import { Skeleton, Table, TableCell, TableRow } from '@mui/material';
import NotificationSkeleton from './NotificationSkeleton';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

function getAvatar(image:any){
  const url = image || '';
  const parts = url.split('public');
  const publicPart = parts[1];

  console.log(publicPart,'???????????')
  return publicPart
}

export default function NotificationsPopover({queryResults, notificationData, isLoading, summarize, handleReadFunc}:any) {
  console.log(notificationData,'______________AWITTTTTTTTTT________________')
  const navigate = useRouter();
  const {user} = useAuthContext()
  // useEffect(() => {
  //   const section: any = document.querySelector('.drawer');
  //   console.log(section,'yay____________')

  //   const ScrollHandle = () => {
  //     console.log('23123');
  //     const bottomScrollPosition = section.scrollHeight - section.scrollTop - section.clientHeight;
  //     if (window.scrollY >= bottomScrollPosition || bottomScrollPosition === window.scrollY) {
  //       alert("UYY@")
        
  //       // queryResults
  //       //   .refetch({
  //       //     skip: Page.current * Take,
  //       //     take: Take,
  //       //     requestType: 'ScrollFetch',
  //       //   })
  //       //   .then(async ({ data }: any) => {
  //       //     const { QueryPosts } = data;
  //       //     if (QueryPosts.length) {
  //       //       Page.current = Page.current += 1;
  //       //     }
  //       //   });
  //     }
  //   };
  //   window.addEventListener('scroll', ScrollHandle);
  //   // if (typeof window !== 'undefined') {
  //   //   if (
  //   //     (!queryResults.loading && section && queryResults?.data?.QueryPosts?.length) ||
  //   //     feedData.length
  //   //   ) {
        
  //   //   }
  //   // }
  //   //prevent memory leak
  //   return () => window.removeEventListener('scroll', ScrollHandle);
  // }, [queryResults.loading]);
  
  const notification_data = notificationData?.map((item:any)=>{
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
      child:item?.children || item?.siblings,
      many_appt:item?.appt_data?.id && item?.children,
      appt_count:item?.appt_count,
      // isPatient:item?.isPatient,
      isPatient:user?.role === "patient",
      is_group_count: item?.group_child?.length && item?.group_child?.length + 1 || 0,
      group_child:item?.group_child || [],
      siblings:item?.siblings?.length && item?.siblings?.length + 1 || 0
      // appt_approved:notificationData?.data?.apprChild?.length && notificationData?.data?.apprChild?.length + 1 ,
      // appt_cancelled:notificationData?.data?.cancelChild?.length && notificationData?.data?.cancelChild?.length + 1,
      // appt_done:notificationData?.data?.doneChild?.length && notificationData?.data?.doneChild?.length + 1
    }
  })
  
  const TABS = [
    {
      value: 'all',
      label: 'All',
      count: summarize?.all,
    },
    {
      value: 'unread',
      label: 'Unread',
      count: summarize?.unread,
    },
  ];

  const openView = useBoolean();


  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const [notifications, setNotifications] = useState(_notifications);

  

  const totalUnRead = summarize?.unread

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <>
      {totalUnRead >= 0 ? <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>:
    <Stack direction="row" alignItems="center" spacing={2}>
        <Skeleton width={80} height={30} />
        <Skeleton width={80} height={30} />
    </Stack>
    }
    </>
  );

  const [viewId, setViewId] = useState(null);
  const [chatView, setChatView] = useState({
    open:false,
    id:null
  })


  const handleCloseChat = useCallback(()=>{
    setChatView({
      open:false,
      id:null
    })
  },[])
 const handleViewRow = useCallback((d:any)=>{
    
  console.log(d,'_____________________________________AWIT_______________________________________________________________________________')
    if(d?.chat_id){
      if(d?.many_chat || (d?.group_child?.length && d?.chat_id) || d?.siblings !== 0){
        navigate.push(paths.dashboard.chat);
   
      }
     else{
      setChatView({
        open:true,
        id:d?.chat_id
      })
     }
    }else{
     
      if(d?.many_appt?.length || (d?.group_child?.length && !d?.chat_id) || d?.siblings !== 0){
        navigate.push(paths.dashboard.root);

      }else{
        setViewId(d)
        openView.onTrue();
      }
    }

    handleReadFunc({
      id:Number(d?.id),
      statusRead:1,
      conversation_id:d?.conversation_id,
      chat_id:d?.chat_id,
      notifIds:d?.child && [...d?.child]
    })
 },[])



  const renderList = (
    <Scrollbar>
      <List disablePadding>
       
        {notification_data.map((notification:any) => (
          <NotificationItem 
          onViewRow={()=>{
            handleViewRow(notification)
          }} 
          handleReadFunc={()=>{
            handleReadFunc({
              id:Number(notification?.id),
              statusRead:1,
              notifIds:notification?.child?.length !== 0 ? [...notification?.child] : []
              
            })
          }} 
          key={notification.id} 
          notification={notification} 
          />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      {chatView?.open && <ChatView closeChat={handleCloseChat} id={chatView?.id} isNotif={chatView?.open} />}
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify
            className={Boolean(totalUnRead) && 'bell'}
            icon="solar:bell-bing-bold-duotone"
            width={24}
          />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
        className="drawer"
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        </Stack>

        <Divider />

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
          <Table>
            {isLoading && !notification_data?.length &&  [...Array(5)].map((_, i) => <NotificationSkeleton key={i} />)}
          </Table>

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button component={RouterLink} href={paths.dashboard.notification} fullWidth size="large">
            View All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}