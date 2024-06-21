"use client"
import Iconify from '@/components/iconify'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Table, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { fCurrency } from '@/utils/format-number'
import { useOrdersContext } from '@/context/checkout/CreateOrder'
import StoreDashboardFiltering from './store-dashboard-filtering'
import { TableNoData } from '@/components/table'
import StoreSkeleton from './medecine-skeleton'

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
                        const { id, attachment_info, price, generic_name, description, address, rating, product_types } = item;

                        return (
                            <Grid xl={isRow ? 12 : 3}>

                                <Card sx={{ maxWidth: isRow ? '100%' : 400 }}>
                                    <CardActionArea
                                        onClick={() => {
                                            handleView(id)
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Box sx={{
                                                width: '30%'
                                            }}>
                                                <CardMedia
                                                    component="img"
                                                    image={`https://hip.apgitsolutions.com/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
                                                    alt={generic_name}
                                                    height="100%"
                                                    width="100%"
                                                />
                                            </Box>
                                            <CardContent sx={{
                                                display: isRow && 'flex',
                                                alignItems: isRow && 'center',
                                                width: '70%',
                                                justifyContent: isRow && 'space-between',
                                            }}>
                                                <Box sx={{
                                                    width: '100%'
                                                }}>
                                                    <Typography variant="h6" >
                                                        {`${generic_name}`}
                                                    </Typography>

                                                    <Typography sx={{
                                                        textTransform: 'capitalize',
                                                        mt: 2
                                                    }} variant="body2" color="grey">
                                                        {description}
                                                    </Typography>
                                                    <Typography sx={{
                                                        mt: 2
                                                    }}>
                                                        ₱ {fCurrency(price)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end'
                                                }}>
                                                    <Iconify onClick={() => {
                                                        handleAddOrder(item)
                                                    }} width={30} icon="mdi:plus-circle" color="green" />
                                                </Box>

                                            </CardContent>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Box >
    )
}

export default StoreDataList