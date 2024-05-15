// @mui
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function NoteTableRowSkeleton() {
  const upMd = useResponsive('up', 'md');

  if (!upMd) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton variant="rounded" width="100%" height={80} />
        </TableCell>
      </TableRow>
    );
  }

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton width="100%" />
        </div>
      </TableCell>

      <TableCell sx={{ px: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </TableCell>
    </TableRow>
  );
}
