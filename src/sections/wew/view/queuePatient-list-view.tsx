"use client"
import { Box, Typography } from '@mui/material'
import React, { useCallback } from 'react'

import QueuePatientCreate from './queue-patient-create'
import QueueController from '../queue-patient-controller'

const QueuePatientList = () => {
    const {data, QueryQueue} = QueueController()

    const onSubmit = useCallback(async(data:any)=>{
        try {
          await QueryQueue(data?.voucher)
        } catch (error) {
            console.log(error)
        }
    },[])


  return (
    <Box>
        <Typography>
            Input Voucher To View Queue
        </Typography>
        <QueuePatientCreate onSubmit={onSubmit}/>
    </Box>
  )
}

export default QueuePatientList