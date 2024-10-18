'use client';

import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
// utils
import axios from 'axios';
import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from 'src/utils/graphql-helper';
//
import { useParams } from 'src/routes/hook';
import { getSession, signIn, signOut } from 'next-auth/react';
import { AuthContext } from './auth-context';
import { ActionMapType, AuthStateType, AuthUserType } from '../types';
import { usePathname, useSearchParams } from 'src/routes/hook';
import {io} from 'socket.io-client';
// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};
export function AuthProvider(props: Props) {
  const { children } = props;

  return <NextAuthProvider>{children}</NextAuthProvider>;
}
const getServerSession = async () => {
  const session = await getSession();

  return session;
};
function NextAuthProvider({ children }: Props) {



  const [state, dispatch] = useReducer(reducer, initialState);
  const path = usePathname();
  const params = useParams();
  const { id } = params;
  const initialize = useCallback(async () => {
    try {
      const response = await getServerSession();

      const { user }: any = response;

      // console.log(user,'USER SA FRONTEND__________________')

      if (user) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);

      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    // console.log('awit yan');
    initialize();
  }, [initialize]);

  const [isLoggedIn, setLoggedIn]: any = useState(null);

  const deleteCookie = () => {
    document.cookie = `next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  const cB = async (u: any) => {
    return new Promise((resolve, reject) => {
      console.log(path, 'ID: ', id, 'USER: ', u);
      if (path.includes('/find-doctor/') && id && u?.role === 'doctor') {
        reject("Invalid Email or Password, Doctor's not allowed");
      } else {
        resolve('Success');
      }
    })
      .then((res) => {
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: u,
          },
        });
      })
      .catch((Err) => {
        throw new Error(Err);
      });
  };

  // LOGIN
  const login = useCallback(async (username: string, password: string, type?:string, path?:string) => {

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
      type,
      path
    });


    if (result?.error) {
      console.log(result?.error,'ERRORRRRRRRRRRR')

      throw new Error(`Invalid Username / Email or Password`);
    }
    

    const response = await axios.get('/api/auth/session/');
    const { user } = response.data;


    // let's add user id on session storage since we need it for push notification.
    localStorage.setItem('prevUserId', JSON.stringify({
      userId:user?.id
    }))

    const responsedents = await cB(user);
  }, []);

  const loginVoucher = useCallback(async (voucherCode:string) => {
    // console.log('PATHHHHHHH: ', path);
    console.log(voucherCode,'HEHE')
    // const result = await signIn('QueueCredentials', {
    //   redirect: false,
    //   voucherCode
    // });
    // if (result?.error) {
    //   throw new Error(`Invalid Username / Email or Password`);
    // }

    // const response = await axios.get('/api/auth/session/');
    // const { user } = response.data;

  
    // localStorage.setItem('prevUserId', JSON.stringify({
    //   userId:user?.id
    // }))

    // const responsedents = await cB(user);
  }, []);

  // LOGOUT
  const storageCleanup = () =>{
    localStorage?.removeItem('cart');
    localStorage?.getItem('invalidVoucher') && localStorage.removeItem('invalidVoucher')

    localStorage.removeItem('currentStep');
    localStorage.removeItem('esigCalled');
    localStorage.removeItem('languagePref');



    
  }

  const logout = useCallback(async () => {
    await signOut();

    storageCleanup()

    dispatch({
      type: Types.LOGOUT,
    });

  }, []);
  const reInitialize = useCallback(async () => {
    initialize();
  }, []);

  const getDefaultFilters = (d: any) => {
    const smartFil: any = sessionStorage.getItem('defaultFilters');
    // Deserialize the JSON string back to an object
    var retrievedObject = JSON.parse(smartFil);
    let target: any;

    if (retrievedObject) {
      Object.entries(retrievedObject)?.find(([key, val]) => {
        const myVal = {
          [key]: val,
        };

        if (key === d) {
          target = myVal;
        }
      });
    }

    return target || null;
  };

  // ----------------------------------------------------------------------
  let socket : any = undefined;

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  if(!socket && state.user){
    socket =  io('https://socket.apgitsolutions.com:9001',
      {
        secure: true,
        forceNew: true,
        autoConnect: false,
      });
  }

  if( state.user && (socket && !socket.connected ) ){
      socket.connect(()=>{
        socket = socket;
      });

      socket.emit('set online',state.user);
  }

  if((socket && socket.connected ) && !state.user){
      socket.disconnect();
  }

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      socket: socket,
      method: 'next-auth',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
      reInitialize,
      getDefaultFilters,
      loginVoucher
    }),
    [login, logout, state.user, status, loginVoucher]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}


