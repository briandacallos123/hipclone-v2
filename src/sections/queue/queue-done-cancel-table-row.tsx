// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _patients } from 'src/_mock';
// utils
import { fTime } from 'src/utils/format-time';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  onViewRow: VoidFunction;
};

export default function QueueDoneCancelTableRow({ row, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');

  // const { patient, schedule, isPaid, type } = row;

  const fullName = `${row?.patientInfo?.FNAME} ${row?.patientInfo?.LNAME}`;

  const convertTime = (timeStr: any) => {
    if (!timeStr) return 'N / A';
    let hour: any = Number(timeStr.split(':')[0]);
    const min = timeStr.split(':')[1];
    let AMPM = 'AM';
    if (hour > 12) {
      hour -= 12;
      AMPM = 'PM';
    }
    if (hour < 10) {
      hour = `0${hour}`;
    }
    return `${hour}:${min} ${AMPM}`;
  };

  if (!upMd) {
    return (
      <TableMobileRow
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={fullName}
            secondary={
              <>
                <Typography variant="caption">{convertTime(row?.time_slot)}</Typography>
                <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
                  <Label
                    color={(row?.type === 1 && 'success') || 'info'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {row?.type === 1 ? 'telemedicine' : 'Face-To-Face'}
                  </Label>
                  <Label
                    color={(row?.payment_status && 'success') || 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {row?.payment_status === 1 ? 'paid' : 'unpaid'}
                  </Label>
                </Stack>
              </>
            }
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
          />
        </div>
      </TableMobileRow>
    );
  }

  return (
    <TableRow hover>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle2">{fullName}</Typography>
        </div>
      </TableCell>

      <TableCell>{convertTime(row?.time_slot)}</TableCell>

      <TableCell>
        <Label
          color={(row?.type === 1 && 'success') || 'info'}
          sx={{ textTransform: 'capitalize' }}
        >
          {row?.type === 1 ? 'telemedicine' : 'Face-To-Face'}
        </Label>
      </TableCell>

      <TableCell>
          <Label
            color={(row?.payment_status || row?.pendingPayment && 'success') || 'error'}
            sx={{ textTransform: 'capitalize' }}
          >

            {row?.pendingPayment && 'For approval' ||
            row?.payment_status === 1 && 'Paid' ||
            'Unpaid'
            }
          </Label>
        </TableCell>

      <TableCell align="left" sx={{ px: 1 }}>
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
