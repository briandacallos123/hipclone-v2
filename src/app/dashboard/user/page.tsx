'use client';

import { useEffect } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(paths.dashboard.user.account);
  }, [router]);

  return null;
}
