"use client"

import { Box, Button, Container, Grid, List, ListItem, ListItemText, Skeleton, Stack, Table, TableBody, TableContainer, Typography } from '@mui/material'
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
import { TableNoData } from '@/components/table'
import NotFound from '@/app/merchant/not-found'
// import BG from '/assets/background/queue-bg.jpg'
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths'

const StyledComponent = styled('div')({
  background: `url('/assets/background/queue-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh', // Adjust the height as needed 
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  overflow: 'hidden',
  p: {
    xs: 10,
    lg: 5
  }
});

const page = () => {
  const {notStarted, ongoing, data, queryQueueResult, notToday, inValidVoucher, targetItem, clinicData, notApprovedVal, isDoneAppt, QueryQueue, dataResults, loading, position, remainingP, newPosition, notAppNotToday, apptPaid } = QueueController()
  const { id } = useParams();
  // const { socket } = useAuthContext()
  const { user } = useAuthContext()
  const navigate = useRouter();

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
  const notFound = !queryQueueResult.loading && inValidVoucher

  const RenderLoadingContent = () => {
    return (
      <Box sx={{
        width: { xs: '100%', sm: '100%', md: '100%' },
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

  const handleNavigate= () => {
    if(user){
      navigate.push(`${paths.dashboard.root}/appointment`);
    }else{
      navigate.push(`${paths.home}`);

    }
}

console.log(clinicData,'AWITTTTTTTTTT SAYOOOOOOOOOOOO')


  return (
    <StyledComponent>
      <Box sx={{
        height: {
          xs: '100vh',
          lg: 'auto'
        },
        width: {
          xs: 400,
          md: 1000
        },
        p: {
          xs: 2
        },
        borderRadius: '20px',
        mt: {
          xs: 7,
        },
        overflow: {
          xs: 'scroll',
          md: "hidden"
        },
      }} >

        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <LogoFull disabledLink />
        </Box>


        <QueueCover
          name={data?.[0]?.clinicInfo?.clinic_name}
          address={`${data?.[0]?.clinicInfo?.location}, ${data?.[0]?.clinicInfo?.Province} `}
          isLoading={queryQueueResult.loading}
          notFound={notFound}
        />
        <Box sx={{
          borderRadius: '20px',

        }}>
          {queryQueueResult.loading ? <RenderLoadingContent /> :
            !inValidVoucher ? <Stack gap={3} >
              <Queue notStarted={notStarted} ongoing={ongoing} apptPaid={apptPaid} notAppNotToday={notAppNotToday} notApprovedVal={notApprovedVal} isDoneAppt={isDoneAppt} targetItem={targetItem} dataToday={notToday} newPosition={newPosition} remainingP={remainingP} position={position} data={data} loading={loading} />
              <QueueCarousel loading={queryQueueResult.loading} data={clinicData} />
            </Stack> :
              <Box sx={{
                width:'100%',
                p:2,
                display:'flex',
                justifyContent:'center',
                backgroundColor:'white',
                flexDirection:'column',
                alignItems:'center',
                minHeight:{
                  lg:500
                },
                gap:2
              }}>
                <Typography sx={{
                  fontSize:'2rem'
                }}>
                  Invalid voucher code!
                </Typography>
                <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
              </Box>
          }
        </Box>

      </Box>
    </StyledComponent>

  )
}

export default page