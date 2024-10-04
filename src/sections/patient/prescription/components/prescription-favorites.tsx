import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useWindowScroll } from '@uidotdev/usehooks';
import React from 'react'



const PrescriptionFavoriteList = ({
    onAdd,
    row
}:any) => {


    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onAdd}>
                <ListItemText primary={`${row?.MEDICINE} ${row?.FORM} ${row?.DOSE}`} />
            </ListItemButton>
        </ListItem>
    )
}

export default PrescriptionFavoriteList