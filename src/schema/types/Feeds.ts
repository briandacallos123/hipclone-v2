// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/client';
import { extendType, objectType, inputObjectType, intArg, stringArg } from 'nexus';
import { useUpload } from '../../hooks/use-upload';
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import useGoogleStorage from '@/hooks/use-google-storage-uploads2';

const client = new PrismaClient();

export const postObjType = objectType({
  name: 'postObjType',
  definition(t) {
    t.id('id');
    t.string('text');
    t.string('requestType');
    t.boolean('u_like', {
      async resolve(root, _args, ctx) {
        const { session } = ctx;
        const { user } = session;
        const u_Like = await client.likes.count({
          where: {
            liker: Number(user?.id),
            postsId: Number(root.id),
            unlike: false,
          },
        });
        return u_Like ? true : false;
      },
    });
    t.int('likes', {
      async resolve(root, _args, _ctx) {
        const count = await client.likes.count({
          where: {
            postsId: Number(root.id),
            unlike: false,
          },
        });
        return count;
      },
    });
    t.dateTime('createdAt');
    t.int('isPublic');
    t.nullable.field('userData', {
      type: postUserObjs,
    });
    t.nullable.list.field('attachmentData', {
      type: postAttachmentObj,
      async resolve(root, _args, _ctx) {
        const result: any = await client.postattachment.findMany({
          where: {
            postID: Number(root.id),
          },
        });
        return result;
      },
    });
  },
});

export const postAttachmentObj = objectType({
  name: 'postAttachmentObj',
  definition(t) {
    t.int('id');
    t.string('fileName');
    t.string('imagePath');
    t.dateTime('createdAt');
  },
});

export const postUserObjs = objectType({
  name: 'postUserObjs',
  definition(t) {
    t.int('EMP_ID');
    t.string('EMP_FNAME');
    t.string('EMP_MNAME');
    t.string('EMP_LNAME');
    t.string('EMP_TITLE');
    t.nullable.field('attachment', {
      type:attachment
    })
  },
});

export const attachment = objectType({
  name:"attachment",
  definition(t) {
      t.string('filename')
  },
})

export const QueryPostSingle = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryPostSingle', {
      type: postObjType,
      args: { id: intArg() },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        let result: any;

        if (session?.user?.role === 'patient') {
          result = await client.posts.findFirst({
            where: {
              OR: [
                {
                  id: Number(args.id),
                },
                {
                  isPublic: 1,
                },
              ],
            },

            orderBy: {
              id: 'desc',
            },
            include: {
              userData: true,
            },
          });
        }
        if (session?.user?.role === 'doctor') {
          result = await client.posts.findFirst({
            where: {
              OR: [
                {
                  id: Number(args.id),
                },
                {
                  isPublic: 1,
                },
              ],
            },
            orderBy: {
              id: 'desc',
            },
            include: {
              userData: true,
            },
          });
        }
        return result;
      },
    });
  },
});

export const QueryPosts = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.list.field('QueryPosts', {
      type: postObjType,
      args: { skip: intArg()!, take: intArg()!, requestType: stringArg()! },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        let result: any;
        console.log(session?.user,'_______________________USERRR__________')

        let userId:any;

        const doctorD = await client.employees.findFirst({
          where:{
            EMP_EMAIL:session?.user?.email
          }
        })

        if(session?.user?.role === 'patient'){
          userId = session?.user?.s_id;
        }else{
         
          userId = doctorD?.EMP_ID
        }

        const doctorList: any = await client.records.findMany({
          where: {
            patientID:userId,
          },
          select: {
            doctorID: true,
          },
          distinct: ['doctorID'],
        });


        // console.log(
        //   `doctorList role: ${session?.user?.role} `,
        //   doctorList.map((doctor: any) => doctor.doctorID)
        // );
        let doctorIds = doctorList.filter((doctor: any) =>{
          if(doctor.doctorID !== null){
            return doctor.doctorID
          }
        })
       

        doctorIds = doctorIds?.map((item:any)=>item.doctorID)
        console.log(doctorIds,'DOCTORRRRRRR!!!!!!!!!!!!!!')

        
        if (session?.user?.role === 'patient') {
          const apptRecord = await client.appointments.findMany({
            where:{
              doctorID:{
                in:doctorIds
              },
              patientID:Number(session?.user?.s_id),
              status:1
            }
          })
          console.log(apptRecord,'!!!!!!!!!!!!!!!',session?.user)

          if(apptRecord?.length){
            console.log(apptRecord,'????????????????????????????????')
            result = await client.posts.findMany({
              skip: Number(args?.skip),
              take: Number(args?.take),
              where: {
                OR: [
                  {
                    userID:{
                      in:doctorIds
                    }
                  },
                  {
                    isPublic: 1,
                  },
                ],
                isDeleted: 0,
              },
  
              orderBy: {
                id: 'desc',
              },
              include: {
                userData: true,
                
              },
            });
          }else{
            result = []
          }
         
        }
        if (session?.user?.role === 'doctor') {
          result = await client.posts.findMany({
            skip: Number(args?.skip),
            take: Number(args?.take),
            where: {
              OR: [
                {
                  userID: Number(doctorD?.EMP_ID),
                },
                {
                  isPublic: 1,
                },
              ],
              isDeleted: 0,
            },
            orderBy: {
              id: 'desc',
            },
            include: {
              userData: true,
            },
          });
        }

        // console.log(result,'RESULT DOCOTRRRRRRRRRRR')
        result = result?.map(async(item)=>{
          const doctorId = await client.user.findFirst({
            where:{
              email:item?.userData?.EMP_EMAIL
            },
            select:{
              id:true
            }
          })


          console.log(doctorId,'DOCTOR IDDDDDDDDDD')
          const attachment = await client.display_picture.findMany({
            where:{
              userID:Number(doctorId?.id)
            },
            orderBy:{
              uploaded:'desc'
            }
          })

          // console.log(attachment[0],'ITO NA YUNNN');
          const userData = {
            ...item.userData
          }
          return {...item, userData:{...userData, attachment:{...attachment[0]}}}
        })

        const data = await Promise.all(result)

        // console.log(data,'RESULT ULITTT')

        const overwriteRes: any = await data.map((v: any) => ({
          ...v,
          requestType: String(args.requestType),
          /* String(args.requestType) */
        }));
        return overwriteRes;
      },
    });
  },
});

//   upload

const postInputType = inputObjectType({
  name: 'postInputType',
  definition(t) {
    t.nullable.int('id');
    t.nullable.string('text');
    t.nullable.int('isPublic');
  },
});

/// ////////////////////////////////////////////////////
export const post_transactions = objectType({
  name: 'post_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
  },
});

export const postMutationType = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('post_feed_mutation', {
      type: post_transactions,
      args: {
        data: postInputType!,
        file: 'Upload',
      },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        try {
          let res: any;
          const sFile = await args?.file;
          const mutation_created_at = new Date();
          const formated_created_at = mutation_created_at.toISOString();
         

          const doctorId = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
          })

          if (sFile) {
            // eslint-disable-next-line react-hooks/rules-of-hooks

            // const uploadResult = await useUpload(sFile, 'public/feedsAttachments/');
           
            // console.log('uploadResult', uploadResult);

            const uploadResult: any = await useGoogleStorage(
              sFile,
              session?.user?.id,
              'feeds'
            );

            const doctorId = await client.employees.findFirst({
              where:{
                EMP_EMAIL:session?.user?.email
              }
            })


            const createPost = await client.posts.create({
              data: {
                text: String(args.data?.text),
                userID: Number(doctorId?.EMP_ID),
                createdAt: formated_created_at,
                isPublic: Number(args.data?.isPublic),
              },
            });

            // console.log('fileUpload', createPost);

            const fileUpload = uploadResult;

            await Promise.all(
              fileUpload.map((v: any) =>
                // Returning the promise generated by client.postAttachment.create()
                client.postattachment.create({
                  data: {
                    fileName: String(v.path),
                    imagePath: String(v.path),
                    fileSize: Number(v.fileSize),
                    type: String(v.fileType),
                    createdAt: formated_created_at,
                    createdBy: Number(doctorId?.EMP_ID),
                    postID: Number(createPost.id),
                  },
                })
              )
            );

            res = {
              status: 200,
              message: 'Successful post',
            };

            return res;
          }
          if (!sFile) {
            const createPost = await client.posts.create({
              data: {
                text: String(args.data?.text),
                userID: Number(doctorId?.EMP_ID),
                createdAt: formated_created_at,
                isPublic: Number(args.data?.isPublic),
              },
            });
            res = {
              status: 200,
              message: 'Successful post text',
            };

            return res;
          }

       
          
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});

// post react mutation

const postLikeInputType = inputObjectType({
  name: 'postLikeInputType',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.boolean('like');
  },
});

export const likeMutationType = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('post_like_mutation', {
      type: post_transactions,
      args: {
        data: postLikeInputType!,
      },
      async resolve(_root, args, ctx) {
        const { session } = ctx;
        let res: any;
        const like = args.data?.like;
        try {
          const checkedIfLiked = await client.likes.count({
            where: {
              postsId: Number(args?.data!.id),
              liker: Number(session?.user?.id),
              unlike: false,
            },
          });
          if (!checkedIfLiked) {
            await client.posts.update({
              where: {
                id: args?.data!.id,
              },
              data: {
                likes: {
                  increment: 1,
                },
              },
            });

            await client.likes.create({
              data: {
                liker: Number(session?.user?.id),
                postsId: Number(args?.data!.id),
                unlike: false,
              },
            });
          } else {
            await client.posts.update({
              where: {
                id: args?.data!.id,
              },
              data: {
                likes: {
                  decrement: 1,
                },
              },
            });
            await client.likes.updateMany({
              where: {
                liker: Number(session?.user?.id),
                postsId: Number(args?.data!.id),
              },
              data: {
                unlike: true,
              },
            });
          }

          return res;
        } catch (error) {
          res = {
            status: 'Error',
            message: 'Unsuccessful like',
          };

          console.log(error);
        }
      },
    });
  },
});

export const QueryLikes_transactions = objectType({
  name: 'QueryLikes_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
  },
});

const QueryLikesInputType = inputObjectType({
  name: 'QueryLikesInputType',
  definition(t) {
    t.nullable.int('postsId');
    t.nullable.int('liker');
  },
});
export const QueryLikes = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('QueryLikes', {
      type: QueryLikes_transactions,
      args: { data: QueryLikesInputType! },
      async resolve(_root, args, ctx) {
        let res: any;
        const { session } = ctx;

        const result = await client.likes.findFirst({
          where: {
            postsId: Number(args?.data?.postsId),
            liker: Number(session?.user?.id),
          },
        });
        if (result) {
          res = {
            status: 200,
            message: 'Already liked',
          };
        } else {
          res = {
            status: 200,
            message: 'No like',
          };
        }
        // console.log(result);
        return res;
      },
    });
  },
});

// delete

const DeleteInputType = inputObjectType({
  name: 'DeleteInputType',
  definition(t) {
    t.nullable.int('id');
  },
});

/// ////////////////////////////////////////////////////
export const deletePost_transactions = objectType({
  name: 'deletePost_transactions',
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
  },
});

export const postDelete_Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('postDelete_Mutation', {
      type: deletePost_transactions,
      args: {
        data: DeleteInputType!,
      },
      async resolve(_root, args, ctx) {
        try {
          let res: any;

          const deletePost = await client.posts.update({
            where: {
              id: Number(args?.data?.id),
            },
            data: {
              isDeleted: 1,
            },
          });
          res = {
            status: 200,
            message: 'Successful Delete post',
          };

          return res;
        } catch (error) {
          console.log(error);
        }
      },
    });
  },
});
