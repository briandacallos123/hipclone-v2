import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { LogoFull } from '@/components/logo';
import { renderComponents } from '../doctor/profile/templates';
import html2canvas from 'html2canvas';
import { useAuthContext } from '@/auth/hooks';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DashboardQrView({ open, link, onClose, generate }: any) {
  const { user } = useAuthContext();
  const { address, contact, email, name, occupation, template_id } = user?.employee_card;

  const [checkedValues, setCheckedValues] = React.useState({
    name: true,
    email: true,
    contact: true,
    specialty: true,
    profile: true,
    address: true,
    facebook: user?.social?.facebook ? true : false,
    twitter: user?.social?.twitter ? true : false,
  });

  const handleClose = () => {
    onClose();
  };

  const handleDownload = () => {
    const element = document.getElementById('downloadable-content');

    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'content-image.png'; // Set the file name here
        link.click();
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <div style={{ position: 'absolute', top: 20, left: 20 }}>
              <LogoFull />
            </div>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{
          width: 800,
          margin: '0 auto',
          pt: 10,
          height: '100%',
        }}>
          <Stack justifyContent="flex-end" direction="row" gap={2} sx={{
            width: '100%',
            mb: 2
          }}>
            <Button sx={{}} onClick={generate} variant="outlined">
              Generate
            </Button>
            <Button sx={{}} variant="contained" onClick={handleDownload}>
              Download
            </Button>
          </Stack>

          <Box id="downloadable-content" sx={{
            width: "100%",
          }}>
            {renderComponents?.filter((item) => Number(item?.id) === Number(template_id))?.map(({ component: Component, id }) => {
              return (
                <Box key={id} sx={{
                  width: "100%",
                  height: '100%'
                }}>
                  <Component
                    isSelected={true}
                    arr={checkedValues}
                    email={email}
                    selected={true}
                    contact={contact}
                    address={address}
                    photo={user?.photoURL} link={link} title={"test"} name={name} specialty={occupation}
                  />
                </Box>
              )
            })}
          </Box>

        </Box>
      </Dialog>
    </React.Fragment>
  );
}
