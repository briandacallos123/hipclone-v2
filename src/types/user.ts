import { IHospital, ISchedule } from './general';

export type IUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  slug: string;
  email: string;
  phoneNumber: string;
  password: string;
  suffix: string;
  gender: string;
  nationality: string;
  address: string;
  birthDate: Date | number;
  age: number;
  avatarUrl: string;
  coverUrl: string;
};

// ----------------------------------------------------------------------

export type IUserProfilePortfolio = {
  specialty: string;
  subSpecialty: string;
  title: string;
  signatureUrl: string;
};

// ----------------------------------------------------------------------

export type IUserProfileLicense = {
  prcNumber: string;
  prcExpiry: Date | number;
  ptrNumber: string;
  s2Number: string;
  since: string;
};

// ----------------------------------------------------------------------

export type IUserProfileEducation = {
  medicalSchool: { name: string; year: string };
  recidency: { name: string; year: string };
  fellowship1: { name: string; year: string };
  fellowship2: { name: string; year: string };
};

// ----------------------------------------------------------------------

export type IUserProfileSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

// ----------------------------------------------------------------------

export type IUserProfileInformation = {
  employment: {
    occupation: string;
    employerName: string;
    employerAddress: string;
    employerNumber: string;
  };
  emergency: {
    name: string;
    address: string;
    phoneNumber: string;
    relationship: string;
  };
  physician: {
    referringPhysician: string;
    primaryPhysician: string;
    otherPhysician: string;
  };
};

// ----------------------------------------------------------------------

export type IUserProfileHmo = {
  id: string;
  name: string;
  mid: string;
};

// ----------------------------------------------------------------------

export type IUserClinicTableFilters = {
  name: string;
  status: number;
};

export type IUserClinicItem = {
  id: string;
  hospital: IHospital;
  schedule: ISchedule[];
};

// ----------------------------------------------------------------------

export type IUserService = {
  professionalFee: { price: number; isViewable: boolean };
  additionalFee: {
    certificate: number;
    clearance: number;
    abstract: number;
    isViewable: boolean;
  };
  paymentSchedule: boolean;
  hmo: { name: string; icon: string }[];
  paymentMethod: {
    id: string;
    name: string;
    accountNumber: string;
    instruction: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserSubaccountTableFilters = {
  name: string;
  status: number;
};

export type IUserSubaccountItem = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date | number;
  gender: string;
  position: string;
  status: boolean;
  avatarUrl: string;
  coverUrl: string;
  password: string;
  permission: {
    appointment: string[];
    record: string[];
    hmo: string[];
  };
  log: {
    id: string;
    fullName: string;
    avatarUrl: string;
    date: Date | number;
    type: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserClinicNewFormValues = {
  name: string;
  phoneNumber: string;
  address: string;
  province: string;
  avatarUrl: string;
  coverUrl: string;
  type: string[];
  day: string[];
  startTime: Date | string;
  endTime: Date | string;
  duration: string;
};
