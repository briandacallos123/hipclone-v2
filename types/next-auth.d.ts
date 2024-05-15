import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: number;
      displayName?: string;
      lastName?: string;
      firstName?: string;
      middleName?: string;
      email?: string;
      username?: string;
      password?: string;
      state?: string;
      zipCode?: string;
      phoneNumber?: string;
      photoURL?: string;
      role: any;
      createdAt: Date;
      updatedAt: Date;
      deleted?: boolean;
      isPublic?: boolean;
    } & DefaultSession['user'];
  }
  interface JWT {
    token:{
      id: number
    }
    & DefaultSession['token'];
  }
  interface User {
    id: number;
    name?: string;
    userId: number;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    birthDate?: Date;
    email?: string;
    emailVerified?: Date;
    username?: string;
    password?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    mobilePhone?: string;
    title?: string;
    nameExtension?: string;
    photoURL?: string;
    role: any;
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    isPublic?: boolean;
  }
}
