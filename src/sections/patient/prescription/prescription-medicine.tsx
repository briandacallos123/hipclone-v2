import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useWindowScroll } from '@uidotdev/usehooks';
import React from 'react'

type PrescriptionMedicineProps = {
    onAdd:()=>void;
    item:any;
}

const PrescriptionMedicine = ({
    onAdd,
    item
}:PrescriptionMedicineProps) => {


    return (
        <ListItem key={item?.ID} disablePadding>
            <ListItemButton onClick={onAdd}>
                <ListItemText primary={`${item?.GenericName} ${item?.Form} ${item?.Dose}`} />
            </ListItemButton>
        </ListItem>
    )
}

export default PrescriptionMedicine