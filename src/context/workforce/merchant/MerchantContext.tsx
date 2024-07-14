'use client'

import React, { createContext, useContext, useEffect, useState, useReducer, useCallback } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { QueryAllMerchant, CreateMerchant, DeleteMerchant, EditMerchant } from '@/libs/gqls/merchant';
import { useSnackbar } from 'src/components/snackbar';
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

const MerchatProvider = createContext({})

export const UseMerchantContext = () => {
    return useContext(MerchatProvider)
}

// types
export type stateProps = {
    merchantData:any;
    isLoading:boolean;
    totalRecords:number;
}

export type actionProps = {
    type:'Create' | 'Edit' | 'Delete' | 'Fetch',
    payload:any
}

type MerchantContextProps = {
    children:React.ReactNode
}

const initialState = {
    merchantData:[],
    isLoading:true
}

const reducer = (state:stateProps, action:actionProps) => {
    switch(action.type){
        case "Fetch":
            console.log(action.payload,'PAYLOAD')
            state.merchantData = action.payload;
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



const MerchantContext = ({children}:MerchantContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [toRefetch, setToRefetch] = useState<number>(0);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
 
    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    // get all merchant user
    const [getMerchant, getMerchantResult] = useLazyQuery(QueryAllMerchant, {
     context: {
        requestTrackerId: 'merchant[QueryAllMerchantUsers]',
        },
        // notifyOnNetworkStatusChange: true,
        fetchPolicy:'no-cache'
    });

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
                console.log(data?.QueryAllMerchant?.merchantType,'REFETCH')
                dispatch({
                    type:"Fetch",
                    payload:data?.QueryAllMerchant?.merchantType
                })

              
               
            }
        })
    },[table.page, table.rowsPerPage, toRefetch])

    // end of fetching merchant user

    // create merchant user
    const [createMerchant] = useMutation(CreateMerchant, {
        context: {
          requestTrackerId: 'Create_Merchant[Merchant_User]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const createMerchantFunc = useCallback((user:any)=>{
        createMerchant({
            variables:{
                data:user
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            // dispatch({
            //     type:"Create",
            //     payload:data.CreateMerchant
            // })
            enqueueSnackbar("Created Merchant Succesfully")
          
        })
    },[])


    // end of create merchant user

    // delete merchant
    const [DeleteMerchantF] = useMutation(DeleteMerchant, {
        context: {
          requestTrackerId: 'Delete_Merchant[Merchant_User_Delete]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const DeleteMerchantFunc = useCallback((id:any)=>{
        DeleteMerchantF({
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
            // dispatch({
            //     type:"Delete",
            //     payload:data.CreateMerchant
            // })
            enqueueSnackbar("Deleted Merchant Succesfully")
          
        })
    },[])


    // end of delete merchant

      // delete merchant
      const [UpdateMerchantF] = useMutation(EditMerchant, {
        context: {
          requestTrackerId: 'Update_Merchant[Merchant_User_Update]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const UpdateMerchantFunc = useCallback((user:any)=>{
        UpdateMerchantF({
            variables:{
                data:{
                    ...user
                }
            }
        }).then((res)=>{
            const {data} = res;
            setToRefetch((prev)=>{
                return prev += 1
            })
            // dispatch({
            //     type:"Delete",
            //     payload:data.CreateMerchant
            // })
            enqueueSnackbar("Updated Succesfully")
          
        })
    },[])


    // end of delete merchant


  return (
    <MerchatProvider.Provider value={{state, UpdateMerchantFunc, createMerchantFunc,DeleteMerchantFunc, table}}>
        {children}
    </MerchatProvider.Provider> 
  )
}

export default MerchantContext