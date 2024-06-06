"use client"

import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'

const CartContext = createContext({})

export const useOrdersContext = () => {
    return useContext(CartContext)
}

const initialState = {
    order: null,
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "Add":
            const { brand_name, id, description, price, attachment_info, quantity, qty } = action.payload;
        
            const newItem = {
                id,
                name: brand_name,
                price,
                quantity: qty,
                image: attachment_info?.file_path,
                brand_name,
                attachment_info
            };
    
            return {...state, order:newItem}
            // const isExists = state.orders.find((item: any) => Number(item.id) === Number(id));
          
            // if (isExists) {
                
            //     const updatedCart = state.orders.map((item: any) => {
            //         if (Number(item.id) === Number(id)) {
            //             return { ...item, quantity: quantity + 1};
            //         }
            //         return item;
            //     });
        
                
        
            //     return { ...state, orders: updatedCart };
            // } else {
                
            //     const newItem = {
            //         id,
            //         name: brand_name,
            //         price,
            //         quantity: qty,
            //         image: attachment_info?.file_path,
            //         brand_name,
            //         attachment_info
            //     };
        
            //     const newCart = [...state.orders, newItem];
        
            //     return { ...state, orders: newCart };
            // }
        
            case "Remove":
            return {...state, order:null}
              

    }
}

const CreateOrder = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const addOrder = useCallback((data: any) => {
        
        dispatch({
            type: "Add",
            payload: {
                ...data,
            }
        })
    }, [])

    const removeOrder = useCallback((data: any) => {
        dispatch({
            type: "Remove"
        })
    }, [])



    return (
        <CartContext.Provider value={{ state, addOrder, removeOrder }}>
            {children}
        </CartContext.Provider>
    )
}

export default CreateOrder