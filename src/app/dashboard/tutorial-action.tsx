"use server";
import prisma from '../../../prisma/prismaClient'

export const getCurrentStep = async (id) => {
    try {
        const result = await prisma.user.findFirst({
            where: {
                id
            },
            select: {
                setup_step: true
            }
        })

        console.log(result, 'result bhe')

        return result

    } catch (error) {
        return error
    }
}

export const setCurrentStep = async (data) => {
    try {
        const { id, step } = data;

      

        await prisma.user.update({
            data: {
                setup_step: step
            },
            where: {
                id
            }
        })

        return {
            success: true
        }

    } catch (error) {
        return error
    }
}

export const setTutsLanguage = async ({ id, value }: any) => {
    try {
        const val = value === 'english' ? 1 : 2;

        const result = await prisma.user.update({
            data: {
                setup_language: Number(val)
            },
            where: {
                id
            }
        })

        return {
            success: true
        }

    } catch (error) {
        return error
    }
}

export const getTutsLanguage = async ({ id }: any) => {
    try {

        const result = await prisma.user.findFirst({
            where: {
                id
            }
        })

        return {
            language: result?.setup_language === 1 ? 'english' : 'tagalog'
        }

    } catch (error) {
        return error
    }
}