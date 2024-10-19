import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
/* import { useMockedUser } from 'src/hooks/use-mocked-user'; */
// types
import { IChatParticipant, IChatMessage } from 'src/types/chat';
// components
import Iconify from 'src/components/iconify';
//
import { useGetMessage } from './hooks';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  participants: IChatParticipant[];
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, participants, onOpenLightbox }: Props) {
  const { user } = useAuthContext();

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: user?.id,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt, lastActivity, attachments, id } = message;


  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${firstName},`} &nbsp;
      {formatDistanceToNowStrict(new Date(lastActivity), {
        addSuffix: true,
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
        ...(hasImage && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {hasImage ? (
        <>
          {body && <Stack
            sx={{
              p: 1.5,
              mb:1,
              minWidth: 48,
              maxWidth: 320,
              borderRadius: 1,
              typography: 'body2',
              bgcolor: 'background.neutral',
              ...(me && {
                color: 'grey.800',
                bgcolor: 'primary.lighter',
              }),

              
            }}
          >  
          {body}
          </Stack>}

          <Stack
            direction="column"
            spacing={1}

          >
            {
              attachments.length && attachments.map((v: any) => (
                <Box
                  component="img"
                  alt="attachment"
                  src={v?.preview}
                  onClick={() => onOpenLightbox(v?.preview) }
                  sx={{
                    minHeight: 220,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                />


              ))
            }
          </Stack>
        </>


      ) : (
        <>
          {body && body}
          <div style={{ position: 'absolute', bottom: 0, right: 5 }}>
            <Iconify icon="ri:check-double-line" width={13} />

            {/* <Iconify icon="ic:outline-check" width={13} /> */}
          </div>
        </>
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  // console.log(avatarUrl,'AVATAR NUNG SENDER')

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 5 }}>
      {!me && <Avatar alt={firstName} src={`/${avatarUrl?.split('/').splice(1).join("/")}`} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems="flex-end">
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
