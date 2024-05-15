// @mui
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function NotificationSkeletons() {
  const upMd = useResponsive('up', 'md');

  // if (!upMd) {
  //   return (
  //     <TableRow>
  //       <TableCell sx={{ p: 1 }}>
  //         <Skeleton variant="rounded" width="100%" height={80} />
  //       </TableCell>
  //     </TableRow>
  //   );
  // }

  return (
    <TableRow hover sx={{display:'flex', alignItems:"center"}}>
      <TableCell sx={{mr:3}} padding="checkbox">
            <Skeleton variant="circular" width={32} height={32} />
      </TableCell>

     
      <TableCell >
         <Skeleton  height={50} sx={{width:{sm:200, md:400}, mb:1}}/>
         <Skeleton height={50} sx={{width:{sm:200, md:400}}} />
      </TableCell>

    </TableRow>
  );
}
