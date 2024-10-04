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
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {

  beamsClient()
  activeUser()
  const pathname = usePathname();
  const { id } = useParams();
  const upMd = useResponsive('up', 'md');
  // const { patientView, setPatientView }: any = useSearch();

  const isChat = pathname === '/dashboard/chat/';

  if (isChat && !upMd) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  // useEffect(() => {
  //   var myData: any | null = JSON.parse(sessionStorage.getItem('patientView'));

  //   // false
  //   if (pathname !== '/dashboard/patient/' && id === undefined) {
  //     if (myData?.data?.length) {
  //       sessionStorage.removeItem('patientView');
  //     }
  //   }
  //   if (pathname === '/dashboard/patient/' && !id) {
  //     if (myData?.data?.length) {
  //       sessionStorage.removeItem('patientView');
  //     }
  //   }
  // }, [pathname]);


  
  const StyledComponent = styled('div')({
    background: `url('/assets/background/queue-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // This makes the background fixed
    minHeight: '100vh',
    width: '100vw',
  });

  return (
    <AuthGuard>
      <StyledComponent>
        <DashboardLayout>{children}</DashboardLayout>
      </StyledComponent>
    </AuthGuard>
  );
}
