//
import { _mock } from './_mock';
import { _doctors, _hospitals, _schedules } from './_general';
import { randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _doctorList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  doctor: _doctors[index],
  schedule: [...Array(randomNumberRange(1, 5))].map((_s, i) => ({
    id: _mock.id(i),
    key: _schedules[randomNumberRange(0, 19)],
    hospital: _hospitals[randomNumberRange(0, 19)],
  })),
}));
