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
import { Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

type Props = {
  // row: NexusGenInputs['DoctorTypeInputInterface'];
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onViewPatient: VoidFunction;
};

export default function MerchantTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onViewPatient,
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

//   if (!upMd) {
//     return (
//       <TableMobileRow
//         // selected={selected}
//         // onSelectRow={onSelectRow}
//         menu={[
//           {
//             label: 'View',
//             icon: 'solar:eye-bold',
//             func: onViewRow,
//           },
//         ]}
//       >
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {row?.patientInfo?.userInfo?.[0]?.display_picture?.[0] ? (
//             <Avatar
//               alt={row?.patientInfo?.FNAME}
//               src={
//                 row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]
//               }
//               sx={{ mr: 2 }}
//             >
//               {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
//             </Avatar>
//           ) : (
//             <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
//               {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
//             </Avatar>
//           )}
//           {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
//             {fullName.charAt(0).toUpperCase()}
//           </Avatar> */}

//           <ListItemText
//             primary={!isPatient ? fullName : row?.clinicInfo?.clinic_name}
//             secondary={
//               <>
//                 <Typography variant="caption">
//                   {format(new Date(row?.date), `dd MMM yyyy`)}&nbsp;({convertTime(row?.time_slot)})
//                 </Typography>
//                 <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
//                   <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
//                     {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
//                   </Label>
//                   <Label
//                     color={(row?.payment_status && 'success') || 'error'}
//                     sx={{ textTransform: 'capitalize' }}
//                   >
//                     {row?.payment_status ? 'paid' : 'unpaid'}
//                   </Label>
//                 </Stack>
//               </>
//             }
//             primaryTypographyProps={{
//               typography: 'subtitle2',
//             }}
//             secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
//           />
//         </div>
//       </TableMobileRow>
//     );
//   }

  const handleCopy = async() => {
    await navigator.clipboard.writeText(row?.voucherId)
    enqueueSnackbar('Copied to clipboard');
  }

  return (
    <TableRow hover selected={selected}>
        <TableCell>
                <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
                {row?.first_name.charAt(0).toUpperCase()}
              </Avatar>
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
                // onClick={() => onViewPatient(row?.patientInfo?.userInfo?.uuid)}
              />
        </TableCell>
        <TableCell>
            <Label variant="soft" color={'info'}>
                {row?.contact}
            </Label>
        </TableCell>
        <TableCell>
            <Label variant="soft" color={'success'}>
                {row?.email}
            </Label>
        </TableCell>
        <TableCell>
            <Label variant="soft" color={'success'}>
                {row?.use_status}
            </Label>
        </TableCell>
    </TableRow>
  );
}
