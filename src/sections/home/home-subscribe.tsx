import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

// routes
import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hook';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(0, 0),
  background: `url("/assets/images/home/bg-sub1.jpg") center`,
  backgroundSize: 'cover',
  color: theme.palette.common.white,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 40),
  },
  [theme.breakpoints.down('sm')]: {
    background: `url("/assets/images/home/bg-sub1.jpg") no-repeat right`,
  },
}));

// theme.palette.background.neutral

const TextFieldStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    input: {
      color: theme.palette.common.black,
    },
    background: theme.palette.common.white,
    '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
      borderColor: theme.palette.common.black,
    },
  },
  // [theme.breakpoints.up('md')]: {
  //   width: 500,
  // },
}));

// ----------------------------------------------------------------------

export default function HomeSubscribe() {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const router = useRouter();
  const handleOpen = () => {
    router.push(paths.subs);
  };

  return (
    <StyledRoot id="subscribe">
      <Container component={MotionContainer} maxWidth="xl">
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          sx={{ minHeight: 600 }}
        >
          <m.div variants={varFade().inUp}>
            <Typography
              variant={mdUp ? 'h3' : 'h4'}
              sx={{
                color: 'black',
                textAlign: 'center',
                '& > span': { color: theme.palette.primary.main },
              }}
            >
              Get started With
              <span>{` HIP `}</span>
            </Typography>
          </m.div>
          <Stack spacing={3} sx={{ px: { xs: 0, md: 20 }, textAlign: 'center', mt: 1 }}>
            <m.div variants={varFade().inUp}>
              <TextFieldStyle
                // value={search?.doctor}
                name="doctor"
                onChange={() => {}}
                // onChange={(e) => {
                //   setDoctorData((prev) => {
                //     return {
                //       ...prev,
                //       lastChange: 'typed',
                //       doctorType: e.target.value,
                //     };
                //   });
                // }}
                // {...params}

                fullWidth
                placeholder="Your Email Address"
              />
            </m.div>
            <m.div variants={varFade().inUp}>
              <LoadingButton
                color="inherit"
                size="large"
                variant="contained"
                onClick={() => handleOpen()}
              >
                Get Started
              </LoadingButton>
            </m.div>
          </Stack>
        </Stack>
      </Container>
    </StyledRoot>
  );
}
