import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { QueryQueuePatient } from 'src/libs/gqls/queue';
import { notFound, useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { CreateNewStore, QueryAllStore } from 'src/libs/gqls/store';
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';

type Props = {
  skip: Number;
  take: Number;
  requestType?: String;
  ignoreRefetch?: boolean;
};

const storeController = (props: Props = {
  skip: 0,
  take: 5,
  requestType: 'FirstFetch',
  ignoreRefetch: true,
}) => {
  const [tableData, setTableData] = useState([])
  const [manualRefetch, setManualRefetch] = useState(0)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.log(tableData,'TABLE_______________')

  const [createFunc, createResults] = useMutation(CreateNewStore);

  const [queryFunc, queryResults] = useLazyQuery<any>(QueryAllStore, {
    variables: {
      data: {
        skip: props.skip,
        take: props.take,
        // requestType: props?.requestType,
      }
    },
    context: {
      requestTrackerId: 'queryListStore[STORE_LIST_QUERY]',
    },
    // notifyOnNetworkStatusChange: true,
    fetchPolicy:'no-cache'

  });

  useEffect(() => {
    queryFunc().then(async (result) => {
      const { data } = result;

      if (data) {
       const {QueryAllStore} = data;
       setTableData(QueryAllStore)
      }
    });
  }, [manualRefetch]);

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

  return { handleSubmitCreate, tableData }
}

export default storeController