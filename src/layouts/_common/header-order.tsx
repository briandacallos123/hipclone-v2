import Iconify from '@/components/iconify/iconify'
import { Badge, Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { varHover } from 'src/components/animate';
import { m } from 'framer-motion';
import { useBoolean } from '@/hooks/use-boolean';
import CartItems from './cart/cart-items';
import { fCurrency } from '@/utils/format-number';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { useRouter } from 'next/navigation';
import { useOrdersContext } from '@/context/checkout/CreateOrder'; 
import FormProvider, { RHFRadioGroup, RHFTextField } from '@/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, FieldValues } from 'react-hook-form';


type HeaderCartProps = {
    order:any
}




const formOptions = [
    {
        label: "Tablet",
        value: "Tablet"
    },
    {
        label: "Capsule",
        value: "Capsule"
    },
    {
        label: "Liquid",
        value: "Liquid"
    },
]
const brandOptions = [
    {
        label: "Branded",
        value: "Branded"
    },
    {
        label: "Generic",
        value: "Generic"
    },
]


const HeaderOrders = ({order}:HeaderCartProps) => {
    const {state, addOrder, removeOrder}:any = useOrdersContext()

    const router = useRouter();
    const drawer = useBoolean();
    const {addToCart, state:cartState, incrementCart}:any = useCheckoutContext()
    const { id, price, quantity, image, name, dose, store_id, generic_name } = order;
    

    const isExistsToCart = cartState.cart?.find((item:any)=>item.id === Number(order.id));

  

    const renderHead = (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Iconify
                onClose={()=>{
                    drawer.onFalse()
                }}
                       icon="material-symbols:close"
                        width={24}
                    />
            </Typography>

        </Stack>
    );

  
    useEffect(()=>{
        drawer.onTrue()
    },[])

    const NewNoteSchema = Yup.object().shape({
        form:Yup.string().required('Form is required'),
        type:Yup.string().required('Type is required'),
        quantity:Yup.number().required('Quantity is required'),
        
    });

    const defaultValues = useMemo(
        () => ({
            id: order?.id || isExistsToCart?.id || '',
            image: order?.image || isExistsToCart?.image || '',
            name:order?.name || isExistsToCart?.name || '',
            form:isExistsToCart?.form || "",
            type:isExistsToCart?.type || "",
            quantity:order?.quantity || isExistsToCart?.quantity || "",
            price:order?.price || price || 0,
            brand_name:order?.brand_name,
            attachment_info:order?.attachment_info,
            dose: order?.dose || '',
            store_id: order?.store_id || '',
            generic_name: order?.generic_name || '',
            medecine_id:order?.medecine_id || ''

        }),
        []
    );

    const methods = useForm<FieldValues>({
        resolver: yupResolver(NewNoteSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            console.log(isExistsToCart,'AWITTTTTT')
            try {
               

                if(isExistsToCart){
                    incrementCart(data)
                }else{

                    addToCart(data, data.quantity)
                }
                drawer.onFalse()
                removeOrder()
            } catch (error) {
                console.error(error);
            }
        },
        [isExistsToCart]
    );

   
    return (
        <>
            <Drawer
                open={drawer.value}
                onClose={()=>{
                    drawer.onFalse()
                    removeOrder()
                }}
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

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{
                py: 1,
                px: 2
            }} direction="column" alignItems="flex-start" gap={3}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width:'100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        pt: 2,
                    }}>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <img height={100} width={100} alt={name} src={`https://hip.apgitsolutions.com/${image?.split('/').splice(1).join('/')}`} />
                            <Typography variant="h6">
                                {name}
                            </Typography>
                        </Box>
                        <Typography variant="h6">
                            ₱ {price}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    gap:3
                }}>
                    <Box>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="h6">Form: </Typography>
                            <Typography variant="body2">Pick 1</Typography>
                        </Stack>
                        <Stack>
                            <RHFRadioGroup
                                name="form"
                                row
                                options={formOptions}
                                sx={{
                                    '& .MuiFormControlLabel-root': { mr: 4 },
                                }}
                            />
                        </Stack>
                    </Box>
                    <Box>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="h6">Type: </Typography>
                            <Typography variant="body2">Pick 1</Typography>
                        </Stack>
                        <Stack>
                            <RHFRadioGroup
                                name="type"
                                row
                                options={brandOptions}
                                sx={{
                                    '& .MuiFormControlLabel-root': { mr: 4 },
                                }}
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="h6">Quantity: </Typography>
                        </Stack>
                        <Stack>
                        <RHFTextField name={`quantity`}/>
                           
                        </Stack>
                    </Box>
                </Box>

            </Stack>
            <Box sx={{ p: 1, mt:'auto' }}>
                       
                       <Button type="submit" variant="contained" color="success" component={m.button}  fullWidth size="large">
                           Add to cart
                       </Button>
                   </Box>
        </FormProvider>
                   
                    
               
            </Drawer>
        </>
    )
}

export default HeaderOrders