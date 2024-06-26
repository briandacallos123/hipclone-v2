import { useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, { useCallback, useEffect, useState, useReducer } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { QueryQueuePatient } from 'src/libs/gqls/queue';
import { notFound, useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { CreateNewStore, QueryAllStore, DeleteStore } from 'src/libs/gqls/store';
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
      // state.tableData = [...data];
      // state.summary = {...summary}
      // state.totalRecords = totalRecords

      return {...state, tableData:data, summary:{...summary}, totalRecords};
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
  const [deleteFunc, deleteResults] = useMutation(DeleteStore);
  const [queryFunc, queryResults] = useLazyQuery<any>(QueryAllStore, {
    variables: {
      data: {
        skip: table.page * table.rowsPerPage,
        take: table.rowsPerPage,
        status:filters.status,
        name:filters.name
      }
    },
    context: {
      requestTrackerId: 'queryListStore[STORE_LIST_QUERY]',
    },
    notifyOnNetworkStatusChange: true,
 

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
    setLoading(true)
    queryFunc().then(async (result) => {
      const { data } = result;

      if (data) {
       const {QueryAllStore} = data;

       dispatch({
        type:"fill",
        payload:QueryAllStore
       })
       setLoading(false)
      }
    });
  }, [table.page, table.rowsPerPage, filters.status, filters.name, queryResults?.data]);

  const handleSubmitDelete = useCallback(async(model:any)=>{

    try {
      await deleteFunc({
        variables:{
          data:{
            id:Number(model)
          }
        }
      })
      queryResults.refetch()
      enqueueSnackbar("Deleted store successfully")
    } catch (error) {
      
    }
  },[])

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
              days:model.days,
              latitude:model.latitude,
              longitude:model.longitude,
              onlinePayment:model.onlinePayment,
              gcashContact:model.gcashContact
            },
            file: [model.attachment, model.gcashAttachment],
          },
        }).then(async(res)=>{
          enqueueSnackbar("Created store successfully")
          queryResults.refetch()
          
        })

      } catch (error) {
        enqueueSnackbar("Error: ", error)
        console.error(error);
      }
    },
    [createFunc, queryResults]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
    

  return { handleSubmitCreate, handleSubmitDelete, table, filters, setFilters , state,handleFilters, handleFilterStatus, loading}
}

export default storeController