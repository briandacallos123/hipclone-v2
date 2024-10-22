"use server";
import prisma from '../../../prisma/prismaClient'

export const getCurrentStep = async(id) => {
    try {
        const result = await prisma.user.findFirst({
            where:{
                id
            },
            select:{
                setup_step:true
            }
        })

        console.log(result,'result bhe')

        return result

    } catch (error) {
        return error
    }
}

export const setCurrentStep = async(data) => {
    try {
        const {id, step} = data;

        const result = await prisma.user.update({
            data:{
                setup_step:step
            },
            where:{
                id
            }
        })

        return {
            success:true
        }

    } catch (error) {
        return error
    }
}