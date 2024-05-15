// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IPatientTableFilters, IPatientTableFilterValue } from 'src/types/patient';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IPatientTableFilters;
  onFilters: (name: string, value: IPatientTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function PatientTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveHospital = (inputValue: string) => {
    const newValue = filters.hospital.filter((item) => item !== inputValue);
    onFilters('hospital', newValue);
  };

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {/* {!!filters.hospital.length && (
          <Block label="Hospital:">
            {filters.hospital.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveHospital(item)}
              />
            ))}
          </Block>
        )} */}

        {filters.status !== -1 && (
          <Block label="Status:">
            <Chip
              size="small"
              // eslint-disable-next-line no-nested-ternary
              label={filters.status === -1 ? 'All' : filters.status === 1 ? 'Male' : filters.status === 2 ? 'Female' : 'Unspecified'}
              onDelete={handleRemoveStatus}
              sx={{ textTransform: 'capitalize' }}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
