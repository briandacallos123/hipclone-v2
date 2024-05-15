//
import { _mock } from './_mock';
import { _patients, _hospitals, HOSPITAL_OPTIONS, HMO_OPTIONS, _doctors } from './_general';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _appointmentList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patient: _patients[randomNumberRange(0, 19)],
  doctor: _doctors[randomNumberRange(0, 19)],
  hospital: _hospitals[randomNumberRange(0, 19)],
  date: _mock.time(index),
  schedule: _mock.time(index + 1),
  type: randomInArray(['telemedicine', 'face-to-face']),
  status: randomInArray(['pending', 'approved', 'done', 'cancelled']),
  isPaid: _mock.boolean(index),
  remark: _mock.sentence(index),
  complaint: {
    chief: [...Array(randomNumberRange(1, 5))].map(() => _mock.taskNames(randomNumberRange(0, 23))),
    other: _mock.description(index + 1),
  },
  request: {
    professionalFee: _mock.number.price(index),
    medicalCertificate: _mock.number.price(index + 1),
    medicalClearance: _mock.number.price(index + 2),
    medicalAbstract: _mock.number.price(index + 3),
    other: _mock.description(index + 1),
  },
  hmo: randomInArray([
    null,
    {
      name: randomInArray(HMO_OPTIONS.flatMap((_hh) => _hh.name)),
      memberId: `${17048 + index}`,
    },
  ]),
  loa: randomInArray([
    null,
    [...Array(randomNumberRange(1, 5))].map((_l, i) => _mock.image.product(i)),
  ]),
}));

export const _appointmentApprovedList = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  hospital: randomInArray(HOSPITAL_OPTIONS),
  hospitalAvatarUrl: _mock.image.avatar(index),
  address: _mock.fullAddress(index),
  count: randomNumberRange(0, 10),
}));
