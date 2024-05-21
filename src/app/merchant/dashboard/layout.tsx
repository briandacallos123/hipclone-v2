'use client';

import React from 'react'
import MerchantGuard from '@/auth/guard/merchant-guard';
import MerchantLayout from '@/layouts/merchant/layout';


type LayoutProps = {
  children: React.ReactNode
}

const layout = ({ children }: LayoutProps) => {
  return (

    <MerchantGuard>
      <MerchantLayout>
        {children}
      </MerchantLayout>
    </MerchantGuard>
  )
}

export default layout