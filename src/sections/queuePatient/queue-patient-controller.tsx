
import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import {QueryQueuePatient} from 'src/libs/gqls/queue';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { useParams } from 'src/routes/hook';

const QueueController = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [position, setPosition] = useState(null)
    const [newPosition, setNewPosition] = useState(null)
    const [remainingP, setRemainingP] = useState(null)
    const [ref, setRef] = useState(false)
    const {id} = useParams();

    const navigate = useRouter();

    const { data: queryData, error, refetch }: any = useQuery(QueryQueuePatient,{
      variables:{
        data:{
          voucherCode: id
        }
      }
    });

    useEffect(()=>{
      if(queryData){
        const {data} = queryData;

        // console.log(queryData,data,'HAHAHA')

        if(queryData?.QueuePatient && queryData?.QueuePatient?.position !== -1){

          const qData = queryData?.QueuePatient?.appointments_data;
          const pos = queryData?.QueuePatient?.position
          let pos2:any;
          let newQData:any = [];
          let remainingP:any;

          // kunin yung mga natitirang patient bago siya
          if(pos !== 0 && pos !== 1){
            pos2 = pos - 2;

            newQData.push(qData[0]);
            newQData.push(qData[pos]);
            remainingP = qData?.length - 2;




          }

          // kapag una siya, dalawang data lang lalagay natin and add ng remaining count.
          // console.log(qData.slice(0,1),'SLICE________')
          if((pos === 0 || pos === 1) && qData?.length > 2){
          
            newQData = [...qData.slice(0, 2)]
            remainingP = qData?.length - 2;
            
          }

          // alert(qData?.length)
          if(qData?.length <= 2){
            newQData = qData;
           
          }

          console.log(pos2,'POSITION')
          setData(newQData)
          setPosition(pos)
          setRemainingP(remainingP)
          setNewPosition(pos2 + 1)
        } else{
          navigate.push(paths.page500)
          localStorage.setItem('invalidVoucher',"true")
        }
        setLoading(false)
      }
    },[queryData])

    const [getData, dataResults] = useLazyQuery(QueryQueuePatient, {
        context: {
            requestTrackerId: 'getQueuesApr[Apt-Dash-queue]',
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
      });

    const QueryQueue = useCallback(async(id:String) => {
      // setLoading(true)
        getData({
            variables: {
                    data: {
                    // userType: "patient",
                    // skip: 0,
                    // take: 10,
                    voucherCode: id,
                    // status: 1,
                    // searchKeyword: filters.name,
                    // orderBy,
                    // orderDir: order,
                    // type: filters?.status,
                },
            },
          }).then(async (result: any) => {
            const {data} = result;
          
            if(data?.QueuePatient && data?.QueuePatient?.position !== -1){

              const qData = data?.QueuePatient?.appointments_data;
              const pos = data?.QueuePatient?.position
              let pos2:any;
              let newQData:any = [];
              let remainingP:any;

              // kunin yung mga natitirang patient bago siya
              if(pos !== 0 && pos !== 1){
                pos2 = pos - 2;

                newQData.push(qData[0]);
                newQData.push(qData[pos]);
                remainingP = qData?.length - 2;




              }

              // kapag una siya, dalawang data lang lalagay natin and add ng remaining count.
              // console.log(qData.slice(0,1),'SLICE________')
              if((pos === 0 || pos === 1) && qData?.length > 2){
              
                newQData = [...qData.slice(0, 2)]
                remainingP = qData?.length - 2;
                
              }

              // alert(qData?.length)
              if(qData?.length <= 2){
                newQData = qData;
               
              }

              console.log(pos2,'POSITION')
              setData(newQData)
              setPosition(pos)
              setRemainingP(remainingP)
              setNewPosition(pos2 + 1)
            } else{
              navigate.push(paths.page500)
              localStorage.setItem('invalidVoucher',"true")
            }
            setLoading(false)
          
          });
    },[ref])

    const customR = useCallback(() => {
      console.log("called refetch")
        setRef(!ref)
      },[])

  
  return {QueryQueue, data, dataResults,refetch, loading, position, remainingP, newPosition}
}

export default QueueController