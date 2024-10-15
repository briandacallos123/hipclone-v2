import { Box, Button, List, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import PrescriptionMedicine from './prescription-medicine';
import { Icon } from '@iconify/react';
import PrescriptionFavoriteList from './components/prescription-favorites';
import PrescriptionTemplateList from './components/prescription-template-list';
import Image from '@/components/image';

const PrescriptionTemplate = ({ templates, addDirectPrescriptions, handleAddPrescription }: any) => {
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

    const noTemplate = !templates?.tableData.length;

    return (
        <Box sx={{ position: 'relative', zIndex: 10000, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* favorites */}
            <Box ref={listRef} sx={{ mt: 1, p: 1, w: '100%', overflowY: 'auto' }}>
                {noTemplate && <Box rowGap={2} sx={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'column'
                }}>
                    <Image
                        src={'/assets/icons/empty/ic_content.svg'}
                        sx={{
                            width: 150,
                            height: 150
                        }}
                    />
                    <Typography variant="h6" color="gray">Empty Template List.</Typography>

                </Box>}

                {templates?.tableData?.map((item, index) => (
                    <PrescriptionTemplateList index={index} onAdd={() => addDirectPrescriptions(item)} row={item} key={item?.id} />
                ))}
            </Box>


        </Box>
    );
};

export default PrescriptionTemplate;
