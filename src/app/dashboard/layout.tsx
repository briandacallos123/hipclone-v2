'use client';

import React, { useEffect, useState } from 'react';
// auth
import { AuthGuard } from 'src/auth/guard';
// hooks
import { usePathname, useParams } from 'src/routes/hook';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import DashboardLayout from 'src/layouts/dashboard';
import { styled } from '@mui/material/styles';
import { useSearch } from '@/auth/context/Search';
import beamsClient from '@/utils/beamClient';
import activeUser from '@/utils/activeUser';
import { Box } from '@mui/material';
import Image from '@/components/image';
import prisma from '../../../prisma/prismaClient'
import ChangesWatcher from '@/context/changes-watcher';
import Tutorialstep from '@/context/tut-step';
import { getCurrentStep } from './tutorial-action';
import { useAuthContext } from '@/auth/hooks';
import { paths } from '@/routes/paths';
import { useRouter } from 'next/navigation';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};


export default function Layout({ children }: Props) {

  beamsClient()
  activeUser()
  const pathname = usePathname();

  const router = useRouter()

  const {user} = useAuthContext();

  const { id } = useParams();
  const upMd = useResponsive('up', 'md');

  const isChat = pathname === '/dashboard/chat/';

  const [loading, setLoading] = useState(true);

  if (isChat && !upMd) {
    return <AuthGuard>{children}</AuthGuard>;
  }
  // console.log(user,"meron naman? sa labas")

  useEffect(()=>{
  // console.log("meron naman? sa loob")

    if(user?.new_doctor){
      getCurrentStep(user?.id).then((res)=>{
        console.log(res,'ressssssss')
        switch(res.setup_step){
          case 1:
            router.push(paths.dashboard.root);
            break;
          case 2:
            router.push(paths.dashboard.root);
            break;
          case 3:
            router.push(paths.dashboard.user.manage.profile);
            break;
          case 4:
            router.push(paths.dashboard.user.manage.profile);
            break;
          case 5:
            router.push(paths.dashboard.user.manage.profile);
            break;
          case 6:
            router.push(paths.dashboard.user.manage.clinic);
            break;
          case 7:
            router.push(paths.dashboard.user.manage.service);
            break;

        }
        setLoading(false)
      })
    }
  },[pathname, user])


  const StyledComponent = styled('div')({
    background: `url('/assets/background/queue-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // This makes the background fixed
    minHeight: '100vh',
    width: '100vw',
  });

  if(user?.new_doctor && loading){
    return <></>
  }


  return (
    <AuthGuard>
      <StyledComponent>
        <DashboardLayout>
          <ChangesWatcher>
            <Tutorialstep>
              {children}
            </Tutorialstep>

          </ChangesWatcher>
        </DashboardLayout>
      </StyledComponent>
    </AuthGuard>
  );
}
