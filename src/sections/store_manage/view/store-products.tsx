import React, { useEffect, useState } from 'react'
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
//   import StoreManageController from './storeManageController'

const StoreProducts = () => {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const { tableData, queryResults, handleSubmitDelete } = StoreManageController()
    const { id: pageId } = useParams()
    const opencreate = useBoolean();
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState(null)

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





    return (
        <Box sx={{
            mt: 3
        }}>

            <Grid justifyContent="flex-start" container gap={2}>
                {queryResults.loading && <StoreProductSkeletonView />}
                {tableData?.map((item) => (
                    <GridItems
                        handleDelete={() => {
                            handleDelete(item?.id)
                        }}
                        handeView={() => handleView(item?.id)}
                        handleEdit={() => handleEdit(item)}
                        item={item}
                    />
                ))}
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

const GridItems = ({ item, handeView, handleDelete, handleEdit }: any) => {


    const popover = usePopover();
    const isRow = false;

    const { id, attachment_info, price, generic_name, description, address, rating, product_types, stock } = item;
    return (
        <Grid key={id} xs={12} sm={4} xl={3} >
            <Card sx={{ maxWidth: isRow ? '100%' : 400, height: 150 }}>
                <CardActionArea
                    disableRipple
                    sx={{
                        cursor: 'default',
                        height: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            height: '100%'
                        }}
                    >

                        <Box sx={{ flex: 1, height: '100%' }}>
                            <CardMedia
                                component="img"
                                image={`/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
                                alt={generic_name}
                                height="100%"
                                width="100%"
                            />
                        </Box>
                        <CardContent sx={{
                            display: isRow && 'flex',
                            alignItems: isRow && 'center',
                            flex: 1,
                            justifyContent: isRow && 'space-between',
                            p: 2
                        }}>
                            <Box sx={{
                                width: '100%'
                            }}>
                                <Typography variant="h6" >
                                    {`${generic_name}`}
                                </Typography>


                                {stock && <Label variant="soft" color={stock > 10 ? "success" : "error"}>
                                    {stock <= 10 ? `${fCurrency(stock)} stocks left!` : `Stocks: ${fCurrency(stock)}`}
                                </Label>}

                                {/* <Typography sx={{
                                    textTransform: 'capitalize',
                                    mt: 2
                                }} variant="body2" color="grey">
                                    {description}
                                </Typography> */}
                                {price && <Typography sx={{
                                    mt: 2
                                }}>
                                    ₱ {fCurrency(price)}
                                </Typography>}

                            </Box>


                        </CardContent>
                        <Box sx={{
                            pt: { xs: 2 }
                        }}>
                            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                                <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>

                        </Box>
                    </Box>
                </CardActionArea>
            </Card>
            <Stack direction="row" justifyContent="flex-end">
                <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">


                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handeView()
                        }}
                        sx={{
                            color: 'success.main'
                        }}
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handleEdit()
                        }}
                        sx={{
                            color: 'success.main'
                        }}
                    >
                        <Iconify icon="bi:pen-fill" />
                        Edit
                    </MenuItem>


                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                            handleDelete()
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </CustomPopover>
            </Stack>
        </Grid>
    )
}

export default StoreProducts