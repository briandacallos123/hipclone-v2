import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import Iconify from '@/components/iconify';
import { useBoolean } from '@/hooks/use-boolean';
import { fDateTime } from '@/utils/format-time';
import { Button, MenuItem, Stack, TableCell, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import React from 'react'

const VitalFullScreenRow = ({row, handleDelete}:any) => {

    const popover = usePopover();
    const confirm = useBoolean();

    const renderConfirm = (
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete();
                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      );
    

  return (
    <TableRow hover>
    <TableCell>{fDateTime(row.date)}</TableCell>

    <TableCell sx={{ typography: 'subtitle2' }}>{row.value}</TableCell>

    <TableCell>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </TableCell>
    <Stack direction="row" justifyContent="flex-end">
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">

        {/* {isToday(row?.R_DATE) && <MenuItem
          onClick={() => {
            onEditRow()
          }}
          sx={{ color: 'success.main' }}
        >
          <Iconify icon="mdi:pencil" />
          Edit
        </MenuItem>} */}

        {/* <MenuItem
          onClick={() => {
            onViewRow()
          }}
          sx={{ color: 'success.main' }}
        >
          <Iconify icon="mdi:eye" />
          View
        </MenuItem> */}

        {/* {isToday(row?.R_DATE) && } */}
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="ic:baseline-delete" />
          Delete
        </MenuItem>


      </CustomPopover>
    </Stack>
    {renderConfirm}
  </TableRow>
  )
}

export default VitalFullScreenRow