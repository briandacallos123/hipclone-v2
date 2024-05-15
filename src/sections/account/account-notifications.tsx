import { useCallback } from 'react';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: 'My EMR',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'emr_link',
        label: 'Notify me when patients linked their profile',
      },
      {
        id: 'emr_update',
        label: 'Notify me when patients updated their profile',
      },
    ],
  },
  {
    subheader: 'Appointments',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'appointment_1',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
      {
        id: 'appointment_2',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
      {
        id: 'appointment_3',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
    ],
  },
  {
    subheader: 'Chats',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      {
        id: 'chat_1',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
      {
        id: 'chat_2',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
      {
        id: 'chat_3',
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultricies ex quis ligula aliquet finibus',
      },
    ],
  },
];

// ----------------------------------------------------------------------

type FormValuesProps = {
  selected: string[];
};

export default function AccountNotifications() {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValuesProps>({
    defaultValues: {
      selected: ['emr_link', 'appointment_1', 'appointment_3', 'chat_2', 'chat_3'],
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {NOTIFICATIONS.map((notification) => (
          <Grid key={notification.subheader} container spacing={3}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary={notification.subheader}
                secondary={notification.caption}
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}>
                <Controller
                  name="selected"
                  control={control}
                  render={({ field } : CustomRenderInterface) => (
                    <>
                      {notification.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() => field.onChange(getSelected(values.selected, item.id))}
                            />
                          }
                          sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                        />
                      ))}
                    </>
                  )}
                />
              </Stack>
            </Grid>
          </Grid>
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
