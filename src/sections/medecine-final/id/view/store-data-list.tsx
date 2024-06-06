"use client"
import Iconify from '@/components/iconify'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { fCurrency } from '@/utils/format-number'
import { useOrdersContext } from '@/context/checkout/CreateOrder'

type StoreDataListProps = {
    data: []
}

const StoreDataList = ({ data }: StoreDataListProps) => {
    const isRow = false
    const {addOrder} = useOrdersContext()

    const handleView = useCallback((id: number) => {
        // router.push(paths.dashboard.medecine.view(id));
    }, [])

    const handleAddOrder = (data:any) => {
        addOrder(data)
    }

    return (
        <Box sx={{
            mt: 3,
            
        }}>
            <Grid  justifyContent="flex-start" container gap={2}>
                {
                    data?.map((item:any) => {
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
                                                image={`http://localhost:9092/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
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
                                                <Iconify onClick={()=>{
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