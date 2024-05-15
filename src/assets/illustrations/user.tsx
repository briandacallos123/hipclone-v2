"use client"

import React, { memo, useEffect, useState } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const User = ({ sx, ...other }: BoxProps) => {
  const theme = useTheme();
  const [isDark, setDark] = useState(false);

  useEffect(() => {
    if (theme.palette.mode === 'dark') {
      setDark(true);
    } else {
      setDark(false);
    }
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {isDark ? (
        <svg
          width="250px"
          height="250px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z"
              fill="#ffffff"
            ></path>{' '}
            <path
              d="M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z"
              fill="#ffffff"
            ></path>{' '}
          </g>
        </svg>
      ) : (
        <svg
          width="250px"
          height="250px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z"
              fill="#000000"
            ></path>{' '}
            <path
              d="M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z"
              fill="#000000"
            ></path>{' '}
          </g>
        </svg>
      )}
    </Box>
  );
};

export default memo(User);
