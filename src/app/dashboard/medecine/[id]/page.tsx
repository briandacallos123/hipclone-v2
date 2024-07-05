import React from 'react'
import { StoreDashboardId } from '@/sections/medecine-final/id'
import prisma from '../../../../../prisma/prismaClient'


const fetchStore = async(id:number) => {
    try {
        let store = await prisma.merchant_store.findFirst({
            where:{
                id:Number(id)
            },
            include:{
                attachment_store:true,
            }
        })
    
        const medicines = await prisma.merchant_medicine.findMany({
            where:{
                store_id:Number(store?.id),
                is_deleted:0,
                stock:{
                    not:{
                        equals:0
                    }
                }
            },
        })

        let medecine_attachment = medicines?.map(async(item)=>{
            const result = await prisma.medecine_attachment.findFirst({
                where:{
                    id:Number(item?.attachment_id)
                }
            })

            return {...item, attachment_info:{...result}}
        })
        medecine_attachment = await Promise.all(medecine_attachment)

    
        const result = {...store, medecine_list:[...medecine_attachment]}
        return result;
    } catch (error) {
        console.log(error)
    }
    
}

const page = async({params}) => {
    const {id} = params;
    const data = await fetchStore(id)
    
  return (
    <StoreDashboardId id={id} data={data}/>
  )
}

export default page