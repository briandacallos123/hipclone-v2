import React from 'react'
import { StoreManageView } from '@/sections/store_manage'

const page = ({params}) => {
  const {id} = params;
  
  return <StoreManageView id={id}/>
  

}

export default page