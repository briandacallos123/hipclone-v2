"use client"

import { Box, Dialog, DialogContent, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ScannerView from '../../scan/view'
import { PrescriptionsUserQr } from '@/libs/gqls/prescription';
import { useLazyQuery } from '@apollo/client';
import { PDFViewer } from '@react-pdf/renderer';
import PrescriptionPDF from '@/sections/prescription/prescription-pdf';
import { styled } from '@mui/material/styles';
import MerchantHeader from './merchat-view-header';
import { LogoFull } from 'src/components/logo';

const StyledRoot = styled('section')(({ theme, bgImage }) => ({
    // padding: theme.spacing(0, 10),
    background: `url("${bgImage}") no-repeat center`,
    backgroundSize: 'cover',
    // width:'100vw',
    height: '100vh',
    color: theme.palette.common.white,
    marginTop:-10,
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(8, 0),
    },
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(14, 0),
    },
}));


let imageURL = './assets/background/bgScan.jpg';

const MerchantView = () => {

    const [voucherId, setVoucherId] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [isOpenScanner, setOpenScanner] = useState<boolean|null>(null)
    const [voucherCode, setVoucherCode] = useState<string | null>(null)

    // console.log(voucherCode,'HEEEEEEEEE')
    const [getPrecsciption, { data, loading, error }] = useLazyQuery(PrescriptionsUserQr, {
        context: {
            requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
        },
        notifyOnNetworkStatusChange: true,
    });


    useEffect(() => {
        if (voucherCode || voucherId) {
            getPrecsciption({
                variables: {
                    data: {
                        presCode: voucherCode || voucherId
                    },
                },
            }).then(async (result: any) => {
                const { data } = result;

                if (data) {
                    const { QueryAllPrescriptionUserQr } = data;
                    setCurrentItem(QueryAllPrescriptionUserQr?.Prescription_data)

                }
                // setIsLoading(false);
            });
        }
    }, [voucherCode, voucherId])


    const handleChangeVoucher = (e: any) => {
        // const val = e.target.value;

        if (e.length === 6) {
            setVoucherId(e)
        }
    }

    const handleClose = () => { }

    const openScanner = () => {
        console.log("open",'HEHE')
        setOpenScanner(true)
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            fullScreen
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                height: '100%',
                overflowY:'hidden',
                // scroll:
            }}>
            <DialogContent sx={{
                height: '100%',
            }}>

                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <LogoFull />
                </div>

                <StyledRoot bgImage={imageURL}>
                    <Grid
                        container
                        sx={{
                            height: '100%'
                        }}>
                        <Grid item md={12}>
                            <MerchantHeader handleChangeVoucher={handleChangeVoucher} setOpenScanner={openScanner}/>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            {isOpenScanner && <ScannerView setVoucherCode={setVoucherCode} handleChangeVoucher={handleChangeVoucher} />}
                        </Grid>

                        <Grid item sm={12} md={isOpenScanner ? 6:12}>
                            {currentItem && <Box sx={{ height: 500, position:'relative'}}>
                                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                    <PrescriptionPDF item={currentItem} />
                                </PDFViewer>
                            </Box>}
                        </Grid>
                    </Grid>
                </StyledRoot>

            </DialogContent>
        </Dialog>
    )
}

export default MerchantView