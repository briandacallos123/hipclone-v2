"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import MedecineStoreHeader from '../../view/medecine-store-header'
import StoreDashboardBreadcramps from './store-dashboard-breadcramps'
import StoreDataList from './store-data-list'
import { Box, Grid } from '@mui/material'
import SidebarFitering from '../sidebar-filtering'
import { useLazyQuery } from '@apollo/client'
import { QueryAllMerchantMedicine } from '@/libs/gqls/merchantUser'
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useRouter } from 'next/navigation'

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

const sortOptions = [
    {
        id:1,
        label: "Best Selling",
        value: "Best Selling"
    },
    {
        id:2,
        label: "Latest Product",
        value: "Latest Products"
        
    },
    {
        id:3,
        label: "Name Descending",
        value: "Name Descending"
    },
    {
        id:4,
        label: "Name Ascending",
        value: "Name Ascending"
    },
]

const defaultFilters = {
    name: '',
    status: -1,
    type: '',
    startDate: null,
    endDate: null,
    startingPrice: null,
    endPrice: null,
    sort:""
};



const StoreDashboardId = ({ data, id }: any) => {
    const { attachment_store, name, product_types, start_time, end_time, rating, address, medecine_list }: any = data;

    const [filters, setFilters]: any = useState(defaultFilters);
    const [take, setTake] = useState(6);
    const [skip, setSkip] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const Page = useRef(1);
    const [listView, setListView] = useState('grid')
    // console.log(tableData, totalRecords,'HAaaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaAAAAAAAAAAAAAAA')

    // console.log(tableData,'TABLE DAtAAAAAAAAAAA')
    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const [getMedecines, getMedecinesResult] = useLazyQuery(QueryAllMerchantMedicine, {
        context: {
            requestTrackerId: 'medecines[getMedecinesResult]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        getMedecines({
            variables: {
                data: {
                    skip,
                    take,
                    search: filters.name,
                    store_id: Number(id),
                    userType: "patient",
                    type: filters.type.toLowerCase(),
                    startPrice: Number(filters.startingPrice),
                    endPrice: Number(filters.endPrice),
                    sort:filters.sort
                }   
            }
        }).then((res: any) => {
            const { data } = res;
            if (data) {
                const { QueryAllMerchantMedicine } = data;
                setTableData(QueryAllMerchantMedicine?.MedicineType)
                setTotalRecords(QueryAllMerchantMedicine?.totalRecords)
            }
        })
    }, [table.page, table.rowsPerPage,filters.sort, filters.name, filters.type, filters.startingPrice, filters.endPrice])


    const handleFilters = useCallback(
        (name: string, value: any) => {
            setFilters((prevState: any) => {

                return {
                    ...prevState,
                    [name]: value,
                }
            });
        },
        []
    );

        const checkExistedData = useCallback((prev, data:any) => {
            const dataIds = prev?.map((item)=>Number(item.id))
            const newData:any = [...prev];

            Object.entries(data)?.forEach(([key, val])=>{
                if(!(dataIds.includes(Number(Object.values(val)[0])))){
                    newData.push(val)
                }
            })
            return newData
        },[tableData?.length])

     

    useEffect(() => {
        const section: any = document.querySelector('body div');

        const ScrollHandle = () => {
            const bottomScrollPosition = section.scrollHeight - section.scrollTop - section.clientHeight;

            if (window.scrollY >= bottomScrollPosition || bottomScrollPosition === window.scrollY) {

                getMedecinesResult
                    .refetch({
                        data:{
                            skip: Page.current * take,
                            take: 3,
                            store_id: Number(id),
                            userType: "patient",
                            type: filters.type.toLowerCase(),
                            startPrice: Number(filters.startingPrice),
                            endPrice: Number(filters.endPrice)
                        }
                    })
                    .then(async ({ data }: any) => {
                        if (data) {
                            const { QueryAllMerchantMedicine } = data;
                          
                            setTableData((prev)=>{
                                return [ ...checkExistedData(prev, QueryAllMerchantMedicine?.MedicineType)]
                            })
                           
                        }
                      
                    });
            }
        };

        if (typeof window !== 'undefined') {
            if(totalRecords !== tableData?.length){
                console.log(tableData?.length,'LENGTH NG TABLE')
                console.log(totalRecords,'TOTAL RECOREDS')

                window.addEventListener('scroll', ScrollHandle);
            }
          
        }
        //prevent memory leak
        return () => window.removeEventListener('scroll', ScrollHandle)
    }, [tableData, id])

    const handleListView = (val:string) => {
        setListView(val)
    }

    const handleReset = () => {
        
    }


    return (
        <Box sx={{
            p:{xs:2}
        }}>
            <StoreDashboardBreadcramps storeName={name} address={address} />
            <MedecineStoreHeader
                storeName={name}
                address={address}
                startTime={start_time}
                product_type={product_types}
                endTime={end_time}
                rating={rating}
            />
            <Grid container >
                <Grid item xs={12} lg={10}>
                    <StoreDataList listView={listView} loading={getMedecinesResult.loading} data={tableData} />
                </Grid>
                <Grid item xs={12} lg={2}>
                    <SidebarFitering listView={listView} handleListView={handleListView} sortOptions={sortOptions} typeOptions={typeOptions} onFilters={handleFilters} filters={filters} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default StoreDashboardId