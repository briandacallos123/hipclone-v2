import { RegisterDoctor } from '@/sections/findDoctor/signup'
import React from 'react'
import client from '../../../../prisma/prismaClient'

const getAllSpec = async() => {
  const result = await client.specialization.findMany();
  return result;
}

const page = async() => {
  const resSpec = await getAllSpec();

  return (
    <div>
      <RegisterDoctor spec={resSpec}/>
    </div>
  )
}

export default page