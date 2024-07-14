import React, { useEffect, useState } from 'react'
import StoreManageController from './storeManageController'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, MenuItem, Stack, Table, Typography } from '@mui/material'
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
//   import StoreManageController from './storeManageController'

const StoreProducts = () => {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const { tableData, queryResults, handleSubmitDelete } = StoreManageController()
    const { id: pageId } = useParams()


    const notFound = !queryResults.loading && tableData.length === 0;

    const handleView = (id: number) => {
        router.push(`/merchant/dashboard/store/${pageId}/${id}`)
    }



    const handleDelete = (id: number) => {
        handleSubmitDelete(id)
    }

  

    return (
        <Box sx={{
            mt: 3
        }}>

            <Grid justifyContent="flex-start" container gap={2}>
                {queryResults.loading && <StoreProductSkeletonView />}
                {tableData?.map((item) => (
                    <GridItems handleDelete={() => {
                        handleDelete(item?.id)
                    }} handeView={() => handleView(item?.id)} item={item} />
                ))}
            </Grid>
            <Table>
                <TableNoData notFound={notFound} />
            </Table>
        </Box>
    )
}

const GridItems = ({ item, handeView, handleDelete }: any) => {


    const popover = usePopover();
    const isRow = false;

    const { id, attachment_info, price, generic_name, description, address, rating, product_types } = item;
    return (
        <Grid key={id} xl={3}>
            <Card sx={{ maxWidth: isRow ? '100%' : 400 }}>
                <CardActionArea
                    disableRipple
                    sx={{
                        cursor: 'default'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                        }}
                    >

                        <Box sx={{
                            width: '30%'
                        }}>
                            <CardMedia
                                component="img"
                                image={`https://hip.apgitsolutions.com/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
                                alt={generic_name}
                                height="100%"
                                width="100%"
                            />
                        </Box>
                        <CardContent sx={{
                            display: isRow && 'flex',
                            alignItems: isRow && 'center',
                            width: '70%',
                            justifyContent: isRow && 'space-between',
                        }}>
                            <Box sx={{
                                width: '100%'
                            }}>
                                <Typography variant="h6" >
                                    {`${generic_name}`}
                                </Typography>

                                <Typography sx={{
                                    textTransform: 'capitalize',
                                    mt: 2
                                }} variant="body2" color="grey">
                                    {description}
                                </Typography>
                                <Typography sx={{
                                    mt: 2
                                }}>
                                    ₱ {fCurrency(price)}
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                                    <Iconify icon="eva:more-vertical-fill" />
                                </IconButton>

                            </Box>

                        </CardContent>
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
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
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