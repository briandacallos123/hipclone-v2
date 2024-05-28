"use client"

import { Box, Container, Grid, List, ListItem, ListItemText, Stack, Table, TableBody, TableContainer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import QueueController from '@/sections/queuePatient/queue-patient-controller'
import QueueCover from '@/sections/queue/queue-cover'
import PatientTableRow from '@/sections/queuePatient/queue-patient-table-row'
import Scrollbar from '@/components/scrollbar'
import QueueItem from '../view/QueueItem'
import Queue from '../view/Queue'
import { useParams } from 'src/routes/hook';
import { useAuthContext } from '@/auth/hooks'

const page = () => {
  const { data, notToday, QueryQueue, dataResults, loading, position, remainingP, newPosition, refetch } = QueueController()
  const { id } = useParams();
  const { socket } = useAuthContext()


  useEffect(() => {
    if (socket?.connected) {
   
      socket.on('queueFetch', async (u: any) => {
        if (u?.clinicUuid === data[0]?.clinicInfo?.uuid) {
          refetch()
         
        }
      })
    }

    return () => {
      socket?.off('queueFetch')
    }
  }, [socket?.connected, data])


  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      // mt:10
    }}  >
      <Box sx={{
        height: 500,
        width: 1000,
        borderRadius: '20px',
        // background:'green',
        paddingY: {
          // sm:2,
          md: 2
        },
        paddingX: {
          md: 5
        },
        // backgroundColor:'orange',
      }} >

        <QueueCover
          name={data?.[0]?.clinicInfo?.clinic_name}
          address={`${data?.[0]?.clinicInfo?.location}, ${data?.[0]?.clinicInfo?.Province} `}
          isLoading={loading}
        />


        <Box sx={{

          borderRadius: '20px',
          // background:'red'
        }}>

          <Queue dataToday={notToday} newPosition={newPosition} remainingP={remainingP} position={position} data={data} loading={loading} />

        </Box>

      </Box>
    </Box>
  )
}

export default page