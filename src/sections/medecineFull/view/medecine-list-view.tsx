import React from 'react'
import prisma from '../../../../prisma/prismaClient'

import MedecinePage from './medecine-page'
import MedecineTablePagination from '../medecine-table-pagination'


async function MedecineData() {

  const result = await prisma.merchant_store.findMany({
    take: 5,
    skip: 0,
    where: {
      is_deleted: 0
    },
    include: {
      attachment_store: true
    }
  })

  return result
}

const MedecineListView = async () => {
  const medData = await MedecineData()
  console.log(medData, 'HAHAHAA')


  return (
    <div>
      <MedecinePage data={medData} />
    </div>
  )
}

export default MedecineListView