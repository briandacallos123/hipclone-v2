import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useAuthContext } from '@/auth/hooks';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFUpload,
  RHFSelect,
} from 'src/components/hook-form';
import { MutationESign, MutationESignUser } from '../../libs/gqls/subprofilegeneral';
import SignatureCanvas from 'react-signature-canvas';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { gql, useMutation } from '@apollo/client';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from 'src/hooks/use-responsive';

const AccountGeneralSig = ({ isOpen, onClose, reset: resetParent, data}) => {
  const openPay = useBoolean();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey1, setSnackKey1]: any = useState(null);
  const [snackKey2, setSnackKey2]: any = useState(null);
  const [snackKey3, setSnackKey3]: any = useState(null);
  const { user, reInitialize } = useAuthContext();
  const mySig = useRef();

  const UpdateUserSchema = Yup.object().shape({
    // fname: Yup.string().required('First Name is required'),
  });

  const defaultValues = {
    defaultESig: user?.esig?.type,
    signatureDigital:
      (() => {
        const url = user?.esigDigital?.filename;
        const parts = url?.split('public');
        const publicPart = parts ? parts[1] : null;

        console.log(publicPart, '@@@@@@@');

        return publicPart;
      })() || null,
    signatureD: true,
    signatureFile:''
     
  };

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(()=>{
    if(data){
      setValue('signatureFile', `/${data?.esig?.filename?.split('/').splice(1).join("/")}`);
    }
  },[data])

  // useEffect(() => {
  //   // Load the image when the component mounts or when signatureDigital changes
  //   if (values.signatureDigital) {
  //     const canvas = mySig.current;
  //     const context = canvas.getContext('2d');
  //     const img = new Image();
  //     img.onload = () => {
  //       context.clearRect(0, 0, canvas.width, canvas.height);
  //       context.drawImage(img, 0, 0, canvas.width, canvas.height);
  //     };
  //     img.src = `http://localhost:9092/${values.signatureDigital}`;
  //   }
  // }, [values.signatureDigital]);

  const [uploadDataSign] = useMutation(MutationESign, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [uploadDataSignUser] = useMutation(MutationESignUser, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [hideBtn2, setHideBtn2] = useState(true);

  const [isSubmit, setSubmit] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  // for sig
  const handleSubmitValueSig = useCallback(
    async (model: NexusGenInputs['EsignInputTypeWFile']) => {
      const data: NexusGenInputs['EsignInputTypeWFile'] = {
        // email: model.email,
        type: model.type,
      };

      uploadDataSign({
        variables: {
          data,
          file: model?.fileUpload,
        },
      })
        .then(async (res) => {
          console.log(model, 'MODELLLL');
          const { data } = res;

          const cType = Number(model?.type);
          reInitialize();
          if (cType === 2) {
            closeSnackbar(snackKey1);
            setSnackKey1(null);
            setSubmit(false);
            setHideBtn2(true);
          } else {
            closeSnackbar(snackKey2);
            setSnackKey2(null);
            setHasChanges(false);
          }
          // reset();
          enqueueSnackbar('Updated successfully!');
        })
        .catch((error) => {
          const cType = Number(model?.type);
          if (cType === 2) {
            closeSnackbar(snackKey1);
            setSnackKey1(null);
            setSubmit(false);
          } else {
            closeSnackbar(snackKey2);
            setSnackKey2(null);
          }

          enqueueSnackbar(`${error}`, { variant: 'error' });

          // runCatch();
        });
    },
    [snackKey1, snackKey2]
  );
  const handleSubmitValueSigUser = useCallback(
    async (model: NexusGenInputs['EsignInputTypeWFileUser']) => {
      const data: NexusGenInputs['EsignInputTypeWFileUser'] = {
        // email: model.email,
        type: model.type,
      };

      uploadDataSignUser({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;

          closeSnackbar(snackKey3);
          setSnackKey3(null);
          setValue('signatureD', true);
          reInitialize();
          resetParent();
          enqueueSnackbar('Updated successfully!');
          // setImage(data?.MutationESignUser);
          onClose();
          setValue('signatureD', true);
          setHideBtn2(true);
        })
        .catch((error) => {
          closeSnackbar(snackKey3);
          setSnackKey3(null);
          enqueueSnackbar('Something went wrong', { variant: 'error' });

          // runCatch();
        });
    },
    [snackKey3]
  );

  useEffect(() => {
    if (user) {
      if (user?.esigDigital?.filename) {
        const url = user?.esigDigital?.filename;
        const parts = url.split('public');
        const publicPart = parts[1];

        setValue('signatureDigital', publicPart);
      }
      if (user?.esigFile?.filename) {
        const url = user?.esigFile?.filename;
        const parts = url.split('public');
        const publicPart = parts[1];

        // setValue('signatureFile', publicPart);
      }
    }
  }, [user]);

  useEffect(() => {
    if (snackKey1) {
      (async () => {
        await handleSubmitValueSig({ type: 2, fileUpload: values?.signatureDigital });
      })();
    }
  }, [snackKey1]);

  useEffect(() => {
    if (snackKey3) {
      (async () => {
        await handleSubmitValueSigUser({ type: Number(values?.defaultESig) });
      })();
    }
  }, [snackKey3]);

  useEffect(() => {
    if (isSubmit) {
      const snackbarKey: any = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'savingGeneralsssssss',
        persist: true, // Do not auto-hide
      });
      setSnackKey1(snackbarKey);
    }
  }, [isSubmit]);

  useEffect(() => {
    if (snackKey2) {
      (async () => {
        await handleSubmitValueSig({
          ...values,
          type: 1,
          fileUpload: values?.signatureFile,
        });
      })();
    }
  }, [snackKey2]);

  const onSubmit = () => {
    try {
      const snackbarKey: any = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'awit',
        persist: true, // Do not auto-hide
      });
      setSnackKey3(snackbarKey);
    } catch (error) {
      console.error(error);
    }
  };

  const b64toBlob = (base64Data: any) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'image/png' });
  };

  const handleUpload = () => {
    const snackbarKey: any = enqueueSnackbar('Saving Data...', {
      variant: 'info',
      key: 'savingGeneralLupin',
      persist: true, // Do not auto-hide
    });
    setSnackKey2(snackbarKey);
  };

  const handlePad = () => {
    const canvas: any = mySig.current;
    const imageData = canvas.toDataURL();

    // Extract the base64 data from the data URL
    const base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');

    // Convert base64 to a Blob
    const blob = b64toBlob(base64Data);

    // Create a File from the Blob
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    // Set the Blob data to the signatureCanvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Ensure that the canvas size is not changed
        canvas.width = 500;
        canvas.height = 300;

        canvas.clear();
        canvas.fromDataURL(img.src);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(blob);
    setValue('signatureD', false);
    setValue('signatureDigital', file, { shouldValidate: true });

    setSubmit(true);
  };

  // useEffect(()=>{
  //   if(values?.signatureDigital){

  //   }
  // },[values?.signatureDigital])

  const handleDropSigPad = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('signatureDigital', newFile, {
          shouldValidate: true,
        });
      }

      return newFile;
    },
    [setValue]
  );

  const handleDropSig = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setHasChanges(true);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('signatureFile', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('signatureFile', null);
  }, [setValue]);
  const upMd = useResponsive('up', 'md');
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Dialog
        fullScreen={!upMd}
        fullWidth
        maxWidth={false}
        open={isOpen}
        // onClose={() => openPay.onFalse()}
        PaperProps={{
          sx: { maxWidth: 600, p: 3 },
        }}
      >
        {/* {renderHead} */}
        <DialogTitle>Select Digital Signature</DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Stack spacing={4}>
            {/* <Typography></Typography> */}
            <Stack spacing={1}>
              <Typography>Upload E-Signature</Typography>
              <Stack>
                <RHFUpload
                  name="signatureFile"
                  maxSize={3145728}
                  onDrop={handleDropSig}
                  onDelete={handleRemoveFile}
                />
                <Button
                  variant="contained"
                  disabled={!hasChanges}
                  onClick={handleUpload}
                  color="success"
                >
                  Confirm Signature
                </Button>
              </Stack>
            </Stack>
            {/* <Box sx={{ height: '0.5px', width: '100%', backgroundColor: 'gray' }} /> */}
            {/* pad */}
            <Stack spacing={1}>
              <Stack alignItems="flex-start" spacing={1}>
                <Stack>
                  <Typography>Signature Pad</Typography>
                  {!hideBtn2 && (
                    <Typography color="error" sx={{ fontSize: '14px' }}>
                      {' '}
                      *Please draw your signature
                    </Typography>
                  )}
                </Stack>

                {hideBtn2 && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontSize: '14px' }}>
                      Want to create new?{' '}
                    </Typography>
                    <Button
                      onClick={() => {
                        setValue('signatureDigital', null);
                        setHideBtn2(false);
                      }}
                      color="error"
                      variant="outlined"
                    >
                      Clear Canvas
                    </Button>
                  </Stack>
                )}
                {values?.signatureD && values?.signatureDigital ? (
                  <RHFUpload
                    name="signatureDigital"
                    maxSize={3145728}
                    onDrop={handleDropSig}
                    sx={{
                      pointerEvents: 'none',
                    }}
                    // onDelete={handleRemoveFile}
                  />
                ) : (
                  <Box sx={{ border: '1px solid black', borderRadius: '20px' }}>
                    <SignatureCanvas
                      penColor="black"
                      ref={mySig}
                      backgroundColor="white"
                      canvasProps={{
                        width: 500,
                        height: 300,
                      }}
                    />
                  </Box>
                )}
              </Stack>
              <Button disabled={hideBtn2} variant="contained" onClick={handlePad} color="success">
                Confirm Signature
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <Stack sx={{ paddingX: 3, paddingY: 1 }} direction="row" spacing={2}>
          <Stack direction="column" spacing={1} width={'50%'}>
            <Typography variant="body2">Select Default Signature</Typography>
            <RHFSelect name="defaultESig">
              <MenuItem value={0}>Blank Signature</MenuItem>
              <MenuItem value={1}>Uploaded Signature</MenuItem>
              <MenuItem value={2}>Digital Signature</MenuItem>
            </RHFSelect>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            width={'50%'}
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button variant="contained" color="info" type="submit" onClick={() => onSubmit()}>
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                setValue('signatureD', true);
                setHideBtn2(true);
                setHasChanges(false);
                if (getValues('signatureDigital') === null) {
                  (() => {
                    const url = user?.esigDigital?.filename;
                    const parts = url.split('public');
                    const publicPart = parts[1];

                    setValue('signatureDigital', publicPart);
                  })();
                }
                // values?.signatureD && values?.signatureDigital;
                // setValue('signatureFile', null);
              }}
              color="primary"
              sx={{ mr: 1 }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </FormProvider>
  );
};

export default AccountGeneralSig;
