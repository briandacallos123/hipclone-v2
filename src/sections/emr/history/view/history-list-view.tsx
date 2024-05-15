'use client';

import { useState } from 'react';
// _mock
import { _appointmentList } from 'src/_mock';
//
import { AppointmentHistoryListView } from 'src/sections/history/view';

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export default function EmrHistoryListView({ slug }: Props) {
  const [tableData] = useState(_appointmentList.filter((_) => _.patient.slug === slug));

  return <AppointmentHistoryListView />;
}
