import { useCallback, useState } from 'react';
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
import { Slider, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  filters: IAppointmentTableFilters;
  onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
  deliveryOptions: any;
  handleChange: any;
  val: any
};

const MAX = 100;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: 'Min',
  },
  {
    value: MAX,
    label: 'Max',
  },
];


export default function StoreDashboardFiltering({
  filters,
  onFilters,
  deliveryOptions,

  //
}: Props) {
  const upMd = useResponsive('up', 'md');
  const [val, setVal] = useState(filters.distance);


  const handleChange = (_) => {
    // console.log(_.target.value,'VALUEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
    const val = _.target.value
    setVal(val);

    onFilters(
      'distance',
      val
    );
    // setTimeout(()=>{

    // })
  };
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterDelivery = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      let val: any = event.target.value
      // console.log(val,': VALUE NG DELIVERY');

      onFilters(
        'delivery',
        val
      );
    },
    [onFilters]
  );

  function valuetext(value: any) {
    return value;
}

  const handleFilterDistance = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      let val = event.target.value

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
      id: 1,
      label: "1",
      value: 0
    },
  
    {
      id: 4,
      label: "All",
      value: 100
    },
  ]

  const renderFields = (
    <>
    <Stack sx={{
        width: { xs: 1, md: 200 },
    }}>
      <Typography variant="body2" color="grey">Distance (KM)</Typography>
      <Slider
            aria-label="Always visible"
            defaultValue={1}
            getAriaValueText={valuetext}
            step={1}
            marks={distanceOption}
            value={val}
            // track={true}
            onChange={handleChange}
            max={100}
            valueLabelDisplay={val >= 2 ? "on" : "off"}
          /> 
    </Stack>
      {/* <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      > */}
        {/* <InputLabel>Distance</InputLabel> */}
        
        {/* <Select
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
        </Select>  */}
      {/* </FormControl> */}
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

