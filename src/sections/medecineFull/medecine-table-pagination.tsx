"use client"

import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// routes
import { paths } from 'src/routes/paths';

//


// ----------------------------------------------------------------------

type Props = {
    medecine: [];
};

export default function MedecineTablePagination({ medecine }: Props) {
  // console.log(medecin)

  return (
    <>
     
      {/* {medecine?.length > 5 && ( */}
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      {/* )} */}
    </>
  );
}
