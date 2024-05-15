//
import { _mock } from './_mock';
import { _doctors, _hospitals, _patients } from './_general';
import { randomInArray, randomNumberRange } from './funcs';
import { _noteTextList } from './_note';

// ----------------------------------------------------------------------

export const _noteList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patientId: _patients[randomNumberRange(0, 19)].id,
  noteNumber: `${17048 + index}`,
  doctor: {
    id: _doctors[randomNumberRange(0, 19)].id,
    clinic: [...Array(randomNumberRange(1, 7))].map((_c) => _hospitals[randomNumberRange(0, 19)]),
  },
  type: randomInArray([
    'soap',
    'text',
    'laboratory',
    'certificate',
    'clearance',
    'abstract',
    'vaccine',
  ]),
  date: _mock.time(index),
  hospitalId: _hospitals[randomNumberRange(0, 19)].id,
  documentId: _mock.id(index),
}));

export const _imagingList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  patientId: _patients[randomNumberRange(0, 19)].id,
  imageNumber: `${37048 + index}`,
  doctor: {
    id: _doctors[randomNumberRange(0, 19)].id,
    clinic: [...Array(randomNumberRange(1, 7))].map((_c) => _hospitals[randomNumberRange(0, 19)]),
  },
  labName: _mock.firstName(index),
  type: randomInArray(['auscultation (any organ)']),
  date: _mock.time(index),
  attachment: [...Array(randomNumberRange(1, 5))].map((_a, i) => _mock.image.product(i)),
  hospitalId: _hospitals[randomNumberRange(0, 19)].id,
}));
