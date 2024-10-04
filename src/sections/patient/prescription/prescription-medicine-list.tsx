import { Box, Button, List, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import PrescriptionMedicine from './prescription-medicine';
import { Icon } from '@iconify/react';
import PrescriptionFavoriteList from './components/prescription-favorites';

const PrescriptionMedicineList = ({favorites, medecineData, fetchMoreData, handleAddPrescription }: any) => {
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
        <Box sx={{ position: 'relative', zIndex: 10000, height: '100%', display: 'flex', flexDirection: 'column', }}>
            {/* favorites */}
            {/* <Box ref={listRef} sx={{ mt: 1, p: 2, w: '100%', overflowY: 'auto'}}>
                <Typography variant="body2">Favorites</Typography>
                {favorites?.tableData?.map((item)=>(
                    <PrescriptionFavoriteList onAdd={() => handleAddPrescription(item)} row={item} key={item?.id}/>
                ))}
            </Box> */}

            <Box ref={listRef} sx={{ p: 2, pb: 10, w: '100%', overflowY: 'auto', height: '100%', flex: 1 }}>
                <Typography variant="body2">Medicines Available</Typography>
                <List>
                    {medecineData?.tableData.map((item, index) => (
                        <PrescriptionMedicine key={index} item={item} onAdd={() => handleAddPrescription(item)} />
                    ))}
                </List>
            </Box>

            {/* comment muna */}
            {/* <Box sx={{
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
                pl: 5,
                py: 2,
                background: '#fff',
                zIndex: 1000,
            }}>
                <Button sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}>
                    <Icon icon="carbon:add-filled" fontSize={22} />
                    <Typography>Add Medication</Typography>
                </Button>
            </Box> */}
        </Box>
    );
};

export default PrescriptionMedicineList;
