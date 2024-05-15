import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Stack } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles';

type QueuePatientModalProps = {
    open:boolean;
    handleClose:(event:React.MouseEvent)=>void;
    data:any;
}

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    minHeight:300,
    padding:5
  }));

const QueuePatientModal = ({open, handleClose, data}:QueuePatientModalProps) => {
  return (
    <Box sx={{
        backgroundColor:'primary.dark',
        height:'100%',
        display:'flex',
        justifyContent:"center",
        borderRadius:'20px'
    }}>
        <Box sx={{
            width:'40%',
            borderRadius:'20px',
            paddingY:2
        }}>
            <Stack sx={{
                borderRadius:'20px'
            }}>
            <List >
                <Demo>
                {data?.map((item:any)=>(
                       
                           <ListItem sx={{
                            border:'1px solid gray'
                           }}>
                                <ListItemText
                                    
                                    primary={`${item?.patientInfo?.FNAME} ${item?.patientInfo?.LNAME}`}
                                
                               />
                            </ListItem>
                        
                    
                    ))}
                    </Demo>
              </List>
            </Stack>
        </Box>
    </Box>
       
  )
}

export default QueuePatientModal