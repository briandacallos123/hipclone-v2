'use client'

import { useAuthContext } from '@/auth/hooks';
import React, { createContext, useContext, useEffect, useState } from 'react'

const ChatWrapperProvider = createContext({})

export const useNotificationWrapper = () => {
    return useContext(ChatWrapperProvider);
}

// hindi na to for chat lang, lahat na ng notif
const ChatWrapper = ({ children }: any) => {
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [newAppt, setNewAppt] = useState(0);
    const { user, socket } = useAuthContext();

    const setChatUnread = (val: number) => {
        setChatUnreadCount(val);
    }

    const setApptCount = (val:number) => {
        setNewAppt(val)
    }

    useEffect(() => {
        if (socket?.connected) {
            console.log("connected na!!!!!!!!!")
            socket.on('sendmessage', (arg: any) => {
                console.log("may nag chattt")
            });


        }
        return () => {
            if(socket?.connected){
                socket.off('sendmessage');
            }
        };

    }, [socket?.connected]);

    console.log(socket?.connected,'connected ba to bossing?')

    return (
        <ChatWrapperProvider.Provider value={{ chatUnreadCount, setChatUnread, setApptCount, newAppt}}>
            {children}
        </ChatWrapperProvider.Provider>
    )
}

export default ChatWrapper