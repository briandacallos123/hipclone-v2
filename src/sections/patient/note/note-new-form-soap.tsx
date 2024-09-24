import { useMemo, useCallback, useState, useEffect } from 'react';
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
import { DeleteNotesSoap, POST_NOTES_SOAP, UpdateNotesSoap } from '@/libs/gqls/notes/notesSoap';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { useParams } from 'src/routes/hook';
// _mock
import { _hospitals } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete } from 'src/components/hook-form';
//
import NoteNewFormSoapSubjective from './note-new-form-soap-subjective';
import NoteNewFormSoapObjective from './note-new-form-soap-objective';
import NoteNewFormSoapAssessment from './note-new-form-soap-assessment';
import NoteNewFormSoapPlan from './note-new-form-soap-plan';
import { useContextData } from '../@view/patient-details-view';
import { useSessionStorage } from '@/hooks/use-sessionStorage';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  refIds: any;
  refetch: any;
  editData:any;
};

export default function NoteNewFormSoap({editData, onClose, refIds, refetch: onRefetch }: Props) {
  // const { enqueueSnackbar } = useSnackbar();
  const { fetchCover, setfetchCover }: any = useContextData();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { getItem } = useSessionStorage();
  const [snackKey, setSnackKey]: any = useState(null);
  const { id } = useParams();
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

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().required('Hospital ID is required'),
    chiefComplaint: Yup.string().required('Chief Complaint is required'),
    history: Yup.string().required('History is required'),

    // hindi requred lahat ng to
    weight: Yup.number().required('weight is required'),
    height: Yup.number().required('height is required'),
    // bodyMass: Yup.number().required('Body Mass is required'),
    // bloodPressureMm: Yup.number().required('Blood Pressure mm is required'),
    // bloodPressureHg: Yup.number().required('Blood Pressure hg  is required'),
    // oxygen: Yup.number().required('oxygen is required'),
    // respiratory: Yup.number().required('respiratory is required'),
    // heartRate: Yup.number().required('Heart Rate is required'),
    // temperature: Yup.number().required('temperature is required'),

    visionLeft: Yup.number().required('Vision (Left) is required'),
    visionRight: Yup.number().required('Vision (Right) is required'),
    pupil: Yup.string().required('Pupil is required'),
    lense: Yup.string().required('Lense is required'),
    hearing: Yup.string().required('Hearing is required'),
    bmi: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    skin: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    heent: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    teeth: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    neck: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    lung: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    heart: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    abdomen: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    guSystem: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    musculoskeletal: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    back: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    neurological: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    psychiatric: Yup.object().shape({
      option: Yup.string(),
      comment: Yup.string(),
    }),
    remarkObjective: Yup.array().of(
      Yup.object().shape({
        message: Yup.string(),
      })
    ),
    diagnosis: Yup.string().required('Diagnosis is required'),
    remarkAssessment: Yup.array().of(
      Yup.object().shape({
        message: Yup.string(),
      })
    ),
    plan: Yup.string().required('Plan is required'),

    remarkPlan: Yup.array().of(
      Yup.object().shape({
        message: Yup.string(),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      hospitalId: editData?.clinic || null,
      // ------ SUBJECTIVE
      chiefComplaint:editData?.complaint ||  '',
      history:editData?.illness ||  '',
      // ------ OBJECTIVE

      // Vital
      weight:editData?. wt ||  null,
      height:editData?.ht ||  null,
      bodyMass:  null,
      bloodPressureMm: editData?.bp1 || null,
      bloodPressureHg:editData?.bp2 ||  null,
      oxygen:editData?.spo2 ||  null,
      respiratory:editData?.rr ||  null,
      heartRate:editData?.hr ||  null,
      temperature: editData?.bt || null,
      // Vision
      visionLeft:editData?.physicalInfo?.vision_r ||  null,
      visionRight:editData?.physicalInfo?.vision_l || null,
      pupil:editData?.physicalInfo?.pupils || '',
      lense: editData?.physicalInfo?.glasses_lenses ||'',
      // Hearing
      hearing:editData?.physicalInfo?.hearing || '',
      // Physical Exam
      bmi: { option: editData?.physicalInfo?.bmi_status || '', comment: editData?.physicalInfo?.bmi_comment ||'' },
      skin: { option: editData?.physicalInfo?.skin_status || '', comment: editData?.physicalInfo?.skin_comment ||'' },
      heent: { option: editData?.physicalInfo?.skin_status || '', comment: editData?.physicalInfo?.skin_comment || '' },
      teeth: { option: editData?.physicalInfo?.teeth_status || '', comment: editData?.physicalInfo?.teeth_comment || '' },
      neck: { option: editData?.physicalInfo?.neck_status || '', comment: editData?.physicalInfo?.neck_comment || '' },
      lung: { option: editData?.physicalInfo?.lungs_status || '', comment: editData?.physicalInfo?.lungs_comment || '' },
      heart: { option: editData?.physicalInfo?.heart_status || '', comment: editData?.physicalInfo?.heart_comment || '' },
      abdomen: { option: editData?.physicalInfo?.abdomen_status || '', comment: editData?.physicalInfo?.abdomen_comment || '' },
      guSystem: { option: editData?.physicalInfo?.gusystem_status || '', comment: editData?.physicalInfo?.gusystem_comment || '' },
      musculoskeletal: { option: editData?.physicalInfo?.musculoskeletal_status || '', comment: editData?.physicalInfo?.musculoskeletal_comment || '' },
      back: { option: editData?.physicalInfo?.backspine_status || '', comment: editData?.physicalInfo?.backspine_comment || '' },
      neurological: { option: editData?.physicalInfo?.neurological_status || '', comment: editData?.physicalInfo?.neurological_comment || '' },
      psychiatric: { option: editData?.physicalInfo?.psychiatric_status || '', comment: editData?.physicalInfo?.psychiatric_comment|| '', },
      // Other
      remarkObjective:editData?.remarks0?.length && editData?.remarks0?.map((item)=>item?.message) || [{ message:"" }],
      // ------ ASSESSMENT
      diagnosis: editData?.diagnosis || '',
      remarkAssessment:editData?.remarks1?.length && editData?.remarks1?.map((item)=>item?.message) || [{ message:"" }],
      // ------ PLAN
      plan: editData?.plan || '',
      prescriptions: [],
      remarkPlan: editData?.remarks2?.length && editData?.remarks2?.map((item)=>item?.message) || [{ message:"" }],
    }),
    []
  );
  // id: '',
  //     genericName: '',
  //     brand: '',
  //     dosage: 0,
  //     form: '',
  //     quantity: 0,
  //     frequency: 0,
  //     duration: 0,

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewNoteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      setValue('hospitalId', Number(data?.clinic?.id));
    }
  }, []);

  // console.log('data Soap:', values);

  const [createSoap] = useMutation(POST_NOTES_SOAP);
  const [updateSoap] = useMutation(UpdateNotesSoap);
 

  
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NoteSoapObjInputType'] = {
        clinic: Number(model.hospitalId),
        patientID: Number(refIds?.S_ID),
        R_TYPE: String(1),

        complaint: String(model.chiefComplaint),
        illness: String(model.history),
        wt: String(model.weight),
        ht: String(model.height),
        bmi: String(model.bodyMass?.toFixed(2)),
        bp1: String(model.bloodPressureMm),
        bp2: String(model.bloodPressureHg),
        spo2: String(model.oxygen),
        rr: String(model.respiratory),
        hr: String(model.heartRate),
        bt: String(model.temperature),

        // phys
        vision_r: String(model.visionLeft),
        vision_l: String(model.visionRight),
        pupils: String(model.pupil),
        glasses_lenses: String(model.lense),
        hearing: String(model.hearing),
        bmi_status: String(model.bmi.option),
        bmi_comment: String(model.bmi.comment),
        skin_status: String(model.skin.option),
        skin_comment: String(model.skin.comment),
        heent_status: String(model.heent.option),
        heent_comment: String(model.heent.comment),
        teeth_status: String(model.teeth.option),
        teeth_comment: String(model.teeth.comment),
        neck_status: String(model.neck.option),
        neck_comment: String(model.neck.comment),
        lungs_status: String(model.lung.option),
        lungs_comment: String(model.lung.comment),
        heart_status: String(model.heart.option),
        heart_comment: String(model.heart.comment),
        abdomen_status: String(model.abdomen.option),
        abdomen_comment: String(model.abdomen.comment),
        gusystem_status: String(model.guSystem.option),
        gusystem_comment: String(model.guSystem.comment),
        musculoskeletal_status: String(model.musculoskeletal.option),
        musculoskeletal_comment: String(model.musculoskeletal.comment),
        backspine_status: String(model.back.option),
        backspine_comment: String(model.back.comment),
        neurological_status: String(model.neurological.option),
        neurological_comment: String(model.neurological.comment),
        psychiatric_status: String(model.psychiatric.option),
        psychiatric_comment: String(model.psychiatric.comment),
        uuid: model.uuid,

        remarks0: model.remarkObjective,

        diagnosis: String(model.diagnosis),
        remarks1: model.remarkAssessment,

        plan: String(model.plan),
        remarks2: model.remarkPlan,
        R_ID:editData?.R_ID && Number(editData?.R_ID),
        phy_id:editData?.physicalInfo?.id && Number(editData?.physicalInfo?.id),
        soap_id:editData?.id && Number(editData?.id),
        // hindi naka array

        prescriptions: model.prescriptions,

        // MEDICINE: String(model.prescriptions),
        // MED_BRAND: String(model.prescriptions),
        // DOSE: String(model.prescriptions),
        // FORM: String(model.prescriptions),
        // QUANTITY: String(model.prescriptions),
        // FREQUENCY: String(model.prescriptions),
        // DURATION: String(model.prescriptions),
      };
     (editData ? updateSoap:createSoap)({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar(editData ? "Update success!":'Create success!');
          // refetch();
          setfetchCover(true);
          reset();
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createSoap, enqueueSnackbar, refIds?.S_ID, reset, snackKey]
  );

  const [myData, setMyData]: any = useState(null);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...myData, uuid: String(id) });
        // setSnackKey(null);
      })();
    }
  }, [snackKey, myData]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesSoap',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        // await handleSubmitValue({
        //   ...data,
        //   uuid: String(id),
        // });

        reset();
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

            <NoteNewFormSoapSubjective />

            <NoteNewFormSoapObjective />

            <NoteNewFormSoapAssessment />

            <NoteNewFormSoapPlan />
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button variant="outlined" onClick={()=>{
          onClose();
          reset()
        }}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {editData ? "Update":"Create"}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
