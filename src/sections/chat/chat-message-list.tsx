// @mui
import Box from '@mui/material/Box';
// types
import { IChatParticipant, IChatMessage } from 'src/types/chat';
// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';

// ----------------------------------------------------------------------

type Props = {
  messages: IChatMessage[];
  participants: IChatParticipant[];
};

export default function ChatMessageList({ messages, participants }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);
  const slides = messages
    .filter((message: any) => message?.contentType === 'image')
    .map((message: any) => ({ src: message.body }));


  let allSlides : any = [];
  const _slides = messages
  .filter((message: any) => message?.contentType === 'image')
  .map((message: any) => {
      return message.attachments
      .map((m:any) => {
        allSlides.push({
          src: m?.preview
        })
        return {
           src : m?.preview
        }
     })
  });


  const lightbox = useLightBox(allSlides);

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
     
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={(event) => lightbox.onOpen(event)}
            />
          ))}
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={allSlides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
