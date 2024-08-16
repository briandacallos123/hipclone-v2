import React, { useCallback } from 'react'
import Iconify from '@/components/iconify/iconify'
import Image from 'next/image';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
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


    const { id, price, quantity, image,generic_name, name, stock } = row;

    const isGood = stock > quantity

    const onIncrement = () => {
        if(!isGood) return null;
        increment()
    }


    return (
        <Stack sx={{
            py: 1,
            px: 2
        }} direction="row" alignItems="center" gap={3}>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'space-between',
                // bgcolor:'red',
                width: 70
            }}>
                <Box sx={{
                    cursor: 'pointer',
                }}>
                    <Iconify onClick={decrement} icon="ic:baseline-minus" />
                </Box>
                {quantity}
                <Box sx={{
                    cursor: isGood ? 'pointer':'not-allowed'
                }}>
                    <Tooltip title={!isGood && 'You\'ve reached the last stock'}>
                        <Iconify onClick={onIncrement} icon="ic:baseline-plus" />

                    </Tooltip>
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
                    <img height={50} width={50} alt={generic_name} src={`/${image?.split('/').splice(1).join('/')}`} />
                    <Typography variant="h6">
                        {generic_name}
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