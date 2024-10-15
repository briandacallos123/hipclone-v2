import { format } from 'date-fns';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
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
import { TableMobileRow } from '@/components/table';
import { roRO } from '@mui/x-data-grid';
import { useAuthContext } from '@/auth/hooks';
import { Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onViewPatient: VoidFunction;
};

export default function DashboardAppointmentTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onViewPatient,
}: Props) {
  const { user } = useAuthContext();
  const upMd = useResponsive('up', 'md');

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

  const fullName = `${row?.patientInfo?.FNAME} ${row?.patientInfo?.LNAME}`;

  if (!upMd) {
    return (
      <TableMobileRow
        // selected={selected}
        // onSelectRow={onSelectRow}
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
           {row?.patientInfo?.userInfo[0].display_picture[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={row?.patientInfo?.userInfo[0].display_picture[0].filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME}  sx={{ mr: 2 }}>
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <ListItemText
            primary={fullName}
            onClick={() => onViewPatient()}
            secondary={
              <>
                <Typography variant="caption">
                  {format(new Date(row?.date), 'dd MMM yyyy')}&nbsp;({convertTime(row?.time_slot)})
                </Typography>
                <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
                  <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
                    {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
                  </Label>
                  <Label
                    color={(row?.payment_status && 'success') || 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {row?.payment_status ? 'paid' : 'unpaid'}
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
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = async() => {
    await navigator.clipboard.writeText(row?.voucherId)
    enqueueSnackbar('Copied to clipboard');
  }


  return (
    <TableRow hover selected={selected}>
      {user?.role !== 'patient' && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      {user?.role !== 'patient' && (
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.patientInfo?.userInfo[0].display_picture[0] ? (
              <Avatar
                alt={row?.patientInfo?.FNAME}
                src={row?.patientInfo?.userInfo[0].display_picture[0].filename.split('public')[1]}
                sx={{ mr: 2 }}
              >
                {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={row?.patientInfo?.FNAME}  sx={{ mr: 2 }}>
                {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
              </Avatar>
            )}

           <Stack>
            <ListItemText
                primary={fullName}
                
                primaryTypographyProps={{ typography: 'subtitle2' }}
                sx={{ cursor: 'pointer' }}
                onClick={() => onViewPatient()}
              />
             {/* <Box sx={{
                display:'flex',
                alignItems:'center'
              }}>
              <Typography  sx={{mr:1}} variant="body2">
                  {row?.voucherId}
                </Typography>
                <img onClick={handleCopy} style={{
                    cursor:'pointer'
                  }} src="/assets/clipboard.svg"/>
             </Box> */}
           </Stack>
          </div>
        </TableCell>
      )}

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
         {row?.clinicInfo?.clinicDPInfo?.[0] ? (
            <Avatar
               alt={`${row?.clinicInfo?.clinic_name}`}
              src={row?.clinicInfo?.clinicDPInfo?.[0].filename.split('public')[1]}
              sx={{mr:2}}
            >
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={`${row?.clinicInfo?.clinic_name}`}  sx={{mr:2}}>
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          )}

          <ListItemText
            primary={row?.clinicInfo?.clinic_name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </div>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row?.date), 'dd MMM yyyy')}
          secondary={convertTime(row?.time_slot)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        {/* <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
          {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
        </Label> */}

        <ListItemText
          primary={
            <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
              {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
            </Label>
          }
          secondary={(() => {
            if (row?.status === 0) return 'pending';
            if (row?.status === 1) return 'approved';
            if (row?.status === 2) return 'cancelled';
            if (row?.status === 3) return 'done';

            return 'pending';
          })()}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            ml: 3,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

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
