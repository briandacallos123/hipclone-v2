// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';
// ----------------------------------------------------------------------

type Props = {
    sort: string;
    onSort: (newValue: string) => void;
    sortOptions: {
        id: number,
        value: string;
        label: string;
    }[];
    onGrid:()=>void;
    onRow:()=>void
};

export default function MedecineFilteringHeader({onGrid, onRow, sort, sortOptions, onSort }: Props) {
    const popover = usePopover();
    const [alignment, setAlignment] = useState<string | null>('grid');

    const handleAlignment = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
    ) => {
      setAlignment(newAlignment);
    };


    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Box>
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                    >
                        <ToggleButton onClick={onGrid} value="grid" aria-label="left aligned">
                            <Iconify icon="fontisto:nav-icon-grid"/>
                        </ToggleButton>
                        <ToggleButton onClick={onRow} value="list" aria-label="centered">
                        <Iconify icon="fontisto:nav-icon-list"/>
                        </ToggleButton>

                    </ToggleButtonGroup>
                </Box>

                <Button
                    disableRipple
                    color="inherit"
                    onClick={popover.onOpen}
                    endIcon={
                        <Iconify
                            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                        />
                    }
                    sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
                >
                    Sort By:
                    <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
                        {sort}
                    </Box>
                </Button>

                <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
                    {sortOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={sort === option.value}
                            onClick={() => {
                                popover.onClose();
                                onSort(option.value);
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </CustomPopover>
            </Box>
        </>
    );
}
