import { fDateTime, isToday } from 'src/utils/format-time';
// @mui
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _hospitals } from 'src/_mock';
// types
import { IPrescriptionItem } from 'src/types/prescription';
// // components
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import { Box, Button, Dialog, DialogActions, MenuItem, Skeleton } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import Label from '@/components/label';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import { useBoolean } from '@/hooks/use-boolean';
import { LogoFull } from '@/components/logo';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

type StyledTableRowProps = {
  isPending: boolean;
};

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isPending',
})<StyledTableRowProps>(({ isPending, theme }) => ({
  backgroundColor: 'inherit',
  transition: theme.transitions.create('all', {
    duration: '2s',
  }),
  ...(isPending && {
    backgroundColor: theme.palette.primary.lighter,
    '&:MuiTableRow-hover:hover': {
      backgroundColor: theme.palette.primary.lighter,
    },
    transition: theme.transitions.create('all', {
      duration: '300ms',
    }),
  }),
}));

// ----------------------------------------------------------------------

type Props = {
  row: any;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onDeleteRow: ()=>void;
};

export default function PatientPrescriptionTableRow({onDeleteRow, row, onEditRow, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();

  const { DATE, clinicInfo, ID } = row;

  const date = DATE
  const popover = usePopover();
  const confirm = useBoolean();
  const view = useBoolean();

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
            onDeleteRow()
            confirm.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );
  const isSecretary = () => {

    let text: any

    // for patient
    if (user?.role === 'secretary' || user?.role === 'doctor') {
      if (user?.permissions?.pres_view === 1 && user?.role === 'secretary') {
        text = <>
          <Tooltip title="View Details" placement="top" arrow>
            <IconButton onClick={() => onViewRow()}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Tooltip>
        </>
      } else {
        text = <>
          <IconButton disabled>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </>
      }
      if (user?.role === 'doctor') {
        text = <>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">

            {<MenuItem
              onClick={() => {
                onEditRow()
              }}
              sx={{ color: 'sucess.main' }}
            >
              <Iconify icon="fluent:arrow-repeat-all-24-regular" />
              Repeat
            </MenuItem>}

            <MenuItem
              onClick={() => {
                // popover.onClose();
                onViewRow()
                // view.onTrue()
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="mdi:eye" />
              View
            </MenuItem>

            {<MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="mdi:delete" />
              Delete
            </MenuItem>}


          </CustomPopover>

          {/* <Tooltip title="View Details" placement="top" arrow>
            <IconButton onClick={() => onViewRow()}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Repeat" placement="top" arrow>
            <IconButton onClick={() => onEditRow()}>
              <Iconify
                icon="solar:repeat-one-minimalistic-bold"
                sx={{ transform: 'rotate(90deg)' }}
              />
            </IconButton>
          </Tooltip> */}

        </>
      }

    }
    return text;
  }

  if (!upMd) {
    return (
      <TableMobileRow
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
          {
            label: 'Repeat',
            icon: 'solar:refresh-circle-outline',
            func: onEditRow,
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="healthicons:rx-outline" height={60} width={60} sx={{ mr: 1 }} />

          <ListItemText
            primary={`#${ID}`}
            secondary={
              <>
                <Typography variant="caption">{clinicInfo?.clinic_name}</Typography>
                <Typography variant="caption">{date}</Typography>
              </>
            }
            primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
            secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
          />
        </div>
      </TableMobileRow>
    );
  }

  return (
    <StyledTableRow hover isPending={row?.client === 1}>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="healthicons:rx-outline" height={48} width={48} sx={{ mr: 1 }} />

          <Typography
            variant="subtitle2"
            sx={{ color: 'primary.main', textTransform: 'capitalize' }}
          >
            {row?.client === 1 ? 'Saving prescription...' : `#${ID}`}
          </Typography>
        </div>
      </TableCell>
      {/* <TableCell>{date}</TableCell> */}

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>

          {row?.clinicInfo?.clinicDPInfo?.[0] ? (
            <Avatar
              alt={row?.clinicInfo?.clinic_name}
              src={row?.clinicInfo?.clinicDPInfo?.[0].filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}

            </Avatar>
          ) : (
            <Avatar alt={row?.clinicInfo?.clinic_name} sx={{ mr: 2 }}>
              <Avatar sx={{ textTransform: 'capitalize' }}>
                {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
              </Avatar>
            </Avatar>
          )}

          {/* <Avatar alt={clinicInfo?.clinic_name} sx={{ mr: 2 }}> */}
          {/* <Avatar alt={clinic.clinic_name} src={clinic.clinic_name[0]} sx={{ mr: 2 }}> */}
          {/* {clinicInfo?.clinic_name[0]} */}
          {/* </Avatar> */}

          <ListItemText
            primary={clinicInfo?.clinic_name}
            secondary={clinicInfo?.Province}
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </div>
      </TableCell>
      {/* {renderView} */}
      {renderConfirm}

      <TableCell>
        <Label variant="soft" >
          {row?.presCode ? row?.presCode : "empty"}
        </Label>
      </TableCell>
      {/* <TableCell>{format(new Date(date), 'dd MMM yyyy')}</TableCell> */}
      <TableCell>{date}</TableCell>

      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>

        {isSecretary()}

      </TableCell>
    </StyledTableRow>
  );
}
