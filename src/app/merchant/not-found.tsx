"use client "
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NotFound = () => {
    const router = useRouter();

    useEffect(()=>{
        router.push('/')
    },[])
  return (
    <div>NotFound</div>
  )
}

export default NotFound