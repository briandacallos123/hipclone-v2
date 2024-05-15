import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { GraphQLError } from "graphql/error/GraphQLError";
import { unserialize, serialize } from 'php-serialize';

export const ChatPreview = objectType({
    name:'ChatPreview',
    definition(t) {
       t.nullable.list.field('data',{
        type:AllChatPreview
       });
       t.nullable.int('count')
    },
})

export const AllChatPreview = objectType({
    name:"AllChatPreview",
    definition(t) {
        t.nullable.string('id');
        t.nullable.string('body');
        t.nullable.int('senderId');
        t.nullable.list.field('read_ids',{
            type:ReadIds
        });
    },
})

export const ReadIds = objectType({
    name:"ReadIds",
    definition(t) {
        t.nullable.int('id')
    }
})

export const ApptData = objectType({
    name:"ApptData",
    definition(t) {
        t.int('id');
        t.int('status');
    },
})

export const NotifcationObjects = objectType({
    name:'NotifcationObjects',
    definition(t){
        t.int('id');
        t.int('is_read');
        t.nullable.int('notif_group_id')
        t.dateTime('created_at');
        // appt_id (original)
        t.nullable.field('appt_data',{
            type:ApptData,
            async resolve(t,args,ctx){
                try {
                    if(!t?.appt_id) return false;

                    const appt = await client.appointments.findFirst({
                        where:{
                            id:Number(t?.appt_id)
                        }
                    })
                    // console.log(appt,'APPOINTMENTS@@@@@');
                     return appt
                } catch (error) {
                    console.log(error)
                }
            }
        });
        t.nullable.string('chat_id');
        
        // t.nullable.field('chat_preview',{
        //     type:ChatPreview,
        //     async resolve(t,args,ctx){
        //        try {
        //         const { session } = ctx;
        //         if(!t?.chat_id){
        //             return null
        //         }
              
        //         const id = await new Promise(async(resolve, reject)=>{
        //             if(session?.user?.role === 'patient'){
        //                 const id = await client.user.findFirst({
        //                     where:{
        //                         email:session?.user?.email
        //                     }
        //                 });
        //                 resolve(id)
        //             }else{
        //                 const id = await client.user.findFirst({
        //                     where:{
        //                         id:session?.user?.id
        //                     }
        //                 });
        //                 resolve(id)
        //             }
        //         })

        //         // console.log(id,'%%%%%%%%%%%%')
             

        //         const [data, count]:any = await client.$transaction([
        //             client.message.findMany({
        //                 where:{
        //                     conversationId:t?.chat_id,
        //                     senderId:{
        //                         not:Number(id?.id)
        //                     }
        //                 },
        //                 orderBy:{
        //                     createdAt:'desc'
        //                 }
        //             }),
        //             client.message.count({
        //                 where:{
        //                     conversationId:t?.chat_id
        //                 },
        //                 orderBy:{
        //                     createdAt:'desc'
        //                 }
        //             }),

        //         ])

                
        //         // console.log(data,'__________________________')

        //         // console.log(session?.user)
        //         const allData:any = data?.map((item:any)=>{
        //             // if(!item?.read_ids){
        //             //     return false
        //             // }

        //             let ids:any;
        //             if(item?.read_ids){
        //                 ids = unserialize(item?.read_ids);
        //             }
        //             // console.log(ids,'ids')
        //             let isExists = ids?.find((i:any)=>Number(i.id) === Number(id?.id));
               
        //             console.log(isExists,'WAAHH')
                   
        //             if(!isExists){
                     
        //                 return {...item, read_ids:ids}
        //             }

                    
        //         })

        //         // console.log(allData,'___________________________')
               
        //         return {
        //             data:allData,
        //             count
        //         }
        //        } catch (error) {
        //         throw new GraphQLError(error)
        //        }
        //     }
        // })
        // record to nung nag trigger ng notification
        t.field('user',{
            type:userInfoWAttach,
            async resolve(t){
                let targetUserTable:any;
                
                const user = await client.user.findFirst({
                    where:{
                        id:Number(t?.user_id)
                    }
                })
                if(!user){
                    throw new GraphQLError('Can\'t find user');
                }

                let userTarget:any;
                
                
           
                if(user?.userType === 2){
                    
                    userTarget = await client.employees.findFirst({
                        where:{
                            EMP_EMAIL:user?.email
                        }
                    })
                }else if(user?.userType === 0){
                    userTarget = await client.patient.findFirst({
                        where:{
                            EMAIL:user?.email
                        }
                    })
                }else{
                    userTarget = await client.sub_account.findFirst({
                        where:{
                            email:user?.email
                        }
                    })
                }

                return{
                    name :user?.userType === 2 ? `${userTarget?.EMP_FNAME} ${userTarget?.EMP_LNAME}` : `${userTarget?.FNAME} ${userTarget?.LNAME}`,
                    id:Number(user?.id)
                }
            }
        });
        t.field('notification_type_id',{
            type:NotificationType,
            async resolve(t){

                const type = await client.notification_type.findFirst({
                    where:{
                        id:Number(t?.notification_type_id)
                    }
                })
                return type;
            }
        });
        t.field('notification_content',{
            type:NotificationContent,
            async resolve(t){
                
                let content:any = await client.notification_content.findFirst({
                    where:{
                        id:Number(t?.notification_content_id)
                    }
                })
                content = {...content, id:Number(content.id)}
                
                return content;
            }
        });

    }
  })

  const NotificationType = objectType({
    name:"NotificationType",
    definition(t){
        t.string('title');
    }
  })
  
  const userInfoWAttach = objectType({
    name:"userInfoWAttach",
    definition(t){
        t.string('name')
        t.field('avatarAttachment',{
            type:UserAttachment,
            async resolve(t){

                const image = await client.display_picture.findFirst({
                    where:{
                        userID:Number(t.id)
                    },
                    orderBy:{
                        uploaded:'desc'
                    }

                })
                return image;
            }
        })
    }
  })

  const UserAttachment = objectType({
    name:"UserAttachment",
    definition(t) {
        t.string('filename');
    },
  })

//   inputs for post notification
export const NotificationPayloads = inputObjectType({
    name: 'NotificationPayloads',
    definition(t) {
      t.nullable.int('take');
      t.nullable.int('skip');
    },
  });

  export const NotificationResponse = objectType({
    name:"NotificationResponse",
    definition(t){
        t.nullable.list.field('NotificationData',{
            type:NotifcationObjects
        });
        t.nullable.list.field('NotificationDataUnread',{
            type:NotifcationObjects
        });
        t.nullable.int('countAll');
        t.nullable.int('countUnread');
    }
  })



export const NotificationContent = objectType({
    name:"NotificationContent",
    definition(t){
        t.int('id');
        t.string('content');
        t.dateTime('created_at');
    }
})

export const NotifacationQuery = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('NotifacationQuery', {
        type: NotificationResponse,
        args: { data: NotificationPayloads! },
        async resolve(_, args, _ctx) {
           try {
                const {take}:any = args?.data

                const { session } = _ctx;
                const user = session.user;

             

                let [all, unread, allCount, allUnread]:any = await client.$transaction([
                    client.notification.findMany({
                        take,
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                        },
                        orderBy:{
                            created_at:'desc'
                        }
                    }),
                    client.notification.findMany({
                        take,
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                            is_read:0
                        },
                    }),
                    client.notification.count({
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                        }
                    }),
                    client.notification.count({
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                            is_read:0
                        }
                    })
                ])
                // convert item's id as number
                all = all.map((item:any)=>{
                    return {...item, id: Number(item.id), appt_id: Number(item?.appt_id)}
                })

                

                // convert item's id as number
                unread = unread.map((item:any)=>{
                    return {...item, id: Number(item.id)}
                })


               

                return {
                    NotificationData:all,
                    NotificationDataUnread: unread,
                    countAll:Number(allCount),
                    countUnread:Number(allUnread)
                }

        //         ('countAll');
        // t.nullable.int('countUnread');
                

           } catch (error) {
            throw new GraphQLError(error)
           }
        }
        })
    }
})

export const NotifUpdateInput = inputObjectType({
    name:"NotifUpdateInput",
    definition(t) {
        t.int('id');
        t.nullable.int('statusRead');
        t.nullable.string('chat_id');
        t.nullable.list.string('conversation_id');
        t.nullable.list.int('notifIds');
    },
})

export const NotificationObj = objectType({
    name:"NotificationObj",
    definition(t) {
        t.string('message')
    },
})


export const NotificationUpdate = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('NotificationUpdate', {
        type: NotificationObj,
        args: { data: NotifUpdateInput! },
        async resolve(_, args, _ctx) {
            const { session } = _ctx;
            const user = session.user;

            console.log(args?.data,'____________DATA______________')
          try {

            if(args?.data?.notifIds?.length){
                const toSerialize = args.data.notifIds;
                const group_ids = serialize(toSerialize);
                console.log(group_ids,'GROUP IDS@@@')
                const grpId = await client.notification_group.create({
                    data:{
                        notification_ids:group_ids,
                        is_read:1
                    }
                })

                const dataTarget = args?.data?.notifIds?.map(async(i:any)=>{

                   if(i){
                    return await client.notification.update({
                        where:{
                            id:Number(i)
                        },
                        data:{
                            is_read:1,
                            notif_group_id:grpId?.id
                        }
                    })
                   }
                })

                await Promise.all(dataTarget);
            }
           else{
            const target = await client.notification.update({
                where:{
                    id:Number(args?.data?.id)
                },
                data:{
                    is_read:1
                }
            })
           }
            

           

            if(args?.data?.chat_id && args?.data?.conversation_id){

                // find many muna para i unserialize
               


                // let data = [
                //     {
                //         id:Number(user?.id)
                //     }
                // ]
                // let payload = serialize(data)

                // console.log(payload,'SERIALIZEEEE@@@@@@@@')

                // let unser = unserialize(payload)
                // console.log(unser, 'UNSERRRR')
                
                const toUpdate = args?.data?.conversation_id?.map(async(item:any)=>{
                    const toUnserialize:any = await client.message.findFirst({
                        where:{
                            id:item
                        }
                    })
                    // if(!toUnserialize?.read_ids){
                    //     return false;
                    // }

                    let myData:any = [];
                    
                    if(toUnserialize?.read_ids){
                       myData = unserialize(toUnserialize?.read_ids);

                       const isExists = myData?.find((i:any)=>{
                            if(Number(i.id) === Number(user?.id)){
                                return true;
                            }
                        })
                        if(!isExists){
                            myData.push({
                                id:Number(user?.id)
                            })
                        }
                    }else{
                        myData.push({
                            id:Number(user?.id)
                        })
                    }
                  
                    myData = serialize(myData)

                    const res = await client.message.update({
                        where:{
                            id:item
                        },
                        data:{
                            read_ids:myData
                        }
                    })
                    return res;
                })

                let result = await Promise.all(toUpdate);

               
            }

            return {
                message:"Successfully updated"
            }
            // return {...target, id:Number(target.id)}

            // return target;
          } catch (error) {
            throw new GraphQLError(error)
          }
        }
    })
    }
})