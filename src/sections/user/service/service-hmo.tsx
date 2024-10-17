import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// _mock
import { _userService } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserService } from 'src/types/user';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
//
import ServiceHmoEditForm from './service-hmo-edit-form';
import { useQuery } from '@apollo/client';
import { GET_ALL_HMO } from '@/libs/gqls/hmo';
import { useTheme, alpha } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { useResponsive } from '@/hooks/use-responsive';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function ServiceHmo({ tutorialTab, incrementTutsTab }: any) {
  const [user] = useState<IUserService>(_userService);
  const theme = useTheme();

  const openEdit = useBoolean();

  const { loading, data, refetch } = useQuery(GET_ALL_HMO);

  const [tableData, setTableData]: any = useState([]);

  const upMd = useResponsive('up', 'md');

  useEffect(() => {
    if (data) {
      setTableData(data?.Hmo.hmo);
    }
  }, [data]);

  const appendData = (d: any) => {
    // ids from real data
    const allIds = tableData?.map((i: any) => Number(i.id));
    // ids merge with temp data
    const tempIds = d?.hmo?.map((i: any) => Number(i));
    // const remainedData = tempIds?.forEach((i)=>{

    // 1. compare the data, hanapin ano yung nawlang id
    // pag na compare na, re assign yung data holder ng updated na wala na yung data.

    const newItems: any = [];

    // find the new inserted items and push to the new items array;
    tempIds.forEach((i: any) => {
      if (!allIds.includes(i)) {
        newItems.push(i);
      }
    });

    const tempItems: any = [];

    // hinahanap natin sa hmo list yung inadd natin na client data, gine get natin yung values nya
    // data?.Hmo?.HmoList?.filter((i: any) => {
    //   if (newItems.includes(Number(i.id))) {
    //     const tempId = uuidv4();
    //     tempItems.push({ ...i, client: 1, tempId });
    //   }
    // });

    // console.log(tempIds, 'tempIds');

    setTableData((prev) => {
      const items: any = [];
      const ids: any = [];

      data?.Hmo?.HmoList?.forEach((i: any) => {
        tempIds?.forEach((c: any) => {
          if (Number(i.id) === Number(c)) {
            if (!ids.includes(Number(c))) {
              ids.push(Number(c));
              items.push(i);
            }
          }
        });
      });

      const test: any = [];
      // const idsTest: any = [];

      // array of ids
      const prevIds = prev?.map((i) => Number(i.id));

      tempIds?.forEach((c: any) => {
        if (!prevIds.includes(c)) {
          test.push(c);
        }
      });

      return items?.map((i) => {
        if (test.includes(Number(i?.id))) {
          const tempId = uuidv4();

          return { ...i, client: 1, tempId };
        }
        return i;
      });
    });
  };
  // console.log(tableData, 'tableData');

  const onSuccess = (d: any) => {
    setTableData((prev: any) => {
      const targetData: any = [];
      const ids: any = [];
      // pinush natin sa target data yung record na nasa table na nag equal sa response natin.
      prev.forEach((p) => {
        d.CreateHMO?.id?.forEach((c) => {
          if (p.id === c.id) {
            if (!ids.includes(c.id)) {
              ids.push(c.id);
              targetData.push(c);
            }
          }
        });
      });

      // console.log(targetData,/sv@');
      const newData: any = [];
      const targetIds: any = [];

      const test = prev.map((p) => {
        targetData.map((c) => {
          if (p.id === c.id) {
            return (p = c);
          }
          return p;
        });
        return p;
      });

      // prev.forEach((p) => {
      //   targetData?.forEach((c) => {
      //     if (Number(p.id) === Number(c.id)) {
      //       if (!targetIds.includes(Number(c?.id))) {
      //         targetIds.push(c?.id);
      //         console.log('C: ', c);
      //         newData.push(c);
      //       }
      //     } else {
      //       if (!targetIds.includes(p.id)) {
      //         newData.push(p);
      //         targetIds.push(p.id);
      //       }
      //     }
      //   });
      // });

      // this logic is for condition of, if user remove data;

      return test;
    });
  };

  return (
    <>
      <div className={tutorialTab && tutorialTab === 10 ? 'service-fee':''}>
        <Card>
          <CardHeader
            title="HMO Accreditations"
            subheader="HIP is accredited by Cocolife. Updating the accreditation status is between doctor and HMO."
            action={
             <Stack direction={!upMd ? 'column':'row'} gap={2}>
               <Button
                onClick={openEdit.onTrue}
                variant="contained"
                disabled={loading}
                startIcon={<Iconify icon="solar:pen-2-bold" />}
              >
                Configure
              </Button>
              {tutorialTab === 10 && <Button
                onClick={incrementTutsTab}
                variant="outlined"
                disabled={loading}
                startIcon={<Iconify icon="solar:pen-2-bold" />}
              >
                Skip
              </Button>}
             </Stack>
            }
          />

          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
            sx={{ p: 3 }}
          >
            {tableData?.map((i) => (
              <Paper
                key={i.name}
                sx={{
                  p: 3,
                  width: 1,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 2s ease',
                  ...(i.client === 1 && {
                    bgcolor: 'primary.lighter',
                    transition: 'all 300ms ease',
                  }),
                }}
              >
                <Image
                  alt={i.name}
                  src={imgReader(Number(i.id))}
                  sx={{ mr: 2, height: 48, width: 48, borderRadius: 1 }}
                />

                <Typography variant="subtitle1">{i.name}</Typography>
              </Paper>
            ))}
          </Box>
        </Card>
        <ServiceHmoEditForm
        currentItem={data}
        open={openEdit.value}
        refetch={refetch}
        appendData={appendData}
        onClose={openEdit.onFalse}
        onSuccess={onSuccess}
        incrementTutsTab={incrementTutsTab}
      />

      </div>

     
    </>
  );
}

function imgReader(data: number) {
  if (data === 1) return '/assets/icons/hmo/asiancare-health-systems.jpg';
  if (data === 2) return '/assets/icons/hmo/cocolife.jpg';
  if (data === 3) return '/assets/icons/hmo/dynamic-care-corporation.jpg';
  if (data === 4) return '/assets/icons/hmo/eastwest-healthcare.jpg';
  if (data === 5) return '/assets/icons/hmo/health-plan-philippines.jpg';
  if (data === 6) return '/assets/icons/hmo/hmi.jpg';
  if (data === 7) return '/assets/icons/hmo/insular-health-care.jpg';
  if (data === 8) return '/assets/icons/hmo/intellicare.jpg';
  if (data === 9) return '/assets/icons/hmo/kaiser-international-healthgroup.jpg';
  if (data === 10) return '/assets/icons/hmo/life-&-health-hmp.jpg';
  if (data === 11) return '/assets/icons/hmo/maxicare.jpg';
  if (data === 12) return '/assets/icons/hmo/medicard.jpg';
  if (data === 13) return '/assets/icons/hmo/medicare-plus.jpg';
  if (data === 14) return '/assets/icons/hmo/medocare-health-systems.jpg';
  if (data === 15) return '/assets/icons/hmo/metrocare-healthcare-systems.jpg';
  if (data === 16) return '/assets/icons/hmo/optimum-medical-and-healthcare-services.jpg';
  if (data === 17) return '/assets/icons/hmo/pacific-cross-health-care.jpg';
  if (data === 18) return '/assets/icons/hmo/philcare-philhealth-care.jpg';
  return '/assets/icons/hmo/valucare.jpg';
}
