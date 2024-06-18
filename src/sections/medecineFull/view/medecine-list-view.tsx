import React from 'react'
import prisma from '../../../../prisma/prismaClient'

import MedecinePage from './medecine-page'
import MedecineTablePagination from '../medecine-table-pagination'
import MedecineDataPage from './medecine-data-page'

async function MedecineData() {

  try {
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
  } catch (error) {
    console.log(error,'ERROR')
  }
}



const MedecineListView = async () => {
  const medData = await MedecineData()

  return (
    <div>
      <MedecineDataPage data={medData}/>
      
    </div>
  )
}

export default MedecineListView