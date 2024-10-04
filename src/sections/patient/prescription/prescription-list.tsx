import { Box, Button, List, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import PrescriptionMedicine from './prescription-medicine';
import { Icon } from '@iconify/react';

const PrescriptionList = ({ medicineData, fetchMore }: any) => {
    const listRef = useRef<HTMLDivElement>(null);

    // Function to check if the user has scrolled to the bottom
    const handleScroll = useCallback(() => {
        if (!listRef.current) return;

        const { scrollTop, clientHeight, scrollHeight } = listRef.current;

        // Check if the user has scrolled to the bottom
        if ((scrollHeight - scrollTop) > clientHeight) {
            fetchMore();
        }
    },[fetchMore])

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
        <Box id="list_id" sx={{ position: 'relative', height: '100vh', overflowY: 'hidden' }}>
            <Box ref={listRef} sx={{
                mt: 1,
                p: 2,
                w: '100%',
                height: 'calc(100vh - 60px)', // Adjust based on the height of your fixed component
                overflowY: 'auto' // Allow scrolling only here
            }}>
                <Typography variant="body2">Medicines Available</Typography>

                <List>
                    {medicineData?.tableData.map((item, index) => (
                        <PrescriptionMedicine key={index} item={item} onAdd={() => handleAddPrescription(item)} />
                    ))}
                </List>
            </Box>
            <Box sx={{
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
                pl: 5,
                py: 2,
                background: '#fff',
                zIndex: 1000, // Ensure it's above other content
            }}>
                {/* <Button sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Icon icon="carbon:add-filled" fontSize={22} />
                    <Typography>Add Medication</Typography>
                </Button> */}
            </Box>
        </Box>
    );
};

export default PrescriptionList;
