// @mui
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function EmrTableRowSkeleton() {
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
      <TableCell padding="checkbox" />

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </TableCell>

      {/* <TableCell>
        <Skeleton width="100%" />
      </TableCell> */}

      <TableCell sx={{ px: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </TableCell>
    </TableRow>
  );
}