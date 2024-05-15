// @mui
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function SubaccountDetailsTableRowSkeleton() {
  return (
    <TableRow hover>
      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40 }} />

          <Skeleton width="100%" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>
    </TableRow>
  );
}
