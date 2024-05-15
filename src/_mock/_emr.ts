//
import { _mock } from './_mock';
import { _patients } from './_general';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _emrList = [...Array(20)].map((_, index) => {
  const linkedAccount = _mock.boolean(index) ? _patients[randomNumberRange(0, 19)] : null;

  return {
    id: _mock.id(index),
    firstName: _mock.firstName(index),
    lastName: _mock.lastName(index),
    middleName: _mock.lastName(index + 1),
    email: _mock.email(index),
    phoneNumber: _mock.phoneNumber(index),
    suffix: randomInArray(['Jr.', 'Sr.', 'I', 'II', 'III']),
    gender: randomInArray(['male', 'female', 'unspecified']),
    address: _mock.fullAddress(index),
    birthDate: _mock.time(index),
    civilStatus: randomInArray(['single', 'married', 'separated', 'widowed']),
    status: _mock.boolean(index),
    linkedAccount,
  };
});
