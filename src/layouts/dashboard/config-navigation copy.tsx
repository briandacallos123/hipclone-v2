import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
// import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={name} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('solar:widget-5-bold-duotone'),
  overview: icon('solar:spedometer-max-bold-duotone'),
  notification: icon('solar:bell-bold-duotone'),
  appointment: icon('solar:calendar-add-bold-duotone'),
  chat: icon('solar:chat-round-line-bold-duotone'),
  calendar: icon('solar:calendar-bold-duotone'),
  patient: icon('solar:user-bold-duotone'),
  hmo: icon('solar:medical-kit-bold-duotone'),
  emr: icon('solar:user-id-bold-duotone'),
  record: icon('solar:document-medicine-bold-duotone'),
  prescription: icon('solar:jar-of-pills-bold-duotone'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: t('HIPS'),
        items: [
          { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
          // { title: t('overview'), path: paths.dashboard.overview.root, icon: ICONS.overview },
          // remove temporary
          // {
          //   title: t('notification'),
          //   path: paths.dashboard.notification,
          //   icon: ICONS.notification,
          // },
          {
            title: t('appointment'),
            path: paths.dashboard.appointment.root,
            icon: ICONS.appointment,
          },
          { title: t('chat'), path: paths.dashboard.chat, icon: ICONS.chat },
          {
            title: t('calendar'),
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
            roles: ['doctor', 'patient', 'secretary'],
          },
          {
            title: t('patient'),
            path: paths.dashboard.patient.root,
            icon: ICONS.patient,
            roles: ['doctor'],
          },
          {
            title: t('HMO claim'),
            path: paths.dashboard.hmo,
            icon: ICONS.hmo,
            roles: ['doctor', 'secretary'],
          },
          {
            title: t('EMR'),
            path: paths.dashboard.emr.root,
            icon: ICONS.emr,
            roles: ['doctor', 'secretary'],
          },
          {
            title: t('medical record'),
            path: paths.dashboard.user.profile,
            icon: ICONS.record,
            roles: ['patient'],
          },
          {
            title: t('prescription'),
            path: paths.dashboard.prescription,
            icon: ICONS.prescription,
            roles: ['patient'],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
