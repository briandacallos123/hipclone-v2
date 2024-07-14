import { format } from 'date-fns';
// @mui
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _doctorList, _hospitals } from 'src/_mock';
// hooks
import { fDateTime } from 'src/utils/format-time';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IPrescriptionItem } from 'src/types/prescription';
// components
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import Label from '@/components/label';
import { useAuthContext } from '@/auth/hooks';
import { Button, MenuItem, Rating } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    row: any;
    onViewRow?: VoidFunction;
    onManageRow?: () => void;
    onDeleteRow?: () => void
    onUpdateStatusRow?: () => void;
};

export default function StoreTableRow({ onDeleteRow, onUpdateStatusRow, row, onViewRow, onManageRow }: Props) {
    const upMd = useResponsive('up', 'md');
    const { user } = useAuthContext()

    const popover = usePopover();
    const updatePopover = usePopover();





    // const { prescriptionNumber, date, hospitalId, doctor } = row;

    // const keyHospital = _hospitals.filter((_) => _.id === hospitalId)[0];

    // const keyDoctor = _doctorList.filter((_) => _.id === doctor.id)[0].doctor;

    const fullName = `${row?.patient?.FNAME} ${row?.patient?.MNAME}, ${row?.patient?.LNAME}`;

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
                    <Iconify icon="healthicons:rx-outline" height={60} width={60} sx={{ mr: 1 }} />

                    <ListItemText
                        primary={`#${row?.ID}`}
                        secondary={
                            <>
                                <Typography variant="caption">{row?.clinicInfo?.clinic_name}</Typography>
                                <Typography variant="caption">{timestampToDate(row?.DATE)}</Typography>
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
        <TableRow hover>


            <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row?.attachment_store?.file_url && <Avatar
                        alt={row?.name}
                        src={`https://hip.apgitsolutions.com/${row?.attachment_store?.file_url?.split('/').splice(1).join('/')}`}
                        sx={{ mr: 2 }}

                    />
                    }



                    <ListItemText
                        primary={row?.name}
                        // primary={''}

                        primaryTypographyProps={{ typography: 'subtitle2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </div>
            </TableCell>

            {/* <TableCell>


                <ListItemText
                    primary={row?.product_types}
                    // secondary={''}
                    primaryTypographyProps={{ typography: 'subtitle2' }}
                    secondaryTypographyProps={{
                        component: 'span',
                        typography: 'caption',
                    }}
                />
            </TableCell> */}



            <TableCell>
                <Rating value={row?.rating} max={5} />
            </TableCell>
            <TableCell>
                <Label variant="soft" color={row?.is_active ? "success" : "error"}>
                    {row?.is_active ? "Active" : "Inactive"}
                </Label>
            </TableCell>
            {/* <TableCell>
                {row?.description}
            </TableCell> */}

            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <Tooltip title="View Details" placement="top" arrow>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Tooltip>
            </TableCell>

            <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
                <MenuItem
                    onClick={() => {
                        onManageRow()
                        popover.onClose();

                    }}
                    sx={{
                        color: 'sucesss'
                    }}

                >
                    <Iconify icon="ic:baseline-manage-accounts" />
                    Manage
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onUpdateStatusRow()
                        popover.onClose();
                    }}
                    sx={{ color: row?.is_active ? "warning.main":'success.main' }}
                >
                    <Iconify icon="solar:pen-bold" />
                    {row?.is_active ? "Set Inactive":"Set Active"}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDeleteRow();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
        </TableRow>
    );
}

function timestampToDate(timestamp: any) {
    // Parse the timestamp string to a number (if it's a string)
    const timestampNumber = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

    // Check if the parsed timestamp is a valid number
    if (!isNaN(timestampNumber)) {
        // Convert the timestamp to a Date object
        const date = new Date(timestampNumber);

        // Define options for formatting the date
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        // Format the date as "Month Day, Year"
        const formattedDate = date.toLocaleDateString(undefined, options);

        return formattedDate;
    }
    return 'Invalid Timestamp';

}
