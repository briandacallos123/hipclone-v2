'use client';

// @mui
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _userSubaccount } from 'src/_mock';
//
import { useResponsive } from 'src/hooks/use-responsive';
import HmoEditForm from '../hmo-edit-form';
import { useLazyQuery } from '@apollo/client';
import { Get_Hmo_Claim_By_Id } from '@/libs/gqls/hmoClaims';

// ----------------------------------------------------------------------

type Props = {
  id?: any;
  open: boolean;
  onClose: VoidFunction;
  refetch?: any;
};

// ----------------------------------------------------------------------

export default function HmoDetailsView({ id, open, onClose, refetch }: Props) {
  const upMd = useResponsive('up', 'md');

  const [data_by_id, setData] = useState(null);

  const [getData, { data, error, loading }]: any = useLazyQuery(Get_Hmo_Claim_By_Id, {
    context: {
      requestTrackerId: 'Get_Hmo_Claim_By_Id[hmo_claims]',
    },
    notifyOnNetworkStatusChange: true,
  });
  // console.log(id,'ídto@@')

  useEffect(() => {
    setData(id);
    (async () => {
      await getData({
        variables: {
          data: {
            id: Number(id?.id),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { Get_Hmo_Claim_By_Id } = data;
          setData(Get_Hmo_Claim_By_Id?.hmo_claims_data_by_id);
          // console.log(Get_Hmo_Claim_By_Id?.hmo_claims_data_by_id,'galing database')
        }
      });
    })();

    //}
  }, [id?.id]);

  // const currentItem = _userSubaccount.find((item) => item.id === id);

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>HMO Claim Details</DialogTitle>

      <HmoEditForm
        currentItem={data_by_id && data_by_id}
        clientside={id && id}
        onClose={onClose}
        refetch={refetch}
      />
    </Dialog>
  );
}
