import { Box, Button, List, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import PrescriptionMedicine from './prescription-medicine';
import { Icon } from '@iconify/react';
import PrescriptionFavoriteList from './components/prescription-favorites';

const PrescriptionFavoriteListComponent = ({favorites,  handleAddPrescription }: any) => {
    const listRef = useRef<HTMLDivElement>(null);

    // Function to check if the user has scrolled to the bottom
    const handleScroll = () => {
        if (!listRef.current) return;

        const { scrollTop, clientHeight, scrollHeight } = listRef.current;

        // Check if the user has scrolled to the bottom
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            console.log("Fetching more data...");
        }
    };

    // Attach the scroll event listener
    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

 
    return (
        <Box sx={{ position: 'relative', zIndex: 10000, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* favorites */}
            <Box ref={listRef} sx={{ mt: 1, p: 2, w: '100%', overflowY: 'auto'}}>
                <Typography variant="body2">Favorites</Typography>
                {favorites?.tableData?.map((item)=>(
                    <PrescriptionFavoriteList onAdd={() => handleAddPrescription(item)} row={item} key={item?.id}/>
                ))}
            </Box>

         
        </Box>
    );
};

export default PrescriptionFavoriteListComponent;
