'use client'

import React, { createContext, useContext, useEffect, useState, useReducer, useCallback } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { QueryAllMerchantMedicine, CreateMerchantMedecine, DeleteMerchantMedicine} from '@/libs/gqls/merchantUser';
import { useSnackbar } from 'src/components/snackbar';
import { stateProps, actionProps } from '../workforce/merchant/MerchantContext';
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
import { revalidateStore } from '@/sections/store_manage/actions/store';
//   import { useSnackbar } from 'src/components/snackbar';
const MerchantUserProvider = createContext({})
import StoreManageController from '@/sections/store_manage/view/storeManageController';

export const UseMerchantMedContext = () => {
    return useContext(MerchantUserProvider)
}

type MerchantUserContextProps = {
    children:React.ReactNode
}

const initialState = {
    merchantData:[],
    totalRecords:0,
}


const reducer = (state:stateProps, action:actionProps) => {
    switch(action.type){
        case "Fetch":
            console.log(action.payload,'PAYLOAD')
            state.merchantData = action.payload?.MedicineType;
            state.totalRecords = action?.payload?.totalRecords
            return state;
        case "Create":
            console.log(action.payload,'????')
            const newMerchant = [...state.merchantData, action.payload]
            return {...state, merchantData:newMerchant}

        default:
            return state
    }
}




const MerchantUserContext = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {queryResults} = StoreManageController()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

     // get all merchant user
     const [getMerchant, getMerchantResult] = useLazyQuery(QueryAllMerchantMedicine, {
        context: {
           requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
           },
           notifyOnNetworkStatusChange: true,
        //    fetchPolicy:'no-cache'
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
                dispatch({
                    type:"Fetch",
                    payload:data?.QueryAllMerchantMedicine
                })
               
               }
           })
       },[table.page, table.rowsPerPage, getMerchantResult?.data])

        // create merchant medecine
    const [createMerchantFuncMed] = useMutation(CreateMerchantMedecine, {
        context: {
          requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
      });
    
    const createMerchantMedFunc = useCallback((user:any, file:any)=>{
        createMerchantFuncMed({
            variables:{
                data:user,
                file
            }
        }).then((res)=>{
            const {data} = res;
            enqueueSnackbar("Created Medecine Succesfully")
            queryResults.refetch()

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
            getMerchantResult.refetch()
            enqueueSnackbar("Deleted Medecine Succesfully")
        })
    },[getMerchantResult])



    // end of create merchant user

    // return <MerchantUserProvider.Provider value={{state, table, createMerchantMedFunc, deletedMerchantMedFunc}}>
    //     {children}
    // </MerchantUserProvider.Provider>

    return {state, table, createMerchantMedFunc, deletedMerchantMedFunc}
}

export default MerchantUserContext