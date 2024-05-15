import { IHospital } from './general';

// ----------------------------------------------------------------------

export type IPrescriptionTableFilterValue = string | string[] | Date | null;

export type IPrescriptionTableFilters = {
  name: string;
  hospital: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IPrescriptionItem = {
  id: string;
  patientId: string;
  doctor: {
    id: string;
    clinic: IHospital[];
  };
  prescriptionNumber: string;
  date: Date | number;
  upDate: Date | number;
  remark: string;
  items: {
    id: string;
    genericName: string;
    brand: string;
    dosage: number;
    form: string;
    quantity: number;
    frequency: number;
    duration: number;
  }[];
  hospitalId: string;
};
