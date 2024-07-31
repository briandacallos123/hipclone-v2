"use client"

import React, { useEffect, useState } from 'react'
import MedecineStoreHeader from '@/sections/medecine-final/view/medecine-store-header'
import prisma from '../../../../prisma/prismaClient'
import StoreManageBreadcramps from './store-manage-breadcramps'
import StoreManageTabs from './store-manage-tabs'
import { serialize, unserialize } from 'php-serialize';
import { Box, Grid } from '@mui/material'
import StoreCreateMedecine from './store-create-medecine'
import { useLazyQuery } from '@apollo/client';
import { QuerySingleStore } from '@/libs/gqls/store'

type StoreManageViewProps = {
    tableData: any;
    singleResult:any
}

// const getStore = async (id: number) => {
//     try {
//         let response = await prisma.merchant_store.findUnique({
//             where: {
//                 id: Number(id)
//             },
//             include: {
//                 attachment_store: true
//             }
//         })
    
//         if (response?.days) {
//             const days = unserialize(unserialize(response?.days))
//             response = { ...response, days }
//         }
//         return response;
//     } catch (error) {
//         console.log(error,'eRRORR____________________________________')
//     }
// }

const StoreManageView = async ({singleResult,  tableData }: StoreManageViewProps) => {


    
      

    return (
        <Box sx={{
            p:{xs:2, lg:0}
        }}>
            <StoreManageBreadcramps
                storeName={tableData?.name}
                address={tableData?.address}
            />
            <MedecineStoreHeader
                        storeName={tableData?.name}
                        product_type={tableData?.product_types}
                        startTime={tableData?.start_time}
                        endTime={tableData?.end_time}
                        rating={tableData?.rating}
                        address={tableData?.address}
                    />
            
            <StoreManageTabs singleResult={singleResult} data={tableData} />
        </Box>
    )
}

export default StoreManageView