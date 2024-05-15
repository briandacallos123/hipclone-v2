import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentTableFilters, IAppointmentTableFilterValue } from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import { TableToolbarPopover } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  filters: any;
  onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
  //
  dense?: boolean;
  isPatient?: any;

  hospitalOptions: string[];
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DashboardAppointmentTableToolbar({
  filters,
  onFilters,
  //
  dense,
  hospitalOptions,
  isPatient,
  onChangeDense,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterHospital = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'hospital',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );
  const handleFilterType = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'type',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const isValidStartDate = (date: any) => date instanceof Date && !isNaN(date.getTime());

  const isValidEndDate = (date: any) => date instanceof Date && !isNaN(date.getTime());

  const handleFilterStartDate = useCallback(
    (newValue: any) => {
      try {
        if (!isValidStartDate(newValue)) {
          console.error('Invalid start date');
          return;
        }

        onFilters('startDate', newValue);
      } catch (error) {
        console.error('An error occurred while filtering by start date:', error);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: any) => {
      try {
        if (!isValidEndDate(newValue)) {
          console.error('Invalid end date');
          return;
        }

        onFilters('endDate', newValue);
      } catch (error) {
        console.error('An error occurred while filtering by end date:', error);
      }
    },
    [onFilters]
  );

  // console.log('isPatient', isPatient);

  const renderFields = (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      >
        <InputLabel>Hospital</InputLabel>
        <Select
          multiple
          value={filters.hospital}
          onChange={handleFilterHospital}
          input={<OutlinedInput label="Hospital" />}
          renderValue={(selected) =>
            hospitalOptions
              .filter((v: any) => selected.find((s: any) => s === v?.id))
              .map((m: any) => m?.clinic_name)
              .join(', ')
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {hospitalOptions?.map((option: any) => (
            <MenuItem key={option?.id} value={option?.id}>
              <Checkbox
                disableRipple
                size="small"
                checked={!!filters.hospital.filter((v: any) => v === option?.id).length}
              />
              {option?.clinic_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!isPatient && (
        <>
          <DatePicker
            label="Start date"
            value={filters.startDate}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 160 },
            }}
          />

          <DatePicker
            label="End date"
            value={filters.endDate}
            onChange={handleFilterEndDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 160 },
            }}
          />
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 140 },
            }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              onChange={handleFilterType}
              input={<OutlinedInput label="Type" />}
              sx={{ textTransform: 'capitalize' }}
            >
              <MenuItem value={-1}>All</MenuItem>
              <MenuItem value={1}>Telemedicine</MenuItem>
              <MenuItem value={2}>Face-to-Face</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {!upMd && onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}
    </>
  );

  return (
    <>
      <Stack
        alignItems={{ xs: 'flex-end', md: 'center'}}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          px: 2.5,
          py:2
          // pr: { xs: 2.5, md: 1 }
        }}
      >
        {upMd && renderFields}

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, mx: 1 }}
        >
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {!upMd && <TableToolbarPopover>{renderFields}</TableToolbarPopover>}
        </Stack>
      </Stack>
      {/* <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          // pr: { xs: 2.5, md: 1 },
        }}
      > */}
        {/* <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 200 },
          }}
        /> */}

        {/* <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 200 },
          }}
        />
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 190 },
          }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            onChange={handleFilterType}
            input={<OutlinedInput label="Type" />}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value={-1}>All</MenuItem>
            <MenuItem value={1}>Telemedicine</MenuItem>
            <MenuItem value={2}>Face-to-Face</MenuItem>
          </Select>
        </FormControl> */}
      {/* </Stack> */}
    </>
  );
}
