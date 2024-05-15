import React, { useRef, useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// types
import {
  IAppointmentFindTableFilters,
  IAppointmentFindTableFilterValue,
} from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from '../../components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IAppointmentFindTableFilters;
  onFilters: (name: string, value: IAppointmentFindTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  hmoOptions: string[];
  results: number;
};

export default function AppointmentFindSearchbarResult({
  filters,
  onFilters,
  //
  hmoOptions,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const upMd = useResponsive('up', 'md');
  const chipRef = useRef(null);
  const [chipWidth, setChipWidth] = useState(0);
  const popover = usePopover();
  useEffect(() => {
    if (chipRef.current) {
      // Use getBoundingClientRect to get the actual width of the chip element
      const width = chipRef.current.getBoundingClientRect().width;
      setChipWidth(width);
    }
  }, []);
  console.log(chipWidth, '?????');

  const handleRemoveHmo = (inputValue: string) => {
    const newValue = filters.hmo.filter((item: any) => item !== inputValue);
    onFilters('hmo', newValue);
  };

  const handleRemoveName = (inputValue: string) => {
    // const newValue = filters.hmo.filter((item: any) => item !== inputValue);
    onFilters('name', '');
  };

  const handleRemoveClinic = (inputValue: string) => {
    // const newValue = filters.hmo.filter((item: any) => item !== inputValue);
    onFilters('clinic', '');
  };
  const handleRemoveSpec = (inputValue: string) => {
    // const newValue = filters.hmo.filter((item: any) => item !== inputValue);
    onFilters('spec', '');
  };

  console.log(filters, 'filters@@@@@@@@@');
  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      {filters?.name && (
        <Stack>
          <Block label="Name:">
            <Chip label={filters?.name} size="small" onDelete={handleRemoveName} />
          </Block>
        </Stack>
      )}

      {filters?.hospital && (
        <Stack>
          <Block label="Clinic:">
            <Chip label={filters?.hospital} size="small" onDelete={handleRemoveClinic} />
          </Block>
        </Stack>
      )}

      {filters?.specialty && (
        <Stack>
          <Block label="Specialization:">
            <Chip label={filters?.specialty} size="small" onDelete={handleRemoveSpec} />
          </Block>
        </Stack>
      )}

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters?.hmo?.length && !upMd ? (
          <Block label="HMO:">
            {filters.hmo.slice(0, 1).map((item: any) => {
              const info: any = hmoOptions.find((v: any) => {
                if (Number(v?.id) === Number(item)) {
                  return v;
                }
              });
              return (
                <Chip
                  ref={chipRef}
                  key={info?.id}
                  label={info?.name}
                  size="small"
                  sx={{
                    maxWidth: '120px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    '& .MuiChip-deleteIcon': {
                      width: '50px', // Adjust the width of the delete icon
                      height: '50px', // Adjust the height of the delete icon
                    },
                  }}
                  onDelete={() => handleRemoveHmo(info?.id)}
                />
              );
            })}

            {chipWidth > 99 && (
              <>
                {filters.hmo.length > 1 && (
                  <IconButton
                    color={popover.open ? 'inherit' : 'default'}
                    sx={{ fontSize: '15px' }}
                    onClick={popover.onOpen}
                  >
                    {`+${filters.hmo.length - 1}`}
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
                  {filters.hmo.slice(1).map((item: any) => {
                    const info: any = hmoOptions.find((v: any) => {
                      if (Number(v?.id) === Number(item)) {
                        return v;
                      }
                    });
                    return (
                      <Box sx={{ p: 0.5 }}>
                        <Chip
                          sx={{ width: '100%', overflow: 'none' }}
                          key={info?.id}
                          label={info?.name}
                          size="small"
                          onDelete={() => handleRemoveHmo(info?.id)}
                        />
                      </Box>
                    );
                  })}
                </CustomPopover>
              </>
            )}
          </Block>
        ) : (
          <Block label="HMO:">
            {filters.hmo.map((item: any) => {
              const info: any = hmoOptions.find((v: any) => {
                console.log(v, 'VVVVV');
                if (Number(v?.id) === Number(item)) {
                  return v;
                }
              });
              return (
                <Chip
                  key={info?.id}
                  label={info?.name}
                  size="small"
                  onDelete={() => handleRemoveHmo(info?.id)}
                />
              );
            })}
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
  filters?: any;
};

function Block({ label, filters, children, sx, ...other }: BlockProps) {
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
        {filters}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
