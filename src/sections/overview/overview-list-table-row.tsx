import { format } from 'date-fns';
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
  row: IAppointmentItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function OverviewListTableRow({ row, selected, onSelectRow, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');

  const { clinicInfo, date, doctorInfo, patientInfo, payment_status, time_slot, type }: any = row;

  // const fullName = patientInfo?.FULLNAME;

  // if (!upMd) {
  //   return (
  //     <TableMobileRow
  //       selected={selected}
  //       onSelectRow={onSelectRow}
  //       menu={[
  //         {
  //           label: 'View',
  //           icon: 'solar:eye-bold',
  //           func: onViewRow,
  //         },
  //       ]}
  //     >
  //       <div style={{ display: 'flex', alignItems: 'center' }}>
  //         <Avatar alt={fullName} src={patient?.avatarUrl} sx={{ mr: 2 }}>
  //           {fullName?.charAt(0)?.toUpperCase()}
  //         </Avatar>

  //         <ListItemText
  //           primary={fullName}
  //           secondary={
  //             <>
  //               <Typography variant="caption">
  //                 {format(new Date(schedule), 'dd MMM yyyy')}&nbsp;(
  //                 {format(new Date(schedule), 'p')})
  //               </Typography>
  //               <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
  //                 <Label variant="soft" color={(type === 'telemedicine' && 'success') || 'info'}>
  //                   {type}
  //                 </Label>
  //                 <Label
  //                   color={(isPaid && 'success') || 'error'}
  //                   sx={{ textTransform: 'capitalize' }}
  //                 >
  //                   {isPaid ? 'paid' : 'unpaid'}
  //                 </Label>
  //               </Stack>
  //             </>
  //           }
  //           primaryTypographyProps={{
  //             typography: 'subtitle2',
  //           }}
  //           secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
  //         />
  //       </div>
  //     </TableMobileRow>
  //   );
  // }

  const { FNAME, MNAME, LNAME, HOME_ADD } = patientInfo;

  const { clinic_name, id, location } = clinicInfo;

  const fullName = MNAME ? `${FNAME} ${MNAME} ${LNAME}` : `${FNAME} ${LNAME}`;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={`${FNAME}`} src={patientInfo?.avatarUrl || ''} sx={{ mr: 2 }}>
            {FNAME?.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={fullName}
            secondary={HOME_ADD}
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </div>
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={clinicInfo?.clinic_name} src={clinicInfo?.avatarUrl} sx={{ mr: 2 }}>
            {clinic_name?.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={clinic_name}
            secondary={location}
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
          primary={format(new Date(date), 'dd MMM yyyy')}
          secondary={time_slot}
          // secondary={format(new Date(time_slot), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Iconify
          icon={payment_status !== 0 ? 'solar:check-circle-outline' : 'solar:close-circle-outline'}
          sx={{
            m: 0,
            width: 20,
            height: 20,
            color: payment_status === 1 ? 'success.main' : 'error.main',
            // color: 'success.main',
            // ...(!payment_status == && { color: 'error.main' }),
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={(type === 1 && 'success') || 'info'}>
          {type !== 1 ? 'Face to Face' : 'Telemedecine'}
        </Label>
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
