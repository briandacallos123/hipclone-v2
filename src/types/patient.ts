import { ApexOptions } from 'apexcharts';
import { IPatient, IHospital } from './general';

// ----------------------------------------------------------------------

export type IPatientCover = {
  name: string;
  email: string;
  coverUrl: string;
  avatarUrl: string;
};

// ----------------------------------------------------------------------

export type IPatientProfile = {
  medication: {
    id: string;
    name: string;
  }[];
  medical: {
    id: string;
    name: string;
  }[];
  allergy: {
    id: string;
    name: string;
  }[];
  family: {
    id: string;
    name: string;
  }[];
  smoking: {
    id: string;
    name: string;
  }[];
};

// ----------------------------------------------------------------------

type VitalChartValue = {
  categories?: string[];
  colors?: string[][];
  data: {
    name: string;
    data: number[];
  }[];
  options?: ApexOptions;
};

export type IPatientVital = {
  weight: VitalChartValue;
  height: VitalChartValue;
  mass: VitalChartValue;
  blood: VitalChartValue;
  oxygen: VitalChartValue;
  respiratory: VitalChartValue;
  heart: VitalChartValue;
  temperature: VitalChartValue;
};

// ----------------------------------------------------------------------

export type IPatientTableFilterValue = string | string[];

export type IPatientTableFilters = {
  name: string;
  status: number;
  hospital: string[];
};

export type IPatientItem = {
  id: string;
  patient: IPatient;
  hospital: IHospital;
  profile: IPatientProfile;
  vital: IPatientVital;
};

export type IPatientObject = {
  S_ID: number;
  IDNO: number;
  FNAME: string;
  MNAME: string;
  LNAME: string;
  STATUS: number;
  SEX: number;
  HOME_ADD: string;
  EMAIL: string;
  CONTACT_NO: string;
};
