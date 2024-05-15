//
import { lowerCase, snakeCase } from 'lodash';
import { _mock } from './_mock';
import { randomInArray, randomNumberRange } from './funcs';
import { HMO_OPTIONS, _hospitals, _schedules } from './_general';
import { _imagingList, _noteList } from './_document';
import { _patientVital } from './_patient';
import { _appointmentList } from './_appointment';

// ----------------------------------------------------------------------

export const _userProfile = {
  id: _mock.id(1),
  firstName: _mock.firstName(1),
  lastName: _mock.lastName(1),
  middleName: _mock.lastName(2),
  username: snakeCase(_mock.fullName(1)),
  slug: `${lowerCase(_mock.firstName(1))}_${lowerCase(_mock.lastName(1))}`,
  email: _mock.email(1),
  phoneNumber: _mock.phoneNumber(1),
  password: `demo1234`,
  suffix: 'Jr.',
  gender: 'male',
  nationality: 'Filipino',
  address: _mock.fullAddress(1),
  birthDate: _mock.time(1),
  age: _mock.number.age(1),
  avatarUrl: _mock.image.avatar(1),
  coverUrl: _mock.image.cover(1),
};

export const _userProfilePortfolio = {
  specialty: _mock.jobTitle(1),
  subSpecialty: _mock.jobTitle(2),
  title: 'MD, FPSPEM',
  signatureUrl: 'https://peppy-rabanadas-893ad1.netlify.app/assets/samplesign.png',
};

export const _userProfileLicense = {
  prcNumber: _mock.phoneNumber(2),
  prcExpiry: _mock.time(2),
  ptrNumber: _mock.phoneNumber(3),
  s2Number: _mock.phoneNumber(4),
  since: '2010',
};

export const _userProfileEducation = {
  medicalSchool: { name: _mock.companyName(1), year: '1998' },
  recidency: { name: _mock.companyName(2), year: '2003' },
  fellowship1: { name: _mock.companyName(3), year: '2005' },
  fellowship2: { name: _mock.companyName(4), year: '2007' },
};

export const _userProfileSocialLink = {
  facebook: `https://www.facebook.com/caitlyn.kerluke`,
  instagram: `https://www.instagram.com/caitlyn.kerluke`,
  linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
  twitter: `https://www.twitter.com/caitlyn.kerluke`,
};

export const _userProfileInformation = {
  employment: {
    occupation: _mock.jobTitle(1),
    employerName: 'Minimal-UI',
    employerAddress: _mock.fullAddress(1),
    employerNumber: _mock.phoneNumber(1),
  },
  emergency: {
    name: _mock.fullName(1),
    address: _mock.fullAddress(2),
    phoneNumber: _mock.phoneNumber(3),
    relationship: 'Father',
  },
  physician: {
    referringPhysician: _mock.fullName(2),
    primaryPhysician: _mock.fullName(3),
    otherPhysician: _mock.fullName(4),
  },
};

export const _userProfileHmo = [...Array(randomNumberRange(1, 3))].map((_, index) => ({
  id: _mock.id(index),
  name: randomInArray(HMO_OPTIONS.flatMap((_h) => [_h.name])),
  mid: `${12529 + index}`,
}));

export const _userClinic = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  hospital: _hospitals[randomNumberRange(0, 19)],
  schedule: [...Array(randomNumberRange(1, 5))].map((_s) => _schedules[randomNumberRange(0, 19)]),
}));

export const _userService = {
  professionalFee: { price: _mock.number.price(1), isViewable: _mock.boolean(1) },
  additionalFee: {
    certificate: _mock.number.price(1),
    clearance: _mock.number.price(2),
    abstract: _mock.number.price(3),
    isViewable: _mock.boolean(1),
  },
  paymentSchedule: _mock.boolean(1),
  hmo: [...Array(randomNumberRange(1, 10))].map(() => HMO_OPTIONS[randomNumberRange(0, 18)]),
  paymentMethod: [...Array(randomNumberRange(1, 5))].map((_, index) => ({
    id: _mock.id(index),
    name: randomInArray(['BDO', 'BPI', 'Philam', 'G-Cash', 'PayMaya']),
    accountNumber: _mock.phoneNumber(index),
    instruction: _mock.description(index),
  })),
};

export const _userSubaccount = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  firstName: _mock.firstName(index),
  lastName: _mock.lastName(index),
  middleName: _mock.lastName(index + 1),
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
  birthDate: _mock.time(index),
  gender: randomInArray(['male', 'female', 'unspecified']),
  position: _mock.role(index),
  status: randomInArray([true, false]),
  avatarUrl: _mock.image.avatar(index),
  coverUrl: _mock.image.cover(index),
  password: _mock.firstName(index),
  permission: {
    appointment: [...Array(randomNumberRange(0, 5))].map(
      (_a, i) =>
        [
          'approved_appointments',
          'cancel_appointments',
          'done_appointments',
          'change_appointment_type',
          'change_appointment_status',
        ][i]
    ),
    record: [...Array(randomNumberRange(0, 2))].map(
      (_r, i) => ['upload_result', 'view_prescriptions'][i]
    ),
    hmo: [...Array(randomNumberRange(0, 1))].map((_h, i) => ['export_result'][i]),
  },
  log: [...Array(20)].map((_ll, i) => ({
    id: _mock.id(i),
    fullName: _mock.fullName(i),
    avatarUrl: _mock.image.avatar(i),
    date: _mock.time(i),
    type: randomInArray(['appointment status', 'lab and imaging result']),
  })),
}));

export const _userRecord = {
  note: [...Array(10)].map((_) => _noteList[randomNumberRange(0, 19)]),
  imaging: [...Array(10)].map((_) => _imagingList[randomNumberRange(0, 19)]),
  vital: _patientVital[randomNumberRange(0, 19)],
  history: [...Array(10)].map((_) => _appointmentList[randomNumberRange(0, 19)]),
};
