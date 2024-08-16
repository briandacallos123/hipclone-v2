import { useRef, useState, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import { MultiFilePreview } from 'src/components/upload';

// ----------------------------------------------------------------------

type Props = {
  recipients: any;
  onSendCompose: any;
  onSendMessage: any;
  currentConversationId: any;
  isNotif?:any
};

export default function ChatMessageInput({
  recipients,
  onSendCompose,
  onSendMessage,
  currentConversationId,
  isNotif
}: Props) {



  const router = useRouter();

  const { user, socket } = useAuthContext();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('id');

  const [uploads, setUploads] = useState<(string | File)[]>([
    /* 'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_1.jpg',
    'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_2.docx',
    'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_3.jpg',
    'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_4.jpg',
    'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_5.pdf', */
  ]);

  useEffect(() => {
    if (currentConversationId && !isNotif) {
      router.push(`${paths.dashboard.chat}?id=${currentConversationId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId]);

  const fileRef = useRef<HTMLInputElement>(null);

  const imageRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const handleAttachFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleAttachImage = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, converId: string) => {
      /*   uname: e.uname,
      action: e.name + ' is Typing' + device_used,
      to_group: e.to_group,
      shortname:e.name, */
      const data: any = {
        userId: user?.id,
        uname: user?.username,
        name: user?.firstName,
        to_group: converId,
        shortname: user?.firstName,
      };
      // console.log(converId);
      if (converId) socket.emit('typing', data);

      setMessage(event.target.value);
    },
    [socket, user?.firstName, user?.id, user?.username]
  );

  const handleSend = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (message || uploads) {

          // console.log(message, uploads,'UPLADSSSSSSSSSSSSSS?????????????')
          if (currentConversationId) {
            try {
              onSendMessage(message, uploads);
              setUploads([]);
              if (fileRef.current)
              fileRef.current.value = "";
              if (imageRef.current)
              imageRef.current.value = "";
           
            } catch(e) {
              console.error(e)
            }

          } else {
            try {
              onSendCompose(message, uploads);
              setUploads([]);
              if (fileRef.current)
              fileRef.current.value = "";
              if (imageRef.current)
              imageRef.current.value = "";
            } catch(e) {
              console.error(e)
            }
          }
        }
        setMessage('');
      }
    },
    [currentConversationId, message, onSendCompose, onSendMessage, uploads]
  );

  // Dummy func for storing upload values
  const handleUploadFile = useCallback(
    (acceptedFiles: File[]) => {
      const files = uploads || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      console.log(newFiles,'NEWFILESSSSSSSSSSSSSSS')

      setUploads([...files, ...newFiles]);
    },
    [uploads]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = uploads && uploads?.filter((file) => file !== inputFile);
      setUploads(filtered);
    },
    [uploads]
  );

  return (
    <>
      <Box
        sx={{
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ px: 2, pt: 1 }}>
          <MultiFilePreview files={uploads} thumbnail onRemove={handleRemoveFile} />
        </Box>

        <InputBase
          fullWidth
          value={message}
          onKeyUp={handleSend}
          onChange={(ev) => handleChange(ev, conversationParam)}
          placeholder="Type a message"
          disabled={!recipients.length && !currentConversationId}
          startAdornment={
            <IconButton>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          }
          endAdornment={
            <Stack direction="row" sx={{ flexShrink: 0 }}>
              <IconButton onClick={handleAttachImage}>
                <Iconify icon="solar:gallery-add-bold" />
              </IconButton>
              <IconButton onClick={handleAttachFile}>
                <Iconify icon="eva:attach-2-fill" />
              </IconButton>
              <IconButton>
                <Iconify icon="solar:microphone-bold" />
              </IconButton>
            </Stack>
          }
          sx={{
            px: 1,
            height: 56,
          }}
        />
      </Box>

      <input
        type="file"
        ref={imageRef}
        accept="image/*"
        multiple
        onChange={(e) => handleUploadFile(Array.from((e.target as HTMLInputElement).files ?? []))}
        style={{ display: 'none' }}
      />

      <input
        type="file"
        ref={fileRef}
        accept="text/plain, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf, image/jpeg,"
        multiple
        onChange={(e) => handleUploadFile(Array.from((e.target as HTMLInputElement).files ?? []))}
        style={{ display: 'none' }}
      />
    </>
  );
}
