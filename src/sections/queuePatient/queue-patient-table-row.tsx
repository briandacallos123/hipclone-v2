// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// types
import { IAppointmentApprovedItem } from 'src/types/appointment';
import { MenuItem, Stack, Tooltip } from '@mui/material';
import Iconify from '@/components/iconify';
import CustomPopover , { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  // onViewRow: VoidFunction;
};

export default function PatientTableRow({ row, onViewRow }: Props) {
  // const { hospital, hospitalAvatarUrl, address, count } = row;
  console.log(row,'ROW_______');
  const popover = usePopover();

  return (
    <TableRow hover>
      <TableCell>
         <Avatar
               alt={`${row?.clinicInfo?.clinic_name}`}
              sx={{mr:2}}
            >
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>

           
      </TableCell>
      <TableCell>
        {row?.voucherId}
      </TableCell>
      <TableCell>
        <ListItemText
              primary={row?.clinicInfo?.clinic_name}
              secondary={row?.clinicInfo?.location}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
      </TableCell>

      <TableCell>

      <Stack direction="row" alignItems="flex-start" justifyContent="flex-end">
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>
      </TableCell>
       
        <Stack direction="row" justifyContent="flex-end">
          <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="mingcute:add-line" />
              Add Schedule
            </MenuItem>
          </CustomPopover>
        </Stack>
     
    </TableRow>
  );
}
