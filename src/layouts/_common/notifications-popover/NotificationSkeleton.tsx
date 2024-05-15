import { Skeleton, TableCell, TableRow } from '@mui/material'
import React from 'react'

const NotificationSkeleton = () => {
  return (
    <TableRow hover sx={{display:'flex', flexDirection:'column', width:"100%"}}>
        <TableCell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                
                <div style={{display:'flex', flex:1}}>
                    <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40, mr:2 }} />
                    <Skeleton height={30} width="100%" />
                </div>
                <Skeleton  width={10} height={10} sx={{float:'right'}} />
            </div>
        
        </TableCell>

        <TableCell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent:"flex-start" }}>
                
                <Skeleton height={30} width={100} />
                <Skeleton width={100} height={30} />
            </div>
        
        </TableCell>

    </TableRow>
  )
}

export default NotificationSkeleton
