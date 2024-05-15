import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import MenuItem from '@mui/material/MenuItem';
// Component
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from '@/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
// Mock

import { useAuthContext } from '@/auth/hooks';

import ProfilePostItem from './profile-post-item';
import FeedsController from './_feedController';
import FeedSkeleton from './patient-table-row-skeleton';
import EmptyContent from '@/components/empty-content';

export default function FeedsView() {
  const settings: any = useSettingsContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const Page = useRef(1);
  const Take: number = 5;

  const { enqueueSnackbar } = useSnackbar();
  const openUpload = useBoolean();

  const [feedDataNew, setFeedDataNew] = useState<any>([]);
  const [feedData, setFeedData] = useState<any>([]);
  const { queryResults, handleSubmitCreate } = FeedsController({
    skip: 0,
    take: Take,
    setFeedData: setFeedData,
    requestType: 'FirstFetch',
  });
  const notFound = !queryResults.loading && !feedData?.length;
  // renew request page
  useEffect(() => {
    queryResults
      .refetch({
        skip: 0,
        take: Take,
        requestType: 'FirstFetch',
      })
      .then(async ({ data }: any) => {
        const { QueryPosts } = data;
        if (QueryPosts.length) {
          Page.current = 1;
        }
      });
  }, []);
  // refetch new page
  useEffect(() => {
    if (queryResults?.data?.QueryPosts?.length && !queryResults?.loading) {
      if (queryResults?.data?.QueryPosts[0]?.requestType !== 'GetFeedsFetch') {
        setFeedData((prev: any) => {
          prev = [...prev, ...queryResults.data.QueryPosts];
          const newData = prev.map((update: any) => {
            const toUpdate = queryResults.data.QueryPosts.find(
              (tUp: any) => String(tUp.id) === String(update.id)
            );
            if (toUpdate) {
              update = toUpdate;
            }
            return update;
          });

          prev = newData.reduce((unique: any, o: any) => {
            if (!unique.some((obj: any) => obj.id === o.id)) {
              unique.push(o);
            }
            return unique;
          }, []);

          return prev;
        });
      }
    }
  }, [JSON.stringify(queryResults.data), queryResults.loading]);

  //pagination
  useEffect(() => {
    const section: any = document.querySelector('body div');

    const ScrollHandle = () => {
      console.log('23123');
      const bottomScrollPosition = section.scrollHeight - section.scrollTop - section.clientHeight;
      if (window.scrollY >= bottomScrollPosition || bottomScrollPosition === window.scrollY) {
        queryResults
          .refetch({
            skip: Page.current * Take,
            take: Take,
            requestType: 'ScrollFetch',
          })
          .then(async ({ data }: any) => {
            const { QueryPosts } = data;
            if (QueryPosts.length) {
              Page.current = Page.current += 1;
            }
          });
      }
    };

    if (typeof window !== 'undefined') {
      if (
        (!queryResults.loading && section && queryResults?.data?.QueryPosts?.length) ||
        feedData.length
      ) {
        window.addEventListener('scroll', ScrollHandle);
      }
    }
    //prevent memory leak
    return () => window.removeEventListener('scroll', ScrollHandle);
  }, [queryResults.loading, feedData]);

  const handleCloseUpload = () => {
    openUpload.onFalse();
  };

  const popover = usePopover();

  const { user, socket } = useAuthContext();

  const isDoctor = user?.role === 'doctor';

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const NewSchema = Yup.object().shape({
    text: Yup.string().required('Text is required'),
  });

  const defaultValues = useMemo(
    () => ({
      text: '',
      attachment: null,
      isPublic: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  console.log('data', values);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (socket?.connected) {
      socket.on('getFeeds', async (p: any) => {
        if (Number(p?.id) !== Number(user?.id)) {
          queryResults
            .refetch({
              skip: 0, // set cursor to zero to get latest push data
              take: Take, // buffer,
              requestType: 'GetFeedsFetch',
            })
            .then(async ({ data }) => {
              const { QueryPosts } = data;
              QueryPosts.map((item: any) => {
                const existed = feedData.find((i: any) => i.id === String(item.id));
                const existedF = feedDataNew.find((i: any) => i.id === String(item.id));
                if (!existed && !existedF) {
                  setFeedDataNew((prev: any) => {
                    prev = [...prev, item];
                    const newData = prev.map((update: any) => {
                      const toUpdate = QueryPosts.find(
                        (tUp: any) => String(tUp.id) === String(update.id)
                      );
                      if (toUpdate) {
                        update = toUpdate;
                      }
                      return update;
                    });

                    prev = newData.reduce((unique: any, o: any) => {
                      if (!unique.some((obj: any) => obj.id === o.id)) {
                        unique.push(o);
                      }
                      return unique;
                    }, []);

                    return prev;
                  });
                }
                return item;
              });
            });
        }
      });
    }

    return () => {
      socket?.off('getFeeds');
    };
  }, [socket?.connected, feedData, feedDataNew]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await handleSubmitCreate(data);

        if (socket.connected) {
          socket.emit('postFeed', user);
        }

        enqueueSnackbar('upload success!');
        reset();
        await queryResults
          .refetch({
            skip: 0,
            take: Take,
            requestType: 'CreateNewFetch',
          })
          .then(async ({ data }: any) => {
            const { QueryPosts } = data;
            if (QueryPosts.length) {
              setFeedData([]);
              Page.current = 1;
            }
          });
        await openUpload.onFalse();
        console.info('DATA', data);
      } catch (error) {
        enqueueSnackbar('upload failed!', { variant: 'error' });
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitCreate, openUpload, queryResults, reset]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.attachment || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('attachment', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.attachment]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.attachment && values.attachment?.filter((file: any) => file !== inputFile);
      setValue('attachment', filtered);
    },
    [setValue, values.attachment]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('attachment', []);
  }, [setValue]);

  const [iconData, setIconData] = useState<String>('material-symbols:public');

  const handleChange = (icon: string, data: boolean | number) => {
    setValue('isPublic', data);
    setIconData(icon);
  };

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <RHFTextField
        name="text"
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 1,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={openUpload.onTrue}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>
          <Chip
            variant="outlined"
            avatar={<Iconify icon={iconData} />}
            label={getValues('isPublic') === 1 ? 'Public' : 'Patient Only'}
            onClick={popover.onOpen}
            sx={{ width: getValues('isPublic') === 1 ? 100 : 140 }}
          />
        </Stack>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="top-center"
          sx={{ width: 150 }}
        >
          <MenuItem
            onClick={() => {
              handleChange('material-symbols:public', 1);
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:public" />
            Public
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleChange('streamline:information-desk-customer', 0);
              popover.onClose();
            }}
          >
            <Iconify icon="streamline:information-desk-customer" />
            Patients Only
          </MenuItem>
        </CustomPopover>

        <LoadingButton
          loading={isSubmitting}
          variant="contained"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Post
        </LoadingButton>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {isDoctor && (
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            Health Bites
          </Typography>
        )}
        <Stack spacing={1} direction="column">
          {isDoctor ? renderPostInput : null}
          {queryResults.loading && [...Array(3)].map((_, i) => <FeedSkeleton key={i} />)}
          {feedDataNew?.reverse().map((data: any, index: number) => (
            <ProfilePostItem
              key={index}
              data={data}
              requestVar={{
                skip: Page.current,
                take: Take,
              }}
            />
          ))}
          {feedData?.map((data: any, index: number) => (
            <ProfilePostItem
              key={index}
              data={data}
              requestVar={{
                skip: Page.current,
                take: Take,
              }}
            />
          ))}

          {notFound && (
            <EmptyContent
              filled
              title="No Post's"
              sx={{
                py: 10,
              }}
            />
          )}
        </Stack>
      </Container>

      <Dialog
        fullWidth
        maxWidth={false}
        open={openUpload.value}
        onClose={handleCloseUpload}
        PaperProps={{
          sx: { maxWidth: 640 },
        }}
      >
        <DialogTitle>Upload Background</DialogTitle>

        <DialogContent>
          <Stack direction={{ md: 'row' }} spacing={2}>
            <Stack spacing={1.5} sx={{ width: 1 }}>
              <RHFUpload
                name="attachment"
                multiple
                thumbnail
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseUpload}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
