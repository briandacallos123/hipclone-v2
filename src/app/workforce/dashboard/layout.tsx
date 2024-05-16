"use client"

import React from 'react'
import AdminGuard from '@/auth/guard/admin-guard'
import AdminLayout from '@/layouts/admin/layout'

import { MerchantProvider } from '@/context'

type LayoutProps = {
    children:React.ReactNode
}

const layout = ({children}:LayoutProps) => {
  return (
        <AdminGuard>
            <AdminLayout>
              <MerchantProvider>
                {children}
              </MerchantProvider>
            </AdminLayout>
        </AdminGuard>
  )
}

export default layout