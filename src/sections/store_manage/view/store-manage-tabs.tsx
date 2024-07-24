"use client"

import Label from '@/components/label';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import React, { useCallback, useState } from 'react'
import StoreProducts from './store-products';
import StoreManageProfile from './store-manage-profile';
import StoreCreateMedecine from './store-create-medecine';



const TABS = [
    {
        value: 'products',
        label: 'Products',
    },
    {
        value: 'profile',
        label: 'Profile',
    },

];

type StoreManageTabsProps = {
    data: any,
    singleResult:any;
}

const StoreManageTabs = ({ data,singleResult }: StoreManageTabsProps) => {

    const [currentTab, setCurrentTab] = useState('products');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);


    const renderTabs = (
        <>
            <Grid container>
                <Grid lg={10}>
                    <Tabs value={currentTab} onChange={handleChangeTab}>
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                // icon={
                                //    {currentTab === 'products' && }
                                // }
                                sx={{
                                    '&:not(:last-of-type)': {
                                        mr: 3,
                                    },
                                }}
                            />
                        ))}
                    </Tabs>
                </Grid>
                <Grid lg={2}>
                       {currentTab === 'products' &&  <StoreCreateMedecine/> }
                </Grid>
            </Grid>

        </>
    );


    return (
        <Box sx={{
            mt: 2
        }}>
            {renderTabs}
            {currentTab === 'products' && <StoreProducts />}
            {currentTab === 'profile' && <StoreManageProfile singleResult={singleResult} data={data} />}

        </Box>
    )
}

export default StoreManageTabs