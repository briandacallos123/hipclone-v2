// types
import { IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  conversation: IChatConversation;
  currentUserId: string;
};

export default function useGetNavItem({ conversation, currentUserId }: Props) {
  const { unreadCount, messages, participants, lastActivity } = conversation;


  const participantsInConversation = participants.filter(
    (participant) => Number(participant.id) !== Number(currentUserId)
  );

  const group = participantsInConversation.length > 1;

  const displayName = participantsInConversation.map((participant) => participant.name).join(', ');

  const hasOnlineInGroup = group
    ? participantsInConversation.map((item) => item.status).includes('online')
    : false;

  const lastMessage = messages[messages.length - 1];

  let displayText = '';

  if (lastMessage) {
    const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';

    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

    displayText = `${sender}${message}`;
  }

  return {
    group,
    unreadCount,
    displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity,
    hasOnlineInGroup,
  };
}
