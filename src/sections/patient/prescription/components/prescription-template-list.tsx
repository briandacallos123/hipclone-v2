import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useWindowScroll } from '@uidotdev/usehooks';
import React from 'react'



const PrescriptionTemplateList = ({
    onAdd,
    row
}:any) => {


    return (
        <ListItem disablePadding>
          <ListItemButton onClick={onAdd}>
                <ListItemText primary={`${row?.prescription_template?.name} (${row?.prescription_child?.length} item${row?.prescription_child?.length > 1 ? 's':''})`} />
               <Box>
                
               </Box>
                
            </ListItemButton>
        </ListItem> 
    )
}

export default PrescriptionTemplateList