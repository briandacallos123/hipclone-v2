//
import { _mock } from './_mock';
import { _doctors, _hospitals, _patients } from './_general';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _prescriptionList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patientId: _patients[randomNumberRange(0, 19)].id,
  doctor: {
    id: _doctors[randomNumberRange(0, 19)].id,
    clinic: [...Array(randomNumberRange(1, 7))].map((_c) => _hospitals[randomNumberRange(0, 19)]),
  },
  prescriptionNumber: `${17048 + index}`,
  date: _mock.time(index),
  upDate: _mock.time(index + 1),
  remark: _mock.sentence(index),
  items: [...Array(randomNumberRange(1, 10))].map((_i, i) => ({
    id: _mock.id(i),
    genericName: _mock.fullName(i),
    brand: _mock.firstName(i),
    dosage: _mock.number.nativeM(i),
    form: randomInArray(['tablet', 'bottle', 'capsule']),
    quantity: _mock.number.nativeS(i),
    frequency: _mock.number.age(i),
    duration: _mock.number.nativeS(i + 2),
  })),
  hospitalId: _hospitals[randomNumberRange(0, 19)].id,
}));
