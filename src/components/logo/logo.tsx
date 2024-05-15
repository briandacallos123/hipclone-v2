import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
          <g id="logo_single">
            <path
              id="vector2"
              d="M444.512 366.964L438.364 374.116C396.416 422.923 343.592 447.675 281.361 447.675C224.704 447.675 177.195 429.353 140.146 393.21C103.171 357.141 84.4318 311.457 84.4318 257.433C84.4318 221.609 92.8214 188.969 109.356 160.407C125.878 131.882 149.516 108.808 179.62 91.845C209.799 74.8453 243.063 66.2352 278.496 66.2352C311.001 66.2352 341.191 72.8122 368.246 85.7824C395.228 98.7282 418.706 118.043 438.021 143.187L444.133 151.136L496.748 110.768L491.053 102.868C467.685 70.4729 437.298 44.9366 400.727 26.9693C364.253 9.0755 322.905 0 277.846 0C203.099 0 139.95 24.581 90.1515 73.0571C40.2914 121.594 15 182.245 15 253.293C15 320.631 35.8455 378.966 76.9975 426.707C126.098 483.304 193.889 512 278.483 512C322.844 512 363.641 503.488 399.723 486.709C435.927 469.88 466.558 445.704 490.784 414.876L497.091 406.854L444.512 366.964Z"
              fill="url(#paint0_linear_1_2)"
            />

            <path
              id="vector1"
              d="M349.373 281.512V105.746C349.373 97.0257 343.237 89.5057 334.7 87.7543C326.151 86.0029 317.553 90.4978 314.124 98.52L224.275 308.175V150.327C224.275 141.497 217.992 133.916 209.321 132.274C200.65 130.633 192.027 135.398 188.806 143.616L135.86 278.634H16.0165C17.0453 291.236 18.858 303.484 21.4545 315.377H148.364C155.921 315.377 162.706 310.747 165.462 303.717L187.508 247.5V397.668C187.508 406.389 193.644 413.909 202.181 415.66C203.418 415.917 204.655 416.04 205.879 416.04C213.105 416.04 219.817 411.753 222.757 404.907L312.605 195.252V299.883C312.605 310.024 320.836 318.255 330.977 318.255H497.079V281.512H349.348H349.373Z"
              fill={PRIMARY_DARK}
            />
          </g>

          <defs>
            <linearGradient
              id="paint0_linear_1_2"
              x1="497"
              y1="185"
              x2="15"
              y2="397.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={PRIMARY_MAIN} />
              <stop offset="1" stopColor={PRIMARY_LIGHT} />
            </linearGradient>
          </defs>
        </svg>
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
