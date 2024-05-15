//
import { _mock } from './_mock';
import { _prescriptionList } from './_prescription';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _noteSoapList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  // ------ SUBJECTIVE
  chiefComplaint: _mock.sentence(index),
  history: _mock.description(index),
  // ------ OBJECTIVE
  vital: {
    weight: _mock.number.age(index),
    height: _mock.number.age(index + 1),
    bodyMass: _mock.number.nativeM(index),
    bloodPressureMm: _mock.number.nativeS(index),
    bloodPressureHg: _mock.number.nativeS(index + 1),
    oxygen: _mock.number.age(index + 2),
    respiratory: _mock.number.age(index + 3),
    heartRate: _mock.number.nativeS(index + 2),
    temperature: _mock.number.nativeS(index + 3),
  },
  vision: {
    visionLeft: _mock.number.nativeS(index),
    visionRight: _mock.number.nativeS(index + 1),
    pupil: randomInArray(['equal', 'unequal']),
    lense: _mock.boolean(index),
  },
  hearing: randomInArray(['normal', 'impaired', 'aided']),
  examination: {
    bmi: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    skin: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    heent: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    teeth: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    neck: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    lung: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    heart: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    abdomen: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    guSystem: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    musculoskeletal: {
      option: randomInArray(['normal', 'abnormal']),
      comment: _mock.sentence(index),
    },
    back: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    neurological: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
    psychiatric: { option: randomInArray(['normal', 'abnormal']), comment: _mock.sentence(index) },
  },
  remarkObjective: [...Array(randomNumberRange(1, 3))].map((_ro, i) => ({
    message: _mock.description(i),
  })),
  // ------ ASSESSMENT
  diagnosis: _mock.description(index),
  remarkAssessment: [...Array(randomNumberRange(1, 3))].map((_ra, i) => ({
    message: _mock.description(i),
  })),
  // ------ PLAN
  plan: _mock.description(index),
  prescriptions: [...Array(randomNumberRange(1, 3))].map(
    (_p) => _prescriptionList[randomNumberRange(0, 19)]
  ),
  remarkPlan: [...Array(randomNumberRange(1, 3))].map((_rp, i) => ({
    message: _mock.description(i),
  })),
}));

export const _noteTextList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  date: _mock.time(index),
  remark: _mock.sentence(index),
  attachments: [...Array(randomNumberRange(1, 5))].map((_a, i) => _mock.image.product(i)),
}));

export const _noteLaboratoryList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  selection: [...Array(randomNumberRange(10, 24))].map((_s, i) => _mock.jobTitle(i)),
  fastingHour: randomInArray(['6-8 hours', '8-10 hours', '10-12 hours']),
  other: _mock.description(index),
}));

export const _noteCertificateList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patientType: randomInArray(['in-patient', 'out-patient']),
  date: _mock.time(index + 2),
  startDate: _mock.time(index),
  endDate: _mock.time(index + 1),
  diagnosis: _mock.sentence(index),
  day: _mock.number.nativeS(index),
  recommendation: _mock.sentence(index),
}));

export const _noteClearanceList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  date: _mock.time(index + 1),
  dateExamined: _mock.time(index),
  remark: _mock.sentence(index),
}));

export const _noteAbstractList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  complaint: _mock.sentence(randomNumberRange(0, 23)),
  history: _mock.sentence(randomNumberRange(0, 23)),
  review: _mock.sentence(randomNumberRange(0, 23)),
  medicalHistory: _mock.sentence(randomNumberRange(0, 23)),
  personalHistory: _mock.sentence(randomNumberRange(0, 23)),
  examination: _mock.sentence(randomNumberRange(0, 23)),
  result: _mock.sentence(randomNumberRange(0, 23)),
  finding: _mock.sentence(randomNumberRange(0, 23)),
  diagnosis: _mock.sentence(randomNumberRange(0, 23)),
  complication: _mock.sentence(randomNumberRange(0, 23)),
  procedure: _mock.sentence(randomNumberRange(0, 23)),
  treatment: _mock.sentence(randomNumberRange(0, 23)),
}));

export const _noteVaccineList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  date: _mock.time(index),
  diagnosis: _mock.sentence(index),
  option: randomInArray(['option_1', 'option_2', 'option_3']),
}));
