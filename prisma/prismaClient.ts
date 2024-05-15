import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}
// enable in not production env. only
// prisma query logs are resource intinsive it may cause some performance issue on production
let prisma: PrismaClient = (()=>{
   
  if(String(process.env.NODE_ENV) !== 'production'){
    if (!global.prisma) {
      global.prisma = String(process.env.ENABLE_DEV_LOGS) !== 'false' ? new PrismaClient(
      //   {
      //   log: [
      //     {
      //       level: 'query',
      //       emit: 'stdout',
      //     },
      //     {
      //       emit: 'event',
      //       level: 'info',
      //     },
      //   ],
      // }
      ) :  new PrismaClient(); 
    }
    return global.prisma;
  }
  return new PrismaClient();
})()

export default prisma;
