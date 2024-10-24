import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@/helpers/@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import client from '../../../../prisma/prismaClient'; // use the existing prisma instance to avoid multiple instance running

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(client),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_ID),
      clientSecret: String(process.env.GOOGLE_SECRET),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
        type: {},
        path: {},
      },
      authorize: async (credentials, _req) => {


        const type = credentials?.type;
        const path = credentials?.path;

        const { username, password }: any = credentials;
        let user: any;

        console.log(credentials,'credentialscredentials')

     
        switch (type) {
          case "admin":
            user = await client.admin.findFirst({

              where: {
                email: username
              }
            })
            user = { ...user, isAdmin: true }
            break;
          case "merchant":
            user = await client.merchant_user.findFirst({
              where: {
                email: username
              }
            })

            user = { ...user, isMerchant: true }

            break;
         
          default:

            user = await client.user.findFirst({
              select: {
                uname: true,
                password: true,
                email: true,
                username: true,
                userType: true,
              },
              where: {
                OR: [{ email: username }, { uname: username }],
              },
            });


        }


        if (!user) {
          throw new Error("user not exists")
        }
        // commnet muna
        // if(user?.userType === 2 && path === '/'){
        //   throw new Error("user not exists")
        // }
        
        // if(user?.userType === 0 && (path === '/find-doctor/login/' || path === '/find-doctor/register/')){
        //   throw new Error("user not exists");
        // }

        const hashPass = /^\$2y\$/.test(user.password)
          ? '$2a$' + user.password.slice(4)
          : user.password;
        const valid = bcrypt.compareSync(password, hashPass);




        if (!valid) {
          throw new Error("Invalid Credentials")
        }
        return user;
      },

    }),
  ],
  debug: false,
  events: {
    async signIn(_message: any) {
      // Debugging Log
    },
    async signOut(_message: any) {
      // Debugging Log
    },
    async createUser(_message: any) {
      // Debugging Log
    },
    async updateUser(_message: any) {
      // Debugging Log
    },
    async linkAccount(_message: any) {
      // Debugging Log
    },
    async session(_message: any) {
      // Debugging Log
    },
  },
  callbacks: {
    async signIn({ account, user }: { account: any; user: any }) {
      if (account?.provider === 'google') {
        const UserInfo = await client.user
          .findFirst({
            where: {
              email: user?.email,
            },
          })
          .catch((err: any) => console.log(err));
        const AccountInfo = await client.account
          .findFirst({
            where: {
              providerAccountId: account?.providerAccountId,
              type: account?.type,
            },
          })
          .catch((err: any) => console.log(err));
        if (!AccountInfo) {
          if (UserInfo) {
            client.account
              .create({
                data: {
                  ...account,
                  userId: Number(UserInfo?.id),
                },
              })
              .catch((err: any) => {
                console.log('------ERROR--------', err);
              });
          }
        }
      }
      return true;
    },
    async session({ session, user, token, account }: any) {


      if (token?.isAdmin) {
        const { email, id, first_name, last_name, middle_name, contact, attachment_id } = token;


        session.user.displayName = middle_name ? `${first_name} ${middle_name} ${last_name}` : `${first_name} ${last_name}`;
        session.user.lastName = last_name;
        session.user.firstName = first_name;
        session.user.middleName = middle_name;
        session.user.contact = contact;
        session.user.username = email;
        session.user.role = "admin"
        session.user.id = id;
        return session;
      } else if (token?.isMerchant) {
        const { email, id, first_name, last_name, middle_name, contact, attachment_id } = token;

        const merchant = await client.merchant_user.findUnique({
          where: {
            id: Number(id)
          }
        })

        session.user.displayName = merchant?.middle_name ? `${merchant?.first_name} ${merchant?.middle_name} ${merchant?.last_name}` : `${merchant?.first_name} ${merchant?.last_name}`;
        session.user.lastName = merchant?.last_name;
        session.user.firstName = merchant?.first_name;
        session.user.middleName = merchant?.middle_name;
        session.user.contact = merchant?.contact;
        session.user.username = merchant?.email;
        session.user.role = "merchant"
        session.user.id = id;


        const d: any = await client.merchant_attachment.findFirst({
          where: {
            id: Number(merchant?.attachment_id)
          },
          orderBy: {
            created_at: 'desc'
          },
        });
        const photoURL = d
          ? d?.file_url.split('public')[1] // /public/www/ww ->
          : `https://ui-avatars.com/api/?name=${session.user.displayName}&size=100&rounded=true&color=fff&background=E12328`;
        session.user.photoURL = photoURL;

        session.user.coverURL =
          'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_12.jpg';

        return session;
      }

      if (token) {
        let userTypeString = 'patient';
        let userInfo: any = null;
        let login_username: any = null;
        let login_patient: any = null;
        let login_emr_patient: any = null;

        const _user = await client.user.findUnique({
          where: {
            email: token?.email,
          },
        });

        switch (Number(token?.userType)) {
          case 0:
            {
              userTypeString = 'patient';
              userInfo = await client.patient.findFirst({
                where: {
                  EMAIL: token?.email,
                },
                include: {
                  userInfo: true,
                },
              });
              login_username = await client.user.findFirst({
                where: {
                  email: token?.email,
                },
              });
              login_patient = await client.patient.findFirst({
                where: {
                  EMAIL: token?.email,
                },
              });
              login_emr_patient = await client.emr_patient.findFirst({
                where: {
                  patientID: login_patient?.S_ID,
                },
              });
              session.user.occupation = userInfo?.OCCUPATION;
              session.user.displayName = `${userInfo?.FNAME} ${userInfo?.LNAME}`;
              session.user.lastName = userInfo?.LNAME;
              session.user.birthDate = userInfo?.BDAY;
              session.user.firstName = userInfo?.FNAME;
              session.user.middleName = userInfo?.MNAME;
              session.user.contact = userInfo?.CONTACT_NO;
              session.user.latitude = userInfo?.LATITUDE;
              session.user.longitude = userInfo?.LONGITUDE;
              session.user.username = login_username?.uname;
              session.user.uname = login_username?.uname;
              session.user.s_id = login_patient?.S_ID;
              session.user.patientIDNO = login_patient?.IDNO;
              session.user.emr_patient_id = login_emr_patient?.id;
              session.user.sex = userInfo?.SEX;
              session.user.suffix = userInfo?.SUFFIX;
              session.user.address = userInfo?.HOME_ADD;
              session.user.nationality = userInfo?.NATIONALITY;
              session.user.uuid = userInfo?.userInfo?.uuid;
            }

         

            // console.log("NANDITO YUNG KUPALLL")
            break;
          case 1:
            {
              userTypeString = 'secretary';
              userInfo = await client.sub_account.findFirst({
                where: {
                  email: token?.email,
                },
                include: {
                  subAccountDoctorInfo: true,
                },
              });
              login_username = await client.user.findFirst({
                where: {
                  email: token?.email,
                },
              });
              
              session.user.permissions = userInfo?.subAccountDoctorInfo[0];
              session.user.subAccId = userInfo?.id;
              session.user.occupation = userInfo?.occupation;
              session.user.displayName = `${userInfo?.fname} ${userInfo?.lname}`;
              session.user.lastName = userInfo?.lname;
              session.user.firstName = userInfo?.fname;
              session.user.middleName = userInfo?.mname;
              session.user.contact = userInfo?.mobile_no;
              session.user.userType = userInfo?.userType;
              session.user.sex = userInfo?.gender;
              session.user.username = login_username?.uname;
              session.user.uname = login_username?.uname;
              session.user.suffix = userInfo?.suffix;
            }
            break;
          case 2:
            {
              // check if doctor trying to login at fyd

              userTypeString = 'doctor';
              userInfo = await client.employees.findFirst({
                where: {
                  EMP_EMAIL: token?.email,
                },
                include: {
                  SpecializationInfo: true,

                },
              });
              login_username = await client.user.findFirst({
                where: {
                  email: token?.email,
                },
              });

              const emp_card = await client.employee_card.findFirst({
                where: {
                  id: Number(userInfo?.emp_card)
                }
              })
              // emp_card.socials = JSON.parse(emp_card.socials);

              // console.log(emp_card,'businessCardbusinessCardbusinessCardbusinessCardbusinessCard')


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


              const businessCard = await client.employees_business_attachment.findFirst({
                where: {
                  id: Number(userInfo?.EMP_B_ATTACHMENT)
                }
              })
              // businessCard.social = JSON.parse(businessCard.social);
              // console.log(businessCard,'BUSINESSCARDDDDDDDDDDDDDDDDD')

              
              session.user.occupation = userInfo?.SpecializationInfo?.name;
              session.user.displayName = `${userInfo?.EMP_FNAME} ${userInfo?.EMP_LNAME}`;
              session.user.lastName = userInfo?.EMP_LNAME;
              session.user.firstName = userInfo?.EMP_FNAME;
              session.user.middleName = userInfo?.EMP_MNAME;
              session.user.suffix = userInfo?.EMP_SUFFIX;
              session.user.nationality = userInfo?.EMP_NATIONALITY;
              session.user.contact = userInfo?.CONTACT_NO;
              session.user.address = userInfo?.EMP_ADDRESS;
              session.user.birthDate = userInfo?.EMP_DOB;
              session.user.sex = userInfo?.EMP_SEX;
              session.user.esigFile = esigFile[0];
              session.user.esigDigital = esigDigital[0];
              session.user.esig = esigMain[0] || null;

              session.user.employee_card = {
                name: emp_card?.name,
                occupation: emp_card?.occupation,
                contact: emp_card?.contact,
                email: emp_card?.email,
                address: emp_card?.address,
                social: emp_card?.socials,
                template_id: emp_card?.template_id
              }

              session.user.new_doctor = login_username.is_new ? true:false;
              session.user.doctor_id = userInfo.EMP_ID;

              session.user.PRC = userInfo?.LIC_NUMBER;
              session.user.PTR = userInfo?.PTR_LIC;
              session.user.practicing_since = userInfo?.PRACTICING_SINCE;
              session.user.s2_number = userInfo?.S2_LIC;
              session.user.validity = userInfo?.VALIDITY;
              session.user.doctorId = userInfo?.EMPID;
              session.user.username = login_username?.uname;


              session.user.uname = login_username?.uname;
              session.user.title = userInfo?.EMP_TITLE;
              session.user.qrProfile = businessCard?.filename;
            }
            break;
          default: {
            userTypeString = 'patient';
            userInfo = await client.patient.findFirst({
              where: {
                EMAIL: token?.email,
              },
            });
            login_username = await client.user.findFirst({
              where: {
                email: token?.email,
              },
            });
            session.user.occupation = userInfo?.OCCUPATION;
            session.user.displayName = `${userInfo?.FNAME} ${userInfo?.LNAME}`;
            session.user.lastName = userInfo?.LNAME;
            session.user.firstName = userInfo?.FNAME;
            session.user.middleName = userInfo?.MNAME;
            session.user.contact = userInfo?.CONTACT_NO;
            session.user.username = login_username?.uname;
            session.user.uuid = userInfo?.userInfo?.uuid;
           
          }
        }
        session.user.email = token?.email;
        session.user.id = _user?.id;
        session.user.role = userTypeString;


        const d: any = await client.display_picture.findFirst({
          where: {
            userID: _user?.id,
          },
          orderBy: {
            uploaded: 'desc',
          },
        });
        
        // const photoURL = d
        // ? d?.filename.split('public')[1] 

        const photoURL = d
          ? d?.filename
          : `https://ui-avatars.com/api/?name=${session.user.displayName}&size=100&rounded=true&color=fff&background=E12328`;


        session.user.photoURL = photoURL;

        session.user.coverURL =
          'https://api-dev-minimal-v5.vercel.app/assets/images/cover/cover_12.jpg';
      }
      return session;
    },
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token = { ...token, ...user };
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
