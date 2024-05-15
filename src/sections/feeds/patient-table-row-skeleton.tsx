// @mui
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function FeedSkeleton() {
  const upMd = useResponsive('up', 'md');

  return (
    <Box>
      <Skeleton width="100%" height="300px" />
    </Box>
  );
}
