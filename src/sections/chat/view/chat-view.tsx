'use client';

import { useEffect, useCallback, useState } from 'react';
// @mui
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
// redux
import { useDispatch } from 'src/redux/store';
import {
  markAsSeen,
  getContacts,
  getConversation,
  getConversations,
  resetActiveConversation,
} from 'src/redux/slices/chat';
// hooks
import SvgColor from 'src/components/svg-color';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
//
import NavVertical from 'src/layouts/dashboard/nav-vertical';
import Iconify from 'src/components/iconify';
import {
  GET_CONTACTS,
  GET_ALL_CHATS,
  GET_CONVERSATION,
  REPLY_CONVERSATION_SUB,
} from '@/libs/gqls/chat';
import keyBy from 'lodash/keyBy';
import { useAuthContext } from '@/auth/hooks';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import { useChat } from '../hooks';
import ChatNav from '../chat-nav';
import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';
import { Box, Dialog } from '@mui/material';
import ModalSplash from '@/components/modal-splash/modal-splash';
// ----------------------------------------------------------------------
const baseUrl = paths.dashboard.chat;
function useInitial() {
  const dispatch = useDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();

  const conversationParam = searchParams.get('id');

  // const getContactsCallback = useCallback(() => {
  //   dispatch(getContacts());
  // }, [dispatch]);

  /*  const getConversationsCallback = useCallback(() => {
     dispatch(getConversations());
   }, [dispatch]); */

  /*   const getConversationCallback = useCallback(() => {
      try {
        if (conversationParam) {
          dispatch(getConversation(conversationParam));
          dispatch(markAsSeen(conversationParam));
        } else {
          router.push(paths.dashboard.chat);
          dispatch(resetActiveConversation());
        }
      } catch (error) {
        console.error(error);
        router.push(paths.dashboard.chat);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationParam, dispatch]); */

  // useEffect(() => {
  //   getContactsCallback();
  // }, [getContactsCallback]);

  /*   useEffect(() => {
      getConversationsCallback();
    }, [getConversationsCallback]); */

  /*   useEffect(() => {
      getConversationCallback();
    }, [getConversationCallback]); */

  return null;
}

type ChatProps = {
  isNotif?:boolean,
  id?:String,
  closeChat?:any
}

export default function ChatView({isNotif, id, closeChat}:ChatProps) {
  useInitial();

  const isView = isNotif

  const { user, socket } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('id');

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS);
  const { data: dChat, loading: lChat, error: eChat, refetch: rChat } = useQuery(GET_ALL_CHATS);

  /*   useEffect(()=>{
      if(!data)
      refetch()
    },[]) */
  const { allDoctorPatient = [] }: any = data || [];
  const { allConversations = [] }: any = dChat || [];
  let graphConversations: any = { byId: {}, allIds: [] };

  // console.log(dChat, 'ITO NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@@@@@@@@@@@@@@@@@@@@@@@@@@@')

  if (allConversations) {
    graphConversations.byId = keyBy(allConversations, 'id');
    graphConversations.allIds = Object.keys(graphConversations.byId);

    sessionStorage.setItem('conversations',JSON.stringify(dChat))
  }

  // TODO EMIT POLLING
  // TODO CONNECTION POLLING
  // TODO EVENT LISTENER
  /*  console.log(socket?.connected, 'socketconnection'); */

  const nav = useBoolean();

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  const [getConversation, { data: _data, loading: _loading, refetch: _refetch }] =
    useLazyQuery(GET_CONVERSATION);
  const [isMessageView, setisMessageView] = useState<boolean>(false);
  const [currentId, setcurrentId] = useState<any>(null);
  const [currentParticipants, setcurrentParticipants] = useState<any>([]);
  const [currentMessage, setcurrentMessage] = useState<any>([]);
  const [currentConve, setcurrentConve] = useState<any>(null);


  const handleMessageView = (b: any, participants: any, messages: any, curId: any) => {
    setisMessageView(Boolean(b));
    setcurrentId(curId);
    console.log("tinawag na una")
    console.log(participants,"tinawag na una")

    setcurrentParticipants(participants);
    setcurrentMessage(messages);
  };

  /* const dd = useSubscription(
    REPLY_CONVERSATION_SUB,
    { variables: { id: "22443f78-08c0-4972-b00a-7511ae945ffe" } }
  );


  console.log(dd) */

  const handleSingleConversation = () => {
    (async () => {
      console.log("Nag run dito bossing")
      handleMessageView(false, [], [], null);
      setcurrentConve(null);
      // setIsLoading(true)
      await getConversation({
        variables: {
          id: conversationParam || id,
        },
        fetchPolicy: 'network-only',
      }).then(async (result) => {
        const { data } = result;
       if(!id){

        await refetch();
        await rChat();
       }


        if (data?.conversation.id) {
          handleMessageView(
            true,
            data?.conversation?.participants,
            data?.conversation?.messages,
            conversationParam || id
          );
          setcurrentConve(data?.conversation);
          console.log(data?.conversation?.participants,'PARA SANTO?')
          // setIsLoading(false)
        } else {
          router.push(baseUrl);
        }
      });
    })();
  };

  const {
    contacts,
    recipients,
    conversations,
    conversationsStatus,
    currentConversation,
    currentConversationId,
    participantsInConversation,
    //
    onSendCompose,
    onSendMessage,
    onAddRecipients,
    onClickNavItem,
  } = useChat({ handleMessageView, setcurrentConve, rChat, dChat });

  /*  const details = !!conversationParam; */
  useEffect(() => {
    if (conversationParam || id) {
      handleSingleConversation();
    }
  }, [conversationParam, id]);

  /*   console.log(socket,'socket@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@') */
  useEffect(() => {
    if (socket?.connected) {
      socket.on('sendmessage', (arg: any) => {
        /*  console.log('sendmessagedata@@@@@@@@@@@@@@@@', arg) */
        setTimeout(() => {
          if (
            dChat?.allConversations?.find((t: any) => String(t.id) === String(arg?.conversationId))
          ) {
            rChat();
          }
        }, 100);

        if (Number(user?.id) !== Number(arg?.id) && conversationParam === arg.conversationId) {
          handleMessageView(
            true,
            arg?.newConversation?.participants,
            arg?.newConversation?.messages,
            arg.conversationId
          );
          setcurrentConve(arg?.newConversation);
        }
      });

      return () => {
        socket.off('sendmessage');
      };
    }
  }, [conversationParam]);

  const [someOneIsType, setsomeOneIsType] = useState<any>([]);
  const [startConvo, SetStartConvo] = useState<Boolean>(false);
  const removeFromArray = (index: any) => {
    const updatedArray = [...someOneIsType.slice(0, index), ...someOneIsType.slice(index + 1)];
    setsomeOneIsType(updatedArray);
  };

  useEffect(() => {
    setsomeOneIsType([]);
  }, [conversationParam]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on('typing', (arg: any) => {
        if (
          Number(user?.id) !== Number(arg?.userId) &&
          String(conversationParam) === String(arg.to_group)
        ) {
          /* console.log(arg,'@typeval') */
          let existed = someOneIsType.find((f: any) => Number(f.userId) === Number(arg?.userId));
          if (!existed) {
            setsomeOneIsType((prev: any) => [...prev, arg]);
          }
        }
      });
      socket.on('stop typing', (arg: any) => {
        someOneIsType.map((f: any, i: any) => {
          if (Number(f?.userId) === Number(arg?.userId)) {
            removeFromArray(i);
          }
          return f;
        });
      });
      return () => {
        socket.off('typing');
        socket.off('stop typing');
      };
    }
  }, [conversationParam, someOneIsType]);

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ p: 1, minHeight: 72, ...(upMd && { pl: 2.5 }) }}
    >
      {!upMd && (
        <IconButton onClick={nav.onTrue} sx={{ mr: 1 }}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {isMessageView ? (
        <ChatHeaderDetail
          participants={
            currentParticipants.filter((r: any) => Number(r.id) !== Number(user?.id)) || []
          }
        />
      ) : (
        <ChatHeaderCompose contacts={allDoctorPatient} onAddRecipients={onAddRecipients} />
      )}
    </Stack>
  );

  const renderNav = (
    <ChatNav
      contacts={allDoctorPatient}
      conversations={graphConversations}
      onClickConversation={onClickNavItem}
      loading={false}
      currentConversationId={_data?.conversation?.id}
      handleMessageView={handleMessageView}
    />
  );
  // bug on desktop render
  // good on mobile
  const renderIsTyping = (
    <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2, m: 1 }}>
      {someOneIsType.map((item: any) => {
        if (item && String(item?.to_group) === String(conversationParam)) {
          return (
            <Stack alignItems="flex-start">
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
                <Stack
                  sx={{
                    ml: 1,
                    width: 'fit-content',
                    borderRadius: '8%',
                    typography: 'body2',
                    bgcolor: 'background.neutral',
                    justifyContent: 'center',
                  }}
                  direction="row"
                >
                  {item?.action}
                  <Iconify
                    icon="eos-icons:three-dots-loading"
                    width={25}
                    sx={{ transform: 'scaleX(-1)', marginLeft: '5px' }}
                  />
                </Stack>
              </Stack>
            </Stack>
          );
        }
        return null;
      })}
      {/* <AvatarGroup
        max={3}
        sx={{
          [`& .${avatarGroupClasses.avatar}`]: {
            width: 24,
            height: 24,
          },
        }}
      >
        <Avatar alt="1">T</Avatar>
        <Avatar alt="1">Z</Avatar>
      </AvatarGroup> */}
    </Stack>
  );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <ChatMessageList messages={currentMessage} participants={currentParticipants} />
      {/* if is typing  */}

      {renderIsTyping}
      <ChatMessageInput
        recipients={recipients}
        onSendCompose={onSendCompose}
        onSendMessage={onSendMessage}
        currentConversationId={currentId}
        isNotif={id && true}
      />
    </Stack>
  );
  // mobile
  if (!upMd) {
    return (
      <>
        <Stack direction="row" sx={{ height: '100%' }}>
          {renderNav}

          <Stack
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            {renderHead}

            <Stack
              direction="row"
              sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              {renderMessages}

              {isMessageView && (
                <ChatRoom
                  conversation={currentConve}
                  participants={
                    currentParticipants.filter((r: any) => Number(r.id) !== Number(user?.id)) || []
                  }
                />
              )}
            </Stack>
          </Stack>
        </Stack>

        <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
      </>
    );
  }
  // desktop

  const renderStartConvo = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        height: 1,
      }}
    >
      <Iconify icon="solar:chat-dots-bold-duotone" width={100} />

      <Button variant="outlined" onClick={() => SetStartConvo(true)}>
        Start Conversation
      </Button>
    </Stack>
  );

  console.log('!startConvo', !startConvo);
  console.log('!conversationParam', !conversationParam);


  if(isLoading){
    return(
      <Dialog maxWidth={false} open={isLoading} PaperProps={{
        sx:{
          maxwidth:640
        }
      }}>
        <ModalSplash/>
      </Dialog>
    )
  }
  // for message notification view
  if(isView){
    return (
      <Dialog maxWidth={'xl'} open={isView} onClose={closeChat}>
        <Container maxWidth={'xl'} sx={{p:2}}>
           
            <Stack direction="row" sx={{mb:1}} alignItems="center" justifyContent="space-between">
                <Typography
                variant="h5"
               
              >
                Chat
              </Typography>
                <Box sx={{
                  hover:'pointer'
                }} onClick={()=>{
                  closeChat()
                }} component="img" src="/assets/icons/notification/ic_close.svg"/>

              </Stack>
           

            <Stack component={Card} direction="row" sx={{ height: '72vh', p:3 }}>
              {/* {renderNav} maxWidth={settings.themeStretch ? false : 'xl'} */}

              <Stack
                sx={{
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                }}
              >
                {startConvo && renderHead}

                <Stack
                  direction="row"
                  sx={{
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  { renderMessages}
            

                  {isMessageView && (
                    <ChatRoom
                      conversation={currentConve}
                      participants={
                        currentParticipants.filter((r: any) => Number(r.id) !== Number(user?.id)) || []
                      }
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Container>
      </Dialog>
    )
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Chat
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        {renderNav}

        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          {startConvo && renderHead}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {!startConvo && !conversationParam ? renderStartConvo : renderMessages}
       

            {isMessageView && (
              <ChatRoom
                conversation={currentConve}
                participants={
                  currentParticipants.filter((r: any) => Number(r.id) !== Number(user?.id)) || []
                }
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
