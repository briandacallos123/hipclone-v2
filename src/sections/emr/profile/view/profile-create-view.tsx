'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useResponsive } from 'src/hooks/use-responsive';
//
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
  updateRow?: any;
  tableDataAllergy?: any;
  tableDataFamilyHistory?: any;
  tableDataMedicalHistory?: any;
  tableDataMedication?: any;
  tableDataSmoking?: any;
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

export default function EmrProfileCreateView({
  refetch,
  open,
  onClose,
  category,
  clientside,
  tableDataAllergy,
  tableDataFamilyHistory,
  tableDataMedicalHistory,
  tableDataMedication,
  tableDataSmoking,
  isLoading,
  setLoading,
  isLoading2,
  setLoading2,
  isLoading3,
  setLoading3,
  isLoading4,
  setLoading4,
  isLoading5,
  setLoading5,
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
          refetch={refetch}
          isLoading4={isLoading4}
          setLoading4={setLoading4}
          onClose={onClose}
          clientside={clientside}
          tableDataMedication={tableDataMedication}
        />
      )}

      {category === 'Medical History' && (
        <ProfileMedicalNewEditForm
          onClose={onClose}
          refetch={refetch}
          isLoading3={isLoading3}
          setLoading3={setLoading3}
          clientside={clientside}
          tableDataMedicalHistory={tableDataMedicalHistory}
        />
      )}

      {category === 'Allergy' && (
        <ProfileAllergyNewEditForm
          onClose={onClose}
          isLoading={isLoading}
          setLoading={setLoading}
          refetch={refetch}
          clientside={clientside}
          tableDataAllergy={tableDataAllergy}
        />
      )}

      {category === 'Family History' && (
        <ProfileFamilyNewEditForm
          onClose={onClose}
          isLoading2={isLoading2}
          setLoading2={setLoading2}
          refetch={refetch}
          clientside={clientside}
          tableDataFamilyHistory={tableDataFamilyHistory}
        />
      )}

      {category === 'Smoking History' && (
        <ProfileSmokingNewEditForm
          onClose={onClose}
          clientside={clientside}
          refetch={refetch}
          isLoading5={isLoading5}
          setLoading5={setLoading5}
          tableDataSmoking={tableDataSmoking}
        />
      )}
    </Dialog>
  );
}
