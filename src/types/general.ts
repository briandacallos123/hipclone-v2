export type IDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  suffix: string;
  gender: string;
  nationality: string;
  address: string;
  birthDate: Date | number;
  age: number;
  avatarUrl: string;
  coverUrl: string;
  //
  specialty: string;
  subSpecialty: string;
  title: string;
  signature: string;
  license: {
    prcNumber: string;
    prcExpiry: Date | number;
    ptrNumber: string;
    s2Number: string;
    since: string;
  };
  //
  professionalFee: { price: number; isViewable: boolean };
  additionalFee: {
    certificate: number;
    clearance: number;
    abstract: number;
    isViewable: boolean;
  };
  hmo: string[];
  //
  rating: number;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

// ----------------------------------------------------------------------

export type IPatient = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  suffix: string;
  gender: string;
  nationality: string;
  address: string;
  birthDate: Date | number;
  birthPlace: string;
  age: number;
  bloodType: string;
  civilStatus: string;
  avatarUrl: string;
  coverUrl: string;
  //
  employmentInfo: {
    occupation: string;
    employerName: string;
    employerAddress: string;
    employerNumber: string;
  };
  emergencyInfo: {
    name: string;
    address: string;
    phoneNumber: string;
    relationship: string;
  };
  physicianInfo: {
    referringPhysician: string;
    primaryPhysician: string;
    otherPhysician: string;
  };
  hmo: {
    id: string;
    name: string;
    mid: string;
  }[];
};

// ----------------------------------------------------------------------

export type IHospital = {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  province: string;
  avatarUrl: string;
  coverUrl: string;
};

// ----------------------------------------------------------------------

export type ISchedule = {
  id: string;
  type: string[];
  day: number[];
  startTime: Date | number;
  endTime: Date | number;
  duration: string;
};

// ----------------------------------------------------------------------

export type IDashboardCover = {
  uname: string;
  name: string;
  job: string;
  title: string;
  specialty: string;

  email: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IQueueCover = {
  name: string;
  address: string;
  coverUrl: string;
  avatarUrl: string;
};
