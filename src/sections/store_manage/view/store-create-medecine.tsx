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
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
            <Button
              onClick={opencreate.onTrue}
              // component={RouterLink}
              // href={paths.dashboard.appointment.find}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New Medecine
            </Button>
         
        </Stack>
        <MerchantCreateView id={id} onClose={()=>{
        opencreate.onFalse();
   
      }} open={opencreate.value}/>
    </div>
  )
}

export default StoreCreateMedecine