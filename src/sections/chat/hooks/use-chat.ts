import { useCallback } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { sendMessage, addRecipients, createNewConversation } from 'src/redux/slices/chat';

// routes
import { paths } from 'src/routes/paths';
// types
import { IChatParticipant } from 'src/types/chat';
// components
import { useRouter, useSearchParams } from 'src/routes/hook';
import { useMutation } from '@apollo/client';
import { CREATE_REPLY_CONVERSATION } from '@/libs/gqls/chat';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

const baseUrl = paths.dashboard.chat;

export default function useChat(props?: any) {
  const dispatch = useDispatch();

  const router = useRouter();

  const { user, socket }  = useAuthContext();

  const currentUserId = user?.id;

  const { contacts, recipients, conversations, currentConversationId, conversationsStatus } =
    useSelector((state) => state.chat);



  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('id');

  const currentConversation = useSelector(() => {
    if (currentConversationId) {
      return conversations.byId[currentConversationId];
    }

    return {
      id: '',
      messages: [],
      participants: [],
      unreadCount: 0,
      type: '',
    };
  });

  const participantsInConversation = currentConversation.participants.filter(
    (participant) => participant.id !== currentUserId
  );
  /* const [getConversation,{data,loading,refetch}] = useLazyQuery(GET_CONVERSATION); */
  const onClickNavItem = useCallback(
    async (conversationId: string) => {
      /* let _conversationId;
      const con : any = await getConversation({
        variables:{
          id: conversationId
        }
      })
      
      const conversation : any = con?.data?.conversation;
      console.log(conversation)

      if (conversation?.type === 'GROUP') {
        _conversationId = conversation.id;
      } else {
        const participantId = conversation?.participants.filter(
          (participant : any) => participant.id !== currentUserId
        )[0].id;

        _conversationId = participantId;
      } */

      router.push(`${baseUrl}?id=${conversationId}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations.byId, currentUserId]
  );
  
  const onSendMessage = useCallback(
    (body: string, attachment? : File) => {
      console.log(body, attachment,'TANGINA MO BOYYYYYYYYYYY!!!!!!!!!!!!!!')
    /*   try {
        if (currentConversationId) {
          dispatch(sendMessage(currentConversationId, body));
        }
      } catch (error) {
        console.error(error);
      } */
      let p = recipients.map((v: any) => {
        return {
          userId: Number(v.id)
        }
      })
      p.push({
        userId: Number(user?.id)
      })

      ComposeMessage({
        variables:{
          data:{
            id:conversationParam,
            attachments: attachment,
            type: '',
            unreadCount:0,
            participants:p,
            messages:{
               body,
               contentType: 'text',
               senderId: Number(user?.id)
            }
          }
        }
      }).then((result: any) => {
  

        props?.handleMessageView(true,result?.data?.createReplyConversation?.participants,result?.data?.createReplyConversation?.messages,conversationParam);
        props?.setcurrentConve(result?.data?.createReplyConversation);
        props?.rChat();
        /* user.conversationId = conversationParam; */
        let data : any = user;
        data.conversationId = conversationParam;
        data.newConversation = result?.data?.createReplyConversation;
        socket.emit('sendmessage',data);
        
        const convo = JSON.parse(sessionStorage.getItem('conversations'));
        const targetConvo = convo?.allConversations?.find((item:any)=> item.id=== conversationParam)
        
        let targetUser = targetConvo?.participants?.filter((item:any)=>Number(item?.id) !== Number(user?.id));
        targetUser = targetUser?.map((item:any)=>Number(item.id));

       

        if(targetUser?.length){
          socket.emit('send notification',{
            recepient:targetUser,
            notification_type:6
          })
        }
       
      })
    },
    [conversationParam]
  );

  const [ComposeMessage] = useMutation(CREATE_REPLY_CONVERSATION);
  const onSendCompose = useCallback(
    (body: string,  attachment? : File) => {
      /* try {
        dispatch(createNewConversation(recipients, body));
      } catch (error) {
        console.error(error);
      } */
      let p = recipients.map((v: any) => {
        return {
          userId: Number(v.id)
        }
      })
      p.push({
        userId: Number(user?.id)
      })
      ComposeMessage({
        variables:{
          data:{
            attachments: attachment,
            type: '',
            unreadCount:0,
            participants:p,
            messages:{
               body,
               contentType: 'text',
               senderId: Number(user?.id)
            }
          }
        }
      }).then((result:any) => {
        router.push(`${baseUrl}?id=${result?.data?.createReplyConversation?.id}`);
      })

    },
    [recipients]
  );

  const onAddRecipients = useCallback(
    (selected: IChatParticipant[]) => {
      dispatch(addRecipients(selected));
    },
    [dispatch]
  );

  return {
    // redux
    contacts,
    recipients,
    conversations,
    conversationsStatus,
    currentConversationId,
    //
    currentConversation,
    participantsInConversation,
    //
    onSendMessage,
    onSendCompose,
    onAddRecipients,
    onClickNavItem,
  };
}
