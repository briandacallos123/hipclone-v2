// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

type Props = {
  data: any;
  Others: any;
  FEES: any;
  MEDCERT_FEE: any;
  MEDCLEAR_FEE: any;
  MEDABSTRACT_FEE: any;
  AddRequest: any;
};

// ----------------------------------------------------------------------

export default function AppointmentDetailsComplaint({
  data,
  Others,
  FEES,
  MEDCERT_FEE,
  MEDCLEAR_FEE,
  MEDABSTRACT_FEE,
  AddRequest,
}: Props) {
  const totalTF = (type: any) => {
    const tf: any = [
      parseFloat(MEDCERT_FEE),
      parseFloat(MEDCLEAR_FEE),
      parseFloat(MEDABSTRACT_FEE),
    ];
    let total = 0.0;
    type.map((t: any) => {
      tf.map((v: any, k: any) => {
        if (Number(t) === Number(k + 1)) {
          total += v;
        }
      });
    });

    return (total + parseFloat(FEES)).toFixed(2);
  };
  const upMd = useResponsive('up', 'md');

  return (
    <Box
      gap={{ md: 2, xs: 0.2 }}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <Card>
        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Chief Complaints</Typography>}
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
        />

        <Box sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          {data?.length > 0 ? (
            data.map((item: any) => (
              <Typography key={item} variant={!upMd ? 'body2' : 'body1'}>
                •&nbsp; {item}
              </Typography>
            ))
          ) : (
            <Typography variant={!upMd ? 'body2' : 'body1'}>No records found.</Typography>
          )}
        </Box>
      </Card>

      <Card>
        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Others</Typography>}
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
        />

        <Box sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          <Typography key={Others} variant={!upMd ? 'body2' : 'body1'}>
            {Others ? `• ${Others}` : 'No records found.'}
          </Typography>
        </Box>
      </Card>

      <Card>
        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Additional Request</Typography>}
          subheader={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              (Request not covered by HMO will be charged to patient)
            </Typography>
          }
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
        />

        <Box sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          <Stack>
            {AddRequest?.length > 0 ? (
              AddRequest.map((item: any) => (
                <Typography key={item} variant={!upMd ? 'caption' : 'body1'}>
                  •&nbsp;
                  {item === 1 ||
                    (item === '1' && ` MEDICAL CERTIFICATE [ ₱ ${MEDCERT_FEE} ]`) ||
                    ''}
                  {item === 2 || (item === '2' && ` MEDICAL CLEARANCE [ ₱ ${MEDCLEAR_FEE} ]`) || ''}
                  {item === 3 ||
                    (item === '3' && ` MEDICAL ABSTRACT [ ₱ ${MEDABSTRACT_FEE} ]`) ||
                    ''}
                </Typography>
              ))
            ) : (
              <Typography variant={!upMd ? 'body2' : 'body1'}>No records found.</Typography>
            )}
          </Stack>
        </Box>
      </Card>

      <Card>
        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Professional Fee</Typography>}
          subheader={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              (Not applicable for HMO consultations)
            </Typography>
          }
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
        />

        <Box sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          <Typography key={FEES} variant={!upMd ? 'body2' : 'body1'}>
            ₱ {FEES}
          </Typography>
        </Box>

        <CardHeader
          title={<Typography variant={!upMd ? 'subtitle1' : 'h6'}>Total Amount Due</Typography>}
          sx={{ pb: { md: 1, xs: 0.1 }, pt: { md: 2, xs: 1 }, px: { md: 2, xs: 0.9 } }}
        />

        <Box sx={{ pt: { md: 0, xs: 0.2 }, px: { md: 2, xs: 1.5 }, pb: { md: 2, xs: 0.5 } }}>
          <Typography key={AddRequest} variant={!upMd ? 'body2' : 'body1'}>
            {AddRequest?.length > 0 ? (
              <Typography key="totalTF_" variant={!upMd ? 'body2' : 'body1'}>
                {`₱ ${totalTF(AddRequest)}`}
              </Typography>
            ) : (
              <Typography variant={!upMd ? 'body2' : 'body1'}>{`₱ ${parseFloat(FEES).toFixed(
                2
              )}`}</Typography>
            )}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

// {(item === 1 ? MEDCERT_FEE : 0) + (FEES ? FEES : 0) + (item === 2  ? MEDCLEAR_FEE : 0) + (item === 3 ? MEDABSTRACT_FEE : 0)
// }
