"use client"

import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function MerchantGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { authenticated, user } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    // setChecked(true);

    if (!authenticated ) {
      const searchParams = new URLSearchParams({ returnTo: window.location.href }).toString();

      const homePath = paths.merchant.login;

      // const href = `${homePath}?${searchParams}`;
      const href = `${homePath}`;

      router.replace(href);
    }else if(authenticated && user?.role !== 'merchant'){
      window.location.href = paths.page403
    }
    
    else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
