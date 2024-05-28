import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import React from 'react'

type MedecineFilteringProps = {
    data: [],
    onSelect: () => void,
    heading:string
}

const MedecineFiltering = ({ data, onSelect, heading }: MedecineFilteringProps) => {

    return (
        <Box sx={{
            p:2,
            
        }}>
            <Typography sx={{
                mb:{sm:2, lg:3}
            }} variant="h5">{heading}</Typography>
            <Box sx={{
                display:'flex',
                flexDirection:'column',
                maxHeight:200,
                // overflow:'hidden',
                overflowY:'scroll',
            }}>
                {data?.map(({ id, text }: any) => (
                    <FormControlLabel key={id} control={
                        <Checkbox

                            checked={true}
                            onChange={onSelect}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } label={text} />

                ))}
            </Box>
        </Box>
    )
}

export default MedecineFiltering