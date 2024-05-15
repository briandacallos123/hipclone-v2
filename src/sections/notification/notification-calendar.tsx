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
import { _notificationCalendar } from 'src/_mock';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

export default function NotificationCalendar() {
  return (
    <List disablePadding>
      {_notificationCalendar.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
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

function NotificationItem({ notification }: NotificationItemProps) {
  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
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
            src="/assets/icons/notification/ic_calendar.svg"
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
        <Typography
          sx={{
            typography: 'subtitle2',
            '& > span': { typography: 'body2', color: 'text.disabled' },
          }}
        >
          {notification.fullName}&nbsp;
          <span>{reader(notification.type)}</span>
        </Typography>
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
    >
      {renderAvatar}

      {renderText}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <>
      {data === 'birthday' && 'has birthday today. Wish them well.'}
      {data === 'appointment' && 'has an appointment today.'}
    </>
  );
}
