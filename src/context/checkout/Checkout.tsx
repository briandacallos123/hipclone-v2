"use client"

import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'

const CartContext = createContext({})

export const useCheckoutContext = () => {
    return useContext(CartContext)
}

const initialState = {
    cart: [],
    total: 0,
    activeStep: 0,
    discount: 0,
    subTotal: 0,
    billingAddress: {}
}

const reducer = (state: any, action: any) => {
    switch (action.type) {

        case "Reset":

            state.cart = []
            state.total = 0
            state.activeStep = 0;
            state.discount = 0,
            state.subTotal = 0,
            state.billingAddress = null

            return state

        case "Fill":
            const payl = action.payload.cartItem;

            return { ...state, cart: [...payl?.cart], total: Number(payl?.total) }
       
            case "AddAddress":
            const address = action.payload?.name
            const contact = action.payload?.phoneNumber

            const billAdd = {
                name:address,
                contact
            }

            const addStep = state.activeStep + 1;
            return { ...state, billingAddress: {...billAdd},activeStep:addStep  }

        case "IncrementSetup":
            const currentStep = state.activeStep + 1;
            return { ...state, activeStep: currentStep }
        case "DecrementSetup":
            const currentSteps = state.activeStep - 1;
            return { ...state, activeStep: currentSteps }
        case "Add":
            const { brand_name,merchant_store, itemQty, medecine_id, generic_name,dose, id, form, type, description, price, attachment_info, quantity, qty } = action.payload;

       
            const isExists = state.cart.find((item: any) => Number(item.id) === Number(id));

            if (isExists) {
                // If the item already exists in the cart, update its quantity and calculate the new total
                const updatedCart = state.cart.map((item: any) => {
                    if (Number(item.id) === Number(id)) {
                        return { ...item, quantity: Number(item?.quantity) +  itemQty};
                    }
                    return item;
                });

                const newTotal = Number(state.total) + (Number(price) * itemQty);

                return { ...state, cart: updatedCart, total: newTotal };
            } else {
                // If the item is new, add it to the cart and calculate the new total
                const newItem = {
                    id,
                    name: brand_name,
                    price,
                    form,
                    type,
                    quantity: Number(itemQty),
                    dose,
                    generic_name,
                    store_id:merchant_store?.id,
                    image: attachment_info?.file_path,
                    brand_name,
                    attachment_info,
                    medecine_id
                };

                const newCart = [...state.cart, newItem];
                const newTotal = state.total + (Number(price) * Number(itemQty));

                return { ...state, cart: newCart, total: newTotal };
            }

        case "DecrementItem":
            const idPayload = action.payload;

            const targetIte = state?.cart?.find((item)=>Number(item.id) === Number(idPayload));
            console.log(targetIte,'targetItetargetItetargetItetargetItetargetItetargetItetargetItetargetItetargetItetargetIte')

            if(targetIte.quantity !== 1){
                const newCart = state?.cart?.map((item:any)=>{
                    if(Number(item?.id) === Number(idPayload)){
                        if(item?.quantity !== 1){
                            return {...item, quantity: item?.quantity - 1}
                        }else{
    
                        }
                    }else{
                        return item;
                    }
                }) 
                return {...state, cart:newCart}
            }else{
                
                const newCart = state?.cart?.filter((item:any)=>Number(item?.id) !== Number(idPayload))
                localStorage.setItem('isLast','true')
                return {...state, cart:newCart}
            }

           
        case "Decrement":
            const { id: id2 }: any = action.payload;

            // Find the item in the cart
            const itemIndex = state.cart.findIndex((item: any) => Number(item.id) === Number(id2));
            console.log(itemIndex,'YEHAHHH')
            const latestTotal =  state.total - (1* state.cart[itemIndex]?.price)
            console.log(latestTotal,'latestTotallatestTotal')

            // If the item exists and its quantity is not already zero
            if (itemIndex !== -1 && state.cart[itemIndex].quantity >= 2) {
                // Create a new cart array with the updated quantity
                const updatedCart = state.cart.map((item: any, index: number) => {
                    if (index === itemIndex) {
                        return { ...item, quantity: item.quantity - 1, total:latestTotal };
                    }
                    return item;
                });

                // Return a new state object with the updated cart
                return { ...state, cart: updatedCart, total:latestTotal };
            } else {
                const updatedCart = state.cart.filter((item: any) => Number(item.id) !== Number(id2))

                localStorage.setItem('openCart', '0')

                return { ...state, cart: updatedCart, total:latestTotal };
            }
        // this incremenet function is only for adding orders and cart
        case "Increment":
            console.log(action.payload, 'PAYLOAD________')
            const payload = action.payload

            const newTotal = state.total + (payload?.price * payload?.quantity);

            const newData = state.cart.map((item: any) => {
                if (Number(item.id) === Number(payload?.id)) {
                    return { ...item, quantity: Number(payload.quantity) };
                } else {
                    return item;
                }
            })

            return { ...state, cart: newData, total: newTotal }
        // this is function used in cart
        case "IncrementItemCheckout":
            console.log(action.payload, 'PAYLOAD________')
            const payloads = action.payload

            const newTotals = state.total + payloads?.price  ;

            const newDatas = state.cart.map((item: any) => {
                if (Number(item.id) === Number(payloads?.id)) {
                    return { ...item, quantity: Number(payloads.quantity) + 1 };
                } else {
                    return item;
                }
            })

            return { ...state, cart: newDatas, total: newTotals }
        case "RemoveItem":
            const target = action.payload;
            const isExistss = state.cart.find((item: any) => item.id === target.id)


            const newItems = isExistss && state.cart.filter((item: any) => Number(item.id) !== Number(target.id));

            const currentTot = (isExistss.price * isExistss.quantity)

            const newTot = state.total - currentTot
            
            const lastItem = state.cart.length === 1;

            return { ...state, cart: newItems, total: lastItem ? 0 : newTot }
    }

}

const Checkout = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState)

 
    console.log(state,'STATAEEEEEEEEEEEEEE')
    useEffect(() => {
        const isLast = localStorage?.getItem('isLast');

        if (state?.cart?.length !== 0 || isLast) {
            localStorage.setItem('cart', JSON.stringify(state))
        }

        if(isLast){
            localStorage.removeItem('isLast')
        }

    }, [state])

    useEffect(() => {
        const isExist = localStorage.getItem('cart')
        const cartItem = isExist && JSON.parse(localStorage.getItem('cart'));
     

        if (cartItem && cartItem?.cart) {
            dispatch({
                type: "Fill",
                payload: {
                    cartItem
                }
            })
        }
    }, [])


    const addToCart = useCallback((data: any) => {
        console.log(data,'DATAAAAAAAAAAAAAAAAA ADD TO CARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
        dispatch({
            type: "Add",
            payload: {
                ...data,
            }
        })
    }, [])

    const removeToCart = useCallback((data: any) => {
        if(state?.cart?.length === 1 && data?.quantity === 1){
            localStorage.setItem('isLast','true')
        }


        dispatch({
            type: "Decrement",
            payload: data
        })
    }, [state?.cart])

    const incrementCart = useCallback((data: any) => {

        dispatch({
            type: "Increment",
            payload: data
        })
    }, [])

    const incrementCheckout = useCallback((data: any) => {

        dispatch({
            type: "IncrementItemCheckout",
            payload: data
        })
    }, [])

    const incrementSetup = useCallback((data: any) => {

        dispatch({
            type: "IncrementSetup",
            payload: data
        })
    }, [])

    const decrementSetup = useCallback((data: any) => {

        dispatch({
            type: "DecrementSetup",
            payload: data
        })
    }, [])

    const removeItem = useCallback((data: any) => {
        if(state?.cart?.length === 1){
            localStorage.removeItem('cart')
        }
        dispatch({
            type: "RemoveItem",
            payload: data
        })
    }, [state?.cart])

    const addAddress = useCallback((data: any) => {

        dispatch({
            type: "AddAddress",
            payload: data
        })
    }, [])

    const resetCheckout = useCallback(()=>{
        dispatch({
            type: "Reset"
        })
    },[])

    const decretementItem = useCallback((id:number)=>{
        dispatch({
            type:"DecrementItem",
            payload:id
        })
    },[])



    return (
        <CartContext.Provider value={{ state, decretementItem, resetCheckout, removeToCart, decrementSetup, incrementSetup, addToCart, incrementCheckout, incrementCart, removeItem, addAddress }}>
            {children}
        </CartContext.Provider>
    )
}

export default Checkout