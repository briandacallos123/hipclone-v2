import React, { useCallback, useEffect, useState } from 'react'
import StoreManageController from './storeManageController'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, MenuItem, Stack, Table, Typography } from '@mui/material'
import Iconify from '@/components/iconify'
import { fCurrency } from '@/utils/format-number'
import StoreProductSkeletonView from './loading/store-product-skeleton'
import CustomPopover, { usePopover } from '@/components/custom-popover'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
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
import Label from '@/components/label'
import MerchantCreateView from '@/sections/merchant/medecine/view/merchant-create-view'
import { useBoolean } from '@/hooks/use-boolean'
import { ConfirmDialog } from '@/components/custom-dialog'
import SidebarFitering from '@/sections/medecine-final/id/sidebar-filtering'
//   import StoreManageController from './storeManageController'

const defaultFilters = {
    name: '',
    status: -1,
    type: '',
    startDate: null,
    endDate: null,
    startingPrice: null,
    endPrice: null,
    sort: ""
};


const StoreProducts = () => {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const { filters, tableData, queryResults, handleSubmitDelete, handleFilters } = StoreManageController()
    const { id: pageId } = useParams()
    const opencreate = useBoolean();
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState(null)
    // const [filters, setFilters]: any = useState(defaultFilters);

    // console.log(filters,'HUHHHHHHHHHHHHHHHHHH')

    const notFound = !queryResults.loading && tableData.length === 0;

    const handleView = (id: number) => {
        router.push(`/merchant/dashboard/store/${pageId}/${id}`)
    }
    const confirmApprove = useBoolean();

    const [deleteId, setDeleteId] = useState(null)

    const handleDelete = (id) => {
        setDeleteId(id)
        confirmApprove.onTrue()
        // handleSubmitDelete(id)
    }

    const handleEdit = (data: any) => {
        opencreate.onTrue()
        setIsEdit(true)
        setEditData(data);
    }

    const [listView, setListView] = useState('grid')

    const handleListView = (val: string) => {
        setListView(val)
    }

    const isListView = listView === 'list';

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
            id: 1,
            label: "Best Selling",
            value: "Best Selling"
        },
        {
            id: 2,
            label: "Latest Product",
            value: "Latest Products"

        },
        {
            id: 3,
            label: "Name Descending",
            value: "Name Descending"
        },
        {
            id: 4,
            label: "Name Ascending",
            value: "Name Ascending"
        },
    ]


    // const handleFilters = useCallback(
    //     (name: string, value: any) => {
    //         setFilters((prevState: any) => {

    //             return {
    //                 ...prevState,
    //                 [name]: value,
    //             }
    //         });
    //     },
    //     []
    // );

    return (
        <Box sx={{
            mt: 3
        }}>

            <Grid justifyContent="flex-start" container >
                <Grid justifyContent="flex-start" alignItems="flex-start" sx={{
                    height: 700
                }} item lg={10} gap={isListView ? 4 : 2} container>
                    {queryResults.loading ? <StoreProductSkeletonView /> :
                        tableData?.map((item) => (
                            <Grid item lg={isListView ? 12 : 3}>
                                <GridItems
                                    handleDelete={() => {
                                        handleDelete(item?.id)
                                    }}
                                    handeView={() => handleView(item?.id)}
                                    handleEdit={() => handleEdit(item)}
                                    listView={isListView}
                                    item={item}
                                />
                            </Grid>
                        ))}
                </Grid>
                <Grid lg={2}>
                    <SidebarFitering listView={listView} handleListView={handleListView} sortOptions={sortOptions} typeOptions={typeOptions} onFilters={handleFilters} filters={filters} />
                </Grid>
            </Grid>
            <MerchantCreateView editData={editData} isEdit={isEdit} onClose={() => {
                opencreate.onFalse();

            }} open={opencreate.value} />
            <Table>
                <TableNoData notFound={notFound} />
            </Table>

            <ConfirmDialog
                open={confirmApprove.value}
                onClose={confirmApprove.onFalse}
                title="Approve"
                content={
                    <>
                        Are you sure want to delete this item?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                            handleSubmitDelete(deleteId)
                            confirmApprove.onFalse()
                        }}
                    >
                        Submit
                    </Button>
                }
            />
        </Box>
    )
}
const GridItems = ({ item, listView, handeView, handleDelete, handleEdit }: any) => {
    const popover = usePopover();
    const isRow = false;

    const { id, attachment_info, price, quantity_sold, generic_name, description, address, rating, product_types, stock } = item;

    return (
        <Card sx={{ maxWidth: listView ? '100%' : 400 }}>
            <CardActionArea
                disableRipple
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: listView ? 'row' : 'column',
                    }}
                >
                    <Box sx={{ width: listView ? '50%' : '100%', pt:5 }}>
                        <CardMedia
                            component="img"
                            image={`/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
                            alt={generic_name}
                            // height={listView ? 200 : '100%'}
                            // width={listView ? 200 : '100%'}
                            width={200}
                            height={200}
                            sx={{
                                objectFit: 'contain',
                                borderRadius:10
                            }}
                        />
                    </Box>
                    <CardContent sx={{
                        display: isRow && 'flex',
                        alignItems: isRow && 'center',
                        flex: 1,
                        justifyContent: isRow && 'space-between',
                        width: listView ? '50%' : '100%',
                        p: 1,
                    }}>
                        <Stack sx={{
                            width: '100%',
                        }}>
                            <Typography variant="h6" sx={{ textTransform: 'capitalize' }} >
                                {`${generic_name}`}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                                {stock && <Label variant="soft" color={stock > 10 ? "success" : "error"}>
                                    {stock <= 10 ? `${fCurrency(stock)} stocks left!` : `Stocks: ${fCurrency(stock)}`}
                                </Label>}
                                <Label>Sold: {!quantity_sold ? 0 : quantity_sold}</Label>

                            </Stack>
                            {price && <Typography sx={{ mt: 2 }}>
                                ₱ {fCurrency(price)}
                            </Typography>}
                        </Stack>
                    </CardContent>
                    <Box sx={{ pt: { xs: 2 }, position:'absolute', top:0, right:0}}>
                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Box>
                </Box>
            </CardActionArea>
            <Stack direction="row" justifyContent="flex-end">
                <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handeView();
                        }}
                        sx={{ color: 'success.main' }}
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handleEdit();
                        }}
                        sx={{ color: 'success.main' }}
                    >
                        <Iconify icon="bi:pen-fill" />
                        Edit
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handleDelete();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </CustomPopover>
            </Stack>
        </Card>
    );
};

export default StoreProducts