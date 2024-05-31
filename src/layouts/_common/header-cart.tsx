import Iconify from '@/components/iconify/iconify'
import { Badge, Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import { varHover } from 'src/components/animate';
import { m } from 'framer-motion';
import { useBoolean } from '@/hooks/use-boolean';

const HeaderCart = () => {

    const drawer = useBoolean();

    const renderHead = (
        <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Cart
            </Typography>

            {/* {!!totalUnRead && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
    
          {!smUp && (
            <IconButton onClick={drawer.onFalse}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          )} */}
        </Stack>
    );

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                color={'primary'}
                onClick={drawer.onTrue}
            >
                <Badge badgeContent={5} color="error">
                    <Iconify
                        className={Boolean(5) && 'bell'}
                        icon="solar:cart-bold"
                        width={24}
                    />
                </Badge>
            </IconButton>

            <Drawer
                open={drawer.value}
                onClose={drawer.onFalse}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: { width: 1, maxWidth: 420, display:'flex', flexDirection:'column' },
                }}
                className="drawer"
            >
                {renderHead}

                <Divider />

                {/* <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pl: 2.5, pr: 1 }}
                >
                    {renderTabs}
                    <IconButton onClick={handleMarkAllAsRead}>
                        <Iconify icon="solar:settings-bold-duotone" />
                    </IconButton>
                </Stack> */}

                <Divider />

                {/* {viewId && <AppointmentDetailsView
                    updateRow={() => {
                        console.log("updatedrow")
                    }}
                    refetch={() => {
                        console.log("refetech")
                    }}
                    refetchToday={() => {
                        console.log('Fetching..');
                    }}
                    open={openView.value}
                    onClose={openView.onFalse}
                    id={viewId}
                    notif={true}
                />}
                <Table>
                    {isLoading && !notification_data?.length && [...Array(5)].map((_, i) => <NotificationSkeleton key={i} />)}
                </Table>

                {renderList}

                <Box sx={{ p: 1 }}>
                    <Button component={RouterLink} href={paths.dashboard.notification} fullWidth size="large">
                        View All
                    </Button>
                </Box> */}
                 <Box sx={{ p: 1 }}>
                    <Button variant="contained" color="success" component={m.button}  fullWidth size="large">
                        Place Order
                    </Button>
                </Box>
            </Drawer>
        </>
    )
}

export default HeaderCart