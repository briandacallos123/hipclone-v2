// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IAppointmentTableFilters, IAppointmentTableFilterValue } from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IAppointmentTableFilters;
  onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
  hospitalOptions: string[];
};

export default function AppointmentHistoryTableFiltersResult({
  filters,
  onFilters,
  //
  hospitalOptions,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveHospital = (inputValue: string) => {
    const newValue = filters.hospital?.filter((item) => item !== inputValue);
    onFilters('hospital', newValue);
  };

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
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
        {!!filters.hospital.length && (
          <Block label="Hospital:">
          {filters.hospital.map((item : any) => {
            const info : any = hospitalOptions.find((v:any)=> v?.id === item)
            return (
              <Chip
                key={info?.id}
                label={info?.clinic_name}
                size="small"
                onDelete={() => handleRemoveHospital(info?.id)}
              />
            )
             
          })}
        </Block>
        )}

        {filters.status !== -1 && (
          <Block label="Status:">
            <Chip
              size="small"
              label={(()=>{
                if(filters?.status === -1) return 'All';
                if(filters?.status === 0) return 'Pending';
                if(filters?.status === 1) return 'Approved';
                if(filters?.status === 2) return 'Cancelled';
                if(filters?.status === 3) return 'Done';

                return 'All';

              })()}
              onDelete={handleRemoveStatus}
              sx={{ textTransform: 'capitalize' }}
            />
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
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
