import { useCallback, useEffect, useRef, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentTableFilters, IAppointmentTableFilterValue } from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import { TableToolbarPopover } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Box, Button, Slider, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
    filters: IAppointmentTableFilters;
    onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
    typeOptions: any;
    sortOptions?:any;
    handleListView?:any;
    listView?:any;
};

export default function SidebarFitering({
    filters,
    onFilters,
    typeOptions,
    sortOptions,
    handleListView,
    listView
    //
}: Props) {
    const upMd = useResponsive('up', 'md');

    const popover = usePopover();

    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFilters('name', event.target.value);
        },
        [onFilters]
    );

    const handelType = useCallback(
        (event: SelectChangeEvent<string[]>) => {
            let val: any = event.target.value

            onFilters(
                'type',
                val
            );
        },
        [onFilters]
    );
    const handelSort = useCallback(
        (event: SelectChangeEvent<string[]>) => {
            let val: any = event.target.value

            onFilters(
                'sort',
                val
            );
        },
        [onFilters]
    );


    const handleFilterStartingPrice = useCallback(
        (event: SelectChangeEvent<string[]>) => {
            let val = event.target.value

            onFilters(
                'startingPrice',
                Number(val) === 0 ? null : val
            );
        },
        [onFilters]
    );

    const handleFilterEndPrice = useCallback(
        (event: SelectChangeEvent<string[]>) => {
            let val = event.target.value

            onFilters(
                'endPrice',
                val
            );
        },
        [onFilters]
    );

    const handleFilterStartDate = useCallback(
        (newValue: any) => {
            onFilters('startDate', newValue);
        },
        [onFilters]
    );

    const handleFilterEndDate = useCallback(
        (newValue: any) => {
            onFilters('endDate', newValue);
        },
        [onFilters]
    );

    const distanceOption = [
        {
            id: 1,
            value: 1
        },
        {
            id: 2,
            value: 3
        },
        {
            id: 3,
            value: 5
        },
        {
            id: 4,
            value: 10
        },
    ]

    const marks = [
        {
            value: 0,
            label: '0',
        },

        {
            value: 10000,
            label: '10,000',
        },

    ];

    function valuetext(value: any) {
        return `${value}`;
    }

    const [val, setVal] = useState(0)

    const handleChange = (e: any) => {
        setVal(e.target.value)

        onFilters(
            'startingPrice',
            e.target.value
        );

    }



    const renderFields = (
        <>
            <Stack sx={{
                pl:1
            }} direction="row" alignItems="center" gap={2}>
                <Typography>View As</Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Tooltip  title="grid view">
                        <Iconify onClick={()=>handleListView('grid')} sx={{cursor:'pointer'}} icon={listView === 'grid' ? "material-symbols:grid-view":"material-symbols-light:grid-view-outline"} width={25} />
                    </Tooltip>
                    <Tooltip  title="list view">
                         <Iconify onClick={()=>handleListView('list')} sx={{cursor:'pointer'}} icon={listView === 'list' ? "material-symbols:view-list-sharp":"material-symbols-light:view-list-outline"} width={25} />
                    </Tooltip>
                </Stack>
            </Stack>

            <TextField
                fullWidth
                value={filters.name}
                onChange={handleFilterName}
                placeholder="Search Medecine"
                sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 200 },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl
                sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 200 },
                }}
            >
                <InputLabel>Sort By: </InputLabel>

                <Select
                    value={filters.sort}
                    onChange={handelSort}
                    input={<OutlinedInput label="Delivery" />}
                    renderValue={(selected) =>
                        sortOptions?.find((item: any) => item.value === selected).value
                    }
                    sx={{ textTransform: 'capitalize' }}
                >
                    {sortOptions?.map((option: any) => (
                        <MenuItem key={option?.id} value={option?.value}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={filters.sort === option.value}
                            />
                            {option?.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            {/* <FormControl
                sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 200 },
                }}
            >
                <InputLabel>Type</InputLabel>

                <Select
                    value={filters.type}
                    onChange={handelType}
                    input={<OutlinedInput label="Delivery" />}
                    renderValue={(selected) =>
                        typeOptions?.find((item: any) => item.value === selected).value
                    }
                    sx={{ textTransform: 'capitalize' }}
                >
                    {typeOptions?.map((option: any) => (
                        <MenuItem key={option?.id} value={option?.value}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={filters.type === option.value}
                            />
                            {option?.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

            <Box sx={{ width: 200 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Price (₱)</Typography>
                    <Button>Clear</Button>
                </Stack>
                <Stack gap={1} direction="row" alignItems="center">
                    <TextField
                        fullWidth
                        value={filters.startingPrice}
                        onChange={handleFilterStartingPrice}
                        placeholder="0"
                        sx={{
                            flexShrink: 0,
                            width: { xs: 1, md: 100 },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="fa6-solid:peso-sign" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Typography> - </Typography>
                    <TextField
                        fullWidth
                        value={filters.endPrice}
                        onChange={handleFilterEndPrice}
                        placeholder="10,000"
                        sx={{
                            flexShrink: 0,
                            width: { xs: 1, md: 100 },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="fa6-solid:peso-sign" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                {/* 
                <Slider
                    aria-label="Always visible"
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    step={100}
                    marks={marks}
                    value={val} 
                    onChange={handleChange}
                    max={10000}
                    valueLabelDisplay={val !== 0 ? "on":"off"}
                /> */}
            </Box>


        </>
    );

    return (
        <>
            <Stack
                spacing={2}
               
                direction={{
                    xs: 'column',
                    md: 'column',
                }}
                sx={{
                    p: 2.5,
                    pr: { xs: 2.5, md: 1 },
                    position:'sticky',
                    top:100
                }}
            >
                {upMd && renderFields}

            </Stack>

        </>
    );
}
