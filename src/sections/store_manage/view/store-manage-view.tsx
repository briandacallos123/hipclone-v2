import React from 'react'
import MedecineStoreHeader from '@/sections/medecine-final/view/medecine-store-header'
import prisma from '../../../../prisma/prismaClient'
import StoreManageBreadcramps from './store-manage-breadcramps'
import StoreManageTabs from './store-manage-tabs'
import { serialize, unserialize } from 'php-serialize';
import { Grid } from '@mui/material'
import StoreCreateMedecine from './store-create-medecine'

type StoreManageViewProps = {
    id: number
}

const getStore = async (id: number) => {
    try {
        let response = await prisma.merchant_store.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                attachment_store: true
            }
        })
    
        if (response?.days) {
            const days = unserialize(unserialize(response?.days))
            response = { ...response, days }
        }
        return response;
    } catch (error) {
        console.log(error,'eRRORR____________________________________')
    }
}

const StoreManageView = async ({ id }: StoreManageViewProps) => {
    const data = await getStore(id)

    return (
        <div>
            <StoreManageBreadcramps
                storeName={data.name}
                address={data?.address}
            />
            <MedecineStoreHeader
                        storeName={data.name}
                        product_type={data?.product_types}
                        startTime={data?.start_time}
                        endTime={data?.end_time}
                        rating={data?.rating}
                        address={data?.address}
                    />
            
            <StoreManageTabs data={data} />
        </div>
    )
}

export default StoreManageView