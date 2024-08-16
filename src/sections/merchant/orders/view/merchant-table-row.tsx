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
import { Box, Button, MenuItem } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useBoolean } from '@/hooks/use-boolean';

// ----------------------------------------------------------------------

type Props = {
  // row: NexusGenInputs['DoctorTypeInputInterface'];
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: () => void;
  onViewPatient: VoidFunction;
  onEditRow: () => void;
  onDone?: () => void;
  onApproved?: () => void;
  onCancelled?: () => void
  onViewRow?: () => void;

};

export default function MerchantOrdersTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onViewPatient,
  onDeleteRow,
  onEditRow,
  onDone,
  onApproved,
  onCancelled
}: Props) {
  /*  const { patient, hospital, schedule, isPaid, type } = row; */
  const upMd = useResponsive('up', 'md');

  const { user } = useAuthContext();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isPatient = user?.role === 'patient';
  const fullName = row?.middle_name ? `${row?.first_name} ${row?.middle_name} ${row?.last_name}` : `${row?.first_name} ${row?.last_name}`;

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

  const popover = usePopover();


  const handleCopy = async () => {
    await navigator.clipboard.writeText(row?.voucherId)
    enqueueSnackbar('Copied to clipboard');
  }

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
  const doneConfirm = useBoolean();

  const renderDoneConfirm = (
    <ConfirmDialog
      open={doneConfirm.value}
      onClose={doneConfirm.onFalse}
      title="Delete"
      content="Are you sure want to mark this as done?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDone();
            doneConfirm.onFalse();
          }}
        >
          Mark as done
        </Button>
      }
    />
  );

  const viewConfirm = useBoolean();



  const approveConfirm = useBoolean();

  const renderApprovedConfirm = (
    <ConfirmDialog
      open={approveConfirm.value}
      onClose={approveConfirm.onFalse}
      title="Delete"
      content="Are you sure want to approve?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            // onDone();
            onApproved()
            approveConfirm.onFalse();
          }}
        >
          Mark as Approved
        </Button>
      }
    />
  );

  const cancelConfirm = useBoolean();

  const renderCancelConfirm = (
    <ConfirmDialog
      open={cancelConfirm.value}
      onClose={cancelConfirm.onFalse}
      title="Delete"
      content="Are you sure want to cancel?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            // onDone();
            onCancelled()
            cancelConfirm.onFalse();
          }}
        >
          Mark as Cancel
        </Button>
      }
    />
  );


  const FULLNAME = row?.patient?.MNAME ? `${row?.patient?.FNAME} ${row?.patient?.MNAME} ${row?.patient?.LNAME}` : `${row?.patient?.FNAME} ${row?.patient?.LNAME}`;


  if (!upMd) {
    return (
      <TableMobileRow
        menu={[

          {
            label: 'View',
            icon: 'mdi:eye',
            func: onViewRow,
            color: 'success'
          },
          {
            label: "Approve",
            icon: 'material-symbols:order-approve-sharp',
            func: approveConfirm.onTrue,
            color: 'success'
          },
          {
            label: 'Cancel',
            icon: 'material-symbols-light:cancel',
            func: cancelConfirm.onTrue,
            color: 'warning'
          },
          {
            label: 'Done',
            icon: 'eva:done-all-fill',
            func: doneConfirm.onTrue,
            color: 'success'
          },
          {
            label: 'Delete',
            icon: 'solar:trash-bin-trash-bold',
            func: (() => {
              confirm.onTrue()
            }),
            color: 'error'
          },
        ]}
      >
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }} alt="store" >
            {row?.generic_name?.charAt(1).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={`#${row?.id}`}
            secondary={
              <>
                <Typography variant="caption">{row?.generic_name}</Typography>
                {/* <Typography color={
                  row?.status_id === 4 && 'success.main' ||
                  row?.status_id === 1 && 'warning.main' ||
                  row?.status_id === 2 && 'primary.main' ||
                  row?.status_id === 3 && 'error.main'

                } variant="caption"> */}
                <Typography>
                {row?.status_id === 4 && "Done" ||
                    row?.status_id === 1 && "Pending" ||
                    row?.status_id === 2 && "Approved" ||
                    row?.status_id === 3 && "Cancelled"

                  }
                </Typography>

              </>
            }
            primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
            secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
          />
          {renderConfirm}
          {renderDoneConfirm}
          {renderApprovedConfirm}
          {renderCancelConfirm}
        </Box>
      </TableMobileRow>
    );
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell >
        {/* <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
          {`#`}
        </Avatar> */}
        <ListItemText
          primary={`#${row?.id}`}
          primaryTypographyProps={{ typography: 'subtitle2' }}
          sx={{
            cursor: 'pointer',

            textTransform: 'capitalize'
          }}

        />
      </TableCell>

      <TableCell >
        <Typography>
          {row?.generic_name}

        </Typography>

      </TableCell>

      <TableCell align="left" sx={{
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Avatar src={`/${row?.patient?.Attachment?.split('/').splice(1).join("/")}`} alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }} />
        <Typography>
          {FULLNAME}

        </Typography>

      </TableCell>
      <TableCell align='center'>
        <Label variant="soft" color={'success'}>
          {row?.is_paid ? "Paid" : "Unpaid"}
        </Label>
      </TableCell>
      <TableCell align='center'>
        <Label variant="soft" color={row?.is_deliver ? "success":"warning"}>
          {row?.is_deliver ? 'Delivery' : 'Pick Up'}
        </Label>
        <Typography>
        
        </Typography>
      </TableCell>

      <TableCell align='center'>
        <Label variant="soft" color={
          row?.status_id === 4 && 'success' ||
          row?.status_id === 1 && 'warning' ||
          row?.status_id === 2 && 'primary' ||
          row?.status_id === 3 && 'error' || 'default'

        }>
          {row?.status_id === 4 && "Done" ||
            row?.status_id === 1 && "Pending" ||
            row?.status_id === 2 && "Approved" ||
            row?.status_id === 3 && "Cancelled" 

          }
        </Label>
      </TableCell>

      <TableCell align='center'>

        <Label variant="soft" color={
          row?.delivery_status?.id === 10 && 'warning' ||
          row?.delivery_status?.id === 7 && 'success' ||
          row?.delivery_status?.id === 6 && 'success' ||
          row?.delivery_status?.id === 8  && 'error' ||
          row?.delivery_status?.id === 9 && 'warning' || 
          row?.delivery_status?.id === 5 && 'primary' ||
          row?.delivery_status?.id === 11 && 'error' ||
          row?.delivery_status?.id === 12 && 'info' ||
          'default'


        }>
             {row?.delivery_status?.name}
        </Label>
      </TableCell>

      <TableCell align='center'>
        <Typography>
           {row?.created_at}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        {/* <Tooltip title="actions" placement="top" arrow>
            <IconButton onClick={() => onViewRow()}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Tooltip> */}
      </TableCell>

      <Stack direction="row" justifyContent="flex-end">
        <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
          <MenuItem
            onClick={() => {
              popover.onClose();
              onViewRow()
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="mdi:eye" />
            View
          </MenuItem>



          {row?.status_id !== 2 && row?.status_id !== 4 && <MenuItem
            onClick={() => {
              approveConfirm.onTrue()
              popover.onClose();

            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="material-symbols:order-approve-sharp" />
            Approve
          </MenuItem>}


          {row?.status_id !== 4 && row?.status_id !== 3 && <MenuItem
            onClick={() => {
              cancelConfirm.onTrue()
              popover.onClose();

            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="material-symbols-light:cancel" />
            Cancel
          </MenuItem>}
          {row?.status_id !== 4 && row?.status_id !== 3 && <MenuItem
            onClick={() => {
              doneConfirm.onTrue()
              popover.onClose();

            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:done-all-fill" />
            Done
          </MenuItem>}

          {row?.status_id !== 4 && row?.status_id !== 3  && row?.status_id !== 1 && <MenuItem
            onClick={() => {
              onEditRow()

            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="mdi:pencil" />
            Update Status 
          </MenuItem>}

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
      </Stack>
      {renderConfirm}
      {renderDoneConfirm}
      {renderApprovedConfirm}
      {renderCancelConfirm}
    </TableRow>
  );
}
