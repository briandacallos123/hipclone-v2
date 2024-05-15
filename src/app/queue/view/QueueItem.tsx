import { ListItem, ListItemText, Stack } from '@mui/material';
import React from 'react'

type QueueItemProps = {
    row:any;
    active:boolean;
}



const QueueItem = ({row, active}:QueueItemProps) => {

    let voucherId = row?.voucherId[0];
    let voucherEnd = row?.voucherId[row?.voucherId.length-1]


  return (
    <ListItem sx={{
        mb:1,
        borderRadius:'10px',
        border:'1px solid #e1dad2',
        paddingY:2,
        paddingX:1,
        backgroundColor:active && 'white'
    }}>
        <Stack direction="row" justifyContent="space-between" sx={{
            width:'100%',
            
        }}>
            <ListItemText>
                {`${voucherId}****${voucherEnd}`}
            </ListItemText>
            {active &&  <ListItemText sx={{
                // background:'orange',
                textAlign:'right'
            }}>
                Ongoing
            </ListItemText>}
        </Stack>
      
    </ListItem>
  )
}

export default QueueItem