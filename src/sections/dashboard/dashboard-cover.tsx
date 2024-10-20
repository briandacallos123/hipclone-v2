import { useState, useEffect, forwardRef, useRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
// types
import html2canvas from 'html2canvas';
import { IDashboardCover } from 'src/types/fbgGradientgeneral';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import * as Yup from 'yup';
import Image from '@/components/image';
// import Image from 'next/image';
import { bgGradient } from 'src/theme/css';
import { useAuthContext } from '@/auth/hooks';
import { useLazyQuery, useMutation } from '@apollo/client';
import { get_note_vitals_user } from '@/libs/gqls/notes/notesVitals';
import { VitalView } from 'src/sections/vital/view';
import IMG from '../../../public/assets/background/banner-bg.png';
import QRCode from 'qrcode'
// import Image from 'next/image';
import { Checkbox, Container, DialogContent, Drawer, Grid, ListItem, Paper, Tooltip } from '@mui/material';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useBoolean } from '@/hooks/use-boolean';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFUpload,
  RHFSelect,
  RHFCheckbox,
} from 'src/components/hook-form';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fData } from 'src/utils/format-number';
import { renderComponents } from '../doctor/profile/templates';
import { mutateBusinessCard } from '@/libs/gqls/users';
import { LogoFull } from '@/components/logo';
import ProductDetailsCarousel from '../product/product-details-carousel-original';
import DefaultMain from '../doctor/profile/templates/forms/defaultMain';
import DashboardQrView from './dashboardQrView';
import { UPDATE_BUSINESSCARD } from '@/libs/gqls/users';
import Iconify from '@/components/iconify';
import { NAV } from '@/layouts/config-layout';
import Scrollbar from '@/components/scrollbar';
import BannerPreset from 'public/assets/background/BannerPreset';
import BackgroundPalette from 'public/assets/background/backgrounPalette';
// ----------------------------------------------------------------------

export default function DashboardCover({
  uname,
  name,
  avatarUrl,
  job,
  email,
  coverUrl,
  title,
  specialty,
}: IDashboardCover) {
  const theme = useTheme();
  const { user, reInitialize } = useAuthContext();
  const [imgSrc, setImgSrc] = useState(null);


  console.log(imgSrc, 'IMGGGGGGGGGGGGGGG parent!!!!!!!')
  const isDoctor = user?.role === 'doctor';
  const isSecretary = user?.role === 'secretary';
  const linkData = process.env.NEXT_PUBLIC_DOMAIN;
  // console.log(linkData, 'linkData');
  const [copy, setCopy] = useState('Copy Link');
  const handleCopyClick = async () => {
    const linkToCopy = `${linkData}/find-doctor/${uname}/`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopy('Copied');
      setTimeout(() => {
        setCopy('Copy Link');
      }, 3000);
      console.log('Link copied to clipboard:', linkToCopy);
    } catch (err) {
      console.error('Unable to copy link to clipboard', err);
    }
  };
  const upMd = useResponsive('up', 'md');

  // vitals
  const [chartData, setChartData] = useState<any>([]);

  // console.log('@@@@', user);
  const [
    getDataUser,
    { data: dataUser, loading: userloading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(get_note_vitals_user, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });

  function cleanPath(value) {
    // Remove 'public/' or '../' at the start
    const cleaned = value.replace(/^public\/|^\.\.\//, '');

    // Ensure the path starts with 'uploads/' only once
    if (!cleaned.startsWith('uploads/')) {
      return 'uploads/' + cleaned;
    }

    return cleaned;
  }

  useEffect(() => {
    (async () => {

      let imageData: any;

      let hasImg = true;

      let storageFile = user?.photoURL.includes('storage.apgitsolutions');

      if (!(user?.photoURL.includes('storage.apgitsolutions'))) {
        console.log("runnn")
        let fileStore = `${cleanPath(user?.photoURL)}`




        let hasImage = await fetch(`/api/checkFile?filename=public/${fileStore}`);

        let result = await hasImage.json();


        if (result?.exists) {
          console.log(fileStore, 'FILESTOREEEE');

          imageData = `localhost:9092/${fileStore}`;
        } else {
          hasImg = false
        }
      }

      console.log(imageData, 'imageData');

      if (hasImg || storageFile) {

        const response = await fetch('/api/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageData || user?.photoURL
          }),
        });

        if (!response?.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);

        // Clean up object URL on component unmount
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      }


    })()
  }, [user?.id])


  useEffect(() => {
    if (user?.role === 'patient') {
      getDataUser({
        variables: {
          data: {
            uuid: String(user.uuid),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesVitalsUser } = data;
          setChartData(QueryNotesVitalsUser?.vitals_data);
        }
      });
    }
  }, [getDataUser, user?.role, user?.uuid]);

  const [qrImage, setQrImage] = useState(null)

  const generateQR = async (text: any) => {
    try {
      const res = await QRCode.toDataURL(text)
      setQrImage(res)
    } catch (err) {
      console.error(err)
    }
  }
  const [links, setLink] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const link = `https://hip.apgitsolutions.com/find-doctor/${user?.uname}`
      setLink(link)
      await generateQR(link)
    })()
  }, [])
  const componentRef = useRef();
  // const [imgSrc, setImgSrc]: any = useState(null);


  const downloadQr = React.useCallback(async () => {
    // const link = document.createElement('a');

    // if (user?.qrProfile && componentRef.current) {
    //   const canvas = await html2canvas(componentRef.current);
    //   const imgData = canvas.toDataURL('image/png');
    //   setImgSrc(imgData);
    //   link.href = imgData;
    // } else {
    //   link.href = qrImage
    // }

    // link.download = 'Qrcode.png';
    // link.target = '_blank';

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }, [links, user?.qrProfile])

  const openModal = useBoolean();

  const openQRView = useBoolean()

  const openCarousel = useBoolean();

  const isDashboard = true;
  return (
    <Card sx={{ height: { xs: (isDoctor || isSecretary) ? 190 : 100, md: 200 } }}>
    <Box
      sx={{
        ...bgGradient({

        }),
        background: 'url(/assets/background/bg-blueee.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        color: 'common.white',
        display: 'flex',
        justifyContent: 'space-between',
        pb:5
      }}
    >
      {/* <Box>
          <BackgroundPalette/>
      </Box> */}
      <Stack
        direction="row"
        sx={{
          left: 24,
          bottom: { md: 20 },
          zIndex: { md: 10 },
          pt: { xs: 2, md: 0 },
          position: 'absolute',
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            mt: (isDoctor || isSecretary) ? 4 : 8,
            mx: 'auto',
            width: { xs: 60, md: 128 },
            height: { xs: 60, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        />

        {(isDoctor || isSecretary) ? (
          <ListItemText
            sx={{
              mt: { md: 3 },
              ml: { xs: 1.5, md: 3 },
              
            }}
            primary={`${`${name.charAt(0).toUpperCase()}${name.slice(1)}`} - ${title}`}
            secondary={
              <Stack direction="column">
                <Typography variant={upMd ? 'body2' : 'caption'}>{job}</Typography>
                <Typography variant={upMd ? 'body2' : 'caption'}>{email}</Typography>
                <Typography
                  variant={upMd ? 'body2' : 'caption'}
                >{`Specialty: ${specialty}`}</Typography>
                <Typography
                  variant={upMd ? 'body2' : 'caption'}
                >{`Link: ${linkData}/find-doctor/${uname}/`}</Typography>
                <Stack direction="row" sx={{ mt: 1 }} alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ p: 0.5, width: 80, background: 'black', color: 'white' }}
                    onClick={() => handleCopyClick()}

                  >
                    {copy}
                  </Button>
                  <Tooltip title="View QR" sx={{
                    cursor: 'pointer'
                  }}>
                    <Image
                      sx={{
                        cursor: 'pointer',
                        width: 30,
                        height: 30,
                        transition: 'transform 0.3s ease', // Smooth transition effect
                        '&:hover': {
                          transform: 'scale(1.2)', // Enlarge the image to 120% of its original size
                        },
                      }}
                      onClick={openQRView.onTrue}
                      alt="image"
                      src={'/assets/scannerWhite.svg'}
                    />
                  </Tooltip>
                </Stack>
              </Stack>
            }
            primaryTypographyProps={{
              typography: { xs: 'body2', md: 'h4' },
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              color: 'common.white',
              sx: { opacity: 0.78 },
            }}
          />
        ) : (
          <ListItemText
            sx={{
              mt: { md: 13 },
              ml: { xs: 1.5, md: 3 },
              pr: 5,
            }}
            primary={`${name} ${(isDoctor || isSecretary) ? '-' : ''} ${isDoctor ? title : ''}`}
            secondary={
              <Stack direction="column">
                {(isDoctor || isSecretary) && <Typography variant={upMd ? 'body2' : 'caption'}>{job}</Typography>}
                <Typography variant={upMd ? 'body2' : 'caption'}>{email}</Typography>
                {(isDoctor || isSecretary) && (
                  <>
                    <Typography
                      variant={upMd ? 'body2' : 'caption'}
                    >{`Specialty: ${specialty}`}</Typography>
                    <Typography
                      variant={upMd ? 'body2' : 'caption'}
                    >{`Link: ${linkData}/find-doctor/${uname}/`}</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      sx={{ p: 0.5, width: 80 }}
                      onClick={() => handleCopyClick()}
                    >
                      {copy}
                    </Button>
                  </>
                )}
              </Stack>
            }
            primaryTypographyProps={{
              typography: { xs: 'body2', md: 'h4' },
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              color: 'common.white',
              sx: { opacity: 0.78 },
            }}
          />
        )}

        {/* <Box sx={{ bgcolor: 'blue' }}>test</Box> */}


      </Stack>
      {/* <Stack direction="row" sx={{
        position: 'absolute',
        right: 20,
        height: '100%',
        width: { lg: 500 },
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
          {user?.qrProfile ?
            <Image
              src={user?.qrProfile}
              sx={{
                width: '85%',
                height: '90%'
              }}
              onClick={openCarousel.onTrue}
              alt="qr image"
              ref={componentRef}
            />
            :
            <img
              src={qrImage}
              width={200}
              height={120}
              alt="qr image"
            />
          }
        </Box>
        <Stack
          direction="column" justifyContent="center" alignItems="flex-start" gap={1}>
          <Button onClick={openModal.onTrue} variant="outlined">
            Generate
          </Button>

          <Stack>
            <Button sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }} onClick={downloadQr} variant="outlined">
              Download
              <Tooltip title="Download">
                <img style={{
                  cursor: 'pointer',
                  width: '25px'
                }} src='/assets/download-white.svg' />

              </Tooltip>
            </Button>
          </Stack>
        </Stack>
      </Stack> */}

      <DashboardQrView link={qrImage} generate={openModal.onTrue} open={openQRView.value} onClose={openQRView.onFalse} />
      <DashboardCarousel open={openCarousel.value} onClose={openCarousel.onFalse} imageData={user?.qrProfile} />
      <FullScreenDialog userImg={imgSrc} reInitialize={reInitialize} links={links} user={user} link={qrImage} open={openModal.value} onClose={openModal.onFalse} />
    </Box>
  </Card>
  );
}

const DashboardCarousel = ({ open, onClose, imageData }: any) => {

  const imgData = {
    attachmentData: [
      {
        imageData
      }
    ]
  }
  const renderProduct = (
    <>

      <Grid container justifyContent="center" alignItems="center">
        <Grid xs={3} >
          <ProductDetailsCarousel onCloseParent={onClose} openLightbox={true} isSlice={false} product={imgData} />
        </Grid>
      </Grid>
    </>
  );


  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"

    >
      <Box sx={{ m: 2, flex: 1 }}>
        <LogoFull disabledLink />
      </Box>
      <DialogContent sx={{
        mt: { lg: 10 }
      }} >
        <Container maxWidth={'lg'}>
          {renderProduct}

        </Container>
      </DialogContent>
    </Dialog>
  )
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog({ userImg, reInitialize, links, open, onClose, link, user }: any) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [active, setActive] = useState<number | null>(null);
  const [generated, setGenerated] = useState(null);
  const componentRef = useRef();

  const [prevTemplate, setPrevTemplate] = useState(null);



  const [socialsAcc, setSocialsAcc] = useState({ facebook: "", twitter: "" });
  // const {facebook, twitter} = user?.employee_card && JSON.parse(user?.employee_card?.social);
  const [checkedValues, setCheckedValues] = useState({
    name: true,
    email: true,
    contact: true,
    specialty: true,
    profile: true,
    address: true,
    facebook: false,
    twitter: false
  })

  const imgRef = useRef(null);


  const [createMedFunc] = useMutation(mutateBusinessCard, {
    context: {
      requestTrackerId: 'Update_Data[Update_Data_Key]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const defaultValues = React.useMemo(
    () => ({
      avatarUrl: user?.photoURL || '',
      name: user?.displayName || '',
      specialty: user?.occupation,
      profile: links || '',
      email: user?.email || '',
      contact: user?.contact || '',
      address: user?.address || '',
      attachmentDefault: user?.photoUrl || '',
      facebook: socialsAcc?.facebook || '',
      twitter: socialsAcc?.twitter || ""
    }),
    [links, user, socialsAcc?.facebook, socialsAcc?.twitter]
  );

  const lgUp = useResponsive('up', 'lg');

  console.log(lgUp, '')

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const handleSubmitValue = () => { }

  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleChangeBox = (name: string, value) => {
    setCheckedValues({
      ...checkedValues,
      [name]: value
    })
    // if (!value) {
    //   setValue(name, '')
    // }

  }

  useEffect(() => {
    if (!values.profile) {
      setValue('profile', links)
    }
  }, [links, open])


  useEffect(() => {
    if (user?.employee_card) {
      (() => {

        if (user?.employee_card?.template_id) {
          setPrevTemplate(user?.employee_card?.template_id)

        } else {
          setPrevTemplate(1)
        }

        if (user?.employee_card?.social) {
          const { facebook, twitter } = JSON.parse(user?.employee_card?.social);



          setSocialsAcc({
            facebook: facebook || '',
            twitter: twitter || ''
          })
          setCheckedValues({
            ...checkedValues,
            facebook: facebook ? true : false,
            twitter: twitter ? true : false
          })
          setValue('facebook', facebook || '');
          setValue('twitter', twitter || '');

        }


      })()
    }
  }, [user?.employee_card])


  const [imgSrc, setImgSrc]: any = useState(null);

  const upMd = useResponsive('up', 'md');


  function base64ToFile(base64String, filename) {
    // Split the base64 string into its parts
    const [header, base64Data] = base64String.split(',');

    // Determine the MIME type from the header
    const mimeType = header.match(/data:(.*);base64/)[1];

    // Decode base64 string to binary data
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the binary data
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File from the Blob
    const file = new File([blob], filename, { type: mimeType });

    return file;
  }

  const [myFile, setFile] = useState(null);
  const submitBtn = useRef();
  const [negate, setNegate] = useState(false)

  const handleClose = () => {
    onClose();
    reset()
    setActive(null)
  };


  const [createBusinessCard] = useMutation(UPDATE_BUSINESSCARD, {
    context: {
      requestTrackerId: 'CreateBusiness[Merchant_User_Key]',
    },
    notifyOnNetworkStatusChange: true,
  });



  const onSubmit = React.useCallback(
    async (data: any) => {
      console.log(data, 'DATA______________DATA__________________DATAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    },
    []
  );




  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );





  const handleGenerate = React.useCallback(async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current);
      const imgData = canvas.toDataURL('image/png');
      setImgSrc(imgData);

    }
  }, [active]);

  useEffect(() => {
    if (active) {
      handleGenerate()
    }
  }, [active, negate])


  const handleRemoveFile = React.useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
      setValue('attachment', filtered);
    },
    [setValue, values.attachment]
  );

  const handleRemoveAllFiles = React.useCallback(() => {
    setValue('attachment', null)
  }, [setValue]);


  const handleSubmitGenerate = async () => {
    const socials = {
      facebook: checkedValues?.facebook && values?.facebook,
      twitter: checkedValues?.twitter && values?.twitter
    }
    const payload = {
      name: checkedValues?.name && values?.name,
      occupation: checkedValues?.specialty && values?.specialty,
      contact: checkedValues?.contact && values?.contact,
      email: checkedValues?.email && values?.email,
      address: checkedValues?.address && values?.address,
      socials: JSON.stringify(socials),
      template_id: Number(active) || 1
    }
    await createBusinessCard({
      variables: {
        data: {
          ...payload
        }
      }
    }).then((res) => {
      enqueueSnackbar("Created Successfully");
      reInitialize();
      handleClose()
    }).catch((err) => {
      enqueueSnackbar("Something went wrong");
    })


    // const base64String = imgSrc // Your base64 string
    // const filename = 'image.jpg';
    // const file = base64ToFile(base64String, filename);

    // await createMedFunc({
    //   variables: {
    //     file
    //   }
    // }).then((res) => {
    //   enqueueSnackbar("Updated Successfully");
    //   reInitialize();
    //   handleClose()

    // })
  }

  const openNav = useBoolean();

  const RenderContentMain = (
    <Box sx={{
      px: { xs: 1, lg: 2 },
      py: 2
    }}>
      <Stack sx={{ mb: 5, width:'100%'}} direction="row" justifyContent="space-between">
        <Typography>2. Personalize Details</Typography>
        <Stack gap={2} direction="row" alignItems="center">
          <Button onClick={handleClose} variant="outlined">Close</Button>

          <Button onClick={handleSubmitGenerate} variant="contained">Generate</Button>
        </Stack>

        {/* <Button ref={submitBtn} sx={{ display: 'none' }} type="submit">Submit</Button> */}
      </Stack>

      <Stack gap={5}>
        <RHFUploadAvatar
          name="avatarUrl"
          maxSize={3145728}
          onDrop={handleDrop}
          helperText={
            <Typography
              variant="caption"
              sx={{
                mt: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.disabled',
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br /> max size of {fData(3145728)}
            </Typography>
          }
        />

        <Box
          rowGap={{ md: 3, xs: 1 }}
          columnGap={{ md: 2, xs: 1 }}
          display="grid"

        >
          <Stack direction="row" alignItems="center">
            <RHFTextField disabled={!checkedValues?.name} name="name" label="Name" />
            <Checkbox
              checked={checkedValues?.name}
              disabled
              // onChange={(e) => {
              //   handleChangeBox('name', e.target.checked)
              // }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>

          <Stack direction="row" alignItems="center">
            <RHFTextField disabled={!checkedValues?.email} name="email" label="Email" />

            <Checkbox
              checked={checkedValues?.email}
              onChange={(e) => {
                handleChangeBox('email', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" >
            <RHFTextField disabled={!checkedValues?.address} name="address" label="Address" />
            <Checkbox
              checked={checkedValues?.address}
              onChange={(e) => {
                handleChangeBox('address', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />

          </Stack>

          <Stack direction="row" alignItems="center">

            <RHFTextField disabled={!checkedValues?.contact} InputProps={{
              readOnly: true,
            }} name="contact" label="Contact #" />

            <Checkbox
              checked={checkedValues?.contact}
              onChange={(e) => {
                handleChangeBox('contact', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />

          </Stack>

          <Stack direction="row" alignItems="center" >
            <RHFTextField disabled={!checkedValues?.specialty} name="specialty" label="Main Specialty" />
            <Checkbox
              checked={checkedValues?.specialty}
              onChange={(e) => {
                handleChangeBox('specialty', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />

          </Stack>


          <Stack direction="row" alignItems="center" >
            <RHFTextField disabled={!checkedValues?.facebook} name="facebook" label="Facebook" />
            <Checkbox
              checked={checkedValues?.facebook}
              onChange={(e) => {
                handleChangeBox('facebook', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />

          </Stack>

          <Stack direction="row" alignItems="center" >
            <RHFTextField disabled={!checkedValues?.twitter} name="twitter" label="Twitter" />
            <Checkbox
              checked={checkedValues?.twitter}
              onChange={(e) => {
                handleChangeBox('twitter', e.target.checked)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />

          </Stack>



          <Stack direction="row" alignItems="center">
            <RHFTextField disabled={!checkedValues?.profile} InputProps={{
              readOnly: true,
            }} name="profile" label="Public Profile URL" />

          </Stack>

        </Box>

      </Stack>
    </Box>
  )

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',

        },
      }}
    >
      <LogoFull sx={{ mt: 3, ml: 4, mb: 1 }} />

      {RenderContentMain}

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavFooter /> */}
    </Scrollbar>
  );







  return (
    <React.Fragment>
      <Box>
        {openNav.value && <OpenDrawer />}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>


          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}

          >
            <Box sx={{
              width: '100vw',
              background: `url('/assets/background/queue-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'


            }}>
              <AppBar sx={{ position: 'fixed', width: '100%', py: 1, background: { xs: "white", lg: 'none' } }}>
                <Toolbar>
                  <div style={{ position: 'fixed', top: 20, left: 20 }}>
                    <LogoFull />
                  </div>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {/* Sound */}
                  </Typography>
                  <div style={{ position: 'fixed', top: 20, right: 20 }}>


                    {!upMd && <Button onClick={handleClose} variant="contained">Close</Button>}
                    {/* <IconButton
                      edge="start"
                      onClick={handleClose}
                      aria-label="close"
                      sx={{
                        p: 2,
                        background: 'black',
                        color: 'white',
                        '&:hover': {
                          background: '#4c4d4c',
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton> */}
                  </div>

                </Toolbar>
              </AppBar>

              <Box sx={{
                width: { xs: '100%', lg: 1600 },
                margin: '0 auto',
                py: { xs: 10, lg: 4 },
                px: { xs: 0, lg: 8 },
                marginTop: { lg: 10 },
                display: 'flex',
                justifyContent: 'center',


              }}>
                <Grid container justifyContent="space-around" spacing={2} sx={{
                  width: '100%',
                  height: 'auto',
                  // background:'red'
                }}>
                  <Grid sx={{
                    pt: 7
                  }} xs={12} item rowGap={2} lg={7} columnGap={2}>

                    <Paper elevation={12} sx={{
                      width: '100%',
                      px: { xs: 1, lg: 8 },
                      py: 3
                    }}>
                      <Stack gap={2} sx={{ mb: 3 }}>

                        <Typography variant="h4">QR Banners</Typography>
                        <Typography>1. Choose a banners</Typography>
                      </Stack>
                      <Stack sx={{
                        p: 2,
                        px: { lg: 4 },
                        width: '100%',
                        justifyContent: 'center'
                      }}>
                        <Typography sx={{ mb: 2 }} variant="body2" color="gray">*Default Banner</Typography>

                        {!active && prevTemplate && renderComponents?.filter((item) => Number(item?.id) === Number(prevTemplate))?.map(({ component: Component, id }) => {
                          return (
                            <Box sx={{
                              width: { lg: "80%" },
                              height: { lg: '100%' },
                            }}>
                              <Component
                                arr={checkedValues}
                                facebook={values?.facebook}
                                twitter={values?.twitter}
                                ref={id === active ? componentRef : null}
                                email={values?.email}
                                selected={true}
                                contact={values?.contact}
                                address={values?.address}
                                forDownload={generated == id} photo={typeof values?.avatarUrl === 'string' ? values?.avatarUrl : values?.avatarUrl?.preview} link={link} title={"test"} name={values?.name} specialty={values?.specialty}
                              />
                            </Box>
                          )
                        })}
                        {!active && !prevTemplate && <Stack alignItems="center" justifyContent="center" sx={{
                          width: '100%',
                          height: '100%'

                        }}>
                          <Box sx={{
                            width: { xs: '100%', lg: '80%' },
                            height: '100%',
                          }}>
                            <DefaultMain
                              arr={checkedValues}
                              email={values?.email}
                              facebook={values?.facebook}
                              twitter={values?.twitter}
                              contact={values?.contact}
                              address={values?.address}
                              photo={typeof values?.avatarUrl === 'string' ? values?.avatarUrl : values?.avatarUrl?.preview}
                              link={link} title={"test"} name={values?.name} specialty={values?.specialty}
                            />
                          </Box>
                        </Stack>}
                        {active && <Stack alignItems="center" justifyContent="center" sx={{
                          width: '100%',
                          height: '100%'
                        }} >
                          {
                            renderComponents?.filter((item) => Number(item?.id) === Number(active))?.map(({ component: Component, id }) => {
                              return (
                                <Box sx={{
                                  width: { lg: "80%" },
                                  height: { lg: '100%' },
                                }}>
                                  <Component
                                    arr={checkedValues}
                                    facebook={values?.facebook}
                                    twitter={values?.twitter}
                                    ref={id === active ? componentRef : null}
                                    email={values?.email}
                                    selected={true}
                                    contact={values?.contact}
                                    address={values?.address}
                                    forDownload={generated == id} photo={typeof values?.avatarUrl === 'string' ? values?.avatarUrl : values?.avatarUrl?.preview} link={link} title={"test"} name={values?.name} specialty={values?.specialty}
                                  />
                                </Box>
                              )
                            })
                          }
                        </Stack>}

                      </Stack>



                      <Stack sx={{
                        width: '100%'
                      }}>
                        <Typography sx={{ mb: 2, ml: 4 }} variant="body2" color="gray">*Choose template</Typography>
                        <Grid container gap={2} justifyContent={{ xs: 'center', lg: 'flex-start' }}>

                          {renderComponents?.filter((item) => Number(item.id) !== (() => {
                            let target: any;

                            if (active) {
                              target = active
                            } else if (prevTemplate) {
                              target = prevTemplate
                            }
                            return target;
                          })())?.map(({ component: Component, id }) => (
                            <Grid item lg={5} >
                              <ListItemButton onClick={() => {
                                setActive(id)
                                setNegate(!negate)
                              }} sx={{
                                p: 0,
                                m: 0,
                                border: id === active ? '5px solid green' : '',
                              }}>
                                <Component
                                  arr={checkedValues}
                                  facebook={values?.facebook}
                                  twitter={values?.twitter}
                                  ref={id === active ? componentRef : null}
                                  email={values?.email}
                                  contact={values?.contact}
                                  selected={id === active}
                                  address={values?.address}
                                  forDownload={generated == id} photo={typeof values?.avatarUrl === 'string' ? values?.avatarUrl : values?.avatarUrl?.preview} link={link} title={"test"} name={values?.name} specialty={values?.specialty}
                                />
                              </ListItemButton>
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    </Paper>



                  </Grid>
                  <Grid item xs={12} lg={4} sx={{
                    pt: 7
                  }}>
                    <Paper elevation={12} sx={{
                      px: { xs: 1, lg: 3 },
                      py: 1
                    }}>
                      {RenderContentMain}

                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{
                height: '100px',
                width: '100%',
                visibility: 'hidden'
              }}>
                <p>Lorem ipsum dolor sit amet.</p>
              </Box>
            </Box>
          </Dialog>
        </FormProvider>
      </Box>
    </React.Fragment>
  );
}



