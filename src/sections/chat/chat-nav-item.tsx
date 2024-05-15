import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// hooks
/* import { useMockedUser } from 'src/hooks/use-mocked-user'; */
// types
import { IChatConversation } from 'src/types/chat';
//
import { useGetNavItem } from './hooks';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onClickConversation: VoidFunction;
  conversation: IChatConversation;
};

export default function ChatNavItem({
  selected,
  collapse,
  conversation,
  onClickConversation,
}: Props) {
  const { user, socket } = useAuthContext();



  const {
    group,
    unreadCount,
    displayName,
    displayText,
    participants,
    lastActivity,
    hasOnlineInGroup,
  } = useGetNavItem({ conversation, currentUserId: user?.id });

  const [hpart, sethpart] = useState<any>(participants || [])

  const singleParticipant = hpart[0];

  const { name, avatarUrl, status } = singleParticipant;

  useEffect(() => {
    if (socket?.connected) {
      socket.on('get online users', (u: any) => {

        u.map((a: any) => {
          sethpart((prev: any) => {
            prev = prev.map((n: any) => {
              if (String(n.id) === String(a.id))
                n = { ...n, status: "online" }

              return n;
            })

            return prev;
          })
          return u
        })

      })

      socket.on('islogout', (u: any) => {
        sethpart((prev: any) => {
          prev = prev.map((n: any) => {
            if (String(n.id) === String(u.id))
              n = { ...n, status: "offline" }

            return n;
          })

          return prev;
        })
      })
    }
    return () => {
      socket.off('get online users')
      socket.off('islogout')
    }
  }, [])

  const renderGroup = (
    <Badge
      variant={hasOnlineInGroup ? 'online' : 'invisible'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {hpart.slice(0, 2).map((participant: any) => (
          <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
        ))}
      </AvatarGroup>
    </Badge>
  );

  const renderSingle = (
    <Badge key={hpart[0]?.status} variant={hpart[0]?.status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={hpart[0]?.name} src={hpart[0]?.avatarUrl} sx={{ width: 48, height: 48 }} />
    </Badge>
  );
  const tmp = formatDistanceToNowStrict(new Date(lastActivity), {
    addSuffix: false,
  });
  const formatTime =
    tmp.includes('0 seconds') || tmp.includes('1 seconds') ? `${tmp.split(' ')[0]} second` : tmp;
  return (
    <ListItemButton
      disableGutters
      onClick={onClickConversation}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <Badge color="error" overlap="circular" badgeContent={collapse ? unreadCount : 0}>
        {group ? renderGroup : renderSingle}
      </Badge>

      {!collapse && (
        <>
          <ListItemText
            sx={{ ml: 2 }}
            primary={displayName}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={displayText}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: unreadCount ? 'subtitle2' : 'body2',
              color: unreadCount ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {formatTime}
            </Typography>

            {!!unreadCount && (
              <Box sx={{ width: 8, height: 8, bgcolor: 'info.main', borderRadius: '50%' }} />
            )}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}
