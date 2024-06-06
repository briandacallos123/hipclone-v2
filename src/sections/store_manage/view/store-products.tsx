import React from 'react'
import StoreManageController from './storeManageController'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, MenuItem, Stack, Typography } from '@mui/material'
import Iconify from '@/components/iconify'
import { fCurrency } from '@/utils/format-number'
import StoreProductSkeletonView from './loading/store-product-skeleton'
import CustomPopover, { usePopover } from '@/components/custom-popover'

const StoreProducts = () => {

    const { tableData, loading } = StoreManageController()


    console.log(tableData, loading, 'LIST_______________')



    return (
        <Box sx={{
            mt: 3
        }}>
            <Grid justifyContent="flex-start" container gap={2}>
                {!tableData?.length && loading && <StoreProductSkeletonView />}
                {tableData?.map((item) => (
                    <GridItems item={item} />
                ))}
            </Grid>
        </Box>
    )
}

const GridItems = ({ item }: any) => {


    const popover = usePopover();
    const isRow = false;

    const { id, attachment_info, price, generic_name, description, address, rating, product_types } = item;
    return (
        <Grid key={id} xl={3}>
            <Card sx={{ maxWidth: isRow ? '100%' : 400 }}>
                <CardActionArea


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
                                image={`http://localhost:9092/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
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
                        }}
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            popover.onClose();
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