import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
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

// ----------------------------------------------------------------------

type Props = {
  filters: IAppointmentTableFilters;
  onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
  deliveryOptions:any
};

export default function StoreDashboardFiltering({
  filters,
  onFilters,
  deliveryOptions
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

  const handleFilterDelivery= useCallback(
    (event: SelectChangeEvent<string[]>) => {
      let val:any =  event.target.value
      // console.log(val,': VALUE NG DELIVERY');

      onFilters(
        'delivery',
        val
      );
    },
    [onFilters]
  );

  const handleFilterDistance= useCallback(
    (event: SelectChangeEvent<string[]>) => {
      let val =  event.target.value

      onFilters(
        'distance',
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
      id:1,
      labe:"1",
      value:1
    },
    {
      id:2,
      labe:"3",
      value:3
    },
    {
      id:3,
      labe:"5",
      value:5
    },
    {
      id:4,
      labe:"10",
      value:10
    },
  ]

  const renderFields = (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      >
        <InputLabel>Distance</InputLabel> 

       <Select
          // multiple
          value={filters?.distance}
          onChange={handleFilterDistance}
          input={<OutlinedInput label="Delivery" />}
          renderValue={(selected) =>
            distanceOption?.find((item: any) => item.value === selected)?.value + ' Km'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {distanceOption?.map((option: any) => (
            <MenuItem key={option?.id} value={option?.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters?.distance === option?.value}
                // checked={!!filters.distance.filter((v: any) => v === option?.id).length}
              />
              {option?.value} Km
            </MenuItem>
          ))}
        </Select> 
      </FormControl> 
     <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      >
        <InputLabel>Delivery</InputLabel> 

       <Select
          // multiple
          value={filters.delivery}
          onChange={handleFilterDelivery}
          input={<OutlinedInput label="Delivery" />}
          renderValue={(selected) =>
            deliveryOptions?.find((item: any) => item.value === selected)?.value
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {deliveryOptions?.map((option: any) => (
            <MenuItem key={option?.id} value={option?.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.delivery === option.value}
              />
              {option?.label}
            </MenuItem>
          ))}
        </Select> 
      </FormControl> 

      {/* <DatePicker
        label="Start date"
        value={filters.startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label="End date"
        value={filters.endDate}
        onChange={handleFilterEndDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      /> */}
    </>
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {upMd && renderFields}

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search Store Name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row">
            {!upMd && <TableToolbarPopover>{renderFields}</TableToolbarPopover>}

            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

