import { IAppointmentItem } from './appointment';

// ----------------------------------------------------------------------

export type IHmoTableFilterValue = string | string[] | Date | null;

export type IHmoTableFilters = {
  name: string;
  status: number;
  hmo: string[];
  start_date: Date | null;
  end_date: Date | null;
};

export type IHmoItem = IAppointmentItem;
