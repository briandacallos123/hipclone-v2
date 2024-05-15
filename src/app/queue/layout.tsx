"use client"

import React from 'react'
import { AuthGuard } from 'src/auth/guard';

type layoutProp = {
    children:string
}

const layout = ({children}:layoutProp) => {
  return (
   <>
     {children}
   </>
  )
}

export default layout