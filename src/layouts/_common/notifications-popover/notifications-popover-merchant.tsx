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
import NotificationItemMerchant from './notification-item-merchant';
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

function getAvatar(image: any) {
  const url = image || '';
  const parts = url.split('public');
  const publicPart = parts[1];

  console.log(publicPart, '???????????')
  return publicPart
}

export default function NotificationsPopoverMerchant({handleReadFunc, queryResults, notificationData, summarize, isLoading }: any) {

  const navigate = useRouter();
  const { user } = useAuthContext()

  const [unreadData, setUnreadData] = useState([]);

  useEffect(() => {
    if (notificationData) {
      const data = notificationData?.filter((item) => !item.is_read);
      setUnreadData(data)
    }
  }, [notificationData])


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
      </Tabs> :
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
        </Stack>
      }
    </>
  );

  const [viewId, setViewId] = useState(null);
  const [chatView, setChatView] = useState({
    open: false,
    id: null
  })


  const handleCloseChat = useCallback(() => {
    setChatView({
      open: false,
      id: null
    })
  }, [])

  const handleViewRow = useCallback((d: any) => {

    if (d?.notification_type === 'order') {
      navigate.push(paths.merchant.orders)
    }

    handleReadFunc({
      orderIds:d?.orders?.map((item)=>Number(item?.id))
    })
  }, [])

  const handleReadView = (d) => {
    handleReadFunc({
      orderIds:d?.orders?.map((item)=>Number(item?.id))
    })
  }



  const renderList = (
    <Scrollbar>
      <List disablePadding>

        {currentTab === 'all' &&
          notificationData.map((notification: any) => (
            <NotificationItemMerchant
              onViewRow={() => {
                handleViewRow(notification)
              }}
              onReadView={()=>{
                handleReadView(notification)
              }}
              key={notification.id}
              notification={notification}
            />
          ))
        }

        {currentTab !== 'all' && unreadData?.length !== 0 &&  unreadData?.map((notification: any) => (
          <NotificationItemMerchant
            onViewRow={() => {
              handleViewRow(notification)
            }}
            key={notification.id}
            notification={notification}
          />
        ))}

        {/* {currentTab !== 'all' &&
          notificationData.filter((notification: any) => {
            if (!notification?.is_read) {
              return (
                <NotificationItemMerchant
                onViewRow={() => {
                  handleViewRow(notification)
                }}
                key={notification.id}
                notification={notification}
              />
              )
            }
          })
        } */}
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
          updateRow={() => {
            console.log("updatedrow")
          }}
          refetch={() => {
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
          {isLoading && !notificationData?.length && [...Array(5)].map((_, i) => <NotificationSkeleton key={i} />)}
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
