import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { HomeNoteFind, HomeNoteSignup } from './components';
import { Button, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const StyledWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(15, 0, 3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 9, 4),
  },
}));

const TitleStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const CONTENT_TITLE = ['Mediko', 'Connect'];

  const renderTitle = (
    <TitleStyle>
      {CONTENT_TITLE.map((title) => (
        <Typography
          key={title}
          sx={{
            typography: mdUp ? 'h3' : 'h2',
            lineHeight: 1,
            '& > span': { color: theme.palette.primary.main },
          }}
        >
          <span>{title.charAt(0)}</span>
          {title.substring(1)}
        </Typography>
      ))}
    </TitleStyle>
  );

  const renderHeader = (
    <Typography
      sx={{
        fontSize: mdUp ? '38px' : '26px',
        fontWeight: 'bold',
        lineHeight: 1,
        '& > span': { color: theme.palette.primary.main },
      }}
    >
      {/* The <span>{` VIRTUAL CLINIC `}</span>
      that conveniently and safely connects you with your doctor */}

      <span>{` Your health, your choice.`}</span> effortlessly connect with the right doctor from the comfort of home
    </Typography>
  );

  const renderBody = (
    <Typography
      sx={{
        fontSize: '20px',
        '& > span': { fontWeight: 700, color: theme.palette.primary.main, display: 'block' },
        ...(mdUp && { fontSize: '23px', lineHeight: 1 }),
      }}
    >

      {/* Your and your family&apos;s health should never be put on hold. With
      <span>{` HIPS`}</span>, you can access doctors online and conveniently schedule your
      face-to-face or online medical consultations. */}
      Consult your way, find the perfect doctor with just a click and prioritize your health.
      {/* {mdUp && (
        <>
          <br />
          <br />
          <Link
            variant="subtitle1"
            color="primary.main"
            href="#benefits"
            underline="none"
            sx={{
              fontSize: mdUp ? '23px' : '20px',
              lineHeight: mdUp && 1,
              '&:hover': { cursor: 'pointer' },
            }}
          >
            {'Learn more '}
          </Link>
          about the benefits of signing up for a free patient account now.
        </>
      )} */}
    </Typography>
  );

  const HomeSignup = (
    <Button variant="contained" sx={{
      background: theme.palette.primary.main,
      p: !mdUp ? 1 : 2,
      mt: !mdUp && 2
    }}>
      Sign Up For Free
    </Button>
  )

  return (
    <>
      <Container component={MotionContainer} maxWidth="xl" sx={{ height: 1 }}>
        <StyledWrapper>
          <Grid container spacing={{ md: 7 }}>
            {!mdUp && (
              <Grid xs={12} sx={{ position: 'relative', mb:2}}>
                <m.div variants={varFade().inRight}>{renderTitle}</m.div>

                <m.div variants={varFade().inUp} style={{ marginTop: 10, position: 'relative' }}>

                  <Image
                    src="/assets/images/home/homeImageFinal.png"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      lineHeight: 0,
                    }}
                  />

                  <Box gap={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    background: 'white',
                    position: 'absolute',
                    bottom: -20,
                    borderRadius: 2,
                    width:'90%',
                    p:.5,
                    left: '50%',         /* Move it right 50% from the left */
                    transform: 'translateX(-50%)',
                  }}>
                    <Stack direction='row' alignItems='center' gap={3}>
                      <Image
                        src="/assets/icons/home/ic_tenga.svg"
                        sx={{
                          width: 40,

                        }}
                      />
                      <Stack>
                        <Typography sx={{
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: theme.palette.primary.main
                        }}>Dr. Donna Alex</Typography>
                        <Typography sx={{
                          color: 'gray',
                          fontSize:13
                        }}>General Practitioner</Typography>

                      </Stack>
                    </Stack>
                    <Stack sx={{
                    }} direction='row' alignItems='center' gap={2}>
                      <Image
                        src="/assets/icons/home/ic_book.svg"
                        sx={{
                          width: 40,
                          borderRadius: 2,
                          lineHeight: 0,
                        }}
                      />
                      <Stack>
                        <Typography sx={{
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: theme.palette.primary.main
                        }}>7 Years</Typography>
                        <Typography sx={{
                          color: 'gray',
                          fontSize:13

                        }}>Experience</Typography>

                      </Stack>
                    </Stack>
                  </Box>
                </m.div>
              </Grid>
            )}

            <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component={m.div}
                variants={varFade().inRight}

                sx={{ pt: 10, ...(!mdUp && { pt: 4, textAlign: 'center' }) }}
              >
                {renderHeader}
                {!mdUp && HomeSignup}

                {mdUp && (
                  <Stack alignItems='flex-start' gap={3}>

                    <Box sx={{ mt: 7, pr: 10 }}>{renderBody}</Box>


                    {/* <HomeNoteSignup sx={{ mt: 12, fontSize: '23px' }} /> */}
                    {HomeSignup}

                    {renderTitle}
                  </Stack>

                )}
              </Box>
            </Grid>

            {mdUp && (
              <Grid xs={12} md={6} sx={{
                p: 0,
                position: 'relative',

              }}>
                <m.div variants={varFade().inUp}>
                  <Image
                    src="/assets/images/home/homeImageFinal.png"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      lineHeight: 0,
                    }}
                  />
                  <Box gap={3} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    background: 'white',
                    position: 'absolute',
                    bottom: -20,
                    left: '25%',
                    px: 3,
                    py: 2,
                    borderRadius: 2
                  }}>
                    <Stack direction='row' alignItems='center' gap={2}>
                      <Image
                        src="/assets/icons/home/ic_tenga.svg"
                        sx={{
                          width: 50,

                        }}
                      />
                      <Stack>
                        <Typography sx={{
                          fontWeight: 'bold',
                          fontSize: 16,
                         color: theme.palette.primary.main
                        }}>Dr. Donna Alex</Typography>
                        <Typography sx={{
                          color: 'gray'
                        }}>General Practitioner</Typography>

                      </Stack>
                    </Stack>
                    <Stack direction='row' alignItems='center' gap={2}>
                      <Image
                        src="/assets/icons/home/ic_book.svg"
                        sx={{
                          width: 50,
                          borderRadius: 2,
                          lineHeight: 0,
                        }}
                      />
                      <Stack>
                        <Typography sx={{
                          fontWeight: 'bold',
                          fontSize: 16,
                         color: theme.palette.primary.main

                        }}>7 Years</Typography>
                        <Typography sx={{
                          color: 'gray'
                        }}>Experience</Typography>

                      </Stack>
                    </Stack>
                  </Box>
                </m.div>
              </Grid>
            )}
          </Grid>

          {/* <Box component={m.div} variants={varFade().inUp} sx={{ pt: 5, textAlign: 'center' }}>
            {!mdUp && <HomeNoteSignup sx={{ mt: 5, fontSize: '20px' }} />}
            <HomeNoteFind sx={{ fontSize: { xs: '18px', md: '20px' } }} />
          </Box> */}
        </StyledWrapper>
      </Container>

      {!mdUp && (
        <Box
          component={MotionContainer}
          sx={{ py: 3, px: 2, bgcolor: 'background.neutral', textAlign: 'center' }}
        >
          <m.div variants={varFade().inRight}>{renderBody}</m.div>
        </Box>
      )}
    </>
    // <Box sx={{
    //   background: '#F3F7FD',

    // }}>
    //   <Container component={MotionContainer} maxWidth="xl" sx={{ height: 1 }}>
    //     <StyledWrapper>
    //       <Grid container spacing={{ md: 7 }}>
    //         {!mdUp && (
    //           <Grid xs={12} sx={{ position: 'relative', mb:2}}>
    //             <m.div variants={varFade().inRight}>{renderTitle}</m.div>

    //             <m.div variants={varFade().inUp} style={{ marginTop: 10, position: 'relative' }}>

    //               <Image
    //                 src="/assets/images/home/homeImageFinal.png"
    //                 sx={{
    //                   width: '100%',
    //                   borderRadius: 2,
    //                   lineHeight: 0,
    //                 }}
    //               />

    //               <Box gap={3} sx={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'space-around',
    //                 background: 'white',
    //                 position: 'absolute',
    //                 bottom: -20,
    //                 borderRadius: 2,
    //                 width:'90%',
    //                 p:.5,
    //                 left: '50%',         /* Move it right 50% from the left */
    //                 transform: 'translateX(-50%)',
    //               }}>
    //                 <Stack direction='row' alignItems='center' gap={3}>
    //                   <Image
    //                     src="/assets/icons/home/ic_tenga.svg"
    //                     sx={{
    //                       width: 40,

    //                     }}
    //                   />
    //                   <Stack>
    //                     <Typography sx={{
    //                       fontWeight: 'bold',
    //                       fontSize: 15
    //                     }}>Dr. Donna Alex</Typography>
    //                     <Typography sx={{
    //                       color: 'gray',
    //                       fontSize:13
    //                     }}>General Practitioner</Typography>

    //                   </Stack>
    //                 </Stack>
    //                 <Stack sx={{
    //                 }} direction='row' alignItems='center' gap={2}>
    //                   <Image
    //                     src="/assets/icons/home/ic_book.svg"
    //                     sx={{
    //                       width: 40,
    //                       borderRadius: 2,
    //                       lineHeight: 0,
    //                     }}
    //                   />
    //                   <Stack>
    //                     <Typography sx={{
    //                       fontWeight: 'bold',
    //                       fontSize: 15
    //                     }}>7 Years</Typography>
    //                     <Typography sx={{
    //                       color: 'gray',
    //                       fontSize:13

    //                     }}>Experience</Typography>

    //                   </Stack>
    //                 </Stack>
    //               </Box>
    //             </m.div>
    //           </Grid>
    //         )}

    //         <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
    //           <Box
    //             component={m.div}
    //             variants={varFade().inRight}

    //             sx={{ pt: 10, ...(!mdUp && { pt: 4, textAlign: 'center' }) }}
    //           >
    //             {renderHeader}
    //             {!mdUp && HomeSignup}

    //             {mdUp && (
    //               <Stack alignItems='flex-start' gap={3}>

    //                 <Box sx={{ mt: 7, pr: 10 }}>{renderBody}</Box>


    //                 {/* <HomeNoteSignup sx={{ mt: 12, fontSize: '23px' }} /> */}
    //                 {HomeSignup}

    //                 {renderTitle}
    //               </Stack>

    //             )}
    //           </Box>
    //         </Grid>

    //         {mdUp && (
    //           <Grid xs={12} md={6} sx={{
    //             p: 0,
    //             position: 'relative',

    //           }}>
    //             <m.div variants={varFade().inUp}>
    //               <Image
    //                 src="/assets/images/home/homeImageFinal.png"
    //                 sx={{
    //                   width: '100%',
    //                   borderRadius: 2,
    //                   lineHeight: 0,
    //                 }}
    //               />
    //               <Box gap={3} sx={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'space-around',
    //                 background: 'white',
    //                 position: 'absolute',
    //                 bottom: -20,
    //                 left: '25%',
    //                 px: 3,
    //                 py: 2,
    //                 borderRadius: 2
    //               }}>
    //                 <Stack direction='row' alignItems='center' gap={2}>
    //                   <Image
    //                     src="/assets/icons/home/ic_tenga.svg"
    //                     sx={{
    //                       width: 50,

    //                     }}
    //                   />
    //                   <Stack>
    //                     <Typography sx={{
    //                       fontWeight: 'bold',
    //                       fontSize: 16
    //                     }}>Dr. Donna Alex</Typography>
    //                     <Typography sx={{
    //                       color: 'gray'
    //                     }}>General Practitioner</Typography>

    //                   </Stack>
    //                 </Stack>
    //                 <Stack direction='row' alignItems='center' gap={2}>
    //                   <Image
    //                     src="/assets/icons/home/ic_book.svg"
    //                     sx={{
    //                       width: 50,
    //                       borderRadius: 2,
    //                       lineHeight: 0,
    //                     }}
    //                   />
    //                   <Stack>
    //                     <Typography sx={{
    //                       fontWeight: 'bold',
    //                       fontSize: 16
    //                     }}>7 Years</Typography>
    //                     <Typography sx={{
    //                       color: 'gray'
    //                     }}>Experience</Typography>

    //                   </Stack>
    //                 </Stack>
    //               </Box>
    //             </m.div>
    //           </Grid>
    //         )}
    //       </Grid>

    //       {/* <Box component={m.div} variants={varFade().inUp} sx={{ pt: 5, textAlign: 'center' }}>
    //         {!mdUp && <HomeNoteSignup sx={{ mt: 5, fontSize: '20px' }} />}
    //         <HomeNoteFind sx={{ fontSize: { xs: '18px', md: '20px' } }} />
    //       </Box> */}
    //     </StyledWrapper>
    //   </Container>

    //   {!mdUp && (
    //     <Box
    //       component={MotionContainer}
    //       sx={{ py: 3, px: 2, bgcolor: 'background.neutral', textAlign: 'center' }}
    //     >
    //       <m.div variants={varFade().inRight}>{renderBody}</m.div>
    //     </Box>
    //   )}
    // </Box>
  );
}
