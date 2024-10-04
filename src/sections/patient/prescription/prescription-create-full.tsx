import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Dialog, FormControl, Grid, InputAdornment, InputBase, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { LogoFull } from '@/components/logo';
import CloseIcon from '@mui/icons-material/Close';
import { RHFTextField } from '@/components/hook-form';
import { useLazyQuery } from '@apollo/client';
import { QueryAllMedicines } from '@/libs/gqls/merchantUser';
import { Icon } from '@iconify/react';
import { PrescriptionController } from './prescription-create-controller';
import SearchIcon from '@mui/icons-material/Search';
import Iconify from '@/components/iconify';
import PrescriptionMedicine from './prescription-medicine';
import Label from '@/components/label';
import { useSnackbar } from 'src/components/snackbar';
import PrescriptionCreateForm from './prescription-create-form';
import { medicineFormOptions } from '@/utils/constants';
import PrescriptionSideCreate from './prescription-side-crete';
import PrescriptionMedicineList from './prescription-medicine-list';

import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PrescriptionFavoriteListComponent from './prescription-favorite-list';
import PrescriptionTemplate from './PrescriptionTemplate';

const drawerWidth = 300;



function PrescriptionCreateFull(props) {
    const { window, open, onClose, clinicData, refetch } = props;


    const { enqueueSnackbar } = useSnackbar();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [isClosing, setIsClosing] = React.useState(false);

    const [prescriptions, setPrescriptions]: any = React.useState([]);

    const [showSideP, setShowSideP] = React.useState({
        isShow: false,
        data: null,
        isFavorite: false
    });

    console.log(showSideP, 'awittt')

    const [take, setTake] = React.useState(20);
    const [skip, setSkip] = React.useState(0);
    const [search, setSearch] = React.useState('');




    const [payloads, setPayloads] = React.useState({
        take,
        skip,
        search,
        takeFavorites: 20,
        skipFavorites: 0,
        takeTemplates:20,
        skipTemplates:0,
        target: 1
    })

    const { medicineData, getAllMedicineResult, setMedicineData, favorites, allFavorites, templates } = PrescriptionController(payloads)

    console.log(payloads, 'payloadspayloads')
    const handleRemovePresc = (indexData: number) => {
        const newData = prescriptions.filter((item, index) => Number(index) !== Number(indexData));
        setPrescriptions(newData)



        // prescriptions?.filter((item, index)=>Number(index) !== Number(indexData));

    }

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const favoritesRefetch = () => {
        allFavorites.refetch();
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        // if (!isClosing) {
        //   setMobileOpen(!mobileOpen);
        // }
    };

    const changePayload = React.useCallback((name: string, value: string | number) => {
        setPayloads({
            ...payloads,
            [name]: value
        })
    }, [])

    const [tabValue, setTabValue] = React.useState('1');


    const handleSearch = React.useCallback((value) => {
        setPayloads({
            ...payloads,
            search: value,
            target: Number(tabValue)
        })
    }, [payloads?.search, payloads, tabValue])

    const handleSearchReset = React.useCallback(()=>{
        setPayloads({
            ...payloads,
            search: '',
            target: Number(tabValue)
        })
    },[payloads?.search, payloads, tabValue])

    console.log(showSideP,'showSidePshowSideP')
       


    const handleAddPrescription = (item) => {
        console.log(item,'itemmmmmmmm')
        
        if (!item?.is_favorite && !item?.prescription_template) {
            console.log("dito sa una")
            setShowSideP({
                isShow: true,
                data: {
                    ...item,
                    Form: item?.Form?.toLowerCase()
                }
            });

        }
        else {
            console.log("dito sa dulo")

            setShowSideP({
                isShow: true,
                data: {
                    Dose: item?.DOSE,
                    Form: item?.FORM?.toLowerCase(),
                    GenericName: item?.MEDICINE,
                    ID: item?.PR_ID,
                    duration: item?.DURATION,
                    frequency: item?.FREQUENCY,
                    brand: item?.MED_BRAND,
                    quantity: item?.QUANTITY,
                    isFavorite: true
                },
                isFavorite: true
            })
        }
    }

    const Page = React.useRef(1);


    const fetchMore = React.useCallback(() => {
        getAllMedicineResult.refetch({
            data: {
                take: take,
                skip: Page.current * 10, // Assuming "take" is the number of items per page
                search: payloads?.search,
            },
        }).then((res) => {
            const { QueryAllMedicines } = res?.data;

            // Make sure QueryAllMedicines and medicine_data exist
            if (QueryAllMedicines?.medicine_data) {
                setMedicineData((prevData) => ({
                    ...prevData,
                    tableData: [...prevData.tableData, ...QueryAllMedicines.medicine_data],
                }));

                Page.current += 1; // Increment the page counter after successful fetch
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            // Optionally handle error state here
        });
    }, [take, Page.current, payloads?.search]); // Updated dependencies





    const MedicineList = React.useCallback(() => {
        return (
            <PrescriptionMedicineList templates={templates} favorites={favorites} handleAddPrescription={handleAddPrescription} medecineData={medicineData} fetchMoreData={fetchMore} />
            // <Box sx={{ position: 'relative', zIndex: 10000,  height:'100%', display:'flex', flexDirection:'column' }}>
            //     <Box sx={{ mt: 1, p: 2,pb:10, w: '100%', overflowY: 'auto', height:'100%', flex:1}}> {/* Adjust height accordingly */}
            //         <Typography variant="body2">Medicines Available</Typography>
            //         <List>
            //             {medicineData?.tableData.map((item, index) => (
            //                 <PrescriptionMedicine key={index} item={item} onAdd={() => handleAddPrescription(item)} />
            //             ))}
            //         </List>
            //     </Box>
            //     <Box sx={{
            //         position: 'fixed',
            //         width: '100%',
            //         bottom: 0,
            //         left: 0,
            //         pl: 5,
            //         py: 2,
            //         background: '#fff',
            //         zIndex: 1000, // Ensure it's above other content
            //         flex:1
            //     }}>
            //         <Button sx={{
            //             display: 'flex',
            //             alignItems: 'center',
            //             gap: 2,
            //         }}>
            //             <Icon icon="carbon:add-filled" fontSize={22} />
            //             <Typography>Add Medication</Typography>
            //         </Button>
            //     </Box>
            // </Box>
        );
    }, [medicineData])


    const [toAddData, setToAddData] = React.useState({
        name: '',
        dose: '',
        quantity: '',
        frequency: '',
        duration: '',
        form: '',
    })

    const toAddHandler = (name, val) => {
        setToAddData({
            ...toAddData,
            [name]: val
        })
    }

    React.useEffect(() => {
        if (showSideP?.data) {
            setToAddData({
                ...toAddData,
                name: showSideP?.data?.GenericName
            })
        }
    }, [showSideP?.data])



    const handleAddPFinal = React.useCallback((dataItem) => {
        const isExists = prescriptions?.find((item) => Number(item?.ID) === Number(dataItem?.id))

        const newData: any = { ...dataItem }

        if (!isExists) {
            setPrescriptions((prev) => {
                return [
                    ...prev,
                    newData
                ]
            })
            setShowSideP({
                isShow: false,
                data: null
            })
            setToAddData({
                name: '',
                dose: '',
                quantity: '',
                frequency: '',
                duration: '',
                form: '',
            })
            enqueueSnackbar('Added Successfully!');
        }
    }, [toAddData.name, toAddData.dose, toAddData.quantity, toAddData.frequency, toAddData.duration, toAddData.form])


    const addDirectPrescriptions = (row:any) => {
        const dataRes = row?.prescription_child?.map((items)=>{
            return {
                dose: items?.DOSE,
                form: items?.FORM?.toLowerCase(),
                name: items?.MEDICINE,
                duration: items?.DURATION,
                frequency: items?.FREQUENCY,
                brand: items?.MED_BRAND,
                quantity: items?.QUANTITY,
            }
        })

        setPrescriptions([
            ...dataRes
        ])
    }

    const handleBack = () => {
        setShowSideP({
            isShow: false,
            data: null
        })
    }

    const handleSubmitSide = React.useCallback((data) => {
        handleAddPFinal(data)
    }, [])

    const CreateMedicine = () => {
        return (
            <Stack sx={{ mt: 1, p: 2, w: '100%', pb: 10 }}>
                <PrescriptionSideCreate
                    data={showSideP?.data}
                    onSubmit={handleSubmitSide}
                    handleBack={handleBack}
                />
            </Stack>
            // <Stack sx={{ mt: 1, p: 2, w: '100%', pb: 10 }} gap={3}>

            //     <TextField
            //         id="outlined-password-input"
            //         label="Generic Name"
            //         type="text"
            //         onChange={(e) => toAddHandler('name', e.target.value)}
            //         defaultValue={toAddData.name}
            //     />


            //     <Grid container gap={2} justifyContent="space-between">
            //         <Grid item xs={12} lg={5}>
            //             <TextField
            //                 fullWidth
            //                 id="outlined-password-input"
            //                 label="Dose"
            //                 type="text"
            //                 onChange={(e) => toAddHandler('dose', e.target.value)}
            //                 value={showSideP?.data?.Dose}



            //             />

            //         </Grid>
            //         <Grid item xs={12} lg={5}>
            //             <TextField
            //                 fullWidth
            //                 onChange={(e) => toAddHandler('quantity', e.target.value)}
            //                 value={toAddData?.quantity}
            //                 id="outlined-password-input"
            //                 label="Quantity"


            //             />
            //         </Grid>
            //         <Grid item xs={12} >
            //             <TextField
            //                 fullWidth
            //                 id="outlined-password-input"
            //                 label="Frequecy (in days)"
            //                 onChange={(e) => toAddHandler('frequency', e.target.value)}
            //                 value={toAddData?.frequency}
            //                 type="number"

            //             />

            //         </Grid>
            //         <Grid item xs={12} >
            //             <TextField
            //                 fullWidth
            //                 onChange={(e) => toAddHandler('duration', e.target.value)}
            //                 id="outlined-password-input"
            //                 label="Duration (in days)"
            //                 type="number"
            //                 value={toAddData?.duration}

            //             />
            //         </Grid>
            //     </Grid>
            //     <FormControl fullWidth>
            //         <InputLabel id="demo-simple-select-label">Form</InputLabel>
            //         <Select
            //             onChange={(e) => toAddHandler('form', e.target.value)}

            //             labelId="demo-simple-select-label"
            //             id="demo-simple-select"
            //             value={toAddData.form}
            //             label="Age"
            //             sx={{
            //                 textTransform:'capitalize'
            //             }}

            //         >
            //             {medicineFormOptions?.map((item)=>(
            //                 <MenuItem value={item?.value} key={item?.id} sx={{
            //                     textTransform:'capitalize'
            //                 }}>{item?.label}</MenuItem>
            //             ))}
            //         </Select>
            //     </FormControl>
            //     <Button fullWidth onClick={handleAddPFinal} variant="contained">
            //         Add
            //     </Button>
            //     <Button fullWidth onClick={handleBack} variant="outlined">
            //         Go Back
            //     </Button>
            // </Stack>
        )
    }



    const handleChange = React.useCallback((event, newValue) => {
        setTabValue(newValue);
        setShowSideP({
            isShow: false,
            data: null,
            isFavorite: false
        })
        setPayloads({
            ...payloads,
            search: '',
            target: Number(newValue)
        })
    }, [tabValue, payloads?.search, payloads])


    const drawer = (
        <Box sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box>
                <Toolbar>
                    <LogoFull />
                </Toolbar>
                <Divider />
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px', mt: 1, display: 'flex', alignItems: 'center', width: '100%',
                    }}
                >

                    <InputBase
                        sx={{ ml: 1, flex: 1, p: 1, background: '#ededed' }}
                        placeholder="Search medicine"
                        value={payloads?.search}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleSearchReset}
                                    edge="end"
                                    sx={{
                                        pr: 1
                                    }}
                                >
                                    <Iconify icon="carbon:close-filled" />
                                </IconButton>
                            </InputAdornment>
                        }
                        inputProps={{ 'aria-label': 'search google maps' }}
                        onChange={(e) => {
                            handleSearch(e.target.value)
                        }}
                    />

                    {/* <IconButton type="button" sx={{ p: 1 }} aria-label="search">
                      
                    </IconButton> */}
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                </Paper>
            </Box>
            <Box sx={{
                overflowY: 'scroll',
                flex: 1,
                height: '100%'
                // zIndex: 99999
            }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Medicine List" value="1" />
                            <Tab label="Favorites" value="2" />
                            <Tab label="Template" value="3" />

                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {!showSideP.isShow ? <MedicineList /> : <CreateMedicine />}
                    </TabPanel>
                    <TabPanel value="2">
                        {!showSideP.isShow && !showSideP?.isFavorite ? <PrescriptionFavoriteListComponent favorites={favorites} handleAddPrescription={handleAddPrescription} /> : <CreateMedicine />}
                    </TabPanel>
                    <TabPanel value="3">
                        {<PrescriptionTemplate addDirectPrescriptions={addDirectPrescriptions} templates={templates}/> }
                    </TabPanel>
                </TabContext>
                {/* {!showSideP.isShow ?  : } */}
            </Box>
        </Box>
    );


    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window.document.body : undefined;


    const PrescriptionRow = ({ row }) => {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <Iconify icon="healthicons:rx-outline" height={60} width={68} />
                <Typography sx={{
                    fontWeight: 'bold'
                }}>
                    {row?.GenericName}
                </Typography>
                <Typography>
                    {row?.Dose}
                </Typography>
                <Typography>
                    {row?.Form}
                </Typography>
            </Box>
        )
    }

    const clearItem = () => {
        setPrescriptions([])
    }

    const [closeCreate, setCloseCreate] = React.useState(false);

    const handleClose = () => {
        onClose();
        setCloseCreate(true)
        setPrescriptions([])
    }

    return (
        <Dialog fullScreen open={open}>
            <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        background: '#fff',
                        zIndex: 999
                    }}
                >
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <Stack direction="row" alignItems="center">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                New Prescription
                            </Typography>
                        </Stack>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

                    {/* mobile */}
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerClose}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            zIndex: 9000,
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '75vw' },
                        }}
                    >
                        {drawer}
                    </Drawer>

                    {/* up */}
                    <Drawer
                        style={{
                            background: 'red',
                            padding: 10
                        }}
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            height: '100%',
                            backgroundColor: 'red',
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, height: '100%', width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    {/* main */}
                    <Box sx={{
                        mt: 5,
                        ml: { lg: 10 },
                    }}>
                        <Typography sx={{ mb: 2 }} variant="body1">Prescription</Typography>
                        <Stack gap={2}>
                            <PrescriptionCreateForm closeCreate={closeCreate} refetch={favoritesRefetch} handleClose={handleClose} clearItem={clearItem} removeItem={handleRemovePresc} currentItem={prescriptions} clinicData={clinicData} />
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}

PrescriptionCreateFull.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};

export default PrescriptionCreateFull
