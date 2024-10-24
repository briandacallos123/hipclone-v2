// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fDateTime } from 'src/utils/format-time';
// types
import { IChatAttachment } from 'src/types/chat';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail from 'src/components/file-thumbnail';
import axios from 'axios'

// ----------------------------------------------------------------------

type Props = {
  attachments: IChatAttachment[];
};

export default function ChatRoomAttachments({ attachments }: Props) {
  const collapse = useBoolean(true);

  const totalAttachments = attachments.length;

  const renderBtn = (
    <ListItemButton
      disabled={!attachments.length}
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 40,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'overline',
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Box component="span" sx={{ flexGrow: 1 }}>
        Attachments ({totalAttachments})
      </Box>
      <Iconify
        width={16}
        icon={
          (!collapse.value && 'eva:arrow-ios-forward-fill') ||
          (!attachments.length && 'eva:arrow-ios-forward-fill') ||
          'eva:arrow-ios-downward-fill'
        }
      />
    </ListItemButton>
  );

  function returnAttachment(image:any){
    return `https://dev-hip.apgitsolutions.com${image}`;
  }

  const renderContent = (
    <Scrollbar sx={{ px: 2, py: 2.5 }}>
      {attachments.map((attachment, index) => (
        <Stack
          key={attachment.name + index}
          spacing={1.5}
          direction="row"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.neutral',
            }}
          >
            <FileThumbnail
              imageView
              file={attachment.preview}
              // onDownload={()=>{
              //   alert("123")
              // }}
              onDownload={async() => {
                try {
                  // const response = await axios.get(`/api/checkFile?filename=${attachment?.name}`);
                  // const { data } = response;
              
                  // const fileURL = await returnAttachment(attachment?.preview);
              
                  // console.log(fileURL, 'HAHAHAAAAAAAAAA');
              
                  const link = document.createElement('a');
              
                  // Fetch the image as a blob
                  const imageResponse = await fetch(`https://hip.apgitsolutions.com/${attachment?.preview}`);
                  const blob = await imageResponse.blob();
              
                  // Create a URL for the blob
                  const blobURL = URL.createObjectURL(blob);
              
                  link.href = blobURL; // Use the blob URL for the download
                  link.download = attachment?.name; // Set the file name for download


                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              
                  URL.revokeObjectURL(blobURL);
              
                } catch (error) {
                  console.error('Error downloading the image:', error);
                }
              }}
              sx={{ width: 28, height: 28 }}
            />
          </Stack>

          <ListItemText
            primary={attachment.name}
            secondary={fDateTime(attachment.createdAt)}
            primaryTypographyProps={{
              noWrap: true,
              typography: 'body2',
            }}
            secondaryTypographyProps={{
              mt: 0.25,
              noWrap: true,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />
        </Stack>
      ))}
    </Scrollbar>
  );

  return (
    <>
      {renderBtn}

      <Box
        sx={{
          overflow: 'hidden',
          height: collapse.value ? 1 : 0,
          transition: (theme) =>
            theme.transitions.create(['height'], {
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        {renderContent}
      </Box>
    </>
  );
}
