import { useEffect } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// theme
import { bgGradient } from 'src/theme/css';
// types
// import { IProduct } from 'src/types/product';
// components
import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Carousel, { CarouselArrowIndex, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

const StyledThumbnailsContainer = styled('div')<{ length: number }>(({ length, theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 'auto'),
  '& .slick-slide': {
    lineHeight: 0,
  },

  ...(length === 1 && {
    maxWidth: THUMB_SIZE * 1 + 16,
  }),

  ...(length === 2 && {
    maxWidth: THUMB_SIZE * 2 + 32,
  }),

  ...((length === 3 || length === 4) && {
    maxWidth: THUMB_SIZE * 3 + 48,
  }),

  ...(length >= 5 && {
    maxWidth: THUMB_SIZE * 6,
  }),

  ...(length > 3 && {
    '&:before, &:after': {
      ...bgGradient({
        direction: 'to left',
        startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
        endColor: `${theme.palette.background.default} 100%`,
      }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
};

export default function ProductDetailsCarousel({ product }: Props) {
  const theme = useTheme();
  console.log(product,'PRODUCT_________')
  // const slides = product?.image?.map((img) => ({
  //   src: img,
  // }));

  const slides = {
    src:`http://localhost:9092/${product?.attachment_info?.file_path?.split('/').splice(1).join('/')}`
  }

  // const slides = product?.map((item:any)=>(
  //   {
  //     src:`http://localhost:9092/${item?.attachment_info?.file_path?.split('/').splice(1).join('/')}`
  //   }
  // ))

  console.log(product,'product_______________________')
  console.log(slides,'slides_______________________')
  // const lightbox = useLightBox(slides);

  const carouselLarge = useCarousel({
    rtl: false,
    draggable: false,
    adaptiveHeight: true,
  });

  // const carouselThumb = useCarousel({
  //   rtl: false,
  //   centerMode: true,
  //   swipeToSlide: true,
  //   focusOnSelect: true,
  //   variableWidth: true,
  //   centerPadding: '0px',
  //   slidesToShow: slides?.length > 3 ? 3 : slides?.length,
  // });

  // useEffect(() => {
  //   carouselLarge.onSetNav();
  //   carouselThumb.onSetNav();
  // }, [carouselLarge, carouselThumb]);

  // useEffect(() => {
  //   if (lightbox.open) {
  //     carouselLarge.onTogo(lightbox.selected);
  //   }
  // }, [carouselLarge, lightbox.open, lightbox.selected]);

  const renderLargeImg = (
    <Box
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        // asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
      >
         <Image
            key={slides.src}
            alt={slides.src}
            src={slides.src}
            // ratio="2/2"
            // onClick={() => lightbox.onOpen(slide.src)}
            sx={{ cursor: 'zoom-in' }}
          />
     
      </Carousel>

  
    </Box>
  );


  return (
    <Box
      sx={{
        '& .slick-slide': {
          float: theme.direction === 'rtl' ? 'right' : 'left',
        },
      }}
    >
      {renderLargeImg}

    </Box>
  );
}
