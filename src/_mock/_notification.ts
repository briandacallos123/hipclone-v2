//
import { _mock } from './_mock';
import { randomInArray } from './funcs';

// ----------------------------------------------------------------------

export const _notificationAppointment = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
  type: randomInArray(['telemedicine', 'face-to-face']),
}));

export const _notificationChat = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
}));

export const _notificationMessage = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
}));

export const _notificationCalendar = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
  type: randomInArray(['birthday', 'appointment']),
}));

export const _notificationPatient = [...Array(9)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
}));

export const _notificationEmr = [...Array(2)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
}));

export const _notificationImaging = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  fullName: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  createdAt: _mock.time(index),
  isUnRead: randomInArray([true, false]),
  type: randomInArray(['upload', 'issue']),
}));
