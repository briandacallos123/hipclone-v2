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
/* import { INoteTableFilters, INoteTableFilterValue } from 'src/types/document'; */
// components
import Iconify from 'src/components/iconify';
import { TableToolbarPopover } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: any;
  onFilters: (name: string, value: any) => void;
  action?: React.ReactNode;
  //
  hospitalOptions: string[];
};

export default function NoteTableToolbar({
  filters,
  onFilters,
  action,
  //
  hospitalOptions,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const popover = usePopover();

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

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );
  const handleFilterType = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'recType',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const renderFields = (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      >
        <InputLabel>Hospital {}</InputLabel>
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

      <DatePicker
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
      />
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 140 },
        }}
      >
        <InputLabel>Type</InputLabel>
        <Select
          value={filters.recType}
          onChange={handleFilterType}
          input={<OutlinedInput label="Type" />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="-1">All</MenuItem>
          <MenuItem value="1">S.O.A.P</MenuItem>
          <MenuItem value="4">Medical notes</MenuItem>
          <MenuItem value="5">Lab request</MenuItem>
          <MenuItem value="8">Clearance</MenuItem>
          <MenuItem value="9">Certificate</MenuItem>
          <MenuItem value="10">Abstract</MenuItem>
          <MenuItem value="11">Vaccine Certificate</MenuItem>
        </Select>
      </FormControl>
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
        sx={{ p: 2.5 }}
      >
        {upMd && renderFields}

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search number..."
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

            {action}
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