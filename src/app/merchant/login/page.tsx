"use client"

import React from 'react'
// import NextAuthMerchantView from '@/sections/auth/next-auth-merchant-view'
import NextAuthMerchantView from '../../../sections/auth/next-auth-merchant-view'

const page = () => {
  return (
    <NextAuthMerchantView open={true} onClose={()=>{}}/>
  )
}

export default page