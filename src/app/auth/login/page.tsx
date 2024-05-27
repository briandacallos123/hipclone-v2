"use client"

import { Box, Container, Stack } from '@mui/material'
import React from 'react'
import { MerchantView } from 'src/sections/auth';
import { useBoolean } from 'src/hooks/use-boolean';

const page = () => {

  const open = useBoolean();

  return (
    <Container>
      <Box>
        <MerchantView
            isLoggedIn={false}
            setLoggedIn={()=>{}}
            open={true}
            onClose={open.onFalse}
            id={null}
        />
      </Box>
    </Container>
  )
}

export default page