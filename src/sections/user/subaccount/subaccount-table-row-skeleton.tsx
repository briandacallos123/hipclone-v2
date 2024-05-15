// @mui
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function SubaccountTableRowSkeleton() {
  const upMd = useResponsive('up', 'md');

  if (!upMd) {
    return (
      <TableRow>
        <TableCell sx={{ p: 1 }}>
          <Skeleton variant="rounded" width="100%" height={80} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover>
      {/* <TableCell>
        <div style={{ borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={5} height={20} sx={{ minWidth: 20 }} />
        </div>
      </TableCell> */}

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40 }} />

          <Skeleton width="100%" />
        </div>
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell sx={{ px: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="rectangular" height={30} sx={{ minWidth: 10 }} />
        </div>
      </TableCell>
    </TableRow>
  );
}
