'use client'

import React, { createContext, useContext, useEffect, useState, useReducer, useCallback } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { QueryAllMedicineOrders } from '@/libs/gqls/Orders';
import { QueryAllMerchantMedicine, CreateMerchantMedecine, DeleteMerchantMedicine} from '@/libs/gqls/merchantUser';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from '@/auth/hooks';
// import { stateProps, actionProps } from '../workforce/merchant/MerchantContext';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
  } from 'src/components/table';
//   import { useSnackbar } from 'src/components/snackbar';
const MerchantUserProvider = createContext({})

export const UseMerchantOrdersContext = () => {
    return useContext(MerchantUserProvider)
}

type MerchantUserContextProps = {
    children:React.ReactNode
}

const initialState = {
    orders:[],
    isLoading:true
}


const reducer = (state:any, action:any) => {
    switch(action.type){
        case "Fetch":
            // console.log(action.payload,'PAYLOAD')
            state.orders = action.payload;
            state.isLoading = false;
            return state;
        case "Create":
            console.log(action.payload,'????')
            const newMerchant = [...state.merchantData, action.payload]
            return {...state, merchantData:newMerchant}

        default:
            return state
    }
}




const MerchantUserOrderContext = ({children}:MerchantUserContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [toRefetch, setToRefetch] = useState<number>(0);
    const {user, socket} = useAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

     // get all merchant user
     const [getMerchant, getMerchantResult] = useLazyQuery(QueryAllMedicineOrders, {
        context: {
           requestTrackerId: 'orders[QueryAllOrderUser]',
           },
           // notifyOnNetworkStatusChange: true,
           fetchPolicy:'no-cache'
       });

       

       useEffect(()=>{
        if (socket?.connected) {
          socket.on('getOrder', async(u: any) => {
           console.log("hit")
           console.log(u?.merchantId)
            if(Number(u?.merchantId) === Number(user?.id)){
                // getMerchantResult.refetch()

                console.log("nmasa loob")
                setToRefetch((prev)=>{
                    return prev+=1;
                })
            } 
          })
        }
    
       return () => {
        socket?.off('getOrder')
       }
      },[socket?.connected])

   
       useEffect(()=>{
           getMerchant({
               variables:{
                   data:{
                       skip:table.page * table.rowsPerPage,
                       take:table.rowsPerPage
                   }
               }
           }).then((res:any)=>{
               const {data} = res;
               if(data){
                   console.log(data,'REFETCH@@@@@')
                dispatch({
                    type:"Fetch",
                    payload:data?.QueryAllMedicineOrders?.orderType

                })
               
               }
           })
       },[table.page, table.rowsPerPage, toRefetch])

        // create merchant medecine
    const [createMerchantFuncMed] = useMutation(CreateMerchantMedecine, {
        context: {
          requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const createMerchantMedFunc = useCallback((user:any)=>{
        createMerchantFuncMed({
            variables:{
                data:user
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            enqueueSnackbar("Created Medecine Succesfully")
        })
    },[])

    // delete

    const [deleteMerchantFuncMed] = useMutation(DeleteMerchantMedicine, {
        context: {
          requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const deletedMerchantMedFunc = useCallback((user:any)=>{
        deleteMerchantFuncMed({
            variables:{
                data:user
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            enqueueSnackbar("Deleted Medecine Succesfully")
        })
    },[])



    // end of create merchant user

    return <MerchantUserProvider.Provider value={{state, table, createMerchantMedFunc, deletedMerchantMedFunc}}>
        {children}
    </MerchantUserProvider.Provider>
}

export default MerchantUserOrderContext