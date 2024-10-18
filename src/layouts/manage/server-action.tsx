"use server";
import prisma from '../../../prisma/prismaClient'

export const userDoneSetup = async(data) => {

    console.log(data,'idddd')

  try {
    await prisma.user.update({
        data:{
            is_new:0
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