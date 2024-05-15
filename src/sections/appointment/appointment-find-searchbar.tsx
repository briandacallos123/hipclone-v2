import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// types
import {
  IAppointmentFindTableFilters,
  IAppointmentFindTableFilterValue,
} from 'src/types/appointment';
// components
import { TableToolbarPopover } from 'src/components/table';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: IAppointmentFindTableFilters;
  onFilters: (name: string, value: IAppointmentFindTableFilterValue) => void;
  //
  hmoOptions: string[];
};

export default function AppointmentFindSearchbar({
  filters,
  onFilters,
  //
  hmoOptions,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterHospital = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('hospital', event.target.value);
    },
    [onFilters]
  );

  const handleFilterSpecialty = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('specialty', event.target.value);
    },
    [onFilters]
  );

  const handleFilterHmo = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'hmo',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const renderFields = (
    <>
      <TextField
        fullWidth
        value={filters.hospital}
        onChange={handleFilterHospital}
        placeholder="Hospital name..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        value={filters.specialty}
        onChange={handleFilterSpecialty}
        placeholder="Specialization..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <FormControl>
        <InputLabel>Select HMO</InputLabel>

        <Select
          fullWidth
          multiple
          value={filters.hmo}
          // value={filters.hmo}
          onChange={handleFilterHmo}
          input={<OutlinedInput label="Select HMO" />}
          renderValue={(selected) =>
            hmoOptions
              .filter((v: any) => selected.find((s: any) => Number(s) === Number(v?.id)))
              .map((m: any) => m?.name)
              .join(', ')
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {hmoOptions?.map((option: any) => (
            <MenuItem key={option?.id} value={option?.id}>
              <Checkbox
                disableRipple
                size="small"
                checked={
                  filters?.hmo?.length &&
                  !!filters?.hmo?.filter((v: any) => v === option?.id).length
                }
              />
              {option?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <Box
      gap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
    >
      {!upMd && (
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
            placeholder="Doctor name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <TableToolbarPopover>{renderFields}</TableToolbarPopover>
        </Stack>
      )}

      {upMd && (
        <>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Doctor name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          {renderFields}
        </>
      )}

      {/* <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder="Doctor name..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      /> */}
      {/* <TextField
        fullWidth
        value={filters.hospital}
        onChange={handleFilterHospital}
        placeholder="Hospital name..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        value={filters.specialty}
        onChange={handleFilterSpecialty}
        placeholder="Specialization..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <FormControl>
        <InputLabel>Select HMO</InputLabel>

        <Select
          fullWidth
          multiple
          value={filters.hmo}
          // value={filters.hmo}
          onChange={handleFilterHmo}
          input={<OutlinedInput label="Select HMO" />}
          renderValue={(selected) =>
            hmoOptions
              .filter((v: any) => selected.find((s: any) => Number(s) === Number(v?.id)))
              .map((m: any) => m?.name)
              .join(', ')
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {hmoOptions?.map((option: any) => (
            <MenuItem key={option?.id} value={option?.id}>
              <Checkbox
                disableRipple
                size="small"
                checked={
                  filters?.hmo?.length &&
                  !!filters?.hmo?.filter((v: any) => v === option?.id).length
                }
              />
              {option?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
    </Box>
  );
}
