// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
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
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { TableMobileRow } from 'src/components/table';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  sendSmsRow: VoidFunction;
  onViewRow: VoidFunction;
  onDoneRow: VoidFunction;
  onCancelRow: VoidFunction;
  onViewPatient: VoidFunction;
};

export default function QueueApproveTableRow({
  row,
  sendSmsRow,
  onViewRow,
  onDoneRow,
  onCancelRow,
  onViewPatient,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const popover = usePopover();

  const confirmDone = useBoolean();

  const confirmCancel = useBoolean();
  const { user } = useAuthContext();
  const isDoctor = user?.role === 'doctor';
  // console.log(user);
  const donePermission = user?.permissions?.appt_done;
  const cancelPermission = user?.permissions?.appt_cancel;
  // const { patient, schedule, isPaid, type } = row;

  // const keyPatient = _patients.filter((_) => _.id === patient.id)[0];

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
            label: 'SMS',
            icon: 'solar:chat-line-bold',
            func: sendSmsRow,
          },
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
          {
            label: 'Done',
            icon: 'solar:check-circle-bold',
            func: onDoneRow,
            color: 'success',
          },
          {
            label: 'Cancel',
            icon: 'solar:close-circle-bold',
            func: onCancelRow,
            color: 'error',
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
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar> */}
          <ListItemText
            primary={fullName}
            onClick={onViewPatient}
            secondary={
              <>
                <Typography variant="caption">{convertTime(row?.time_slot)}</Typography>{' '}
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
    <>
      <TableRow hover>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.patientInfo?.userInfo?.[0]?.display_picture?.[0] ? (
              <Avatar
                alt={row?.patientInfo?.FNAME}
                src={
                  row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]
                }
                sx={{ mr: 2 }}
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            )}

            <Typography
              onClick={onViewPatient}
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                ':hover': {
                  color: 'primary.main',
                },
              }}
              variant="subtitle2"
            >
              {fullName}
            </Typography>
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
            color={(row?.payment_status && 'success') || 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            {row?.payment_status === 1 ? 'paid' : 'unpaid'}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            sendSmsRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:chat-line-bold" />
          SMS
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        {donePermission && (
          <MenuItem
            onClick={() => {
              confirmDone.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:check-circle-bold" />
            Done
          </MenuItem>
        )}
        {isDoctor && (
          <MenuItem
            onClick={() => {
              confirmDone.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:check-circle-bold" />
            Done
          </MenuItem>
        )}

        {cancelPermission && (
          <MenuItem
            onClick={() => {
              confirmCancel.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:close-circle-bold" />
            Cancel
          </MenuItem>
        )}
        {isDoctor && (
          <MenuItem
            onClick={() => {
              confirmCancel.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:close-circle-bold" />
            Cancel
          </MenuItem>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirmDone.value}
        onClose={confirmDone.onFalse}
        title="Done"
        content="Are you sure want to mark as done?"
        action={
          <Button variant="contained" color="success" onClick={onDoneRow}>
            Submit
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Cancel"
        content="Are you sure want to cancel?"
        action={
          <Button variant="contained" color="error" onClick={onCancelRow}>
            Submit
          </Button>
        }
      />
    </>
  );
}
