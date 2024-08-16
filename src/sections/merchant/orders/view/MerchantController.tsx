'use client'

import React, { createContext, useContext, useEffect, useState, useReducer, useCallback } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { QueryAllMedicineOrders, DeleteOrder, UpdateOrder } from '@/libs/gqls/Orders';
import { QueryAllMerchantMedicine, CreateMerchantMedecine, DeleteMerchantMedicine } from '@/libs/gqls/merchantUser';
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
    children: React.ReactNode
}

const initialState = {
    orders: [],
    summary: {
        delivery: 0,
        pickup: 0,
        pending:0,
        cancelled:0,
        done:0,
        approved:0
    },
    totalRecords: 0
}


const defaultFilters = {
    name: '',
    status: -1,
    hospital: [],
    startDate: null,
    endDate: null,
};


const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "Fetch":

            const { orderType, summary, totalRecords } = action.payload;

            return {
                ...state,
                orders:orderType,
                summary:{
                    ...summary
                },
                totalRecords:totalRecords
            };
        case "Create":
            console.log(action.payload, '????')
            const newMerchant = [...state.merchantData, action.payload]
            return { ...state, merchantData: newMerchant }

        default:
            return state
    }
}




const MerchantController = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    
    const [toRefetch, setToRefetch] = useState<number>(0);
    const { user, socket } = useAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [filters, setFilters]: any = useState(defaultFilters);


    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    // get all merchant user
    const [getAllOrders, getOrdersResult] = useLazyQuery(QueryAllMedicineOrders, {
        context: {
            requestTrackerId: 'orders[QueryAllOrde]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        getAllOrders({
            variables: {
                data: {
                    skip: table.page * table.rowsPerPage,
                    take: table.rowsPerPage,
                    status: filters.status,
                    is_deliver:null,
                    search:filters.search,
                    orderBy:table.orderBy,
                    orderDir:table.order
                }
            }
        }).then((res: any) => {
            const { data } = res;
            if (data) {
                dispatch({
                    type: "Fetch",
                    payload: data?.QueryAllMedicineOrders

                })

            }
        })
    }, [table.page,table.orderBy, table.order, table.rowsPerPage, getOrdersResult?.data, filters.status, filters.search])

    // create merchant medecine
    const [createMerchantFuncMed] = useMutation(CreateMerchantMedecine, {
        context: {
            requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const createMerchantMedFunc = useCallback((user: any) => {
        createMerchantFuncMed({
            variables: {
                data: user
            }
        }).then((res) => {
            const { data } = res;
            getOrdersResult.refetch()
            enqueueSnackbar("Created Medecine Succesfully")
        })
    }, [getOrdersResult])

    // delete

    const [deleteMerchantFuncOrder] = useMutation(DeleteOrder, {
        context: {
            requestTrackerId: 'Create_Merch[Merchant_User_Key]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const [doneMerchantFuncOrder] = useMutation(UpdateOrder, {
        context: {
            requestTrackerId: 'Done_Merch[Merchant_Done_Key]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const deletedMerchantMedFunc = useCallback((user: any) => {
        deleteMerchantFuncOrder({
            variables: {
                data: {
                    id:Number(user)
                }
            }
        }).then((res) => {
            const { data } = res;
            enqueueSnackbar("Deleted Order Succesfully")
            getOrdersResult.refetch()
        })
    }, [getOrdersResult])

    const handleFilters = useCallback(
        (name: string, value: any) => {
            table.onResetPage();
            setFilters((prevState: any) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    // merchant / mark as done the order
    
    const doneMerchantOrderFunc = useCallback((model: any) => {
      
        doneMerchantFuncOrder({
            variables: {
                data: {
                    order_id:Number(model?.order_id),
                    status:Number(model?.status),
                    patientEmail:model?.patientEmail
                }
            }
        }).then((res) => {
            const { data } = res;
            enqueueSnackbar("Updated successfully")
            getOrdersResult.refetch()
        })
    }, [getOrdersResult])


    const handleFilterStatus = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );



    // end of create merchant user

    return {state, handleFilterStatus,getOrdersResult,doneMerchantOrderFunc, handleFilters, filters, table, createMerchantMedFunc, deletedMerchantMedFunc}
}

export default MerchantController