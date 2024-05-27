import type { Metadata } from 'next'
import React, { ReactNode } from 'react'
import MerchantUserOrderContext from '@/context/merchant/orders/MerchantOrders'

export const metadata:Metadata = {
    title:"Merchant Orders"
}

const layout = ({children}:{children:ReactNode}) => {
  return (
    <MerchantUserOrderContext>
          {children}
    </MerchantUserOrderContext>
  )
}

export default layout