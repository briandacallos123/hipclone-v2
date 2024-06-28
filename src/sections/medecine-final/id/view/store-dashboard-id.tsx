"use client"

import React, { useCallback, useState } from 'react'
import MedecineStoreHeader from '../../view/medecine-store-header'
import StoreDashboardBreadcramps from './store-dashboard-breadcramps'
import StoreDataList from './store-data-list'
import { Grid } from '@mui/material'
import SidebarFitering from '../sidebar-filtering'

type StoreDashboardIdProps = {
    data: []
}
const typeOptions = [
    {
        id: 1,
        label: "Branded",
        value: "Branded"
    },
    {
        id: 2,
        label: "Generic",
        value: "Generic"
    },
   
]

const defaultFilters = {
    name:'',
    status: -1,
    type:'',
    startDate: null,
    endDate: null,
    distance:1
};



const StoreDashboardId = ({ data }: StoreDashboardIdProps) => {
    const { attachment_store, name, product_types, start_time, end_time, rating, address, medecine_list }: any = data;

    const [filters, setFilters]: any = useState(defaultFilters);
    console.log(filters,'FILTERSSSS')

    const handleFilters = useCallback(
        (name: string, value: any) => {
            setFilters((prevState: any) =>{
                
                return {
                    ...prevState,
                    [name]: value,
                }
            });
        },
        // [table]
        []
    );

    
    return (
        <div>
            <StoreDashboardBreadcramps storeName={name} address={address} />
            <MedecineStoreHeader
                storeName={name}
                address={address}
                startTime={start_time}
                product_type={product_types}
                endTime={end_time}
                rating={rating}
            />
            <Grid container gap={1}>
                <Grid item xs={12} lg={10}>
                    <StoreDataList data={data}/>
                </Grid>
                <Grid item xs={12} lg={1}>
                    <SidebarFitering typeOptions={typeOptions} onFilters={handleFilters} filters={filters}/>
                </Grid>
            </Grid>

        </div>
    )
}

export default StoreDashboardId