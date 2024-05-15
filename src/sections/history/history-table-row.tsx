import { format } from 'date-fns';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
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

export default function AppointmentHistoryTableRow({ row, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');
  const fullName = `${row?.patientInfo?.FNAME} ${row?.patientInfo?.LNAME}`;
  // const formatTime = (timestamp) => {
  //   const date = new Date(timestamp); // Remove the extra double quotes
  //   const hours = date.getUTCHours();
  //   const minutes = date.getUTCMinutes();
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  //   const formattedMinutes = minutes.toString().padStart(2, '0');
  //   return `${formattedHours}:${formattedMinutes} ${ampm}`;
  // };
  const formatTime = (timeStr: any) => {
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
  const formatDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  // const { date, doctor, hospital, schedule, isPaid, type } = row;
  const isPaid = row?.status === 1;

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
            {row?.clinicInfo === null ? (
                <Avatar alt={fullName} sx={{ mr: 2 }}>
                    {fullName.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={row?.clinicInfo?.clinic_name}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1] || ''}
                  sx={{ mr: 2 }}
                >
                    {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              )}
          {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={row?.clinicInfo?.clinic_name}
            secondary={
              <>
                <Typography variant="caption">{row?.add_date} </Typography>
                <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
                  <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
                    {(row?.type === 1 && 'Telemedicine') || 'Face-To-Face'}
                  </Label>
                  <Label
                    color={(isPaid && 'success') || 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {isPaid ? 'paid' : 'unpaid'}
                  </Label>
                </Stack>
              </>
            }
            primaryTypographyProps={{
              typography: 'subtitle2',
            }}
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
           {row?.clinicInfo === null ? (
                <Avatar alt={fullName} sx={{ mr: 2 }}>
                    {fullName.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={fullName}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1] || ''}
                  sx={{ mr: 2 }}
                >
                    {fullName.charAt(0).toUpperCase()}
                </Avatar>
              )}

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

      <TableCell>
        <ListItemText
          primary={formatDate(row?.date)}
          secondary={formatTime(row?.time_slot)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
          {(row?.type === 1 && 'Telemedicine') || 'Face-To-Face'}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label
          variant="soft"
          color={(() => {
            if (row?.status === 0) return 'warning';
            if (row?.status === 1) return 'info';
            if (row?.status === 2) return 'error';
            if (row?.status === 3) return 'success';

            return 'default';
          })()}
        >
          {(() => {
            if (row?.status === 0) return 'Pending';
            if (row?.status === 1) return 'approved';
            if (row?.status === 2) return 'cancelled';
            if (row?.status === 3) return 'done';

            return 0;
          })()}
        </Label>
      </TableCell>

      {/* <TableCell align="center">
        <Label
          variant="soft"
          color={(() => {
            if (row?.payment_status === 0) return 'warning';
            if (row?.payment_status === 1) return 'info';
            if (row?.payment_status === 2) return 'error';
            if (row?.payment_status === 3) return 'success';

            return 'default';
          })()}
        >
          {(() => {
            if (row?.payment_status === 0) return 'Pending';
            if (row?.payment_status === 1) return 'approved';
            if (row?.payment_status === 2) return 'cancelled';
            if (row?.payment_status === 3) return 'done';

            return 0;
          })()}
        </Label>
      </TableCell> */}

      <TableCell align="right" sx={{ px: 1 }}>
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
