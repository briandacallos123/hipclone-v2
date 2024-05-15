import React, { useRef, useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// types
import { IAppointmentTableFilters, IAppointmentTableFilterValue } from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';
import { useResponsive } from 'src/hooks/use-responsive';
import CustomPopover, { usePopover } from '../../components/custom-popover';
// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IAppointmentTableFilters;
  onFilters: (name: string, value: IAppointmentTableFilterValue) => void;
  hospitalOptions: string[];
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function DashboardAppointmentTableFiltersResult({
  filters,
  onFilters,
  hospitalOptions,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveHospital = (inputValue: string) => {
    const newValue = filters.hospital.filter((item) => item !== inputValue);
    onFilters('hospital', newValue);
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };
  const upMd = useResponsive('up', 'md');
  const popover = usePopover();

  const chipRef = useRef(null);
  const [chipWidth, setChipWidth] = useState(0);

  useEffect(() => {
    if (chipRef.current) {
      // Use getBoundingClientRect to get the actual width of the chip element
      const width = chipRef.current.getBoundingClientRect().width;
      setChipWidth(width);
    }
  }, []);
  console.log(chipWidth, '?????');

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.hospital.length && upMd && (
          <Block label="Hospital:">
            {filters.hospital.map((item: any) => {
              const info: any = hospitalOptions.find((v: any) => v?.id === item);
              return (
                <Chip
                  key={info?.id}
                  label={info?.clinic_name}
                  size="small"
                  onDelete={() => handleRemoveHospital(info?.id)}
                />
              );
            })}
          </Block>
        )}
        {!!filters.hospital.length && !upMd && (
          <Stack direction="row" alignItems="center">
            <Block label="Hospital:">
              {filters.hospital.slice(0, 1).map((item: any) => {
                const info: any = hospitalOptions.find((v: any) => v?.id === item);
                return (
                  <Chip
                    ref={chipRef}
                    key={info?.id}
                    label={info?.clinic_name}
                    size="small"
                    sx={{
                      maxWidth: '108px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                    onDelete={() => handleRemoveHospital(info?.id)}
                  />
                );
              })}

              {chipWidth > 99 && (
                <>
                  {filters.hospital.length > 1 && (
                    <IconButton
                      color={popover.open ? 'inherit' : 'default'}
                      sx={{ fontSize: '15px' }}
                      onClick={popover.onOpen}
                    >
                      {`+${filters.hospital.length - 1}`}
                    </IconButton>
                  )}

                  <CustomPopover
                    open={popover.open}
                    onClose={popover.onClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{ width: 160 }}
                  >
                    {filters.hospital.slice(1).map((item: any) => {
                      const info: any = hospitalOptions.find((v: any) => v?.id === item);
                      return (
                        <Box sx={{ p: 0 }}>
                          <Chip
                            sx={{ width: '100%', overflow: 'none' }}
                            key={info?.id}
                            label={info?.clinic_name}
                            size="small"
                            onDelete={() => handleRemoveHospital(info?.id)}
                          />
                        </Box>
                      );
                    })}
                  </CustomPopover>
                </>
              )}
            </Block>
          </Stack>
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
