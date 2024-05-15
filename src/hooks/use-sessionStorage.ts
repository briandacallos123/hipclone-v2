"use client"

import React, { useCallback } from 'react'

export const useSessionStorage = () => {
    const addItem = useCallback((key:any, val:any)=>{
      if(!key || !val) return false

      sessionStorage.setItem(key, val)
    },[])

    const getItem = useCallback((key:any)=>{
      if(!key) return false;

  
      let data:any = sessionStorage.getItem(key);
       data = JSON.parse(data);
   
      
      return data;
    },[])


  return {addItem, getItem}
}
