"use server";

import prisma from '../../../../../prisma/prismaClient'


export const validateEmail = async(data) => {
    try {


        const isExists = await prisma.user.findUnique({
            where:{
                email:data
            }
        });

        const isExistsSub = await prisma.sub_account.findFirst({
            where:{
                email:data
            }
        })

        const emr_existingUserEmail = await prisma.emr_patient.findFirst({
            where: {
                email:data
            },
          });

        return {
            isExists:isExists || isExistsSub || emr_existingUserEmail
        }
    } catch (error) {
        return error;
    }


}

export const validatePhone = async(data) => {


    try {

   

        const isExists = await prisma.user.findFirst({
            where:{
                mobile_number:String(data?.phone)
            }
        });

        return {
            isExists
        }
    } catch (error) {
        return error;
    }


}