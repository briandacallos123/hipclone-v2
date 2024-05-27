
import React from 'react'
import { MedecineList } from '@/sections/medecine/view'
import OrderContext from '@/context/dashboard/medecine/Medecine'


const page = () => {
  return (
    <OrderContext>
         <MedecineList/>
    </OrderContext>
   
  )
}

export default page