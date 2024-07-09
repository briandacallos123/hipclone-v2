import Iconify from '@/components/iconify';
import { fCurrency } from '@/utils/format-number';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
// import { useCheckoutContext } from '@/context/checkout/Checkout';

import { useCheckoutContext } from '@/context/checkout/Checkout';

type DataListItemProps = {
    item: any;
}

const DataListItem = ({ item }: DataListItemProps) => {
    const { state, addToCart, removeToCart, decretementItem }: any = useCheckoutContext()
    const { id, attachment_info, show_price, price, stock, generic_name, description, address, rating, product_types } = item;
    const targetItem = state?.cart?.find((item) => Number(item.id) === Number(id))



    const [qtyValue, setQtyValue] = useState(0)
    const [operation, setOperation] = useState(null);

    useEffect(() => {
        if (targetItem?.quantity) {
            setQtyValue(targetItem.quantity)
        }
    }, [state])

    const isRow = false

    const handleMinus = useCallback(() => {
        if (qtyValue !== 0) {

            setOperation('minus')

            setQtyValue((prev) => {
                return prev -= 1;
            })
        } else {
        }
    }, [qtyValue])

    const handleIncrement = useCallback(() => {

        setOperation('add')
        setQtyValue((prev) => {
            if (prev < stock) {
                return prev += 1;
            } else {
                return prev
            }
        })
    }, [qtyValue])

    const handleAdd = useCallback(() => {

      
        if (operation && qtyValue) {
            if (operation === 'add') {
                addToCart({ ...item, itemQty: qtyValue })
            setOperation(null)

            } else {
                decretementItem(item?.id)
            setOperation(null)

            }

           
        }

    }, [qtyValue, operation])

    useEffect(()=>{
       if(!operation){
        setQtyValue(0)
       }
    },[operation])



    // useEffect(() => {
    //     if (operation) {
    //         if (operation === 'add') {
    //             addToCart({ ...item, itemQty: qtyValue })
    //             setOperation(null)
    //         } else {
    //             decretementItem(item?.id)
    //             setOperation(null)

    //         }
    //     }
    // }, [operation, qtyValue])

    return (

        <Card sx={{ maxWidth: isRow ? '100%' : 700 }}>
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
                            {show_price === 1 &&   <Typography variant="body2" >
                                {`${stock} ${stock > 1 ? 'stocks' : 'stock'} available`}
                            </Typography>}

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

                            <Stack justifyContent="center" alignItems="center" gap={2}>

                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Iconify onClick={handleMinus} icon="line-md:minus" />
                                    {qtyValue}
                                    <Iconify onClick={handleIncrement} icon="iconamoon:sign-plus-bold" />
                                </Stack>
                                <Button onClick={handleAdd} variant="contained"  >Add Order</Button>
                            </Stack>

                        </Box>

                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export default DataListItem