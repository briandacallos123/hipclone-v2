'use client';

// types
import { IAppointmentItem } from 'src/types/appointment';
//
import { AppointmentHistoryListView } from 'src/sections/history/view';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  data: IAppointmentItem[];
};

export default function ProfileHistoryListView({ data }: Props) {
  return <AppointmentHistoryListView data={data} />;
}
