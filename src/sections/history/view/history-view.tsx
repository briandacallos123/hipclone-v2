import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useAuthContext } from '@/auth/hooks'

type HistoryViewProps = {
    onClose: () => void,
    open: boolean,
    title: String,
    data: any
}

const HistoryView = ({ onClose, open, title, data }: HistoryViewProps) => {
    const { attachment, brand_name, dose, form, generic_name, id, is_deliver, is_paid, patient, quantity, status_id, store } = data;


    const imgPath = `http://localhost:9092/${attachment?.file_path.split('/').splice(1).join('/')}`;

    console.log(data, 'DATA___________________')

    const { user } = useAuthContext();

    const isPatient = user?.role === 'patient'




    const RenderForPatient = useCallback(() => {
        return (
            <Box sx={{
                width: 500
            }}>
                <Grid  gap={2} sx={{ mb: 5 }} justifyContent="space-between"  alignItems="flex-start" container>
                    <Grid item xl={2}>
                        <Box>
                            <Avatar sx={{
                                width: 100,
                                height: 100
                            }} alt={data?.brand_name} src={imgPath} />
                            {/* {data?.brand_name?.charAt(0)} */}

                        </Box>
                    </Grid>
                    <Grid item gap={2} xl={4}>
                        <Stack  sx={{ mb: 1 }}>
                            <Typography variant="overline" color="text.disabled">Customer: </Typography>
                            <Typography variant={'subtitle1'}>{`${patient?.FNAME} ${patient?.LNAME}`}</Typography>
                        </Stack>
                        <Stack  sx={{ mb: 1 }}>
                            <Typography variant="overline" color="text.disabled">Contact: </Typography>
                            <Typography variant={'subtitle1'}>{patient?.CONTACT_NO}</Typography>
                        </Stack>
                        <Stack gap={1}  sx={{ mb: 1 }}>
                            <Typography variant="overline" color="text.disabled">Address: </Typography>
                            <Typography variant={'subtitle1'}>{patient?.HOME_ADD}</Typography>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="overline" color="text.disabled">Store Name: </Typography>
                            <Typography variant={'subtitle1'}>{store?.name}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item gap={2} xl={4}>
                        <Stack gap={1} >
                            <Typography variant="overline" color="text.disabled">Order </Typography>
                            <Typography variant={'subtitle1'}>#{id}</Typography>
                        </Stack>
                        <Stack gap={1} >
                            <Typography variant="overline" color="text.disabled">Product Name: </Typography>
                            <Typography variant={'subtitle1'}>{brand_name}</Typography>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="overline" color="text.disabled">Quantity: </Typography>
                            <Typography variant={'subtitle1'}>{quantity}</Typography>
                        </Stack>
                        <Stack gap={1}>
                            <Typography variant="overline" color="text.disabled">Delivery Type: </Typography>
                            <Typography variant={'subtitle1'}>{is_deliver ? "Delivery" : "Pick Up"}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container >

                    
                </Grid>
            </Box>
        )
    }, [data, imgPath])

    return (
        <Box sx={{
            p:2
        }}>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`${title}`}
                </DialogTitle>
                <DialogContent>
                    {/* {isPatient ?  : ""} */}
                    <RenderForPatient />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={onClose}>Disagree</Button> */}
                    <Button variant='contained' onClick={onClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default HistoryView