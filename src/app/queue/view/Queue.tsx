import React, { useCallback, useEffect, useState } from 'react'
import QueueItem from './QueueItem'
import { Box, Button, Divider, Grid, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'src/routes/hook';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { TableNoData } from '@/components/table';
import { useAuthContext } from '@/auth/hooks';
import { convertTimeFormat, fDate, fDateTime, formatMilitaryTime, fTime, getUTCTime } from '@/utils/format-time';
import { RouterLink } from '@/routes/components';
import axios from 'axios';


type QueueProps = {
    data: any;
    loading: boolean;
    position: any;
    remainingP: any;
    newPosition: any;
    dataToday?: any;
    isDoneAppt?: any
    targetItem?: any
    notApprovedVal?: any;
    notAppNotToday?: any;
    apptPaid?: any;
    notStarted?: any;
    ongoing: any;
}

const Queue = ({ apptPaid, notStarted, ongoing, data, notApprovedVal, notAppNotToday, isDoneAppt, targetItem, dataToday, loading, position, remainingP, newPosition }: QueueProps) => {


    const { id } = useParams();
    const activePatient = data[0];
    const navigate = useRouter();
    const { user } = useAuthContext()


    const handleNavigate = () => {
        if (user) navigate.push(`${paths.dashboard.root}/appointment`);
    }

    console.log(activePatient,'ACTIVE PATIENTTTTTTTTTTTTTTTTTTTTTTTTTTTT___________')

    const RenderDoneAppt = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">Your appointment was already done. </Typography>



                </Box>
                <Box>
                    {/* <Button component={RouterLink} href="/" size="large" variant="contained">
                        Go to Home
                    </Button> */}
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [targetItem])

    const notApprovedMessage = (payload: any) => {
        console.log(payload, 'PAYLOADDDD')
        let message: any;
        switch (payload) {
            case 4:
                message = "Your appointment is currently mark as pending, please wait for your doctor's approval";
                break;

            case 2:
                message = "Sorry your appointment was cancelled by your doctor";
                break;
            default:
                message = "Sorry your appointment was already done";

        }
        return message;

    }

    const RenderNotTodayNotAppr = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">{notApprovedMessage(notAppNotToday?.status)} </Typography>
                    {/* <Typography variant="h5">{`${fDate(targetItem?.date)} ${formatMilitaryTime(targetItem?.time_slot)}`}</Typography> */}


                </Box>
                <Box>
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [notAppNotToday])

    const RenderNotApproved = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">{notApprovedMessage(notApprovedVal)}</Typography>

                    {/* <Typography variant="h5">{`${fDate(targetItem?.date)} ${formatMilitaryTime(targetItem?.time_slot)}`}</Typography> */}


                </Box>
                <Box>
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [notApprovedVal])

    // console.log(ongoing, '________________________________________ongoing________________')
    // console.log(notStarted, '________________________________________notStarted________________')

    const RenderNotYetStarted = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">Your Schedule is not yet started, please wait
                        until</Typography>
                    <Typography variant="h6">{`${getUTCTime(notStarted?.startingTime)}`}</Typography>


                </Box>
                <Box>
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [notStarted?.notStarted])

    const RenderNotToday = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">Your Schedule is not today, please wait
                        until </Typography>
                    <Typography variant="h6">{`${fDate(targetItem?.date)} ${formatMilitaryTime(targetItem?.time_slot)}`}</Typography>


                </Box>
                <Box>
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [dataToday])

    const RenderNotPaid = useCallback(() => {
        return (
            <Box sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}>

                <Box sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5
                }}>
                    <Typography variant="body1">You're currently unpaid, please pay first your appointment</Typography>



                </Box>
                <Box>
                    <Button onClick={handleNavigate} size="large" variant="contained">
                        Go to Home
                    </Button>
                </Box>

            </Box>
        )
    }, [apptPaid])

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

    if (notApprovedVal) {
        return <RenderNotApproved />
    }

    if (!apptPaid) {
        return <RenderNotPaid />
    }
    if (notStarted?.notStarted) {
        return <RenderNotYetStarted />
    }

    if (notAppNotToday) {
        return <RenderNotTodayNotAppr />
    }



    if (isDoneAppt) {
        return <RenderDoneAppt />
    }
    if (dataToday) {


        return <RenderNotToday />
    }
    const [link, setLink]:any = useState(null);


    useEffect(() => {
        (async () => {
            const payload:any = {
                agentName: '',
                visitorName: `Juanita Delacruz`,
                datetime: "2024-08-28T11:04:00.000Z",
                roomId: activePatient?.room_id,
              };
              
            const response = await axios({
                method: 'options',
                url: 'https://connect3.hips-md.com/api/index.php',
                data: {
                    ...payload
                },
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const { agenturl, visitorurl } = response?.data
            setLink(visitorurl)
        })()
    }, [activePatient])


    return (
        <Grid
            container
            spacing={2}
            sx={{
                display: 'flex',
                // paddingY:3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                backgroundColor: "#fafafa"
            }}>
            {/* time */}
            <Grid sx={{
                display: 'flex',
                justifyContent: 'center'
            }} item xs={12} sm={12} md={6} >
                <Position loading={loading} link={link} v={id} pos={position} />
            </Grid>

            {/* items */}
            <Grid item xs={12} sm={12} md={6}>
                {loading ? <RenderLoadingContent /> :
                    <Box sx={{


                        height: 400,
                        border: '10px solid white',
                        borderRadius: '10px',
                        p: 4,
                        // bgColor:'red',
                        // background:'red',
                        // position:'relative',
                        // left:'-10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        width: '100%'

                    }}>
                        <Typography sx={{ mb: 2 }} variant="h5">Queue List</Typography>
                        <Box>
                            {/* {!loading &&  data?.map((row: any, index:number) => (
                        <QueueItem active={index===0} row={row}/>
                    ))} */}
                            {!loading && data?.length && <>
                                {data?.length !== 0 && <QueueItem active={true} row={data[0]} />}
                                {newPosition !== 0 && (position !== 1 && position !== 0) && <Box sx={{
                                    display: 'flex',
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2
                                }}>
                                    <Box sx={{ width: 50, height: 2, backgroundColor: 'grey', mr: 2 }}></Box>
                                    <Typography variant="body2">{newPosition} Patient{newPosition > 1 && "s"} before your turn.</Typography>
                                </Box>}
                                {data?.length >= 1 && data[1] && <QueueItem active={false} row={data[1]} />}

                                {remainingP && (position === 1 || position === 0) && <Box sx={{
                                    display: 'flex',
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2
                                }}>
                                    <Box sx={{ width: 50, height: 2, backgroundColor: 'grey', mr: 2 }}></Box>
                                    <Typography variant="body2">{remainingP} Patient{remainingP > 1 && "s"} are waiting.</Typography>
                                </Box>}
                            </>}

                        </Box>
                        <TableNoData notFound={!loading && !data?.length} />
                        <Box sx={{ mt: 'auto' }}>
                            <Button
                                onClick={() => {

                                    if (user) {
                                        navigate.push(`${paths.dashboard.root}/appointment`);
                                    } else {
                                        navigate.push(paths.home);
                                    }
                                }}
                                fullWidth={true} sx={{
                                    backgroundColor: 'primary.dark',
                                    alignItems: 'flex-end'
                                }} variant="contained">Leave the Queue</Button>
                        </Box>
                    </Box>
                }
            </Grid>
        </Grid>
    )
}

const Position = ({ pos, v, loading, link}: {
    pos: any;
    v: string;
    loading: any;
    link:string;
}) => {

    const RenderLoading = () => {
        return (
            <Box sx={{
                height: 500,
                width: { sm: '100%' },
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Stack spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={200} height={200} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={100} height={20} />
                    <Skeleton width={200} height={100} />
                </Stack>

            </Box>
        )
    }
    if (loading) {
        return <RenderLoading />
    }


   


    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                borderRadius: '10px',
                boxShadow: '5px 5px 30px #d3cec8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor:'red'
            }}
        >
            <Box sx={{
                borderRadius: '50%',
                border: '5px solid #063970',
                p: {
                    md: 3
                },
                mb: 3,
                height: 170,
                width: 170,
                display: 'flex',
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: "center"
            }}>
                <Typography variant="h2" color="primary.dark">
                    #1
                </Typography>
                <Typography variant="body2">
                    On The List
                </Typography>
            </Box>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Box sx={{
                    mb: 2
                }} width="100%">
                    <Divider />
                </Box>
                <Typography sx={{
                    color: "primary.dark"
                }} variant="h4">Your turn!</Typography>


                <Box  sx={{ p: 2 }}>
                    <Typography sx={{ textAlign: 'center', mb:1 }} variant="body2">It's your turn, please come and see your doctor now.</Typography>
                    <Button fullWidth variant="outlined" onClick={()=>{
                        window.open(link,'_blank');
                    }}>
                        Join via link
                    </Button>
                    {/* {pos !== 0 && <Typography sx={{ textAlign: 'center' }} variant="body2">You're almost there, thank you for waiting.</Typography>}
                    {pos === 0 && <Typography sx={{ textAlign: 'center' }} variant="body2">It's your turn, please come and see your doctor now.</Typography>} */}
                </Box>
            </Stack>
        </Box>

    )
}

export default Queue