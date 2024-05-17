
import { Box, Stack, TextField, Typography, Button, Tooltip, Divider } from '@mui/material'
import React from 'react'
import { useAuthContext } from '@/auth/hooks'

type MerchantHeaderProps = {
    handleChangeVoucher:(e:string)=>string;
    setOpenScanner:()=>void
}

const MerchantHeader = ({handleChangeVoucher, setOpenScanner}:MerchantHeaderProps) => {
   const {user} = useAuthContext()
   
   console.log(user,'USER??????????')
   
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{
            color:'black',
            // bgcolor:'red',
            width:"100%",
            // pX:3
        }}>
            <Box>
                <Stack direction="row" alignItems="center">
                    <Typography sx={{mr:1}} variant='body2'>Name:</Typography>
                    <Typography sx={{
                        fontWeight:'bold',
                        textTransform:'capitalize'
                    }} variant="body1">{user?.displayName} </Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Typography sx={{mr:1}} variant='body2'>User Type: </Typography>
                    <Typography sx={{
                        fontWeight:'bold',
                        textTransform:'capitalize'
                    }} variant="body1">{user?.role} </Typography>
                </Stack>
                {/* <Stack direction="row" alignItems="center">
                    <Typography sx={{mr:1}} variant='body2'>Date: </Typography>
                    <Typography sx={{
                        fontWeight:'bold'
                    }} variant="body1">5/15/2024 </Typography>
                </Stack> */}
            </Box>
            <Box>
                <Box sx={{
                    display: 'flex',
                    height:30
                    // justifyContent: "center",
                    // flexDirection: 'column',
                    // alignItems: 'center',
                    // bgcolor:'orange'
                }}>
                    <Tooltip title="Qr Code" >
                        <img onClick={setOpenScanner} style={{
                            cursor:'pointer'
                        }} src="/assets/scanner.svg"/>
                    </Tooltip>
                    <Typography sx={{mx:2}} variant="body2">or</Typography>
                    <input placeholder='Voucher Code...'  type="text" onChange={(e)=>handleChangeVoucher(e.target.value)} style={{
                        borderRadius:'5px',
                        border:'2px solid black',
                        padding:'10px'
                      
                    }} />
                    <Button sx={{ml:2, height:'100%' }} variant="contained">Search</Button>
                </Box>
            </Box>
        </Stack>
    )
}

export default MerchantHeader