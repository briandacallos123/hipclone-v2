"use client"

import React from 'react'
// import { MerchantMedicineView } from '@/sections/merchant/medecine'
import MerchantCreateView from '@/sections/merchant/medecine/view/merchant-create-view'
import { Button, Stack } from '@mui/material'
import Iconify from '@/components/iconify/iconify'
import { useBoolean } from '@/hooks/use-boolean'
import { useParams } from 'next/navigation'

const StoreCreateMedecine = () => {
  const opencreate = useBoolean();
    const {id} = useParams();

  return (
    <div>
         <Stack
          direction="row"
          alignItems="center"
          justifyContent={{xs:"flex-end",lg:'center'}}
          sx={{
            p:{lg:2}
          }}
        >
            <Button
              onClick={opencreate.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{
                fontSize:{xs:'.8rem', lg:'1rem'}
              }}
            >
             New Medecine
            </Button>
         
        </Stack>
        <MerchantCreateView id={id} onClose={()=>{
        opencreate.onFalse();
   
      }} open={opencreate.value}/>
    </div>
  )
}

export default StoreCreateMedecine