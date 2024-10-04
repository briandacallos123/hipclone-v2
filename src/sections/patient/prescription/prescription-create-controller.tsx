import { QueryAllFavorites, QueryAllMedicines, QueryAllTemplates } from '@/libs/gqls/merchantUser';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { getFavorites } from './actions/prescription-actions';
import { useAuthContext } from '@/auth/hooks';

export const PrescriptionController = (payloads: any) => {
    const { user } = useAuthContext()

    const [medicineData, setMedicineData]: any = React.useState({
        totalRecords: 0,
        tableData: [],
    });

    const [favorites, setFavorites] = useState({
        tableData: [],
        totalFavorites: 0
    })

    const [templates, setTemplates]:any = useState({
        tableData: [],
        totalFavorites: 0
    })
    const [initiator, setInitiator] = useState({
        med:1,
        fav:1,
        temp:1
    })



    const [getAllMedicines, getAllMedicineResult] = useLazyQuery(QueryAllMedicines, {
        context: {
            requestTrackerId: 'medicne[QueryAllMedicine]',
        },
        notifyOnNetworkStatusChange: true,
    });

    const [getAllTemplates, templateResults] = useLazyQuery(QueryAllTemplates, {
        context: {
            requestTrackerId: 'medicne[QueryAllMedicine]',
        },
        notifyOnNetworkStatusChange: true,
    });

    

    const [getAllFavorites, allFavorites] = useLazyQuery(QueryAllFavorites, {
        context: {
            requestTrackerId: 'favorite[QueryAllFavor]',
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(()=>{
        if(payloads?.target === 3 || initiator?.temp === 1){
            getAllTemplates({
                variables: {
                    data: {
                        take: payloads?.takeFavorites,
                        skip: payloads?.skipFavorites,
                        search:payloads?.search
                    }
                }
            }).then((res) => {
                const { QueryAllTemplates } = res?.data
    
                    console.log(QueryAllTemplates?.allPrescriptions,'result sa templateeee')

                setTemplates({
                    tableData: [...QueryAllTemplates?.allPrescriptions]
                })
                setInitiator({
                    ...initiator,
                    temp:initiator.temp + 1
                })
            }).catch((err)=>{
                console.log(err,'errorrr')
            })
        }
    },[templateResults.data, payloads?.takeTemplates, payloads?.skipTemplates, payloads.target, payloads?.search])

    useEffect(() => {
      if(payloads.target === 2 || initiator?.fav ===1){

        try {
            getAllFavorites({
                variables: {
                    data: {
                        take: payloads?.takeFavorites,
                        skip: payloads?.skipFavorites,
                        search:payloads?.search
                    }
                }
            }).then((res) => {
                const { QueryAllFavorites } = res?.data

                setFavorites({
                    tableData: QueryAllFavorites?.prescription,
                    totalFavorites: QueryAllFavorites?.totalRecords
                })
                setInitiator({
                    ...initiator,
                    fav:initiator.fav + 1
                })
            }).catch((err)=>{
                console.log(err,'errorrr')
            })

        } catch (error) {
            console.log(error)
        }
      }
    }, [allFavorites.data, payloads?.takeFavorites, payloads?.skipFavorites, payloads.target, payloads?.search])



    const { data } = getFavorites({
        doctorId: user?.doctorId
    })

    useEffect(() => {
        if (payloads?.target === 1 || initiator?.med) {

            getAllMedicines({
                variables: {
                    data: {
                        take: payloads?.take,
                        skip: payloads?.skip,
                        search: payloads?.search
                    }
                }
            }).then((res) => {
                const { data } = res;

                if (data) {
                    setMedicineData({
                        totalRecords: data?.QueryAllMedicines?.total_records,
                        tableData: data?.QueryAllMedicines?.
                            medicine_data

                    })
                }
                setInitiator({
                    ...initiator,
                    med:initiator.med + 1
                })
            })
        }

    }, [payloads?.take, payloads?.skip, payloads.search, payloads?.target])

    return {
        medicineData,
        getAllMedicines,
        getAllMedicineResult,
        setMedicineData,
        favorites,
        allFavorites,
        templates
    }
}


