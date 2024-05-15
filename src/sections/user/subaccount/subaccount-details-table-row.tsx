// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
// hooks
// utils
import { fDate } from 'src/utils/format-time';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type IUserSubaccountLogItem = {
  id: string;
  fullName: string;
  avatarUrl: string;
  date: Date | number;
  type: string;
};

type Props = {
  // selected: boolean;
  row: any;
  // onSelectRow: VoidFunction;
};

export default function SubaccountDetailsTableRow({ row /*, selected, onSelectRow*/ }: Props) {
  // const { fullName, date, type, avatarUrl } = row;

  // console.log(row?.log_type,'sdsa')

  return (
    <TableRow hover /*selected={selected}*/>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>{row.date}</TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>

        {row?.patientInfo?.userInfo?.display_picture[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={row?.patientInfo?.userInfo?.display_picture?.[0]?.filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME} sx={{ mr: 2 }}>
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}
            {/* <Avatar alt={row?.request}  sx={{ mr: 2 }}>
              {row?.request.charAt(0).toUpperCase()}
            </Avatar> */}

          <Typography
            sx={{
              typography: 'body2',
              '& > span': { typography: 'subtitle2' },
            }}
          >
            <span>{row?.request}</span>
          </Typography>
        </div>
      </TableCell>

      <TableCell align="center">   
        {/* <Label variant="soft" color={(row?.log_type === "1" && 'info') || (row?.log_type === "2" && 'success') || (row?.log_type === "3" && 'success') || (row?.log_type === "4" && ']') || (row?.log_type === "5" && 'success') || 'info'}> */}
        <Label variant="soft" 
               color={(row?.log_type === "1" && 'info') 
               || (row?.log_type === "2" && 'success') 
               || (row?.log_type === "3" && 'success') 
               || (row?.log_type === "4" && 'warning') 
               || (row?.log_type === "5" && 'success') 
               || 'info'}>
           {(row?.log_type === "1" && 'Appointment Status') || (row?.log_type === "2" && 'Appointment Type') || (row?.log_type === "3" && 'Payment Status') || (row?.log_type === "4" && 'Lab and Imaging Result') || (row?.log_type === "5" && 'HMO Claims')}
        </Label>
      </TableCell>
    </TableRow>
  );
}

