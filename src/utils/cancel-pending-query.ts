

export const cancelServerQueryRequest = async (prisma: any, userId: any, queryTable: any, origin: any) =>{

    const processList : any = await prisma.$queryRaw`show processlist`;
    const pendingQuery : any = processList.filter((v:any)=> v?.f6 === 'Sending data' && v?.f7.includes(queryTable)).map((m:any)=>{
        return{
            id:Number(m?.f0),
            time:m?.f5,
            status:m?.f6,
            query:m?.f7,
            userId,
            origin
        }
    });
   if(pendingQuery){
     const killID = pendingQuery.filter((p:any) => p?.userId === String(userId) && p?.origin  === String(origin)).map((m:any) => {
        return m?.id
     }).join(',');
     if(killID){ 
        await prisma.$queryRaw`kill ${killID}`;
     }
   }

}