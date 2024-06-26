import { usePopover } from '@/components/custom-popover';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { varHover } from 'src/components/animate';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';
import { paths } from '@/routes/paths';
import { useRouter } from 'next/navigation';

const QueuePopover = () => {
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = useState<string | null>(null)
    const navigate = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleClick = () => {
        navigate.push(paths.queue.root(val))
    }
    const popover = usePopover();

    return (
        <div>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                onClick={popover.onOpen}
                sx={{
                    width: 40,
                    height: 40,
                    background: (theme) => alpha(theme.palette.grey[500], 0.08),
                    // ...(popover.open && {
                    //     background: (theme) =>
                    //         `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    // }
                    // ),
                }}
            >
                <Tooltip onClick={handleClickOpen} title="View queue">
                    <Avatar
                        src={'/assets/queue.svg'}

                        sx={{
                            width: 30,
                            height: 30,
                            border: (theme) => `solid 2px ${theme.palette.background.default}`,
                        }}
                    />
                </Tooltip>

            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: { maxWidth: 620 },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Input Voucher To View Queue"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Stack>
                            {/* <Typography variant="h5">{``}</Typography>

                            <Typography variant="body2" mb={2}>
                              
                            </Typography> */}
                            {/* <QueuePatientCreate onSubmit={onSubmit}/> */}

                            <Stack>
                                <Box
                                    gap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        sm: 'repeat(1, 1fr)',
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        type="text"
                                        name="voucher"
                                        placeholder='Voucher code'
                                        onChange={(e) => setVal(e.target.value)}
                                    />


                                </Box>


                            </Stack>



                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                       
                        variant="contained"
                        onClick={handleClick}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default QueuePopover