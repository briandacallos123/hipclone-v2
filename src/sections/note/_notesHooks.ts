import React, { useState, useEffect } from 'react';

import { get_note_lab } from '@/libs/gqls/notes/notesLabReq';
import { get_note_soap } from '@/libs/gqls/notes/notesSoap';
import { get_note_physical } from '@/libs/gqls/notes/notesPhysical';
import { get_note_vitals } from '@/libs/gqls/notes/notesVitals';
import { get_note_txt } from '@/libs/gqls/notes/notesTxt';
import { get_note_medClear } from '@/libs/gqls/notes/notesMedClear';
import { get_note_medCert } from '@/libs/gqls/notes/noteMedCert';
import { get_note_Abstract } from '@/libs/gqls/notes/notesAbstract';
import { get_note_vaccine } from '@/libs/gqls/notes/noteVaccine';

import {
  GET_RECORD_BY_PATIENT_USER,
  GET_RECORD_PATIENT,
  GET_RECORD_EMR_PATIENT,
} from '@/libs/gqls/records';
import { EMR_MED_NOTE } from '@/libs/gqls/emr';

import { get_eSign } from '@/libs/gqls/esignature';

import { useLazyQuery, useQuery } from '@apollo/client';
import { useAuthContext } from '@/auth/hooks';

export default function useNotesHooks(payloads: any) {
  // const [eSignData, setESignData] = useState<any>([]);

  // const [labData, setLabData] = useState<any>([]);
  // const [soapData, setSoapData] = useState<any>([]);
  // const [physicalData, setPhysicalData] = useState<any>([]);
  // const [vitalsData, setVitalsData] = useState<any>([]);
  // const [textData, setTxtData] = useState<any>([]);
  // const [medClearData, setMedClearData] = useState<any>([]);
  // const [medCertData, setMedCertData] = useState<any>([]);
  // const [AbstractData, setAbstData] = useState<any>([]);
  // const [VaccData, setVaccData] = useState<any>([]);

  // -------------------
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);

  const { user } = useAuthContext();
  // console.log('YUSEER: ', user?.role);

  const [tableData1, setTableData1] = useState<any>([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [clinicData, setClinicData] = useState([])
  const [tableDataEMR, setTableDataEMR] = useState<any>([]);
  const [totalDataEMR, setTotalDataEMR] = useState(0);
  // console.log(payloads, '!!!!!!!!!!##########');
  const [Ids, setIds] = useState<any>([]);


  const [getRecordPatient, recordPatientResult] = useLazyQuery(GET_RECORD_PATIENT,{
    context: {
      requestTrackerId: 'records[allRecordsbyPatientNew]',
    },
    notifyOnNetworkStatusChange: true,
  })


  useEffect(()=>{
    if(user?.role !== 'patient'){
      getRecordPatient({
        variables:{
          data:{
            clinicIds: payloads.clinicIds,
            skip: payloads.skip,
            take: payloads.take,
            orderBy: payloads.orderBy,
            orderDir: payloads.orderDir,
            userType: payloads.userType,
            uuid: payloads.uuid,
            emrID: payloads.emrID,
            startDate: payloads.startDate,
            endDate: payloads.endDate,
            searchKeyword: payloads.searchKeyword,
            recordType: payloads.recordType,
          }
        }
      }).then((data)=>{
        // console.log(data,'DATA KOTO')
        // const { allRecordsbyPatientNew } = data?.data;
        setLoading(false)
        setTableData1(data?.data?.allRecordsbyPatientNew?.Records_data);
        setIds(data?.data?.allRecordsbyPatientNew?.RecordIds);
        setTotalData(data?.data?.allRecordsbyPatientNew?.total_records);
        setIsLoadingPatient(false);
        setClinicData(data?.data?.allRecordsbyPatientNew?.clinic)
      })
    }
  },[recordPatientResult.data,
     user?.role,
     payloads.clinicIds,
     payloads.skip,
     payloads.take,
     payloads.orderBy,
     payloads.orderDir,
     payloads.userType,
     payloads.uuid,
     payloads.emrID,
     payloads.startDate,
     payloads.endDate,
     payloads.searchKeyword,
     payloads.recordType
    ])

    const [deleteRecordPatient, deleteRecordResult] = useLazyQuery(GET_RECORD_PATIENT,{
      context: {
        requestTrackerId: 'records[allRecordsbyPatientNew]',
      },
      notifyOnNetworkStatusChange: true,
    })

  // const { data, loading, refetch }: any = useQuery(GET_RECORD_PATIENT, {
  //   variables: {
  //     data: {
  //       clinicIds: payloads.clinicIds,
  //       skip: payloads.skip,
  //       take: payloads.take,
  //       orderBy: payloads.orderBy,
  //       orderDir: payloads.orderDir,
  //       userType: payloads.userType,
  //       uuid: payloads.uuid,
  //       emrID: payloads.emrID,
  //       startDate: payloads.startDate,
  //       endDate: payloads.endDate,
  //       searchKeyword: payloads.searchKeyword,
  //       recordType: payloads.recordType,
  //     },
  //   },
  //   context: {
  //     requestTrackerId: 'records[allRecordsbyPatientNew]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // useEffect(() => {
  //   if (user?.role !== 'patient' && data) {
  //     const { allRecordsbyPatientNew } = data;
  //     setLoading(false)
  //     setTableData1(allRecordsbyPatientNew?.Records_data);
  //     setIds(allRecordsbyPatientNew?.RecordIds);
  //     setTotalData(allRecordsbyPatientNew?.total_records);
  //     setIsLoadingPatient(false);
  //   }
  // }, [data, user?.role]);

  // -------------------
  // ------EMR

  const {
    data: EMRdata,
    loading: loadingEmr,
    refetch: emrRefetch,
  }: any = useQuery(GET_RECORD_EMR_PATIENT, {
    variables: {
      data: {
        // clinicIds: filters?.hospital.map((v: any) => Number(v)),
        // skip: page * rowsPerPage,
        // take: rowsPerPage,
        // orderBy,
        // orderDir: order,
        // userType: String(user?.role),
        // uuid: String(refIds),
        // emrID: Number(id),
        // startDate: filters?.startDate,
        // endDate: filters?.endDate,
        // searchKeyword: filters.name,

        clinicIds: payloads.clinicIds,
        skip: payloads.skip,
        take: payloads.take,
        orderBy: payloads.orderBy,
        orderDir: payloads.orderDir,
        userType: payloads.userType,
        uuid: payloads.uuid,
        emrID: payloads.emrID,
        startDate: payloads.startDate,
        endDate: payloads.endDate,
        searchKeyword: payloads.searchKeyword,
        recordType: payloads.recordType,
      },
    },
    context: {
      requestTrackerId: 'records[allRecordsbyEMRNew]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (EMRdata && user?.role !== 'patient' && payloads.checkEMR) {
      const { allRecordsbyEMRNew } = EMRdata;
      // setTable(todaysAPR);
      setTableDataEMR(allRecordsbyEMRNew?.Records_data);
      // setIds(allRecordsbyPatient?.RecordIds);
      setTotalDataEMR(allRecordsbyEMRNew?.total_records);
    }
  }, [EMRdata,recordPatientResult.data, payloads.checkEMR, user?.role]);

  // console.log('EMR GG:', payloads);
  // console.log('EMR GG:', totalDataEMR);

  const [getRecordOfPatient, patientRecordResult] = useLazyQuery(GET_RECORD_BY_PATIENT_USER,{
    context: {
      requestTrackerId: 'recordPatient[patientRecordResult]',
    },
    notifyOnNetworkStatusChange: true,
  })

  useEffect(()=>{
    if(user?.role === 'patient'){
      getRecordOfPatient({
        variables:{
          data: {
            clinicIds: payloads.clinicIds,
            skip: payloads.skip,
            take: payloads.take,
            orderBy: payloads.orderBy,
            orderDir: payloads.orderDir,
            startDate: payloads.startDate,
            endDate: payloads.endDate,
            noteType:payloads.type,
            searchKeyword: payloads.searchKeyword,
            recordType:payloads.recordType
          }
        }
      }).then((data)=>{
        if(data){
          const {allRecordsbyPatientUser} = data.data
          setTableData1(allRecordsbyPatientUser?.Records_data);
          setIds(allRecordsbyPatientUser?.RecordIds);
          setTotalData(allRecordsbyPatientUser?.total_records);
          setClinicData(allRecordsbyPatientUser?.clinic)
        }
      })
    }
  },[ user?.role,
    payloads.clinicIds,
    payloads.skip,
    payloads.take,
    payloads.orderBy,
    payloads.orderDir,
    payloads.startDate,
    payloads.endDate,
    payloads.recordType,
    payloads.searchKeyword,
    patientRecordResult.data
  ])


  // const { data: userData, loading: patLoad }: any = useQuery(GET_RECORD_BY_PATIENT_USER, {
  //   variables: {
  //     data: {
  //       clinicIds: payloads.clinicIds,
  //       skip: payloads.skip,
  //       take: payloads.take,
  //       orderBy: payloads.orderBy,
  //       orderDir: payloads.orderDir,
  //       startDate: payloads.startDate,
  //       endDate: payloads.endDate,
  //       noteType:payloads.type,
  //       searchKeyword: payloads.searchKeyword,
  //     },
  //   },
  //   context: {
  //     requestTrackerId: 'records[allRecordsbyPatientUser]',
  //   },
  //   notifyOnNetworkStatusChange: true,
  // });

  // patient;
  // useEffect(() => {
  //   if (user?.role === 'patient' && userData) {
  //     const { allRecordsbyPatientUser } = userData;
  //     // setTable(todaysAPR);
  //     setTableData1(allRecordsbyPatientUser?.Records_data);
  //     setIds(allRecordsbyPatientUser?.RecordIds);
  //     setTotalData(allRecordsbyPatientUser?.total_records);
  //   }
  // }, [
  //   user?.role,
  //   payloads.clinicIds,
  //   payloads.skip,
  //   payloads.take,
  //   payloads.orderBy,
  //   payloads.orderDir,
  //   payloads.startDate,
  //   payloads.endDate,
  //   payloads.searchKeyword,
  //   userData,
  //   // data,
  //   recordPatientResult.data
  // ]);
  // console.log('table1', tableData1);

  return {
    isLoading,
    patientLoading:patientRecordResult.loading,
    data:recordPatientResult,
    loading:recordPatientResult.loading,
    refetch:user?.role !== 'patient' ? recordPatientResult.refetch:patientRecordResult.refetch,
    emrRefetch,
    tableData1,
    totalData,
    Ids,
    tableDataEMR,
    totalDataEMR,
    isLoadingPatient,
    clinicData
  };
}
