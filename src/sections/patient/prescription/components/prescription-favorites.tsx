import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useWindowScroll } from '@uidotdev/usehooks';
import React from 'react'



const PrescriptionFavoriteList = ({
    onAdd,
    row,index
}:any) => {


    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onAdd}>
                <ListItemText primary={`${index + 1}: ${row?.MEDICINE} ${row?.FORM} ${row?.DOSE}`} />
            </ListItemButton>
        </ListItem>
    )
}

export default PrescriptionFavoriteList