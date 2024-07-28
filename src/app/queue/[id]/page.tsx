"use client"

import { Box, Container, Grid, List, ListItem, ListItemText, Skeleton, Stack, Table, TableBody, TableContainer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import QueueController from '@/sections/queuePatient/queue-patient-controller'
import QueueCover from '@/sections/queue/queue-cover'
import PatientTableRow from '@/sections/queuePatient/queue-patient-table-row'
import Scrollbar from '@/components/scrollbar'
import QueueItem from '../view/QueueItem'
import Queue from '../view/Queue'
import { useParams } from 'src/routes/hook';
import { useAuthContext } from '@/auth/hooks'
import QueueCarousel from '@/sections/queue/queue-carousel'
import { LogoFull } from '@/components/logo'
import { styled } from '@mui/material/styles';
// import BG from '/assets/background/queue-bg.jpg'

const StyledComponent = styled('div')({
  background: `url('/assets/background/queue-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat:'no-repeat',
  minHeight: '100vh', // Adjust the height as needed 
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  overflow:'hidden'
});

const page = () => {
  const { data, notToday, targetItem, clinicData, notApprovedVal, isDoneAppt, clinicLoading, QueryQueue, dataResults, loading, position, remainingP, newPosition, refetch, notAppNotToday,apptPaid } = QueueController()
  const { id } = useParams();
  // const { socket } = useAuthContext()


  // useEffect(() => {
  //   if (socket?.connected) {

  //     socket.on('queueFetch', async (u: any) => {
  //       if (u?.clinicUuid === data[0]?.clinicInfo?.uuid) {
  //         refetch()

  //       }
  //     })
  //   }

  //   return () => {
  //     socket?.off('queueFetch')
  //   }
  // }, [socket?.connected, data])

  const RenderLoadingContent = () => {
    return (
      <Box sx={{
        width: { xs: '100%', sm: '100%', md: 400 },
        height: 400,
        border: '10px solid white',
        borderRadius: '10px',
        p: {
          md: 4
        },
        position: 'relative',
        left: '-10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <Stack spacing={2} alignItems="center">
          {/* <Skeleton variant="circular" width={200} height={200}/> */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: "flex-start"
          }}>
            <Skeleton width={100} height={20} />
          </Box>
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={100} />
          <Box sx={{
            width: '100%',
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
          }}>
            <Skeleton width='100%' height={20} />
          </Box>
        </Stack>
      </Box>
    )
  }


  return (
    <StyledComponent>
      <Box sx={{
        height: 500,
        width: 1000,
        borderRadius: '20px',
        // background:'green',
        paddingY: {
          // sm:2,
          md: 5
        },
        paddingX: {
          md: 5
        },
        // backgroundColor:'orange',
      }} >
        <Box sx={{ position: 'fixed', top: 20, left: 20 }}>
          <LogoFull disabledLink />
        </Box>

        <QueueCover
          name={data?.[0]?.clinicInfo?.clinic_name}
          address={`${data?.[0]?.clinicInfo?.location}, ${data?.[0]?.clinicInfo?.Province} `}
          isLoading={loading}
        />


        <Box sx={{

          borderRadius: '20px',

        }}>

          <Stack gap={3} >


            <Queue apptPaid={apptPaid} notAppNotToday={notAppNotToday} notApprovedVal={notApprovedVal} isDoneAppt={isDoneAppt} targetItem={targetItem} dataToday={notToday} newPosition={newPosition} remainingP={remainingP} position={position} data={data} loading={loading} />
            {clinicData?.length !== 0 && !isDoneAppt && <QueueCarousel loading={clinicLoading} data={clinicData} />}
          </Stack>
        </Box>

      </Box>
    </StyledComponent>
    // <Box sx={{
      // height: '100vh',
      // width: '100vw',
      // display: 'flex',
      // justifyContent: 'center',
    //   backgroundImage:url()

    // }}  >

    // </Box>
  )
}

export default page