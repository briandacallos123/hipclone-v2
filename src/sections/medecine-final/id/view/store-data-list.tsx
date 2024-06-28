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
    data: []
}



const StoreDataList = ({ data }: any) => {
    

    const isRow = false
    const { addOrder }: any = useOrdersContext()
    const [loading, setLoading]:any = useState(true)
    const handleView = useCallback((id: number) => {
        // router.push(paths.dashboard.medecine.view(id));
    }, [])


    const handleAddOrder = (data: any) => {
        addOrder(data)
    }

    useEffect(()=>{
        if(data){
            setLoading(false)
        }
    },[data])

    const notFound = !loading && !data?.medecine_list?.length

    return (
        <Box sx={{
            mt: 3,
          
        }}><Table>
                <TableNoData notFound={notFound} />
            </Table>
            {loading && <StoreSkeleton/>}

            <Grid justifyContent="flex-start" container gap={2}>
                {
                    data?.medecine_list?.map((item: any) => {
                     

                        return (
                            <DataListItem key={item?.id} item={item}/>
                        )
                    })
                }
            </Grid>
        </Box >
    )
}

export default StoreDataList