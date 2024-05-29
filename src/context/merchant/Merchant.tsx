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
//   import { useSnackbar } from 'src/components/snackbar';
const MerchantUserProvider = createContext({})

export const UseMerchantMedContext = () => {
    return useContext(MerchantUserProvider)
}

type MerchantUserContextProps = {
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




const MerchantUserContext = ({children}:MerchantUserContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [toRefetch, setToRefetch] = useState<number>(0);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

     // get all merchant user
     const [getMerchant, getMerchantResult] = useLazyQuery(QueryAllMerchantMedicine, {
        context: {
           requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
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
                   console.log(data,'REFETCH@@@@@')
                dispatch({
                    type:"Fetch",
                    payload:data?.QueryAllMerchantMedicine?.MedicineType
                })
               
               }
           })
       },[table.page, table.rowsPerPage])

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

export default MerchantUserContext