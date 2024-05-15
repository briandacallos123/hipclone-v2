'use client';

import React from 'react'

type LayoutProps = {
    children:React.ReactNode
}

const layout = ({children}:LayoutProps) => {
  return (
    <div>{children}</div>
  )
}

export default layout