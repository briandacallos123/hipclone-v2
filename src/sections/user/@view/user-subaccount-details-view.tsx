'use client';

// @mui
import { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { YMD } from 'src/utils/format-time';
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
// _mock
import { _userSubaccount } from 'src/_mock';
//
import { useResponsive } from 'src/hooks/use-responsive';
import { useLazyQuery } from '@apollo/client';
import { sub_account_data_by_id } from '@/libs/gqls/sub_accounts';
import SubaccountDetailsList from '../subaccount/subaccount-details-list';

// ----------------------------------------------------------------------

type Props = {
  id: any;
  idlist: any;
  open: boolean;
  onClose: VoidFunction;
};

const defaultFilters = {
  name: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function UserSubaccountDetailsView({ id, idlist, open, onClose }: Props) {
  const [filters, setFilters] = useState(defaultFilters);
  const [data_by_id, setData]:any = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [totalrecords, setTotalrecords] = useState<number>(0);
  const table = useTable();
  const { page, rowsPerPage } = table;
  const upMd = useResponsive('up', 'md');

  // console.log(idlist,"idlistidlistidlistidlist");
  // console.log(totalrecords,"222");

  const [getData, { data, error, loading }]: any = useLazyQuery(sub_account_data_by_id, {
    context: {
      requestTrackerId: 'sub_account_data_by_id[sub_account_data_by_ids]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setData(id);
    (async () => {
      await getData({
        variables: {
          data: {
            id: Number(idlist),
            searchKeyword: filters?.name,
            skip: page * rowsPerPage,
            take: rowsPerPage,
            startDate: YMD(filters?.startDate) || null,
            endDate: YMD(filters?.endDate) || null,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { sub_account_data_by_id } = data;
          setData(sub_account_data_by_id?.sub_account_data_by_ids);
          setTotalrecords(sub_account_data_by_id?.total_records);
          setTableLoading(false)
        }
      });
    })();
  }, [id,filters?.name, page, rowsPerPage, filters?.startDate, filters?.endDate]);

  const handleFilters = useCallback(
    (name: string, value: string) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [filters?.name]
  );

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 1080 },
      }}
    >
      <DialogTitle>Account Information</DialogTitle>

      <SubaccountDetailsList
        loadings={loading}
        currentItem={data_by_id}
        searchKeyword={handleFilters}
        filters={filters}
        table={table}
        totalrecords={totalrecords}
        tableLoading={tableLoading}
        onClose={onClose}
      />
    </Dialog>
  );
}
