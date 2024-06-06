"use client"

import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'

const CartContext = createContext({})

export const useCheckoutContext = () => {
    return useContext(CartContext)
}

const initialState = {
    cart: [],
    total: 0
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "Add":
            const { brand_name, id,form, type,  description, price, attachment_info, quantity, qty } = action.payload;
        
            
            const isExists = state.cart.find((item: any) => Number(item.id) === Number(id));
          
            if (isExists) {
                // If the item already exists in the cart, update its quantity and calculate the new total
                const updatedCart = state.cart.map((item: any) => {
                    if (Number(item.id) === Number(id)) {
                        return { ...item, quantity: Number(quantity) + Number(1)};
                    }
                    return item;
                });
        
                const newTotal = Number(state.total) + Number(price);
        
                return { ...state, cart: updatedCart, total: newTotal };
            } else {
                // If the item is new, add it to the cart and calculate the new total
                const newItem = {
                    id,
                    name: brand_name,
                    price,
                    form,
                    type,
                    quantity: qty,
                    image: attachment_info?.file_path,
                    brand_name,
                    attachment_info
                };
        
                const newCart = [...state.cart, newItem];
                const newTotal = state.total + price;
        
                return { ...state, cart: newCart, total: newTotal };
            }
        
            case "Decrement":
                const { id: id2 }: any = action.payload;
            
                // Find the item in the cart
                const itemIndex = state.cart.findIndex((item: any) => Number(item.id) === Number(id2));

                
                // If the item exists and its quantity is not already zero
                if (itemIndex !== -1 && state.cart[itemIndex].quantity >= 2) {
                    // Create a new cart array with the updated quantity
                    const updatedCart = state.cart.map((item: any, index: number) => {
                        if (index === itemIndex) {
                            return { ...item, quantity: item.quantity -1 };
                        }
                        return item;
                    });
            
                    // Return a new state object with the updated cart
                    return { ...state, cart: updatedCart };
                }else{
                    const updatedCart = state.cart.filter((item:any)=> Number(item.id) !== Number(id2))
                    
                    localStorage.setItem('openCart','0')

                    return { ...state, cart: updatedCart };
                }
            case "Increment":

                const payload = action.payload

                 const newTotal = state.total + (payload?.price * payload?.quantity);
               
                 const newData = state.cart.map((item:any)=>{
                    if(Number(item.id) === Number(payload?.id)){
                        return { ...item, quantity: Number(item.quantity) + Number(payload.quantity) };
                    }else{
                        return item;
                    }
                })

                return {...state, cart: newData, total:newTotal}
    }
}

const Checkout = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (state.cart?.length) {
            localStorage.setItem('cart', JSON.stringify(state))
        }
    }, [state])
    console.log(state,'STATE')


    const addToCart = useCallback((data: any, qty:number) => {
        console.log()
        dispatch({
            type: "Add",
            payload: {
                ...data,
                qty
            }
        })
    }, [])

    const removeToCart = useCallback((data: any) => {
        dispatch({
            type: "Decrement",
            payload: data
        })
    }, [])

    const incrementCart = useCallback((data: any) => {
        dispatch({
            type: "Increment",
            payload: data
        })
    }, [])




    return (
        <CartContext.Provider value={{ state, addToCart, removeToCart, incrementCart }}>
            {children}
        </CartContext.Provider>
    )
}

export default Checkout