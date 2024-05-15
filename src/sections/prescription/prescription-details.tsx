'use client';

import { upperCase } from 'lodash';
// @mui
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import DialogContent from '@mui/material/DialogContent';
import { useTheme, alpha } from '@mui/material/styles';
import { useResponsive } from 'src/hooks/use-responsive';

// _mock
import { _hospitals } from 'src/_mock';
// types
import { IPrescriptionItem } from 'src/types/prescription';
// utils
import { fDateTime } from 'src/utils/format-time';
//
import { useAuthContext } from '@/auth/hooks';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: any;
  qr?:any;
  link?:string;
};

// ----------------------------------------------------------------------

export default function PrescriptionDetails({link, /*currentItem*/ currentItem, qr }: Props) {
  // const keyHospital = _hospitals?.filter((_) => _.currentItem === currentItem?.hospitalcurrentItem)[0];
  const { user } = useAuthContext();
  const date = new Date(Number(currentItem?.DATE));
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');
  // const { FNAME = '', MNAME = '', LNAME = ' ' } = ;

  // eslint-disable-next-line no-unsafe-optional-chaining
  let childPres = currentItem?.prescriptions_child || [];

 
  // console.log(childPres, 'HEHE@@@');
  const mobileDetails = (
    <Box
      rowGap={{ md: 3, xs: 1 }}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
      }}
    >
      <div>
        <Typography variant="overline" color="text.disabled">
          Name: 
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {(() => {
            let text: any;

            if (currentItem?.patient?.LNAME || currentItem?.patient?.FNAME) {
              if (currentItem?.patient?.MNAME) {
                text = `${currentItem?.patient?.FNAME} ${currentItem?.patient?.MNAME} ${currentItem?.patient?.LNAME}`;
              } else {
                text = `${currentItem?.patient?.FNAME} ${currentItem?.patient?.LNAME}`;
              }
            } else {
              if (currentItem?.patient?.mname) {
                text = `${currentItem?.patient?.fname} ${currentItem?.patient?.mname} ${currentItem?.patient?.lname}`;
              } else {
                text = `${currentItem?.patient?.fname} ${currentItem?.patient?.lname}`;
              }
            }

            return text;
          })()}
        </Typography>

        <Typography variant="overline" color="text.disabled">
          Phone:
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {currentItem?.patient?.CONTACT_NO || 'Not specified'}
        </Typography>
        <Typography variant="overline" color="text.disabled">
          Gender:
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {currentItem?.patient?.SEX === 1 ? 'Male' : 'Female'}
        </Typography>
      </div>
      <div>
        <Typography sx={{ mb: 1 }} variant="overline" color="text.disabled">
          Hospital/Clinic:
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {currentItem?.clinicInfo?.clinic_name}
        </Typography>

        <Typography variant="overline" color="text.disabled">
          Date issued:
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {currentItem?.DATE && fDateTime(date)}
        </Typography>
      </div>
     
    </Box>
  );

  const downloadQr = () => {
    const link = document.createElement('a');
    link.href = qr;

    link.download = 'Qrcode.png';

    console.log(link,'LINK@@@@@@@')

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const navigateLink= () => {
    if(link){
      window.location.href = link
    }
  }

  return (
    <DialogContent sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        rowGap={{ md: 3, xs: 1 }}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <div>
          {currentItem?.patient?.userInfo[0]?.display_picture[0] ? (
            <Avatar
              alt={user?.displayName}
              src={
                currentItem?.patient?.userInfo?.[0]?.display_picture[0].filename.split('public')[1]
              }
              sx={{
                mx: 'auto',
                width: { xs: 78, md: 128 },
                height: { xs: 78, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {currentItem?.patient?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar
              alt={user?.displayName}
              sx={{
                mx: 'auto',
                width: { xs: 78, md: 128 },
                height: { xs: 78, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              <Avatar sx={{ textTransform: 'capitalize' }}>
                {' '}
                {currentItem?.patient?.FNAME.charAt(0).toUpperCase()}
              </Avatar>
            </Avatar>
          )}
        </div>
        {upMd && (
          <>
            <div>
              <Typography variant="overline" color="text.disabled">
                Name:
              </Typography>
              <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                {(() => {
                  let text: any;

                  if (currentItem?.patient?.LNAME || currentItem?.patient?.FNAME) {
                    if (currentItem?.patient?.MNAME) {
                      text = `${currentItem?.patient?.FNAME} ${currentItem?.patient?.MNAME} ${currentItem?.patient?.LNAME}`;
                    } else {
                      text = `${currentItem?.patient?.FNAME} ${currentItem?.patient?.LNAME}`;
                    }
                  } else {
                    if (currentItem?.patient?.mname) {
                      text = `${currentItem?.patient?.fname} ${currentItem?.patient?.mname} ${currentItem?.patient?.lname}`;
                    } else {
                      text = `${currentItem?.patient?.fname} ${currentItem?.patient?.lname}`;
                    }
                  }

                  return text;
                })()}
              </Typography>

              <Typography variant="overline" color="text.disabled">
                Phone:
              </Typography>
              <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                {currentItem?.patient?.CONTACT_NO || 'Not specified'}
              </Typography>
              <Typography variant="overline" color="text.disabled">
                Gender:
              </Typography>
              <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                {currentItem?.patient?.SEX === 1 ? 'Male' : 'Female'}
              </Typography>
            </div>
            <div>
              <Typography sx={{ mb: 1 }} variant="overline" color="text.disabled">
                Hospital/Clinic:
              </Typography>
              <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                {currentItem?.clinicInfo?.clinic_name}
              </Typography>

              <Typography variant="overline" color="text.disabled">
                Date issued:
              </Typography>
              <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                {currentItem?.DATE && fDateTime(date)}
              </Typography>
              <Stack>
                 <Stack direction="row" alignItems="center">
                  <img src={qr} width="50%" height="50%"/>
                  <Tooltip sx={{mt:1}} title="Download">
                    <img style={{
                      cursor:'pointer'
                    }} onClick={downloadQr} src='/assets/download.svg'/>
                  </Tooltip>
                 </Stack>
                <Box>
                  <Typography variant="body2">Code: {currentItem?.presCode}</Typography>
                  <Typography variant="body2">Unable to scan? <Typography onClick={navigateLink}  variant="body2" sx={{textDecoration:'underline', color:'primary.main', cursor:'pointer'}}>click here to preview</Typography></Typography>
                </Box>
              </Stack>
              {/* {generateQR(``)}https://hip.apgitsolutions.com/dashboard/patient/qrcode/${currentItem?.ID} */}
            </div>
            {/* <div>
             
            </div> */}
          </>
        )}
      </Box>
      {!upMd && mobileDetails}
      <div>
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 1 }} variant="overline" color="text.disabled">
            Prescriptions
          </Typography>
          <Typography variant={!upMd ? 'body2' : 'subtitle2'}>#{currentItem?.ID}</Typography>
        </Box>
        <Stack spacing={1}>
          {childPres?.map((prescription: any, index: any) => {
            index = index + 1;
            return <ItemCard key={index} item={prescription} />;
          })}
        </Stack>
      </div>

      <div>
        <Typography variant="overline" color="text.disabled">
          Remarks:
        </Typography>
        <Typography variant="body2">{currentItem?.REMARKS || 'No records'}</Typography>
      </div>
      <div>
        <Typography variant="overline" color="text.disabled">
          Follow-up Date:
        </Typography>
        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
          {currentItem?.FollowUp || 'No records'}
        </Typography>
      </div>
    </DialogContent>
  );
}

// ----------------------------------------------------------------------

type ItemProps = PaperProps & {
  item: {
    id: string;
    genericName: string;
    brand: string;
    dosage: number;
    form: string;
    quantity: number;
    frequency: number;
    duration: number;
  };
};

function ItemCard({ item }: any) {
  const {
    MEDECINE: genericName,
    MED_BRAND: brand,
    DOSE: dosage,
    FORM: form,
    QUANTITY: quantity,
    FREQUENCY: frequency,
    DURATION: duration,
  } = item;
  const upMd = useResponsive('up', 'md');
  return (


    <Paper
      sx={{
        p: { md: 2, xs: 1 },
        width: 1,
        bgcolor: 'background.neutral',
      }}
    >
      <Typography
        sx={{
          typography: 'subtitle2',
          '& > span': { typography: 'body2', color: 'text.disabled' },
        }}
      >
        {genericName} ({upperCase(brand)})&nbsp;
        <span>
          ({dosage}/{form})
        </span>
      </Typography>

      <Typography
        sx={{
          typography: 'caption',
          fontWeight: 'bold',
          '& > span': { fontWeight: 'normal', color: 'text.disabled' },
        }}
      >
        <span>Qty:&nbsp;</span>
        {quantity}
      </Typography>

      <Typography
        sx={{
          typography: 'caption',
          fontWeight: 'bold',
          '& > span': { fontWeight: 'normal', color: 'text.disabled' },
        }}
      >
        <span>Sig:&nbsp;</span>
        {frequency}x a day ({duration} days)
      </Typography>
    </Paper>
  );
}
