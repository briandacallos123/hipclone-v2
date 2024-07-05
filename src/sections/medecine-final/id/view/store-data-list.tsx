"use client"
import Iconify from '@/components/iconify'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Table, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { fCurrency } from '@/utils/format-number'
import { useOrdersContext } from '@/context/checkout/CreateOrder'
import StoreDashboardFiltering from './store-dashboard-filtering'
import { TableNoData } from '@/components/table'
import StoreSkeleton from './medecine-skeleton'
import DataListItem from './data-list-item'

type StoreDataListProps = {
    data: [];
}



const StoreDataList = ({ data, loading }: any) => {
    

    const isRow = false
    const { addOrder }: any = useOrdersContext()
    const handleView = useCallback((id: number) => {
        // router.push(paths.dashboard.medecine.view(id));
    }, [])


    const handleAddOrder = (data: any) => {
        addOrder(data)
    }

   

    const notFound = !loading && !data?.length

    return (
        <Box sx={{
            mt: 3,
          
        }}><Table>
                <TableNoData notFound={notFound} />
            </Table>
            {loading && <StoreSkeleton/>}

            {!loading && data?.length !== 0 && <Grid justifyContent="flex-start" alignItems="flex-start" container gap={2} sx={{
                height:700,
                // backgroundColor:'red'
            }}>
                {data?.map((item: any) => {
                     return (
                        <Grid item lg={3}>
                             <DataListItem key={item?.id} item={item}/>
                        </Grid>
                     )
                 })}
            </Grid>}
        </Box >
    )
}

export default StoreDataList