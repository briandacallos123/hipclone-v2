"use client"

import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {


  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

type StoreDashboardBreadcrampsProps = {
  storeName: string;
  address: string;
  path?: string;
}

const StoreDashboardBreadcramps = ({ path, storeName, address }: StoreDashboardBreadcrampsProps) => {
  const router = useRouter()

  function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const handleHome = () => {
    router.push('/dashboard')

  }

  const handleStore = () => {
    router.back()
  }

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {path !== 'single-med' && <StyledBreadcrumb
          onClick={handleHome}
          component="a"
          href="#"
          label="Home"
          sx={{
            color: 'blue',
            cursor: 'pointer'
          }}
        />}
        <StyledBreadcrumb
          onClick={handleStore}

          sx={{
            color: 'blue',
            cursor: 'pointer',
           
          }}
           label={`${path ? 'Back To Store' : 'Store'}`} />
        <Typography variant="h5" >
          {`${storeName} - ${address}`}
        </Typography>
      </Breadcrumbs>
    </div>
  );
}

export default StoreDashboardBreadcramps