import { useState, useRef, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getDateSpan } from 'src/utils/format-time';
import MenuItem from '@mui/material/MenuItem';
// Component
// types

// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fDate, fDateTime } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { _mock } from 'src/_mock';
import { enqueueSnackbar } from 'src/components/snackbar';
import EmptyContent from '@/components/empty-content';
import { useLazyQuery, gql } from '@apollo/client';
import FeedsController from './_feedController';
import { AvatarGroup, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
// import { borderRadius } from '@mui/system';
// import { useBoolean } from 'src/hooks/use-boolean';
import FeedsDialog from './view/feeds-view-dialog';
// ----------------------------------------------------------------------

interface Props {
  data?: any;
}

export default function ProfilePostItem({ data: unused }: Props) {
  // console.log('allData', data);
  const [like, setLike] = useState(false);
  const { handleLikePost, handleDeletePost } = FeedsController();
  const popover = usePopover();
  const confirm = useBoolean();
  const openDialog = useBoolean();

  console.log(unused, '?????????????????')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setLike(event.target.checked);

    onSubmit(event.target.checked, id);
  };

  const [getPost, { refetch, data: sData, loading }] = useLazyQuery(
    gql`
      query FEEDS_QUERY_SINGLE($id: Int!) {
        QueryPostSingle(id: $id) {
          id
          requestType
          u_like
          likes
          text
          createdAt
          isPublic
          attachmentData {
            createdAt
            fileName
            id
            imagePath
          }
          userData {
            EMP_FNAME
            EMP_ID
            EMP_LNAME
            EMP_MNAME
            EMP_TITLE
          }
        }
      }
    `,
    { variables: { id: Number(unused?.id) } }
  );

  const data: any = !loading && sData?.QueryPostSingle.length ? sData?.QueryPostSingle : unused;
  const onSubmit = useCallback(
    async (payload: any, id: number) => {
      try {
        await handleLikePost(payload, id);
        await refetch({
          id: id,
        });

        // console.info('DATA', payload);
      } catch (error) {
        console.error(error);
      }
    },
    [handleLikePost, sData, loading, unused]
  );

  // useEffect(() => {
  // if (like === true) {
  //   onSubmit(like);
  // } else {
  //   onSubmit(like);
  // }
  // }, [like]);

  // console.log('data', data);

  const handleDeleteItem = useCallback(
    async (id: any) => {
      try {
        await handleDeletePost(id);
        await confirm.onFalse();
        await enqueueSnackbar('Delete success!');
      } catch (error) {
        enqueueSnackbar('Delete failed!', { variant: 'error' });
        console.error(error);
      }
    },
    [confirm, handleDeletePost]
  );

  const { user } = useAuthContext();

  const isDoctor = user?.role === 'doctor';

  const renderHead = (
    <>
      <CardHeader
        disableTypography
        avatar={
          <Avatar alt="person.name">{data?.userData?.EMP_FNAME.charAt(0).toUpperCase()}.</Avatar>
        }
        title={
          <Link color="inherit" variant="subtitle1">
            {`${data?.userData?.EMP_FNAME} ${data?.userData?.EMP_MNAME.charAt(0).toUpperCase()}. ${data?.userData?.EMP_LNAME
              } - ${data?.userData?.EMP_TITLE}`}
          </Link>
        }
        subheader={
          <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
            {`${fDate(data?.createdAt)}, ${fDateTime(data?.createdAt, 'p')}` || null}
          </Box>
        }
        action={
          isDoctor ? (
            <IconButton>
              <Iconify icon="eva:more-vertical-fill" onClick={popover.onOpen} />
            </IconButton>
          ) : null
        }
      />
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-center"
        sx={{ width: 150 }}
      >
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            popover.onClose();
            confirm.onTrue();
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete Post
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteItem(data.id)}>
            Delete
          </Button>
        }
      />
    </>
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={sData ? sData.QueryPostSingle?.u_like : data?.u_like}
            onChange={(e) => handleChange(e, Number(sData ? sData.QueryPostSingle?.id : data?.id))}
            color="error"
            icon={<Iconify icon="solar:heart-bold" sx={{ color: '#FF8080' }} />}
            checkedIcon={<Iconify icon="fluent-emoji-flat:heart-suit" />}
          />
        }
        label={sData ? sData.QueryPostSingle?.likes : data?.likes}
        sx={{ mr: 1 }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Stack>
  );

  // lightbox

  const [open, setOpen] = useState(false);

  const images = data?.attachmentData.map((item) => {
    const url = item?.imagePath;
    const parts = url?.split('public');
    const publicPart = parts ? parts[1] : null;
    return { src: publicPart };
  });

  const [maxImgLength, setMaxImgLength] = useState(images?.length)
  const [currentImg, setCurrentImg] = useState(0)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const fullName = unused?.userData?.EMP_MNAME ? `${unused?.userData?.EMP_FNAME} ${unused?.userData?.EMP_MNAME} ${unused?.userData?.EMP_LNAME}` : `${unused?.userData?.EMP_FNAME} ${unused?.userData?.EMP_LNAME}`

 
  return (
    <Card>
      {renderHead}
      {/* {renderDialog()} */}
      <FeedsDialog open={openDialog.value} product={unused} onClose={openDialog.onFalse}/>

      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        {data?.text}
      </Typography>
      
      {data?.attachmentData.length ? (
        <Box>
          <ImageList
            variant="quilted"

            cols={10}
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-start',

            }}

          >

            {data?.attachmentData.slice(0, 2).map((item, index) => {
              const url = item?.imagePath;
              const parts = url?.split('public');
              const publicPart = parts ? parts[1] : null;
              return (
                <ImageListItem key={index} onClick={
                  () => {
                    // () => openLightbox(index)
                    openDialog.onTrue()
                  }
                }>
                  <Stack
                    // justifyContent="flex-start"
                    // alignItems="flex-start"
                    sx={{
                      // width: '100%',
                      height: 'auto',
                    }}
                  >
                    <Image sx={{
                      width: 200,
                      height: 200,
                      borderRadius: 2
                    }} srcSet={publicPart} src={publicPart} alt={publicPart} loading="lazy" />
                  </Stack>

                  {index === 1 && data?.attachmentData.length > 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '40px',
                      }}
                    >
                      +{data?.attachmentData.length - 2}
                    </div>
                  )}
                </ImageListItem>
              );
            })}
          </ImageList>
        </Box>) : ""}
      {/* </AvatarGroup> */}

      {/* {data?.attachmentData.length ? (
        <Box sx={{ p: 1 }}>
          <ImageList
            variant="quilted"
            cols={
              data?.attachmentData.length === 1 ? 1 : 2
            }
          >
         
            {data?.attachmentData.slice(0, 2).map((item, index) => {
              const url = item?.imagePath;
              const parts = url?.split('public');
              const publicPart = parts ? parts[1] : null;
              return (
                <ImageListItem key={index} onClick={() => openLightbox(index)}>
                  <Stack
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    sx={{
                      // width: '100%',
                      height: 'auto',
                    }}
                  >
                    <Image sx={{
                      width:200,
                      height:200
                    }} srcSet={publicPart} src={publicPart} alt={publicPart} loading="lazy" />
                  </Stack>

                  {index === 2 && data?.attachmentData.length >= 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '40px',
                      }}
                    >
                      +{data?.attachmentData.length - 4}
                    </div>
                  )}
                </ImageListItem>
              );
            })}
          </ImageList>
        </Box>
      ) : null} */}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        initialIndex={selectedImageIndex}
      />

      {renderActions}

      {/* {!!post.comments.length && renderCommentList} */}
    </Card>
  );
}
