import React from 'react'
import MedecineViewById from '@/sections/medecineFull/view/id/view/medecine-view-by-id'
import prisma from '../../../../../prisma/prismaClient'

async function MedecineData(id: Number) {
  const result = await prisma.merchant_medicine.findFirst({
    where: {
      id: Number(id),
      is_deleted: 0,
    }
  })

  const r = await prisma.medecine_attachment.findFirst({
    where: {
      id: Number(result?.attachment_id)
    }
  })

  const user = await prisma.merchant_user.findFirst({
    where: {
      id: Number(result?.merchant_id)
    },
    include: {
      merchant_store: true,
    }
  })

  const otherProductOfStore = await prisma.merchant_medicine.findMany({
    where: {
      id:{
        not:Number(result?.id)
      },
      is_deleted: 0,
      merchant_id:Number(result?.merchant_id)
    },
  })

  const fStore = otherProductOfStore?.map(async(item:any)=>{
    const a = await prisma.medecine_attachment.findFirst({
      where:{
        id:Number(item?.attachment_id)
      }
    })
    return {...item, attachment_info:{...a}}
  })

  const fStoreResult = await Promise.all(fStore)

  return { ...result, attachment_info: { ...r }, user: { ...user, merchant_store:{...user?.merchant_store, products:[...fStoreResult]} } }

}

const page = async ({ params }: any) => {
  const { id }: any = params;

  const data = await MedecineData(id)



  return (
    <MedecineViewById data={data} />
  )
}

export default page