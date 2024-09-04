import { useCallback, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemText from '@mui/material/ListItemText';
// types
import { ISchedule } from 'src/types/general';
import { IUserClinicItem } from 'src/types/user';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fTime } from '@/utils/format-time';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { TableMobileRow } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import UserClinicScheduleEditView from '../@view/user-clinic-schedule-edit-view';

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

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  onAddSchedule: VoidFunction;
  row: any;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  isHideSched: Boolean;
  setHideSched: any;
  refetch: any;
  onDeleteSched: any;
};

export default function ClinicTableRow({
  row,
  selected,
  onEditRow,
  onAddSchedule,
  onSelectRow,
  setHideSched,
  onDeleteRow,
  isHideSched,
  refetch,
  onDeleteSched,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const edit = useBoolean();
  const confirm = useBoolean();

  const viewSchedule = useBoolean();

  useEffect(() => {
    if (isHideSched) {
      viewSchedule.onFalse();
      setTimeout(() => {
        setHideSched(false);
      }, 0);
    }
  }, [isHideSched]);

  const popover = usePopover();

  const scheduleType = [
    ...new Set(row?.ClinicSchedInfo?.map((_) => _.type).flatMap((_) => [..._])),
  ];

  const scheduleDays = [
    ...new Set(row?.ClinicSchedInfo?.map((_) => _.days).flatMap((_) => [..._])),
  ];

  const handleDeleteItem = useCallback((id: string) => {
    //  delete dito
    onDeleteSched(id);
  }, []);
  //
  // console.log(row,'row@@')

  const [editSchedId, setEditSchedId] = useState<number>(0);

  const handleEditSched = useCallback(
    (id: any) => {
      setEditSchedId(id);
      edit.onTrue();
    },
    [edit.onTrue]
  );

  const renderSchedule = (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={viewSchedule.value}
      onClose={viewSchedule.onFalse}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>
        <CardHeader
          title={row?.clinic_name}
          subheader="List of Schedules"
          action={
            <Button
              onClick={onAddSchedule}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add
            </Button>
          }
          sx={{ p: 0 }}
        />
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          {row?.ClinicSchedInfo?.map((item: any) => (
            <ScheduleCard
              key={item.id}
              data={item}
              edit={edit}
              refetch={refetch}
              modifySched={() => console.log('')}
              setHideSched={() => setHideSched(true)}
              onHandleEditSched={() => handleEditSched(item)}
              onDeleteItem={() => handleDeleteItem(item.id)}
              editSchedId={editSchedId}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={viewSchedule.onFalse}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

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

  if (!upMd) {
    return (
      <>
        <TableMobileRow
          selected={selected}
          onSelectRow={onSelectRow}
          menu={[
            {
              label: 'Edit Clinic',
              icon: 'solar:pen-bold',
              func: onEditRow,
            },
            {
              label: 'View Schedule',
              icon: 'solar:eye-bold',
              func: viewSchedule.onTrue,
            },
            {
              label: 'Delete',
              icon: 'solar:trash-bin-trash-bold',
              func: confirm.onTrue,
              color: 'error',
            },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.clinicDPInfo[0] ? (
              <Avatar
                alt={row?.patientInfo?.FNAME}
                src={row?.clinicDPInfo[0].filename.split('public')[1]}
                sx={{ mr: 2 }}
              >
                {row?.clinic_name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={row?.clinic_name} sx={{ mr: 2 }}>
                {row?.clinic_name.charAt(0).toUpperCase()}
              </Avatar>
            )}
            {/* <Avatar alt={row?.clinic_name} sx={{ mr: 2 }}>
              {row?.clinic_name.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={row?.clinic_name}
              secondary={
                <>
                  <Typography variant="subtitle2">{row?.location}</Typography>
                  <Stack direction="row">
                    <Typography variant="caption">Days:&nbsp;</Typography>
                    <Stack
                      component="span"
                      direction="row"
                      flexWrap="wrap"
                      divider={<Typography variant="caption">,&nbsp;</Typography>}
                    >
                      {scheduleDays.map((item) => (
                        <Typography key={item} variant="caption" sx={{ fontWeight: 'bold' }}>
                          {reader(item)}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Stack spacing={1} direction="row">
                    {scheduleType?.map((item: any) => (
                      <Label key={item} variant="soft" color={(item === 1 && 'success') || 'info'}>
                        {type(item)}
                      </Label>
                    ))}
                  </Stack>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </TableMobileRow>

        {renderSchedule}

        {renderConfirm}
      </>
    );
  }

  return (
    <>
      <StyledTableRow hover selected={selected} isPending={row?.client === 1}>
        <TableCell padding="checkbox">
          {row?.clinicDPInfo?.length && row?.clinicDPInfo[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={row?.clinicDPInfo[0]?.filename}
              sx={{ mr: 2 }}
            >
              {row?.clinic_name.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.clinic_name} sx={{ mr: 2 }}>
              {row?.clinic_name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/*           
          {(() => {
            const url = row?.clinicDPInfo[0]?.filename;
            const parts = url?.split('public');
            const publicPart = parts && parts[1];

            return url ? (
              <Avatar src={publicPart} />
            ) : (
              <Avatar>{row?.clinic_name.charAt(0).toUpperCase()}</Avatar>
            );
          })()} */}
          {/* <Checkbox checked={selected} onClick={onSelectRow} /> */}
        </TableCell>

        <TableCell>
          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <ListItemText
              primary={row?.clinic_name}
              secondary={
                <>
                  <Typography variant="subtitle2">{row?.location}</Typography>
                  <Stack direction="row">
                    <Typography variant="caption">Days:&nbsp;</Typography>
                    <Stack
                      component="span"
                      direction="row"
                      flexWrap="wrap"
                      divider={<Typography variant="caption">,&nbsp;</Typography>}
                    >
                      {scheduleDays.map((item) => (
                        <Typography key={item} variant="caption" sx={{ fontWeight: 'bold' }}>
                          {reader(item)}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Stack spacing={1} direction="row">
                    {scheduleType?.map((item: any) => (
                      <Label key={item} variant="soft" color={(item === 1 && 'success') || 'info'}>
                        {type(item)}
                      </Label>
                    ))}
                  </Stack>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />

            <Stack direction="row" alignItems="flex-start" justifyContent="flex-end">
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>
          </Box>
        </TableCell>
        <Stack direction="row" justifyContent="flex-end">
          <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
            <MenuItem
              onClick={() => {
                onAddSchedule();
                popover.onClose();
              }}
            >
              <Iconify icon="mingcute:add-line" />
              Add Schedule
            </MenuItem>

            <MenuItem
              onClick={() => {
                viewSchedule.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:eye-bold" />
              View Clinic
            </MenuItem>
            <MenuItem
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit Clinic
            </MenuItem>

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
      </StyledTableRow>

      {renderSchedule}

      {renderConfirm}
    </>
  );
}

// ----------------------------------------------------------------------

type CardProps = {
  data: any;
  onDeleteItem: VoidFunction;
  onHandleEditSched: VoidFunction;
  edit: any;
  editSchedId: any;
};

function ScheduleCard({
  setHideSched,
  data,
  onDeleteItem,
  edit,
  onHandleEditSched,
  editSchedId,
  refetch,
  modifySched,
}: any) {
  const confirm = useBoolean();

  const popover = usePopover();

  const convertTime = (timeStr: any) => {
    if (!timeStr) return 'N/A';

    if (timeStr?.includes('T')) {
      const date = new Date(timeStr);

      let hour = date?.getHours();
      const min = date?.getMinutes();

      const AMPM = hour >= 12 ? 'PM' : 'AM';

      if (hour > 12) {
        hour -= 12;
      } else if (hour === 0) {
        hour = 12;
      }

      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      const formattedMin = min < 10 ? `0${min}` : `${min}`;

      return `${formattedHour}:${formattedMin} ${AMPM}`;
    }

    const timeParts = timeStr.split(':');
    const hour = parseInt(timeParts[0], 10);
    const min = parseInt(timeParts[1], 10);

    let AMPM = 'AM';
    if (hour >= 12) {
      AMPM = 'PM';
    }

    const formattedHour = hour > 12 ? hour - 12 : hour;
    const formattedMin = min < 10 ? `0${min}` : `${min}`;

    return `${formattedHour}:${formattedMin} ${AMPM}`;
  };
  return (
    <>
      <Card
        key={data?.id}
        sx={{
          py: 1,
          px: 2,
          minWidth: { md: 'auto' },
          maxWidth: { md: 'auto' },
          boxShadow: 0,
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[300]
              : theme.palette.background.neutral,
        }}
      >
        <CardHeader
          title={
            <Stack spacing={1} direction="row">
              {data?.type.map((item: any) => (
                <Label key={item} variant="soft" color={(item === 1 && 'success') || 'info'}>
                  {type(item)}
                </Label>
              ))}
            </Stack>
          }
          action={
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          }
          sx={{ p: 0 }}
        />

        <Stack sx={{ mt: 0.5, color: 'text.disabled' }}>
          <Stack direction="row">
            <Typography variant="caption">Days: &nbsp;</Typography>
            <Stack
              component="span"
              direction="row"
              flexWrap="wrap"
              divider={<Typography variant="caption">,&nbsp;</Typography>}
            >
              {data?.days.map((item: any) => (
                <Typography key={item} variant="caption" sx={{ fontWeight: 'bold' }}>
                  {reader(item)}
                </Typography>
              ))}
            </Stack>
          </Stack>

          <Typography
            sx={{
              typography: 'caption',
              '& > span': { fontWeight: 'bold', color: 'text.disabled' },
            }}
          >
            Time: &nbsp;
            <span>
              {convertTime(data?.start_time)} - {convertTime(data?.end_time)}
            </span>
          </Typography>

          <Typography
            sx={{
              typography: 'caption',
              '& > span': { fontWeight: 'bold', color: 'text.disabled' },
            }}
          >
            Duration: &nbsp;
            <span>{`${data?.time_interval} mins`}</span>
          </Typography>
        </Stack>
      </Card>

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

        <MenuItem
          onClick={() => {
            onHandleEditSched();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <UserClinicScheduleEditView
        setHideSched={setHideSched}
        open={edit.value}
        onClose={edit.onFalse}
        item={editSchedId}
        modifySched={modifySched}
        refetch={refetch}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteItem}>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function reader(data: number) {
  return (
    <>
      {data === 0 && 'Sun'}
      {data === 1 && 'Mon'}
      {data === 2 && 'Tue'}
      {data === 3 && 'Wed'}
      {data === 4 && 'Thu'}
      {data === 5 && 'Fri'}
      {data === 6 && 'Sat'}
    </>
  );
}
function type(data: number) {
  return (
    <>
      {data === 1 && 'Telemedicine'}
      {data === 2 && 'Face-to-Face'}
    </>
  );
}
