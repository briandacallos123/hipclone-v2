"use client"

import React, { useCallback, useEffect, useState } from 'react'
import MedecinePage from './medecine-page'
import { Box, Container, Grid, Table } from '@mui/material';
import StoreDashboardFiltering from '@/sections/medecine-final/id/view/store-dashboard-filtering';
import EcommerceWelcome from '../ecommerce-welcome';
import { useAuthContext } from '@/auth/hooks';
import { MotivationIllustration } from 'src/assets/illustrations';
import { useSettingsContext } from '@/components/settings';
import { QueryAllStoreNoId } from 'src/libs/gqls/store';
import MedecineController from './medecine-controller';
import { useLazyQuery } from '@apollo/client';
import MedecinePageSkeleton from './medecine-skeleton';

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

const defaultFilters = {
    name: '',
    status: -1,
    delivery: 'All',
    startDate: null,
    endDate: null,
    distance:1
};

const deliveryOptions = [
    {
        id: 1,
        label: "All",
        value: "All"
    },
    {
        id: 2,
        label: "Pick up",
        value: "Pick up"
    },
    {
        id: 3,
        label: "Delivery",
        value: "Delivery"
    },
]

const MedecineDataPage = ({ data }: any) => {
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filters, setFilters]: any = useState(defaultFilters);

    console.log(filters,'FILTERSSSSSSSSSSSSSSSS')
    
  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const { page, rowsPerPage, order, orderBy } = table;

    const [queryFunc, queryResults] = useLazyQuery<any>(QueryAllStoreNoId, {
        variables: {
            data: {
                skip: 0,
                take: 10,
                delivery:filters?.delivery,
                search:filters?.name,
                radius:Number(filters?.distance)
            }
        },
        context: {
            requestTrackerId: 'queryListStoreId[STORE_LIST_QUERY_ID]',
        },
        notifyOnNetworkStatusChange: true,


    });

    useEffect(() => {
        setLoading(true)
        queryFunc().then(async (result) => {
            const { data } = result;


            if (data) {
                const {
                    QueryAllStoreNoId
                } = data;
                setTableData(
                    QueryAllStoreNoId
                )
            }
            setLoading(false)
        });
    }, [filters.delivery, filters.name, filters?.distance]);

 

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
    const userFullName = user?.middleName ? `${user?.firstName} ${user?.middleName} ${user?.lastName}` : `${user?.firstName} ${user?.lastName}`
    const settings = useSettingsContext();

    const notFound = !loading  && !tableData?.length;

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container>
               
                <Grid xs={12} md={12}>
                    <EcommerceWelcome
                        title={`Hi!  ${userFullName}`}
                        description="Merchants near in"
                        location={user?.address}
                        img={<MotivationIllustration />}
                    />
                </Grid>
                <Grid md={12} sx={{ mb:5}}>
                    <Box sx={{maxWidth:700, ml:'auto'}}>
                        <StoreDashboardFiltering deliveryOptions={deliveryOptions} onFilters={handleFilters} filters={filters} />
                    </Box>
                </Grid>
                {loading ? <MedecinePageSkeleton/>:<MedecinePage data={tableData} />}

                <Table>
                    <TableNoData notFound={notFound} />
                </Table>
            </Grid>
        </Container>
    )
}

export default MedecineDataPage