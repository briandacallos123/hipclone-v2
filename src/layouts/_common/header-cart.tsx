import Iconify from '@/components/iconify/iconify'
import { Badge, Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { varHover } from 'src/components/animate';
import { m } from 'framer-motion';
import { useBoolean } from '@/hooks/use-boolean';
import CartItems from './cart/cart-items';
import { fCurrency } from '@/utils/format-number';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { useRouter } from 'next/navigation';

type HeaderCartProps = {
    count:number;
    cart:[]
}

const HeaderCart = ({count, cart}:HeaderCartProps) => {
    const {addToCart, removeToCart}:any = useCheckoutContext()
    const router = useRouter();
    const drawer = useBoolean();

    const renderHead = (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Cart
            </Typography>

        </Stack>
    );

    const total = cart?.reduce((acc, current) => {
       return acc += current?.price * current?.quantity
    },0)

    const handleIncrementCart = useCallback((p:any)=>{
        addToCart(p)
    },[])
    
    const handleDecrementCart = useCallback((p:any)=>{
        removeToCart(p)
    },[])
    

    useEffect(()=>{
        const isOpen = localStorage.getItem('openCart');
        console.log(isOpen,'ISOPENNNNN__________', typeof isOpen)
        if(Number(isOpen) !== 0){
            drawer.onTrue()
        }
    },[localStorage.getItem('openCart')])
   

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                color={'primary'}
                onClick={drawer.onTrue}
            >
                <Badge badgeContent={count} color="error">
                    <Iconify
                        className={Boolean(count) && 'bell'}
                        icon="solar:cart-bold"
                        width={24}
                    />
                </Badge>
            </IconButton>

            <Drawer
                open={drawer.value}
                onClose={drawer.onFalse}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: { width: 1, maxWidth: 420, display:'flex', flexDirection:'column' },
                }}
                className="drawer"
            >
                {renderHead}

                <Divider />
                    {cart?.map((item:any)=>(
                        <CartItems 
                        increment={()=>{
                            handleIncrementCart(item)
                        }} 
                        decrement={()=>{
                            handleDecrementCart(item)
                        }}
                        row={item}/>
                    ))}
                <Divider/>
                 <Box sx={{ p: 1, mt:'auto' }}>
                        <Box sx={{
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'space-between',
                            mb:2
                        }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h5">
                            ₱ {fCurrency(total)}
                            </Typography>
                        </Box>
                    <Button onClick={()=>{
                        router.push('/dashboard/medecine-checkout/checkout')
                    }} variant="contained" color="success" component={m.button}  fullWidth size="large">
                        Place Order
                    </Button>
                </Box>
            </Drawer>
        </>
    )
}

export default HeaderCart