import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function useCollapseNav() {
  const [openDrawer, setOpenDrawer] = useState(true);

  const [openMobile, setOpenMobile] = useState(false);

  const [collapseDesktop, setCollapseDesktop] = useState(false);

  const onCollapseDesktop = useCallback(() => {
    setCollapseDesktop((prev) => !prev);
  }, []);

  const onCloseDesktop = useCallback(() => {
    setCollapseDesktop(false);
  }, []);

  const onOpenMobile = useCallback(() => {
    setOpenMobile(true);
  }, []);

  const onCloseMobile = useCallback(() => {
    setOpenMobile(false);
  }, []);

  const onOpenDrawer = useCallback(() => {
    setOpenDrawer(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  return {
    openMobile,
    openDrawer,
    collapseDesktop,
    //
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    onCollapseDesktop,
    onOpenDrawer,
    onCloseDrawer,
  };
}
