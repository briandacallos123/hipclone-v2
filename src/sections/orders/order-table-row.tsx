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

export default function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onViewPatient,
}: Props) {



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
    // return (
    //   <TableMobileRow

    //     menu={[
    //       {
    //         label: 'View',
    //         icon: 'solar:eye-bold',
    //         func: onViewRow,
    //       },
    //     ]}
    //   >
    //     <div style={{ display: 'flex', alignItems: 'center' }}>
    //       {row?.patientInfo?.userInfo?.[0]?.display_picture?.[0] ? (
    //         <Avatar
    //           alt={row?.patientInfo?.FNAME}
    //           src={
    //             row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]
    //           }
    //           sx={{ mr: 2 }}
    //         >  
    //           {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
    //         </Avatar>
    //       ) : (
    //         <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
    //           {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
    //         </Avatar>
    //       )}


    //       <ListItemText
    //         primary={!isPatient ? fullName : row?.clinicInfo?.clinic_name}
    //         secondary={
    //           <>
    //             <Typography variant="caption">
    //               {format(new Date(row?.date), `dd MMM yyyy`)}&nbsp;({convertTime(row?.time_slot)})
    //             </Typography>
    //             <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
    //               <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
    //                 {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
    //               </Label>
    //               <Label
    //                 color={(row?.payment_status && 'success') || 'error'}
    //                 sx={{ textTransform: 'capitalize' }}
    //               >
    //                 {row?.payment_status ? 'paid' : 'unpaid'}
    //               </Label>
    //             </Stack>
    //           </>
    //         }
    //         primaryTypographyProps={{
    //           typography: 'subtitle2',
    //         }}
    //         secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
    //       />
    //     </div>
    //   </TableMobileRow>
    // );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(row?.voucherId)
    enqueueSnackbar('Copied to clipboard');
  }

  const medecineImg = `https://hip.apgitsolutions.com/${row?.attachment?.file_path?.split('/').splice(1).join("/")}`

  const storeImage = `https://hip.apgitsolutions.com/${row?.store?.attachment_store?.file_url?.split('/').splice(1).join("/")}`

  return (

    <TableRow hover selected={selected}>


      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {medecineImg ? (
            <Avatar
              alt={`${row?.clinicInfo?.clinic_name}`}
              src={medecineImg}
              sx={{ mr: 2 }}
            >

            </Avatar>
          ) : (
            <Avatar alt={`${row?.clinicInfo?.clinic_name}`} sx={{ mr: 2 }}>
              {String(row?.clinicInfo?.clinic_name).charAt(0).toUpperCase()}
            </Avatar>
          )}


          <Stack>
            <ListItemText
              primary={row?.generic_name}
              // secondary={row?.voucherId}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
            
          </Stack>
        </div>
      </TableCell>

      <TableCell sx={{
        display:'flex',
        alignItems:'center'
      }}>
        {storeImage ? (
          <Avatar
            alt={`${row?.clinicInfo?.clinic_name}`}
            src={storeImage}
            sx={{ mr: 2 }}
          >

          </Avatar>
        ) : (
          <Avatar alt={`${row?.clinicInfo?.clinic_name}`} sx={{ mr: 2 }}>
            {String(row?.store?.name).charAt(0).toUpperCase()}
          </Avatar>
        )}
        <ListItemText
          primary={row?.store?.name}
          // secondary={(()=>{
          //   let time:any;

          //   if(row?.e_time){
          //     time = `${convertTime(row?.time_slot)} - ${convertTime(row?.e_time)}`
          //   }else{
          //     time = convertTime(row?.time_slot)
          //   }

          //   return time;
          // })()}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Typography>
          {row?.is_deliver ? "Delivery" : "Pick Up"}
        </Typography>

      </TableCell>


      <TableCell align="center">
        <Label variant="soft" color={(row?.is_paid === 1 && 'success') || 'info'}>
          {row?.is_paid ? "Paid" : "Unpaid"}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            row?.status_id === 1
              ? 'warning'
              : row?.status_id === 2
                ? 'info'
                : row?.status_id === 3
                  ? 'error'
                  : row?.status_id === 4
                    ? 'success'
                    : 'info'
          }
        >
          {row?.status_id === 1
            ? 'Pending'
            : row?.status_id === 2
              ? 'Approved'
              : row?.status_id === 3
                ? 'Cancelled'
                : row?.status_id === 4
                  ? 'Done'
                  : 'unknown'}
        </Label>
      </TableCell>
      {/* <TableCell/></TableCell> */}
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
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
