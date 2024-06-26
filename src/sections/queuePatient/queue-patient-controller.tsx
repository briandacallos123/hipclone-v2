
import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react'
// import { QueueReadCountPage } from 'src/libs/gqls/allClinics';
import { QueryQueuePatient, QueueGetClinicOfPatient } from 'src/libs/gqls/queue';
import { notFound, useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import { useParams } from 'src/routes/hook';

const QueueController = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState(null)
  const [newPosition, setNewPosition] = useState(null)
  const [remainingP, setRemainingP] = useState(null)
  const [ref, setRef] = useState(false)
  const [notToday, setNotToday] = useState(null)
  const [isDoneAppt, setIsDoneAppt] = useState<boolean | null>(null)
  const { id } = useParams();
  const [clinicData, setClinicData] = useState([])
  const [targetItem, setTargetItem] = useState(null)

  const navigate = useRouter();

  const { data: queryData, error, refetch }: any = useQuery(QueryQueuePatient, {
    variables: {
      data: {
        voucherCode: id
      }
    }
  });

  const { data: otherClinic, loading:clinicLoading}: any = useQuery(QueueGetClinicOfPatient, {
    variables: {
      data: {
        skip:0,
        take:10
      }
    }
  });

  useEffect(()=>{
    if(queryData){
      if(otherClinic){
        const {QueueGetClinicOfPatient} = otherClinic
        const target = data[0]

        const filteredItems = QueueGetClinicOfPatient?.appointments_data?.filter((item:any)=>{
          if(Number(target?.clinicInfo?.id) !== Number(item?.clinicInfo?.id)){
            return item
          }
        })

        console.log(filteredItems,'YAWAAAAAAAAAAAAAAAAAA')

        setClinicData(filteredItems)
  
      }
    }
  },[otherClinic, data])

  

  useEffect(() => {
    if (queryData) {
      const { data } = queryData;

      if(queryData?.QueuePatient){
        const target = queryData?.QueuePatient?.appointments_data?.find((item:any)=>item?.voucherId=== id)
        setTargetItem(target)
      }

      if (queryData?.QueuePatient && queryData?.QueuePatient?.position !== -1) {

        const qData = queryData?.QueuePatient?.appointments_data;
        const pos = queryData?.QueuePatient?.position
        let pos2: any;
        let newQData: any = [];
        let remainingP: any;

        if (pos !== 0 && pos !== 1) {
          pos2 = pos - 2;

          newQData.push(qData[0]);
          newQData.push(qData[pos]);
          remainingP = qData?.length - 2;
        }

        if(queryData?.QueuePatient?.is_not_today){

          console.log(queryData?.QueuePatient?.is_not_today,'HAYSSS')
          setNotToday(queryData?.QueuePatient?.appointments_data[0])
         
        }
        if(queryData?.QueuePatient?.is_done){
          setIsDoneAppt(true)
        }

      
        if ((pos === 0 || pos === 1) && qData?.length > 2) {

          newQData = [...qData.slice(0, 2)]
          remainingP = qData?.length - 2;

        }

        // alert(qData?.length)
        if (qData?.length <= 2) {
          newQData = qData;

        }

        console.log(pos2, 'POSITION')
        setData(newQData)
        setPosition(pos)
        setRemainingP(remainingP)
        setNewPosition(pos2 + 1)
      } else {
        navigate.push(paths.page500)
        localStorage.setItem('invalidVoucher', "true")
        notFound()
      }
      setLoading(false)
    }
  }, [queryData])

  const [getData, dataResults] = useLazyQuery(QueryQueuePatient, {
    context: {
      requestTrackerId: 'getQueuesApr[Apt-Dash-queue]',
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  const QueryQueue = useCallback(async (id: String) => {
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
      const { data } = result;

      if (data?.QueuePatient && data?.QueuePatient?.position !== -1) {

        const qData = data?.QueuePatient?.appointments_data;
        const pos = data?.QueuePatient?.position
        let pos2: any;
        let newQData: any = [];
        let remainingP: any;

        // kunin yung mga natitirang patient bago siya
        if (pos !== 0 && pos !== 1) {
          pos2 = pos - 2;

          newQData.push(qData[0]);
          newQData.push(qData[pos]);
          remainingP = qData?.length - 2;




        }

        // kapag una siya, dalawang data lang lalagay natin and add ng remaining count.
        // console.log(qData.slice(0,1),'SLICE________')
        if ((pos === 0 || pos === 1) && qData?.length > 2) {

          newQData = [...qData.slice(0, 2)]
          remainingP = qData?.length - 2;

        }

        // alert(qData?.length)
        if (qData?.length <= 2) {
          newQData = qData;

        }

        console.log(pos2, 'POSITION')
        setData(newQData)
        setPosition(pos)
        setRemainingP(remainingP)
        setNewPosition(pos2 + 1)
      } else {
        // navigate.push(paths.page500)
        // localStorage.setItem('invalidVoucher', "true")
        notFound()
      }
      setLoading(false)

    });
  }, [ref])

  const customR = useCallback(() => {
    console.log("called refetch")
    setRef(!ref)
  }, [])


  return { QueryQueue,isDoneAppt, targetItem, data,clinicData, clinicLoading, dataResults, refetch, loading, position, remainingP, newPosition, notToday }
}

export default QueueController