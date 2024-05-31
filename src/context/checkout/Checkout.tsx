"use client"

import React, {createContext, useCallback, useContext, useReducer} from 'react'

const CartContext = createContext({})

export const useCheckoutContext = () => {
    return useContext(CartContext)
}

const initialState = {
    cart:[],
    total:0
}

const reducer = (state:any, action:any) => {
    switch(action.type){
        case "Add":
            const {brand_name, id, description, price} = action.payload;
            const isExists = state?.cart?.find((item:any)=>Number(item?.id) === Number(action.payload.id))
            let newData:any;
            let newCartData:any;

            console.log(isExists,'??')
            if(isExists){
                isExists.quantity += 1;
                state.total += price;

                newCartData = state.cart.filter((item:any)=>Number(item?.id) !== Number(isExists?.id))
            }else{
                newData = {
                    id,
                    name:brand_name,
                    price,
                    quantity:0,
                }
            }

            const newCart =  isExists && [...newCartData, isExists]

            return {...state, cart:isExists ? newCart : [...state.cart, {...newData}]}
            
            // const newCart = [...state.cart, {...action.payload}];
            // return {...state, cart:newCart}
    }
}

const Checkout = ({children}:any) => {
    const [state, dispatch] = useReducer(reducer, initialState)


    const addToCart = useCallback((data:any)=>{
        dispatch({
            type:"Add",
            payload:data
        })
    },[state])

    console.log(state,'STATE_____________')

  return (
    <CartContext.Provider value={{state, addToCart}}>
        {children}
    </CartContext.Provider>
  )
}

export default Checkout