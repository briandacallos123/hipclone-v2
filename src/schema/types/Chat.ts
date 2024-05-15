import { extendType, inputObjectType, objectType, stringArg, subscriptionField } from "nexus";
import client from "../../../prisma/prismaClient";
import { GraphQLError } from "graphql/error/GraphQLError";
import { useUpload } from '../../hooks/use-upload';
import { unserialize, serialize } from 'php-serialize';
import beamsClient from './beams'

export const UserContacts = objectType({
    name: 'UserContacts',
    definition(t) {
        t.id('id');
        t.boolean("status");
        t.int("userType");
        t.field("role", {
            type: 'String',
            resolve(parent) {
                let role: any = 'patient';
                switch (Number(parent?.userType)) {
                    case 0: {
                        role = 'patient';
                    } break;
                    case 1: {
                        role = 'secretary';
                    } break;
                    case 2: {
                        role = 'doctor';
                    } break;
                }
                const res: any = role;
                return res;
            }
        });
        t.string("email");
        t.field('doctorInfo', { type: 'DoctorInfoObjectFields' });
        t.field('patientInfo', { type: 'PatientInfoObject' });
        t.field('subAccountInfo', { type: 'subAccountInfo' });
        t.field("name", {
            type: 'String',
            resolve(parent: any) {
                let name = 'patient';
                switch (Number(parent?.userType)) {
                    case 0: {
                        name = `${parent.patientInfo?.FNAME} ${parent.patientInfo?.LNAME}`;
                    } break;
                    case 1: {
                        name = `${parent?.subAccountInfo[0]?.fname} ${parent?.subAccountInfo[0]?.lname}`;
                    } break;
                    case 2: {
                        name = Array.isArray(parent.doctorInfo) ? `${parent.doctorInfo[0]?.EMP_FNAME} ${parent.doctorInfo[0]?.EMP_LNAME}` : `${parent.doctorInfo?.EMP_FNAME} ${parent.doctorInfo?.EMP_LNAME}`;
                    } break;
                }
                return name;
            }
        });
        t.string('last_activity');
        t.field("lastActivity", {
            type: 'DateTime',
            resolve(parent) {
                return new Date(Number(parent.last_activity))
            }
        });
        t.string('address');
        t.string('avatarUrl');
        t.string('phoneNumber');
    },
});

export const QueryDoctorPatientContact = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.list.field('allDoctorPatient', {
            type: UserContacts,
            async resolve(_root, args, ctx) {

                const { session } = ctx;
                try {
                    let patientID = null;
                    if (session?.user?.role === 'patient') {
                        const query: any = await client.patient.findFirst({
                            where: {
                                IDNO: session?.user?.patientIDNO
                            },
                            select: {
                                S_ID: true
                            }
                        })
                        patientID = query?.S_ID;
                    }
                    const res = session?.user?.role === 'doctor' ? await client.appointments.findMany({
                        where: {
                            isDeleted: 0,
                            doctorID: session?.user?.id
                        },
                        include: {
                            patientInfo: {
                                include: {
                                    userInfo: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            }
                        },
                        distinct: ['patientID']
                    }) : await client.appointments.findMany({
                        where: {
                            isDeleted: 0,
                            patientID: patientID
                        },
                        include: {
                            doctorInfo: {
                                include: {
                                    user: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            }
                        },
                        distinct: ['doctorID']
                    })
                    let subs: any = []
                    if (session?.user?.role === 'doctor') {

                        subs = await client.sub_account.findMany({
                            where: {

                                subAccountDoctorInfo: {
                                    some: {
                                        doctorID: session?.user?.id
                                    }
                                }
                            },
                            include: {
                                userInfo: true
                            }
                        })

                    }

                    let inclusion: any = {
                    }
                    let subUserTemp: any = [];

                    if (res) {

                        if (session?.user?.role === 'doctor')
                            subUserTemp.push({
                                id: {
                                    in: res.map((v: any) => Number(v?.patientInfo?.userInfo?.id)).filter(id => !isNaN(id))
                                }
                            })
                        else
                            subUserTemp.push({
                                id: {
                                    in: res.map((v: any) => Number(v?.doctorInfo?.user?.id))
                                }
                            })
                    }
                    if (subs) {
                        subUserTemp.push({
                            id: {
                                in: subs.map((v: any) => Number(v?.userInfo?.id))
                            }
                        })
                    }

                    inclusion = {
                        OR: [
                            ...subUserTemp
                        ]
                    }
                    const userInfo = await client.user.findMany({
                        where: {
                            ...inclusion
                        },
                        include: {
                            doctorInfo: true,
                            patientInfo: true,
                            subAccountInfo: true
                        }
                    })

                    const resp: any = userInfo;
                    return resp;
                } catch (error) {
                    throw new GraphQLError(error);
                }

            },
        });
    },
});



export const AttachmentsObj = objectType({
    name: 'AttachmentsObj',
    definition(t) {
        t.id('id');
        t.dateTime('createdAt');
        t.dateTime('modifiedAt');
        t.string('name');
        t.string('path');
        t.string('preview');
        t.int('size');
        t.string('type');
    }
});
export const MessageType = objectType({
    name: 'MessageType',
    definition(t) {
        t.id('id');
        t.nullable.list.field('attachments', {
            type: AttachmentsObj
        })
        t.int('senderId');
        t.string('body');
        t.dateTime('lastActivity');
        t.string('contentType');
        t.dateTime('createdAt');
    }
});
export const ChatConversations = objectType({
    name: 'ChatConversations',
    definition(t) {
        t.id('id');
        t.list.field('messages', {
            type: MessageType
        });
        t.list.field('participants', { type: PartcipantStruct });
        t.string('type');
        t.dateTime('lastActivity');
        t.int('unreadCount');
    }
});
export const PartcipantStruct = objectType({
    name: 'PartcipantStruct',
    definition(t) {
        t.id('id');
        t.string('address'); // doctor - RESIDENCY patient - HOME_ADD  secretary - N/A
        t.string('avatarUrl');
        t.string('name');
        t.string('email');
        t.dateTime('lastActivity');
        t.string('phoneNumber'); // mobile_no - secretary patient/doctor - CONTACT_NO doctor 
        t.string('role');
        t.string('status');
    }
});

export const ParticipantObject = objectType({
    name: 'ParticipantObject',
    definition(t) {
        t.id('id');
        t.int('userId');
        t.string('conversationId');
        t.field('contactInfo', {
            type: UserContacts,
        })
    }
});

export const QueryConversation = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('conversation', {
            type: ChatConversations,
            args: { id: stringArg()! },
            async resolve(_root, args, ctx) {

                let result: any = [];
                result = await client.conversation.findFirst({
                    where: {
                        id: String(args!.id)
                    },
                    include: {
                        participants: {
                            include: {
                                contactInfo: {
                                    include: {
                                        doctorInfo: true,
                                        patientInfo: true,
                                        subAccountInfo: true
                                    }
                                }
                            }
                        },
                        messages: {
                            include: {
                                attachments: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }).then(async (data: any) => {

                    let result: any = await data || [];
                    result.participants = data?.participants.map(async (p: any) => {
                        let dataStruct: any = {
                            id: '',
                            address: '',
                            avatarUrl: 'https://api-dev-minimal-v5.vercel.app/assets/images/avatar/avatar_2.jpg',
                            email: '',
                            name: '',
                            lastActivity: new Date(),
                            phoneNumber: '',
                            role: '',
                            status: String(p?.contactInfo?.userStatus).toLocaleLowerCase(),
                        };
                        switch (Number(p?.contactInfo?.userType)) {
                            case 0: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        name: `${p?.contactInfo?.patientInfo?.FNAME} ${p?.contactInfo?.patientInfo?.LNAME}`,
                                        address: p?.contactInfo?.patientInfo?.HOME_ADD ?? 'N/A',
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.patientInfo?.CONTACT_NO,
                                        role: 'patient',
                                    }
                                }

                            } break;
                            case 1: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        address: 'N/A',
                                        name: `${p?.contactInfo?.subAccountInfo[0]?.fname} ${p?.contactInfo?.subAccountInfo[0]?.lname}`,
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.subAccountInfo[0]?.mobile_no,
                                        role: 'secretary',
                                    }
                                }

                            } break;
                            case 2: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        name: `${p?.contactInfo?.doctorInfo[0]?.EMP_FNAME} ${p?.contactInfo?.doctorInfo[0]?.EMP_LNAME}`,
                                        address: p?.contactInfo?.doctorInfo[0]?.EMP_ADDRESS ?? 'N/A',
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.doctorInfo[0]?.CONTACT_NO,
                                        role: 'doctor',
                                    }
                                }

                            } break;

                        }
                        /*  if( Number(dataStruct.id) === 1){
                           delete dataStruct.id
                           delete dataStruct.lastActivity
                           delete dataStruct.phoneNumber
                           delete dataStruct.status
                         } */
                        p = {
                            ...p,
                            ...dataStruct
                        }

                        return p;

                    })

                    return result;
                })
                return result;

            },
        });
    },
});
export const QueryAllConversations = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.list.field('allConversations', {
            type: ChatConversations,
            async resolve(_root, args, ctx) {

                let result: any = [];
                const { session } = ctx;

                // console.log(ctx,'@@@@@@@@@@@@@@@@@@@@@@');

                result = await client.conversation.findMany({
                    where: {
                        participants: {
                            some: {
                                userId: session?.user?.id
                            }
                        },
                    },
                    include: {
                        participants: {
                            include: {
                                contactInfo: {
                                    include: {
                                        doctorInfo: true,
                                        patientInfo: true,
                                        subAccountInfo: true
                                    }
                                }
                            }
                        },
                        messages: {
                            include: {
                                attachments: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }).then((data) => {
                    const newResult: any = data.map( (v: any) => {
                        v.participants = v.participants.map( (p: any) => {
                            let dataStruct: any = {
                                id: '',
                                address: '',
                                avatarUrl: 'https://api-dev-minimal-v5.vercel.app/assets/images/avatar/avatar_2.jpg',
                                email: '',
                                name: '',
                                lastActivity: new Date(),
                                phoneNumber: '',
                                role: '',
                                status: String(p?.contactInfo?.userStatus).toLocaleLowerCase(),
                            };
                            switch (Number(p?.contactInfo?.userType)) {
                                case 0: {
                                    dataStruct = {
                                        ...dataStruct,
                                        ...{
                                            id: p?.contactInfo?.id,
                                            name: `${p?.contactInfo?.patientInfo?.FNAME} ${p?.contactInfo?.patientInfo?.LNAME}`,
                                            address: p?.contactInfo?.patientInfo?.HOME_ADD ?? 'N/A',
                                            email: p?.contactInfo?.email,
                                            phoneNumber: p?.contactInfo?.patientInfo?.CONTACT_NO,
                                            role: 'patient',
                                        }
                                    }

                                } break;
                                case 1: {
                                    dataStruct = {
                                        ...dataStruct,
                                        ...{
                                            id: p?.contactInfo?.id,
                                            address: 'N/A',
                                            name: `${p?.contactInfo?.subAccountInfo[0]?.fname} ${p?.contactInfo?.subAccountInfo[0]?.lname}`,
                                            email: p?.contactInfo?.email,
                                            phoneNumber: p?.contactInfo?.subAccountInfo[0]?.mobile_no,
                                            role: 'secretary',
                                        }
                                    }

                                } break;
                                case 2: {
                                    dataStruct = {
                                        ...dataStruct,
                                        ...{
                                            id: p?.contactInfo?.id,
                                            name: `${p?.contactInfo?.doctorInfo[0]?.EMP_FNAME} ${p?.contactInfo?.doctorInfo[0]?.EMP_LNAME}`,
                                            address: p?.contactInfo?.doctorInfo[0]?.EMP_ADDRESS ?? 'N/A',
                                            email: p?.contactInfo?.email,
                                            phoneNumber: p?.contactInfo?.doctorInfo[0]?.CONTACT_NO,
                                            role: 'doctor',
                                        }
                                    }

                                } break;

                            }
                            /*  if( Number(dataStruct.id) === 1){
                               delete dataStruct.id
                               delete dataStruct.lastActivity
                               delete dataStruct.phoneNumber
                               delete dataStruct.status
                             } */
                            p = {
                                ...p,
                                ...dataStruct
                            }

                            return p;

                        })

                        return v;

                    })

                    const sortFunction = (a:any, b:any) => {
                        const maxOrderA = Math.max(...a.messages?.map((item:any) => item.createdAt));
                        const maxOrderB = Math.max(...b.messages?.map((item:any) => item.createdAt));
                        return maxOrderB - maxOrderA;
                    }                  
                    const reorder = newResult.sort(sortFunction);
                    return reorder;
                })

                return result;

            },
        });
    },
});
export const ParticipantInputType = inputObjectType({
    name: 'ParticipantInputType',
    definition(t) {
        t.nonNull.int('userId');
    },
})
export const MessageInputType = inputObjectType({
    name: 'MessageInputType',
    definition(t) {
        t.nonNull.string('body');
        t.nonNull.string('contentType');
        t.nonNull.int('senderId');
        /* t.nonNull.dateTime('createdAt'); */
    },
})
export const CreateUpdateConversationType = inputObjectType({
    name: 'CreateUpdateConversationType',
    definition(t) {
        t.nullable.string('id');
        t.nonNull.string('type');
        t.nullable.int('unreadCount');
        t.nullable.upload('attachments');
        t.list.field('participants', {
            type: ParticipantInputType
        });
        t.list.field('messages', {
            type: MessageInputType
        });
    },
})
export const ReplySubscription = subscriptionField('replyMessage', {
    type: ChatConversations,
    args: {
        id: stringArg()!,
    },
    subscribe: async (_, { id }, { pubsub }) => {
        return pubsub.asyncIterator(`createReplyMessage_${id}`)
    },
    resolve: (payload: any) => payload,
});

/* export const AttachmentsInputs = inputObjectType({
    name: 'AttachmentsInputs',
    definition(t) {
        t.id('id');
        t.dateTime('createdAt');
        t.dateTime('modifiedAt');
        t.string('name');
        t.string('path');
        t.string('preview');
        t.int('size');
        t.string('type');
    }
}); */

export const CreateConversation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('createReplyConversation', {
            type: ChatConversations,
            args: { data: CreateUpdateConversationType! },
            async resolve(_parent, args, ctx) {
                const createData: any = args.data
                const { session } = ctx;
                const user: any = session?.user;
                const sFile = await createData.attachments;
                const upload = useUpload(sFile, 'public/uploads/conversation/attachments/');
                /*  id	name	size	type	path	preview	createdAt	modifiedAt	messageId	 */


                let allParticipants = await client.participant.findMany({
                    where: {
                        conversationId: String(args?.data?.id)
                    }
                });

                let targetPar = allParticipants?.filter((item: any) => {
                    if (Number(item.userId) !== Number(user?.id)) {
                        return item.userId
                    }
                })

                const allIds = targetPar?.map((item: any) => item.userId)

                let userOffline: any = await client.user.findMany({
                    where: {
                        id: {
                            in: allIds
                        },
                        isOnline: 1
                    }
                })

                userOffline = userOffline.map((item: any) => `forOnly_${item.id}`)

                // console.log(createData,'_________DATA____________')
                // console.log(createData?.messages,'________MESSAGES____________')

                if (userOffline?.length) {
                    beamsClient.publishToInterests(userOffline, {
                        web: {
                            notification: {
                                title: "New Message Arrived",
                                body: createData?.messages[0]?.body
                            },
                        },
                    });

                }







                let attachmentsData: any = [];
                if (upload) {
                    upload.map((v: any) => {
                        attachmentsData.push({
                            name: v?.fileName,
                            size: v?.fileSize,
                            type: v?.fileType,
                            path: 'public/uploads/conversation/attachments/',
                            preview: `/uploads/conversation/attachments/${v?.fileName}`
                        })
                    })
                }
                // let pIds:any = [];





                const conversationExists = await client.conversation.findMany({
                    include: {
                        participants: true
                    }
                });


                const tmp = createData?.participants.filter((v: any) => Number(v?.userId) !== Number(user?.id));
                const uniqueUserIds = new Set();
                const participants = tmp.filter((participant: any) => {
                    const userId = participant.userId;
                    if (!uniqueUserIds.has(userId)) {
                        uniqueUserIds.add(userId);
                        return true;
                    }
                    return false;
                });
                const conversationType = Number(participants.length) > 1 ? "GROUP" : "ONE_TO_ONE";

                let filterConversation: any = args?.data
                if (!filterConversation?.id) {
                    filterConversation = conversationExists.find((c) =>
                        participants.every((participant: any) =>
                            c.participants.some((p) => Number(p?.userId) === Number(participant.userId))
                        ) && String(c.type) === String(conversationType)
                    );
                }

                const con = await client.conversation.upsert({
                    where: {
                        id: filterConversation?.id ?? ''
                    },
                    create: {
                        type: conversationType,
                        unreadCount: 0,
                        participants: {
                            create: [
                                ...createData?.participants
                            ]
                        },
                        messages: {
                            create: [
                                ...createData?.messages.map((v: any) => {
                                    if (upload.length) {
                                        return {
                                            ...v,
                                            contentType: 'image'
                                        }

                                    }

                                    return {
                                        ...v,
                                    }
                                })
                            ],
                        },
                    },
                    update: {
                        unreadCount: 0,
                        //TODO UPSERT BUG
                        /* participants:{
                            upsert:{
                                where:{
                                    id: '',
                                    userId : {
                                        in:replyData?.participants.map((v:any) => v?.userId )
                                    },
                                    conversationId:  String(replyData?.id),
                                },
                                create:{
                                     userId: replyData?.messages[0]?.senderId
                                },
                                update:{
                                    userId: replyData?.messages[0]?.senderId
                                }                     
                            }   
                        }, */
                        messages: {
                            create: [
                                ...createData?.messages.map((v: any) => {
                                    if (upload.length) {
                                        return {
                                            ...v,
                                            contentType: 'image'
                                        }

                                    }

                                    return {
                                        ...v,
                                    }
                                })
                            ]
                        }

                    }
                }).then(async (data: any) => {

                    let res = await client.participant.findMany({
                        where: {
                            conversationId: String(args?.data?.id)
                        }
                    })

                    res = res.filter((item: any) => Number(item?.userId) !== Number(user?.id));

                    let notifContent = await client.notification_content.create({
                        data: {
                            content: 'send a chat message'
                        }
                    })


                    // if(res?.length > 1){

                    // }else{

                    // }

                    const getMessageID = await client.message.findFirst({
                        orderBy: {
                            lastActivity: 'desc'
                        },
                        select: {
                            id: true
                        }
                    })

                    const datadata = [
                        { id: Number(user?.id) }
                    ]

                    await client.message.update({
                        where: {
                            id: getMessageID?.id
                        },
                        data: {
                            read_ids: serialize(datadata)
                        }
                    })


                    let notifParent: any = res.map(async (item: any) => {
                        let notif = await client.notification.create({
                            data: {
                                user_id: Number(session?.user?.id),
                                notifiable_id: Number(item?.userId),
                                notification_type_id: 6,
                                notification_content_id: Number(notifContent?.id),
                                chat_id: data?.id,
                                conversation_id: getMessageID?.id
                            }
                        })
                        return notif;
                    })

                    await Promise.all(notifParent)




                    if (upload.length) {


                        await client.attachment.createMany({
                            data: attachmentsData.map((v: any) => {
                                return {
                                    ...v,
                                    messageId: getMessageID?.id,

                                }
                            })
                        })
                    }

                    return data;
                }).catch((err: any) => {
                    console.log(err)
                })

                let result: any = [];
                result = await client.conversation.findFirst({
                    where: {
                        id: String(con!.id)
                    },
                    include: {
                        participants: {
                            include: {
                                contactInfo: {
                                    include: {
                                        doctorInfo: true,
                                        patientInfo: true,
                                        subAccountInfo: true
                                    }
                                }
                            }
                        },
                        messages: {
                            include: {
                                attachments: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }).then(async (data: any) => {

                    let result: any = await data || [];
                    result.participants = data?.participants.map(async (p: any) => {
                        let dataStruct: any = {
                            id: '',
                            address: '',
                            avatarUrl: 'https://api-dev-minimal-v5.vercel.app/assets/images/avatar/avatar_2.jpg',
                            email: '',
                            name: '',
                            lastActivity: new Date(),
                            phoneNumber: '',
                            role: '',
                            status: String(p?.contactInfo?.userStatus).toLocaleLowerCase(),
                        };
                        switch (Number(p?.contactInfo?.userType)) {
                            case 0: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        name: `${p?.contactInfo?.patientInfo?.FNAME} ${p?.contactInfo?.patientInfo?.LNAME}`,
                                        address: p?.contactInfo?.patientInfo?.HOME_ADD ?? 'N/A',
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.patientInfo?.CONTACT_NO,
                                        role: 'patient',
                                    }
                                }

                            } break;
                            case 1: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        address: 'N/A',
                                        name: `${p?.contactInfo?.subAccountInfo[0]?.fname} ${p?.contactInfo?.subAccountInfo[0]?.lname}`,
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.subAccountInfo[0]?.mobile_no,
                                        role: 'secretary',
                                    }
                                }

                            } break;
                            case 2: {
                                dataStruct = {
                                    ...dataStruct,
                                    ...{
                                        id: p?.contactInfo?.id,
                                        name: `${p?.contactInfo?.doctorInfo[0]?.EMP_FNAME} ${p?.contactInfo?.doctorInfo[0]?.EMP_LNAME}`,
                                        address: p?.contactInfo?.doctorInfo[0]?.EMP_ADDRESS ?? 'N/A',
                                        email: p?.contactInfo?.email,
                                        phoneNumber: p?.contactInfo?.doctorInfo[0]?.CONTACT_NO,
                                        role: 'doctor',
                                    }
                                }

                            } break;

                        }
                        /*  if( Number(dataStruct.id) === 1){
                           delete dataStruct.id
                           delete dataStruct.lastActivity
                           delete dataStruct.phoneNumber
                           delete dataStruct.status
                         } */
                        p = {
                            ...p,
                            ...dataStruct
                        }

                        return p;

                    })

                    return result;
                })
                /*  console.log(result.id)
                 await pubsub.publish(`createReplyMessage_${result?.id}`, result);  */
                return result;

            },
        });
    },
});


