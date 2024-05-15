import { useMemo, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// prisma
import { POST_NOTES_ABS_EMR } from '@/libs/gqls/notes/notesAbstract';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
// _mock
import { _hospitals } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
//

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  data: any;
  refetch: any;
};

export default function NoteNewFormAbstract({ onClose, data: emrRef, refetch: onRefetch }: Props) {
  // emr

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required, N/A if None'),
    complaint: Yup.string().required('Complaint is required, N/A if None '),
    history: Yup.string().required('History is required, N/A if None '),
    review: Yup.string().required('Review is required, N/A if None '),
    medicalHistory: Yup.string().required('Medical History is required, N/A if None '),
    personalHistory: Yup.string().required('Personal History is required, N/A if None '),
    examination: Yup.string().required('Examination is required, N/A if None '),
    result: Yup.string().required('Result is required, N/A if None '),
    finding: Yup.string().required('Finding is required, N/A if None '),
    diagnosis: Yup.string().required('Diagnosis is required, N/A if None '),
    complication: Yup.string().required('Complication is required, N/A if None '),
    procedure: Yup.string().required('Procedure is required, N/A if None '),
    treatment: Yup.string().required('Treatment is required, N/A if None '),
  });
  const refIdEMR = emrRef?.id;
  const refIdPatient = emrRef?.patientRelation?.S_ID;
  const isLinked = emrRef?.link;

  // console.log('payload@@@@--:1 ', refIdEMR);
  // console.log('payload@@@@--:2 ', refIdPatient);
  // console.log('payload@@@@--:3 ', isLinked);
  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);
  const [clinicData, setclinicData] = useState<any>([]);

  useEffect(() => {
    drClinicFetch().then((result: any) => {
      const { data } = result;
      if (data) {
        const { doctorClinics } = data;
        setclinicData(doctorClinics);
      }
    });
    return () => drClinicFetch();
  }, []);

  const defaultValues = useMemo(
    () => ({
      hospitalId: null,
      complaint: '',
      history: '',
      review: '',
      medicalHistory: '',
      personalHistory: '',
      examination: '',
      result: '',
      finding: '',
      diagnosis: '',
      complication: '',
      procedure: '',
      treatment: '',
    }),
    []
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewNoteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createNoteAbsEMR] = useMutation(POST_NOTES_ABS_EMR);
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NoteAbstInputType'] = {
        isLinked: Number(isLinked),
        clinic: Number(model.hospitalId),
        patientID: Number(refIdPatient),
        emrPatientID: Number(refIdEMR),
        R_TYPE: String(10),
        complaint: String(model.complaint),
        illness: String(model.history),
        symptoms: String(model.review),
        pastmed: String(model.medicalHistory),
        persoc: String(model.personalHistory),
        physical: String(model.examination),
        labdiag: String(model.result),
        findings: String(model.finding),
        finaldiag: String(model.diagnosis),
        complications: String(model.complication),
        procedures: String(model.procedure),
        treatplan: String(model.treatment),
      };
      createNoteAbsEMR({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
          // refetch();
          reset();
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          // console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createNoteAbsEMR, enqueueSnackbar, isLinked, refIdEMR, refIdPatient, reset, snackKey]
  );

  const [myData, setMyData]: any = useState(null);
  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...myData });
        // setSnackKey(null);
      })();
    }
  }, [snackKey, myData]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        onClose();
        // await handleSubmitValue({
        //   ...data,
        // });
        // reset();
        // enqueueSnackbar('Saving!');
        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesAbs',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose, reset]
  );

  return (
    <>
      <DialogContent sx={{ py: 3, bgcolor: 'background.neutral' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFAutocomplete
              name="hospitalId"
              label="Hospital/Clinic"
              options={clinicData.map((hospital: any) => hospital.id)}
              getOptionLabel={(option) =>
                clinicData.find((hospital: any) => hospital.id === option)?.clinic_name
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, clinic_name } = clinicData.filter(
                  (hospital: any) => hospital.id === option
                )[0];

                if (!id) {
                  return null;
                }

                return (
                  <li {...props} key={id}>
                    {clinic_name}
                  </li>
                );
              }}
              sx={{ pt: 1 }}
            />

            <RHFTextField name="complaint" label="Chief Complaint" multiline rows={3} />
            <RHFTextField name="history" label="History of Present Illness" multiline rows={3} />
            <RHFTextField name="review" label="Review of Symptoms" multiline rows={3} />
            <RHFTextField name="medicalHistory" label="Past Medical History" multiline rows={3} />
            <RHFTextField
              name="personalHistory"
              label="Personal/Social History"
              multiline
              rows={3}
            />
            <RHFTextField
              name="examination"
              label="Pertinent Physical Examination"
              multiline
              rows={3}
            />
            <RHFTextField
              name="result"
              label="Complete Laboratory and Diagnostic Results"
              multiline
              rows={3}
            />
            <RHFTextField name="finding" label="Findings" multiline rows={3} />
            <RHFTextField name="diagnosis" label="Final Diagnosis" multiline rows={3} />
            <RHFTextField name="complication" label="Complication" multiline rows={3} />
            <RHFTextField name="procedure" label="Procedures Done" multiline rows={3} />
            <RHFTextField name="treatment" label="Treatment Plan" multiline rows={3} />
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}
