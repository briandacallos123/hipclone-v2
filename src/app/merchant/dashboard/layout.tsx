'use client';

import React from 'react'
import MerchantGuard from '@/auth/guard/merchant-guard';

type LayoutProps = {
    children:React.ReactNode
}

const layout = ({children}:LayoutProps) => {
  return (
    <MerchantGuard>
      {children}
    </MerchantGuard>
  )
}

export default layout