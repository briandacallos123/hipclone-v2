import MedecineViewById from '@/sections/medecineFull/view/id/view/medecine-view-by-id'
import React from 'react'

const page = ({params}) => {
  const {medecine_id} = params;
 

  return (
   <MedecineViewById id={medecine_id}/>
  )
}

export default page