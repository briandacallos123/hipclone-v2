'use client';

// @mui
import Dialog from '@mui/material/Dialog';
// _mock
import { _appointmentList } from 'src/_mock';
//
import { useResponsive } from 'src/hooks/use-responsive';
import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { doctor_appointments_by_id_data } from '@/libs/gqls/drappts';
import AppointmentDetails from '../appointment-details';
import ModalSplash from '@/components/modal-splash/modal-splash';

// ---------import ModalSplash from '@/components/modal-splash/modal-splash';-------------------------------------------------------------

type Props = {
  id?: any;
  refetch?: any;
  open?: boolean;
  onClose?: VoidFunction;
  updateRow?: any;
  refetchToday?: VoidFunction;
  refetchTabs?: any;
  isHistory?: any;
  notif?:boolean
};

// ----------------------------------------------------------------------

export default function AppointmentDetailsView({
  refetchToday,
  updateRow,
  refetch,
  id,
  open,
  onClose,
  refetchTabs,
  isHistory,
  notif
}: Props) {
  const upMd = useResponsive('up', 'md');
  // console.log(id,'ídto@@sss')
  // const [currentItem, setCurrentItem] = useState({});

  // useEffect(() => {
  //   setCurrentItem(id);
  // }, [id?.id]);
  // // const currentItem = _appointmentList.filter(
  // //   (item) => item.id === 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'
  // // )[0];

  // 532

  // const [data_by_id, setData] = useState(null);
  const [data_by_id, setDataById]= useState(null)

  const [new_data, setNewData] = useState(null);

  const [isQueryDone, setQueryDone] = useState(false);
  const [isLoading, setLoading] = useState(true)

  const [getData, { data: queryData, error, loading, refetch: qRefetch }]: any = useLazyQuery(
    doctor_appointments_by_id_data,
    {
      context: {
        requestTrackerId: 'doctor_appointments_by_id_data[doctor_appointments_by_id]',
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy:'no-cache'
    }
  );



  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    getData({
      variables: {
        data: {
          id: notif ? Number(id?.appt_id) : Number(id?.id),
          // id: Number(id?.id),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if(data){
        setNewData(data?.doctor_appointments_by_id_data?.doctor_appointments_by_id);
      
      }
      setLoading(false)
    }).catch((err)=>{
      setLoading(false)
    })
  
}, [id?.id]);

  
  const toggleData = () => {
    setToggle(!toggle);
  };

  const resetState = () => {
    setNewData(null)
  }

  if(isLoading){
    return(
      <Dialog maxWidth={false} open={loading} PaperProps={{
        sx:{
          maxwidth:640
        }
      }}>
        <ModalSplash/>
      </Dialog>
    )
  }

  const backToNormal = () => {
    onClose()
    setNewData(null)
    setLoading(true)
  }

  return (
    <>
      {upMd && (
        <Dialog
          fullWidth
          maxWidth={false}
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: { maxWidth: 1080 },
          }}
        >
          {/* {data_by_id && id && ( */}
          { new_data && (
            <AppointmentDetails
              isHistory={isHistory}
              updateRow={updateRow}
              resetState={resetState}
              refetchToday={refetchToday}
              refetch={async () => {
                onClose();
                await qRefetch();
                refetch();
              }}
              refetchTabs={refetchTabs}
              // 532
              currentItem={new_data}
              // listItem={id}
              listItem={new_data}
              toggleData={toggleData}
              onClose={()=>{
                backToNormal()
              }}
            />
          )}
        </Dialog>
      )}

      {!upMd && (
        <Dialog
          fullScreen
          maxWidth={false}
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: { maxWidth: 1080 },
          }}
        >
          {new_data && (
            <AppointmentDetails
              isHistory={isHistory}
              updateRow={updateRow}
              resetState={resetState}
              refetchToday={refetchToday}
              refetch={async () => {
                onClose();
                await qRefetch();
                refetch();
              }}
              refetchTabs={refetchTabs}
              // 532
              currentItem={new_data}
              // listItem={id}
              listItem={new_data}
              toggleData={toggleData}
              onClose={()=>{
                backToNormal()
              }}
              // updateRow={updateRow}
              // refetchToday={refetchToday}
              // refetch={async () => {
              //   onClose();
              //   await qRefetch();
              //   refetch();
              // }}
              // // 532
              // currentItem={new_data}
              // isHistory={isHistory}
              // listItem={new_data}
              // toggleData={toggleData}
              // onClose={onClose}
            />
          )}
        </Dialog>
      )}
    </>
  );
}
