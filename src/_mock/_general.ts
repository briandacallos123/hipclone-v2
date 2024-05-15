//
import { lowerCase } from 'lodash';
import { _mock } from './_mock';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const HOSPITAL_OPTIONS = [
  'AP Global Clinic',
  'Antipolo General Hospital',
  'Mediko Kapitolyo - Antipolo',
  'Mediko Kapitolyo - Pasig',
  'Our Lady of Fatima Hospital - Valenzuela',
  'Our Lady of Fatima Hospital - Antipolo',
];

// export const HMO_OPTIONS = [
//   'AsianCare Health Systems, Inc.',
//   'Cocolife',
//   'Dynamic Care Corporation',
//   'Eastwest Healthcare, Inc.',
//   'Health Plan Philippines, Inc. (HPPI)',
//   'HMI',
//   'Insular Health Care, Inc. (formerly iCare)',
//   'Intellicare',
//   'Kaiser International Healthgroup, Inc.',
//   'Life & Health HMP, Inc.',
//   'Maxicare',
//   'Medicard',
//   'Medicare Plus, Inc. (formerly Prudentaillife Healthcare, Inc.)',
//   'MedoCare Health Systems, Inc.',
//   'MetroCare Healthcare Systems, Inc.',
//   'Optimum Medical and Healthcare Services, Inc.',
//   'Pacific Cross Health Care, Inc.',
//   'Philcare Philhealth Care, Inc. (formerly Philamcare)',
//   'Valucare',
// ];

export const HMO_OPTIONS = [
  {
    name: 'AsianCare Health Systems, Inc.',
    icon: '/assets/icons/hmo/asiancare-health-systems.jpg',
  },
  {
    name: 'Cocolife',
    icon: '/assets/icons/hmo/cocolife.jpg',
  },
  {
    name: 'Dynamic Care Corporation',
    icon: '/assets/icons/hmo/dynamic-care-corporation.jpg',
  },
  {
    name: 'Eastwest Healthcare, Inc.',
    icon: '/assets/icons/hmo/eastwest-healthcare.jpg',
  },
  {
    name: 'Health Plan Philippines, Inc. (HPPI)',
    icon: '/assets/icons/hmo/health-plan-philippines.jpg',
  },
  {
    name: 'HMI',
    icon: '/assets/icons/hmo/hmi.jpg',
  },
  {
    name: 'Insular Health Care, Inc. (formerly iCare)',
    icon: '/assets/icons/hmo/insular-health-care.jpg',
  },
  {
    name: 'Intellicare',
    icon: '/assets/icons/hmo/intellicare.jpg',
  },
  {
    name: 'Kaiser International Healthgroup, Inc.',
    icon: '/assets/icons/hmo/kaiser-international-healthgroup.jpg',
  },
  {
    name: 'Life & Health HMP, Inc.',
    icon: '/assets/icons/hmo/life-&-health-hmp.jpg',
  },
  {
    name: 'Maxicare',
    icon: '/assets/icons/hmo/maxicare.jpg',
  },
  {
    name: 'Medicard',
    icon: '/assets/icons/hmo/medicard.jpg',
  },
  {
    name: 'Medicare Plus, Inc. (formerly Prudentaillife Healthcare, Inc.)',
    icon: '/assets/icons/hmo/medicare-plus.jpg',
  },
  {
    name: 'MedoCare Health Systems, Inc.',
    icon: '/assets/icons/hmo/medocare-health-systems.jpg',
  },
  {
    name: 'MetroCare Healthcare Systems, Inc.',
    icon: '/assets/icons/hmo/metrocare-healthcare-systems.jpg',
  },
  {
    name: 'Optimum Medical and Healthcare Services, Inc.',
    icon: '/assets/icons/hmo/optimum-medical-and-healthcare-services.jpg',
  },
  {
    name: 'Pacific Cross Health Care, Inc.',
    icon: '/assets/icons/hmo/pacific-cross-health-care.jpg',
  },
  {
    name: 'Philcare Philhealth Care, Inc. (formerly Philamcare)',
    icon: '/assets/icons/hmo/philcare-philhealth-care.jpg',
  },
  {
    name: 'Valucare',
    icon: '/assets/icons/hmo/valucare.jpg',
  },
];

// ----------------------------------------------------------------------

export const _doctors = [...Array(20)].map((_, index) => ({
  firstNameid: _mock.id(index),
  firstName: _mock.firstName(index),
  id: index,
  lastName: _mock.lastName(index),
  middleName: _mock.lastName(index + 1),
  slug: `${lowerCase(_mock.firstName(index))}_${lowerCase(_mock.lastName(index))}`,
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
  suffix: randomInArray(['jr.', 'sr.', 'I', 'II', 'III']),
  gender: randomInArray(['male', 'female', 'unspecified']),
  nationality: 'Filipino',
  address: _mock.fullAddress(index),
  birthDate: _mock.time(index),
  age: _mock.number.age(index),
  avatarUrl: _mock.image.avatar(randomNumberRange(0, 23)),
  coverUrl: _mock.image.cover(randomNumberRange(0, 23)),
  //
  specialty: _mock.jobTitle(index),
  subSpecialty: _mock.jobTitle(index + 1),
  title: randomInArray(['MD', 'MD, FPPS', ' MD, FSPCCMP', 'MD, DPPS', 'MD, FPSPEM']),
  signature: '/assets/samples/sample_sign.png',
  license: {
    prcNumber: _mock.phoneNumber(index + 1),
    prcExpiry: _mock.time(index + 1),
    ptrNumber: _mock.phoneNumber(index + 2),
    s2Number: _mock.phoneNumber(index + 3),
    since: `${randomNumberRange(1990, 2010)}`,
  },
  //
  professionalFee: { price: _mock.number.price(index), isViewable: _mock.boolean(index) },
  additionalFee: {
    certificate: _mock.number.price(index),
    clearance: _mock.number.price(index + 1),
    abstract: _mock.number.price(index + 2),
    isViewable: _mock.boolean(index),
  },
  hmo: [...Array(randomNumberRange(1, 10))].map(() => HMO_OPTIONS[randomNumberRange(0, 18)]),
  //
  rating: _mock.number.percent(index),
  facebookLink: `https://www.facebook.com/${lowerCase(_mock.firstName(index))}.${lowerCase(
    _mock.lastName(index)
  )}`,
  instagramLink: `https://www.instagram.com/${lowerCase(_mock.firstName(index))}.${lowerCase(
    _mock.lastName(index)
  )}`,
  linkedinLink: `https://www.linkedin.com/in/${lowerCase(_mock.firstName(index))}.${lowerCase(
    _mock.lastName(index)
  )}`,
  twitterLink: `https://www.twitter.com/${lowerCase(_mock.firstName(index))}.${lowerCase(
    _mock.lastName(index)
  )}`,
}));

// ----------------------------------------------------------------------

export const _patients = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  firstName: _mock.firstName(index),
  lastName: _mock.lastName(index),
  middleName: _mock.lastName(index + 1),
  slug: `${lowerCase(_mock.firstName(index))}_${lowerCase(_mock.lastName(index))}`,
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
  suffix: randomInArray(['jr.', 'sr.', 'I', 'II', 'III']),
  gender: randomInArray(['male', 'female', 'unspecified']),
  nationality: 'Filipino',
  address: _mock.fullAddress(index),
  birthDate: _mock.time(index),
  birthPlace: _mock.fullAddress(index + 1),
  age: _mock.number.age(index),
  bloodType: randomInArray(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  civilStatus: randomInArray(['single', 'married', 'separated', 'widowed']),
  avatarUrl: _mock.image.avatar(randomNumberRange(0, 23)),
  coverUrl: _mock.image.cover(randomNumberRange(0, 23)),
  //
  employmentInfo: {
    occupation: _mock.jobTitle(index),
    employerName: 'Minimal-UI',
    employerAddress: _mock.fullAddress(index),
    employerNumber: _mock.phoneNumber(index),
  },
  emergencyInfo: {
    name: _mock.fullName(index),
    address: _mock.fullAddress(index + 1),
    phoneNumber: _mock.phoneNumber(index + 1),
    relationship: randomInArray(['Father', 'Mother', 'Sibling']),
  },
  physicianInfo: {
    referringPhysician: _mock.fullName(index + 1),
    primaryPhysician: _mock.fullName(index + 2),
    otherPhysician: _mock.fullName(index + 3),
  },
  hmo: [...Array(randomNumberRange(3, 5))].map((_h, i) => ({
    id: _mock.id(i),
    name: randomInArray(HMO_OPTIONS.flatMap((_hh) => [_hh.name])),
    mid: `${17048 + index}`,
  })),
}));

// ----------------------------------------------------------------------

export const _hospitals = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: randomInArray(HOSPITAL_OPTIONS),
  phoneNumber: _mock.phoneNumber(index),
  address: _mock.fullAddress(index),
  province: randomInArray(['Abra', 'Bataan', 'Cagayan']),
  avatarUrl: _mock.image.avatar(randomNumberRange(0, 23)),
  coverUrl: _mock.image.cover(randomNumberRange(0, 23)),
}));

// ----------------------------------------------------------------------

export const _schedules = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  type: [...Array(randomNumberRange(1, 2))].map((_t, i) => ['face-to-face', 'telemedicine'][i]),
  day: [...Array(randomNumberRange(1, 7))].map((_d, i) => [0, 1, 2, 3, 4, 5, 6][i]),
  startTime: _mock.time(index),
  endTime: _mock.time(index + 1),
  duration: randomInArray(['15', '30', '45', '60']),
}));

export const staticSpec = [
  'ALLERGOLOGIST',
  'ANESTHESIOLOGIST',
  'CARDIOLOGIST',
  'DERMATOLOGIST',
  'DIABETOLOGIST',
  'EMERGENCY MEDICINE',
  'ENDOCRINOLOGIST',
  'ENT (OTOLARYNGOLOGY)',
  'FAMILY MEDICINE',
  'GASTROENTEROLOGIST',
  'GENERAL PRACTITIONER',
  'GENERAL SURGEON',
  'GERIATRICS',
  'GERONTOLOGIST',
  'HEMATOLOGIST',
  'INTERNAL MEDICINE',
  'IMMUNOLOGIST',
  'INFECTIOUS DISEASE',
  'NEONATOLOGIST',
  'NEPHROLOGIST',
  'NEURO SURGEON',
  'NEUROLOGIST',
  'NEUROSURGEON',
  'OB-GYNE',
  'ONCOLOGIST',
  'OPHTHALMOLOGIST',
  'ORTHOPEDIC SURGEON',
  'PAIN SPECIALIST',
  'PEDIATRIC ALLERGOLOGISTS',
  'PEDIATRIC CARDIOLOGIST',
  'PEDIATRIC DEVELOPMENTAL',
  'PEDIATRIC ENDOCRINOLOGIST',
  'PEDIATRIC ENT ',
  'PEDIATRIC GASTROENTEROLOGIST',
  'PEDIATRICS',
  'PEDIATRIC HEMATOLOGIST',
  'PEDIATRIC HEMATOLOGY-ONCOLOGY',
  'PEDIATRIC INFECTIOUS DISEASE',
  'PEDIATRIC INTENSIVIST',
  'PEDIATRIC NEPHROLOGIST',
  'PEDIATRIC NEUROLOGIST',
  'PEDIATRIC PULMONOLOGIST',
  'PEDIATRIC SURGEON',
  'PSYCHIATRIST',
  'PULMONOLOGIST',
  'RADIOLOGIST',
  'REHAB MEDICINE',
  'RHEUMATOLOGIST',
  'THORACIC AND CARDIOVASCULAR SURGEON',
  'UROLOGIST',
];

export const staticClinic = [
  'ABRA',
  'AGUSAN DEL NORTE',
  'AGUSAN DEL SUR',
  'AKLAN',
  'ALBAY',
  'ANTIQUE',
  'APAYAO',
  'AURORA',
  'BASILAN',
  'BATAAN',
  'BATANES',
  'BATANGAS',
  'BENGUET',
  'BILIRAN',
  'BOHOL',
  'BUKIDNON',
  'BULACAN',
  'CAGAYAN',
  'CAMARINES NORTE',
  'CAMARINES SUR',
  'CAMIGUIN',
  'CAPIZ',
  'CATANDUANES',
  'CAVITE',
  'CEBU',
  'COTABATO',
  'DAVAO DE ORO',
  'DAVAO DEL NORTE',
  'DAVAO DEL SUR',
  'DAVAO OCCIDENTAL',
  'DAVAO ORIENTAL',
  'DINAGAT ISLANDS',
  'EASTERN SAMAR',
  'GUIMARAS',
  'IFUGAO',
  'ILOCOS NORTE',
  'ILOCOS SUR',
  'ILOILO',
  'ISABELA',
  'KALINGA',
  'LA UNION',
  'LAGUNA',
  'LANAO DEL NORTE',
  'LANAO DEL SUR',
  'LEYTE',
  'MAGUINDANAO',
  'MARINDUQUE',
  'MASBATE',
  'METRO MANILA',
  'MISAMIS OCCIDENTAL',
  'MISAMIS ORIENTAL',
  'MOUNTAIN PROVINCE',
  'NEGROS OCCIDENTAL',
  'NEGROS ORIENTAL',
  'NORTHERN SAMAR',
  'NUEVA ECIJA',
  'NUEVA VIZCAYA',
  'OCCIDENTAL MINDORO',
  'ORIENTAL MINDORO',
  'PALAWAN',
  'PAMPANGA',
  'PANGASINAN',
  'QUEZON',
  'QUIRINO',
  'RIZAL',
  'ROMBLON',
  'SAMAR',
  'SARANGANI',
  'SIQUIJOR',
  'SORSOGON',
  'SOUTH COTABATO',
  'SOUTHERN LEYTE',
  'SULTAN KUDARAT',
  'SULU',
  'SURIGAO DEL NORTE',
  'SURIGAO DEL SUR',
  'TARLAC',
  'TAWI-TAWI',
  'ZAMBALES',
  'ZAMBOANGA DEL NORTE',
  'ZAMBOANGA DEL SUR',
  'ZAMBOANGA SIBUGAY',
];

export const staticHMO = [
  {
    id: 1,
    title: 'Asian Health System Inc.',
  },
  {
    id: 2,
    title: 'Cocolife',
  },
  {
    id: 3,
    title: 'Dynamic Care Corporation',
  },
  {
    id: 4,
    title: 'Eastwest Healthcare Inc.',
  },
  {
    id: 5,
    title: 'Health Plan Philippines, Inc. (HPPI)',
  },
  {
    id: 6,
    title: 'HMI',
  },
  {
    id: 7,
    title: 'Insular Health Care, Inc. (Formerly ICare)',
  },
  {
    id: 8,
    title: 'Intellicare',
  },
  {
    id: 9,
    title: 'Kaiser International Healthgroup, Inc.',
  },
  {
    id: 10,
    title: 'Life & Health HMP, Inc.',
  },
  {
    id: 11,
    title: 'Maxicare',
  },
  {
    id: 12,
    title: 'Medicard',
  },
  {
    id: 13,
    title: 'Medicard Plus, Inc. (Formerly Prudentiallife Health Care, Inc.',
  },
  {
    id: 14,
    title: 'MedoCare Health System, Inc.',
  },
  {
    id: 15,
    title: 'MetroCare Health Care System, Inc. ',
  },
  {
    id: 16,
    title: 'Optimum Medical And Healthcare Services, Inc.',
  },
  {
    id: 17,
    title: 'Pacific Cross Health Care, Inc.',
  },
  {
    id: 18,
    title: 'Philcare PhilHealth Care, Inc. (Formerly Philamcare)',
  },
  {
    id: 19,
    title: 'Valucare',
  },
];
