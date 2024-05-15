// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { useState } from 'react';
// ----------------------------------------------------------------------

const STEPS = [
  { step: 1, label: 'Find your doctor', icon: 'material-symbols:person-search-rounded' },
  { step: 2, label: 'View profile', icon: 'material-symbols:frame-person-rounded' },
  { step: 3, label: 'Book an appointment', icon: 'material-symbols:bookmark-add-rounded' },
];

// ----------------------------------------------------------------------

type FindStepsProps = {
  view?:String;
  handleChange?:any;
}

export default function AppointmentFindSteps({view, handleChange}:FindStepsProps) {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const carousel = useCarousel({
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    initialSlide: 0,
  });

  // if (!upMd) {
  //   return (
  //     <Box>
  //       <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
  //         Discover the online appointment!
  //       </Typography>

  //       <Box sx={{ position: 'relative' }}>
  //         {/* <CarouselArrows
  //           filled
  //           icon="solar:alt-arrow-right-bold"
  //           onNext={carousel.onNext}
  //           onPrev={carousel.onPrev}
  //           leftButtonProps={{ sx: { left: 0 } }}
  //           rightButtonProps={{ sx: { right: 0 } }}
  //         >
  //           <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
  //             {STEPS.map((item) => (
  //               <Box key={item.step} sx={{ px: 2 }}>
  //                 <Card
  //                   sx={{
  //                     width: 1,
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                     p: 2,
  //                     pl: 3,
  //                     bgcolor: 'background.neutral',
  //                   }}
  //                 >
  //                   <div>
  //                     <Typography variant="h5">{item.label}</Typography>

  //                     <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
  //                       Step&nbsp; {item.step}
  //                     </Typography>
  //                   </div>

  //                   <Iconify
  //                     icon={item.icon}
  //                     sx={{
  //                       width: { xs: 80, md: 120 },
  //                       height: { xs: 80, md: 120 },
  //                       lineHeight: 0,
  //                       opacity: 0.3,
  //                     }}
  //                   />
  //                 </Card>
  //               </Box>
  //             ))}
  //           </Carousel>
  //         </CarouselArrows> */}
  //         <Stack
  //           direction="row"
  //           spacing={4}
  //           justifyContent="space-between"
  //           alignItems="center"
  //           sx={{
  //             p: 2,
  //             bgcolor: 'background.neutral',
  //           }}
  //         >
  //           {STEPS.map((item) => (
  //             <Stack direction="column" justifyContent="center" alignItems="center" key={item.step}>
  //               <Iconify
  //                 icon={item.icon}
  //                 sx={{
  //                   width:43,
  //                   height:43,
  //                   lineHeight: 0,
  //                   opacity: 0.3,
  //                 }}
  //               />
  //               <div>
  //                 <Typography variant="body2" sx={{textAlign: 'center',  fontSize: '10px'}}>
  //                   {item.label}
  //                 </Typography>

  //                 <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '12px' }}>
  //                   Step&nbsp; {item.step}
  //                 </Typography>
  //               </div>
  //             </Stack>
  //           ))}
  //         </Stack>
  //       </Box>
  //     </Box>
  //   );
  // }



  return (
    <Stack direction="row" spacing={2} textAlign="center" justifyContent="flex-end">
       <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChange}
        >
            <ToggleButton value="row" aria-label="quilt">
              <FormatAlignJustifyIcon />
          </ToggleButton>
          <ToggleButton value="column" aria-label="module">
            <ViewModuleIcon />
          </ToggleButton>
        
    </ToggleButtonGroup>
    </Stack>
    // <Box>
    //   <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
    //     Discover the online appointment!
    //   </Typography>

    //   <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
    //     {STEPS.map((item) => (
    //       <Card
    //         key={item.step}
    //         sx={{
    //           width: 1,
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'space-between',
    //           p: 2,
    //           pl: 3,
    //           bgcolor: 'background.neutral',
    //         }}
    //       >
    //         <div>
    //           <Typography variant="h5">{item.label}</Typography>

    //           <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
    //             Step&nbsp; {item.step}
    //           </Typography>
    //         </div>

    //         <Iconify
    //           icon={item.icon}
    //           sx={{
    //             width: { xs: 80, md: 120 },
    //             height: { xs: 80, md: 120 },
    //             lineHeight: 0,
    //             opacity: 0.3,
    //           }}
    //         />
    //       </Card>
    //     ))}
    //   </Stack>
    // </Box>
  );
}
