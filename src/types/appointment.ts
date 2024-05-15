import { IPatient, IDoctor, IHospital, ISchedule } from './general';

// ----------------------------------------------------------------------

export type IAppointmentTableFilterValue = string | string[] | Date | null;

export type IAppointmentTableFilters = {
  name: string;
  status: string | number;
  hospital: string[];
  startDate: Date | null;
  endDate: Date | null;
  type?: any;
};

export type IAppointmentItem = {
  id: string;
  patient: IPatient;
  doctor: IDoctor;
  hospital: IHospital;
  date: Date | number;
  schedule: Date | number;
  type: string;
  status: string;
  isPaid: boolean;
  remark?: string | any;
  complaint: {
    chief: string[];
    other: string;
  };
  request: {
    professionalFee: number;
    medicalCertificate: number;
    medicalClearance: number;
    medicalAbstract: number;
    other: string;
  };
  hmo: {
    name: string;
    memberId: string;
  } | null;
  loa: string[] | null;
};

// ----------------------------------------------------------------------

export type IAppointmentApprovedItem = {
  id: string;
  hospital: string;
  hospitalAvatarUrl: string;
  address: string;
  count: number;
};

// ----------------------------------------------------------------------

export type IAppointmentFindTableFilterValue = string | string[];

export type IAppointmentFindTableFilters = {
  name: string;
  hospital: string;
  specialty: string;
  hmo: any;
};

export type IAppointmentFindItem = {
  id: string;
  doctor: IDoctor;
  schedule: {
    id: string;
    key: ISchedule;
    hospital: IHospital;
  }[];
};

// ----------------------------------------------------------------------

export type IAppointmentFormValue = {
  location: {
    id: string;
    key: ISchedule;
    hospital: IHospital;
  } | null;
  type: string;
  typeAgreement: boolean;
  scheduleDate: Date | number;
  scheduleTime: Date | number;
  chiefComplaint: string[];
  cheifOther: string;
  additionalRequest: string[];
  additionalOther: string;
  useHmo: boolean;
  hmo: {
    name: string;
    mid: string;
    attachment: string;
  };
  agreement: boolean;
};

// ----------------------------------------------------------------------

export type IAppointmentBookCover = {
  name: string;
  job: string;
  email: string;
  coverUrl: string;
  avatarUrl?: string;
};
