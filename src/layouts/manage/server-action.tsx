"use server";
import prisma from '../../../prisma/prismaClient'

export const userDoneSetup = async(data) => {




  try {
    await prisma.user.update({
        data:{
            is_new: 0,
            setup_step: null,
            setup_language: null
        },
        where:{
            id:data
        }
    })

    return{
        status:'success'
    }
  } catch (error) {
    return error
  }

}