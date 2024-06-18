"use server"

import { revalidatePath } from "next/cache"


export const revalidateStore = async() => {
    revalidatePath('/merchant/dashboard/store/id')
}