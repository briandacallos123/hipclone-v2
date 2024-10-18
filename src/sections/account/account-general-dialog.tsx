import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useTheme } from '@mui/material/styles';

const AccountGeneralSig = ({ onIncrementStep, decrementStep, setStep, step, isOpen, onClose, reset: resetParent, data }: any) => {

  const openPay = useBoolean();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey1, setSnackKey1]: any = useState(null);
  const [snackKey2, setSnackKey2]: any = useState(null);
  const [snackKey3, setSnackKey3]: any = useState(null);
  const { user, reInitialize } = useAuthContext();
  const mySig = useRef<HTMLCanvasElement | null>(null);

  const UpdateUserSchema = Yup.object().shape({
    // fname: Yup.string().required('First Name is required'),
  });


  const defaultValues = useMemo(() => {
    return {
      defaultESig: user?.esig?.type,
      signatureDigital: user?.esigDigital?.filename,
      signatureD: true,
      signatureFile: user?.esigFile?.filename
    }

  }, [user])



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

  useEffect(() => {
    if (data) {
      setValue('signatureFile', data?.esig?.filename);

      // setValue('signatureFile', `/${data?.esig?.filename?.split('/').splice(1).join("/")}`);
    }
  }, [data])

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
      requestTrackerId: 'uploadEsig[EsigUpload]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [uploadDataSignUser] = useMutation(MutationESignUser, {
    context: {
      requestTrackerId: 'uploadType[typeUpload]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [hideBtn2, setHideBtn2] = useState(true);

  const [isSubmit, setSubmit] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const [isSelected, setSelected] = useState<boolean | null>(null);
  const [esigSelected, setEsig] = useState(false)
  const [uploadSelected, setUpload] = useState(false)
  const [hasChange, setHasChange] = useState(false);

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

          const currentStep = localStorage?.getItem('currentStep')

          if (currentStep) {
            localStorage.setItem('esigCalled', 'true')


          }
          if (!user?.esig?.filename) {
            reInitialize()
            onClose()
          }



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
          setHasChanges(true)
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

      try {

        if (isSelected) {
          uploadDataSignUser({
            variables: {
              data,
            },
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    [snackKey1, snackKey2, isSelected, user?.esig]
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

  const [myImage, setMyImg] = useState();

  const handlePad = () => {
    const canvas: any = mySig.current;
    if (canvas) {
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
          // Draw the new image on the existing canvas
          // You might want to create a separate function to handle drawing
          // const ctx = canvas.getContext('2d');
          // ctx.drawImage(img, 0, 0); // Draw the new image on top of the existing signature
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(blob);


      setValue('signatureD', false);
      setValue('signatureDigital', file, { shouldValidate: true });

      setSubmit(true);
    }
  };

  const [disableEsigBtn, setDisableEsigBtn] = useState(true);

  const enableEsigBtn = () => setDisableEsigBtn(false)

  const clearCanvas = () => {

    const canvas = mySig.current;
    if (canvas) {
      canvas?.clear()
    }
    if (!disableEsigBtn) {
      setDisableEsigBtn(true)
    }

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
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setHasChange(true)


      if (file) {
        setValue('signatureFile', newFile, { shouldValidate: true });
      }

    },
    [setValue, hasChange]
  );

  const [drawCanvas, setDrawCanvas] = useState(false);

  const handleRemoveFile = useCallback(() => {
    setValue('signatureFile', null);
    setHasChange(false)
  }, [setValue]);

  const upMd = useResponsive('up', 'md');




  const handleUploadEsig = () => {
    setUpload(true)
    setSelected(true)
    if (esigSelected) {
      setEsig(false)
    }
    if (step) {
      onIncrementStep()
    }
  }

  const handleWriteEsig = () => {
    setEsig(true)

    setSelected(true)
    if (uploadSelected) {
      setUpload(false)
    }
    if (step) {
      onIncrementStep()
    }

  }

  const theme = useTheme();


  const PRIMARY_MAIN = theme.palette.primary.main;


  console.log(step, 'stepppp')

  const RenderTuts = useCallback(() => {
    return (
      (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5000,
          padding: 3,
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <Box sx={{
            background: PRIMARY_MAIN,
            opacity: .4,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5000
          }}></Box>

          <Box sx={{
            p: {xs:1,md:2},
            width:{xs:'100%',md:500}
            
          }}>
            {step === 4 &&
              <Paper elevation={!upMd && 5} sx={{
                width: '100%',
                py: 5,
                px: 2,
                mt: !upMd && 10
              }}>
                <div className="showFields-esig">
                  <Typography sx={{
                    mb: !upMd ? 2 : 5
                  }}>What do you want to do?</Typography>
                  <Stack gap={1} sx={{
                    justifyContent: 'center'
                  }} direction={!upMd ? 'column' : 'row'} alignItems='center'>
                    <Button onClick={handleUploadEsig} variant="contained">Upload E-Sig</Button>
                    <span>Or</span>
                    <Button onClick={handleWriteEsig} variant="contained">Write E-Sig</Button>
                  </Stack>
                </div>

              </Paper>
            }

            {/* signature pad */}

            {esigSelected && step === 5 &&

              <div className="showFields-esig-write-general">
           
                <Stack>
                  <Stack alignItems="flex-start" spacing={1}>
                    <Stack sx={{
                      width: '100%',
                      
                    }} gap={!upMd && 2} direction={ 'column' } justifyContent='space-between'>

                      <Stack direction="row" justifyContent={'space-between'} alignItems="center">

                        <Typography>Signature Pad</Typography>
                        <Button onClick={() => {
                          setStep(4)
                        }} variant="contained">Back</Button>

                      </Stack>
                      <Typography color="error" sx={{ fontSize: '14px', mb:{md:1} }}>
                        {' '}
                        *Please draw your signature
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1}>

                        <Button
                          fullWidth={!upMd}
                          onClick={() => {
                            setValue('signatureFile', null);
                            setDrawCanvas(true)
                            clearCanvas()
                          }}
                          color="error"
                          variant="outlined"
                        >
                          Clear Canvas
                        </Button>
                      </Stack>

                    </Stack>



                    {(values?.defaultESig === 1) && <RHFUpload
                      name="signatureDigital"
                      maxSize={3145728}
                      onDrop={handleDropSig}
                      sx={{
                        pointerEvents: 'none',
                      }}
                    />}

                    {(values?.defaultESig === 2 || esigSelected) &&

                      (
                        (drawCanvas || esigSelected || !user?.esigDigital?.filename) ? <Box sx={{ width: '100%', border: '2px solid black', overflow: 'hidden' }}>
                          <SignatureCanvas
                            penColor="black"
                            ref={mySig}
                            backgroundColor="white  "
                            canvasProps={{
                              width: !upMd ? 350 : 500,
                              height: 300,
                            }}
                            onBegin={enableEsigBtn}
                          />
                        </Box> :
                          <RHFUpload
                            name="signatureDigital"
                            maxSize={3145728}
                            onDrop={handleDropSig}
                            sx={{
                              pointerEvents: 'none',
                            }}
                          />

                      )

                    }


                  </Stack>
                  <Button sx={{mt:1}} variant="contained" onClick={handlePad} color="success">
                    Confirm Signature
                  </Button>
                </Stack>
              </div>
            }

            {uploadSelected && step === 5 &&
              <div className="showFields-esig-upload">
                <Stack sx={{
                  // height: !upMd && 300,
                  width: !upMd ? 300 : 400
                }}>

                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent={'space-between'} alignItems="center">
                      <Typography>Upload E-Signature</Typography>
                      <Button onClick={() => {
                        setStep(4)
                      }} variant="contained">Back</Button>

                    </Stack>
                    {/* <Typography></Typography> */}
                    <Stack gap={2}>
                      <RHFUpload
                        name="signatureFile"
                        maxSize={3145728}
                        onDrop={handleDropSig}
                        onDelete={handleRemoveFile}

                      />
                      <Button
                        variant="contained"
                        disabled={!hasChange}
                        onClick={handleUpload}
                        color="success"
                      >
                        Confirm Signature
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </div>
            }
          </Box>
        </Box>
      )
    )
  }, [step, hasChange])

  console.log(hasChange, 'hasChange')


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {step && <RenderTuts />}
     {!upMd && !step &&  <Dialog
        fullScreen={!upMd}
        fullWidth
        maxWidth={false}
        open={isOpen}
        // onClose={() => openPay.onFalse()}
        PaperProps={{
          sx: { maxWidth: 600, p: 3 },

        }}
      >
        <DialogTitle sx={{
          position: 'relative',
          px: { xs: 1, lg: 5 }
        }}>Select Digital Signature

          <Button onClick={() => {
            onClose();
            setSelected(false)
            setUpload(false)
            setEsig(false)
          }} sx={{
            position: 'absolute',
            right: !upMd ? 10 : 15,
            top: !upMd ? 20 : 15
          }} variant="outlined">Close</Button>

        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', }}>
          <Stack sx={{
            height: !upMd && 300,
            width: !upMd ? 300 : 400
          }}>
            {/* <Typography></Typography> */}
            {(values.defaultESig === 1 || uploadSelected) && !step && <Stack spacing={1}>
              <Typography>Upload E-Signature</Typography>
              <Stack gap={2}>
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
            </Stack>}

            {!user?.esig && !isSelected && !step &&
              <Paper elevation={!upMd && 5} sx={{
                width: '100%',
                py: 5,
                px: 2,
                mt: !upMd && 10
              }}>
                <div className="showFields-esig">
                  <Typography sx={{
                    mb: !upMd ? 2 : 5
                  }}>What do you want to do?</Typography>
                  <Stack gap={1} sx={{
                    justifyContent: 'center'
                  }} direction={!upMd ? 'column' : 'row'} alignItems='center'>
                    <Button onClick={handleUploadEsig} variant="contained">Upload E-Sig</Button>
                    <span>Or</span>
                    <Button onClick={handleWriteEsig} variant="contained">Write E-Sig</Button>
                  </Stack>
                </div>

              </Paper>
            }




            {(values.defaultESig === 2 || esigSelected) && !step && <Stack spacing={1}>
              <Stack alignItems="flex-start" spacing={1}>
                <Stack sx={{
                  width: '100%',
                }} gap={!upMd && 2} direction={!upMd ? 'column' : 'row'} justifyContent='space-between'>
                  <Stack>
                    <Typography>Signature Pad</Typography>

                    <Typography color="error" sx={{ fontSize: '14px' }}>
                      {' '}
                      *Please draw your signature
                    </Typography>
                  </Stack>


                  <Stack direction="row" alignItems="center" spacing={1}>

                    <Button
                      fullWidth={!upMd}
                      onClick={() => {
                        setValue('signatureFile', null);
                        setDrawCanvas(true)
                        clearCanvas()
                      }}
                      color="error"
                      variant="outlined"
                    >
                      Clear Canvas
                    </Button>
                  </Stack>

                </Stack>



                {(values?.defaultESig === 1) && <RHFUpload
                  name="signatureDigital"
                  maxSize={3145728}
                  onDrop={handleDropSig}
                  sx={{
                    pointerEvents: 'none',
                  }}
                />}

                {(values?.defaultESig === 2 || esigSelected) &&

                  (
                    (drawCanvas || esigSelected || !user?.esigDigital?.filename) ? <Box sx={{ width: '100%', border: '2px solid black', overflow: 'hidden' }}>
                      <SignatureCanvas
                        penColor="black"
                        ref={mySig}
                        backgroundColor="white  "
                        canvasProps={{
                          width: !upMd ? 300 : 500,
                          height: 300,
                        }}
                      />
                    </Box> :
                      <RHFUpload
                        name="signatureDigital"
                        maxSize={3145728}
                        onDrop={handleDropSig}
                        sx={{
                          pointerEvents: 'none',
                        }}
                      />

                  )

                }


              </Stack>
              <Button variant="contained" onClick={handlePad} color="success">
                Confirm Signature
              </Button>
            </Stack>}


          </Stack>
        </DialogContent>
        {user?.esig &&
          <Stack sx={{ paddingX: 3, paddingY: 1 }} direction={!upMd ? 'column' : 'row'} spacing={2}>
            <Stack direction="column" spacing={1} width={!upMd ? '100%' : '50%'}>
              <Typography variant="body2">Select Default Signature</Typography>
              <RHFSelect name="defaultESig">
                {/* <MenuItem value={0}>Blank Signature</MenuItem> */}
                <MenuItem value={1}>Uploaded Signature</MenuItem>
                <MenuItem value={2}>Digital Signature</MenuItem>
              </RHFSelect>
            </Stack>
            <Stack
              direction={!upMd ? 'column' : 'row'}
              spacing={1}
              width={!upMd ? '100%' : '50%'}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button fullWidth={!upMd} variant="contained" color="info" type="submit" onClick={() => onSubmit()}>
                Save Changes
              </Button>
              <Button
                fullWidth={!upMd}
                variant="outlined"
                onClick={() => {
                  onClose();
                  setDrawCanvas(false)
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
              // sx={{ mr: 1 }}
              >
                Close
              </Button>
            </Stack>
          </Stack>}
      </Dialog>}

    </FormProvider>
  );
};

export default AccountGeneralSig;
