import { useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, { useCallback, useEffect, useState, useReducer } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { QueryQueuePatient } from 'src/libs/gqls/queue';
import { notFound, useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { CreateNewStore, QueryAllStore } from 'src/libs/gqls/store';
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';
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

type Props = {
  skip: Number;
  take: Number;
  requestType?: String;
  ignoreRefetch?: boolean;
};

const reducer = (state:any, action:any) => {

  switch(action.type){

    case "fill":
      const {data, summary, totalRecords} = action.payload;
      state.tableData = [...data];
      state.summary = {...summary}
      state.totalRecords = totalRecords

      return state;
  }
}

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
};


const initialState = {
  tableData:[],
  summary:{
    active:null,
    inactive:null
  },
  totalRecords:null
}

const storeController = (props: Props = {
  skip: 0,
  take: 5,
  requestType: 'FirstFetch',
  ignoreRefetch: true,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // const [tableData, setTableData] = useState([])
  // const [summary, setSummary] = useState(null)
  // const [totalRecords]
  const [manualRefetch, setManualRefetch] = useState(0)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)

  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

  const [filters, setFilters]: any = useState(defaultFilters);


  const [createFunc, createResults] = useMutation(CreateNewStore);

  const [queryFunc, queryResults] = useLazyQuery<any>(QueryAllStore, {
    variables: {
      data: {
        skip: table.page * table.rowsPerPage,
        take: table.rowsPerPage,
        status:filters.status
      }
    },
    context: {
      requestTrackerId: 'queryListStore[STORE_LIST_QUERY]',
    },
    // notifyOnNetworkStatusChange: true,
    fetchPolicy:'no-cache'

  });

  const handleFilters = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFilters((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  useEffect(() => {
    queryFunc().then(async (result) => {
      const { data } = result;

      if (data) {
        // console.log(data,'DATA_______________________')
       const {QueryAllStore} = data;

       dispatch({
        type:"fill",
        payload:QueryAllStore
       })
       setLoading(false)
      }
    });
  }, [table.page, table.rowsPerPage, filters.status]);

  const handleSubmitCreate = useCallback(
    async (model: any) => {


      try {
        await createFunc({
          variables: {
            data: {
              name: model.storeName,
              address: model.storeAdd,
              description: model.description,
              delivery: model.delivery,
              startTime: model.startTime,
              endTime: model.endTime,
              product_types:model.product_types.join(', '),
              days:model.days
            },
            file: model.attachment,
          },
        }).then(async(res)=>{
          enqueueSnackbar("Created store successfully")
          setManualRefetch((prev)=>{
            return prev + 1;
          })
        })

      } catch (error) {
        console.error(error);
      }
    },
    [createFunc]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
    

  return { handleSubmitCreate, table , state, handleFilterStatus, loading}
}

export default storeController