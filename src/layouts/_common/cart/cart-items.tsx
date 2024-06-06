import React, { useCallback } from 'react'
import Iconify from '@/components/iconify/iconify'
import Image from 'next/image';
import { Box, Stack, Typography } from '@mui/material';
import { fCurrency } from '@/utils/format-number';


type CartItemsRowProps = {
    id: number;
    price: number;
    quantity: number;
    image: any;
    name: string;
}

type CartItemsProps = {
    row: CartItemsRowProps,
    increment: () => void,
    decrement: () => void
}

const CartItems = ({ row, increment, decrement }: CartItemsProps) => {


    const { id, price, quantity, image, name } = row;

    console.log(row, 'ROWWWWWW')

    return (
        <Stack sx={{
            py: 1,
            px: 2
        }} direction="row" alignItems="center" gap={3}>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent:'space-between',
                // bgcolor:'red',
                width:70
            }}>
                <Box sx={{
                    cursor: 'pointer',

                }}>
                    <Iconify onClick={decrement} icon="ic:baseline-minus" />

                </Box>
                {quantity}
                <Box sx={{
                    cursor: 'pointer'
                }}>
                    <Iconify onClick={increment} icon="ic:baseline-plus" />
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <img height={50} width={50} alt={name} src={`http://localhost:9092/${image?.split('/').splice(1).join('/')}`} />
                    <Typography variant="h6">
                        {name}
                    </Typography>
                </Box>
                <Box>
                    <Typography sx={{
                        justifySelf: 'flex-end'
                    }} variant="h6">
                        ₱ {fCurrency(price * quantity)}
                    </Typography>
                </Box>

            </Box>

        </Stack>
    )
}

export default CartItems