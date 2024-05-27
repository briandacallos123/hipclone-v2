// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// types
import { IAppointmentApprovedItem } from 'src/types/appointment';
import { Button, MenuItem, Stack } from '@mui/material';
import Iconify from '@/components/iconify';
import { usePopover } from '@/components/custom-popover';
import CustomPopover from '@/components/custom-popover/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from '@/components/custom-dialog';
// ----------------------------------------------------------------------

type Props = {
    row: any;
    onViewRow: VoidFunction;
    onDeleteRow?:()=>void;
};

export default function MedecineTableRow({ row, onViewRow, onDeleteRow}: Props) {
    // const { hospital, hospitalAvatarUrl, address, count } = row;
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
                onDeleteRow();
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
            <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={`${row?.clinicInfo?.clinic_name}`} sx={{ mr: 2 }}>
                        {String(row?.generic_name).charAt(0).toUpperCase()}
                    </Avatar>
                    {/* {row?.clinicInfo?.clinicDPInfo?.[0] ? (
            <Avatar
               alt={`${row?.clinicInfo?.clinic_name}`}
              src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
              sx={{mr:2}}
            >
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={`${row?.clinicInfo?.clinic_name}`}  sx={{mr:2}}>
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          )} */}
                    {/* <Avatar alt={row?.clinicInfo?.clinic_name} sx={{ mr: 2 }}>
            {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
          </Avatar> */}

                    <ListItemText
                        primary={row?.generic_name}
                        // secondary={row?.clinicInfo?.location}
                        primaryTypographyProps={{ typography: 'subtitle2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </div>
            </TableCell>

          

            <TableCell>
                <ListItemText
                    primary={row?.dose}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                    }}
                />
            </TableCell>

            <TableCell align="center">
                <ListItemText
                    primary={row?.quantity}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                    }}
                />
            </TableCell>

            <TableCell align="center">
                <ListItemText
                    primary={row?.form}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                    }}
                />
            </TableCell>

            <TableCell align="right">
                <Stack direction="row" justifyContent="center" >
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
                </Stack>
            </TableCell>


            <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
            {renderConfirm}
            {/* <TableCell align="right">
        <IconButton
          onClick={() => onViewRow()}
          sx={{
            height: 32,
            width: 32,
            bgcolor: 'primary.lighter',
            typography: 'subtitle2',
            color: 'primary.main',
          }}
        >
          {row?.approved_count}
        </IconButton>
      </TableCell> */}
        </TableRow>
    );
}
