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
import Image from '@/components/image';
// import domtoimage from 'dom-to-image';
import Main from '../doctor/profile/templates/forms/main'
import { Paper } from '@mui/material';
import canvg from 'canvg';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DashboardQrView({ open, link, onClose, generate }: any) {
  const { user } = useAuthContext();
  const { address, contact, email, name, occupation, template_id } = user?.employee_card;
  const element = React.useRef()

  const [socials, setSocials] = React.useState({ facebook: "", twitter: "" });

  // console.log(socials,'SOCIALSSSSSSSSS SA MAIN!!!!!!!!')

  React.useEffect(() => {
    if (user?.employee_card && user?.employee_card?.social) {
      const data = JSON.parse(user?.employee_card?.social);
      setSocials({
        facebook: data?.facebook,
        twitter: data?.twitter
      })
    }
  }, [user])

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

  const handleDownload = async () => {


    if (element.current) {
      html2canvas(element.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'content-image.png'; // Set the file name here
        link.click();
      });
    }
  };

  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: user?.photoURL
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);

        // Clean up object URL on component unmount
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    })();
  }, [user?.photoURL]);

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


        <Paper sx={{
          width: { xs: '100%', lg: 1100 },
          margin: '0 auto',
          marginTop: 10,
          height: 'auto',
          // p: { xs: 5, lg: 3 }
          py:{
            xs:5,
            lg:5
          }
        }} elevation={12}>
          <Stack justifyContent="flex-end" direction="row" gap={2} sx={{
            width: '100%',
            mb: 5,
            pr:10
          }}>
            <Button sx={{}} onClick={generate} variant="outlined">
              Generate
            </Button>
            <Button sx={{}} variant="contained" onClick={handleDownload}>
              Download
            </Button>
          </Stack>

          <Paper elevation={12}
          sx={{
            width: { xs: '100%', lg: 700 },
            p: { xs: 5, lg: 3 },
            margin:'0 auto',
            marginBottom:10
          }}>
            <Box sx={{
              width: "100%",
            }}>
              {name ? renderComponents?.filter((item) => Number(item?.id) === Number(template_id))?.map(({ component: Component, id }) => {
                return (
                  <Box key={id} sx={{
                    width: "100%",
                    // height: '100%'
                  }}>
                    <Component
                      ref={element}
                      isSelected={true}
                      arr={checkedValues}
                      email={email}
                      facebook={socials?.facebook}
                      twitter={socials?.twitter}
                      selected={true}
                      contact={contact}
                      address={address}
                      photo={imgSrc} link={link} title={"test"} name={name} specialty={occupation}
                    />
                  </Box>
                )
              }) :
                <>
                  <Main
                    isSelected={true}
                    ref={element}
                    arr={checkedValues}
                    email={user?.email}
                    facebook={socials?.facebook}
                    twitter={socials?.twitter}
                    selected={true}
                    contact={user?.contact}
                    address={user?.address}
                    photo={imgSrc} link={link} title={"test"} name={user?.displayName} specialty={user?.occupation}
                  />
                </>
              }
            </Box>
          </Paper>
        </Paper>

      </Dialog>
    </React.Fragment>
  );
}
