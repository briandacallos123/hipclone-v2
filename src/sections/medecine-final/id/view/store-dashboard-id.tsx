// "use client"

import React from 'react'
import MedecineStoreHeader from '../../view/medecine-store-header'
import StoreDashboardBreadcramps from './store-dashboard-breadcramps'
import StoreDataList from './store-data-list'

type StoreDashboardIdProps = {
    data: []
}

const StoreDashboardId = ({ data }: StoreDashboardIdProps) => {
    const { attachment_store, name, product_types, start_time, end_time, rating, address, medecine_list }: any = data;


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
            <StoreDataList data={medecine_list}/>

        </div>
    )
}

export default StoreDashboardId