import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { QueryQueuePatient } from 'src/libs/gqls/queue';
import { notFound, useRouter } from 'next/navigation';
import { QueryAllMedecineByStore } from '@/libs/gqls/Orders';
import { DeleteMerchantMedicine } from '@/libs/gqls/merchantUser';
import { paths } from '@/routes/paths';
import { CreateNewStore, QueryAllStore, UpdateStore } from 'src/libs/gqls/store';
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';


type Props = {
  skip: Number;
  take: Number;
  setFeedData?: any | Function | void;
  requestType?: String;
  ignoreRefetch?: boolean;
  
};

const defaultFilters = {
  name: '',
  status: -1,
  type: '',
  startDate: null,
  endDate: null,
  startingPrice: null,
  endPrice: null,
  sort:""
};


const StoreManageController = (
  props: Props = {
    skip: 0,
    take: 5,
    setFeedData: () => void 0,
    // requestType: 'FirstFetch',
    ignoreRefetch: true,
  }
) => {
  
  const [tableData, setTableData] = useState([])
  const [manualRefetch, setManualRefetch] = useState(0)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const params = useParams();
  const [loading, setLoading] = useState(false)
  const [filters, setFilters]: any = useState(defaultFilters);
  const [updateFunc, createResults] = useMutation(UpdateStore);
  const [deleteFunc, deleteResults] = useMutation(DeleteMerchantMedicine);
  
  const [queryFunc, queryResults] = useLazyQuery<any>(QueryAllMedecineByStore, {
    variables: {
      data: {
        skip: props.skip,
        take: props.take,
        store_id:Number(params?.id),
        
        search: filters.name,
        startPrice: Number(filters.startingPrice),
        endPrice: Number(filters.endPrice),
        sort:filters.sort
      }
    },
    context: {
      requestTrackerId: 'queryListStore[STORE_LIST_QUERY]',
    },
    notifyOnNetworkStatusChange: true,

  });
  const handleFilters = useCallback(
    (name: string, value: any) => {
        setFilters((prevState: any) => {

            return {
                ...prevState,
                [name]: value,
            }
        });
    },
    []
);

  useEffect(() => {
    queryFunc().then(async (result) => {
      const { data } = result;

      // console.log(data,'DATAKOOOOOOOOOOOOOOOOOOO')
      if (data) {
        // await new Promise(resolve => setTimeout(resolve, 4000))
        const {QueryAllMedecineByStore} = data;
        setTableData(QueryAllMedecineByStore?.MedicineType)
      }
    });
  }, [queryResults?.data]);

  const handleSubmitDelete = useCallback(
    async (model: any) => {
      console.log(model,'MODELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL')
      try {
        await deleteFunc({
          variables: {
            data: {
              id:model
            },
          },
        }).then(async(res)=>{
          queryResults.refetch()
          enqueueSnackbar("Deleted successfully")
        })
      } catch (error) {
        console.error(error);
      }
    },
    [deleteFunc]
  );

  const handleSubmitUpdate = useCallback(
    async (model: any) => {
      try {
        await updateFunc({
          variables: {
            data: {
              id:model?.id,
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
          enqueueSnackbar("Updated successfully")
        })
      } catch (error) {
        console.error(error);
      }
    },
    [updateFunc]
  );

  // const handleSubmitCreate = useCallback(
  //   async (model: any) => {

  //     console.log(model,'MODEL______________________')

  //     try {
  //       await createFunc({
  //         variables: {
  //           data: {
  //             name: model.storeName,
  //             address: model.storeAdd,
  //             description: model.description,
  //             delivery: model.delivery,
  //             startTime: model.startTime,
  //             endTime: model.endTime,
  //             product_types:model.product_types.join(', ')
              
  //           },
  //           file: model.attachment,
  //         },
  //       }).then(async(res)=>{
  //         enqueueSnackbar("Created store successfully")
  //         setManualRefetch((prev)=>{
  //           return prev + 1;
  //         })
  //       })

  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [createFunc]
  // );

  return { filters, tableData,queryResults, handleSubmitUpdate, handleSubmitDelete, handleFilters}
}

export default StoreManageController
