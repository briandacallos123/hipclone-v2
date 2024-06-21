import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useResponsive } from 'src/hooks/use-responsive';

const StoreSkeletonView = () => {
  return (
    <TableRow hover>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" height={40} sx={{ mr: 2, minWidth: 40 }} />

          <Skeleton width="100%" />
        </div>
      </TableCell>

      {/* <TableCell>
        <Skeleton width="100%" />
      </TableCell>

      <TableCell>
        <Skeleton width="100%" />
      </TableCell> */}

      <TableCell sx={{ px: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default StoreSkeletonView