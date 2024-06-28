/* eslint-disable no-nested-ternary */
import { format } from 'date-fns';
import { NexusGenInputs } from 'generated/nexus-typegen';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import { useAuthContext } from '@/auth/hooks';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

type Props = {
  // row: NexusGenInputs['DoctorTypeInputInterface'];
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onViewPatient: VoidFunction;
  onViewQueue: () => void;
};

export default function AppointmentTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onViewPatient,
  onViewQueue
}: Props) {
  /*  const { patient, hospital, schedule, isPaid, type } = row; */
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isPatient = user?.role === 'patient';
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
          {row?.patientInfo?.userInfo?.[0]?.display_picture?.[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={
                row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]
              }
              sx={{ mr: 2 }}
            >
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={!isPatient ? fullName : row?.clinicInfo?.clinic_name}
            secondary={
              <>
                <Typography variant="caption">
                  {format(new Date(row?.date), `dd MMM yyyy`)}&nbsp;({convertTime(row?.time_slot)})
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(row?.voucherId)
    enqueueSnackbar('Copied to clipboard');
  }

  return (
    <TableRow hover selected={selected}>
      {/* {user?.role !== 'patient' && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )} */}

      {!isPatient && (
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.patientInfo?.userInfo?.[0].display_picture?.[0] ? (
              <Avatar
                alt={row?.patientInfo?.FNAME}
                src={
                  row?.patientInfo?.userInfo?.[0].display_picture?.[0].filename.split('public')[1]
                }
                sx={{ mr: 2 }}
              >
                {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
                {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
              </Avatar>
            )}
            {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar> */}

            <Stack>
              <ListItemText
                primary={fullName}
                primaryTypographyProps={{ typography: 'subtitle2' }}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  ':hover': {
                    color: 'primary.main',
                  },
                }}
                onClick={() => onViewPatient(row?.patientInfo?.userInfo?.uuid)}
              />
              {user?.role === 'patient' && <Box sx={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography sx={{ mr: 1 }} variant="body2">{row?.voucherId}</Typography>
                <Tooltip>
                  <img onClick={handleCopy} style={{
                    cursor: 'pointer'
                  }} src="/assets/clipboard.svg" />
                </Tooltip>
              </Box>}
            </Stack>
          </div>
        </TableCell>
      )}

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.clinicInfo?.clinicDPInfo?.[0] ? (
            <Avatar
              alt={`${row?.clinicInfo?.clinic_name}`}
              src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={`${row?.clinicInfo?.clinic_name}`} sx={{ mr: 2 }}>
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/* <Avatar
            alt={`${row?.clinicInfo?.clinic_name}`}
            src={`${row?.clinicInfo?.clinicDPInfo?.filename}`}
            sx={{ mr: 2 }}
          >
            {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
          </Avatar> */}


          <Stack>
            <ListItemText
              primary={row?.clinicInfo?.clinic_name}
              // secondary={row?.voucherId}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
            {user?.role === 'patient' && <Box sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Typography sx={{ mr: 1 }} variant="body2">{row?.voucherId}</Typography>

              <Tooltip sx={{
                cursor: 'pointer',
                color: 'success',
              }} title="Preview Appointment"
                onClick={onViewQueue}
              >
                <Iconify icon="iconamoon:eye-bold" />
              </Tooltip>

            </Box>}
          </Stack>
        </div>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row?.date), 'dd MMM yyyy')}
          secondary={(() => {
            let time: any;

            if (row?.e_time) {
              time = `${convertTime(row?.time_slot)} - ${convertTime(row?.e_time)}`
            } else {
              time = convertTime(row?.time_slot)
            }

            return time;
          })()}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        {row?.patient_hmo?.hmoInfo ? (
          'Hmo'
        ) : (
          <Iconify
            icon={row?.payment_status ? 'solar:check-circle-outline' : 'solar:close-circle-outline'}
            sx={{
              m: 0,
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!row!.payment_status && { color: 'error.main' }),
            }}
          />
        )}
      </TableCell>


      <TableCell align="center">
        <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
          {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            row?.status === 0
              ? 'warning'
              : row?.status === 1
                ? 'info'
                : row?.status === 2
                  ? 'error'
                  : row?.status === 3
                    ? 'success'
                    : 'info'
          }
        >
          {row?.status === 0
            ? 'Pending'
            : row?.status === 1
              ? 'Approved'
              : row?.status === 2
                ? 'Cancelled'
                : row?.status === 3
                  ? 'Done'
                  : 'unknown'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
