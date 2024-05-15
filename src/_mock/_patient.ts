//
import { _mock } from './_mock';
import { _hospitals, _patients } from './_general';
import { randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

const CHART_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// ----------------------------------------------------------------------

export const _patientProfile = [...Array(20)].map((_) => ({
  medication: [...Array(randomNumberRange(1, 5))].map((_m, i) => ({
    id: _mock.id(i),
    name: _mock.taskNames(i),
  })),
  medical: [...Array(randomNumberRange(1, 5))].map((_m, i) => ({
    id: _mock.id(i),
    name: _mock.tourName(i),
  })),
  allergy: [...Array(randomNumberRange(1, 5))].map((_a, i) => ({
    id: _mock.id(i),
    name: _mock.taskNames(i + 1),
  })),
  family: [...Array(randomNumberRange(1, 5))].map((_f, i) => ({
    id: _mock.id(i),
    name: _mock.tourName(i + 1),
  })),
  smoking: [...Array(randomNumberRange(1, 5))].map((_s, i) => ({
    id: _mock.id(i),
    name: _mock.taskNames(i + 2),
  })),
}));

export const _patientVital = [...Array(20)].map((_) => ({
  weight: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'kg',
        data: [...Array(12)].map((_w) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  height: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'cm',
        data: [...Array(12)].map((_h) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  mass: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'kg/m2',
        data: [...Array(12)].map((_m) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  blood: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'mm',
        data: [...Array(12)].map((_bm) => _mock.number.age(randomNumberRange(0, 13))),
      },
      {
        name: 'Hg',
        data: [...Array(12)].map((_bh) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  oxygen: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'percentage',
        data: [...Array(12)].map((_o) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  respiratory: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'breathes per minutes',
        data: [...Array(12)].map((_r) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  heart: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'bpm',
        data: [...Array(12)].map((_h) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
  temperature: {
    categories: CHART_MONTHS,
    data: [
      {
        name: 'Celcius',
        data: [...Array(12)].map((_t) => _mock.number.age(randomNumberRange(0, 13))),
      },
    ],
  },
}));

export const _patientList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patient: _patients[index],
  hospital: _hospitals[index],
  profile: _patientProfile[randomNumberRange(0, 19)],
  vital: _patientVital[randomNumberRange(0, 19)],
}));
