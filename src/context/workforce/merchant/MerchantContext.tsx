'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { QueryAllMerchant } from '@/libs/gqls/merchant';

const MerchatProvider = createContext({})

export const UseMerchantContext = () => {
    return useContext(MerchatProvider)
}

type MerchantContextProps = {
    children:React.ReactNode
}

const MerchantContext = ({children}:MerchantContextProps) => {
    const [merchantData, setMerchantData] = useState({});
    const [isLoading, setLoading] = useState(true)

    const [getMerchant, { data, loading, error }] = useLazyQuery(QueryAllMerchant, {
     context: {
        requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(()=>{
        getMerchant({
            variables:{
                data:{

                }
            }
        }).then((res:any)=>{
            const {data} = res;
            if(data){
                setMerchantData(data?.QueryAllMerchant?.merchantType)
            }
            setLoading(false)

        })
    },[])


  return (
    <MerchatProvider.Provider value={{merchantData, isLoading}}>

    </MerchatProvider.Provider> 
  )
}

export default MerchantContext