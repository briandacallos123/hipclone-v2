'use client'

import { LogoFull } from '@/components/logo'
import React from 'react'

type layoutProps = {
    children:React.ReactNode
}

const layout = ({children}:layoutProps) => {
  return (
    <div>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
            <LogoFull />
        </div>
        {children}
    </div>
  )
}

export default layout