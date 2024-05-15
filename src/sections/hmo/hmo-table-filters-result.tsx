// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { IHmoTableFilters, IHmoTableFilterValue } from 'src/types/hmo';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IHmoTableFilters | any;
  onFilters: (name: string, value: IHmoTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  hmoOptions: string[];
  results: number;
};

export default function HmoTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  hmoOptions,
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveHmo = (inputValue: string) => {
    const newValue = filters.hmo.filter((item : any) => item !== inputValue);
    onFilters('hmo', newValue);
  };

  const handleRemoveStatus = () => {
    onFilters('status', '-1');
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
        {!!filters.hmo.length && (
          <Block label="HMO:">
            {/* {filters.hmo.map((item : any) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveHmo(item)} />
            ))} */}

            {filters.hmo.map((item : any) => {
              const info : any = hmoOptions.find((v:any)=> v?.id === item)
              return (
                <Chip
                  key={info?.id}
                  label={info?.name}
                  size="small"
                  onDelete={() => handleRemoveHmo(info?.id)}
                />
              )
               
            })}
          </Block>
        )}

        {filters.status !== '-1' && (
          <Block label="Status:">
            <Chip
              size="small"
              label={(()=>{
                if(filters?.status === '-1') return 'All';
                if(filters?.status === 1) return 'Pending';
                if(filters?.status === 0) return 'Approved';
                if(filters?.status === 4) return 'Cancelled';
                if(filters?.status === 3) return 'Done';
                if(filters?.status === 'cheque') return 'cheque';
                if(filters?.status === 'Deposit') return 'Deposit';

                return '-1';

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
