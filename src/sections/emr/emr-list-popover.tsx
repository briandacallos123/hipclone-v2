import { useCallback } from 'react';
import { capitalize } from 'lodash';
// @mui
import { Theme, styled, alpha, SxProps } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _patientList } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hook';
// types
import { IPatientItem } from 'src/types/patient';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  backgroundColor: alpha(theme.palette.grey[900], 0.48),
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
  },
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const PaperStyle = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  border: '2px solid transparent',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  background: theme.palette.background.neutral,
  transition: theme.transitions.create(['border'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    border: `2px solid ${theme.palette.primary.light}`,
  },
}));

// ----------------------------------------------------------------------

export default function EmrListPopover() {
  const params = useParams();

  const { id } = params;

  const popover = usePopover();

  const currentIndex = _patientList.indexOf(_patientList.filter((item) => item.id === id)[0]);

  return (
    <>
      <StyledIconButton onClick={popover.onOpen} sx={{ width: 32, height: 32 }}>
        <Iconify icon="eva:menu-fill" />
      </StyledIconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        hiddenArrow
        sx={{ mt: 1, width: 500 }}
      >
        <Stack spacing={1}>
          {_patientList
            .filter((_: any, index: any) => index >= currentIndex && index < currentIndex + 3)
            .map((item: any) => (
              <CarouselItem key={item.id} item={item} />
            ))}
        </Stack>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: IPatientItem;
  sx?: SxProps<Theme>;
};

function CarouselItem({ item, sx }: CarouselItemProps) {
  const { id, patient } = item;

  const router = useRouter();

  const fullName = `${patient.firstName} ${patient.lastName}`;

  const info = `${capitalize(patient.gender)}, ${patient.age} yr(s) old`;

  const handleNavigate = useCallback(
    (newId: string) => {
      router.push(paths.dashboard.patient.view(newId));
    },
    [router]
  );

  return (
    <PaperStyle onClick={() => handleNavigate(id)} sx={{ ...sx }}>
      <Avatar alt={fullName} src={patient.avatarUrl} sx={{ mr: 1 }} />

      <ListItemText
        primary={fullName}
        secondary={info}
        primaryTypographyProps={{ typography: 'subtitle2' }}
        secondaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
    </PaperStyle>
  );
}
