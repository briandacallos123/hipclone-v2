import { IHospital } from './general';
import { INoteTextItem } from './note';

// ----------------------------------------------------------------------

export type INoteTableFilterValue = string | string[] | Date | null;

export type INoteTableFilters = {
  name: string;
  hospital: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type INoteItem = {
  id: string;
  patientId: string;
  noteNumber: string;
  doctor: {
    id: string;
    clinic: IHospital[];
  };
  type: string;
  date: Date | number;
  hospitalId: string;
  documentId: string;
};

// ----------------------------------------------------------------------

export type IImagingTableFilterValue = string | string[] | Date | null;

export type IImagingTableFilters = {
  name: string;
  clinic: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IImagingItem = {
  id: string;
  patientId: string;
  imageNumber: string;
  doctor: {
    id: string;
    clinic: IHospital[];
  };
  labName: string;
  type: string;
  date: Date | number;
  attachment: string[];
  hospitalId: string;
};
