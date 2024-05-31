import React from 'react'
import prisma from '../../../../prisma/prismaClient'

import MedecinePage from './medecine-page'
import MedecineTablePagination from '../medecine-table-pagination'


async function MedecineData() {
  const result = await prisma.merchant_medicine.findMany({
    where: {
      is_deleted: 0,
    }
  })
  const res = result?.map(async (item: any) => {
    const r = await prisma.medecine_attachment.findFirst({
      where: {
        id: Number(item?.attachment_id)
      }
    })

    const user = await prisma.merchant_user.findFirst({
      where:{
        id:Number(item?.merchant_id)
      },
      include:{
        merchant_store:true
      }
    })

    console.log(user,'USERRR')

    return { ...item, attachment_info: { ...r }, user:{...user} }
  })

  const fResult = await Promise.all(res)
  return fResult;
}

const MedecineListView = async () => {
  const medData = await MedecineData()
  console.log(medData, 'HAHAHAA')

  
  return (
    <div>
      {/* <MedecineTablePagination data={
        [
          {id:1},
          {id:1},
          {id:1},
          {id:1},
          {id:1},
          {id:1}
        ]}/> */}

      <MedecinePage data={medData} />
    </div>
  )
}

export default MedecineListView