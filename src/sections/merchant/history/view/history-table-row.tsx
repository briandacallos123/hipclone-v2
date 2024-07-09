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
    onViewRow: VoidFunction;
    onDeleteRow: () => void;
    onViewPatient: VoidFunction;
    onEditRow: () => void;
};

export default function HistoryTableRow({
    row,
    selected,
    onSelectRow,
    onViewRow,
    onViewPatient,
    onDeleteRow,
    onEditRow
}: Props) {
    /*  const { patient, hospital, schedule, isPaid, type } = row; */
    const upMd = useResponsive('up', 'md');

    console.log(row, 'ROW__________')
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

    const img_path = row?.attachment_info?.file_path && row?.attachment_info?.file_path.split('/').splice(1).join('/')


    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <Avatar src={`https://hip.apgitsolutions.com/${img_path}`} alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
                    {/* {row?.generic_name?.charAt(0)?.toUpperCase()} */}
                    {/* <img src={img_path} alt="" /> */}
                </Avatar>
                <ListItemText
                    primary={row?.generic_name}
                    primaryTypographyProps={{ typography: 'subtitle2' }}
                    sx={{
                        cursor: 'pointer',
                        // textDecoration: 'underline',
                        // ':hover': {
                        //   color: 'primary.main',
                        // },
                        textTransform: 'capitalize'
                    }}
                // onClick={() => onViewPatient(row?.patientInfo?.userInfo?.uuid)}
                />
            </TableCell>
            {/* <TableCell >
            <Label variant="soft" color={'info'}>
                {row?.generic_name}
            </Label>
        </TableCell> */}
           
            <TableCell align='center'>
                <Typography>
                    {row?.dose}
                </Typography>
                {/* <Label variant="soft" color={'success'}>
               
            </Label> */}
            </TableCell>
            <TableCell align='center'>
                <Typography>
                    {row?.form}

                </Typography>
                {/* <Label variant="soft" color={'success'}>
            </Label> */}
            </TableCell>
            <TableCell align='center'>
                <Typography>
                    ₱ {row?.price}
                </Typography>

            </TableCell>
            <TableCell align='center'>
                <Typography>
                    {`${row?.store?.name.charAt(0).toUpperCase()}${row?.store?.name?.split('').splice(1).join('')}`}
                </Typography>

            </TableCell>
            <TableCell align='center'>
                <Typography>
                    {/* {row?.status_id === 4 && "Done" ||
                        row?.status_id === 3 && "Cancelled"} */}

                    <Label variant="soft" color={(row?.status_id === 4 && 'success') || 'info'}>
                        {row?.status_id === 4 && "Done" ||
                            row?.status_id === 3 && "Cancelled"}
                    </Label>
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
                            onEditRow();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Edit
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
            {renderConfirm}
        </TableRow>
    );
}
