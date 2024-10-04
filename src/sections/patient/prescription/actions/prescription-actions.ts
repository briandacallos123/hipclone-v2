"use server"

import client from '../../../../../prisma/prismaClient'

export const getFavorites = async(formData) => {

    try {
        const allFavorites = await client.prescriptions_child.findMany({
            where:{

            }
        })
    } catch (error) {
        console.log(error);
    }
}