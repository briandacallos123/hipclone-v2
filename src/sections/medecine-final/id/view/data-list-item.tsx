import Iconify from '@/components/iconify';
import { fCurrency } from '@/utils/format-number';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'

import { useCheckoutContext } from '@/context/checkout/Checkout';

type DataListItemProps = {
    item: any;
}

const DataListItem = ({ item }: DataListItemProps) => {
    const { addToCart, removeToCart, decretementItem }: any = useCheckoutContext()
    const [qtyValue, setQtyValue] = useState(0)
    const [operation, setOperation] = useState(null);

    const { id, attachment_info, price,stock, generic_name, description, address, rating, product_types } = item;

    console.log(item,'??????????????')
    const isRow = false

    const handleMinus = useCallback(() => {
        setOperation('minus')
        setQtyValue((prev) => {
            return prev -= 1;
        })
    }, [])

    const handleAdd = useCallback(() => {
        setOperation('add')
        setQtyValue((prev) => {
            if(prev < stock){
                return prev += 1;
            }else{
                return prev
            }
        })

    }, [])

    useEffect(() => {
        if (operation) {
            if (operation === 'add') {
                addToCart({ ...item, itemQty: qtyValue })

            } else {
                decretementItem(item?.id)
            }
        }
    }, [operation, qtyValue])

    return (
        <Grid xl={isRow ? 12 : 3}>

            <Card sx={{ maxWidth: isRow ? '100%' : 400 }}>
                <CardActionArea

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
                                <Typography variant="body2" >
                                    {`${stock} ${stock > 1 ? 'stocks':'stock'} available`}
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
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>


                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Iconify onClick={handleMinus} icon="line-md:minus" />
                                    {qtyValue}
                                    <Iconify onClick={handleAdd} icon="iconamoon:sign-plus-bold" />
                                </Stack>

                            </Box>

                        </CardContent>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default DataListItem