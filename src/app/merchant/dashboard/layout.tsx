'use client';

import React from 'react'
import MerchantGuard from '@/auth/guard/merchant-guard';
import MerchantLayout from '@/layouts/merchant/layout';
import MerchantUserContext from '@/context/merchant/Merchant';
// import OrderContext from '@/context/dashboard/medecine/Medecine';
import MerchantUserOrderContext from '@/context/merchant/orders/MerchantOrders';
import Checkout from '@/context/checkout/Checkout';

type LayoutProps = {
  children: React.ReactNode
}

const layout = ({ children }: LayoutProps) => {

 
  return (

    <MerchantGuard>
      <MerchantLayout>
        <MerchantUserContext>
          <Checkout>
          {children}
          </Checkout>
        </MerchantUserContext>
      </MerchantLayout>
    </MerchantGuard>
  )
}

export default layout