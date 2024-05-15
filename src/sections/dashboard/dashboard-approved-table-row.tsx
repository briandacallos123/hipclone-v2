// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// types
import { IAppointmentApprovedItem } from 'src/types/appointment';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  onViewRow: VoidFunction;
};

export default function DashboardApprovedTableRow({ row, onViewRow }: Props) {
  // const { hospital, hospitalAvatarUrl, address, count } = row;

  return (
    <TableRow hover>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.clinicInfo?.clinicDPInfo?.[0] ? (
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
          )}
          {/* <Avatar alt={row?.clinicInfo?.clinic_name} sx={{ mr: 2 }}>
            {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={row?.clinicInfo?.clinic_name}
            secondary={row?.clinicInfo?.location}
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </div>
      </TableCell>

      <TableCell align="right">
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
      </TableCell>
    </TableRow>
  );
}
