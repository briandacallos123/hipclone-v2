'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { NexusGenInputs, NexusGenObjects } from 'generated/nexus-typegen';
import { notification_query, notification_read } from 'src/libs/gqls/notification';
import { useAuthContext } from '@/auth/hooks'

export default function NotificationController({isRun}:{isRun:boolean}) {
    const [allData, setAllData]:any = useState([]);

    const [summarize, setSummarize]:any = useState(null);
    const [isLoading, setLoading] = useState(true)
    const [chatLength, setChatLength] = useState([])
  const {user} = useAuthContext()
  const [toRefetch, setToRefetch] = useState(false)
    
  const [queryFunc, queryResults] = useLazyQuery(notification_query, {
    context: {
      requestTrackerId: 'queryFunc[notification_query]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [readNotif] = useMutation(notification_read, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });




    useEffect(()=>{
       if(!isRun){
        return;
       }
         // setLoading(true)
         queryFunc({
          variables: {
              data: {
                take:50
              },
            },
      }).then(async (result:any) => {
          const { data } = result;
          
          const {NotificationData, countAll, countUnread} = data?.NotifacationQuery

          const {newNotif, unread, chatLength} = modifyData(NotificationData)

          localStorage.setItem('chatCount', JSON.stringify(chatLength))
      
          if (data) {

          
              setAllData(newNotif);
              setSummarize({
                  all:countAll,
                  unread:unread
              })
          }
          setLoading(false)
      }).catch((err)=>{
        setLoading(false)
      })
       
      
    },[queryFunc, queryResults?.data, isRun, toRefetch])

    
    const getChat = () => {
      console.log(chatLength,'CHAT_LENGTHHH@@@@@@@@@@@@@@@@@@@@')
    }

    function modifyData(d:any){
      let chatCount:any = 0;
      let newNotif:any = []
      let unread = 0;

      const newAppt:any = []
      let appt_pending:any =0;
      let appt_count:any = 0;
      let read_notif_group:any = [];
      let chatLength:any = []
      let chat_grouped:any = []

      let appt_grouped:any = []

      d?.forEach((item:any)=>{
        if(item?.is_read === 0){
          unread += 1;
        }
        if(item?.notif_group_id){

          if(!read_notif_group.length){
            read_notif_group.push({
              ...item,
              group_child:[]
            })

            return;
          }

          let isExists = false;

          read_notif_group?.forEach((g:any)=>{
            if(g?.notif_group_id === item?.notif_group_id){
              isExists = true;
            }
          })
          
          if(!isExists){
            read_notif_group.push({
              ...item,
              group_child:[]
            })

            return;
          }

          read_notif_group?.forEach((c:any)=>{
            if(c?.notif_group_id === item?.notif_group_id){
              c.group_child.push(c);
            }
          })


          return;
        }
      
        if(item?.chat_id && Number(item?.is_read) === 0){
          // chatCount += 1;
          // dito tayo need mag group

          chatLength.push(item)

          if(!chat_grouped.length){
            chat_grouped.push({
              ...item,
              siblings:[]
            });
            return;
          }


          let isExists = false;

          chat_grouped.forEach((a:any)=>{
            if(a?.user.name === item?.user.name){
             isExists = true
            }
          })
          
          if(!isExists){
            chat_grouped.push({
              ...item,
              siblings:[]
            });
            return;
          }


          chat_grouped.forEach((g:any)=>{
            if(g?.user.name === item?.user.name){
              g.siblings.push(item)
             
            }
          })

        }
       
        if(!item?.chat_id  && item?.appt_data?.id && item?.is_read === 0){
          appt_pending += 1;
          appt_count += 1

          if(!appt_grouped.length){
            appt_grouped.push({
              ...item,
              siblings:[]
            });
            return;
          }


          let isExists = false;

          appt_grouped.forEach((a:any)=>{
            if(a?.user.name === item?.user.name){
             isExists = true
            }
          })
          
          if(!isExists){
            appt_grouped.push({
              ...item,
              siblings:[]
            });
            return;
          }


          appt_grouped.forEach((g:any)=>{
            if(g?.user.name === item?.user.name){
              g.siblings.push(item)
             
            }
          })

        }
      })

      // first, group all the chat based on user.
      // if the group is > 3, merge

                    


      // for appt_approve
      if(appt_grouped?.length < 3){
        appt_grouped?.forEach((item:any)=>{
          if(!item?.chat_id && item?.appt_data?.id && Number(item?.is_read) === 0 && !item?.notif_group_id){
            newAppt.push(item)
          }
        })
      }else{
        const parentItem = d?.find((item:any)=>{
          if(item?.appt_data?.id && Number(item?.is_read) === 0 && !item?.notif_group_id){
            return item;
          }
        });
        const childItem = d?.filter((item:any)=>{
          if(item?.id !== parentItem?.id && item?.appt_data?.id && item?.appt_data?.status === 0 && item?.is_read === 0 && !item?.notif_group_id){
            return item;
          }
        })

        newAppt.push({
          ...parentItem,
          appt_count:appt_count,
          children:childItem
        })
      }


      console.log(chat_grouped,'_____________YAWAPPPPPPP_____________@@@@@@@_____________')
      // for chat
      if(chat_grouped.length < 3){
        chat_grouped?.forEach((item:any)=>{
          if(item?.chat_id !== null &&  !item?.app_data?.id && Number(item?.is_read) === 0 && !item?.notif_group_id){
            newNotif.push(item)
          }
        })
      }else{

        const parentItem = d?.find((item:any)=>{
          if(item?.chat_id && item?.is_read === 0 && !item?.notif_group_id){
            return item;
          }
        });
        const childItem = d?.filter((item:any)=>{
          if(item?.id !== parentItem?.id && item?.chat_id && item?.is_read === 0 && !item?.notif_group_id){
            return item;
          }
        })

        newNotif.push({
          ...parentItem,
          is_many_chat:true,
          chat_length:chatLength.length,
          children:childItem
        })
      }

      console.log(newNotif,' FOR CHAT________________________________')
      console.log(newAppt,' FOR APPOINTMENT________________________________')
      console.log(unread,'UNREAD________________________')

      const isReadNotif = d?.filter((item:any)=>item?.is_read === 1 && !item?.notif_group_id);

      const sortedNotifGroup = [];
      sortedNotifGroup.push(read_notif_group);
      read_notif_group.siblings?.forEach((item:any)=>{
        sortedNotifGroup.push(item)
      })

      function compareDates(a, b) {
        return new Date(a.date) - new Date(b.date);
      }

      sortedNotifGroup.sort(compareDates)

      const newGroupedData:any = [];
      newGroupedData.push(newGroupedData[0]);
      newGroupedData[0].siblings = sortedNotifGroup.splice(1);

      // push bagong notif
      newAppt.forEach((item:any)=>{
        newGroupedData.push(item)
      })

      // tapos sort ulit
      newGroupedData.sort(compareDates)

      console.log(newGroupedData,'PATINGIN_____________')
      


      newNotif = [...newNotif, ...newGroupedData,...isReadNotif];
      // newNotif = [...newNotif, ...newAppt, ...read_notif_group,...isReadNotif];

      return {
        newNotif, unread, chatLength
      }

    }

    // useEffect(()=>{
    //   if(toRefetch){

    //   }
    // },[toRefetch])

    const handleReadFunc = useCallback(
      async (model: NexusGenInputs['NotificationUpdate']) => {
        const data: NexusGenInputs['NotificationUpdate'] = {
          // email: model.email,
          id:model?.id,
          statusRead:model?.read,
          conversation_id:model?.conversation_id,
          chat_id:model?.chat_id,
          notifIds:model?.notifIds?.length !== 0 ? [...model?.notifIds?.map((i:any)=>Number(i?.id)), model.id] : []
        };
        readNotif({
          variables: {
            data,
          },
        })
          .then(async (res) => {
            await queryResults.refetch()
            // setToRefetch(true)
            // if(model.isRefetch){
            //   alert(true)
            //   setToRefetch(true)
            // }
            // 
            // if(model.isRefetch){
            //   setToRefetch(true)
              
            // }
          })
          .catch((error:any) => {
            console.log(error,'ERROR SA HANDLE READ FUND')
          });
      },
      []
    );
  


    return {
        allData, getChat, isLoading, summarize, queryResults, handleReadFunc, chatLength
    }
}