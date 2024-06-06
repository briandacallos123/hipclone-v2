"use client"

import Label from '@/components/label';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useCallback, useState } from 'react'
import StoreProducts from './store-products';
import StoreManageProfile from './store-manage-profile';



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
    data:any
}

const StoreManageTabs = ({data}:StoreManageTabsProps) => {

    const [currentTab, setCurrentTab] = useState('products');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);


    const renderTabs = (
        <>
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

        </>
    );


    return (
        <Box sx={{
            mt:2
        }}>
            {renderTabs}
            {currentTab === 'products' && <StoreProducts/> }
            {currentTab === 'profile' && <StoreManageProfile data={data}/> }

        </Box>
    )
}

export default StoreManageTabs