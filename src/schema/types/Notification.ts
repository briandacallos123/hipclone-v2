import { extendType, objectType, inputObjectType } from 'nexus';
import client from '../../../prisma/prismaClient';
import { GraphQLError } from "graphql/error/GraphQLError";
import { unserialize, serialize } from 'php-serialize';
import { medicineType } from './Medicine';
import { equal } from 'assert';
import { orderType } from './Orders';
import { DoctorAppointments } from './DoctorAppointments';
import { ChatConversations } from './Chat';
import { prescriptions } from './Prescriptions';

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
        t.bigInt('id');
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
        t.int('id')
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

            const userType = (()=>{
                let userIdRole:any;

                if(user?.role === 'doctor'){
                    userIdRole = 3
                }else if(user?.role === 'patient'){
                    userIdRole = 5
                }else if(user?.role === 'secretary'){
                    userIdRole = 1
                }else if(user?.role === 'merchant'){
                    userIdRole = 4
                }
                return userIdRole
            })()
                

             

                let [all, unread, allCount, allUnread]:any = await client.$transaction([
                    client.notification.findMany({
                        take,
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                            notifiable_user_role:userType
                        },
                        orderBy:{
                            created_at:'desc'
                        }
                    }),
                    client.notification.findMany({
                        take,
                        where:{
                            notifiable_id:Number(user?.id),
                            notifiable_user_role:userType,
                            is_deleted:0,
                            is_read:0
                        },
                    }),
                    client.notification.count({
                        where:{
                            notifiable_id:Number(user?.id),
                            notifiable_user_role:userType,
                            is_deleted:0,
                        }
                    }),
                    client.notification.count({
                        where:{
                            notifiable_id:Number(user?.id),
                            is_deleted:0,
                            notifiable_user_role:userType,
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

export const NotifacationQueryMerchantObj = objectType({
    name:"NotifacationQueryMerchantObj",
    definition(t) {
        t.list.field('notifData',{
            type:notifData
        })
      
    }
})

const notifData = objectType({
    name:"notifData",
    definition(t) {
        t.nullable.field('length',{
            type:'Int',
           async resolve(root){
                return root?._count?.id
            }
        });
        t.nullable.field('notification_type',{
            type:'String',
            resolve(_root){
                let type:any;
                
                if(_root?.notification_type_id === 10){
                    type = "supply"
                }else if(_root?.notification_type_id === 9){
                    type = "order"
                };
                return type;
            }
        });
        t.nullable.boolean('is_read');
        t.nullable.list.field('medecine',{
            type:medicineType,
            async resolve(root){
                if(root?.notification_type_id !== 10) return null;
                console.log(root?.notifData,'NOTIFDATA')


                const res =  root?.notifData?.map(async(item)=>{
                    return await client.merchant_medicine.findFirst({
                        where:{
                            id:Number(item?.medecine_id)
                        },
                        include:{
                            merchant_store:true
                        }
                    })
                });
                const fRes = await Promise.all(res);
                return fRes
             
            }
        });
        t.nullable.list.field('orders',{
            type:orderType,
            async resolve(root){
                if(root?.notification_type_id !== 9) return null;
            

                const res =  root?.notifData?.map(async(item)=>{
                    return await client.orders.findFirst({
                        where:{
                            id:Number(item?.order_id)
                        },
                    })
                });
                const fRes = await Promise.all(res);
                return fRes
             
            }
        });
        t.nullable.field('user',{
            type:'String',
            async resolve(root){
                let myUser:any;

                const targetUser = await client.user.findFirst({
                    where:{
                        id:Number(root?.user_id)
                    }
                });
                
                if(Number(targetUser?.userType) === 0){
                    let patient = await client.patient.findFirst({
                        where:{
                            EMAIL:targetUser?.email
                        },
                        
                    });
                    myUser = patient?.MNAME ? `${patient?.FNAME} ${patient?.MNAME} ${patient?.LNAME}`:`${patient?.FNAME} ${patient?.LNAME}`
                }

                return myUser
            }
        })
    },
})

const UserMerchantType = objectType({
    name:"UserMerchantType",
    definition(t) {
        t.string('name')
    },
})

const recordCount = objectType({
    name:"recordCount",
    definition(t) {
        t.int('id');
    },
})

export const NotificationQueryMerchant = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('NotificationQueryMerchant', {
        type: NotifacationQueryMerchantObj,
        args: { data: NotificationPayloads! },
        async resolve(_, args, _ctx) {
            const { session } = _ctx;
            const {user} = session;

           try {
            let storeByMerchant:any = await client.merchant_store.findMany({
                where:{
                    merchant_id:Number(session?.user?.id)
                }
            })
            storeByMerchant = storeByMerchant?.map((item)=>Number(item.id))
            const nTypeId = [9, 10]

            const groupedData = await client.notification.groupBy({
                by:['notification_type_id','is_read','user_id'],
                where:{
                    notification_type_id:{
                        in:nTypeId
                    },
                    notifiable_user_role:4,
                    notifiable_id:Number(session?.user?.id),
                    is_deleted:0,
                },
                _count:{
                    id:true,
                },
            })
           

            const fData = groupedData?.map(async(item)=>{
                const notifData = await client.notification.findMany({
                    where:{
                        notification_type_id:item?.notification_type_id,
                        is_read:item?.is_read,
                        user_id:item?.user_id
                    },
                    include:{
                            orders:true,
                            merchant_medicine:true,
                    },
                    
                })
                
                return {
                    ...item,
                    notifData:[...notifData]
                }
            })

            const finalData = await Promise.all(fData)
            //1.create orders related, not yet read
            //2. supply shortage related, not yet read.
            //3.supply shortage related, already read.
    
            
          
            return {
                notifData:finalData
            }
           } catch (error) {
            console.log(error)
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

          try {

            if(args?.data?.notifIds?.length){
                const toSerialize = args.data.notifIds;
                const group_ids = serialize(toSerialize);
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


export const NotificationUpdateMerchantInp = inputObjectType({
    name:"NotificationUpdateMerchantInp",
    definition(t) {
        t.nullable.list.int('orderIds');
        t.nullable.list.int('supplyIds');

    },
})


export const NotificationUpdateMerchant = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('NotificationUpdateMerchant', {
        type: NotificationObj,
        args: { data: NotificationUpdateMerchantInp! },
        async resolve(_, args, _ctx) {
            const { session } = _ctx;
            const user = session.user;

           try{
            // console.log(args?.data?.orderIds,'ORDERRRRRRRRRR')
           if(args?.data?.orderIds?.length){
                const idsNotEmpty = args?.data?.orderIds?.filter((item)=>item!==null)

                await client.notification.updateMany({
                    where:{
                        order_id:{
                            in:idsNotEmpty
                        }
                    },
                    data:{
                        is_read:1,
                    },
                })
           }
           if(args?.data?.supplyIds?.length){
             const idsNotEmpty = args?.data?.supplyIds?.filter((item)=>item!==null)

                await client.notification.updateMany({
                    where:{
                        medecine_id:{
                            in:idsNotEmpty
                        }
                    },
                    data:{
                        is_read:1,
                    },
                })
           }

            return {
                message:"Updated succesfully"
            }
           }catch(err){
            
            console.log(err)
            throw new GraphQLError(err)
           }


        }
    })
}
})


const NotifacationQueryFinalObj = objectType({
    name:"NotifacationQueryFinal",
    definition(t) {
       
        t.list.field('notifDataFinal',{
            type:notifDataFinal
        })
    },
})

const notifDataFinal = objectType({
    name:"notifDataFinal",
    definition(t) {
        t.nullable.field('date',{
            type:"DateTime",
            resolve(_root){
                let customDate;

                // const date = _root?.filter((item)=>!item.is_read);
                // const dateRead = _root?.filter((item)=>item.is_read);
                const date = _root?.is_read;
                const dataNotif = _root?.notifData;

                // const dateRead = !_root?.is_read;
                const dateNotifRead = _root?.notifData;

                // console.log(date,'DATEEEEEEE')
                // console.log(dataNotif,'dataNotif')


                if(date && dataNotif?.length){
                    const notifications = dataNotif

                    if(_root?._count?.id > 1){
                    // if(date?.length > 1){
                        notifications.sort((a:any, b:any) => new Date(a.created_at) - new Date(b.created_at));
                        customDate = notifications[0]?.created_at;
                    }else{
                        customDate = notifications[0]?.created_at;
                    }
                }else{
                        const notifications = dateNotifRead

                    if(_root?._count?.id > 1){
                        notifications.sort((a:any, b:any) => new Date(a.created_at) - new Date(b.created_at));
                        customDate = notifications[0]?.created_at;
                    }else{
                        customDate = notifications[0]?.created_at;
                    }
                }
                console.log(customDate,'CUSTOM DATEEEEEEEEEEEEEEE')
                return customDate
            }
        })
        t.list.field('notifIds',{
            type:'Int',
            resolve(_root){
                const ids = _root?.notifData?.map((item)=>parseInt(item?.id))
                return ids;
            }
        })
        t.nullable.field('length',{
            type:'Int',
           async resolve(root){
                return root?._count?.id
            }
        });
        t.nullable.field('notification_type',{
            type:'String',
            async resolve(_root){
                let type:any;
                const notif = await client.notification_type.findFirst({
                    where:{
                        id:Number(_root?.notification_type_id)
                    }
                })


                return notif?.title;
              
            }
        });
        t.nullable.boolean('is_read');
        t.nullable.list.field('appointments',{
            type:DoctorAppointments,
            resolve(root){
                const apptType = [1,3,4,5,6,7,8, 18];
                if(!apptType.includes(root?.notification_type_id)) return null;
                
                const data = root.notifData.map((item)=>item?.appointments);
     
                return data
            }
        });

        t.nullable.list.field('prescription',{
            type:prescriptions,
            resolve(root){
                const prescType = [19];

                if(!prescType.includes(root?.notification_type_id)) return null;
                const data = root.notifData.map((item)=>item?.prescriptions);
     
                return data
            }
        }),
        t.nullable.list.field('chat',{
            type:ChatConversations,
            resolve(_root){
                const chat = [6, 7];
                if(!chat?.includes(_root?.notification_type_id)) return null;
                const data = _root.notifData.map((item)=>item?.conversations);
     
                return data
            }
        });
        t.nullable.field('post_feed',{
            type:'Int',
            resolve(root){
                const apptType = [2];

                if(!apptType.includes(root?.notification_type_id)) return null;
                
                
                return 1
            }
        });
        t.nullable.list.field('orders',{
            type:orderType,
            async resolve(root){
                const orderType = [11,12,13,14,15,16,17];
                

                if(!orderType.includes(root?.notification_type_id)) return null;
                const result = root.notifData.map((item)=>item?.orders);

                let new_result = result?.map(async (item: any) => {
                    const store = await client.merchant_store.findUnique({
                        where: {
                            id: Number(item?.store_id)
                        },
                        include: {
                            attachment_store: true
                        }
                    })

                    const medecine = await client.merchant_medicine.findFirst({
                        where: {
                            id: Number(item?.medecine_id)
                        },
                    })
                    const medecine_attachment = await client.medecine_attachment.findFirst({
                        where: {
                            id: Number(medecine?.attachment_id)
                        }
                    })
                    return { ...item, store: { ...store }, attachment: { ...medecine_attachment } }
                })

                new_result = await Promise.all(new_result);

               
     
                return new_result
                
            }
        });
        t.nullable.field('user',{
            type:'String',
            async resolve(root){
                let myUser:any;

                const userId = root?.notifData[0]

                const userType = (()=>{
                    let type;
                    if(root?.notifData?.find((item)=>item.user_id_user_role === 4)){
                        type = 'merchant'
                    }else if(root?.notifData?.find((item)=>item.user_id_user_role === 2)){
                        type = 'doctor'
                    }else if(root?.notifData?.find((item)=>item.user_id_user_role === 5)){
                        type = 'patient'
                    }
                    return type;
                })()

                const targetUser = await client.user.findFirst({
                    where:{
                        id:Number(root?.user_id)
                    }
                });
                
                if(userType === 'merchant'){
                    let merchant = await client.merchant_user.findFirst({
                        where:{
                            id:Number(userId?.user_id)
                        },
                    });
                    myUser = merchant?.middle_name ? `${merchant?.first_name} ${merchant?.middle_name} ${merchant?.last_name}`:`${merchant?.first_name} ${merchant?.last_name}`
                }else if(userType === 'doctor'){
                    let doctor = await client.employees.findFirst({
                        where:{
                            EMP_EMAIL:targetUser?.email
                        }
                    })

                    myUser = doctor?.EMP_MNAME ? `${doctor?.EMP_FNAME} ${doctor?.EMP_MNAME} ${doctor?.EMP_LNAME}` : `${doctor?.EMP_FNAME} ${doctor?.EMP_LNAME}`;
                }else{
                    let patient = await client.patient.findFirst({
                        where:{
                            EMAIL:targetUser?.email
                        },
                        
                    });
                    myUser = patient?.MNAME ? `${patient?.FNAME} ${patient?.MNAME} ${patient?.LNAME}`:`${patient?.FNAME} ${patient?.LNAME}`
                }

                

                return myUser
            }
        })
    },
})

export const NotifacationQueryFinal = extendType({
    type: 'Query',
    definition(t) {
      t.nullable.field('NotifacationQueryFinal', {
        type: NotifacationQueryFinalObj,
        args: { data: NotificationPayloads! },
        async resolve(_, args, _ctx) {
            const { session } = _ctx;
            const {user} = session;
            // notification type, this is fixed in backend, notification_type table.
           try {
            const nTypeId = [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19];
            
            const userRole = (()=>{
                let notifiable_user_role;

                if(user?.role === 'patient'){
                    notifiable_user_role = {
                        notifiable_user_role: 5
                    }
                }else if(user?.role === 'doctor'){
                    notifiable_user_role = {
                        notifiable_user_role:2
                    }
                }
                return notifiable_user_role
            })()

         

            const groupedData = await client.notification.groupBy({
                by:['notification_type_id','is_read','user_id'],
                where:{
                    notification_type_id:{
                        in:nTypeId
                    },
                    ...userRole,
                    notifiable_id:Number(session?.user?.id),
                    is_deleted:0,
                },
                _count:{
                    id:true,
                }
            })


            const fData = groupedData?.map(async(item)=>{
                const notifData = await client.notification.findMany({
                    where:{
                        notification_type_id:item?.notification_type_id,
                        is_read:item?.is_read,
                        user_id:item?.user_id
                    },
                    include:{
                        appointments:true,
                        conversations:true, 
                        orders:true,
                        prescriptions:true
                    },
                    
                })
                
                return {
                    ...item,
                    notifData:[...notifData]
                }
            })

            const finalData = await Promise.all(fData)

            

           
            return {
                notifDataFinal:finalData
            }
           } catch (error) {
            console.log(error);

            throw new GraphQLError(error)
           }
            
        }
    })
}
})


const NotificationUpdateFinalInp = inputObjectType({
    name:"NotificationUpdateFinalInp",
    definition(t) {
        t.list.int('notifIds')
    },
})

const NotificationUpdateFinalObj = objectType({
    name:"NotificationUpdateFinalObj",
    definition(t) {
        t.string('message')
    },
})

export const NotificationRead = extendType({
    type: 'Mutation',
    definition(t) {
      t.nullable.field('NotificationUpdateFinal', {
        type: NotificationUpdateFinalObj,
        args: { data: NotificationUpdateFinalInp! },
        async resolve(_, args, _ctx) {

            try {
                await client.notification.updateMany({
                    where:{
                        id:{
                            in:args?.data?.notifIds
                        }
                    },
                    data:{
                        is_read:1
                    }
                })
                return {
                    message:"Updated successfully"
                }
            } catch (error) {
                console.log(error);
                throw new GraphQLError(error)
            }
        }
    })
}
});