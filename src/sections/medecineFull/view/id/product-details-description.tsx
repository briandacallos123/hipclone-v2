// components

import { Box, Stack, Typography } from '@mui/material';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  description: any;
};

export default function ProductDetailsDescription({ data }: Props) {
    const {manufacturer, description, dose, form} = data;
  return (
    <Box sx={{
        p:3
    }}>
        <Stack>
            <h3>Product Details</h3>
            <Typography >
            {`${description[0].toUpperCase()}${description.split('').splice(1).join('')}`}
            </Typography>
        </Stack>
        
        <Stack sx={{textTransform:'capitalize'}} gap={1}>
            <h3>Specifications</h3>
          
            <table width="30%">
                <tbody>
                    <tr>
                        <td>Manufacturer</td>
                        <td>{manufacturer}</td>
                    </tr>
                    <tr>
                        <td>Dose</td>
                        <td>{dose}</td>
                    </tr>
                    <tr>
                        <td>Form</td>
                        <td>{form}</td>
                    </tr>
                </tbody>
            </table>
        </Stack>
    </Box>
  )
}
