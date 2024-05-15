//
import { palette as themePalette } from 'src/theme/palette';
import { _mock } from './_mock';

// ----------------------------------------------------------------------

const palette = themePalette('light');

export const CALENDAR_COLOR_OPTIONS = [
  palette.primary.main,
  palette.secondary.main,
  palette.info.main,
  palette.info.darker,
  palette.success.main,
  palette.warning.main,
  palette.error.main,
  palette.error.darker,
];

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'alway') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [...Array(9)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: [
    'appointment',
    'project',
    'labResult',
    'vitals',
    'payment',
    'order',
    'chat',
    'mail',
    'delivery',
  ][index],
  category: [
    'Communication',
    'Project UI',
    'File Manager',
    'File Manager',
    'File Manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 &&
      `<p><strong>Deja Brady</strong> book an <span class="MuiBox-root css-1xt3m6d">face-to-face</span> appointment on <strong>September 22, 2023 @ 3pm</strong></p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> message you in <strong><a href='#'>Chat</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> uploaded Lab Result #Title to <strong><a href='#'>Lab Imaging</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new vitals to <strong><a href='#'>Vital Tab<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> uploaded a payment for <strong>PhP 500</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _homePlans = [...Array(3)].map((_, index) => ({
  license: ['Standard', 'Standard Plus', 'Extended'][index],
  commons: ['One end products', '12 months updates', '6 months of support'],
  options: [
    'JavaScript version',
    'TypeScript version',
    'Design Resources',
    'Commercial applications',
  ],
  icons: [
    '/assets/icons/platforms/ic_figma.svg',
    '/assets/icons/platforms/ic_js.svg',
    '/assets/icons/platforms/ic_ts.svg',
  ],
}));

export const _medicalProfile = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  date: _mock.time(index),
}));
