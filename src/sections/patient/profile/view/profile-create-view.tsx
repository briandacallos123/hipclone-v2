'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
//
import { useResponsive } from 'src/hooks/use-responsive';
import ProfileMedicationNewEditForm from '../profile-medication-new-edit-form';
import ProfileMedicalNewEditForm from '../profile-medical-new-edit-form';
import ProfileAllergyNewEditForm from '../profile-allergy-new-edit-form';
import ProfileFamilyNewEditForm from '../profile-family-new-edit-form';
import ProfileSmokingNewEditForm from '../profile-smoking-new-edit-form';

// ----------------------------------------------------------------------

type LabelCategory =
  | 'Medication'
  | 'Medical History'
  | 'Allergy'
  | 'Family History'
  | 'Smoking History';

type Props = {
  open: boolean;
  category?: LabelCategory;
  onClose: VoidFunction;
  clientside?: any;
  refetch?: any;
  isLoading?: any;
  setLoading?: any;
  isLoading2?: any;
  setLoading2?: any;
  isLoading3?: any;
  setLoading3?: any;
  isLoading4?: any;
  setLoading4?: any;
  isLoading5?: any;
  setLoading5?: any;
};

// ----------------------------------------------------------------------

export default function PatientProfileCreateView({
  isLoading5,
  setLoading5,
  isLoading4,
  setLoading4,
  isLoading3,
  setLoading3,
  isLoading2,
  setLoading2,
  isLoading,
  setLoading,
  open,
  onClose,
  category,
  clientside,
  refetch,
}: Props) {
  const upMd = useResponsive('up', 'md');

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>Add {category} Information</DialogTitle>

      {category === 'Medication' && (
        <ProfileMedicationNewEditForm
          isLoading4={isLoading4}
          setLoading4={setLoading4}
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
        />
      )}

      {category === 'Medical History' && (
        <ProfileMedicalNewEditForm
          isLoading3={isLoading3}
          setLoading3={setLoading3}
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
        />
      )}

      {category === 'Allergy' && (
        <ProfileAllergyNewEditForm
          isLoading={isLoading}
          setLoading={setLoading}
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
        />
      )}

      {category === 'Family History' && (
        <ProfileFamilyNewEditForm
          isLoading2={isLoading2}
          setLoading2={setLoading2}
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
        />
      )}

      {category === 'Smoking History' && (
        <ProfileSmokingNewEditForm
          isLoading5={isLoading5}
          setLoading5={setLoading5}
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
        />
      )}
    </Dialog>
  );
}
