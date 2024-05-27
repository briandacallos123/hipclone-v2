'use client'

import React, { createContext, useContext, useEffect, useState, useReducer, useCallback } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
// import {QueryAllMedicineOrders}
import { QueryAllMedicineOrdersPatient, DeleteOrder, CreateOrders} from '@/libs/gqls/Orders';
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
const OrdersProvider = createContext({})

export const UseOrdersContext = () => {
    return useContext(OrdersProvider)
}

type OrderUserContextProps = {
    children:React.ReactNode
}

const initialState = {
    orders:[],
    isLoading:true
}


const reducer = (state:stateProps, action:actionProps) => {
    switch(action.type){
        case "Fetch":
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




const OrderContext = ({children}:OrderUserContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [toRefetch, setToRefetch] = useState<number>(0);
    const {user, socket} = useAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    console.log(state,'STATE____')

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

     // get all merchant user
     const [getOrders, getOrdersResult] = useLazyQuery(QueryAllMedicineOrdersPatient, {
        context: {
           requestTrackerId: 'orders[QueryAllOrdersPatient]',
           },
           // notifyOnNetworkStatusChange: true,
           fetchPolicy:'no-cache'
       });

   
       useEffect(()=>{
            getOrders({
               variables:{
                   data:{
                       skip:table.page * table.rowsPerPage,
                       take:table.rowsPerPage
                   }
               }
           }).then((res:any)=>{
               const {data} = res;
               if(data){
                //    console.log(data,'REFETCH@@@@@')
                dispatch({
                    type:"Fetch",
                    payload:data?.QueryAllMedicineOrdersPatient
                })
               
               }
           })
       },[table.page, table.rowsPerPage, toRefetch])

        // create merchant medecine
    const [createMedFunc] = useMutation(CreateOrders, {
        context: {
          requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const createOrder = useCallback((user:any)=>{
        createMedFunc({
            variables:{
                data:user
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            enqueueSnackbar("Created Order Succesfully")
            socket.emit('sendOrder',{
                merchantId:user?.merchant_id
            })
        })
    },[])

    // delete

    const [deleteOrderFuncGql] = useMutation(DeleteOrder, {
        context: {
          requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const deletedOrderFunc = useCallback((id:any)=>{
        deleteOrderFuncGql({
            variables:{
                data:{
                    id
                }
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            enqueueSnackbar("Deleted Oder Succesfully")
        })
    },[])



    // end of create merchant user

    return <OrdersProvider.Provider value={{state, table, deletedOrderFunc, createOrder}}>
        {children}
    </OrdersProvider.Provider>
}

export default OrderContext