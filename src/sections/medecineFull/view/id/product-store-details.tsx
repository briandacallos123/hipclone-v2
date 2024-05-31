// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  rating: number;
  postedAt: Date | string | number;
  tags: string[];
};

type ReviewItemProps = {
  item: ItemProps;
};

export default function ProductStoreDetails({ item }: ReviewItemProps) {
  const { img_path, name, address, description } = item;

  const img = img_path && `http://localhost:9092/${img_path?.split('/').splice(1).join('/')}`

  return (
    <Stack
      spacing={2}
      sx={{
        p: 3,
        position: 'relative',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={name} src={img} sx={{ width: 48, height: 48 }} />

        <ListItemText
          primary={name}
          secondary={address}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            mt: 0.5,
            color: 'text.disabled',
          }}
        />
      </Stack>

      <Rating value={10} size="small" readOnly precision={0.5} />

      <Typography variant="body2">{description}</Typography>

      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {/* {tags.map((tag) => (
          <Chip size="small" variant="soft" key={tag} label={tag} />
        ))} */}
      </Stack>
    </Stack>
  );
}
