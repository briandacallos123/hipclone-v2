'use client';

import { useEffect, useState } from 'react';
// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _userClinic } from 'src/_mock';
import { useResponsive } from 'src/hooks/use-responsive';
//
// import { useLazyQuery } from '@apollo/client';
// import { CLINIT_GET_ONE } from '@/libs/gqls/clinicSched';
import ClinicEditForm from '../clinic/clinic-edit-form';
// ----------------------------------------------------------------------

type Props = {
  id: any;
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  provinces: any;
  // appendData: any;
  // appendDataClient: any;
  // uuid: any;
};

// ----------------------------------------------------------------------

export default function UserClinicEditView({
  id,
  open,
  onClose,
  refetch,
  provinces,
}: // uuid,
// appendData,
// appendDataClient,
Props) {
  const upMd = useResponsive('up', 'md');
  const [Data, setData] = useState(null);

  // const [getData, { data, loading, error }] = useLazyQuery(CLINIT_GET_ONE, {
  //   context: {
  //     requestTrackerId: 'getSchedOne[gSchedOne]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  useEffect(() => {
    // getData({
    //   variables: {
    //     data: {
    //       refId: id,
    //     },
    //   },
    // }).then(async (result: any) => {
    //   const { data } = result;
    //   if (data) {
    //     const { QueryOneClinic } = data;

    //     setData(QueryOneClinic);
    //   }
    // });
    setData(id);
  }, [id]);

  // const currentItem = _userClinic.find((item) => item.id === id);

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 860 },
      }}
    >
      <DialogTitle>Edit Clinic</DialogTitle>

      {/* <ClinicEditForm
        currentItem={Data}
        onClose={onClose}
        uuid={uuid}
        appendDataClient={appendDataClient}
        appendData={appendData}
      /> */}
      {Data && (
        <ClinicEditForm
          currentItem={Data && Data}
          clientSide={id}
          onClose={onClose}
          refetch={refetch}
          provinces={provinces}
          // uuid={uuid}
          // appendDataClient={appendDataClient}
          // appendData={appendData}
        />
      )}
    </Dialog>
  );
}
