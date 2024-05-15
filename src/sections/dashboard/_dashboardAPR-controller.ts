import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
// gqls
import { GET_APPT_TODAY_NEW } from '@/libs/gqls/drappts';
// components
import { useAuthContext } from '@/auth/hooks';
import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';

export default function ApprovedController() {
  const table = useTable();

  const { enqueueSnackbar } = useSnackbar();

  const [allData, setAllData] = useState<any[]>([]);

  const [tableData, setTableData] = useState<any[]>([]);

  const [tableSummary, setTableSummary] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const defaultFilters = {
    name: '',
  };
  const { user } = useAuthContext();
  const userType = user?.role;

  const [filters, setFilters] = useState(defaultFilters);

  //   const [queryFunc, queryResults] = useLazyQuery(PAYROLL_ADVANCE_ALL, {
  //     context: {
  //       requestTrackerId: 'advance_salaries[payrollAdvanceQuery]',
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   });

  const { data, loading, refetch }: any = useQuery(GET_APPT_TODAY_NEW, {
    context: {
      requestTrackerId: 'advance_salaries[payrollAdvanceQuery]',
    },
    fetchPolicy: 'cache-first',
    variables: {
      data: {
        userType: String(userType),
        skip: table.page * table.rowsPerPage,
        take: table.rowsPerPage,
        searchKeywordAPR: filters?.name,
      },
    },
  });

  useEffect(() => {
    if (data) {
      const { todaysAPRNew } = data;
      setTableData(todaysAPRNew?.appointData);
      setTableSummary(todaysAPRNew?.totalAPR);
      setLoading(false);
    }
  }, [filters, table.page, table.rowsPerPage, table.order, table.orderBy, data]);

  return {
    table,
    allData,
    setAllData,
    tableData,
    setTableData,
    tableSummary,
    setTableSummary,
    //
    filters,
    setFilters,
    defaultFilters,
    refetch,
    //
    loading,
  };
}
