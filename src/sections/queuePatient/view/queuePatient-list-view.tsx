"use client"

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';

const QueuePatientList = () => {
  const [val, setVal]= useState<string | null>(null)

  const navigate = useRouter();



  const handleClick = () => {
    navigate.push(paths.queue.root(val))
  }

  return (
    <Box>
      <Stack>
        <Typography variant="h5">{`Queue`}</Typography>

        <Typography variant="body2" mb={2}>
          Input Voucher To View Queue
        </Typography>
        {/* <QueuePatientCreate onSubmit={onSubmit}/> */}

        <Stack>
          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              sm: 'repeat(1, 1fr)',
            }}
          >
          <TextField
            size="small"
            type="text"
            name="voucher"
            onChange={(e)=>setVal(e.target.value)}
          />
          <Button 
            // type="submit"
            variant="contained"
            onClick={handleClick}
            >
              Submit
          </Button>
            {/* 
          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button> */}
          </Box>


        </Stack>



      </Stack>

    </Box>
  )
}

export default QueuePatientList