// @mui
import { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
// components
import Iconify from '../iconify/iconify';
import CustomPopover, { usePopover } from '../custom-popover';

// ----------------------------------------------------------------------

interface Props extends IconButtonProps {
  children?: React.ReactNode;
  iconSx?: SxProps<Theme>;
  popoverSx?: SxProps<Theme>;
}

export default function TableToolbarPopover({ children, iconSx, popoverSx }: Props) {
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen} sx={{ ...iconSx }}>
        <Iconify icon="eva:options-2-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ ...popoverSx }}
      >
        <Stack spacing={1} sx={{ p: 1 }}>
          {children}
        </Stack>
      </CustomPopover>
    </>
  );
}
