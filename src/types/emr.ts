import { IPatient } from './general';

// ----------------------------------------------------------------------

export type IEmrTableFilters = {
  name: string;
  status: string;
};

export type IEmrItem = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  suffix: string;
  gender: string;
  address: string;
  birthDate: Date | number;
  civilStatus: string;
  status: boolean;
  linkedAccount: IPatient | null;
};
