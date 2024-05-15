'use client';

// @mui
import { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { YMD } from 'src/utils/format-time';
// _mock
import { _userSubaccount } from 'src/_mock';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { useResponsive } from 'src/hooks/use-responsive';
import SubaccountEditForm from '../subaccount/subaccount-edit-form';
import SubaccountDetailsList from '../subaccount/subaccount-details-list';
import { useLazyQuery } from '@apollo/client';
import { sub_account_data_by_id } from '@/libs/gqls/sub_accounts';

// ----------------------------------------------------------------------

type Props = {
  id: any;
  open: boolean;
  onClose: VoidFunction;
  refetch: any;
  isLoading: any;
  setLoading: any;
};

// ----------------------------------------------------------------------

export default function UserSubaccountEditView({
  isLoading,
  setLoading,
  id,
  open,
  onClose,
  refetch,
}: Props) {
  // const currentItem = _userSubaccount.find((item) => item.id === id);

  const [data_by_id, setData] = useState(null);

  // console.log(data_by_id,"wwwwwsssss");
  // console.log(id,"wwwwwssss2222222s");
  // console.log(totalrecords,"222");
  // console.log("test", id)

  const [getData, { data, error, loading }]: any = useLazyQuery(sub_account_data_by_id, {
    context: {
      requestTrackerId: 'sub_account_data_by_id[sub_account_data_by_ids]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (id) {
      setData(id);
    }
    // setData(id);
    // (async()=>{
    //  await getData({
    //     variables: {
    //       data: {
    //         id: Number(id?.id),
    //       },
    //     },
    //   }).then(async (result: any) => {
    //     const { data } = result;
    //     if (data) {
    //       const { sub_account_data_by_id } = data;
    //       setData(sub_account_data_by_id?.sub_account_data_by_ids);
    //     }
    //   });
    // })()
  }, [id]);
  const upMd = useResponsive('up', 'md');
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
      <DialogTitle>Edit Permissions</DialogTitle>

      {data_by_id && (
        <SubaccountEditForm
          isLoading={isLoading}
          setLoading={setLoading}
          currentItem={data_by_id && data_by_id}
          clientside={id}
          refetch={refetch}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}
