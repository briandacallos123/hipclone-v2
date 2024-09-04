import { GraphQLError, assertWrappingType } from "graphql";
import { extendType, objectType, inputObjectType } from "nexus";
import client from "../../../prisma/prismaClient";
import { cancelServerQueryRequest } from '../../utils/cancel-pending-query';
import bcrypt from 'bcryptjs';
import { clinicInfo4FYD } from "./Hmo";
import useGoogleStorage from "@/hooks/use-google-storage-uploads";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("lastName");
    t.string("firstName");
    t.string("middleName");
    t.date("birthDate");
    t.string("username");
    t.string("password");
    t.string("image");
    t.string("email");
    t.string("uname");
    t.string("mobile_phone");
    t.string("password");
    t.dateTime("emailVerified");
    t.nullable.field("doctorInfo", {
      type: userdoctorInfo,
    });
  },
});

const userdoctorInfo = objectType({
  name: "userdoctorInfo",
  definition(t) {
    t.nullable.string("CONTACT_NO");
    t.nullable.field("userInfo", {
      type: UserObject,
    });
  },
});

export const UserObject = objectType({
  name: "UserObject",
  definition(t) {
    t.string("mobile_phone");
  },
});




export const QueryUser = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("users", {
      type: User,
      async resolve(_root, _args, ctx) {
        const result: any = await client.user.findMany();
        return result
      },
    });
  },
});

const UserProfileInpType = inputObjectType({
  name: "UserProfileInpType",
  definition(t) {
    t.nonNull.int('id')
  },
})

export const UserProfileView = objectType({
  name: "UserProfileView",
  definition(t) {
    t.nullable.boolean('invalid');
    t.id("id");
    t.string("occupation");
    t.string("displayName");
    t.string("lastName");
    t.string("firstName");
    t.string("middleName");
    t.string("suffix");
    t.string("nationality");
    t.string("contact");
    t.string("address");
    t.string("PRC");
    t.string("PTR");
    t.date("dateOfBirth");
    t.int("sex");
    t.string("practicing_since");
    t.string("s2_number");
    t.string("validity");
    t.int("doctorId");
    t.string("username");
    t.string("uname");
    t.string("title");
    t.string("coverURL");
    t.string("photoURL");
    t.string("email");
    t.nullable.field('esig', {
      type: esig
    });
    t.nullable.field('esigDigital', {
      type: esig
    });
    t.nullable.field('esigFile', {
      type: esig
    });
    t.nullable.list.field('clinicInfo', {
      type: clinicInfo4FYD,
    });
  },
});

const esig = objectType({
  name: "esig",
  definition(t) {
    t.int('doctorID'),
      t.string('filename'),
      t.int('id'),
      t.int('idno'),
      t.int('type'),
      t.dateTime('uploaded')
  },
})

export const QueryUserProfile = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("QueryUserProfile", {
      type: UserProfileView,
      args: { data: UserProfileInpType! },
      async resolve(_root, args, ctx) {

        try {
          const user: any = await client.user.findFirst({
            where: {
              id: Number(args?.data?.id)
            }
          })
          let invalidId: any;

          if (user?.userType !== 2) {
            invalidId = true
          }


          if (!invalidId) {
            const userInfo = await client.employees.findFirst({
              where: {
                EMP_EMAIL: user?.email
              },
              include: {
                clinicInfo: {
                  where: {
                    isDeleted: 0,
                  },
                  include: {
                    ClinicSchedInfo: true,
                    clinicDPInfo:{
                        orderBy: {
                          id: 'desc',
                        },
                    },
                  },
                },
                user: true,
                SpecializationInfo: true,
              }
            })

            console.log(userInfo,'WEWWWWWWWWWWWWWWWWWWW______________________')

            const esigFile = await client.esig_dp.findMany({
              where: {
                doctorID: userInfo?.EMP_ID,
                type: 1,
              },
              orderBy: [
                {
                  uploaded: 'desc',
                },
              ],
            });

            const esigDigital = await client.esig_dp.findMany({
              where: {
                doctorID: userInfo?.EMP_ID,
                type: 2,
              },
              orderBy: [
                {
                  uploaded: 'desc',
                },
              ],
            });


            const esigMain = await client.esig_dp.findMany({
              where: {
                doctorID: userInfo?.EMP_ID,
                type: Number(userInfo?.signature),
              },
              orderBy: [
                {
                  uploaded: 'desc',
                },
              ],
            });


            const d: any = await client.display_picture.findFirst({
              where: {
                userID: Number(user?.id),
              },
              orderBy: {
                uploaded: 'desc',
              },
            });


            const photoURL = d
              ? d?.filename.split('public')[1] // /public/www/ww ->
              : `https://ui-avatars.com/api/?name=${user.displayName}&size=100&rounded=true&color=fff&background=E12328`;

            return {
              occupation: userInfo?.SpecializationInfo?.name,
              displayName: `${userInfo?.EMP_FNAME} ${userInfo?.EMP_LNAME}`,
              lastName: userInfo?.EMP_LNAME,
              firstName: userInfo?.EMP_FNAME,
              middleName: userInfo?.EMP_MNAME,
              suffix: userInfo?.EMP_SUFFIX,
              nationality: userInfo?.EMP_NATIONALITY,
              contact: userInfo?.CONTACT_NO,
              address: userInfo?.EMP_ADDRESS,
              dateOfBirth: userInfo?.EMP_DOB,
              sex: userInfo?.EMP_SEX,
              esigFile: esigFile[0],
              esigDigital: esigDigital[0],
              esig: esigMain[0],
              PRC: userInfo?.LIC_NUMBER,
              PTR: userInfo?.PTR_LIC,
              practicing_since: userInfo?.PRACTICING_SINCE,
              s2_number: userInfo?.S2_LIC,
              validity: userInfo?.VALIDITY,
              doctorId: userInfo?.EMPID,
              username: user?.uname,
              uname: user?.uname,
              title: userInfo?.EMP_TITLE,
              email: userInfo?.EMP_EMAIL,
              photoURL: photoURL,
              clinicInfo:userInfo?.clinicInfo,
              coverURL: 'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_12.jpg'
            }
          } else {
            return {
              invalid: true
            }
          }
        } catch (error) {

          console.log(error);
          throw new GraphQLError(error);
        }

      }
    })
  }
})

export const UserProfileCreationInputType = inputObjectType({
  name: "UserProfileCreationInputType",
  definition(t) {
    t.id("id");
    t.nullable.string("name");
    t.nullable.string("lastName");
    t.nullable.string("firstName");
    t.nullable.string("middleName");
    t.nullable.date("birthDate");
    t.nullable.string("username");
    t.nullable.string("password");
    t.nullable.string("email");
  },
});

export const mutationUpdateUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateUser", {
      type: User,
      args: { data: UserProfileCreationInputType! },
      async resolve(_, args, ctx) {
        const updateUser: any = {
          name: `${args.data!.firstName} ${args.data!.lastName}`,
          lastName: args.data!.lastName,
          firstName: args.data!.firstName,
          username: args.data!.username,
          password: args.data!.password,
          email: args.data!.email,
        };
        const result: any = await client.user.update({
          where: { id: Number(args.data?.id) },
          data: updateUser,
        });
        return result;
      },
    });
  },
});

export const UserProfileUpsertType = inputObjectType({
  name: "UserProfileUpsertType",
  definition(t) {
    t.id("id");
    t.nonNull.string("lastName");
    t.nonNull.string("firstName");
    // t.nonNull.string("username");
    t.nonNull.string("password");
    t.nonNull.string("email");
    t.nonNull.string("address");
    t.nonNull.string("phoneNumber");
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');



  },
});

export const mutationRegisterUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("registerUser", {
      type: User,
      args: { data: UserProfileUpsertType! },
      async resolve(_, args, _ctx) {
        const data = {
          uname: `${args.data!.firstName} ${args.data!.lastName}`,
          lastName: args.data!.lastName,
          firstName: args.data!.firstName,
          username: args.data!.username,
          password: args.data!.password,
          email: args.data!.email,
          address: args?.data!.address,
          mobile_number: args?.data?.phoneNumber
        };

        const userCheck = await client.user.findUnique({
          where: {
            email: data!.email
          }
        })

        if (userCheck) {
          const { password } = userCheck;
          if (password) {
            throw new GraphQLError(`User already exist. ${userCheck}`)
          }
        }
        return client.user.upsert({
          where: { email: args.data!.email },
          update: {
            email: data!.email,
            username: data!.username,
            password: data!.password
          },
          create: data
        }).then(async (rr: any) => {
          let lastPatient = await client.patient.findFirst({
            where: {
              IDNO: {
                not: null
              }
            },
            orderBy: {
              S_ID: 'desc'
            },
            select: {
              IDNO: true
            }
          })


          return await client.patient.create({
            data: {
              EMAIL: args.data!.email,
              FULLNAME: `${args.data!.firstName} ${args.data!.lastName}`,
              FNAME: args.data!.firstName,
              LNAME: args.data!.lastName,
              CONTACT_NO: args?.data?.phoneNumber,
              HOME_ADD: args?.data!.address,
              CLINIC: 1,
              LONGITUDE: args.data!.longitude,
              LATITUDE: args.data!.latitude,
              IDNO: Number(lastPatient?.IDNO + 1)
            }
          }).then(() => {
            return rr;
          }).catch((err) => {
            console.log(err.message, '???????????????????')
            throw new GraphQLError(err.message)
          })


        }).catch((err) => {
          const { message }: any = err;
          console.log(message, 'ERROR MESSAGE')
          if (message.includes('users_username'))
            throw new GraphQLError('Username unavailable.')
          else
            throw new GraphQLError('Email unavailable.')
        });
      },
    });
  },
});




























export const UserUpdateProfileUpsertType = inputObjectType({
  name: "UserUpdateProfileUpsertType",
  definition(t) {
    t.nonNull.string("uname");
  },
});

///////////////////////////////////////
export const user_update_transactions = objectType({
  name: "user_update_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('update_username_data', {
      type: User,
    });
  },
});
///////////////////////////////////////

export const mutationUpdateUsername = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutationUpdateUsername", {
      type: user_update_transactions,
      args: {
        data: UserUpdateProfileUpsertType!,
      },
      async resolve(_, args, ctx) {
        const { id, uname }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(client, session?.user?.id, '`mutationUpdateUsername`', 'UserUpdateProfileUpsertType');

        let res: any = {};
        try {
          const user = await client.user.findUnique({
            where: {
              id: Number(session?.user.id),
            },

          });

          if (!user) {
            throw new GraphQLError(`User not found.`);
          }

          const existingUsername = await client.user.findFirst({
            where: {
              uname,
              NOT: {
                id: Number(session?.user.id), // Exclude the current user from the search
              },
            },
          });

          if (existingUsername) {
            throw new GraphQLError(`Mobile number already taken`);
          }


          const update = await client.user.update({
            where: {
              id: Number(session?.user.id)
            },
            data: {
              uname,
            },
          });

          if (update) {
            res = {
              status: "Success",
              message: "Update Username Successfully",
              update_username_data: update,
            };
          }

        } catch (error) {
          const user = await client.user.findUnique({
            where: {
              id: Number(session?.user.id),
            },
          });

          if (!user) {
            // throw new GraphQLError(`User not found.`);
            res = {
              status: "Failed",
              message: "User not found.",
            };
          }

          const existingUsername = await client.user.findFirst({
            where: {
              uname,
              NOT: {
                id: Number(session?.user.id), // Exclude the current user from the search
              },
            },
          });

          if (existingUsername) {
            // throw new GraphQLError(`Mobile number already taken`);
            res = {
              status: "Failed",
              message: "Username Already Taken",
            };
          }
        }
        return res;
      },
    });
  },
});


































export const UserUpdatePhoneProfileUpsertType = inputObjectType({
  name: "UserUpdatePhoneProfileUpsertType",
  definition(t) {
    t.nonNull.string("mobile_number");
  },
});

///////////////////////////////////////
export const user_update_phone_transactions = objectType({
  name: "user_update_phone_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('update_phone_data', {
      type: User,
    });
  },
});
///////////////////////////////////////

export const updateUserInp = inputObjectType({
  name: "updateUserInp",
  definition(t) {
    t.int('id'),
      t.int('value')
  },
})


export const logoutUserLogin = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("logoutUserLogin", {
      type: User,
      args: {
        data: updateUserInp!,
      },
      async resolve(_, args, ctx) {
        try {
          console.log(args?.data, '___???__')

          const userLogout = await client.user.update({
            where: {
              id: Number(args?.data?.id)
            },
            data: {
              isOnline: Number(args?.data?.value)
            }
          })

          return userLogout
        } catch (error) {
          console.log(error, '_EROOR__________________')
        }

      }
    })
  }
})


export const mutationUpdatePhone = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutationUpdatePhone", {
      type: user_update_phone_transactions,
      args: {
        data: UserUpdatePhoneProfileUpsertType!,
      },
      async resolve(_, args, ctx) {
        const { mobile_number }: any = args.data;
        const { session } = ctx;

        console.log(session, 'wwwww')

        await cancelServerQueryRequest(client, session?.user?.id, '`mutationUpdatePhone`', 'UserUpdatePhoneProfileUpsertType');

        let res: any = {};
        try {
          const user = await client.user.findUnique({
            where: {
              id: Number(session?.user.id),
            },
          });

          if (!user) {
            throw new GraphQLError(`User not found.`);
          }

          // Check if the new mobile number is already in use
          const existingUserWithMobile = await client.user.findFirst({
            where: {
              mobile_number,
              NOT: {
                id: Number(session?.user.id), // Exclude the current user from the search
              },
            },
          });

          if (existingUserWithMobile) {
            throw new GraphQLError(`Mobile number already taken`);
          }


          const update = await client.user.update({
            where: {
              id: Number(session?.user.id)
            },

            data: {
              mobile_number,
            },
          });

          if (session?.user.role === 'doctor') {
            const updateDoctorInfo = await client.employees.updateMany({
              where: {
                user: { id: Number(session?.user.id) }
              },
              data: {
                CONTACT_NO: mobile_number, // The new mobile_number value
              },
            });
          } else if (session?.user.role === 'patient') {
            const updatePatientInfo = await client.patient.updateMany({
              where: {
                EMAIL: session?.user.email
              },
              data: {
                CONTACT_NO: mobile_number, // The new mobile_number value
              },
            });
          } else {
            const updateSubaccountInfo = await client.sub_account.updateMany({
              where: {
                email: session?.user.email
              },
              data: {
                mobile_no: mobile_number, // The new mobile_number value
              },
            });
          }




          if (update) {
            res = {
              status: "Success",
              message: "Update Mobile Phone Successfully",
              update_phone_data: update, // Include the update result
            };
          }


        } catch (error) {
          const user = await client.user.findUnique({
            where: {
              id: Number(session?.user.id),
            },
          });

          if (!user) {
            // throw new GraphQLError(`User not found.`);
            res = {
              status: "Failed",
              message: "User not found.",
            };
          }

          // Check if the new mobile number is already in use
          const existingUserWithMobile = await client.user.findFirst({
            where: {
              mobile_number,
              NOT: {
                id: Number(session?.user.id), // Exclude the current user from the search
              },
            },
          });

          if (existingUserWithMobile) {
            // throw new GraphQLError(`Mobile number already taken`);
            res = {
              status: "Failed",
              message: "Mobile number already taken.",
            };
          }
        }
        return res;
      },
    });
  },
});


















export const UserUpdatePasswordProfileUpsertType = inputObjectType({
  name: "UserUpdatePasswordProfileUpsertType",
  definition(t) {
    t.nonNull.string("password");
    t.nonNull.string("newpassword");
    t.nonNull.string("confirmpassword");
  },
});

///////////////////////////////////////
export const user_password_transactions = objectType({
  name: "user_password_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('update_password_data', {
      type: User,
    });
  },
});
///////////////////////////////////////

export const mutationUpdatePassword = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutationUpdatePassword", {
      type: user_password_transactions,
      args: {
        data: UserUpdatePasswordProfileUpsertType!,
      },
      async resolve(_, args, ctx) {


        const { password, newpassword, confirmpassword }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(client, session?.user?.id, '`mutationUpdatePassword`', 'UserUpdatePasswordProfileUpsertType');

        let res: any = {};
        let resp: any = {};
        let hashpassword: any;

        try {
          //FIND USER
          const user = await client.user.findUnique({
            where: {
              id: Number(session?.user.id),
            },
          });
          //FIND USER

          //ERROR STATE IF NOT FIND USER
          if (!user) {
            resp.status = "Failed";
            resp.message = "User not found.";
          }
          //ERROR STATE IF NOT FIND USER
          else {
            const userProvidedPassword = password;
            const userProvidedNewPassword = newpassword;
            const userProvidedConfirmPassword = confirmpassword;
            const phpHash: any = user.password;

            let result;
            try {
              const result: any = await bcrypt.compare(userProvidedPassword, phpHash);

              if (result) {
                resp.status = "Success";
                resp.message = "Passwords match!";
              } else {
                resp.status = "Failed";
                resp.message = "Passwords do not match!";
              }
            } catch (err) {
              console.error('Error comparing passwords:', err);
              resp.status = "Failed";
              resp.message = "Error comparing passwords";
            }
            if (resp.status == "Success") {
              if (userProvidedNewPassword === userProvidedConfirmPassword) {
                const hashpassword = await bcrypt.hash(userProvidedNewPassword, 8);

                const update = await client.user.update({
                  where: {
                    id: Number(session?.user.id),
                  },
                  data: {
                    password: hashpassword,
                  },
                });

                if (update) {
                  resp.status = "Success";
                  resp.message = "Update Password Successfully";
                  resp.update_password_data = update;
                } else {
                  resp.status = "Failed";
                  resp.message = "Failed to update password.";
                }
              } else {
                resp.status = "Failed";
                resp.message = "Input Passwords do not match.";
              }
            } else {
              resp.status = "Failed";
              resp.message = "Old Password do not match.";
            }

          }
        } catch (error) {
          resp.status = "Failed";
          resp.message = "An error occurred.";
        }
        return resp;
      },
    });
  },
});

const mutateBusinessCardObj = objectType({
  name:"mutateBusinessCardObj",
  definition(t) {
      t.string('message')
  },
})


export const mutateBusinessCard = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutateBusinessCard", {
      type: mutateBusinessCardObj,
      args: {
        file:'Upload'
      },
      async resolve(_, args, ctx) {
        try {
          const { session } = ctx;

          const sFile = await args?.file;
          let imgData:any;
          console.log(sFile,'SFILEEEEEEEEEE')
  
          if (sFile?.type !== undefined) {
            // const res: any = useUpload(sFile, 'public/uploads/');
            const res: any = await useGoogleStorage(
              sFile,
              session?.user?.id,
              'userDisplayProfile'
            );

            console.log(res,'RESSSSSSSSS')
  
            imgData = await client.employees_business_attachment.create({
              data:{
                filename:String(res!.path),
                file_path:String(res!.path),
              }
            })
  
          }

          const targetEmployee = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
          })

          await client.employees.update({
            where:{
              EMP_ID:Number(targetEmployee?.EMP_ID)
            },
            data:{
              ...targetEmployee,
              EMP_B_ATTACHMENT:Number(imgData?.id)
            }
          })

          // await client.employees.update({
          //   where:{
          //     EMP_EMAIL:session?.user?.email
          //   },
          //   data:{
          //     EMP_B_ATTACHMENT:Number(imgData?.id)
          //   }
          // });

          return {
            response:"Updated successfully"
          }
        } catch (error) {
          console.log(error);
          throw new GraphQLError(error)
        }
      }
    })
  }
});


const generateCardInp = inputObjectType({
  name:"generateCardInp",
  definition(t) {
      t.string('name');
      t.string('occupation');
      t.string('contact');
      t.string('email');
      t.string('address');
      t.string('socials');
      t.int('template_id')

  },
})

export const generateCard = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("generateCard", {
      type: mutateBusinessCardObj,
      args: {
        data:generateCardInp
      },
      async resolve(_, args, ctx) {
        const { session } = ctx;

        try {
          console.log(session?.user,'USERRRRRRRRRR')

          const card = await client.employee_card.create({
            data:{
              ...args.data
            }
          });

          const doctor = await client.employees.findFirst({
            where:{
              EMP_EMAIL:session?.user?.email
            }
          })

     

          await client.employees.update({
            where:{
              EMP_ID:Number(doctor?.EMP_ID)
            },
            data:{
              ...doctor,
              emp_card:Number(card?.id)
            }
          })

          return {
            message:"successfully created"
          }
        } catch (error) {
          console.log(error);
          throw new GraphQLError(error)
        }
      }
    })
  }
})