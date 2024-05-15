
import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import {QueryQueuePatient} from 'src/libs/gqls/queue';



const QueueController = () => {
    const [data, setData] = useState([]);

    const [getData] = useLazyQuery(QueryQueuePatient, {
        context: {
            requestTrackerId: 'getQueuesApr[Apt-Dash-queue]',
        },
        notifyOnNetworkStatusChange: true,
      });

    const QueryQueue = useCallback(async(id:String) => {
        getData({
            variables: {
                    data: {
                    // userType: "patient",
                    // skip: 0,
                    // take: 10,
                    uuid: id,
                    // status: 1,
                    // searchKeyword: filters.name,
                    // orderBy,
                    // orderDir: order,
                    // type: filters?.status,
                },
            },
          }).then(async (result: any) => {
            const {data} = result;

            console.log(data)
            // setLoading(false);
            // const { data } = result;
            // if (data) {
            //   const { QueryHmoByUUID } = data;
            //   setHmoData(QueryHmoByUUID);
            // }
          });
    },[])

    // const {
    //     data: dataLock,
    //     loading: tableLoading,
    //     refetch,
    //   }: any = (GET_QUEUES, {
    //     context: {
    //       requestTrackerId: 'getQueuesApr[Apt-Dash-queue]',
    //     },
    //     // fetchPolicy: 'cache-first',
    //     variables: {
    //       data: {
    //         userType: "patient",
    //         // skip: page * rowsPerPage,
    //         // take: rowsPerPage,
    //         uuid: id,
    //         status: 1,
    //         // searchKeyword: filters.name,
    //         // orderBy,
    //         // orderDir: order,
    //         // type: filters?.status,
    //       },
    //     },
    //     fetchPolicy: 'no-cache',
    //   });

  return {QueryQueue, data, loading}
}

export default QueueController